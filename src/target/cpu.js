/*
   cpu: emulates the 6510 microprocessor, including quasi-ops

   References:

   †1: http://www.zimmers.net/anonftp/pub/cbm/documents/chipdata/64doc
   †2: Long discussion on interrupts and branches:
       http://forum.6502.org/viewtopic.php?f=4&t=1634
   †3: http://archive.6502.org/books/mcs6500_family_hardware_manual.pdf
   †4: http://www.zimmers.net/anonftp/pub/cbm/documents/chipdata/6502-NMOS.extra.opcodes

   TODOs:

     - allow bus takeover by VIC (RDY pin)
     - at least make a note of PC when an opcode starts (SYNC pin), for
       debugging
*/

import { $xx, $xxxx, unimplementedWarning } from "../debug";
import { disasm } from "../tools/disasm";
import {
  addToSerializerRegistry,
  functionToReference,
  referenceToFunction,
} from "../tools/serializerSupport";

let state;

// Bound by attach
let c64;
let cpuRead;
let cpuWrite;
let getIrq;
let getNmi;

export function attach(nascentC64) {
  c64 = nascentC64;

  cpuRead  = c64.wires.cpuRead;
  cpuWrite = c64.wires.cpuWrite;
  getIrq   = c64.wires.getIrq;
  getNmi   = c64.wires.getNmi;

  reset();

  c64.cpu = {
    // Control
    tick,
    reset,
    serialize,
    deserialize,
    // Debug
    getState,
    showState,
  };
}

function reset() {
  state = {
    a:  0,  // accumulator
    x:  0,  // X register
    y:  0,  // Y register
    s:  0,  // stack pointer
    pc: 0,  // program counter
    n:  0,  // status register (P) negative flag (bit 7)
    v:  0,  // status register (P) overflow flag (bit 6)
    d:  0,  // status register (P) decimal mode (bit 3)
    i:  1,  // status register (P) interrupt disable (bit 2)
    z:  0,  // status register (P) zero flag (bit 1)
    c:  0,  // status register (P) carry flag (bit 0)

    ir: 0,       // instruction register
    opFn: null,  // operation handler, called from the addressing mode

    lastNmi: false, // was NMI low last time we looked?

    adl: 0,      // temporary low address byte from fetch
    adh: 0,      // temporary high address byte from fetch
    tmp: 0,      // a working variable for read-mod-write insns

    pendingInt: 3,  // (0 = nothing , 1 = IRQ, 2 = NMI, 3 = RESET)

    // Two parallel state machines to achieve the pipelining
    fdTick: null,              // fetch/decode
    amTick: am_interrupt_T2,   // addressing mode
  };
}

function getState() {
  return state;
}

// (TODO: maybe use a Map for these. Would it actually be faster?)
const  opFn_forOpcode = {}; // eg. 0x49 -> logic_eor
const am_T1_forOpcode = {}; // eg. 0x49 -> am_ieomd_imm_T1

[
  // Single-byte operations (implicit)
  [ 0xea, op_NOP_void_void, am_singleByte_imp_T1 ],
  [ 0x18, op_CLC_void_void, am_singleByte_imp_T1 ],
  [ 0xd8, op_CLD_void_void, am_singleByte_imp_T1 ],
  [ 0x58, op_CLI_void_void, am_singleByte_imp_T1 ],
  [ 0xb8, op_CLV_void_void, am_singleByte_imp_T1 ],
  [ 0x38, op_SEC_void_void, am_singleByte_imp_T1 ],
  [ 0xf8, op_SED_void_void, am_singleByte_imp_T1 ],
  [ 0x78, op_SEI_void_void, am_singleByte_imp_T1 ],
  [ 0xaa, op_TAX_void_void, am_singleByte_imp_T1 ],
  [ 0xa8, op_TAY_void_void, am_singleByte_imp_T1 ],
  [ 0x8a, op_TXA_void_void, am_singleByte_imp_T1 ],
  [ 0x98, op_TYA_void_void, am_singleByte_imp_T1 ],
  [ 0xba, op_TSX_void_void, am_singleByte_imp_T1 ],
  [ 0x9a, op_TXS_void_void, am_singleByte_imp_T1 ],
  [ 0xca, op_DEX_void_void, am_singleByte_imp_T1 ],
  [ 0x88, op_DEY_void_void, am_singleByte_imp_T1 ],
  [ 0xe8, op_INX_void_void, am_singleByte_imp_T1 ],
  [ 0xc8, op_INY_void_void, am_singleByte_imp_T1 ],
  [ 0x1a, op_NOP_void_void, am_singleByte_imp_T1 ],   // Quasi-op
  [ 0x3a, op_NOP_void_void, am_singleByte_imp_T1 ],   // Quasi-op
  [ 0x5a, op_NOP_void_void, am_singleByte_imp_T1 ],   // Quasi-op
  [ 0x7a, op_NOP_void_void, am_singleByte_imp_T1 ],   // Quasi-op
  [ 0xda, op_NOP_void_void, am_singleByte_imp_T1 ],   // Quasi-op
  [ 0xfa, op_NOP_void_void, am_singleByte_imp_T1 ],   // Quasi-op

  // Single-byte operations (accumulator)
  [ 0x0a, op_ASL_arg_ret,   am_singleByte_acc_T1 ],
  [ 0x4a, op_LSR_arg_ret,   am_singleByte_acc_T1 ],
  [ 0x2a, op_ROL_arg_ret,   am_singleByte_acc_T1 ],
  [ 0x6a, op_ROR_arg_ret,   am_singleByte_acc_T1 ],

  // Internal execution on memory data (immediate)
  [ 0x29, op_AND_tmp_void,  am_ieomd_imm_T1 ],
  [ 0x49, op_EOR_tmp_void,  am_ieomd_imm_T1 ],
  [ 0x09, op_ORA_tmp_void,  am_ieomd_imm_T1 ],
  [ 0xc9, op_CMP_tmp_void,  am_ieomd_imm_T1 ],
  [ 0xe0, op_CPX_tmp_void,  am_ieomd_imm_T1 ],
  [ 0xc0, op_CPY_tmp_void,  am_ieomd_imm_T1 ],
  [ 0xa9, op_LDA_tmp_void,  am_ieomd_imm_T1 ],
  [ 0xa2, op_LDX_tmp_void,  am_ieomd_imm_T1 ],
  [ 0xa0, op_LDY_tmp_void,  am_ieomd_imm_T1 ],
  [ 0x69, op_ADC_tmp_void,  am_ieomd_imm_T1 ],
  [ 0xe9, op_SBC_tmp_void,  am_ieomd_imm_T1 ],
  [ 0x80, op_NOP_void_void, am_ieomd_imm_T1 ],        // Quasi-op
  [ 0x82, op_NOP_void_void, am_ieomd_imm_T1 ],        // Quasi-op
  [ 0x89, op_NOP_void_void, am_ieomd_imm_T1 ],        // Quasi-op
  [ 0xc2, op_NOP_void_void, am_ieomd_imm_T1 ],        // Quasi-op
  [ 0xe2, op_NOP_void_void, am_ieomd_imm_T1 ],        // Quasi-op
  [ 0xeb, op_SBC_tmp_void,  am_ieomd_imm_T1 ],        // Quasi-op
  [ 0x0b, op_ANC_tmp_void,  am_ieomd_imm_T1 ],        // Quasi-op
  [ 0x2b, op_ANC_tmp_void,  am_ieomd_imm_T1 ],        // Quasi-op
  [ 0x4b, op_ALR_tmp_void,  am_ieomd_imm_T1 ],        // Quasi-op
  [ 0x6b, op_ARR_tmp_void,  am_ieomd_imm_T1 ],        // Quasi-op
  [ 0x8b, op_ANE_tmp_void,  am_ieomd_imm_T1 ],        // Quasi-op
  [ 0xab, op_LXA_tmp_void,  am_ieomd_imm_T1 ],        // Quasi-op
  [ 0xcb, op_SBX_tmp_void,  am_ieomd_imm_T1 ],        // Quasi-op

  // Internal execution on memory data (zero page)
  [ 0x25, op_AND_tmp_void,  am_ieomd_zp_T1 ],
  [ 0x24, op_BIT_tmp_void,  am_ieomd_zp_T1 ],
  [ 0x45, op_EOR_tmp_void,  am_ieomd_zp_T1 ],
  [ 0x05, op_ORA_tmp_void,  am_ieomd_zp_T1 ],
  [ 0xc5, op_CMP_tmp_void,  am_ieomd_zp_T1 ],
  [ 0xe4, op_CPX_tmp_void,  am_ieomd_zp_T1 ],
  [ 0xc4, op_CPY_tmp_void,  am_ieomd_zp_T1 ],
  [ 0xa5, op_LDA_tmp_void,  am_ieomd_zp_T1 ],
  [ 0xa6, op_LDX_tmp_void,  am_ieomd_zp_T1 ],
  [ 0xa4, op_LDY_tmp_void,  am_ieomd_zp_T1 ],
  [ 0x65, op_ADC_tmp_void,  am_ieomd_zp_T1 ],
  [ 0xe5, op_SBC_tmp_void,  am_ieomd_zp_T1 ],
  [ 0x04, op_NOP_void_void, am_ieomd_zp_T1 ],         // Quasi-op
  [ 0x44, op_NOP_void_void, am_ieomd_zp_T1 ],         // Quasi-op
  [ 0x64, op_NOP_void_void, am_ieomd_zp_T1 ],         // Quasi-op
  [ 0xa7, op_LAX_tmp_void,  am_ieomd_zp_T1 ],         // Quasi-op

  // Internal execution on memory data (absolute)
  [ 0x2d, op_AND_tmp_void,  am_ieomd_abs_T1 ],
  [ 0x2c, op_BIT_tmp_void,  am_ieomd_abs_T1 ],
  [ 0x4d, op_EOR_tmp_void,  am_ieomd_abs_T1 ],
  [ 0x0d, op_ORA_tmp_void,  am_ieomd_abs_T1 ],
  [ 0xcd, op_CMP_tmp_void,  am_ieomd_abs_T1 ],
  [ 0xec, op_CPX_tmp_void,  am_ieomd_abs_T1 ],
  [ 0xcc, op_CPY_tmp_void,  am_ieomd_abs_T1 ],
  [ 0xad, op_LDA_tmp_void,  am_ieomd_abs_T1 ],
  [ 0xae, op_LDX_tmp_void,  am_ieomd_abs_T1 ],
  [ 0xac, op_LDY_tmp_void,  am_ieomd_abs_T1 ],
  [ 0x6d, op_ADC_tmp_void,  am_ieomd_abs_T1 ],
  [ 0xed, op_SBC_tmp_void,  am_ieomd_abs_T1 ],
  [ 0xaf, op_LAX_tmp_void,  am_ieomd_abs_T1 ],        // Quasi-op

  // Internal execution on memory data (indirect,X)
  [ 0x21, op_AND_tmp_void,  am_ieomd_inx_T1 ],
  [ 0x41, op_EOR_tmp_void,  am_ieomd_inx_T1 ],
  [ 0x01, op_ORA_tmp_void,  am_ieomd_inx_T1 ],
  [ 0xc1, op_CMP_tmp_void,  am_ieomd_inx_T1 ],
  [ 0xa1, op_LDA_tmp_void,  am_ieomd_inx_T1 ],
  [ 0x61, op_ADC_tmp_void,  am_ieomd_inx_T1 ],
  [ 0xe1, op_SBC_tmp_void,  am_ieomd_inx_T1 ],
  [ 0xa3, op_LAX_tmp_void,  am_ieomd_inx_T1 ],        // Quasi-op

  // Internal execution on memory data (absolute,X)
  [ 0x3d, op_AND_tmp_void,  am_ieomd_abx_T1 ],
  [ 0x5d, op_EOR_tmp_void,  am_ieomd_abx_T1 ],
  [ 0x1d, op_ORA_tmp_void,  am_ieomd_abx_T1 ],
  [ 0xdd, op_CMP_tmp_void,  am_ieomd_abx_T1 ],
  [ 0xbd, op_LDA_tmp_void,  am_ieomd_abx_T1 ],
  [ 0xbc, op_LDY_tmp_void,  am_ieomd_abx_T1 ],
  [ 0x7d, op_ADC_tmp_void,  am_ieomd_abx_T1 ],
  [ 0xfd, op_SBC_tmp_void,  am_ieomd_abx_T1 ],
  [ 0x0c, op_NOP_void_void, am_ieomd_abx_T1 ],        // Quasi-op
  [ 0x1c, op_NOP_void_void, am_ieomd_abx_T1 ],        // Quasi-op
  [ 0x3c, op_NOP_void_void, am_ieomd_abx_T1 ],        // Quasi-op
  [ 0x5c, op_NOP_void_void, am_ieomd_abx_T1 ],        // Quasi-op
  [ 0x7c, op_NOP_void_void, am_ieomd_abx_T1 ],        // Quasi-op
  [ 0xdc, op_NOP_void_void, am_ieomd_abx_T1 ],        // Quasi-op
  [ 0xfc, op_NOP_void_void, am_ieomd_abx_T1 ],        // Quasi-op

  // Internal execution on memory data (absolute,Y)
  [ 0x39, op_AND_tmp_void,  am_ieomd_aby_T1 ],
  [ 0x59, op_EOR_tmp_void,  am_ieomd_aby_T1 ],
  [ 0x19, op_ORA_tmp_void,  am_ieomd_aby_T1 ],
  [ 0xd9, op_CMP_tmp_void,  am_ieomd_aby_T1 ],
  [ 0xb9, op_LDA_tmp_void,  am_ieomd_aby_T1 ],
  [ 0xbe, op_LDX_tmp_void,  am_ieomd_aby_T1 ],
  [ 0x79, op_ADC_tmp_void,  am_ieomd_aby_T1 ],
  [ 0xf9, op_SBC_tmp_void,  am_ieomd_aby_T1 ],
  [ 0xbf, op_LAX_tmp_void,  am_ieomd_aby_T1 ],        // Quasi-op
  [ 0xbb, op_LAS_tmp_void,  am_ieomd_aby_T1 ],        // Quasi-op

  // Internal execution on memory data (zero page,X)
  [ 0x35, op_AND_tmp_void,  am_ieomd_zpx_T1 ],
  [ 0x55, op_EOR_tmp_void,  am_ieomd_zpx_T1 ],
  [ 0x15, op_ORA_tmp_void,  am_ieomd_zpx_T1 ],
  [ 0xd5, op_CMP_tmp_void,  am_ieomd_zpx_T1 ],
  [ 0xb5, op_LDA_tmp_void,  am_ieomd_zpx_T1 ],
  [ 0xb4, op_LDY_tmp_void,  am_ieomd_zpx_T1 ],
  [ 0x75, op_ADC_tmp_void,  am_ieomd_zpx_T1 ],
  [ 0xf5, op_SBC_tmp_void,  am_ieomd_zpx_T1 ],

  // Internal execution on memory data (zero page,Y)
  [ 0xb6, op_LDX_tmp_void,  am_ieomd_zpy_T1 ],
  [ 0xb7, op_LAX_tmp_void,  am_ieomd_zpy_T1 ],        // Quasi-op

  // Internal execution on memory data (indirect,Y)
  [ 0x31, op_AND_tmp_void,  am_ieomd_iny_T1 ],
  [ 0x51, op_EOR_tmp_void,  am_ieomd_iny_T1 ],
  [ 0x11, op_ORA_tmp_void,  am_ieomd_iny_T1 ],
  [ 0xd1, op_CMP_tmp_void,  am_ieomd_iny_T1 ],
  [ 0xb1, op_LDA_tmp_void,  am_ieomd_iny_T1 ],
  [ 0x71, op_ADC_tmp_void,  am_ieomd_iny_T1 ],
  [ 0xf1, op_SBC_tmp_void,  am_ieomd_iny_T1 ],
  [ 0xb3, op_LAX_tmp_void,  am_ieomd_iny_T1 ],        // Quasi-op

  // Store operations (zero page)
  [ 0x85, op_STA_void_ret,  am_store_zp_T1 ],
  [ 0x86, op_STX_void_ret,  am_store_zp_T1 ],
  [ 0x84, op_STY_void_ret,  am_store_zp_T1 ],
  [ 0x87, op_AXS_void_ret,  am_store_zp_T1 ],         // Quasi-op

  // Store operations (absolute)
  [ 0x8d, op_STA_void_ret,  am_store_abs_T1 ],
  [ 0x8e, op_STX_void_ret,  am_store_abs_T1 ],
  [ 0x8c, op_STY_void_ret,  am_store_abs_T1 ],
  [ 0x8f, op_AXS_void_ret,  am_store_abs_T1 ],        // Quasi-op

  // Store operations (indirect,X)
  [ 0x81, op_STA_void_ret,  am_store_inx_T1 ],
  [ 0x83, op_AXS_void_ret,  am_store_inx_T1 ],        // Quasi-op

  // Store operations (absolute,X)
  [ 0x9d, op_STA_void_ret,  am_store_abx_T1 ],
  [ 0x9c, op_SHY_void_ret,  am_store_abx_T1 ],        // Quasi-op

  // Store operations (absolute,Y)
  [ 0x99, op_STA_void_ret,  am_store_aby_T1 ],
  [ 0x9f, op_SHA_void_ret,  am_store_aby_T1 ],        // Quasi-op
  [ 0x9b, op_SHS_void_ret,  am_store_aby_T1 ],        // Quasi-op
  [ 0x9e, op_SHX_void_ret,  am_store_aby_T1 ],        // Quasi-op

  // Store operations (zero page,X)
  [ 0x95, op_STA_void_ret,  am_store_zpx_T1 ],
  [ 0x94, op_STY_void_ret,  am_store_zpx_T1 ],

  // Store operations (zero page,Y)
  [ 0x96, op_STX_void_ret,  am_store_zpy_T1 ],
  [ 0x97, op_AXS_void_ret,  am_store_zpy_T1 ],        // Quasi-op

  // Store operations (indirect,Y)
  [ 0x91, op_STA_void_ret,  am_store_iny_T1 ],
  [ 0x93, op_SHA_void_ret,  am_store_iny_T1 ],        // Quasi-op

  // Read-modify-write operations (zero page)
  [ 0x06, op_ASL_arg_ret,   am_rmw_zp_T1 ],
  [ 0x46, op_LSR_arg_ret,   am_rmw_zp_T1 ],
  [ 0x26, op_ROL_arg_ret,   am_rmw_zp_T1 ],
  [ 0x66, op_ROR_arg_ret,   am_rmw_zp_T1 ],
  [ 0xe6, op_INC_arg_ret,   am_rmw_zp_T1 ],
  [ 0xc6, op_DEC_arg_ret,   am_rmw_zp_T1 ],
  [ 0x47, op_LSE_arg_ret,   am_rmw_zp_T1 ],           // Quasi-op
  [ 0xc7, op_DCM_arg_ret,   am_rmw_zp_T1 ],           // Quasi-op
  [ 0x07, op_ASO_arg_ret,   am_rmw_zp_T1 ],           // Quasi-op
  [ 0x27, op_RLA_arg_ret,   am_rmw_zp_T1 ],           // Quasi-op
  [ 0x67, op_RRA_arg_ret,   am_rmw_zp_T1 ],           // Quasi-op
  [ 0xe7, op_INS_arg_ret,   am_rmw_zp_T1 ],           // Quasi-op

  // Read-modify-write operations (absolute)
  [ 0x0e, op_ASL_arg_ret,   am_rmw_abs_T1 ],
  [ 0x2e, op_ROL_arg_ret,   am_rmw_abs_T1 ],
  [ 0x6e, op_ROR_arg_ret,   am_rmw_abs_T1 ],
  [ 0x4e, op_LSR_arg_ret,   am_rmw_abs_T1 ],
  [ 0xee, op_INC_arg_ret,   am_rmw_abs_T1 ],
  [ 0xce, op_DEC_arg_ret,   am_rmw_abs_T1 ],
  [ 0x4f, op_LSE_arg_ret,   am_rmw_abs_T1 ],          // Quasi-op
  [ 0xcf, op_DCM_arg_ret,   am_rmw_abs_T1 ],          // Quasi-op
  [ 0x0f, op_ASO_arg_ret,   am_rmw_abs_T1 ],          // Quasi-op
  [ 0x2f, op_RLA_arg_ret,   am_rmw_abs_T1 ],          // Quasi-op
  [ 0x6f, op_RRA_arg_ret,   am_rmw_abs_T1 ],          // Quasi-op
  [ 0xef, op_INS_arg_ret,   am_rmw_abs_T1 ],          // Quasi-op

  // Read-modify-write operations (zero page,X)
  [ 0x16, op_ASL_arg_ret,   am_rmw_zpx_T1 ],
  [ 0x36, op_ROL_arg_ret,   am_rmw_zpx_T1 ],
  [ 0x76, op_ROR_arg_ret,   am_rmw_zpx_T1 ],
  [ 0x56, op_LSR_arg_ret,   am_rmw_zpx_T1 ],
  [ 0xf6, op_INC_arg_ret,   am_rmw_zpx_T1 ],
  [ 0xd6, op_DEC_arg_ret,   am_rmw_zpx_T1 ],
  [ 0x14, op_NOP_arg_ret,   am_rmw_zpx_T1 ],          // Quasi-op
  [ 0x34, op_NOP_arg_ret,   am_rmw_zpx_T1 ],          // Quasi-op
  [ 0x54, op_NOP_arg_ret,   am_rmw_zpx_T1 ],          // Quasi-op
  [ 0x74, op_NOP_arg_ret,   am_rmw_zpx_T1 ],          // Quasi-op
  [ 0xd4, op_NOP_arg_ret,   am_rmw_zpx_T1 ],          // Quasi-op
  [ 0xf4, op_NOP_arg_ret,   am_rmw_zpx_T1 ],          // Quasi-op
  [ 0x57, op_LSE_arg_ret,   am_rmw_zpx_T1 ],          // Quasi-op
  [ 0xd7, op_DCM_arg_ret,   am_rmw_zpx_T1 ],          // Quasi-op
  [ 0x17, op_ASO_arg_ret,   am_rmw_zpx_T1 ],          // Quasi-op
  [ 0x37, op_RLA_arg_ret,   am_rmw_zpx_T1 ],          // Quasi-op
  [ 0x77, op_RRA_arg_ret,   am_rmw_zpx_T1 ],          // Quasi-op
  [ 0xf7, op_INS_arg_ret,   am_rmw_zpx_T1 ],          // Quasi-op

  // Read-modify-write operations (absolute,X)
  [ 0x1e, op_ASL_arg_ret,   am_rmw_abx_T1 ],
  [ 0x3e, op_ROL_arg_ret,   am_rmw_abx_T1 ],
  [ 0x7e, op_ROR_arg_ret,   am_rmw_abx_T1 ],
  [ 0x5e, op_LSR_arg_ret,   am_rmw_abx_T1 ],
  [ 0xfe, op_INC_arg_ret,   am_rmw_abx_T1 ],
  [ 0xde, op_DEC_arg_ret,   am_rmw_abx_T1 ],
  [ 0x5f, op_LSE_arg_ret,   am_rmw_abx_T1 ],          // Quasi-op
  [ 0xdf, op_DCM_arg_ret,   am_rmw_abx_T1 ],          // Quasi-op
  [ 0x1f, op_ASO_arg_ret,   am_rmw_abx_T1 ],          // Quasi-op
  [ 0x3f, op_RLA_arg_ret,   am_rmw_abx_T1 ],          // Quasi-op
  [ 0x3f, op_RLA_arg_ret,   am_rmw_abx_T1 ],          // Quasi-op
  [ 0x7f, op_RRA_arg_ret,   am_rmw_abx_T1 ],          // Quasi-op
  [ 0xff, op_INS_arg_ret,   am_rmw_abx_T1 ],          // Quasi-op

  // Read-modify-write operations (absolute,Y)
  [ 0x5b, op_LSE_arg_ret,   am_rmw_aby_T1 ],          // Quasi-op
  [ 0xdb, op_DCM_arg_ret,   am_rmw_aby_T1 ],          // Quasi-op
  [ 0x1b, op_ASO_arg_ret,   am_rmw_aby_T1 ],          // Quasi-op
  [ 0x3b, op_RLA_arg_ret,   am_rmw_aby_T1 ],          // Quasi-op
  [ 0x7b, op_RRA_arg_ret,   am_rmw_aby_T1 ],          // Quasi-op
  [ 0xfb, op_INS_arg_ret,   am_rmw_aby_T1 ],          // Quasi-op

  // Read-modify-write operations (indirect,X)
  [ 0x43, op_LSE_arg_ret,   am_rmw_inx_T1 ],          // Quasi-op
  [ 0xc3, op_DCM_arg_ret,   am_rmw_inx_T1 ],          // Quasi-op
  [ 0x03, op_ASO_arg_ret,   am_rmw_inx_T1 ],          // Quasi-op
  [ 0x23, op_RLA_arg_ret,   am_rmw_inx_T1 ],          // Quasi-op
  [ 0x63, op_RRA_arg_ret,   am_rmw_inx_T1 ],          // Quasi-op
  [ 0xe3, op_INS_arg_ret,   am_rmw_inx_T1 ],          // Quasi-op

  // Read-modify-write operations (indirect,Y)
  [ 0x53, op_LSE_arg_ret,   am_rmw_iny_T1 ],          // Quasi-op
  [ 0xd3, op_DCM_arg_ret,   am_rmw_iny_T1 ],          // Quasi-op
  [ 0x13, op_ASO_arg_ret,   am_rmw_iny_T1 ],          // Quasi-op
  [ 0x33, op_RLA_arg_ret,   am_rmw_iny_T1 ],          // Quasi-op
  [ 0x73, op_RRA_arg_ret,   am_rmw_iny_T1 ],          // Quasi-op
  [ 0xf3, op_INS_arg_ret,   am_rmw_iny_T1 ],          // Quasi-op

  // Miscellaneous operations (push)
  [ 0x48, op_PHA_void_ret,  am_push_T1 ],
  [ 0x08, op_PHP_void_ret,  am_push_T1 ],

  // Miscellaneous operations (pull)
  [ 0x68, op_PLA_arg_void,  am_pull_T1 ],
  [ 0x28, op_PLP_arg_void,  am_pull_T1 ],

  // Miscellaneous operations (jump to subroutine)
  [ 0x20, op_JSR_void_void, am_jsr_T1 ],

  // Miscellaneous operations (break)
  [ 0x00, op_BRK_void_void, am_interrupt_T1 ],

  // Miscellaneous operations (return from interrupt)
  [ 0x40, op_RTI_void_void, am_rti_T1 ],

  // Jump operation (absolute)
  [ 0x4c, op_JMP_void_void, am_jmp_abs_T1 ],

  // Jump operation (indirect)
  [ 0x6c, op_JMP_void_void, am_jmp_ind_T1 ],

  // Miscellaneous operations (return from subroutine)
  [ 0x60, op_RTS_void_void, am_rts_T1 ],

  // Miscellaneous operations (branch)
  [ 0x90, op_BCC_void_ret,  am_rel_T1 ],
  [ 0xb0, op_BCS_void_ret,  am_rel_T1 ],
  [ 0xf0, op_BEQ_void_ret,  am_rel_T1 ],
  [ 0x30, op_BMI_void_ret,  am_rel_T1 ],
  [ 0xd0, op_BNE_void_ret,  am_rel_T1 ],
  [ 0x10, op_BPL_void_ret,  am_rel_T1 ],
  [ 0x50, op_BVC_void_ret,  am_rel_T1 ],
  [ 0x70, op_BVS_void_ret,  am_rel_T1 ],

  // Irrecoverable failure
  [ 0x02, op_HLT_void_void, am_halt_T1 ],
  [ 0x12, op_HLT_void_void, am_halt_T1 ],
  [ 0x22, op_HLT_void_void, am_halt_T1 ],
  [ 0x32, op_HLT_void_void, am_halt_T1 ],
  [ 0x42, op_HLT_void_void, am_halt_T1 ],
  [ 0x52, op_HLT_void_void, am_halt_T1 ],
  [ 0x62, op_HLT_void_void, am_halt_T1 ],
  [ 0x72, op_HLT_void_void, am_halt_T1 ],
  [ 0x92, op_HLT_void_void, am_halt_T1 ],
  [ 0xb2, op_HLT_void_void, am_halt_T1 ],
  [ 0xd2, op_HLT_void_void, am_halt_T1 ],
  [ 0xf2, op_HLT_void_void, am_halt_T1 ],

].forEach(
  ([ opcode, opFn, t1 ]) => {
    am_T1_forOpcode[opcode] = t1;
     opFn_forOpcode[opcode] = opFn;
  }
);

function fd_fetch_T0() {

  // Bearing in mind that this cycle usually runs concurrently with an am_ 
  // cycle, we have to be very careful which registers we use here.

  state.ir = cpuRead(state.pc);

  // TODO: I gather this doesn't happen here, but on the last Tn of any mode
  pollForInterrupts();

  // Latch the instruction register from zero (BRK) if there are interrupts
  if (state.pendingInt) {
    state.ir = 0;
  }
  else {
    state.pc = ++state.pc & 0xffff;
  }

  state.fdTick = fd_decode_T1;
}

const visitedPcs = new Set();

function fd_decode_T1() {

  // {
  //   state.pc--;
  //   if (!visitedPcs.has(state.pc)) {
  //     visitedPcs.add(state.pc);
  //     showState();
  //   }
  //   state.pc++;
  // }

  const  opFn =  opFn_forOpcode[state.ir];
  const am_T1 = am_T1_forOpcode[state.ir];

  state.tmp = cpuRead(state.pc);

  // Now run the T1 stage for the addressing mode sequence. Usually the
  // CPU tick function would call this at the start of the cycle, but having
  // decoded the opcode, there's still a small bit of time left in this cycle,
  // and the CPU seems to use it to increment the PC if the sequence calls for
  // it. The T1 handler can assign the next amTick tick handler function, as it
  // would for any other stage, but it *must* reassign fdTick, otherwise the
  // CPU will be decoding instructions every cycle.

  state.opFn = opFn;
  am_T1();
}


// ----------------------------------------------------------------------------
// Single byte instructions (implicit)
// (†3: A. 1)

function am_singleByte_imp_T1() {
  state.fdTick = fd_fetch_T0;
  state.amTick = am_singleByte_imp_T2;
}

function am_singleByte_imp_T2() {
  state.opFn();
  state.amTick = null;
}


// ----------------------------------------------------------------------------
// Single byte instructions (accumulator)
// (†3: A. 1)

function am_singleByte_acc_T1() {
  state.fdTick = fd_fetch_T0;
  state.amTick = am_singleByte_acc_T2;
}

function am_singleByte_acc_T2() {
  // The read-modify-write opFn's take a parameter and return a value
  state.a = state.opFn(state.a);
  state.amTick = null;
}


// ----------------------------------------------------------------------------
// Internal execution on memory data: immediate addressing
// (†3: A. 2.1)

function am_ieomd_imm_T1() {
  state.pc     = ++state.pc & 0xffff;
  state.fdTick = fd_fetch_T0;
  state.amTick = am_ieomd_imm_T2;
}

function am_ieomd_imm_T2() {
  state.opFn();
  state.amTick = null;
}


// ----------------------------------------------------------------------------
// Internal execution on memory data: zero page addressing
// (†3: A. 2.2)

function am_ieomd_zp_T1() {
  state.pc     = ++state.pc & 0xffff;
  state.amTick = am_ieomd_zp_T2;
  state.fdTick = null;
}

function am_ieomd_zp_T2() {
  // Decode phase left the operand (zero page address) in state.tmp.
  // opFn expects its operand to be in state.tmp.
  state.tmp    = cpuRead(state.tmp);
  state.amTick = am_ieomd_zp_T3;
  state.fdTick = fd_fetch_T0;
}

function am_ieomd_zp_T3() {
  state.opFn();
  state.amTick = null;
}


// ----------------------------------------------------------------------------
// Internal execution on memory data: absolute addressing
// (†3: A. 2.3)

function am_ieomd_abs_T1() {
  state.pc     = ++state.pc & 0xffff;
  state.amTick = am_ieomd_abs_T2;
  state.fdTick = null;
}

function am_ieomd_abs_T2() {
  // Decode phase left the operand (ADL) in state.tmp.
  // opFn expects its operand to be in state.tmp.
  state.adl    = state.tmp;
  state.adh    = cpuRead(state.pc);
  state.pc     = ++state.pc & 0xffff;
  state.amTick = am_ieomd_abs_T3;
}

function am_ieomd_abs_T3() {
  state.tmp    = cpuRead((state.adh << 8) | state.adl);
  state.amTick = am_ieomd_abs_T4;
}

function am_ieomd_abs_T4() {
  state.opFn();
  state.amTick = null;
  state.fdTick = fd_fetch_T0;
}


// ----------------------------------------------------------------------------
// Internal execution on memory data: indirect,X addressing
// (†3: A. 2.4)

function am_ieomd_inx_T1() {
  state.pc     = ++state.pc & 0xffff;
  state.amTick = am_ieomd_inx_T2;
  state.fdTick = null;
}

function am_ieomd_inx_T2() {
  // Decode phase left the operand (zero page address) in state.tmp.
  // opFn expects its operand to be in state.tmp.
  cpuRead(state.tmp);
  state.tmp    = (state.tmp + state.x) & 0xff;
  state.amTick = am_ieomd_inx_T3;
}

function am_ieomd_inx_T3() {
  state.adl    = cpuRead(state.tmp);
  state.tmp    = ++state.tmp & 0xff;
  state.amTick = am_ieomd_inx_T4;
}

function am_ieomd_inx_T4() {
  state.adh    = cpuRead(state.tmp);
  state.amTick = am_ieomd_inx_T5;
}

function am_ieomd_inx_T5() {
  state.tmp    = cpuRead((state.adh << 8) | state.adl);
  state.amTick = am_ieomd_inx_T6;
  state.fdTick = fd_fetch_T0;
}

function am_ieomd_inx_T6() {
  state.opFn();
  state.amTick = null;
}


// ----------------------------------------------------------------------------
// Internal execution on memory data: absolute,X / absolute,Y addressing
// (†3: A. 2.5)

// --------------------------------------------------------
// Absolute,X only

function am_ieomd_abx_T1() {
  state.pc     = ++state.pc & 0xffff;
  state.amTick = am_ieomd_abx_T2;
  state.fdTick = null;
}

function am_ieomd_abx_T2() {
  // Decode phase left the base address low byte in state.tmp.
  // opFn expects its operand to be in state.tmp.
  state.adh    = cpuRead(state.pc);
  state.pc     = ++state.pc & 0xffff;
  state.adl    = (state.tmp + state.x);  // 9 bits hereafter
  state.amTick = am_ieomd_abxy_T3;       // flow into common code
}

// --------------------------------------------------------
// Absolute,Y only

function am_ieomd_aby_T1() {
  state.pc     = ++state.pc & 0xffff;
  state.amTick = am_ieomd_aby_T2;
  state.fdTick = null;
}

function am_ieomd_aby_T2() {
  // Decode phase left the base address low byte in state.tmp.
  // opFn expects its operand to be in state.tmp.
  state.adh    = cpuRead(state.pc);
  state.pc     = ++state.pc & 0xffff;
  state.adl    = (state.tmp + state.y);  // the one difference from am_ieomd_abx_T2
  state.amTick = am_ieomd_abxy_T3;       // flow into common code
}

// --------------------------------------------------------
// Common cycles for both absolute,X and absolute,Y

function am_ieomd_abxy_T3() {
  // Read from the potentially broken address
  state.tmp = cpuRead((state.adh << 8) | (state.adl & 0xff));

  if (state.adl < 0x100) {
    // No address fixup needed; advance to op and next instruction
    state.fdTick = fd_fetch_T0;
    state.amTick = am_ieomd_abxy_T5;
  }

  else {
    // Fix address and, next cycle, refetch
    state.adh    = ++state.adh & 0xff;
    state.adl   &= 0xff;
    state.amTick = am_ieomd_abxy_T4;
  }
}

function am_ieomd_abxy_T4() {
  state.tmp    = cpuRead((state.adh << 8) | state.adl);
  state.fdTick = fd_fetch_T0;
  state.amTick = am_ieomd_abxy_T5;
}

function am_ieomd_abxy_T5() {
  state.opFn();
  state.amTick = null;
}


// ----------------------------------------------------------------------------
// Internal execution on memory data: zero page,X / zero page,Y addressing
// (†3: A. 2.6)

// --------------------------------------------------------
// Zero page,X only

function am_ieomd_zpx_T1() {
  state.pc     = ++state.pc & 0xffff;
  state.amTick = am_ieomd_zpx_T2;
  state.fdTick = null;
}

function am_ieomd_zpx_T2() {
  // Decode phase left the operand (zero page address) in state.tmp.
  // opFn expects its operand to be in state.tmp.
  cpuRead(state.tmp);
  state.adl    = (state.tmp + state.x) & 0xff;
  state.amTick = am_ieomd_zpxy_T3;
}

// --------------------------------------------------------
// Zero page,Y only

function am_ieomd_zpy_T1() {
  state.pc     = ++state.pc & 0xffff;
  state.amTick = am_ieomd_zpy_T2;
  state.fdTick = null;
}

function am_ieomd_zpy_T2() {
  // Decode phase left the operand (zero page address) in state.tmp.
  // opFn expects its operand to be in state.tmp.
  cpuRead(state.tmp);
  state.adl    = (state.tmp + state.y) & 0xff;
  state.amTick = am_ieomd_zpxy_T3;
}

// --------------------------------------------------------
// Common cycles for both zero page,X and zero page,Y

function am_ieomd_zpxy_T3() {
  state.tmp    = cpuRead(state.adl);
  state.fdTick = fd_fetch_T0;
  state.amTick = am_ieomd_zpxy_T4;
}

function am_ieomd_zpxy_T4() {
  state.opFn();
  state.amTick = null;
}


// ----------------------------------------------------------------------------
// Internal execution on memory data: indirect,Y addressing
// (†3: A. 2.7)

function am_ieomd_iny_T1() {
  state.pc     = ++state.pc & 0xffff;
  state.amTick = am_ieomd_iny_T2;
  state.fdTick = null;
}

function am_ieomd_iny_T2() {
  // Decode phase left the operand (zero page address) in state.tmp.
  // opFn expects its operand to be in state.tmp.
  state.adl    = cpuRead(state.tmp);
  state.tmp    = ++state.tmp & 0xff;
  state.amTick = am_ieomd_iny_T3;
}

function am_ieomd_iny_T3() {
  state.adh    = cpuRead(state.tmp);
  state.adl    = state.adl + state.y;  // 9 bits hereafter
  state.amTick = am_ieomd_iny_T4;
}

function am_ieomd_iny_T4() {
  state.tmp = cpuRead((state.adh << 8) | (state.adl & 0xff));

  if (state.adl > 0xff) {
    // Address needs fixing
    state.adh    = ++state.adh & 0xff;
    state.adl    = state.adl & 0xff;   // 8 bits hereafter
    state.amTick = am_ieomd_iny_T5;
  }
  else {
    // Address didn't need fixing. Skip to last stage and fetch next instruction.
    state.amTick = am_ieomd_iny_T6;
    state.fdTick = fd_fetch_T0;
  }
}

function am_ieomd_iny_T5() {
  state.tmp    = cpuRead((state.adh << 8) | state.adl);
  state.amTick = am_ieomd_iny_T6;
  state.fdTick = fd_fetch_T0;
}

function am_ieomd_iny_T6() {
  state.opFn();
  state.amTick = null;
}


// ----------------------------------------------------------------------------
// Store operations: zero page addressing
// (†3: A. 3.1)

function am_store_zp_T1() {
  state.pc     = ++state.pc & 0xffff;
  state.amTick = am_store_zp_T2;
  state.fdTick = null;
}

function am_store_zp_T2() {
  // Decode phase left the operand (zero page address) in state.tmp.
  const adl = state.tmp;

  cpuWrite(adl, state.opFn());

  state.amTick = null;
  state.fdTick = fd_fetch_T0;
}


// ----------------------------------------------------------------------------
// Store operations: absolute addressing
// (†3: A. 3.2)

function am_store_abs_T1() {
  state.pc     = ++state.pc & 0xffff;
  state.amTick = am_store_abs_T2;
  state.fdTick = null;
}

function am_store_abs_T2() {
  // Decode phase left the address low-byte in state.tmp.
  state.adl = state.tmp;
  state.adh = cpuRead(state.pc);
  state.pc  = ++state.pc & 0xffff;

  state.amTick = am_store_abs_T3;
}

function am_store_abs_T3() {
  cpuWrite((state.adh << 8) | state.adl, state.opFn());

  state.amTick = null;
  state.fdTick = fd_fetch_T0;
}


// ----------------------------------------------------------------------------
// Store operations: indirect,X addressing
// (†3: A. 3.3)

function am_store_inx_T1() {
  state.pc     = ++state.pc & 0xffff;
  state.amTick = am_store_inx_T2;
  state.fdTick = null;
}

function am_store_inx_T2() {
  // Decode phase left the zero page address in state.tmp.
  cpuRead(state.tmp);
  
  state.tmp    = (state.tmp + state.x) & 0xff;
  state.amTick = am_store_inx_T3;
}

function am_store_inx_T3() {
  state.adl    = cpuRead(state.tmp);
  state.tmp    = ++state.tmp & 0xff;
  state.amTick = am_store_inx_T4;
}

function am_store_inx_T4() {
  state.adh    = cpuRead(state.tmp);
  state.amTick = am_store_inx_T5;
}

function am_store_inx_T5() {
  cpuWrite((state.adh << 8) | state.adl, state.opFn());

  state.amTick = null;
  state.fdTick = fd_fetch_T0;
}


// ----------------------------------------------------------------------------
// Store operations: absolute,X / absolute,Y addressing
// (†3: A. 3.4)

// --------------------------------------------------------
// Absolute,X only

function am_store_abx_T1() {
  state.pc     = ++state.pc & 0xffff;
  state.amTick = am_store_abx_T2;
  state.fdTick = null;
}

function am_store_abx_T2() {
  // Decode phase left the base address low byte in state.tmp.
  state.adh    = cpuRead(state.pc);
  state.pc     = ++state.pc & 0xffff;
  state.adl    = (state.tmp + state.x);  // 9 bits hereafter
  state.amTick = am_store_abxy_T3;     // flow into common code
}

// --------------------------------------------------------
// Absolute,Y only

function am_store_aby_T1() {
  state.pc     = ++state.pc & 0xffff;
  state.amTick = am_store_aby_T2;
  state.fdTick = null;
}

function am_store_aby_T2() {
  // Decode phase left the base address low byte in state.tmp.
  // opFn expects its operand to be in state.tmp.
  state.adh    = cpuRead(state.pc);
  state.pc     = ++state.pc & 0xffff;
  state.adl    = (state.tmp + state.y);  // the one difference from am_store_abx_T2
  state.amTick = am_store_abxy_T3;       // flow into common code
}

// --------------------------------------------------------
// Common cycles for both absolute,X and absolute,Y

function am_store_abxy_T3() {
  // Dummy read from the potentially broken address
  state.tmp = cpuRead((state.adh << 8) | (state.adl & 0xff));

  if (state.adl > 0xff) {
    // Fix up address
    state.adh    = ++state.adh & 0xff;
    state.adl   &= 0xff;
  }

  // state.adl is 8 bits hereafter
  state.amTick = am_store_abxy_T4;
}

function am_store_abxy_T4() {
  cpuWrite((state.adh << 8) | state.adl, state.opFn());
  state.fdTick = fd_fetch_T0;
  state.amTick = null;
}


// ----------------------------------------------------------------------------
// Store operations: zero page,X / zero page,Y addressing
// (†3: A. 3.5)

// --------------------------------------------------------
// Zero page,X only

function am_store_zpx_T1() {
  state.pc     = ++state.pc & 0xffff;
  state.amTick = am_store_zpx_T2;
  state.fdTick = null;
}

function am_store_zpx_T2() {
  // Decode phase left the operand (zero page address) in state.tmp.
  cpuRead(state.tmp);
  state.adl    = (state.tmp + state.x) & 0xff;
  state.amTick = am_store_zpxy_T3;
}

// --------------------------------------------------------
// Zero page,Y only

function am_store_zpy_T1() {
  state.pc     = ++state.pc & 0xffff;
  state.amTick = am_store_zpy_T2;
  state.fdTick = null;
}

function am_store_zpy_T2() {
  // Decode phase left the operand (zero page address) in state.tmp.
  cpuRead(state.tmp);
  state.adl    = (state.tmp + state.y) & 0xff;
  state.amTick = am_store_zpxy_T3;
}

// --------------------------------------------------------
// Common cycles for both zero page,X and zero page,Y

function am_store_zpxy_T3() {
  cpuWrite(state.adl, state.opFn());

  state.fdTick = fd_fetch_T0;
  state.amTick = null;
}


// ----------------------------------------------------------------------------
// Store operations: indirect,Y addressing
// (†3: A. 3.6)

function am_store_iny_T1() {
  state.pc     = ++state.pc & 0xffff;
  state.amTick = am_store_iny_T2;
  state.fdTick = null;
}

function am_store_iny_T2() {
  // Decode phase left the operand (zero page address) in state.tmp.
  state.adl    = cpuRead(state.tmp);
  state.tmp    = ++state.tmp & 0xff;
  state.amTick = am_store_iny_T3;
}

function am_store_iny_T3() {
  state.adh    = cpuRead(state.tmp);
  state.adl    = state.adl + state.y;  // 9 bits hereafter
  state.amTick = am_store_iny_T4;
}

function am_store_iny_T4() {
  state.tmp    = cpuRead((state.adh << 8) | (state.adl & 0xff));

  if (state.adl > 0xff) {
    // Address needs fixing
    state.adh    = ++state.adh & 0xff;
    state.adl    = state.adl & 0xff;
  }

  // state.adl is 8 bits hereafter
  state.amTick = am_store_iny_T5;
}

function am_store_iny_T5() {
  cpuWrite((state.adh << 8) | state.adl, state.opFn());
  state.amTick = null;
  state.fdTick = fd_fetch_T0;
}


// ----------------------------------------------------------------------------
// Read-modify-write operations: zero page addressing
// (†3: A. 4.1)

function am_rmw_zp_T1() {
  state.pc     = ++state.pc & 0xffff;
  state.amTick = am_rmw_zp_T2;
  state.fdTick = null;
}

function am_rmw_zp_T2() {
  // Decode phase left the operand (zero page address) in state.tmp.
  // opFn takes an argument and returns a value.
  state.adl    = state.tmp;
  state.tmp    = cpuRead(state.adl);
  state.amTick = am_rmw_zp_T3;
}

function am_rmw_zp_T3() {
  // Dummy write of the fetched data back to itself
  cpuWrite(state.adl, state.tmp);

  state.tmp = state.opFn(state.tmp);
  state.amTick = am_rmw_zp_T4;
}

function am_rmw_zp_T4() {
  // Actual write of the processed data
  cpuWrite(state.adl, state.tmp);

  state.amTick = null;
  state.fdTick = fd_fetch_T0;
}


// ----------------------------------------------------------------------------
// Read-modify-write operations: absolute addressing
// (†3: A. 4.2)

function am_rmw_abs_T1() {
  state.pc     = ++state.pc & 0xffff;
  state.amTick = am_rmw_abs_T2;
  state.fdTick = null;
}

function am_rmw_abs_T2() {
  // Decode phase left the operand (ADL) in state.tmp.
  // opFn takes an argument and returns a value.
  state.adl    = state.tmp;
  state.adh    = cpuRead(state.pc);
  state.pc     = ++state.pc & 0xffff;
  state.amTick = am_rmw_abs_T3;
}

function am_rmw_abs_T3() {
  state.tmp    = cpuRead((state.adh << 8) | state.adl);
  state.amTick = am_rmw_abs_T4;
}

function am_rmw_abs_T4() {
  // Dummy write of the fetched data back to itself
  cpuWrite((state.adh << 8) | state.adl, state.tmp);

  state.tmp    = state.opFn(state.tmp);
  state.amTick = am_rmw_abs_T5;
}

function am_rmw_abs_T5() {
  // Actual write of the processed data
  cpuWrite((state.adh << 8) | state.adl, state.tmp);

  state.amTick = null;
  state.fdTick = fd_fetch_T0;
}


// ----------------------------------------------------------------------------
// Read-modify-write operations: zero page,X addressing
// (†3: A. 4.3)

function am_rmw_zpx_T1() {
  state.pc     = ++state.pc & 0xffff;
  state.amTick = am_rmw_zpx_T2;
  state.fdTick = null;
}

function am_rmw_zpx_T2() {
  // Decode phase left the operand (zero page address) in state.tmp.
  // opFn takes an argument and returns a value.
  cpuRead(state.tmp);
  state.adl    = (state.tmp + state.x) & 0xff;
  state.amTick = am_rmw_zpx_T3;
}

function am_rmw_zpx_T3() {
  state.tmp    = cpuRead(state.adl);
  state.amTick = am_rmw_zpx_T4;
}

function am_rmw_zpx_T4() {
  // Dummy write of the fetched data back to itself
  cpuWrite(state.adl, state.tmp);
  state.tmp    = state.opFn(state.tmp);
  state.amTick = am_rmw_zpx_T5;
}

function am_rmw_zpx_T5() {
  // Actual write of the processed data
  cpuWrite(state.adl, state.tmp);
  state.amTick = null;
  state.fdTick = fd_fetch_T0;
}


// ----------------------------------------------------------------------------
// Read-modify-write operations: absolute,X / absolute,Y addressing
// (†3: A. 4.4)

// --------------------------------------------------------
// Absolute,X only

function am_rmw_abx_T1() {
  state.pc     = ++state.pc & 0xffff;
  state.amTick = am_rmw_abx_T2;
  state.fdTick = null;
}

function am_rmw_abx_T2() {
  // Decode phase left the base address low byte in state.tmp.
  // opFn takes an argument and returns a value.
  state.adh    = cpuRead(state.pc);
  state.pc     = ++state.pc & 0xffff;
  state.adl    = (state.tmp + state.x);  // 9 bits hereafter
  state.amTick = am_rmw_abxy_T3;
}

// --------------------------------------------------------
// Absolute,Y only (used only by quasi-ops)

function am_rmw_aby_T1() {
  state.pc     = ++state.pc & 0xffff;
  state.amTick = am_rmw_aby_T2;
  state.fdTick = null;
}

function am_rmw_aby_T2() {
  // Decode phase left the base address low byte in state.tmp.
  // opFn takes an argument and returns a value.
  state.adh    = cpuRead(state.pc);
  state.pc     = ++state.pc & 0xffff;
  state.adl    = (state.tmp + state.y);  // 9 bits hereafter
  state.amTick = am_rmw_abxy_T3;
}

// --------------------------------------------------------
// Common cycles for both absolute,X and absolute,Y

function am_rmw_abxy_T3() {
  // Dummy read from the potentially broken address
  state.tmp = cpuRead((state.adh << 8) | (state.adl & 0xff));

  if (state.adl > 0xff) {
    // Fix address
    state.adh  = ++state.adh & 0xff;
    state.adl &= 0xff;
  }

  // state.adl is 8 bits hereafter
  state.amTick = am_rmw_abxy_T4;
}

function am_rmw_abxy_T4() {
  state.tmp    = cpuRead((state.adh << 8) | state.adl);
  state.amTick = am_rmw_abxy_T5;
}

function am_rmw_abxy_T5() {
  // Dummy write of the fetched data back to itself
  cpuWrite((state.adh << 8) | state.adl, state.tmp);

  state.tmp    = state.opFn(state.tmp);
  state.amTick = am_rmw_abxy_T6;
}

function am_rmw_abxy_T6() {
  // Actual write of the processed data
  cpuWrite((state.adh << 8) | state.adl, state.tmp);

  state.amTick = null;
  state.fdTick = fd_fetch_T0;
}


// ----------------------------------------------------------------------------
// Read-modify-write operations: indirect,X addressing
// (Not referenced in †3, as only used by quasi-ops. Cycle sequence is thus
// guesswork, informed only by the IEOMD indirect,X sequence (†3: A. 2.4) and
// knowing that the instructions take 8 cycles (†4).)

function am_rmw_inx_T1() {
  state.pc     = ++state.pc & 0xffff;
  state.amTick = am_rmw_inx_T2;
  state.fdTick = null;
}

function am_rmw_inx_T2() {
  // Decode phase left the operand (zero page address) in state.tmp.
  // opFn expects its operand to be in state.tmp.
  cpuRead(state.tmp);
  state.tmp    = (state.tmp + state.x) & 0xff;
  state.amTick = am_rmw_inx_T3;
}

function am_rmw_inx_T3() {
  state.adl    = cpuRead(state.tmp);
  state.tmp    = ++state.tmp & 0xff;
  state.amTick = am_rmw_inx_T4;
}

function am_rmw_inx_T4() {
  state.adh    = cpuRead(state.tmp);
  state.amTick = am_rmw_inx_T5;
}

function am_rmw_inx_T5() {
  state.tmp    = cpuRead((state.adh << 8) | state.adl);
  state.amTick = am_rmw_inx_T6;
}

function am_rmw_inx_T6() {
  // All the other read-modify-write's do a dummy write after reading, while
  // the ALU's calculating, so this seems a safe bet.
  cpuWrite((state.adh << 8) | state.adl, state.tmp);
  state.tmp    = state.opFn(state.tmp);
  state.amTick = am_rmw_inx_T7;
}

function am_rmw_inx_T7() {
  cpuWrite((state.adh << 8) | state.adl, state.tmp);
  state.amTick = null;
  state.fdTick = fd_fetch_T0;
}


// ----------------------------------------------------------------------------
// Read-modify-write operations: indirect,Y addressing
// (Not referenced in †3, as only used by quasi-ops. Cycle sequence is thus
// guesswork, informed only by the IEOMD indirect,Y sequence (†3: A. 2.7) and
// knowing that the instructions take 8 cycles (†4).)

function am_rmw_iny_T1() {
  state.pc     = ++state.pc & 0xffff;
  state.amTick = am_rmw_iny_T2;
  state.fdTick = null;
}

function am_rmw_iny_T2() {
  // Decode phase left the operand (zero page address) in state.tmp.
  // opFn expects its operand to be in state.tmp.
  state.adl    = cpuRead(state.tmp);
  state.tmp    = ++state.tmp & 0xff;
  state.amTick = am_rmw_iny_T3;
}

function am_rmw_iny_T3() {
  state.adh    = cpuRead(state.tmp);
  state.adl    = state.adl + state.y;  // 9 bits hereafter
  state.amTick = am_rmw_iny_T4;
}

function am_rmw_iny_T4() {
  state.tmp    = cpuRead((state.adh << 8) | (state.adl & 0xff));

  if (state.adl > 0xff) {
    // Address needs fixing
    state.adh    = ++state.adh & 0xff;
    state.adl    = state.adl & 0xff;   // 8 bits hereafter
  }

  // state.adl is 8 bits hereafter
  state.amTick = am_rmw_iny_T5;
}

function am_rmw_iny_T5() {
  state.tmp    = cpuRead((state.adh << 8) | state.adl);
  state.amTick = am_rmw_iny_T6;
}

function am_rmw_iny_T6() {
  // All the other read-modify-write's do a dummy write after reading, while
  // the ALU's calculating, so this seems a safe bet.
  cpuWrite((state.adh << 8) | state.adl, state.tmp);
  state.tmp    = state.opFn(state.tmp);
  state.amTick = am_rmw_iny_T7;
}

function am_rmw_iny_T7() {
  cpuWrite((state.adh << 8) | state.adl, state.tmp);
  state.amTick = null;
  state.fdTick = fd_fetch_T0;
}


// ----------------------------------------------------------------------------
// Miscellaneous operations: push operations
// (†3: A. 5.1)

function am_push_T1() {
  state.amTick = am_push_T2;
  state.fdTick = null;
}

function am_push_T2() {
  // opFn returns the thing to be pushed.
  cpuWrite(0x100 + state.s, state.opFn());
  state.s      = --state.s & 0xff;
  state.amTick = null;
  state.fdTick = fd_fetch_T0;
}


// ----------------------------------------------------------------------------
// Miscellaneous operations: pull operations
// (†3: A. 5.2)

function am_pull_T1() {
  state.amTick = am_pull_T2;
  state.fdTick = null;
}

function am_pull_T2() {
  // opFn assigns its argument to the necessary register
  cpuRead(0x100 + state.s);
  state.s      = ++state.s & 0xff;
  state.amTick = am_pull_T3;
}

function am_pull_T3() {
  state.tmp    = cpuRead(0x100 + state.s);
  state.amTick = am_pull_T4;
  state.fdTick = fd_fetch_T0;
}

function am_pull_T4() {
  state.opFn(state.tmp);
  state.amTick = null;
}


// ----------------------------------------------------------------------------
// Miscellaneous operations: jump to subroutine
// (†3: A. 5.3)

function am_jsr_T1() {
  state.pc     = ++state.pc & 0xffff;
  state.amTick = am_jsr_T2;
  state.fdTick = null;
}

function am_jsr_T2() {
  // Decode phase left the subroutine address's low byte in state.tmp.
  // It's not clear to me why this cycle exists. It does nothing useful.
  cpuRead(0x100 + state.s);
  state.amTick = am_jsr_T3;
}

function am_jsr_T3() {
  cpuWrite(0x100 + state.s, state.pc >> 8);
  state.s      = --state.s & 0xff;
  state.amTick = am_jsr_T4;
}

function am_jsr_T4() {
  cpuWrite(0x100 + state.s, state.pc & 0xff);
  state.s      = --state.s & 0xff;
  state.amTick = am_jsr_T5;
}

function am_jsr_T5() {
  state.adh    = cpuRead(state.pc);
  state.amTick = am_jsr_T6;
}

function am_jsr_T6() {
  state.pc     = (state.adh << 8) | state.tmp;
  state.amTick = null;
  state.fdTick = fd_fetch_T0;
}


// ----------------------------------------------------------------------------
// Miscellaneous operations: break operation (hardware interrupt/BRK)
// (†3: A. 5.4)

function am_interrupt_T1() {

  // Only increment the PC if this is a BRK
  // (Though even still, that's not very useful)
  if (state.pendingInt === 0) {
    state.pc = ++state.pc & 0xffff;
  }

  state.fdTick = null;
  state.amTick = am_interrupt_T2;
}

function am_interrupt_T2() {

  // Push PCH onto stack
  cpuWrite(0x100 + state.s, state.pc >> 8);
  state.s = --state.s & 0xff;

  state.amTick = am_interrupt_T3;
}

function am_interrupt_T3() {

  // Push PCL onto stack
  cpuWrite(0x100 + state.s, state.pc & 0xff);
  state.s = --state.s & 0xff;

  state.amTick = am_interrupt_T4;
}

function am_interrupt_T4() {

  // Push P onto stack
  cpuWrite(0x100 + state.s, statusToP((state.pendingInt === 0) ? 1 : 0));
  state.s = --state.s & 0xff;

  // Now that the status register has been pushed, we can change it
  state.i = 1;

  state.amTick = am_interrupt_T5;
}

function am_interrupt_T5() {

  // Get interrupt vector lowbyte
  let lowbyte;

  if      (state.pendingInt === 0) lowbyte = 0xfffe;  // BRK
  else if (state.pendingInt === 1) lowbyte = 0xfffe;  // IRQ (same vector)
  else if (state.pendingInt === 2) lowbyte = 0xfffa;  // NMI
  else if (state.pendingInt === 3) lowbyte = 0xfffc;  // RESET

  state.pc = cpuRead(lowbyte);

  state.amTick = am_interrupt_T6;
}

function am_interrupt_T6() {

  // Get interrupt vector highbyte
  let highbyte;

  if      (state.pendingInt === 0) highbyte = 0xffff;  // BRK
  else if (state.pendingInt === 1) highbyte = 0xffff;  // IRQ (same vector)
  else if (state.pendingInt === 2) highbyte = 0xfffb;  // NMI
  else if (state.pendingInt === 3) highbyte = 0xfffd;  // RESET

  state.pc |= cpuRead(highbyte) << 8;

  // Clear pendingInt, so the next time we come to this sequence we'll assume
  // it's a BRK unless the interrupt poller wants to tell us otherwise.
  state.pendingInt = 0;

  state.amTick = null;
  state.fdTick = fd_fetch_T0;
}


// ----------------------------------------------------------------------------
// Miscellaneous operations: return from interrupt (RTI)
// (†3: A. 5.5)

function am_rti_T1() {
  state.amTick = am_rti_T2;
  state.fdTick = null;
}

function am_rti_T2() {
  cpuRead(0x100 + state.s);
  state.s      = ++state.s & 0xff;
  state.amTick = am_rti_T3;
}

function am_rti_T3() {
  pToStatus(cpuRead(0x100 + state.s));
  state.s      = ++state.s & 0xff;
  state.amTick = am_rti_T4;
}

function am_rti_T4() {
  state.pc     = cpuRead(0x100 + state.s);
  state.s      = ++state.s & 0xff;
  state.amTick = am_rti_T5;
}

function am_rti_T5() {
  state.pc    |= cpuRead(0x100 + state.s) << 8;
  state.amTick = null;
  state.fdTick = fd_fetch_T0;
}


// ----------------------------------------------------------------------------
// Jump operation: absolute addressing
// (†3: A. 5.6.1)

function am_jmp_abs_T1() {
  state.pc     = ++state.pc & 0xffff;
  state.amTick = am_jmp_abs_T2;
  state.fdTick = null;
}

function am_jmp_abs_T2() {
  // Decode phase left the target address's low byte in state.tmp.
  state.pc     = (cpuRead(state.pc) << 8) | state.tmp;
  state.amTick = null;
  state.fdTick = fd_fetch_T0;
}


// ----------------------------------------------------------------------------
// Jump operation: indirect addressing
// (†3: A. 5.6.2)

function am_jmp_ind_T1() {
  state.pc     = ++state.pc & 0xffff;
  state.amTick = am_jmp_ind_T2;
  state.fdTick = null;
}

function am_jmp_ind_T2() {
  // Decode phase left the pointer address's low byte in state.tmp.
  state.adh    = cpuRead(state.pc);
  state.amTick = am_jmp_ind_T3;
}

function am_jmp_ind_T3() {
  state.pc     = cpuRead((state.adh << 8) | state.tmp);
  state.tmp    = ++state.tmp & 0xff;
  state.amTick = am_jmp_ind_T4;
}

function am_jmp_ind_T4() {
  state.pc    |= cpuRead((state.adh << 8) | state.tmp) << 8;
  state.amTick = null;
  state.fdTick = fd_fetch_T0;
}


// ----------------------------------------------------------------------------
// Miscellaneous operations: return from subroutine (RTS)
// (†3: A. 5.7)

function am_rts_T1() {
  state.amTick = am_rts_T2;
  state.fdTick = null;
}

function am_rts_T2() {
  cpuRead(0x100 + state.s);
  state.s      = ++state.s & 0xff;
  state.amTick = am_rts_T3;
}

function am_rts_T3() {
  state.pc     = cpuRead(0x100 + state.s);
  state.s      = ++state.s & 0xff;
  state.amTick = am_rts_T4;
}

function am_rts_T4() {
  state.pc    |= cpuRead(0x100 + state.s) << 8;
  state.amTick = am_rts_T5;
}

function am_rts_T5() {
  cpuRead(state.pc);
  state.pc     = ++state.pc & 0xffff;
  state.amTick = null;
  state.fdTick = fd_fetch_T0;
}


// ----------------------------------------------------------------------------
// Miscellaneous operations: branch operaion
// (†3: A. 5.8 has to be wrong; see presumed fix in †2)

function am_rel_T1() {
  state.pc     = ++state.pc & 0xffff;
  state.fdTick = null;
  state.amTick = am_rel_T2;
}

function am_rel_T2() {
  // Instruction decode will have left the instruction operand (the branch offset)
  // in state.tmp for us

  // Read next opcode, if that's what it turns out to be
  state.ir = cpuRead(state.pc);

  // This stage would be T2 of a branch instruction, which seems to be (†2)
  // where the relative mode interrupt poll seems to be.
  pollForInterrupts();

  // Evaluate the branch criterion
  if (state.opFn()) {

    // Taking branch
    const offset = state.tmp; // operand, from previous cycle

    // 9-bit ADL, effectively
    state.adl = (state.pc & 0xff) + (offset < 0x80 ? offset : -(256 - offset));

    // Cobble together an un-fixed PC by adding the low bytes without carry
    state.pc = (state.pc & 0xff00) | (state.adl & 0xff);

    state.amTick = am_rel_T3;
    return;
  }
  
  // Branch not taken. Skip straight to the decode stage as we've already
  // performed the instruction fetch.

  // Latch the instruction register from zero (BRK) if there are interrupts
  if (state.pendingInt) {
    state.ir = 0;
  }
  else {
    state.pc = ++state.pc & 0xffff;
  }

  state.amTick = null;
  state.fdTick = fd_decode_T1;
}

function am_rel_T3() {

  // Read next opcode from un-fixed PC, then figure out if it needed fixing
  state.ir = cpuRead(state.pc);

  if (state.adl & 0x100) {  // (state.adl < 0) || (state.adl > 0xff)

    state.pc = (state.adl < 0)
      ? ((state.pc - 0x100) & 0xffff)
      : ((state.pc + 0x100) & 0xffff)
    ;
    
    // End the addressing mode processing and use the regular fetch/decode
    // fetch stage to execute from the next instruction. This would be why,
    // I'm thinking, real hardware honors interrupts an instruction sooner when
    // the PC needed fixup than when it doesn't. (See †2)

    state.amTick = null;
    state.fdTick = fd_fetch_T0;
  }

  else {
    // It didn't need fixing. Since we already have the fetched instruction,
    // advance straight to fd_decode_T1

    // Latch the instruction register from zero (BRK) if there are interrupts
    if (state.pendingInt) {
      state.ir = 0;
    }
    else {
      state.pc = ++state.pc & 0xffff;
    }

    state.amTick = null;
    state.fdTick = fd_decode_T1;
  }
}


// ----------------------------------------------------------------------------
// HLT opcode
// Not documented, since it's a quasi-op mode, and it causes an irrecoverable
// failure, so capturing the nuances of what specifically happens each cycle
// is irrelevant.

function am_halt_T1() {
  // 'unimplemented' doesn't accurately describe this. We need an alternative
  // error reporting hook.
  unimplementedWarning(`HLT opcode at PC=${$xxxx(state.pc)}`);
  state.amTick = null;
  state.fdTick = null;
}


// Opcode operations
//
// These functions are supplied to the addressing mode handler and perform the
// key functionality of the opcode. Different addressing mode handlers have
// different expectations of how they expect their op functions to take inputs
// and give outputs. Hence, to clarify usage, their names take the format:
//
//      op_XXX_in_out
//
// ...where in = void     takes no explicit input (maybe from regs)
//          in = tmp      takes input from state.tmp
//          in = arg      takes input from sole function argument
//
//         out = void     returns nothing (or is implicit, or to regs)
//         out = ret      returns value from function return value


// Flow control operations
// ...don't need to exist: they're never called. They only exist to help
// explain the opcodes of the table where they're used.

function op_BRK_void_void() { }
function op_JSR_void_void() { }
function op_RTI_void_void() { }
function op_JMP_void_void() { }
function op_RTS_void_void() { }
function op_HLT_void_void() { }  // Quasi-op

// Single-byte operations
// ...operate entirely on registers

function op_NOP_void_void() { }
function op_CLC_void_void() { state.c = 0; }
function op_CLD_void_void() { state.d = 0; }
function op_CLI_void_void() { state.i = 0; }
function op_CLV_void_void() { state.v = 0; }

function op_SEC_void_void() { state.c = 1; }
function op_SED_void_void() { state.d = 1; }
function op_SEI_void_void() { state.i = 1; }

function op_TAX_void_void() { state.x = state.a; state.z = state.x ? 0 : 1; state.n = (state.x & 0x80) ? 1 : 0; }
function op_TAY_void_void() { state.y = state.a; state.z = state.y ? 0 : 1; state.n = (state.y & 0x80) ? 1 : 0; }
function op_TXA_void_void() { state.a = state.x; state.z = state.a ? 0 : 1; state.n = (state.a & 0x80) ? 1 : 0; }
function op_TYA_void_void() { state.a = state.y; state.z = state.a ? 0 : 1; state.n = (state.a & 0x80) ? 1 : 0; }
function op_TSX_void_void() { state.x = state.s; state.z = state.x ? 0 : 1; state.n = (state.x & 0x80) ? 1 : 0; }
function op_TXS_void_void() { state.s = state.x;                                                            }

function op_DEX_void_void() { state.x = --state.x & 0xff; state.z = state.x ? 0 : 1; state.n = (state.x & 0x80) ? 1 : 0; }
function op_DEY_void_void() { state.y = --state.y & 0xff; state.z = state.y ? 0 : 1; state.n = (state.y & 0x80) ? 1 : 0; }
function op_INX_void_void() { state.x = ++state.x & 0xff; state.z = state.x ? 0 : 1; state.n = (state.x & 0x80) ? 1 : 0; }
function op_INY_void_void() { state.y = ++state.y & 0xff; state.z = state.y ? 0 : 1; state.n = (state.y & 0x80) ? 1 : 0; }

// Read-modify-write operations
// ...take a parameter and return a new value for it.

function op_ASL_arg_ret(arg) {
  arg <<= 1;
  state.c = (arg & 0x100) ? 1 : 0;
  arg &= 0xff;
  state.z = arg ? 0 : 1;
  state.n = (arg & 0x80) ? 1 : 0;
  return arg;
}

function op_LSR_arg_ret(arg) {
  state.c = arg & 1;
  arg >>= 1;
  state.z = arg ? 0 : 1;
  state.n = 0;
  return arg;
}

function op_ROL_arg_ret(arg) {
  arg <<= 1;
  arg |= state.c;
  state.c = (arg & 0x100) ? 1 : 0;
  arg &= 0xff;
  state.z = arg ? 0 : 1;
  state.n = (arg & 0x80) ? 1 : 0;
  return arg;
}

function op_ROR_arg_ret(arg) {
  const tmp = state.c;
  state.c = arg & 1;
  arg >>= 1;
  arg |= (tmp << 7);
  state.z = arg ? 0 : 1;
  state.n = (arg & 0x80) ? 1 : 0;
  return arg;
}

function op_LSE_arg_ret(arg) {
  // Quasi-op: "LSE" (†4), "SRE" (†1)
  state.tmp = op_LSR_arg_ret(arg);
  op_EOR_tmp_void();
  return state.tmp;
}

function op_DCM_arg_ret(arg) {
  // Quasi-op: "DCM" (†4), "DCP" (†1)
  state.tmp = op_DEC_arg_ret(arg);
  op_CMP_tmp_void();
  return state.tmp;
}

function op_ASO_arg_ret(arg) {
  // Quasi-op: "ASO" (†4), "SLO" (†1)
  state.tmp = op_ASL_arg_ret(arg);
  op_ORA_tmp_void();
  return state.tmp;
}

function op_RLA_arg_ret(arg) {
  // Quasi-op: "RLA" (†4 and †1)
  state.tmp = op_ROL_arg_ret(arg);
  op_AND_tmp_void();
  return state.tmp;
}

function op_RRA_arg_ret(arg) {
  // Quasi-op: "RRA" (†4 and †1)
  state.tmp = op_ROR_arg_ret(arg);
  op_ADC_tmp_void();
  return state.tmp;
}

function op_INS_arg_ret(arg) {
  // Quasi-op: "INS" (†4), "ISB" (†1), and also "ISB" (†4)
  state.tmp = op_INC_arg_ret(arg);
  op_SBC_tmp_void();
  return state.tmp;
}

function op_INC_arg_ret(arg) { arg = ++arg & 0xff; state.z = arg ? 0 : 1; state.n = (arg & 0x80) ? 1 : 0; return arg; }
function op_DEC_arg_ret(arg) { arg = --arg & 0xff; state.z = arg ? 0 : 1; state.n = (arg & 0x80) ? 1 : 0; return arg; }
function op_NOP_arg_ret(arg) { /* Quasi-op */                                                             return arg; }

// Boolean functions
// ...take a parameter and mutate the accumulator with it.

function op_EOR_tmp_void() { state.a ^= state.tmp; state.z = state.a ? 0 : 1;           state.n = (state.a & 0x80) ? 1 : 0; }
function op_ORA_tmp_void() { state.a |= state.tmp; state.z = state.a ? 0 : 1;           state.n = (state.a & 0x80) ? 1 : 0; }
function op_AND_tmp_void() { state.a &= state.tmp; state.z = state.a ? 0 : 1;           state.n = (state.a & 0x80) ? 1 : 0; }
function op_ANC_tmp_void() { state.a &= state.tmp; state.z = state.a ? 0 : 1; state.c = state.n = (state.a & 0x80) ? 1 : 0; }  // Quasi-op

function op_BIT_tmp_void() {
  state.z = (state.a & state.tmp) ? 0 : 1;
  state.n = (state.tmp & 0x80) ? 1 : 0;
  state.v = (state.tmp & 0x40) ? 1 : 0;
}

function op_ANE_tmp_void() {
  // Quasi-op: "XAA" (†4, which is inaccurate), "ANE" (†1)

  // †1 describes how this 0x11 constant can alternatively be 0x10, 0x01,
  // or 0x00 depending on residual charge on the open bus. The 0x11 used here
  // is the value expected by the Lorenz aneb test.
  state.a = ((state.a & 0x11 & state.x) | ( 0xee & state.x)) & state.tmp;
  state.z = state.a ? 0 : 1;
  state.n = (state.a & 0x80) ? 1 : 0;
}

function op_LXA_tmp_void() {
  // Quasi-op: "OAL" (†4), "LXA" (†1)

  // The 0xee here makes me think of the 0xee in ANE and how its 0x11 can be
  // unstable. This quasi-op sounds similarly unstable, so likewise, the
  // behavior here is whatever the Lorenz lxab test expects it to be.
  state.a = state.x = (state.a | 0xee) & state.tmp;
  state.z = state.a ? 0 : 1;
  state.n = (state.a & 0x80) ? 1 : 0;
}

function op_SBX_tmp_void() {
  // Quasi-op: "SAX" (†4), "SBX" (†1)
  const tmp = (state.a & state.x) - state.tmp;

  state.x = tmp & 0xff;
  state.c = (tmp >= 0) ? 1 : 0;
  state.z = state.x ? 0 : 1;
  state.n = (state.x & 0x80) ? 1 : 0;
}

function op_ALR_tmp_void() {
// Quasi-op: "ALR" (†4), "ASR" (†1)
  state.a = op_LSR_arg_ret(state.a & state.tmp);
}

function op_ARR_tmp_void() {
  // Quasi-op: "ARR" (†4 (which is inaccurate) and †1)

  if (state.d) {
    // Translated from †1. I've skipped the annotations because this is really
    // just an arbitrary muddle of accidental logic, of no use to anyone.
    let t = state.a & state.tmp;

    let ah = t >> 4;
    let al = t & 15;

    state.n = state.c;
    state.a = (t >> 1) | (state.c << 7);

    state.z = state.a ? 0 : 1;
    state.v = ((t ^ state.a) & 64) ? 1 : 0;

    if (al + (al & 1) > 5) {
      state.a = (state.a & 0xf0) | ((state.a + 6) & 0xf);
    }

    state.c = ((ah + (ah & 1)) > 5) ? 1 : 0;

    if (state.c) {
      state.a = (state.a + 0x60) & 0xff;
    }
  }
  else {
    state.a = op_ROR_arg_ret(state.a & state.tmp);

    state.c = ((state.a >> 6)                 ) & 1;
    state.v = ((state.a >> 6) ^ (state.a >> 5)) & 1;
  }
}

// Loads
// ...commit a parameter to a register.

function op_LDA_tmp_void() {           state.a = state.tmp; state.z = state.a ? 0 : 1; state.n = (state.a & 0x80) ? 1 : 0; }
function op_LDX_tmp_void() {           state.x = state.tmp; state.z = state.x ? 0 : 1; state.n = (state.x & 0x80) ? 1 : 0; }
function op_LDY_tmp_void() {           state.y = state.tmp; state.z = state.y ? 0 : 1; state.n = (state.y & 0x80) ? 1 : 0; }
function op_LAX_tmp_void() { state.x = state.a = state.tmp; state.z = state.a ? 0 : 1; state.n = (state.a & 0x80) ? 1 : 0; }  // Quasi-op

function op_LAS_tmp_void() {
  // Quasi-op: "LAS" (†4 and †1)
  state.a = state.x = state.s = state.tmp & state.s;
  state.z = state.a ? 0 : 1;
  state.n = (state.a & 0x80) ? 1 : 0;
}

// Stores
// ...supply a value for the addressing mode to commit to memory.

function op_STA_void_ret() { return state.a;                                      }
function op_STX_void_ret() { return state.x;                                      }
function op_STY_void_ret() { return state.y;                                      }
function op_AXS_void_ret() { return state.a & state.x;                            }  // Quasi-op: "AXS" (†4), "SAX" (†1)
function op_SHA_void_ret() { return state.a & state.x & ((state.adh + 1) & 0xff); }  // Quasi-op: "AXA" (†4), "SHA" (†1)
function op_SHX_void_ret() { return           state.x & ((state.adh + 1) & 0xff); }  // Quasi-op: "XAS" (†4), "SHX" (†1)
function op_SHY_void_ret() { return           state.y & ((state.adh + 1) & 0xff); }  // Quasi-op: "SAY" (†4), "SHY" (†1)

function op_SHS_void_ret() {
  // Quasi-op: "TAS" (†4), "SHS" (†1)
  state.s = state.a & state.x;
  return state.s & ((state.adh + 1) & 0xff);
}

// Compares
// ...compare a register to a parameter value.

function op_CMP_tmp_void() { const tmp = state.a - state.tmp; state.c = (tmp >= 0) ? 1 : 0; state.z = tmp ? 0 : 1; state.n = (tmp & 0x80) ? 1 : 0; }
function op_CPX_tmp_void() { const tmp = state.x - state.tmp; state.c = (tmp >= 0) ? 1 : 0; state.z = tmp ? 0 : 1; state.n = (tmp & 0x80) ? 1 : 0; }
function op_CPY_tmp_void() { const tmp = state.y - state.tmp; state.c = (tmp >= 0) ? 1 : 0; state.z = tmp ? 0 : 1; state.n = (tmp & 0x80) ? 1 : 0; }

// Add-subtract
// ...take a parameter and operate on the accumulator.

function op_ADC_tmp_void() { ADC_helper(state.tmp); }
function op_SBC_tmp_void() { SBC_helper(state.tmp); }

// Branches
// ...supply a boolean to inform the addressing mode whether to branch.

function op_BCC_void_ret() { return state.c === 0; }
function op_BCS_void_ret() { return state.c === 1; }
function op_BEQ_void_ret() { return state.z === 1; }
function op_BMI_void_ret() { return state.n === 1; }
function op_BNE_void_ret() { return state.z === 0; }
function op_BPL_void_ret() { return state.n === 0; }
function op_BVC_void_ret() { return state.v === 0; }
function op_BVS_void_ret() { return state.v === 1; }

// Pushes
// ...supply a value for the addressing mode to push on the stack.

function op_PHA_void_ret() { return state.a;      }
function op_PHP_void_ret() { return statusToP(1); }

// Pulls
// ...commit a value that the addressing mode has popped from the stack.

function op_PLA_arg_void(arg) { state.a = arg; state.z = arg ? 0 : 1; state.n = (arg & 0x80) ? 1 : 0; }
function op_PLP_arg_void(arg) { pToStatus(arg);                                                       }





function ADC_helper(src) {
  // TODO: This really wants cleaning up

  if (state.d) {
    
    state.z = ((state.a + src + state.c) & 0xff) ? 0 : 1;
    let al = (state.a & 0xf) + (src & 0xf) + state.c;
    state.c = 0;
    if (al > 9) al = ((al - 10) & 0xf) + 0x10;

    let seahn = (state.a & 0xf0);
    let sebhn = (    src & 0xf0);

    seahn = (seahn >= 0x80) ? (-1 & ~0xff) | (seahn & 0xff) : seahn;
    sebhn = (sebhn >= 0x80) ? (-1 & ~0xff) | (sebhn & 0xff) : sebhn;

    let temp = seahn + sebhn + al;

    state.n = (temp & 128) ? 1 : 0;
    state.v = ((temp < -128) || (temp > 127)) ? 1 : 0;
    state.a = (state.a & 0xf0) + (src & 0xf0) + al;

    if (state.a >= 0xa0) {
      state.a -= 0xa0;
      state.c = 1;
    }

    state.a &= 0xff;
  }
  else {
    const initialAcc = state.a;
    state.a += src;
    state.a += state.c;
    
    state.c = (state.a & 0x100) ? 1 : 0;
    state.a &= 0xff;
    state.z = state.a ? 0 : 1;
    state.n = (state.a & 0x80) ? 1 : 0;
    
    state.v = ~(initialAcc ^ src) & (initialAcc ^ state.a) & 0x80;
    state.v = state.v ? 1 : 0;
  }
}

function SBC_helper(src) {
  if (state.d) {

    // TODO: This also really wants cleaning up

    const ain = state.a;
    const cin = state.c;
    const sin = src;

    // CNVZ flags come from the binary implementation, so...
    // --------------------------------
    src = (~src) & 0xff;
    state.d = 0;
    ADC_helper(src);
    state.d = 1;
    // --------------------------------
    let al = (ain & 0xf) - (sin & 0xf) + cin - 1;
    if (al < 0) al = ((al - 6) & 0xf) - 0x10;
    state.a = (ain & 0xf0) - (sin & 0xf0) + al;
    if (state.a < 0) state.a -= 0x60;
    state.a &= 0xff;
  }
  else {
    src = (~src) & 0xff;
    ADC_helper(src);
  }
}


function statusToP(b) {
  return (
    (state.n ? (1 << 7) : 0)
  | (state.v ? (1 << 6) : 0)
  | (          (1 << 5)    )
  | (      b ? (1 << 4) : 0)
  | (state.d ? (1 << 3) : 0)
  | (state.i ? (1 << 2) : 0)
  | (state.z ? (1 << 1) : 0)
  | (state.c ? (1 << 0) : 0)
  );
}

function pToStatus(byte) {
  state.n = (byte >> 7) & 1;
  state.v = (byte >> 6) & 1;

  state.d = (byte >> 3) & 1;
  state.i = (byte >> 2) & 1;
  state.z = (byte >> 1) & 1;
  state.c = (byte >> 0) & 1;
}

function showState() {
  try {
    console.log(
      `PC=${$xxxx(state.pc)}` +
      ` A=${$xx(state.a)}` +
      ` X=${$xx(state.x)}` +
      ` Y=${$xx(state.y)}` +
      ` SR=${$xx(statusToP(0))}` +
      ` (` +
        ((state.n) ? "N" : "_") +
        ((state.v) ? "V" : "_") +
        (            "-"      ) +
        (            "-"      ) +
        ((state.d) ? "D" : "_") +
        ((state.i) ? "I" : "_") +
        ((state.z) ? "Z" : "_") +
        ((state.c) ? "C" : "_") +
      `)` +
      ` SP=${$xxxx(state.s)}` +
      ` | ` +
      c64.runloop.getState().cycle +
      ` | ` +
      disasm(cpuRead, state.pc, state.pc + 1)
    );
  }
  catch (e) {
    console.log("Regs are:", state);
    console.log("Error:", e);
    throw new Error("Regs are corrupted");
  }
}

function assertRegs() {
  if (typeof state.a !== "number")      throw new Error("Bad state.a: " + state.a);
  if ((state.a < 0) || (state.a > 255)) throw new Error("Bad state.a: " + state.a);

  if (typeof state.s !== "number")      throw new Error("Bad state.s: " + state.s);
  if ((state.s < 0) || (state.s > 255)) throw new Error("Bad state.s: " + state.s);

  if (typeof state.x !== "number")      throw new Error("Bad state.x: " + state.x);
  if ((state.x < 0) || (state.x > 255)) throw new Error("Bad state.x: " + state.x);

  if (typeof state.y !== "number")      throw new Error("Bad state.y: " + state.y);
  if ((state.y < 0) || (state.y > 255)) throw new Error("Bad state.y: " + state.y);

  if ((state.c !== 0) && (state.c !== 1)) throw new Error("Bad state.c: " + state.c);
  if ((state.v !== 0) && (state.v !== 1)) throw new Error("Bad state.v: " + state.v);
  if ((state.n !== 0) && (state.n !== 1)) throw new Error("Bad state.n: " + state.n);
  if ((state.z !== 0) && (state.z !== 1)) throw new Error("Bad state.z: " + state.z);
  if ((state.d !== 0) && (state.d !== 1)) throw new Error("Bad state.d: " + state.d);
  if ((state.i !== 0) && (state.i !== 1)) throw new Error("Bad state.i: " + state.i);
}

function pollForInterrupts() {

  // Look to see if any interrupts should divert execution. If they should, we
  // record that in the state in a variable which must be looked at whenever
  // an opcode is loaded into the instruction register (because we'd be putting
  // zero there instead)

  const nmi = getNmi();

  // NMI takes precedence over an IRQ, and ignores the I flag. Or so †3 would
  // have you believe. Test Suite 2.15.txt suggests the 6510 _does_ turn on
  // I-disable for the NMI. Try it and see...

  // NMI is edge-triggered, whereas IRQ is level-triggered
  // TODO: forums suggest that NMI edge detection is per-cycle, but this
  // is doing it per poll
  if (nmi !== state.lastNmi) {
    state.lastNmi = nmi;
    if (nmi) {
      // I'm hearing disagreement on whether state.i inhibits NMIs on a 6510.
      // Need to just try it out on real hardware.
      // Frantic Freddie gets stuck unless it's inhibited. But then if
      // allowed through it just gets stuck in gameplay.
      // if (!state.i) {
        state.pendingInt = 2;
        return;
      // }
    }
  }

  const irq = getIrq();

  if (irq) {
    if (!state.i) {
      state.pendingInt = 1;
      return;
    }
  }
}


function tick() {
  // We should probably only do this in dev builds
  assertRegs();

  // Make a copy of the state machine functions so that if one changes another,
  // it won't take effect until the next cycle.
  const { fdTick, amTick } = state;

  if (fdTick) fdTick();
  if (amTick) amTick();
}

function serialize() {
  return JSON.stringify({
    ...state,
    amTick: functionToReference(state.amTick),
    fdTick: functionToReference(state.fdTick),
    opFn:   functionToReference(state.opFn),
  });
}

function deserialize(json) {
  state = JSON.parse(json);

  state.amTick = referenceToFunction(state.amTick);
  state.fdTick = referenceToFunction(state.fdTick);
  state.opFn   = referenceToFunction(state.opFn);
}

addToSerializerRegistry({
  fd_fetch_T0,
  fd_decode_T1,
  am_singleByte_imp_T1,
  am_singleByte_imp_T2,
  am_singleByte_acc_T1,
  am_singleByte_acc_T2,
  am_ieomd_imm_T1,
  am_ieomd_imm_T2,
  am_ieomd_zp_T1,
  am_ieomd_zp_T2,
  am_ieomd_zp_T3,
  am_ieomd_abs_T1,
  am_ieomd_abs_T2,
  am_ieomd_abs_T3,
  am_ieomd_abs_T4,
  am_ieomd_inx_T1,
  am_ieomd_inx_T2,
  am_ieomd_inx_T3,
  am_ieomd_inx_T4,
  am_ieomd_inx_T5,
  am_ieomd_inx_T6,
  am_ieomd_abx_T1,
  am_ieomd_abx_T2,
  am_ieomd_aby_T1,
  am_ieomd_aby_T2,
  am_ieomd_abxy_T3,
  am_ieomd_abxy_T4,
  am_ieomd_abxy_T5,
  am_ieomd_zpx_T1,
  am_ieomd_zpx_T2,
  am_ieomd_zpy_T1,
  am_ieomd_zpy_T2,
  am_ieomd_zpxy_T3,
  am_ieomd_zpxy_T4,
  am_ieomd_iny_T1,
  am_ieomd_iny_T2,
  am_ieomd_iny_T3,
  am_ieomd_iny_T4,
  am_ieomd_iny_T5,
  am_ieomd_iny_T6,
  am_store_zp_T1,
  am_store_zp_T2,
  am_store_abs_T1,
  am_store_abs_T2,
  am_store_abs_T3,
  am_store_inx_T1,
  am_store_inx_T2,
  am_store_inx_T3,
  am_store_inx_T4,
  am_store_inx_T5,
  am_store_abx_T1,
  am_store_abx_T2,
  am_store_aby_T1,
  am_store_aby_T2,
  am_store_abxy_T3,
  am_store_abxy_T4,
  am_store_zpx_T1,
  am_store_zpx_T2,
  am_store_zpy_T1,
  am_store_zpy_T2,
  am_store_zpxy_T3,
  am_store_iny_T1,
  am_store_iny_T2,
  am_store_iny_T3,
  am_store_iny_T4,
  am_store_iny_T5,
  am_rmw_zp_T1,
  am_rmw_zp_T2,
  am_rmw_zp_T3,
  am_rmw_zp_T4,
  am_rmw_abs_T1,
  am_rmw_abs_T2,
  am_rmw_abs_T3,
  am_rmw_abs_T4,
  am_rmw_abs_T5,
  am_rmw_zpx_T1,
  am_rmw_zpx_T2,
  am_rmw_zpx_T3,
  am_rmw_zpx_T4,
  am_rmw_zpx_T5,
  am_rmw_abx_T1,
  am_rmw_abx_T2,
  am_rmw_aby_T1,
  am_rmw_aby_T2,
  am_rmw_abxy_T3,
  am_rmw_abxy_T4,
  am_rmw_abxy_T5,
  am_rmw_abxy_T6,
  am_rmw_inx_T1,
  am_rmw_inx_T2,
  am_rmw_inx_T3,
  am_rmw_inx_T4,
  am_rmw_inx_T5,
  am_rmw_inx_T6,
  am_rmw_inx_T7,
  am_rmw_iny_T1,
  am_rmw_iny_T2,
  am_rmw_iny_T3,
  am_rmw_iny_T4,
  am_rmw_iny_T5,
  am_rmw_iny_T6,
  am_rmw_iny_T7,
  am_push_T1,
  am_push_T2,
  am_pull_T1,
  am_pull_T2,
  am_pull_T3,
  am_pull_T4,
  am_jsr_T1,
  am_jsr_T2,
  am_jsr_T3,
  am_jsr_T4,
  am_jsr_T5,
  am_jsr_T6,
  am_interrupt_T1,
  am_interrupt_T2,
  am_interrupt_T3,
  am_interrupt_T4,
  am_interrupt_T5,
  am_interrupt_T6,
  am_rti_T1,
  am_rti_T2,
  am_rti_T3,
  am_rti_T4,
  am_rti_T5,
  am_jmp_abs_T1,
  am_jmp_abs_T2,
  am_jmp_ind_T1,
  am_jmp_ind_T2,
  am_jmp_ind_T3,
  am_jmp_ind_T4,
  am_rts_T1,
  am_rts_T2,
  am_rts_T3,
  am_rts_T4,
  am_rts_T5,
  am_rel_T1,
  am_rel_T2,
  am_rel_T3,
  am_halt_T1,
  op_BRK_void_void,
  op_JSR_void_void,
  op_RTI_void_void,
  op_JMP_void_void,
  op_RTS_void_void,
  op_HLT_void_void,
  op_NOP_void_void,
  op_CLC_void_void,
  op_CLD_void_void,
  op_CLI_void_void,
  op_CLV_void_void,
  op_SEC_void_void,
  op_SED_void_void,
  op_SEI_void_void,
  op_TAX_void_void,
  op_TAY_void_void,
  op_TXA_void_void,
  op_TYA_void_void,
  op_TSX_void_void,
  op_TXS_void_void,
  op_DEX_void_void,
  op_DEY_void_void,
  op_INX_void_void,
  op_INY_void_void,
  op_ASL_arg_ret,
  op_LSR_arg_ret,
  op_ROL_arg_ret,
  op_ROR_arg_ret,
  op_LSE_arg_ret,
  op_DCM_arg_ret,
  op_ASO_arg_ret,
  op_RLA_arg_ret,
  op_RRA_arg_ret,
  op_INS_arg_ret,
  op_INC_arg_ret,
  op_DEC_arg_ret,
  op_NOP_arg_ret,
  op_EOR_tmp_void,
  op_ORA_tmp_void,
  op_AND_tmp_void,
  op_ANC_tmp_void,
  op_BIT_tmp_void,
  op_ANE_tmp_void,
  op_LXA_tmp_void,
  op_SBX_tmp_void,
  op_ALR_tmp_void,
  op_ARR_tmp_void,
  op_LDA_tmp_void,
  op_LDX_tmp_void,
  op_LDY_tmp_void,
  op_LAX_tmp_void,
  op_LAS_tmp_void,
  op_STA_void_ret,
  op_STX_void_ret,
  op_STY_void_ret,
  op_AXS_void_ret,
  op_SHA_void_ret,
  op_SHX_void_ret,
  op_SHY_void_ret,
  op_SHS_void_ret,
  op_CMP_tmp_void,
  op_CPX_tmp_void,
  op_CPY_tmp_void,
  op_ADC_tmp_void,
  op_SBC_tmp_void,
  op_BCC_void_ret,
  op_BCS_void_ret,
  op_BEQ_void_ret,
  op_BMI_void_ret,
  op_BNE_void_ret,
  op_BPL_void_ret,
  op_BVC_void_ret,
  op_BVS_void_ret,
  op_PHA_void_ret,
  op_PHP_void_ret,
  op_PLA_arg_void,
  op_PLP_arg_void,
});
