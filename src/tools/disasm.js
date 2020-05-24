/*
   A disassembler for live memory
*/

import { xx, $xx, $xxxx } from "../debug";

// Adapted from https://www.masswerk.at/6502/6502_instruction_set.html
// TODO: This doesn't include the quasi-ops
const opcodes = [
/*       x0           x1           x2       x3     x4           x5           x6           x7     x8          x9           xA          xB     xC           xD           xE           xF  */
/* 0x */ "BRK impl",  "ORA X,ind", "---",   "---", "---",       "ORA zpg",   "ASL zpg",   "---", "PHP impl", "ORA #",     "ASL A",    "---", "---",       "ORA abs",   "ASL abs",   "---",
/* 1x */ "BPL rel",   "ORA ind,Y", "---",   "---", "---",       "ORA zpg,X", "ASL zpg,X", "---", "CLC impl", "ORA abs,Y", "---",      "---", "---",       "ORA abs,X", "ASL abs,X", "---",
/* 2x */ "JSR abs",   "AND X,ind", "---",   "---", "BIT zpg",   "AND zpg",   "ROL zpg",   "---", "PLP impl", "AND #",     "ROL A",    "---", "BIT abs",   "AND abs",   "ROL abs",   "---",
/* 3x */ "BMI rel",   "AND ind,Y", "---",   "---", "---",       "AND zpg,X", "ROL zpg,X", "---", "SEC impl", "AND abs,Y", "---",      "---", "---",       "AND abs,X", "ROL abs,X", "---",
/* 4x */ "RTI impl",  "EOR X,ind", "---",   "---", "---",       "EOR zpg",   "LSR zpg",   "---", "PHA impl", "EOR #",     "LSR A",    "---", "JMP abs",   "EOR abs",   "LSR abs",   "---",
/* 5x */ "BVC rel",   "EOR ind,Y", "---",   "---", "---",       "EOR zpg,X", "LSR zpg,X", "---", "CLI impl", "EOR abs,Y", "---",      "---", "---",       "EOR abs,X", "LSR abs,X", "---",
/* 6x */ "RTS impl",  "ADC X,ind", "---",   "---", "---",       "ADC zpg",   "ROR zpg",   "---", "PLA impl", "ADC #",     "ROR A",    "---", "JMP ind",   "ADC abs",   "ROR abs",   "---",
/* 7x */ "BVS rel",   "ADC ind,Y", "---",   "---", "---",       "ADC zpg,X", "ROR zpg,X", "---", "SEI impl", "ADC abs,Y", "---",      "---", "---",       "ADC abs,X", "ROR abs,X", "---",
/* 8x */ "---",       "STA X,ind", "---",   "---", "STY zpg",   "STA zpg",   "STX zpg",   "---", "DEY impl", "---",       "TXA impl", "---", "STY abs",   "STA abs",   "STX abs",   "---",
/* 9x */ "BCC rel",   "STA ind,Y", "---",   "---", "STY zpg,X", "STA zpg,X", "STX zpg,Y", "---", "TYA impl", "STA abs,Y", "TXS impl", "---", "---",       "STA abs,X", "---",       "---",
/* Ax */ "LDY #",     "LDA X,ind", "LDX #", "---", "LDY zpg",   "LDA zpg",   "LDX zpg",   "---", "TAY impl", "LDA #",     "TAX impl", "---", "LDY abs",   "LDA abs",   "LDX abs",   "---",
/* Bx */ "BCS rel",   "LDA ind,Y", "---",   "---", "LDY zpg,X", "LDA zpg,X", "LDX zpg,Y", "---", "CLV impl", "LDA abs,Y", "TSX impl", "---", "LDY abs,X", "LDA abs,X", "LDX abs,Y", "---",
/* Cx */ "CPY #",     "CMP X,ind", "---",   "---", "CPY zpg",   "CMP zpg",   "DEC zpg",   "---", "INY impl", "CMP #",     "DEX impl", "---", "CPY abs",   "CMP abs",   "DEC abs",   "---",
/* Dx */ "BNE rel",   "CMP ind,Y", "---",   "---", "---",       "CMP zpg,X", "DEC zpg,X", "---", "CLD impl", "CMP abs,Y", "---",      "---", "---",       "CMP abs,X", "DEC abs,X", "---",
/* Ex */ "CPX #",     "SBC X,ind", "---",   "---", "CPX zpg",   "SBC zpg",   "INC zpg",   "---", "INX impl", "SBC #",     "NOP impl", "---", "CPX abs",   "SBC abs",   "INC abs",   "---",
/* Fx */ "BEQ rel",   "SBC ind,Y", "---",   "---", "---",       "SBC zpg,X", "INC zpg,X", "---", "SED impl", "SBC abs,Y", "---",      "---", "---",       "SBC abs,X", "INC abs,X", "---",
];

// Number of bytes that need to be read for opcodes of each addressing mode,
// including the opcode itself
const bytesForOpcode = opcodes.map(
  opcode => ({
      "abs":   3,
      "abs,X": 3,
      "abs,Y": 3,
      "ind":   3,
      "zpg":   2,
      "zpg,X": 2,
      "zpg,Y": 2,
      "rel":   2,
      "X,ind": 2,
      "ind,Y": 2,
      "#":     2,
      "A":     1,
      "impl":  1,
      "":      1
    })[opcode.substring(4)]
);

function uint8ToNum(b) {
  return b < 0x80 ? b : -(256 - b);
}

export function disasm(cpuRead, addr, to) {

  const lines = [];

  while (addr < to) {

    // Display the address
    let line = `${$xxxx(addr)}: `;

    // Display the instruction's raw bytes, however many there might be
    const b0 = cpuRead((addr + 0) & 0xffff);
    const b1 = cpuRead((addr + 1) & 0xffff);
    const b2 = cpuRead((addr + 2) & 0xffff);

    const length = bytesForOpcode[b0];

    line += (               xx(b0)       ) + " ";
    line += ((length > 1) ? xx(b1) : "  ") + " ";
    line += ((length > 2) ? xx(b2) : "  ") + " ";
    line += "  ";

    // Display the opcode
    const op   = opcodes[b0].substring(0, 3);
    const mode = opcodes[b0].substring(4);
    line += op;

    // Display the parameters
    const table = {
      "A":     () => ``,
      "impl":  () => ``,
      "zpg":   () => ` ${$xx(b1)}`,
      "zpg,X": () => ` ${$xx(b1)},X`,
      "zpg,Y": () => ` ${$xx(b1)},Y`,
      "abs":   () => ` ${$xx(b2, 2)}${xx(b1, 2)}`,
      "abs,X": () => ` ${$xx(b2, 2)}${xx(b1, 2)},X`,
      "abs,Y": () => ` ${$xx(b2, 2)}${xx(b1, 2)},Y`,
      "ind":   () => ` (${$xx(b2, 2)}${xx(b1, 2)})`,
      "X,ind": () => ` (${$xx(b1)},X)`,
      "ind,Y": () => ` (${$xx(b1, 2)}),Y`,
      "#":     () => ` #${$xx(b1, 2)}`,
      "rel":   () => ` ${$xxxx(addr + uint8ToNum(b1) + 2)}`,
      "":      () => ``,
    };

    line += table[mode]();
    addr += length;

    lines.push(line);
  }

  return lines.join("\n");
}
