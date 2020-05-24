/*
   Basic ($a000 – $bfff)

   The source below assembles into a bytestream fully compatible with the C64's
   Basic ROM. It's adapted from Michael Steil's adaptation(†1) of Lee Davison's
   investigation into the original firmware. All comments below are Lee's.

   The labels are informed by Project64's collection of memory maps(†2) and
   those used in Mapping The Commodore 64(†3). Where sources disagree on names/
   locations, I've based my choices on which had the most consensus and which
   best corresponds to the instructions or data to which they relate.

   †1 https://github.com/mist64/c64disasm
   †2 https://github.com/Project-64/reloaded/blob/master/c64/64MAP11.TXT
   †3 https://github.com/Project-64/reloaded/blob/master/c64/mapc64/MAPC6412.TXT

   If you want to substitute your own ROM, just export a byte array instead:
       export default [ 0x.., ... ];

   Unlike the rest of the Viciious project, which was authored from scratch and
   entered into the public domain, the source below is derived from works by
   multiple other authors and I make no representations as to its ownership or
   terms of use.

   Note that the Basic interpreter spills over into the Kernal ROM.
*/

import { assemble } from "../../tools/assembler";

export default assemble(
  0xa000,
  ({
    NOP, LDA, LDX, LDY, STA, STX, STY, CLC, CLD, CLI, CLV, SEC, SED, SEI,
    TAX, TAY, TSX, TXA, TXS, TYA, CMP, CPX, CPY, BCS, BCC, BEQ, BNE, BMI,
    BPL, BVS, BVC, BIT, JSR, RTS, RTI, BRK, JMP, INC, DEC, DEX, DEY, INX,
    INY, ADC, SBC, AND, EOR, ORA, ASL, ROL, LSR, ROR, PHA, PHP, PLA, PLP,
    _
  }) => {
            // External labels (RAM)
            _.label(0x0002, "_0002");
            _.label(0x0003, "adray1+0_0003");
            _.label(0x0004, "adray1+1_0004");
            _.label(0x0007, "charac_0007");
            _.label(0x0008, "endchr_0008");
            _.label(0x0009, "trmpos_0009");
            _.label(0x000b, "count_000b");
            _.label(0x000c, "dimflg_000c");
            _.label(0x000d, "valtyp_000d");
            _.label(0x000e, "intflg_000e");
            _.label(0x000f, "garbfl_000f");
            _.label(0x0010, "subflg_0010");
            _.label(0x0011, "inpflg_0011");
            _.label(0x0012, "tansgn_0012");
            _.label(0x0013, "channl_0013");
            _.label(0x0014, "linnum+0_0014");
            _.label(0x0015, "linnum+1_0015");
            _.label(0x0016, "temppt_0016");
            _.label(0x0017, "lastpt+0_0017");
            _.label(0x0018, "lastpt+1_0018");
            _.label(0x0022, "index+0_0022");
            _.label(0x0023, "index+1_0023");
            _.label(0x0024, "index+2_0024");
            _.label(0x0025, "index+3_0025");
            _.label(0x0026, "resho+0_0026");
            _.label(0x0027, "resho+1_0027");
            _.label(0x0028, "resho+2_0028");
            _.label(0x0029, "resho+3_0029");
            _.label(0x002b, "txttab+0_002b");
            _.label(0x002c, "txttab+1_002c");
            _.label(0x002d, "vartab+0_002d");
            _.label(0x002e, "vartab+1_002e");
            _.label(0x002f, "arytab+0_002f");
            _.label(0x0030, "arytab+1_0030");
            _.label(0x0031, "strend+0_0031");
            _.label(0x0032, "strend+1_0032");
            _.label(0x0033, "fretop+0_0033");
            _.label(0x0034, "fretop+1_0034");
            _.label(0x0035, "frespc+0_0035");
            _.label(0x0036, "frespc+1_0036");
            _.label(0x0037, "memsiz+0_0037");
            _.label(0x0038, "memsiz+1_0038");
            _.label(0x0039, "curlin+0_0039");
            _.label(0x003a, "curlin+1_003a");
            _.label(0x003b, "oldlin+0_003b");
            _.label(0x003c, "oldlin+1_003c");
            _.label(0x003d, "oldtxt+0_003d");
            _.label(0x003e, "oldtxt+1_003e");
            _.label(0x003f, "datlin+0_003f");
            _.label(0x0040, "datlin+1_0040");
            _.label(0x0041, "datptr+0_0041");
            _.label(0x0042, "datptr+1_0042");
            _.label(0x0043, "inpptr+0_0043");
            _.label(0x0044, "inpptr+1_0044");
            _.label(0x0045, "varnam+0_0045");
            _.label(0x0046, "varnam+1_0046");
            _.label(0x0047, "varpnt+0_0047");
            _.label(0x0048, "varpnt+1_0048");
            _.label(0x0049, "forpnt+0_0049");
            _.label(0x004a, "forpnt+1_004a");
            _.label(0x004b, "opptr+0_004b");
            _.label(0x004c, "opptr+1_004c");
            _.label(0x004d, "opmask_004d");
            _.label(0x004e, "defpnt+0_004e");
            _.label(0x004f, "defpnt+1_004f");
            _.label(0x0050, "dscpnt+0_0050");
            _.label(0x0051, "dscpnt+1_0051");
            _.label(0x0053, "four6_0053");
            _.label(0x0054, "jmper+0_0054");
            _.label(0x0055, "jmper+1_0055");
            _.label(0x0056, "jmper+2_0056");
            _.label(0x0058, "tempf1+1_0058");
            _.label(0x0059, "tempf1+2_0059");
            _.label(0x005a, "tempf1+3_005a");
            _.label(0x005b, "tempf1+4_005b");
            _.label(0x005d, "tempf2+1_005d");
            _.label(0x005e, "tempf2+2_005e");
            _.label(0x005f, "tempf2+3_005f");
            _.label(0x0060, "tempf2+4_0060");
            _.label(0x0061, "facexp_0061");
            _.label(0x0062, "facho+0_0062");
            _.label(0x0063, "facho+1_0063");
            _.label(0x0064, "facho+2_0064");
            _.label(0x0065, "facho+3_0065");
            _.label(0x0066, "facsgn_0066");
            _.label(0x0067, "sgnflg_0067");
            _.label(0x0068, "bits_0068");
            _.label(0x0069, "argexp_0069");
            _.label(0x006a, "argho+0_006a");
            _.label(0x006b, "argho+1_006b");
            _.label(0x006c, "argho+2_006c");
            _.label(0x006d, "argho+3_006d");
            _.label(0x006e, "argsgn_006e");
            _.label(0x006f, "arisgn_006f");
            _.label(0x0070, "facov_0070");
            _.label(0x0071, "fbufpt+0_0071");
            _.label(0x0072, "fbufpt+1_0072");
            _.label(0x0073, "chrget+0_0073");
            _.label(0x0079, "chrgot_0079");
            _.label(0x007a, "txtptr+0_007a");
            _.label(0x007b, "txtptr+1_007b");
            _.label(0x0080, "chrget+13_0080");
            _.label(0x00ff, "baszpt_00ff");
            _.label(0x0100, "bad+0_0100");
            _.label(0x0101, "bad+1_0101");
            _.label(0x0102, "bad+2_0102");
            _.label(0x0103, "bad+3_0103");
            _.label(0x0104, "bad+4_0104");
            _.label(0x0109, "bad+9_0109");
            _.label(0x010f, "bad+15_010f");
            _.label(0x0110, "bad+16_0110");
            _.label(0x0111, "bad+17_0111");
            _.label(0x0112, "bad+18_0112");
            _.label(0x01fb, "bstack+188_01fb");
            _.label(0x01fc, "bstack+189_01fc");
            _.label(0x01fd, "bstack+190_01fd");
            _.label(0x01fe, "bstack+191_01fe");
            _.label(0x01ff, "bstack+192_01ff");
            _.label(0x0200, "buf+0_0200");
            _.label(0x0201, "buf+1_0201");
            _.label(0x0300, "ierror+0_0300");
            _.label(0x0302, "imain+0_0302");
            _.label(0x0304, "icrnch+0_0304");
            _.label(0x0306, "iqplop+0_0306");
            _.label(0x0308, "igone+0_0308");
            _.label(0x030a, "ieval+0_030a");
            _.label(0x9fea, "_9fea");
            _.label(0x9feb, "_9feb");

            // External labels (Memory-mapped IO)
            _.label(0x0001, "r6510_0001");

            // External labels (Kernal ROM)
            _.label(0xe000, "(exp_e000");
            _.label(0xe043, "polyx_e043");
            _.label(0xe10c, "bchout_e10c");
            _.label(0xe112, "bchin_e112");
            _.label(0xe118, "bckout_e118");
            _.label(0xe11e, "bckin_e11e");
            _.label(0xe124, "bgetin_e124");
            _.label(0xe386, "_e386");
            _.label(0xff90, "setmsg_ff90");
            _.label(0xffb7, "readst_ffb7");
            _.label(0xffcc, "clrchn_ffcc");
            _.label(0xffdb, "settim_ffdb");
            _.label(0xffde, "rdtim_ffde");
            _.label(0xffe1, "stop_ffe1");
            _.label(0xffe7, "clall_ffe7");
            _.label(0xfff0, "plot_fff0");

// ---------------------------------------------------------- start of the BASIC ROM
/* a000 */ _`restart_a000`;  _.bytes(0x94, 0xe3);          // BASIC cold start entry point
/* a002 */                   _.bytes(0x7b, 0xe3);          // BASIC warm start entry point

                                                           // 'cbmbasic', ROM name, unreferenced
/* a004 */                   _.bytes(0x43, 0x42, 0x4d, 0x42, 0x41, 0x53, 0x49, 0x43);

// ------------------------------------------------------- // action addresses for primary commands
                                                           // these are called by pushing the address onto the stack and doing an RTS so the
                                                           // actual address -1 needs to be pushed
/* a00c */  _`stmdsp_a00c`;  _.bytes(0x30, 0xa8);          // perform END     $80
/* a00e */                   _.bytes(0x41, 0xa7);          // perform FOR     $81
/* a010 */                   _.bytes(0x1d, 0xad);          // perform NEXT    $82
/* a012 */                   _.bytes(0xf7, 0xa8);          // perform DATA    $83
/* a014 */                   _.bytes(0xa4, 0xab);          // perform INPUT#  $84
/* a016 */                   _.bytes(0xbe, 0xab);          // perform INPUT   $85
/* a018 */                   _.bytes(0x80, 0xb0);          // perform DIM     $86
/* a01a */                   _.bytes(0x05, 0xac);          // perform READ    $87
/* a01c */                   _.bytes(0xa4, 0xa9);          // perform LET     $88
/* a01e */                   _.bytes(0x9f, 0xa8);          // perform GOTO    $89
/* a020 */                   _.bytes(0x70, 0xa8);          // perform RUN     $8A
/* a022 */                   _.bytes(0x27, 0xa9);          // perform IF      $8B
/* a024 */                   _.bytes(0x1c, 0xa8);          // perform RESTORE $8C
/* a026 */                   _.bytes(0x82, 0xa8);          // perform GOSUB   $8D
/* a028 */                   _.bytes(0xd1, 0xa8);          // perform RETURN  $8E
/* a02a */                   _.bytes(0x3a, 0xa9);          // perform REM     $8F
/* a02c */                   _.bytes(0x2e, 0xa8);          // perform STOP    $90
/* a02e */                   _.bytes(0x4a, 0xa9);          // perform ON      $91
/* a030 */                   _.bytes(0x2c, 0xb8);          // perform WAIT    $92
/* a032 */                   _.bytes(0x67, 0xe1);          // perform LOAD    $93
/* a034 */                   _.bytes(0x55, 0xe1);          // perform SAVE    $94
/* a036 */                   _.bytes(0x64, 0xe1);          // perform VERIFY  $95
/* a038 */                   _.bytes(0xb2, 0xb3);          // perform DEF     $96
/* a03a */                   _.bytes(0x23, 0xb8);          // perform POKE    $97
/* a03c */                   _.bytes(0x7f, 0xaa);          // perform PRINT#  $98
/* a03e */                   _.bytes(0x9f, 0xaa);          // perform PRINT   $99
/* a040 */                   _.bytes(0x56, 0xa8);          // perform CONT    $9A
/* a042 */                   _.bytes(0x9b, 0xa6);          // perform LIST    $9B
/* a044 */                   _.bytes(0x5d, 0xa6);          // perform CLR     $9C
/* a046 */                   _.bytes(0x85, 0xaa);          // perform CMD     $9D
/* a048 */                   _.bytes(0x29, 0xe1);          // perform SYS     $9E
/* a04a */                   _.bytes(0xbd, 0xe1);          // perform OPEN    $9F
/* a04c */                   _.bytes(0xc6, 0xe1);          // perform CLOSE   $A0
/* a04e */                   _.bytes(0x7a, 0xab);          // perform GET     $A1
/* a050 */                   _.bytes(0x41, 0xa6);          // perform NEW     $A2

// ------------------------------------------------------- // action addresses for functions
/* a052 */  _`fundsp_a052`;  _.bytes(0x39, 0xbc);          // perform SGN     $B4
/* a054 */                   _.bytes(0xcc, 0xbc);          // perform INT     $B5
/* a056 */                   _.bytes(0x58, 0xbc);          // perform ABS     $B6
/* a058 */                   _.bytes(0x10, 0x03);          // perform USR     $B7
/* a05a */                   _.bytes(0x7d, 0xb3);          // perform FRE     $B8
/* a05c */                   _.bytes(0x9e, 0xb3);          // perform POS     $B9
/* a05e */                   _.bytes(0x71, 0xbf);          // perform SQR     $BA
/* a060 */                   _.bytes(0x97, 0xe0);          // perform RND     $BB
/* a062 */                   _.bytes(0xea, 0xb9);          // perform LOG     $BC
/* a064 */                   _.bytes(0xed, 0xbf);          // perform EXP     $BD
/* a066 */                   _.bytes(0x64, 0xe2);          // perform COS     $BE
/* a068 */                   _.bytes(0x6b, 0xe2);          // perform SIN     $BF
/* a06a */                   _.bytes(0xb4, 0xe2);          // perform TAN     $C0
/* a06c */                   _.bytes(0x0e, 0xe3);          // perform ATN     $C1
/* a06e */                   _.bytes(0x0d, 0xb8);          // perform PEEK    $C2
/* a070 */                   _.bytes(0x7c, 0xb7);          // perform LEN     $C3
/* a072 */                   _.bytes(0x65, 0xb4);          // perform STR$    $C4
/* a074 */                   _.bytes(0xad, 0xb7);          // perform VAL     $C5
/* a076 */                   _.bytes(0x8b, 0xb7);          // perform ASC     $C6
/* a078 */                   _.bytes(0xec, 0xb6);          // perform CHR$    $C7
/* a07a */                   _.bytes(0x00, 0xb7);          // perform LEFT$   $C8
/* a07c */                   _.bytes(0x2c, 0xb7);          // perform RIGHT$  $C9
/* a07e */                   _.bytes(0x37, 0xb7);          // perform MID$    $CA

// ------------------------------------------------------- // precedence byte and action addresses for operators
                                                           // like the primary commands these are called by pushing the address onto the stack
                                                           // and doing an RTS, so again the actual address -1 needs to be pushed
/* a080 */   _`optab_a080`;  _.bytes(0x79, 0x69, 0xb8);    // +
/* a083 */                   _.bytes(0x79, 0x52, 0xb8);    // -
/* a086 */                   _.bytes(0x7b, 0x2a, 0xba);    // *
/* a089 */                   _.bytes(0x7b, 0x11, 0xbb);    // /
/* a08c */                   _.bytes(0x7f, 0x7a, 0xbf);    // ^
/* a08f */                   _.bytes(0x50, 0xe8, 0xaf);    // AND
/* a092 */                   _.bytes(0x46, 0xe5, 0xaf);    // OR
/* a095 */                   _.bytes(0x7d, 0xb3, 0xbf);    // >
/* a098 */                   _.bytes(0x5a, 0xd3, 0xae);    // =
/* a09b */                   _.bytes(0x64, 0x15, 0xb0);    // <

// ------------------------------------------------------- // BASIC keywords
                                                           // each word has b7 set in it's last character as an end marker, even
                                                           // the one character keywords such as "<" or "="
                                                           // first are the primary command keywords, only these can start a statement
/* a09e */  _`reslst_a09e`;  _.bytes(0x45, 0x4e);          // end
                                                           // for next
/* a0a0 */                   _.bytes(0xc4, 0x46, 0x4f, 0xd2, 0x4e, 0x45, 0x58, 0xd4);
                                                           // data input#
/* a0a8 */                   _.bytes(0x44, 0x41, 0x54, 0xc1, 0x49, 0x4e, 0x50, 0x55);
                                                           // input dim
/* a0b0 */                   _.bytes(0x54, 0xa3, 0x49, 0x4e, 0x50, 0x55, 0xd4, 0x44);
                                                           // read let
/* a0b8 */                   _.bytes(0x49, 0xcd, 0x52, 0x45, 0x41, 0xc4, 0x4c, 0x45);
                                                           // goto run
/* a0c0 */                   _.bytes(0xd4, 0x47, 0x4f, 0x54, 0xcf, 0x52, 0x55, 0xce);
                                                           // if restore
/* a0c8 */                   _.bytes(0x49, 0xc6, 0x52, 0x45, 0x53, 0x54, 0x4f, 0x52);
                                                           // gosub return
/* a0d0 */                   _.bytes(0xc5, 0x47, 0x4f, 0x53, 0x55, 0xc2, 0x52, 0x45);
                                                           // rem stop
/* a0d8 */                   _.bytes(0x54, 0x55, 0x52, 0xce, 0x52, 0x45, 0xcd, 0x53);
                                                           // on wait
/* a0e0 */                   _.bytes(0x54, 0x4f, 0xd0, 0x4f, 0xce, 0x57, 0x41, 0x49);
                                                           // load save
/* a0e8 */                   _.bytes(0xd4, 0x4c, 0x4f, 0x41, 0xc4, 0x53, 0x41, 0x56);
                                                           // verify def
/* a0f0 */                   _.bytes(0xc5, 0x56, 0x45, 0x52, 0x49, 0x46, 0xd9, 0x44);
                                                           // poke print#
/* a0f8 */                   _.bytes(0x45, 0xc6, 0x50, 0x4f, 0x4b, 0xc5, 0x50, 0x52);
                                                           // print
/* a100 */                   _.bytes(0x49, 0x4e, 0x54, 0xa3, 0x50, 0x52, 0x49, 0x4e);
                                                           // cont list
/* a108 */                   _.bytes(0xd4, 0x43, 0x4f, 0x4e, 0xd4, 0x4c, 0x49, 0x53);
                                                           // clr cmd sys
/* a110 */                   _.bytes(0xd4, 0x43, 0x4c, 0xd2, 0x43, 0x4d, 0xc4, 0x53);
                                                           // open close
/* a118 */                   _.bytes(0x59, 0xd3, 0x4f, 0x50, 0x45, 0xce, 0x43, 0x4c);
                                                           // get new
/* a120 */                   _.bytes(0x4f, 0x53, 0xc5, 0x47, 0x45, 0xd4, 0x4e, 0x45);

                                                           // next are the secondary command keywords, these can not start a statement
                                                           // tab( to
/* a128 */                   _.bytes(0xd7, 0x54, 0x41, 0x42, 0xa8, 0x54, 0xcf, 0x46);
                                                           // spc( then
/* a130 */                   _.bytes(0xce, 0x53, 0x50, 0x43, 0xa8, 0x54, 0x48, 0x45);
                                                           // not step
/* a138 */                   _.bytes(0xce, 0x4e, 0x4f, 0xd4, 0x53, 0x54, 0x45, 0xd0);
                                                           // next are the operators
                                                           // + - * / ' and
/* a140 */  _`oplist_a140`;  _.bytes(0xab, 0xad, 0xaa, 0xaf, 0xde, 0x41, 0x4e, 0xc4);
                                                           // or <=>
/* a148 */                   _.bytes(0x4f, 0xd2, 0xbe, 0xbd, 0xbc);
/* a14d */  _`funlst_a14d`;  _.bytes(0x53, 0x47, 0xce);    // sgn

                                                           // and finally the functions
                                                           // int abs usr
/* a150 */                   _.bytes(0x49, 0x4e, 0xd4, 0x41, 0x42, 0xd3, 0x55, 0x53);
                                                           // fre pos sqr
/* a158 */                   _.bytes(0xd2, 0x46, 0x52, 0xc5, 0x50, 0x4f, 0xd3, 0x53);
                                                           // rnd log
/* a160 */                   _.bytes(0x51, 0xd2, 0x52, 0x4e, 0xc4, 0x4c, 0x4f, 0xc7);
                                                           // exp cos sin
/* a168 */                   _.bytes(0x45, 0x58, 0xd0, 0x43, 0x4f, 0xd3, 0x53, 0x49);
                                                           // tan atn peek
/* a170 */                   _.bytes(0xce, 0x54, 0x41, 0xce, 0x41, 0x54, 0xce, 0x50);
                                                           // len str$
/* a178 */                   _.bytes(0x45, 0x45, 0xcb, 0x4c, 0x45, 0xce, 0x53, 0x54);
                                                           // val asc
/* a180 */                   _.bytes(0x52, 0xa4, 0x56, 0x41, 0xcc, 0x41, 0x53, 0xc3);
                                                           // chr$ left$
/* a188 */                   _.bytes(0x43, 0x48, 0x52, 0xa4, 0x4c, 0x45, 0x46, 0x54);
                                                           // right$ mid$
/* a190 */                   _.bytes(0xa4, 0x52, 0x49, 0x47, 0x48, 0x54, 0xa4, 0x4d);

                                                           // lastly is GO, this is an add on so that GO TO, as well as GOTO, will work
                                                           // go
/* a198 */                   _.bytes(0x49, 0x44, 0xa4, 0x47, 0xcf);
/* a19d */                   _.bytes(0x00);                // end marker

// ------------------------------------------------------- // BASIC error messages
/* a19e */  _`errtab_a19e`;  _.bytes(0x54, 0x4f);          // 1 too many files
/* a1a0 */                   _.bytes(0x4f, 0x20, 0x4d, 0x41, 0x4e, 0x59, 0x20, 0x46);
                                                           // 2 file open
/* a1a8 */                   _.bytes(0x49, 0x4c, 0x45, 0xd3, 0x46, 0x49, 0x4c, 0x45);
                                                           // 3 file not open
/* a1b0 */                   _.bytes(0x20, 0x4f, 0x50, 0x45, 0xce, 0x46, 0x49, 0x4c);
/* a1b8 */                   _.bytes(0x45, 0x20, 0x4e, 0x4f, 0x54, 0x20, 0x4f, 0x50);
                                                           // 4 file not found
/* a1c0 */                   _.bytes(0x45, 0xce, 0x46, 0x49, 0x4c, 0x45, 0x20, 0x4e);
                                                           // 5 device not present
/* a1c8 */                   _.bytes(0x4f, 0x54, 0x20, 0x46, 0x4f, 0x55, 0x4e, 0xc4);
/* a1d0 */                   _.bytes(0x44, 0x45, 0x56, 0x49, 0x43, 0x45, 0x20, 0x4e);
/* a1d8 */                   _.bytes(0x4f, 0x54, 0x20, 0x50, 0x52, 0x45, 0x53, 0x45);
                                                           // 6 not input file
/* a1e0 */                   _.bytes(0x4e, 0xd4, 0x4e, 0x4f, 0x54, 0x20, 0x49, 0x4e);
/* a1e8 */                   _.bytes(0x50, 0x55, 0x54, 0x20, 0x46, 0x49, 0x4c, 0xc5);
                                                           // 7 not output file
/* a1f0 */                   _.bytes(0x4e, 0x4f, 0x54, 0x20, 0x4f, 0x55, 0x54, 0x50);
/* a1f8 */                   _.bytes(0x55, 0x54, 0x20, 0x46, 0x49, 0x4c, 0xc5, 0x4d);
                                                           // 8 missing filename
/* a200 */                   _.bytes(0x49, 0x53, 0x53, 0x49, 0x4e, 0x47, 0x20, 0x46);
/* a208 */                   _.bytes(0x49, 0x4c, 0x45, 0x20, 0x4e, 0x41, 0x4d, 0xc5);
                                                           // 9 illegal device number
/* a210 */                   _.bytes(0x49, 0x4c, 0x4c, 0x45, 0x47, 0x41, 0x4c, 0x20);
/* a218 */                   _.bytes(0x44, 0x45, 0x56, 0x49, 0x43, 0x45, 0x20, 0x4e);
                                                           // 10 next without for
/* a220 */                   _.bytes(0x55, 0x4d, 0x42, 0x45, 0xd2, 0x4e, 0x45, 0x58);
/* a228 */                   _.bytes(0x54, 0x20, 0x57, 0x49, 0x54, 0x48, 0x4f, 0x55);
                                                           // 11 syntax
/* a230 */                   _.bytes(0x54, 0x20, 0x46, 0x4f, 0xd2, 0x53, 0x59, 0x4e);
                                                           // 12 return without gosub
/* a238 */                   _.bytes(0x54, 0x41, 0xd8, 0x52, 0x45, 0x54, 0x55, 0x52);
/* a240 */                   _.bytes(0x4e, 0x20, 0x57, 0x49, 0x54, 0x48, 0x4f, 0x55);
                                                           // 13 out of data
/* a248 */                   _.bytes(0x54, 0x20, 0x47, 0x4f, 0x53, 0x55, 0xc2, 0x4f);
/* a250 */                   _.bytes(0x55, 0x54, 0x20, 0x4f, 0x46, 0x20, 0x44, 0x41);
                                                           // 14 illegal quantity
/* a258 */                   _.bytes(0x54, 0xc1, 0x49, 0x4c, 0x4c, 0x45, 0x47, 0x41);
/* a260 */                   _.bytes(0x4c, 0x20, 0x51, 0x55, 0x41, 0x4e, 0x54, 0x49);
                                                           // 15 overflow
/* a268 */                   _.bytes(0x54, 0xd9, 0x4f, 0x56, 0x45, 0x52, 0x46, 0x4c);
                                                           // 16 out of memory
/* a270 */                   _.bytes(0x4f, 0xd7, 0x4f, 0x55, 0x54, 0x20, 0x4f, 0x46);
                                                           // 17 undef'd statement
/* a278 */                   _.bytes(0x20, 0x4d, 0x45, 0x4d, 0x4f, 0x52, 0xd9, 0x55);
/* a280 */                   _.bytes(0x4e, 0x44, 0x45, 0x46, 0x27, 0x44, 0x20, 0x53);
/* a288 */                   _.bytes(0x54, 0x41, 0x54, 0x45, 0x4d, 0x45, 0x4e, 0xd4);
                                                           // 18 bad subscript
/* a290 */                   _.bytes(0x42, 0x41, 0x44, 0x20, 0x53, 0x55, 0x42, 0x53);
                                                           // 19 redim'd array
/* a298 */                   _.bytes(0x43, 0x52, 0x49, 0x50, 0xd4, 0x52, 0x45, 0x44);
/* a2a0 */                   _.bytes(0x49, 0x4d, 0x27, 0x44, 0x20, 0x41, 0x52, 0x52);
                                                           // 20 division by zero
/* a2a8 */                   _.bytes(0x41, 0xd9, 0x44, 0x49, 0x56, 0x49, 0x53, 0x49);
/* a2b0 */                   _.bytes(0x4f, 0x4e, 0x20, 0x42, 0x59, 0x20, 0x5a, 0x45);
                                                           // 21 illegal direct
/* a2b8 */                   _.bytes(0x52, 0xcf, 0x49, 0x4c, 0x4c, 0x45, 0x47, 0x41);
/* a2c0 */                   _.bytes(0x4c, 0x20, 0x44, 0x49, 0x52, 0x45, 0x43, 0xd4);
                                                           // 22 type mismatch
/* a2c8 */                   _.bytes(0x54, 0x59, 0x50, 0x45, 0x20, 0x4d, 0x49, 0x53);
                                                           // 23 string too long
/* a2d0 */                   _.bytes(0x4d, 0x41, 0x54, 0x43, 0xc8, 0x53, 0x54, 0x52);
/* a2d8 */                   _.bytes(0x49, 0x4e, 0x47, 0x20, 0x54, 0x4f, 0x4f, 0x20);
                                                           // 24 file data
/* a2e0 */                   _.bytes(0x4c, 0x4f, 0x4e, 0xc7, 0x46, 0x49, 0x4c, 0x45);
                                                           // 25 formula too complex
/* a2e8 */                   _.bytes(0x20, 0x44, 0x41, 0x54, 0xc1, 0x46, 0x4f, 0x52);
/* a2f0 */                   _.bytes(0x4d, 0x55, 0x4c, 0x41, 0x20, 0x54, 0x4f, 0x4f);
/* a2f8 */                   _.bytes(0x20, 0x43, 0x4f, 0x4d, 0x50, 0x4c, 0x45, 0xd8);
                                                           // 26 can't continue
/* a300 */                   _.bytes(0x43, 0x41, 0x4e, 0x27, 0x54, 0x20, 0x43, 0x4f);
                                                           // 27 undef'd function
/* a308 */                   _.bytes(0x4e, 0x54, 0x49, 0x4e, 0x55, 0xc5, 0x55, 0x4e);
/* a310 */                   _.bytes(0x44, 0x45, 0x46, 0x27, 0x44, 0x20, 0x46, 0x55);
                                                           // 28 verify
/* a318 */                   _.bytes(0x4e, 0x43, 0x54, 0x49, 0x4f, 0xce, 0x56, 0x45);
                                                           // 29 load
/* a320 */                   _.bytes(0x52, 0x49, 0x46, 0xd9, 0x4c, 0x4f, 0x41, 0xc4);

// ------------------------------------------------------- // error message pointer table
/* a328 */  _`errptr_a328`;  _.bytes(0x9e, 0xa1, 0xac, 0xa1, 0xb5, 0xa1, 0xc2, 0xa1);
/* a330 */                   _.bytes(0xd0, 0xa1, 0xe2, 0xa1, 0xf0, 0xa1, 0xff, 0xa1);
/* a338 */                   _.bytes(0x10, 0xa2, 0x25, 0xa2, 0x35, 0xa2, 0x3b, 0xa2);
/* a340 */                   _.bytes(0x4f, 0xa2, 0x5a, 0xa2, 0x6a, 0xa2, 0x72, 0xa2);
/* a348 */                   _.bytes(0x7f, 0xa2, 0x90, 0xa2, 0x9d, 0xa2, 0xaa, 0xa2);
/* a350 */                   _.bytes(0xba, 0xa2, 0xc8, 0xa2, 0xd5, 0xa2, 0xe4, 0xa2);
/* a358 */                   _.bytes(0xed, 0xa2, 0x00, 0xa3, 0x0e, 0xa3, 0x1e, 0xa3);
/* a360 */                   _.bytes(0x24, 0xa3, 0x83, 0xa3);

// ------------------------------------------------------- // BASIC messages
                                                           // OK
/* a364 */     _`okk_a364`;  _.bytes(0x0d, 0x4f, 0x4b, 0x0d);
                                                           // ERROR
/* a368 */                   _.bytes(0x00, 0x20, 0x20, 0x45, 0x52, 0x52, 0x4f, 0x52);
                                                           // IN
/* a370 */                   _.bytes(0x00, 0x20, 0x49, 0x4e, 0x20, 0x00, 0x0d, 0x0a);
                                                           // READY.
/* a378 */                   _.bytes(0x52, 0x45, 0x41, 0x44, 0x59, 0x2e, 0x0d, 0x0a);
                                                           // BREAK
/* a380 */                   _.bytes(0x00, 0x0d, 0x0a, 0x42, 0x52, 0x45, 0x41, 0x4b);
/* a388 */                   _.bytes(0x00);

// ------------------------------------------------------- // spare byte, not referenced
/* a389 */                   _.bytes(0xa0);                // unused

// ------------------------------------------------------- // search the stack for FOR or GOSUB activity
                                                           // return Zb=1 if FOR variable found
/* a38a */  _`fndfor_a38a`;  TSX.imp ();                   // copy stack pointer
/* a38b */                   INX.imp ();                   // +1 pass return address
/* a38c */                   INX.imp ();                   // +2 pass return address
/* a38d */                   INX.imp ();                   // +3 pass calling routine return address
/* a38e */                   INX.imp ();                   // +4 pass calling routine return address
/* a38f */        _`_a38f`;  LDA.abx ("bad+1_0101");       // get the token byte from the stack
/* a392 */                   CMP.imm (0x81);               // is it the FOR token
/* a394 */                   BNE.rel ("_a3b7");            // if not FOR token just exit
                                                           // it was the FOR token
/* a396 */                   LDA.zpg ("forpnt+1_004a");    // get FOR/NEXT variable pointer high byte
/* a398 */                   BNE.rel ("_a3a4");            // branch if not null
/* a39a */                   LDA.abx ("bad+2_0102");       // get FOR variable pointer low byte
/* a39d */                   STA.zpg ("forpnt+0_0049");    // save FOR/NEXT variable pointer low byte
/* a39f */                   LDA.abx ("bad+3_0103");       // get FOR variable pointer high byte
/* a3a2 */                   STA.zpg ("forpnt+1_004a");    // save FOR/NEXT variable pointer high byte
/* a3a4 */        _`_a3a4`;  CMP.abx ("bad+3_0103");       // compare variable pointer with stacked variable pointer
                                                           // high byte
/* a3a7 */                   BNE.rel ("_a3b0");            // branch if no match
/* a3a9 */                   LDA.zpg ("forpnt+0_0049");    // get FOR/NEXT variable pointer low byte
/* a3ab */                   CMP.abx ("bad+2_0102");       // compare variable pointer with stacked variable pointer
                                                           // low byte
/* a3ae */                   BEQ.rel ("_a3b7");            // exit if match found
/* a3b0 */        _`_a3b0`;  TXA.imp ();                   // copy index
/* a3b1 */                   CLC.imp ();                   // clear carry for add
/* a3b2 */                   ADC.imm (0x12);               // add FOR stack use size
/* a3b4 */                   TAX.imp ();                   // copy back to index
/* a3b5 */                   BNE.rel ("_a38f");            // loop if not at start of stack
/* a3b7 */        _`_a3b7`;  RTS.imp ();

// ------------------------------------------------------- // open up a space in the memory, set the end of arrays
/* a3b8 */    _`bltu_a3b8`;  JSR.abs ("reason_a408");      // check available memory, do out of memory error if no room
/* a3bb */                   STA.zpg ("strend+0_0031");    // set end of arrays low byte
/* a3bd */                   STY.zpg ("strend+1_0032");    // set end of arrays high byte
                                                           // open up a space in the memory, don't set the array end
/* a3bf */        _`_a3bf`;  SEC.imp ();                   // set carry for subtract
/* a3c0 */                   LDA.zpg ("tempf1+3_005a");    // get block end low byte
/* a3c2 */                   SBC.zpg ("tempf2+3_005f");    // subtract block start low byte
/* a3c4 */                   STA.zpg ("index+0_0022");     // save MOD(block length/$100) byte
/* a3c6 */                   TAY.imp ();                   // copy MOD(block length/$100) byte to Y
/* a3c7 */                   LDA.zpg ("tempf1+4_005b");    // get block end high byte
/* a3c9 */                   SBC.zpg ("tempf2+4_0060");    // subtract block start high byte
/* a3cb */                   TAX.imp ();                   // copy block length high byte to X
/* a3cc */                   INX.imp ();                   // +1 to allow for count=0 exit
/* a3cd */                   TYA.imp ();                   // copy block length low byte to A
/* a3ce */                   BEQ.rel ("_a3f3");            // branch if length low byte=0
                                                           // block is (X-1)*256+Y bytes, do the Y bytes first
/* a3d0 */                   LDA.zpg ("tempf1+3_005a");    // get block end low byte
/* a3d2 */                   SEC.imp ();                   // set carry for subtract
/* a3d3 */                   SBC.zpg ("index+0_0022");     // subtract MOD(block length/$100) byte
/* a3d5 */                   STA.zpg ("tempf1+3_005a");    // save corrected old block end low byte
/* a3d7 */                   BCS.rel ("_a3dc");            // branch if no underflow
/* a3d9 */                   DEC.zpg ("tempf1+4_005b");    // else decrement block end high byte
/* a3db */                   SEC.imp ();                   // set carry for subtract
/* a3dc */        _`_a3dc`;  LDA.zpg ("tempf1+1_0058");    // get destination end low byte
/* a3de */                   SBC.zpg ("index+0_0022");     // subtract MOD(block length/$100) byte
/* a3e0 */                   STA.zpg ("tempf1+1_0058");    // save modified new block end low byte
/* a3e2 */                   BCS.rel ("_a3ec");            // branch if no underflow
/* a3e4 */                   DEC.zpg ("tempf1+2_0059");    // else decrement block end high byte
/* a3e6 */                   BCC.rel ("_a3ec");            // branch always
/* a3e8 */        _`_a3e8`;  LDA.iny ("tempf1+3_005a");    // get byte from source
/* a3ea */                   STA.iny ("tempf1+1_0058");    // copy byte to destination
/* a3ec */        _`_a3ec`;  DEY.imp ();                   // decrement index
/* a3ed */                   BNE.rel ("_a3e8");            // loop until Y=0
                                                           // now do Y=0 indexed byte
/* a3ef */                   LDA.iny ("tempf1+3_005a");    // get byte from source
/* a3f1 */                   STA.iny ("tempf1+1_0058");    // save byte to destination
/* a3f3 */        _`_a3f3`;  DEC.zpg ("tempf1+4_005b");    // decrement source pointer high byte
/* a3f5 */                   DEC.zpg ("tempf1+2_0059");    // decrement destination pointer high byte
/* a3f7 */                   DEX.imp ();                   // decrement block count
/* a3f8 */                   BNE.rel ("_a3ec");            // loop until count = $0
/* a3fa */                   RTS.imp ();

// ------------------------------------------------------- // check room on stack for A bytes
                                                           // if stack too deep do out of memory error
/* a3fb */  _`getstk_a3fb`;  ASL.acc ();                   // *2
/* a3fc */                   ADC.imm (0x3e);               // need at least $3E bytes free
/* a3fe */                   BCS.rel ("omerr_a435");       // if overflow go do out of memory error then warm start
/* a400 */                   STA.zpg ("index+0_0022");     // save result in temp byte
/* a402 */                   TSX.imp ();                   // copy stack
/* a403 */                   CPX.zpg ("index+0_0022");     // compare new limit with stack
/* a405 */                   BCC.rel ("omerr_a435");       // if stack < limit do out of memory error then warm start
/* a407 */                   RTS.imp ();

// ------------------------------------------------------- // check available memory, do out of memory error if no room
/* a408 */  _`reason_a408`;  CPY.zpg ("fretop+1_0034");    // compare with bottom of string space high byte
/* a40a */                   BCC.rel ("_a434");            // if less then exit (is ok)
/* a40c */                   BNE.rel ("_a412");            // skip next test if greater (tested <)
                                                           // high byte was =, now do low byte
/* a40e */                   CMP.zpg ("fretop+0_0033");    // compare with bottom of string space low byte
/* a410 */                   BCC.rel ("_a434");            // if less then exit (is ok)
                                                           // address is > string storage ptr (oops!)
/* a412 */        _`_a412`;  PHA.imp ();                   // push address low byte
/* a413 */                   LDX.imm (0x09);               // set index to save $57 to $60 inclusive
/* a415 */                   TYA.imp ();                   // copy address high byte (to push on stack)
                                                           // save misc numeric work area
/* a416 */        _`_a416`;  PHA.imp ();                   // push byte
/* a417 */                   LDA.zpx (0x57);               // get byte from $57 to $60
/* a419 */                   DEX.imp ();                   // decrement index
/* a41a */                   BPL.rel ("_a416");            // loop until all done
/* a41c */                   JSR.abs ("garbag_b526");      // do garbage collection routine
                                                           // restore misc numeric work area
/* a41f */                   LDX.imm (0xf7);               // set index to restore bytes
/* a421 */        _`_a421`;  PLA.imp ();                   // pop byte
/* a422 */                   STA.zpx (0x61);               // save byte to $57 to $60
/* a424 */                   INX.imp ();                   // increment index
/* a425 */                   BMI.rel ("_a421");            // loop while -ve
/* a427 */                   PLA.imp ();                   // pop address high byte
/* a428 */                   TAY.imp ();                   // copy back to Y
/* a429 */                   PLA.imp ();                   // pop address low byte
/* a42a */                   CPY.zpg ("fretop+1_0034");    // compare with bottom of string space high byte
/* a42c */                   BCC.rel ("_a434");            // if less then exit (is ok)
/* a42e */                   BNE.rel ("omerr_a435");       // if greater do out of memory error then warm start
                                                           // high byte was =, now do low byte
/* a430 */                   CMP.zpg ("fretop+0_0033");    // compare with bottom of string space low byte
/* a432 */                   BCS.rel ("omerr_a435");       // if >= do out of memory error then warm start
                                                           // ok exit, carry clear
/* a434 */        _`_a434`;  RTS.imp ();

// ------------------------------------------------------- // do out of memory error then warm start
/* a435 */   _`omerr_a435`;  LDX.imm (0x10);               // error code $10, out of memory error
                                                           // do error #X then warm start
/* a437 */   _`error_a437`;  JMP.ind ("ierror+0_0300");    // do error message

// ------------------------------------------------------- // do error #X then warm start, the error message vector is initialised to point here
/* a43a */                   TXA.imp ();                   // copy error number
/* a43b */                   ASL.acc ();                   // *2
/* a43c */                   TAX.imp ();                   // copy to index
/* a43d */                   LDA.abx (0xa326);             // get error message pointer low byte
/* a440 */                   STA.zpg ("index+0_0022");     // save it
/* a442 */                   LDA.abx (0xa327);             // get error message pointer high byte
/* a445 */                   STA.zpg ("index+1_0023");     // save it
/* a447 */                   JSR.abs ("clrchn_ffcc");      // close input and output channels
/* a44a */                   LDA.imm (0x00);               // clear A
/* a44c */                   STA.zpg ("channl_0013");      // clear current I/O channel, flag default
/* a44e */                   JSR.abs ("crdo_aad7");        // print CR/LF
/* a451 */                   JSR.abs ("_ab45");            // print "?"
/* a454 */                   LDY.imm (0x00);               // clear index
/* a456 */        _`_a456`;  LDA.iny ("index+0_0022");     // get byte from message
/* a458 */                   PHA.imp ();                   // save status
/* a459 */                   AND.imm (0x7f);               // mask 0xxx xxxx, clear b7
/* a45b */                   JSR.abs ("_ab47");            // output character
/* a45e */                   INY.imp ();                   // increment index
/* a45f */                   PLA.imp ();                   // restore status
/* a460 */                   BPL.rel ("_a456");            // loop if character was not end marker
/* a462 */                   JSR.abs ("_a67a");            // flush BASIC stack and clear continue pointer
/* a465 */                   LDA.imm (0x69);               // set " ERROR" pointer low byte
/* a467 */                   LDY.imm (0xa3);               // set " ERROR" pointer high byte

// ------------------------------------------------------- // print string and do warm start, break entry
/* a469 */  _`errfin_a469`;  JSR.abs ("strout_ab1e");      // print null terminated string
/* a46c */                   LDY.zpg ("curlin+1_003a");    // get current line number high byte
/* a46e */                   INY.imp ();                   // increment it
/* a46f */                   BEQ.rel ("ready_a474");       // branch if was in immediate mode
/* a471 */                   JSR.abs ("inprt_bdc2");       // do " IN " line number message

// ------------------------------------------------------- // do warm start
/* a474 */   _`ready_a474`;  LDA.imm (0x76);               // set "READY." pointer low byte
/* a476 */                   LDY.imm (0xa3);               // set "READY." pointer high byte
/* a478 */                   JSR.abs ("strout_ab1e");      // print null terminated string
/* a47b */                   LDA.imm (0x80);               // set for control messages only
/* a47d */                   JSR.abs ("setmsg_ff90");      // control kernal messages
/* a480 */    _`main_a480`;  JMP.ind ("imain+0_0302");     // do BASIC warm start

// ------------------------------------------------------- // BASIC warm start, the warm start vector is initialised to point here
/* a483 */                   JSR.abs ("inlin_a560");       // call for BASIC input
/* a486 */                   STX.zpg ("txtptr+0_007a");    // save BASIC execute pointer low byte
/* a488 */                   STY.zpg ("txtptr+1_007b");    // save BASIC execute pointer high byte
/* a48a */                   JSR.abs ("chrget+0_0073");    // increment and scan memory
/* a48d */                   TAX.imp ();                   // copy byte to set flags
/* a48e */                   BEQ.rel ("main_a480");        // loop if no input
                                                           // got to interpret the input line now ....
/* a490 */                   LDX.imm (0xff);               // current line high byte to -1, indicates immediate mode
/* a492 */                   STX.zpg ("curlin+1_003a");    // set current line number high byte
/* a494 */                   BCC.rel ("main1_a49c");       // if numeric character go handle new BASIC line
                                                           // no line number .. immediate mode
/* a496 */                   JSR.abs ("crunch_a579");      // crunch keywords into BASIC tokens
/* a499 */                   JMP.abs ("_a7e1");            // go scan and interpret code

// ------------------------------------------------------- // handle new BASIC line
/* a49c */   _`main1_a49c`;  JSR.abs ("linget_a96b");      // get fixed-point number into temporary integer
/* a49f */                   JSR.abs ("crunch_a579");      // crunch keywords into BASIC tokens
/* a4a2 */  _`inslin_a4a2`;  STY.zpg ("count_000b");       // save index pointer to end of crunched line
/* a4a4 */                   JSR.abs ("fndlin_a613");      // search BASIC for temporary integer line number
/* a4a7 */                   BCC.rel ("_a4ed");            // if not found skip the line delete
                                                           // line # already exists so delete it
/* a4a9 */                   LDY.imm (0x01);               // set index to next line pointer high byte
/* a4ab */                   LDA.iny ("tempf2+3_005f");    // get next line pointer high byte
/* a4ad */                   STA.zpg ("index+1_0023");     // save it
/* a4af */                   LDA.zpg ("vartab+0_002d");    // get start of variables low byte
/* a4b1 */                   STA.zpg ("index+0_0022");     // save it
/* a4b3 */                   LDA.zpg ("tempf2+4_0060");    // get found line pointer high byte
/* a4b5 */                   STA.zpg ("index+3_0025");     // save it
/* a4b7 */                   LDA.zpg ("tempf2+3_005f");    // get found line pointer low byte
/* a4b9 */                   DEY.imp ();                   // decrement index
/* a4ba */                   SBC.iny ("tempf2+3_005f");    // subtract next line pointer low byte
/* a4bc */                   CLC.imp ();                   // clear carry for add
/* a4bd */                   ADC.zpg ("vartab+0_002d");    // add start of variables low byte
/* a4bf */                   STA.zpg ("vartab+0_002d");    // set start of variables low byte
/* a4c1 */                   STA.zpg ("index+2_0024");     // save destination pointer low byte
/* a4c3 */                   LDA.zpg ("vartab+1_002e");    // get start of variables high byte
/* a4c5 */                   ADC.imm (0xff);               // -1 + carry
/* a4c7 */                   STA.zpg ("vartab+1_002e");    // set start of variables high byte
/* a4c9 */                   SBC.zpg ("tempf2+4_0060");    // subtract found line pointer high byte
/* a4cb */                   TAX.imp ();                   // copy to block count
/* a4cc */                   SEC.imp ();                   // set carry for subtract
/* a4cd */                   LDA.zpg ("tempf2+3_005f");    // get found line pointer low byte
/* a4cf */                   SBC.zpg ("vartab+0_002d");    // subtract start of variables low byte
/* a4d1 */                   TAY.imp ();                   // copy to bytes in first block count
/* a4d2 */                   BCS.rel ("_a4d7");            // branch if no underflow
/* a4d4 */                   INX.imp ();                   // increment block count, correct for = 0 loop exit
/* a4d5 */                   DEC.zpg ("index+3_0025");     // decrement destination high byte
/* a4d7 */        _`_a4d7`;  CLC.imp ();                   // clear carry for add
/* a4d8 */                   ADC.zpg ("index+0_0022");     // add source pointer low byte
/* a4da */                   BCC.rel ("_a4df");            // branch if no overflow
/* a4dc */                   DEC.zpg ("index+1_0023");     // else decrement source pointer high byte
/* a4de */                   CLC.imp ();                   // clear carry
                                                           // close up memory to delete old line
/* a4df */        _`_a4df`;  LDA.iny ("index+0_0022");     // get byte from source
/* a4e1 */                   STA.iny ("index+2_0024");     // copy to destination
/* a4e3 */                   INY.imp ();                   // increment index
/* a4e4 */                   BNE.rel ("_a4df");            // while <> 0 do this block
/* a4e6 */                   INC.zpg ("index+1_0023");     // increment source pointer high byte
/* a4e8 */                   INC.zpg ("index+3_0025");     // increment destination pointer high byte
/* a4ea */                   DEX.imp ();                   // decrement block count
/* a4eb */                   BNE.rel ("_a4df");            // loop until all done
                                                           // got new line in buffer and no existing same #
/* a4ed */        _`_a4ed`;  JSR.abs ("_a659");            // reset execution to start, clear variables, flush stack
                                                           // and return
/* a4f0 */                   JSR.abs ("linkprg_a533");     // rebuild BASIC line chaining
/* a4f3 */                   LDA.abs ("buf+0_0200");       // get first byte from buffer
/* a4f6 */                   BEQ.rel ("main_a480");        // if no line go do BASIC warm start
                                                           // else insert line into memory
/* a4f8 */                   CLC.imp ();                   // clear carry for add
/* a4f9 */                   LDA.zpg ("vartab+0_002d");    // get start of variables low byte
/* a4fb */                   STA.zpg ("tempf1+3_005a");    // save as source end pointer low byte
/* a4fd */                   ADC.zpg ("count_000b");       // add index pointer to end of crunched line
/* a4ff */                   STA.zpg ("tempf1+1_0058");    // save as destination end pointer low byte
/* a501 */                   LDY.zpg ("vartab+1_002e");    // get start of variables high byte
/* a503 */                   STY.zpg ("tempf1+4_005b");    // save as source end pointer high byte
/* a505 */                   BCC.rel ("_a508");            // branch if no carry to high byte
/* a507 */                   INY.imp ();                   // else increment high byte
/* a508 */        _`_a508`;  STY.zpg ("tempf1+2_0059");    // save as destination end pointer high byte
/* a50a */                   JSR.abs ("bltu_a3b8");        // open up space in memory
                                                           // most of what remains to do is copy the crunched line into the space opened up in memory,
                                                           // however, before the crunched line comes the next line pointer and the line number. the
                                                           // line number is retrieved from the temporary integer and stored in memory, this
                                                           // overwrites the bottom two bytes on the stack. next the line is copied and the next line
                                                           // pointer is filled with whatever was in two bytes above the line number in the stack.
                                                           // this is ok because the line pointer gets fixed in the line chain re-build.
/* a50d */                   LDA.zpg ("linnum+0_0014");    // get line number low byte
/* a50f */                   LDY.zpg ("linnum+1_0015");    // get line number high byte
/* a511 */                   STA.abs ("bstack+191_01fe");  // save line number low byte before crunched line
/* a514 */                   STY.abs ("bstack+192_01ff");  // save line number high byte before crunched line
/* a517 */                   LDA.zpg ("strend+0_0031");    // get end of arrays low byte
/* a519 */                   LDY.zpg ("strend+1_0032");    // get end of arrays high byte
/* a51b */                   STA.zpg ("vartab+0_002d");    // set start of variables low byte
/* a51d */                   STY.zpg ("vartab+1_002e");    // set start of variables high byte
/* a51f */                   LDY.zpg ("count_000b");       // get index to end of crunched line
/* a521 */                   DEY.imp ();                   // -1
/* a522 */        _`_a522`;  LDA.aby ("bstack+189_01fc");  // get byte from crunched line
/* a525 */                   STA.iny ("tempf2+3_005f");    // save byte to memory
/* a527 */                   DEY.imp ();                   // decrement index
/* a528 */                   BPL.rel ("_a522");            // loop while more to do
                                                           // reset execution, clear variables, flush stack, rebuild BASIC chain and do warm start
/* a52a */                   JSR.abs ("_a659");            // reset execution to start, clear variables and flush stack
/* a52d */                   JSR.abs ("linkprg_a533");     // rebuild BASIC line chaining
/* a530 */                   JMP.abs ("main_a480");        // go do BASIC warm start

// ------------------------------------------------------- // rebuild BASIC line chaining
/* a533 */ _`linkprg_a533`;  LDA.zpg ("txttab+0_002b");    // get start of memory low byte
/* a535 */                   LDY.zpg ("txttab+1_002c");    // get start of memory high byte
/* a537 */                   STA.zpg ("index+0_0022");     // set line start pointer low byte
/* a539 */                   STY.zpg ("index+1_0023");     // set line start pointer high byte
/* a53b */                   CLC.imp ();                   // clear carry for add
/* a53c */        _`_a53c`;  LDY.imm (0x01);               // set index to pointer to next line high byte
/* a53e */                   LDA.iny ("index+0_0022");     // get pointer to next line high byte
/* a540 */                   BEQ.rel ("_a55f");            // exit if null, [EOT]
/* a542 */                   LDY.imm (0x04);               // point to first code byte of line
                                                           // there is always 1 byte + [EOL] as null entries are deleted
/* a544 */        _`_a544`;  INY.imp ();                   // next code byte
/* a545 */                   LDA.iny ("index+0_0022");     // get byte
/* a547 */                   BNE.rel ("_a544");            // loop if not [EOL]
/* a549 */                   INY.imp ();                   // point to byte past [EOL], start of next line
/* a54a */                   TYA.imp ();                   // copy it
/* a54b */                   ADC.zpg ("index+0_0022");     // add line start pointer low byte
/* a54d */                   TAX.imp ();                   // copy to X
/* a54e */                   LDY.imm (0x00);               // clear index, point to this line's next line pointer
/* a550 */                   STA.iny ("index+0_0022");     // set next line pointer low byte
/* a552 */                   LDA.zpg ("index+1_0023");     // get line start pointer high byte
/* a554 */                   ADC.imm (0x00);               // add any overflow
/* a556 */                   INY.imp ();                   // increment index to high byte
/* a557 */                   STA.iny ("index+0_0022");     // set next line pointer high byte
/* a559 */                   STX.zpg ("index+0_0022");     // set line start pointer low byte
/* a55b */                   STA.zpg ("index+1_0023");     // set line start pointer high byte
/* a55d */                   BCC.rel ("_a53c");            // go do next line, branch always
/* a55f */        _`_a55f`;  RTS.imp ();
                                                           // call for BASIC input
/* a560 */   _`inlin_a560`;  LDX.imm (0x00);               // set channel $00, keyboard
/* a562 */        _`_a562`;  JSR.abs ("bchin_e112");       // input character from channel with error check
/* a565 */                   CMP.imm (0x0d);               // compare with [CR]
/* a567 */                   BEQ.rel ("_a576");            // if [CR] set XY to $200 - 1, print [CR] and exit
                                                           // character was not [CR]
/* a569 */                   STA.abx ("buf+0_0200");       // save character to buffer
/* a56c */                   INX.imp ();                   // increment buffer index
/* a56d */                   CPX.imm (0x59);               // compare with max+1
/* a56f */                   BCC.rel ("_a562");            // branch if < max+1
/* a571 */                   LDX.imm (0x17);               // error $17, string too long error
/* a573 */                   JMP.abs ("error_a437");       // do error #X then warm start
/* a576 */        _`_a576`;  JMP.abs ("_aaca");            // set XY to $200 - 1 and print [CR]

// ------------------------------------------------------- // crunch BASIC tokens vector
/* a579 */  _`crunch_a579`;  JMP.ind ("icrnch+0_0304");    // do crunch BASIC tokens

// ------------------------------------------------------- // crunch BASIC tokens, the crunch BASIC tokens vector is initialised to point here
/* a57c */                   LDX.zpg ("txtptr+0_007a");    // get BASIC execute pointer low byte
/* a57e */                   LDY.imm (0x04);               // set save index
/* a580 */                   STY.zpg ("garbfl_000f");      // clear open quote/DATA flag
/* a582 */        _`_a582`;  LDA.abx ("buf+0_0200");       // get a byte from the input buffer
/* a585 */                   BPL.rel ("_a58e");            // if b7 clear go do crunching
/* a587 */                   CMP.imm (0xff);               // compare with the token for PI, this toke is input
                                                           // directly from the keyboard as the PI character
/* a589 */                   BEQ.rel ("_a5c9");            // if PI save byte then continue crunching
                                                           // this is the bit of code that stops you being able to enter
                                                           // some keywords as just single shifted characters. If this
                                                           // dropped through you would be able to enter GOTO as just
                                                           // [SHIFT]G
/* a58b */                   INX.imp ();                   // increment read index
/* a58c */                   BNE.rel ("_a582");            // loop if more to do, branch always
/* a58e */        _`_a58e`;  CMP.imm (0x20);               // compare with [SPACE]
/* a590 */                   BEQ.rel ("_a5c9");            // if [SPACE] save byte then continue crunching
/* a592 */                   STA.zpg ("endchr_0008");      // save buffer byte as search character
/* a594 */                   CMP.imm (0x22);               // compare with quote character
/* a596 */                   BEQ.rel ("_a5ee");            // if quote go copy quoted string
/* a598 */                   BIT.zpg ("garbfl_000f");      // get open quote/DATA token flag
/* a59a */                   BVS.rel ("_a5c9");            // branch if b6 of Oquote set, was DATA
                                                           // go save byte then continue crunching
/* a59c */                   CMP.imm (0x3f);               // compare with "?" character
/* a59e */                   BNE.rel ("_a5a4");            // if not "?" continue crunching
/* a5a0 */                   LDA.imm (0x99);               // else the keyword token is $99, PRINT
/* a5a2 */                   BNE.rel ("_a5c9");            // go save byte then continue crunching, branch always
/* a5a4 */        _`_a5a4`;  CMP.imm (0x30);               // compare with "0"
/* a5a6 */                   BCC.rel ("_a5ac");            // branch if <, continue crunching
/* a5a8 */                   CMP.imm (0x3c);               // compare with "<"
/* a5aa */                   BCC.rel ("_a5c9");            // if <, 0123456789:; go save byte then continue crunching
                                                           // gets here with next character not numeric, ";" or ":"
/* a5ac */        _`_a5ac`;  STY.zpg ("fbufpt+0_0071");    // copy save index
/* a5ae */                   LDY.imm (0x00);               // clear table pointer
/* a5b0 */                   STY.zpg ("count_000b");       // clear word index
/* a5b2 */                   DEY.imp ();                   // adjust for pre increment loop
/* a5b3 */                   STX.zpg ("txtptr+0_007a");    // save BASIC execute pointer low byte, buffer index
/* a5b5 */                   DEX.imp ();                   // adjust for pre increment loop
/* a5b6 */        _`_a5b6`;  INY.imp ();                   // next table byte
/* a5b7 */                   INX.imp ();                   // next buffer byte
/* a5b8 */        _`_a5b8`;  LDA.abx ("buf+0_0200");       // get byte from input buffer
/* a5bb */                   SEC.imp ();                   // set carry for subtract
/* a5bc */                   SBC.aby ("reslst_a09e");      // subtract table byte
/* a5bf */                   BEQ.rel ("_a5b6");            // go compare next if match
/* a5c1 */                   CMP.imm (0x80);               // was it end marker match ?
/* a5c3 */                   BNE.rel ("_a5f5");            // branch if not, not found keyword
                                                           // actually this works even if the input buffer byte is the
                                                           // end marker, i.e. a shifted character. As you can't enter
                                                           // any keywords as a single shifted character, see above,
                                                           // you can enter keywords in shorthand by shifting any
                                                           // character after the first. so RETURN can be entered as
                                                           // R[SHIFT]E, RE[SHIFT]T, RET[SHIFT]U or RETU[SHIFT]R.
                                                           // RETUR[SHIFT]N however will not work because the [SHIFT]N
                                                           // will match the RETURN end marker so the routine will try
                                                           // to match the next character.
                                                           // else found keyword
/* a5c5 */                   ORA.zpg ("count_000b");       // OR with word index, +$80 in A makes token
/* a5c7 */        _`_a5c7`;  LDY.zpg ("fbufpt+0_0071");    // restore save index
                                                           // save byte then continue crunching
/* a5c9 */        _`_a5c9`;  INX.imp ();                   // increment buffer read index
/* a5ca */                   INY.imp ();                   // increment save index
/* a5cb */                   STA.aby ("bstack+188_01fb");  // save byte to output
/* a5ce */                   LDA.aby ("bstack+188_01fb");  // get byte from output, set flags
/* a5d1 */                   BEQ.rel ("_a609");            // branch if was null [EOL]
                                                           // A holds the token here
/* a5d3 */                   SEC.imp ();                   // set carry for subtract
/* a5d4 */                   SBC.imm (0x3a);               // subtract ":"
/* a5d6 */                   BEQ.rel ("_a5dc");            // branch if it was (is now $00)
                                                           // A now holds token-':'
/* a5d8 */                   CMP.imm (0x49);               // compare with the token for DATA-':'
/* a5da */                   BNE.rel ("_a5de");            // if not DATA go try REM
                                                           // token was : or DATA
/* a5dc */        _`_a5dc`;  STA.zpg ("garbfl_000f");      // save the token-$3A
/* a5de */        _`_a5de`;  SEC.imp ();                   // set carry for subtract
/* a5df */                   SBC.imm (0x55);               // subtract the token for REM-':'
/* a5e1 */                   BNE.rel ("_a582");            // if wasn't REM crunch next bit of line
/* a5e3 */                   STA.zpg ("endchr_0008");      // else was REM so set search for [EOL]
                                                           // loop for "..." etc.
/* a5e5 */        _`_a5e5`;  LDA.abx ("buf+0_0200");       // get byte from input buffer
/* a5e8 */                   BEQ.rel ("_a5c9");            // if null [EOL] save byte then continue crunching
/* a5ea */                   CMP.zpg ("endchr_0008");      // compare with stored character
/* a5ec */                   BEQ.rel ("_a5c9");            // if match save byte then continue crunching
/* a5ee */        _`_a5ee`;  INY.imp ();                   // increment save index
/* a5ef */                   STA.aby ("bstack+188_01fb");  // save byte to output
/* a5f2 */                   INX.imp ();                   // increment buffer index
/* a5f3 */                   BNE.rel ("_a5e5");            // loop while <> 0, should never reach 0
                                                           // not found keyword this go
/* a5f5 */        _`_a5f5`;  LDX.zpg ("txtptr+0_007a");    // restore BASIC execute pointer low byte
/* a5f7 */                   INC.zpg ("count_000b");       // increment word index (next word)
                                                           // now find end of this word in the table
/* a5f9 */        _`_a5f9`;  INY.imp ();                   // increment table index
/* a5fa */                   LDA.aby (0xa09d);             // get table byte
/* a5fd */                   BPL.rel ("_a5f9");            // loop if not end of word yet
/* a5ff */                   LDA.aby ("reslst_a09e");      // get byte from keyword table
/* a602 */                   BNE.rel ("_a5b8");            // go test next word if not zero byte, end of table
                                                           // reached end of table with no match
/* a604 */                   LDA.abx ("buf+0_0200");       // restore byte from input buffer
/* a607 */                   BPL.rel ("_a5c7");            // branch always, all unmatched bytes in the buffer are
                                                           // $00 to $7F, go save byte in output and continue crunching
                                                           // reached [EOL]
/* a609 */        _`_a609`;  STA.aby ("bstack+190_01fd");  // save [EOL]
/* a60c */                   DEC.zpg ("txtptr+1_007b");    // decrement BASIC execute pointer high byte
/* a60e */                   LDA.imm (0xff);               // point to start of buffer-1
/* a610 */                   STA.zpg ("txtptr+0_007a");    // set BASIC execute pointer low byte
/* a612 */                   RTS.imp ();

// ------------------------------------------------------- // search BASIC for temporary integer line number
/* a613 */  _`fndlin_a613`;  LDA.zpg ("txttab+0_002b");    // get start of memory low byte
/* a615 */                   LDX.zpg ("txttab+1_002c");    // get start of memory high byte

// ------------------------------------------------------- // search Basic for temp integer line number from AX
                                                           // returns carry set if found
/* a617 */        _`_a617`;  LDY.imm (0x01);               // set index to next line pointer high byte
/* a619 */                   STA.zpg ("tempf2+3_005f");    // save low byte as current
/* a61b */                   STX.zpg ("tempf2+4_0060");    // save high byte as current
/* a61d */                   LDA.iny ("tempf2+3_005f");    // get next line pointer high byte from address
/* a61f */                   BEQ.rel ("_a640");            // pointer was zero so done, exit
/* a621 */                   INY.imp ();                   // increment index ...
/* a622 */                   INY.imp ();                   // ... to line # high byte
/* a623 */                   LDA.zpg ("linnum+1_0015");    // get temporary integer high byte
/* a625 */                   CMP.iny ("tempf2+3_005f");    // compare with line # high byte
/* a627 */                   BCC.rel ("_a641");            // exit if temp < this line, target line passed
/* a629 */                   BEQ.rel ("_a62e");            // go check low byte if =
/* a62b */                   DEY.imp ();                   // else decrement index
/* a62c */                   BNE.rel ("_a637");            // branch always
/* a62e */        _`_a62e`;  LDA.zpg ("linnum+0_0014");    // get temporary integer low byte
/* a630 */                   DEY.imp ();                   // decrement index to line # low byte
/* a631 */                   CMP.iny ("tempf2+3_005f");    // compare with line # low byte
/* a633 */                   BCC.rel ("_a641");            // exit if temp < this line, target line passed
/* a635 */                   BEQ.rel ("_a641");            // exit if temp = (found line#)
                                                           // not quite there yet
/* a637 */        _`_a637`;  DEY.imp ();                   // decrement index to next line pointer high byte
/* a638 */                   LDA.iny ("tempf2+3_005f");    // get next line pointer high byte
/* a63a */                   TAX.imp ();                   // copy to X
/* a63b */                   DEY.imp ();                   // decrement index to next line pointer low byte
/* a63c */                   LDA.iny ("tempf2+3_005f");    // get next line pointer low byte
/* a63e */                   BCS.rel ("_a617");            // go search for line # in temporary integer
                                                           // from AX, carry always set
/* a640 */        _`_a640`;  CLC.imp ();                   // clear found flag
/* a641 */        _`_a641`;  RTS.imp ();

// ------------------------------------------------------- // perform NEW
/* a642 */  _`scrtch_a642`;  BNE.rel ("_a641");            // exit if following byte to allow syntax error
/* a644 */                   LDA.imm (0x00);               // clear A
/* a646 */                   TAY.imp ();                   // clear index
/* a647 */                   STA.iny ("txttab+0_002b");    // clear pointer to next line low byte
/* a649 */                   INY.imp ();                   // increment index
/* a64a */                   STA.iny ("txttab+0_002b");    // clear pointer to next line high byte, erase program
/* a64c */                   LDA.zpg ("txttab+0_002b");    // get start of memory low byte
/* a64e */                   CLC.imp ();                   // clear carry for add
/* a64f */                   ADC.imm (0x02);               // add null program length
/* a651 */                   STA.zpg ("vartab+0_002d");    // set start of variables low byte
/* a653 */                   LDA.zpg ("txttab+1_002c");    // get start of memory high byte
/* a655 */                   ADC.imm (0x00);               // add carry
/* a657 */                   STA.zpg ("vartab+1_002e");    // set start of variables high byte

// ------------------------------------------------------- // reset execute pointer and do CLR
/* a659 */        _`_a659`;  JSR.abs ("stxpt_a68e");       // set BASIC execute pointer to start of memory - 1
/* a65c */                   LDA.imm (0x00);               // set Zb for CLR entry

// ------------------------------------------------------- // perform CLR
/* a65e */   _`clear_a65e`;  BNE.rel ("_a68d");            // exit if following byte to allow syntax error
/* a660 */        _`_a660`;  JSR.abs ("clall_ffe7");       // close all channels and files
/* a663 */                   LDA.zpg ("memsiz+0_0037");    // get end of memory low byte
/* a665 */                   LDY.zpg ("memsiz+1_0038");    // get end of memory high byte
/* a667 */                   STA.zpg ("fretop+0_0033");    // set bottom of string space low byte, clear strings
/* a669 */                   STY.zpg ("fretop+1_0034");    // set bottom of string space high byte
/* a66b */                   LDA.zpg ("vartab+0_002d");    // get start of variables low byte
/* a66d */                   LDY.zpg ("vartab+1_002e");    // get start of variables high byte
/* a66f */                   STA.zpg ("arytab+0_002f");    // set end of variables low byte, clear variables
/* a671 */                   STY.zpg ("arytab+1_0030");    // set end of variables high byte
/* a673 */                   STA.zpg ("strend+0_0031");    // set end of arrays low byte, clear arrays
/* a675 */                   STY.zpg ("strend+1_0032");    // set end of arrays high byte

// ------------------------------------------------------- // do RESTORE and clear stack
/* a677 */                   JSR.abs ("restor_a81d");      // perform RESTORE

// ------------------------------------------------------- // flush BASIC stack and clear the continue pointer
/* a67a */        _`_a67a`;  LDX.imm (0x19);               // get the descriptor stack start
/* a67c */                   STX.zpg ("temppt_0016");      // set the descriptor stack pointer
/* a67e */                   PLA.imp ();                   // pull the return address low byte
/* a67f */                   TAY.imp ();                   // copy it
/* a680 */                   PLA.imp ();                   // pull the return address high byte
/* a681 */                   LDX.imm (0xfa);               // set the cleared stack pointer
/* a683 */                   TXS.imp ();                   // set the stack
/* a684 */                   PHA.imp ();                   // push the return address high byte
/* a685 */                   TYA.imp ();                   // restore the return address low byte
/* a686 */                   PHA.imp ();                   // push the return address low byte
/* a687 */                   LDA.imm (0x00);               // clear A
/* a689 */                   STA.zpg ("oldtxt+1_003e");    // clear the continue pointer high byte
/* a68b */                   STA.zpg ("subflg_0010");      // clear the subscript/FNX flag
/* a68d */        _`_a68d`;  RTS.imp ();

// ------------------------------------------------------- // set BASIC execute pointer to start of memory - 1
/* a68e */   _`stxpt_a68e`;  CLC.imp ();                   // clear carry for add
/* a68f */                   LDA.zpg ("txttab+0_002b");    // get start of memory low byte
/* a691 */                   ADC.imm (0xff);               // add -1 low byte
/* a693 */                   STA.zpg ("txtptr+0_007a");    // set BASIC execute pointer low byte
/* a695 */                   LDA.zpg ("txttab+1_002c");    // get start of memory high byte
/* a697 */                   ADC.imm (0xff);               // add -1 high byte
/* a699 */                   STA.zpg ("txtptr+1_007b");    // save BASIC execute pointer high byte
/* a69b */                   RTS.imp ();

// ------------------------------------------------------- // perform LIST
/* a69c */    _`list_a69c`;  BCC.rel ("_a6a4");            // branch if next character not token (LIST n...)
/* a69e */                   BEQ.rel ("_a6a4");            // branch if next character [NULL] (LIST)
/* a6a0 */                   CMP.imm (0xab);               // compare with token for -
/* a6a2 */                   BNE.rel ("_a68d");            // exit if not - (LIST -m)
                                                           // LIST [[n][-m]]
                                                           // this bit sets the n , if present, as the start and end
/* a6a4 */        _`_a6a4`;  JSR.abs ("linget_a96b");      // get fixed-point number into temporary integer
/* a6a7 */                   JSR.abs ("fndlin_a613");      // search BASIC for temporary integer line number
/* a6aa */                   JSR.abs ("chrgot_0079");      // scan memory
/* a6ad */                   BEQ.rel ("_a6bb");            // branch if no more chrs
                                                           // this bit checks the - is present
/* a6af */                   CMP.imm (0xab);               // compare with token for -
/* a6b1 */                   BNE.rel ("_a641");            // return if not "-" (will be SN error)
                                                           // LIST [n]-m
                                                           // the - was there so set m as the end value
/* a6b3 */                   JSR.abs ("chrget+0_0073");    // increment and scan memory
/* a6b6 */                   JSR.abs ("linget_a96b");      // get fixed-point number into temporary integer
/* a6b9 */                   BNE.rel ("_a641");            // exit if not ok
/* a6bb */        _`_a6bb`;  PLA.imp ();                   // dump return address low byte, exit via warm start
/* a6bc */                   PLA.imp ();                   // dump return address high byte
/* a6bd */                   LDA.zpg ("linnum+0_0014");    // get temporary integer low byte
/* a6bf */                   ORA.zpg ("linnum+1_0015");    // OR temporary integer high byte
/* a6c1 */                   BNE.rel ("_a6c9");            // branch if start set
/* a6c3 */                   LDA.imm (0xff);               // set for -1
/* a6c5 */                   STA.zpg ("linnum+0_0014");    // set temporary integer low byte
/* a6c7 */                   STA.zpg ("linnum+1_0015");    // set temporary integer high byte
/* a6c9 */        _`_a6c9`;  LDY.imm (0x01);               // set index for line
/* a6cb */                   STY.zpg ("garbfl_000f");      // clear open quote flag
/* a6cd */                   LDA.iny ("tempf2+3_005f");    // get next line pointer high byte
/* a6cf */                   BEQ.rel ("_a714");            // if null all done so exit
/* a6d1 */                   JSR.abs ("stop_a82c");        // do CRTL-C check vector
/* a6d4 */                   JSR.abs ("crdo_aad7");        // print CR/LF
/* a6d7 */                   INY.imp ();                   // increment index for line
/* a6d8 */                   LDA.iny ("tempf2+3_005f");    // get line number low byte
/* a6da */                   TAX.imp ();                   // copy to X
/* a6db */                   INY.imp ();                   // increment index
/* a6dc */                   LDA.iny ("tempf2+3_005f");    // get line number high byte
/* a6de */                   CMP.zpg ("linnum+1_0015");    // compare with temporary integer high byte
/* a6e0 */                   BNE.rel ("_a6e6");            // branch if no high byte match
/* a6e2 */                   CPX.zpg ("linnum+0_0014");    // compare with temporary integer low byte
/* a6e4 */                   BEQ.rel ("_a6e8");            // branch if = last line to do, < will pass next branch
                                                           // else
/* a6e6 */        _`_a6e6`;  BCS.rel ("_a714");            // if greater all done so exit
/* a6e8 */        _`_a6e8`;  STY.zpg ("forpnt+0_0049");    // save index for line
/* a6ea */                   JSR.abs ("linprt_bdcd");      // print XA as unsigned integer
/* a6ed */                   LDA.imm (0x20);               // space is the next character
/* a6ef */        _`_a6ef`;  LDY.zpg ("forpnt+0_0049");    // get index for line
/* a6f1 */                   AND.imm (0x7f);               // mask top out bit of character
/* a6f3 */        _`_a6f3`;  JSR.abs ("_ab47");            // go print the character
/* a6f6 */                   CMP.imm (0x22);               // was it " character
/* a6f8 */                   BNE.rel ("_a700");            // if not skip the quote handle
                                                           // we are either entering or leaving a pair of quotes
/* a6fa */                   LDA.zpg ("garbfl_000f");      // get open quote flag
/* a6fc */                   EOR.imm (0xff);               // toggle it
/* a6fe */                   STA.zpg ("garbfl_000f");      // save it back
/* a700 */        _`_a700`;  INY.imp ();                   // increment index
/* a701 */                   BEQ.rel ("_a714");            // line too long so just bail out and do a warm start
/* a703 */                   LDA.iny ("tempf2+3_005f");    // get next byte
/* a705 */                   BNE.rel ("qplop_a717");       // if not [EOL] (go print character)
                                                           // was [EOL]
/* a707 */                   TAY.imp ();                   // else clear index
/* a708 */                   LDA.iny ("tempf2+3_005f");    // get next line pointer low byte
/* a70a */                   TAX.imp ();                   // copy to X
/* a70b */                   INY.imp ();                   // increment index
/* a70c */                   LDA.iny ("tempf2+3_005f");    // get next line pointer high byte
/* a70e */                   STX.zpg ("tempf2+3_005f");    // set pointer to line low byte
/* a710 */                   STA.zpg ("tempf2+4_0060");    // set pointer to line high byte
/* a712 */                   BNE.rel ("_a6c9");            // go do next line if not [EOT]
                                                           // else ...
/* a714 */        _`_a714`;  JMP.abs ("_e386");            // do warm start
/* a717 */   _`qplop_a717`;  JMP.ind ("iqplop+0_0306");    // do uncrunch BASIC tokens

// ------------------------------------------------------- // uncrunch BASIC tokens, the uncrunch BASIC tokens vector is initialised to point here
/* a71a */                   BPL.rel ("_a6f3");            // just go print it if not token byte
                                                           // else was token byte so uncrunch it
/* a71c */                   CMP.imm (0xff);               // compare with the token for PI. in this case the token
                                                           // is the same as the PI character so it just needs printing
/* a71e */                   BEQ.rel ("_a6f3");            // just print it if so
/* a720 */                   BIT.zpg ("garbfl_000f");      // test the open quote flag
/* a722 */                   BMI.rel ("_a6f3");            // just go print character if open quote set
/* a724 */                   SEC.imp ();                   // else set carry for subtract
/* a725 */                   SBC.imm (0x7f);               // reduce token range to 1 to whatever
/* a727 */                   TAX.imp ();                   // copy token # to X
/* a728 */                   STY.zpg ("forpnt+0_0049");    // save index for line
/* a72a */                   LDY.imm (0xff);               // start from -1, adjust for pre increment
/* a72c */        _`_a72c`;  DEX.imp ();                   // decrement token #
/* a72d */                   BEQ.rel ("_a737");            // if now found go do printing
/* a72f */        _`_a72f`;  INY.imp ();                   // else increment index
/* a730 */                   LDA.aby ("reslst_a09e");      // get byte from keyword table
/* a733 */                   BPL.rel ("_a72f");            // loop until keyword end marker
/* a735 */                   BMI.rel ("_a72c");            // go test if this is required keyword, branch always
                                                           // found keyword, it's the next one
/* a737 */        _`_a737`;  INY.imp ();                   // increment keyword table index
/* a738 */                   LDA.aby ("reslst_a09e");      // get byte from table
/* a73b */                   BMI.rel ("_a6ef");            // go restore index, mask byte and print if
                                                           // byte was end marker
/* a73d */                   JSR.abs ("_ab47");            // else go print the character
/* a740 */                   BNE.rel ("_a737");            // go get next character, branch always

// ------------------------------------------------------- // perform FOR
/* a742 */     _`for_a742`;  LDA.imm (0x80);               // set FNX
/* a744 */                   STA.zpg ("subflg_0010");      // set subscript/FNX flag
/* a746 */                   JSR.abs ("let_a9a5");         // perform LET
/* a749 */                   JSR.abs ("fndfor_a38a");      // search the stack for FOR or GOSUB activity
/* a74c */                   BNE.rel ("_a753");            // branch if FOR, this variable, not found
                                                           // FOR, this variable, was found so first we dump the old one
/* a74e */                   TXA.imp ();                   // copy index
/* a74f */                   ADC.imm (0x0f);               // add FOR structure size-2
/* a751 */                   TAX.imp ();                   // copy to index
/* a752 */                   TXS.imp ();                   // set stack (dump FOR structure (-2 bytes))
/* a753 */        _`_a753`;  PLA.imp ();                   // pull return address
/* a754 */                   PLA.imp ();                   // pull return address
/* a755 */                   LDA.imm (0x09);               // we need 18d bytes !
/* a757 */                   JSR.abs ("getstk_a3fb");      // check room on stack for 2*A bytes
/* a75a */                   JSR.abs ("datan_a906");       // scan for next BASIC statement ([:] or [EOL])
/* a75d */                   CLC.imp ();                   // clear carry for add
/* a75e */                   TYA.imp ();                   // copy index to A
/* a75f */                   ADC.zpg ("txtptr+0_007a");    // add BASIC execute pointer low byte
/* a761 */                   PHA.imp ();                   // push onto stack
/* a762 */                   LDA.zpg ("txtptr+1_007b");    // get BASIC execute pointer high byte
/* a764 */                   ADC.imm (0x00);               // add carry
/* a766 */                   PHA.imp ();                   // push onto stack
/* a767 */                   LDA.zpg ("curlin+1_003a");    // get current line number high byte
/* a769 */                   PHA.imp ();                   // push onto stack
/* a76a */                   LDA.zpg ("curlin+0_0039");    // get current line number low byte
/* a76c */                   PHA.imp ();                   // push onto stack
/* a76d */                   LDA.imm (0xa4);               // set "TO" token
/* a76f */                   JSR.abs ("chkcom_aeff");      // scan for CHR$(A), else do syntax error then warm start
/* a772 */                   JSR.abs ("_ad8d");            // check if source is numeric, else do type mismatch
/* a775 */                   JSR.abs ("frmnum_ad8a");      // evaluate expression and check is numeric, else do
                                                           // type mismatch
/* a778 */                   LDA.zpg ("facsgn_0066");      // get FAC1 sign (b7)
/* a77a */                   ORA.imm (0x7f);               // set all non sign bits
/* a77c */                   AND.zpg ("facho+0_0062");     // and FAC1 mantissa 1
/* a77e */                   STA.zpg ("facho+0_0062");     // save FAC1 mantissa 1
/* a780 */                   LDA.imm (0x8b);               // set return address low byte
/* a782 */                   LDY.imm (0xa7);               // set return address high byte
/* a784 */                   STA.zpg ("index+0_0022");     // save return address low byte
/* a786 */                   STY.zpg ("index+1_0023");     // save return address high byte
/* a788 */                   JMP.abs ("_ae43");            // round FAC1 and put on stack, returns to next instruction
/* a78b */                   LDA.imm (0xbc);               // set 1 pointer low address, default step size
/* a78d */                   LDY.imm (0xb9);               // set 1 pointer high address
/* a78f */                   JSR.abs ("movfm_bba2");       // unpack memory (AY) into FAC1
/* a792 */                   JSR.abs ("chrgot_0079");      // scan memory
/* a795 */                   CMP.imm (0xa9);               // compare with STEP token
/* a797 */                   BNE.rel ("_a79f");            // if not "STEP" continue
                                                           // was step so ....
/* a799 */                   JSR.abs ("chrget+0_0073");    // increment and scan memory
/* a79c */                   JSR.abs ("frmnum_ad8a");      // evaluate expression and check is numeric, else do
                                                           // type mismatch
/* a79f */        _`_a79f`;  JSR.abs ("sign_bc2b");        // get FAC1 sign, return A = $FF -ve, A = $01 +ve
/* a7a2 */                   JSR.abs ("_ae38");            // push sign, round FAC1 and put on stack
/* a7a5 */                   LDA.zpg ("forpnt+1_004a");    // get FOR/NEXT variable pointer high byte
/* a7a7 */                   PHA.imp ();                   // push on stack
/* a7a8 */                   LDA.zpg ("forpnt+0_0049");    // get FOR/NEXT variable pointer low byte
/* a7aa */                   PHA.imp ();                   // push on stack
/* a7ab */                   LDA.imm (0x81);               // get FOR token
/* a7ad */                   PHA.imp ();                   // push on stack

// ------------------------------------------------------- // interpreter inner loop
/* a7ae */  _`newstt_a7ae`;  JSR.abs ("stop_a82c");        // do CRTL-C check vector
/* a7b1 */                   LDA.zpg ("txtptr+0_007a");    // get the BASIC execute pointer low byte
/* a7b3 */                   LDY.zpg ("txtptr+1_007b");    // get the BASIC execute pointer high byte
/* a7b5 */                   CPY.imm (0x02);               // compare the high byte with $02xx
/* a7b7 */                   NOP.imp ();                   // unused byte
/* a7b8 */                   BEQ.rel ("_a7be");            // if immediate mode skip the continue pointer save
/* a7ba */                   STA.zpg ("oldtxt+0_003d");    // save the continue pointer low byte
/* a7bc */                   STY.zpg ("oldtxt+1_003e");    // save the continue pointer high byte
/* a7be */        _`_a7be`;  LDY.imm (0x00);               // clear the index
/* a7c0 */                   LDA.iny ("txtptr+0_007a");    // get a BASIC byte
/* a7c2 */                   BNE.rel ("_a807");            // if not [EOL] go test for ":"
/* a7c4 */   _`ckeol_a7c4`;  LDY.imm (0x02);               // else set the index
/* a7c6 */                   LDA.iny ("txtptr+0_007a");    // get next line pointer high byte
/* a7c8 */                   CLC.imp ();                   // clear carry for no "BREAK" message
/* a7c9 */                   BNE.rel ("_a7ce");            // branch if not end of program
/* a7cb */                   JMP.abs ("_a84b");            // else go to immediate mode,was immediate or [EOT] marker
/* a7ce */        _`_a7ce`;  INY.imp ();                   // increment index
/* a7cf */                   LDA.iny ("txtptr+0_007a");    // get line number low byte
/* a7d1 */                   STA.zpg ("curlin+0_0039");    // save current line number low byte
/* a7d3 */                   INY.imp ();                   // increment index
/* a7d4 */                   LDA.iny ("txtptr+0_007a");    // get line # high byte
/* a7d6 */                   STA.zpg ("curlin+1_003a");    // save current line number high byte
/* a7d8 */                   TYA.imp ();                   // A now = 4
/* a7d9 */                   ADC.zpg ("txtptr+0_007a");    // add BASIC execute pointer low byte, now points to code
/* a7db */                   STA.zpg ("txtptr+0_007a");    // save BASIC execute pointer low byte
/* a7dd */                   BCC.rel ("_a7e1");            // branch if no overflow
/* a7df */                   INC.zpg ("txtptr+1_007b");    // else increment BASIC execute pointer high byte
/* a7e1 */        _`_a7e1`;  JMP.ind ("igone+0_0308");     // do start new BASIC code

// ------------------------------------------------------- // start new BASIC code, the start new BASIC code vector is initialised to point here
/* a7e4 */    _`gone_a7e4`;  JSR.abs ("chrget+0_0073");    // increment and scan memory
/* a7e7 */                   JSR.abs ("gone3_a7ed");       // go interpret BASIC code from BASIC execute pointer
/* a7ea */                   JMP.abs ("newstt_a7ae");      // loop

// ------------------------------------------------------- // go interpret BASIC code from BASIC execute pointer
/* a7ed */   _`gone3_a7ed`;  BEQ.rel ("_a82b");            // if the first byte is null just exit
/* a7ef */        _`_a7ef`;  SBC.imm (0x80);               // normalise the token
/* a7f1 */                   BCC.rel ("_a804");            // if wasn't token go do LET
/* a7f3 */                   CMP.imm (0x23);               // compare with token for TAB(-$80
/* a7f5 */                   BCS.rel ("_a80e");            // branch if >= TAB(
/* a7f7 */                   ASL.acc ();                   // *2 bytes per vector
/* a7f8 */                   TAY.imp ();                   // copy to index
/* a7f9 */                   LDA.aby (0xa00d);             // get vector high byte
/* a7fc */                   PHA.imp ();                   // push on stack
/* a7fd */                   LDA.aby ("stmdsp_a00c");      // get vector low byte
/* a800 */                   PHA.imp ();                   // push on stack
/* a801 */                   JMP.abs ("chrget+0_0073");    // increment and scan memory and return. the return in
                                                           // this case calls the command code, the return from
                                                           // that will eventually return to the interpreter inner
                                                           // loop above
/* a804 */        _`_a804`;  JMP.abs ("let_a9a5");         // perform LET
                                                           // was not [EOL]
/* a807 */        _`_a807`;  CMP.imm (0x3a);               // comapre with ":"
/* a809 */                   BEQ.rel ("_a7e1");            // if ":" go execute new code
                                                           // else ...
/* a80b */        _`_a80b`;  JMP.abs ("synerr_af08");      // do syntax error then warm start
                                                           // token was >= TAB(
/* a80e */        _`_a80e`;  CMP.imm (0x4b);               // compare with the token for GO
/* a810 */                   BNE.rel ("_a80b");            // if not "GO" do syntax error then warm start
                                                           // else was "GO"
/* a812 */                   JSR.abs ("chrget+0_0073");    // increment and scan memory
/* a815 */                   LDA.imm (0xa4);               // set "TO" token
/* a817 */                   JSR.abs ("chkcom_aeff");      // scan for CHR$(A), else do syntax error then warm start
/* a81a */                   JMP.abs ("goto_a8a0");        // perform GOTO

// ------------------------------------------------------- // perform RESTORE
/* a81d */  _`restor_a81d`;  SEC.imp ();                   // set carry for subtract
/* a81e */                   LDA.zpg ("txttab+0_002b");    // get start of memory low byte
/* a820 */                   SBC.imm (0x01);               // -1
/* a822 */                   LDY.zpg ("txttab+1_002c");    // get start of memory high byte
/* a824 */                   BCS.rel ("_a827");            // branch if no rollunder
/* a826 */                   DEY.imp ();                   // else decrement high byte
/* a827 */        _`_a827`;  STA.zpg ("datptr+0_0041");    // set DATA pointer low byte
/* a829 */                   STY.zpg ("datptr+1_0042");    // set DATA pointer high byte
/* a82b */        _`_a82b`;  RTS.imp ();

// ------------------------------------------------------- // do CRTL-C check vector
/* a82c */    _`stop_a82c`;  JSR.abs ("stop_ffe1");        // scan stop key

// ------------------------------------------------------- // perform STOP
/* a82f */                   BCS.rel ("_a832");            // if carry set do BREAK instead of just END

// ------------------------------------------------------- // perform END
/* a831 */     _`end_a831`;  CLC.imp ();                   // clear carry
/* a832 */        _`_a832`;  BNE.rel ("_a870");            // return if wasn't CTRL-C
/* a834 */                   LDA.zpg ("txtptr+0_007a");    // get BASIC execute pointer low byte
/* a836 */                   LDY.zpg ("txtptr+1_007b");    // get BASIC execute pointer high byte
/* a838 */                   LDX.zpg ("curlin+1_003a");    // get current line number high byte
/* a83a */                   INX.imp ();                   // increment it
/* a83b */                   BEQ.rel ("_a849");            // branch if was immediate mode
/* a83d */                   STA.zpg ("oldtxt+0_003d");    // save continue pointer low byte
/* a83f */                   STY.zpg ("oldtxt+1_003e");    // save continue pointer high byte
/* a841 */                   LDA.zpg ("curlin+0_0039");    // get current line number low byte
/* a843 */                   LDY.zpg ("curlin+1_003a");    // get current line number high byte
/* a845 */                   STA.zpg ("oldlin+0_003b");    // save break line number low byte
/* a847 */                   STY.zpg ("oldlin+1_003c");    // save break line number high byte
/* a849 */        _`_a849`;  PLA.imp ();                   // dump return address low byte
/* a84a */                   PLA.imp ();                   // dump return address high byte
/* a84b */        _`_a84b`;  LDA.imm (0x81);               // set [CR][LF]"BREAK" pointer low byte
/* a84d */                   LDY.imm (0xa3);               // set [CR][LF]"BREAK" pointer high byte
/* a84f */                   BCC.rel ("_a854");            // if was program end skip the print string
/* a851 */                   JMP.abs ("errfin_a469");      // print string and do warm start
/* a854 */        _`_a854`;  JMP.abs ("_e386");            // do warm start

// ------------------------------------------------------- // perform CONT
/* a857 */    _`cont_a857`;  BNE.rel ("_a870");            // exit if following byte to allow syntax error
/* a859 */                   LDX.imm (0x1a);               // error code $1A, can't continue error
/* a85b */                   LDY.zpg ("oldtxt+1_003e");    // get continue pointer high byte
/* a85d */                   BNE.rel ("_a862");            // go do continue if we can
/* a85f */                   JMP.abs ("error_a437");       // else do error #X then warm start
                                                           // we can continue so ...
/* a862 */        _`_a862`;  LDA.zpg ("oldtxt+0_003d");    // get continue pointer low byte
/* a864 */                   STA.zpg ("txtptr+0_007a");    // save BASIC execute pointer low byte
/* a866 */                   STY.zpg ("txtptr+1_007b");    // save BASIC execute pointer high byte
/* a868 */                   LDA.zpg ("oldlin+0_003b");    // get break line low byte
/* a86a */                   LDY.zpg ("oldlin+1_003c");    // get break line high byte
/* a86c */                   STA.zpg ("curlin+0_0039");    // set current line number low byte
/* a86e */                   STY.zpg ("curlin+1_003a");    // set current line number high byte
/* a870 */        _`_a870`;  RTS.imp ();

// ------------------------------------------------------- // perform RUN
/* a871 */     _`run_a871`;  PHP.imp ();                   // save status
/* a872 */                   LDA.imm (0x00);               // no control or kernal messages
/* a874 */                   JSR.abs ("setmsg_ff90");      // control kernal messages
/* a877 */                   PLP.imp ();                   // restore status
/* a878 */                   BNE.rel ("_a87d");            // branch if RUN n
/* a87a */                   JMP.abs ("_a659");            // reset execution to start, clear variables, flush stack
                                                           // and return
/* a87d */        _`_a87d`;  JSR.abs ("_a660");            // go do "CLEAR"
/* a880 */                   JMP.abs ("_a897");            // get n and do GOTO n

// ------------------------------------------------------- // perform GOSUB
/* a883 */   _`gosub_a883`;  LDA.imm (0x03);               // need 6 bytes for GOSUB
/* a885 */                   JSR.abs ("getstk_a3fb");      // check room on stack for 2*A bytes
/* a888 */                   LDA.zpg ("txtptr+1_007b");    // get BASIC execute pointer high byte
/* a88a */                   PHA.imp ();                   // save it
/* a88b */                   LDA.zpg ("txtptr+0_007a");    // get BASIC execute pointer low byte
/* a88d */                   PHA.imp ();                   // save it
/* a88e */                   LDA.zpg ("curlin+1_003a");    // get current line number high byte
/* a890 */                   PHA.imp ();                   // save it
/* a891 */                   LDA.zpg ("curlin+0_0039");    // get current line number low byte
/* a893 */                   PHA.imp ();                   // save it
/* a894 */                   LDA.imm (0x8d);               // token for GOSUB
/* a896 */                   PHA.imp ();                   // save it
/* a897 */        _`_a897`;  JSR.abs ("chrgot_0079");      // scan memory
/* a89a */                   JSR.abs ("goto_a8a0");        // perform GOTO
/* a89d */                   JMP.abs ("newstt_a7ae");      // go do interpreter inner loop

// ------------------------------------------------------- // perform GOTO
/* a8a0 */    _`goto_a8a0`;  JSR.abs ("linget_a96b");      // get fixed-point number into temporary integer
/* a8a3 */                   JSR.abs ("_a909");            // scan for next BASIC line
/* a8a6 */                   SEC.imp ();                   // set carry for subtract
/* a8a7 */                   LDA.zpg ("curlin+0_0039");    // get current line number low byte
/* a8a9 */                   SBC.zpg ("linnum+0_0014");    // subtract temporary integer low byte
/* a8ab */                   LDA.zpg ("curlin+1_003a");    // get current line number high byte
/* a8ad */                   SBC.zpg ("linnum+1_0015");    // subtract temporary integer high byte
/* a8af */                   BCS.rel ("_a8bc");            // if current line number >= temporary integer, go search
                                                           // from the start of memory
/* a8b1 */                   TYA.imp ();                   // else copy line index to A
/* a8b2 */                   SEC.imp ();                   // set carry (+1)
/* a8b3 */                   ADC.zpg ("txtptr+0_007a");    // add BASIC execute pointer low byte
/* a8b5 */                   LDX.zpg ("txtptr+1_007b");    // get BASIC execute pointer high byte
/* a8b7 */                   BCC.rel ("_a8c0");            // branch if no overflow to high byte
/* a8b9 */                   INX.imp ();                   // increment high byte
/* a8ba */                   BCS.rel ("_a8c0");            // branch always (can never be carry)

// ------------------------------------------------------- // search for line number in temporary integer from start of memory pointer
/* a8bc */        _`_a8bc`;  LDA.zpg ("txttab+0_002b");    // get start of memory low byte
/* a8be */                   LDX.zpg ("txttab+1_002c");    // get start of memory high byte

// ------------------------------------------------------- // search for line # in temporary integer from (AX)
/* a8c0 */        _`_a8c0`;  JSR.abs ("_a617");            // search Basic for temp integer line number from AX
/* a8c3 */                   BCC.rel ("_a8e3");            // if carry clear go do unsdefined statement error
                                                           // carry all ready set for subtract
/* a8c5 */                   LDA.zpg ("tempf2+3_005f");    // get pointer low byte
/* a8c7 */                   SBC.imm (0x01);               // -1
/* a8c9 */                   STA.zpg ("txtptr+0_007a");    // save BASIC execute pointer low byte
/* a8cb */                   LDA.zpg ("tempf2+4_0060");    // get pointer high byte
/* a8cd */                   SBC.imm (0x00);               // subtract carry
/* a8cf */                   STA.zpg ("txtptr+1_007b");    // save BASIC execute pointer high byte
/* a8d1 */        _`_a8d1`;  RTS.imp ();

// ------------------------------------------------------- // perform RETURN
/* a8d2 */  _`return_a8d2`;  BNE.rel ("_a8d1");            // exit if following token to allow syntax error
/* a8d4 */                   LDA.imm (0xff);               // set byte so no match possible
/* a8d6 */                   STA.zpg ("forpnt+1_004a");    // save FOR/NEXT variable pointer high byte
/* a8d8 */                   JSR.abs ("fndfor_a38a");      // search the stack for FOR or GOSUB activity,
                                                           // get token off stack
/* a8db */                   TXS.imp ();                   // correct the stack
/* a8dc */                   CMP.imm (0x8d);               // compare with GOSUB token
/* a8de */                   BEQ.rel ("_a8eb");            // if matching GOSUB go continue RETURN
/* a8e0 */                   LDX.imm (0x0c);               // else error code $04, return without gosub error
/* a8e2 */                   _.bytes(0x2c);                // makes next line BIT $11A2
/* a8e3 */        _`_a8e3`;  LDX.imm (0x11);               // error code $11, undefined statement error
/* a8e5 */                   JMP.abs ("error_a437");       // do error #X then warm start
/* a8e8 */        _`_a8e8`;  JMP.abs ("synerr_af08");      // do syntax error then warm start
                                                           // was matching GOSUB token
/* a8eb */        _`_a8eb`;  PLA.imp ();                   // dump token byte
/* a8ec */                   PLA.imp ();                   // pull return line low byte
/* a8ed */                   STA.zpg ("curlin+0_0039");    // save current line number low byte
/* a8ef */                   PLA.imp ();                   // pull return line high byte
/* a8f0 */                   STA.zpg ("curlin+1_003a");    // save current line number high byte
/* a8f2 */                   PLA.imp ();                   // pull return address low byte
/* a8f3 */                   STA.zpg ("txtptr+0_007a");    // save BASIC execute pointer low byte
/* a8f5 */                   PLA.imp ();                   // pull return address high byte
/* a8f6 */                   STA.zpg ("txtptr+1_007b");    // save BASIC execute pointer high byte

// ------------------------------------------------------- // perform DATA
/* a8f8 */    _`data_a8f8`;  JSR.abs ("datan_a906");       // scan for next BASIC statement ([:] or [EOL])

// ------------------------------------------------------- // add Y to the BASIC execute pointer
/* a8fb */        _`_a8fb`;  TYA.imp ();                   // copy index to A
/* a8fc */                   CLC.imp ();                   // clear carry for add
/* a8fd */                   ADC.zpg ("txtptr+0_007a");    // add BASIC execute pointer low byte
/* a8ff */                   STA.zpg ("txtptr+0_007a");    // save BASIC execute pointer low byte
/* a901 */                   BCC.rel ("_a905");            // skip increment if no carry
/* a903 */                   INC.zpg ("txtptr+1_007b");    // else increment BASIC execute pointer high byte
/* a905 */        _`_a905`;  RTS.imp ();

// ------------------------------------------------------- // scan for next BASIC statement ([:] or [EOL])
                                                           // returns Y as index to [:] or [EOL]
/* a906 */   _`datan_a906`;  LDX.imm (0x3a);               // set look for character = ":"
/* a908 */                   _.bytes(0x2c);                // makes next line BIT $00A2

// ------------------------------------------------------- // scan for next BASIC line
                                                           // returns Y as index to [EOL]
/* a909 */        _`_a909`;  LDX.imm (0x00);               // set alternate search character = [EOL]
/* a90b */                   STX.zpg ("charac_0007");      // store alternate search character
/* a90d */                   LDY.imm (0x00);               // set search character = [EOL]
/* a90f */                   STY.zpg ("endchr_0008");      // save the search character
/* a911 */        _`_a911`;  LDA.zpg ("endchr_0008");      // get search character
/* a913 */                   LDX.zpg ("charac_0007");      // get alternate search character
/* a915 */                   STA.zpg ("charac_0007");      // make search character = alternate search character
/* a917 */                   STX.zpg ("endchr_0008");      // make alternate search character = search character
/* a919 */        _`_a919`;  LDA.iny ("txtptr+0_007a");    // get BASIC byte
/* a91b */                   BEQ.rel ("_a905");            // exit if null [EOL]
/* a91d */                   CMP.zpg ("endchr_0008");      // compare with search character
/* a91f */                   BEQ.rel ("_a905");            // exit if found
/* a921 */                   INY.imp ();                   // else increment index
/* a922 */                   CMP.imm (0x22);               // compare current character with open quote
/* a924 */                   BNE.rel ("_a919");            // if found go swap search character for alternate search
                                                           // character
/* a926 */                   BEQ.rel ("_a911");            // loop for next character, branch always

// ------------------------------------------------------- // perform IF
/* a928 */      _`if_a928`;  JSR.abs ("frmevl_ad9e");      // evaluate expression
/* a92b */                   JSR.abs ("chrgot_0079");      // scan memory
/* a92e */                   CMP.imm (0x89);               // compare with "GOTO" token
/* a930 */                   BEQ.rel ("_a937");            // if it was  the token for GOTO go do IF ... GOTO
                                                           // wasn't IF ... GOTO so must be IF ... THEN
/* a932 */                   LDA.imm (0xa7);               // set "THEN" token
/* a934 */                   JSR.abs ("chkcom_aeff");      // scan for CHR$(A), else do syntax error then warm start
/* a937 */        _`_a937`;  LDA.zpg ("facexp_0061");      // get FAC1 exponent
/* a939 */                   BNE.rel ("_a940");            // if result was non zero continue execution
                                                           // else REM rest of line

// ------------------------------------------------------- // perform REM
/* a93b */     _`rem_a93b`;  JSR.abs ("_a909");            // scan for next BASIC line
/* a93e */                   BEQ.rel ("_a8fb");            // add Y to the BASIC execute pointer and return, branch
                                                           // always
                                                           // result was non zero so do rest of line
/* a940 */        _`_a940`;  JSR.abs ("chrgot_0079");      // scan memory
/* a943 */                   BCS.rel ("_a948");            // branch if not numeric character, is variable or keyword
/* a945 */                   JMP.abs ("goto_a8a0");        // else perform GOTO n
                                                           // is variable or keyword
/* a948 */        _`_a948`;  JMP.abs ("gone3_a7ed");       // interpret BASIC code from BASIC execute pointer

// ------------------------------------------------------- // perform ON
/* a94b */  _`ongoto_a94b`;  JSR.abs ("_b79e");            // get byte parameter
/* a94e */                   PHA.imp ();                   // push next character
/* a94f */                   CMP.imm (0x8d);               // compare with GOSUB token
/* a951 */                   BEQ.rel ("_a957");            // if GOSUB go see if it should be executed
/* a953 */        _`_a953`;  CMP.imm (0x89);               // compare with GOTO token
/* a955 */                   BNE.rel ("_a8e8");            // if not GOTO do syntax error then warm start
                                                           // next character was GOTO or GOSUB, see if it should be executed
/* a957 */        _`_a957`;  DEC.zpg ("facho+3_0065");     // decrement the byte value
/* a959 */                   BNE.rel ("_a95f");            // if not zero go see if another line number exists
/* a95b */                   PLA.imp ();                   // pull keyword token
/* a95c */                   JMP.abs ("_a7ef");            // go execute it
/* a95f */        _`_a95f`;  JSR.abs ("chrget+0_0073");    // increment and scan memory
/* a962 */                   JSR.abs ("linget_a96b");      // get fixed-point number into temporary integer
                                                           // skip this n
/* a965 */                   CMP.imm (0x2c);               // compare next character with ","
/* a967 */                   BEQ.rel ("_a957");            // loop if ","
/* a969 */                   PLA.imp ();                   // else pull keyword token, ran out of options
/* a96a */        _`_a96a`;  RTS.imp ();

// ------------------------------------------------------- // get fixed-point number into temporary integer
/* a96b */  _`linget_a96b`;  LDX.imm (0x00);               // clear X
/* a96d */                   STX.zpg ("linnum+0_0014");    // clear temporary integer low byte
/* a96f */                   STX.zpg ("linnum+1_0015");    // clear temporary integer high byte
/* a971 */        _`_a971`;  BCS.rel ("_a96a");            // return if carry set, end of scan, character was not 0-9
/* a973 */                   SBC.imm (0x2f);               // subtract $30, $2F+carry, from byte
/* a975 */                   STA.zpg ("charac_0007");      // store #
/* a977 */                   LDA.zpg ("linnum+1_0015");    // get temporary integer high byte
/* a979 */                   STA.zpg ("index+0_0022");     // save it for now
/* a97b */                   CMP.imm (0x19);               // compare with $19
/* a97d */                   BCS.rel ("_a953");            // branch if >= this makes the maximum line number 63999
                                                           // because the next bit does $1900 * $0A = $FA00 = 64000
                                                           // decimal. the branch target is really the SYNTAX error
                                                           // at $A8E8 but that is too far so an intermediate
                                                           // compare and branch to that location is used. the problem
                                                           // with this is that line number that gives a partial result
                                                           // from $8900 to $89FF, 35072x to 35327x, will pass the new
                                                           // target compare and will try to execute the remainder of
                                                           // the ON n GOTO/GOSUB. a solution to this is to copy the
                                                           // byte in A before the branch to X and then branch to
                                                           // $A955 skipping the second compare
/* a97f */                   LDA.zpg ("linnum+0_0014");    // get temporary integer low byte
/* a981 */                   ASL.acc ();                   // *2 low byte
/* a982 */                   ROL.zpg ("index+0_0022");     // *2 high byte
/* a984 */                   ASL.acc ();                   // *2 low byte
/* a985 */                   ROL.zpg ("index+0_0022");     // *2 high byte (*4)
/* a987 */                   ADC.zpg ("linnum+0_0014");    // + low byte (*5)
/* a989 */                   STA.zpg ("linnum+0_0014");    // save it
/* a98b */                   LDA.zpg ("index+0_0022");     // get high byte temp
/* a98d */                   ADC.zpg ("linnum+1_0015");    // + high byte (*5)
/* a98f */                   STA.zpg ("linnum+1_0015");    // save it
/* a991 */                   ASL.zpg ("linnum+0_0014");    // *2 low byte (*10d)
/* a993 */                   ROL.zpg ("linnum+1_0015");    // *2 high byte (*10d)
/* a995 */                   LDA.zpg ("linnum+0_0014");    // get low byte
/* a997 */                   ADC.zpg ("charac_0007");      // add #
/* a999 */                   STA.zpg ("linnum+0_0014");    // save low byte
/* a99b */                   BCC.rel ("_a99f");            // branch if no overflow to high byte
/* a99d */                   INC.zpg ("linnum+1_0015");    // else increment high byte
/* a99f */        _`_a99f`;  JSR.abs ("chrget+0_0073");    // increment and scan memory
/* a9a2 */                   JMP.abs ("_a971");            // loop for next character

// ------------------------------------------------------- // perform LET
/* a9a5 */     _`let_a9a5`;  JSR.abs ("ptrget_b08b");      // get variable address
/* a9a8 */                   STA.zpg ("forpnt+0_0049");    // save variable address low byte
/* a9aa */                   STY.zpg ("forpnt+1_004a");    // save variable address high byte
/* a9ac */                   LDA.imm (0xb2);               // $B2 is "=" token
/* a9ae */                   JSR.abs ("chkcom_aeff");      // scan for CHR$(A), else do syntax error then warm start
/* a9b1 */                   LDA.zpg ("intflg_000e");      // get data type flag, $80 = integer, $00 = float
/* a9b3 */                   PHA.imp ();                   // push data type flag
/* a9b4 */                   LDA.zpg ("valtyp_000d");      // get data type flag, $FF = string, $00 = numeric
/* a9b6 */                   PHA.imp ();                   // push data type flag
/* a9b7 */                   JSR.abs ("frmevl_ad9e");      // evaluate expression
/* a9ba */                   PLA.imp ();                   // pop data type flag
/* a9bb */                   ROL.acc ();                   // string bit into carry
/* a9bc */                   JSR.abs ("_ad90");            // do type match check
/* a9bf */                   BNE.rel ("putstr_a9d9");      // branch if string
/* a9c1 */                   PLA.imp ();                   // pop integer/float data type flag
                                                           // assign value to numeric variable
/* a9c2 */        _`_a9c2`;  BPL.rel ("ptflpt_a9d6");      // branch if float
                                                           // expression is numeric integer
/* a9c4 */  _`putint_a9c4`;  JSR.abs ("round_bc1b");       // round FAC1
/* a9c7 */                   JSR.abs ("ayint_b1bf");       // evaluate integer expression, no sign check
/* a9ca */                   LDY.imm (0x00);               // clear index
/* a9cc */                   LDA.zpg ("facho+2_0064");     // get FAC1 mantissa 3
/* a9ce */                   STA.iny ("forpnt+0_0049");    // save as integer variable low byte
/* a9d0 */                   INY.imp ();                   // increment index
/* a9d1 */                   LDA.zpg ("facho+3_0065");     // get FAC1 mantissa 4
/* a9d3 */                   STA.iny ("forpnt+0_0049");    // save as integer variable high byte
/* a9d5 */                   RTS.imp ();
/* a9d6 */  _`ptflpt_a9d6`;  JMP.abs ("_bbd0");            // pack FAC1 into variable pointer and return
                                                           // assign value to numeric variable
/* a9d9 */  _`putstr_a9d9`;  PLA.imp ();                   // dump integer/float data type flag
/* a9da */        _`_a9da`;  LDY.zpg ("forpnt+1_004a");    // get variable pointer high byte
/* a9dc */                   CPY.imm (0xbf);               // was it TI$ pointer
/* a9de */                   BNE.rel ("getspt_aa2c");      // branch if not
                                                           // else it's TI$ = <expr$>
/* a9e0 */                   JSR.abs ("_b6a6");            // pop string off descriptor stack, or from top of string
                                                           // space returns with A = length, X = pointer low byte,
                                                           // Y = pointer high byte
/* a9e3 */  _`puttim_a9e3`;  CMP.imm (0x06);               // compare length with 6
/* a9e5 */                   BNE.rel ("_aa24");            // if length not 6 do illegal quantity error then warm start
/* a9e7 */                   LDY.imm (0x00);               // clear index
/* a9e9 */                   STY.zpg ("facexp_0061");      // clear FAC1 exponent
/* a9eb */                   STY.zpg ("facsgn_0066");      // clear FAC1 sign (b7)
/* a9ed */        _`_a9ed`;  STY.zpg ("fbufpt+0_0071");    // save index
/* a9ef */                   JSR.abs ("_aa1d");            // check and evaluate numeric digit
/* a9f2 */                   JSR.abs ("mul10_bae2");       // multiply FAC1 by 10
/* a9f5 */                   INC.zpg ("fbufpt+0_0071");    // increment index
/* a9f7 */                   LDY.zpg ("fbufpt+0_0071");    // restore index
/* a9f9 */                   JSR.abs ("_aa1d");            // check and evaluate numeric digit
/* a9fc */                   JSR.abs ("movaf_bc0c");       // round and copy FAC1 to FAC2
/* a9ff */                   TAX.imp ();                   // copy FAC1 exponent
/* aa00 */                   BEQ.rel ("_aa07");            // branch if FAC1 zero
/* aa02 */                   INX.imp ();                   // increment index, * 2
/* aa03 */                   TXA.imp ();                   // copy back to A
/* aa04 */                   JSR.abs ("_baed");            // FAC1 = (FAC1 + (FAC2 * 2)) * 2 = FAC1 * 6
/* aa07 */        _`_aa07`;  LDY.zpg ("fbufpt+0_0071");    // get index
/* aa09 */                   INY.imp ();                   // increment index
/* aa0a */                   CPY.imm (0x06);               // compare index with 6
/* aa0c */                   BNE.rel ("_a9ed");            // loop if not 6
/* aa0e */                   JSR.abs ("mul10_bae2");       // multiply FAC1 by 10
/* aa11 */                   JSR.abs ("qint_bc9b");        // convert FAC1 floating to fixed
/* aa14 */                   LDX.zpg ("facho+2_0064");     // get FAC1 mantissa 3
/* aa16 */                   LDY.zpg ("facho+1_0063");     // get FAC1 mantissa 2
/* aa18 */                   LDA.zpg ("facho+3_0065");     // get FAC1 mantissa 4
/* aa1a */                   JMP.abs ("settim_ffdb");      // set real time clock and return

// ------------------------------------------------------- // check and evaluate numeric digit
/* aa1d */        _`_aa1d`;  LDA.iny ("index+0_0022");     // get byte from string
/* aa1f */                   JSR.abs ("chrget+13_0080");   // clear Cb if numeric. this call should be to $84
                                                           // as the code from $80 first comapres the byte with
                                                           // [SPACE] and does a BASIC increment and get if it is
/* aa22 */                   BCC.rel ("_aa27");            // branch if numeric
/* aa24 */        _`_aa24`;  JMP.abs ("fcerr_b248");       // do illegal quantity error then warm start
/* aa27 */        _`_aa27`;  SBC.imm (0x2f);               // subtract $2F + carry to convert ASCII to binary
/* aa29 */                   JMP.abs ("finlog_bd7e");      // evaluate new ASCII digit and return

// ------------------------------------------------------- // assign value to numeric variable, but not TI$
/* aa2c */  _`getspt_aa2c`;  LDY.imm (0x02);               // index to string pointer high byte
/* aa2e */                   LDA.iny ("facho+2_0064");     // get string pointer high byte
/* aa30 */                   CMP.zpg ("fretop+1_0034");    // compare with bottom of string space high byte
/* aa32 */                   BCC.rel ("_aa4b");            // branch if string pointer high byte is less than bottom
                                                           // of string space high byte
/* aa34 */                   BNE.rel ("_aa3d");            // branch if string pointer high byte is greater than
                                                           // bottom of string space high byte
                                                           // else high bytes were equal
/* aa36 */                   DEY.imp ();                   // decrement index to string pointer low byte
/* aa37 */                   LDA.iny ("facho+2_0064");     // get string pointer low byte
/* aa39 */                   CMP.zpg ("fretop+0_0033");    // compare with bottom of string space low byte
/* aa3b */                   BCC.rel ("_aa4b");            // branch if string pointer low byte is less than bottom
                                                           // of string space low byte
/* aa3d */        _`_aa3d`;  LDY.zpg ("facho+3_0065");     // get descriptor pointer high byte
/* aa3f */                   CPY.zpg ("vartab+1_002e");    // compare with start of variables high byte
/* aa41 */                   BCC.rel ("_aa4b");            // branch if less, is on string stack
/* aa43 */                   BNE.rel ("_aa52");            // if greater make space and copy string
                                                           // else high bytes were equal
/* aa45 */                   LDA.zpg ("facho+2_0064");     // get descriptor pointer low byte
/* aa47 */                   CMP.zpg ("vartab+0_002d");    // compare with start of variables low byte
/* aa49 */                   BCS.rel ("_aa52");            // if greater or equal make space and copy string
/* aa4b */        _`_aa4b`;  LDA.zpg ("facho+2_0064");     // get descriptor pointer low byte
/* aa4d */                   LDY.zpg ("facho+3_0065");     // get descriptor pointer high byte
/* aa4f */                   JMP.abs ("_aa68");            // go copy descriptor to variable
/* aa52 */        _`_aa52`;  LDY.imm (0x00);               // clear index
/* aa54 */                   LDA.iny ("facho+2_0064");     // get string length
/* aa56 */                   JSR.abs ("_b475");            // copy descriptor pointer and make string space A bytes long
/* aa59 */                   LDA.zpg ("dscpnt+0_0050");    // copy old descriptor pointer low byte
/* aa5b */                   LDY.zpg ("dscpnt+1_0051");    // copy old descriptor pointer high byte
/* aa5d */                   STA.zpg ("arisgn_006f");      // save old descriptor pointer low byte
/* aa5f */                   STY.zpg ("facov_0070");       // save old descriptor pointer high byte
/* aa61 */                   JSR.abs ("movins_b67a");      // copy string from descriptor to utility pointer
/* aa64 */                   LDA.imm (0x61);               // get descriptor pointer low byte
/* aa66 */                   LDY.imm (0x00);               // get descriptor pointer high byte
/* aa68 */        _`_aa68`;  STA.zpg ("dscpnt+0_0050");    // save descriptor pointer low byte
/* aa6a */                   STY.zpg ("dscpnt+1_0051");    // save descriptor pointer high byte
/* aa6c */                   JSR.abs ("frefac_b6db");      // clean descriptor stack, YA = pointer
/* aa6f */                   LDY.imm (0x00);               // clear index
/* aa71 */                   LDA.iny ("dscpnt+0_0050");    // get string length from new descriptor
/* aa73 */                   STA.iny ("forpnt+0_0049");    // copy string length to variable
/* aa75 */                   INY.imp ();                   // increment index
/* aa76 */                   LDA.iny ("dscpnt+0_0050");    // get string pointer low byte from new descriptor
/* aa78 */                   STA.iny ("forpnt+0_0049");    // copy string pointer low byte to variable
/* aa7a */                   INY.imp ();                   // increment index
/* aa7b */                   LDA.iny ("dscpnt+0_0050");    // get string pointer high byte from new descriptor
/* aa7d */                   STA.iny ("forpnt+0_0049");    // copy string pointer high byte to variable
/* aa7f */                   RTS.imp ();

// ------------------------------------------------------- // perform PRINT#
/* aa80 */  _`printn_aa80`;  JSR.abs ("cmd_aa86");         // perform CMD
/* aa83 */                   JMP.abs ("_abb5");            // close input and output channels and return

// ------------------------------------------------------- // perform CMD
/* aa86 */     _`cmd_aa86`;  JSR.abs ("_b79e");            // get byte parameter
/* aa89 */                   BEQ.rel ("_aa90");            // branch if following byte is ":" or [EOT]
/* aa8b */                   LDA.imm (0x2c);               // set ","
/* aa8d */                   JSR.abs ("chkcom_aeff");      // scan for CHR$(A), else do syntax error then warm start
/* aa90 */        _`_aa90`;  PHP.imp ();                   // save status
/* aa91 */                   STX.zpg ("channl_0013");      // set current I/O channel
/* aa93 */                   JSR.abs ("bckout_e118");      // open channel for output with error check
/* aa96 */                   PLP.imp ();                   // restore status
/* aa97 */                   JMP.abs ("print_aaa0");       // perform PRINT
/* aa9a */  _`strdon_aa9a`;  JSR.abs ("_ab21");            // print string from utility pointer
/* aa9d */        _`_aa9d`;  JSR.abs ("chrgot_0079");      // scan memory

// ------------------------------------------------------- // perform PRINT
/* aaa0 */   _`print_aaa0`;  BEQ.rel ("crdo_aad7");        // if nothing following just print CR/LF
/* aaa2 */        _`_aaa2`;  BEQ.rel ("_aae7");            // exit if nothing following, end of PRINT branch
/* aaa4 */                   CMP.imm (0xa3);               // compare with token for TAB(
/* aaa6 */                   BEQ.rel ("_aaf8");            // if TAB( go handle it
/* aaa8 */                   CMP.imm (0xa6);               // compare with token for SPC(
/* aaaa */                   CLC.imp ();                   // flag SPC(
/* aaab */                   BEQ.rel ("_aaf8");            // if SPC( go handle it
/* aaad */                   CMP.imm (0x2c);               // compare with ","
/* aaaf */                   BEQ.rel ("comprt_aae8");      // if "," go skip to the next TAB position
/* aab1 */                   CMP.imm (0x3b);               // compare with ";"
/* aab3 */                   BEQ.rel ("_ab13");            // if ";" go continue the print loop
/* aab5 */                   JSR.abs ("frmevl_ad9e");      // evaluate expression
/* aab8 */   _`varop_aab8`;  BIT.zpg ("valtyp_000d");      // test data type flag, $FF = string, $00 = numeric
/* aaba */                   BMI.rel ("strdon_aa9a");      // if string go print string, scan memory and continue PRINT
/* aabc */                   JSR.abs ("fout_bddd");        // convert FAC1 to ASCII string result in (AY)
/* aabf */                   JSR.abs ("strlit_b487");      // print " terminated string to utility pointer
/* aac2 */                   JSR.abs ("_ab21");            // print string from utility pointer
/* aac5 */                   JSR.abs ("outspc_ab3b");      // print [SPACE] or [CURSOR RIGHT]
/* aac8 */                   BNE.rel ("_aa9d");            // go scan memory and continue PRINT, branch always

// ------------------------------------------------------- // set XY to $0200 - 1 and print [CR]
/* aaca */        _`_aaca`;  LDA.imm (0x00);               // clear A
/* aacc */                   STA.abx ("buf+0_0200");       // clear first byte of input buffer
/* aacf */                   LDX.imm (0xff);               // $0200 - 1 low byte
/* aad1 */                   LDY.imm (0x01);               // $0200 - 1 high byte
/* aad3 */                   LDA.zpg ("channl_0013");      // get current I/O channel
/* aad5 */                   BNE.rel ("_aae7");            // exit if not default channel

// ------------------------------------------------------- // print CR/LF
/* aad7 */    _`crdo_aad7`;  LDA.imm (0x0d);               // set [CR]
/* aad9 */                   JSR.abs ("_ab47");            // print the character
/* aadc */                   BIT.zpg ("channl_0013");      // test current I/O channel
/* aade */                   BPL.rel ("_aae5");            // if ?? toggle A, EOR #$FF and return
/* aae0 */                   LDA.imm (0x0a);               // set [LF]
/* aae2 */                   JSR.abs ("_ab47");            // print the character
                                                           // toggle A
/* aae5 */        _`_aae5`;  EOR.imm (0xff);               // invert A
/* aae7 */        _`_aae7`;  RTS.imp ();
                                                           // was ","
/* aae8 */  _`comprt_aae8`;  SEC.imp ();                   // set Cb for read cursor position
/* aae9 */                   JSR.abs ("plot_fff0");        // read/set X,Y cursor position
/* aaec */                   TYA.imp ();                   // copy cursor Y
/* aaed */                   SEC.imp ();                   // set carry for subtract
/* aaee */        _`_aaee`;  SBC.imm (0x0a);               // subtract one TAB length
/* aaf0 */                   BCS.rel ("_aaee");            // loop if result was +ve
/* aaf2 */                   EOR.imm (0xff);               // complement it
/* aaf4 */                   ADC.imm (0x01);               // +1, twos complement
/* aaf6 */                   BNE.rel ("_ab0e");            // always print A spaces, result is never $00
/* aaf8 */        _`_aaf8`;  PHP.imp ();                   // save TAB( or SPC( status
/* aaf9 */                   SEC.imp ();                   // set Cb for read cursor position
/* aafa */                   JSR.abs ("plot_fff0");        // read/set X,Y cursor position
/* aafd */                   STY.zpg ("trmpos_0009");      // save current cursor position
/* aaff */                   JSR.abs ("gtbytc_b79b");      // scan and get byte parameter
/* ab02 */                   CMP.imm (0x29);               // compare with ")"
/* ab04 */                   BNE.rel ("_ab5f");            // if not ")" do syntax error
/* ab06 */                   PLP.imp ();                   // restore TAB( or SPC( status
/* ab07 */                   BCC.rel ("_ab0f");            // branch if was SPC(
                                                           // else was TAB(
/* ab09 */                   TXA.imp ();                   // copy TAB() byte to A
/* ab0a */                   SBC.zpg ("trmpos_0009");      // subtract current cursor position
/* ab0c */                   BCC.rel ("_ab13");            // go loop for next if already past requited position
/* ab0e */        _`_ab0e`;  TAX.imp ();                   // copy [SPACE] count to X
/* ab0f */        _`_ab0f`;  INX.imp ();                   // increment count
/* ab10 */        _`_ab10`;  DEX.imp ();                   // decrement count
/* ab11 */                   BNE.rel ("_ab19");            // branch if count was not zero
                                                           // was ";" or [SPACES] printed
/* ab13 */        _`_ab13`;  JSR.abs ("chrget+0_0073");    // increment and scan memory
/* ab16 */                   JMP.abs ("_aaa2");            // continue print loop
/* ab19 */        _`_ab19`;  JSR.abs ("outspc_ab3b");      // print [SPACE] or [CURSOR RIGHT]
/* ab1c */                   BNE.rel ("_ab10");            // loop, branch always

// ------------------------------------------------------- // print null terminated string
/* ab1e */  _`strout_ab1e`;  JSR.abs ("strlit_b487");      // print " terminated string to utility pointer

// ------------------------------------------------------- // print string from utility pointer
/* ab21 */        _`_ab21`;  JSR.abs ("_b6a6");            // pop string off descriptor stack, or from top of string
                                                           // space returns with A = length, X = pointer low byte,
                                                           // Y = pointer high byte
/* ab24 */                   TAX.imp ();                   // copy length
/* ab25 */                   LDY.imm (0x00);               // clear index
/* ab27 */                   INX.imp ();                   // increment length, for pre decrement loop
/* ab28 */        _`_ab28`;  DEX.imp ();                   // decrement length
/* ab29 */                   BEQ.rel ("_aae7");            // exit if done
/* ab2b */                   LDA.iny ("index+0_0022");     // get byte from string
/* ab2d */                   JSR.abs ("_ab47");            // print the character
/* ab30 */                   INY.imp ();                   // increment index
/* ab31 */                   CMP.imm (0x0d);               // compare byte with [CR]
/* ab33 */                   BNE.rel ("_ab28");            // loop if not [CR]
/* ab35 */                   JSR.abs ("_aae5");            // toggle A, EOR #$FF. what is the point of this ??
/* ab38 */                   JMP.abs ("_ab28");            // loop

// ------------------------------------------------------- // print [SPACE] or [CURSOR RIGHT]
/* ab3b */  _`outspc_ab3b`;  LDA.zpg ("channl_0013");      // get current I/O channel
/* ab3d */                   BEQ.rel ("_ab42");            // if default channel go output [CURSOR RIGHT]
/* ab3f */                   LDA.imm (0x20);               // else output [SPACE]
/* ab41 */                   _.bytes(0x2c);                // makes next line BIT $1DA9
/* ab42 */        _`_ab42`;  LDA.imm (0x1d);               // set [CURSOR RIGHT]
/* ab44 */                   _.bytes(0x2c);                // makes next line BIT $3FA9

// ------------------------------------------------------- // print "?"
/* ab45 */        _`_ab45`;  LDA.imm (0x3f);               // set "?"

// ------------------------------------------------------- // print character
/* ab47 */        _`_ab47`;  JSR.abs ("bchout_e10c");      // output character to channel with error check
/* ab4a */                   AND.imm (0xff);               // set the flags on A
/* ab4c */                   RTS.imp ();

// ------------------------------------------------------- // bad input routine
/* ab4d */  _`doagin_ab4d`;  LDA.zpg ("inpflg_0011");      // get INPUT mode flag, $00 = INPUT, $40 = GET, $98 = READ
/* ab4f */                   BEQ.rel ("_ab62");            // branch if INPUT
/* ab51 */                   BMI.rel ("_ab57");            // branch if READ
                                                           // else was GET
/* ab53 */                   LDY.imm (0xff);               // set current line high byte to -1, indicate immediate mode
/* ab55 */                   BNE.rel ("_ab5b");            // branch always
/* ab57 */        _`_ab57`;  LDA.zpg ("datlin+0_003f");    // get current DATA line number low byte
/* ab59 */                   LDY.zpg ("datlin+1_0040");    // get current DATA line number high byte
/* ab5b */        _`_ab5b`;  STA.zpg ("curlin+0_0039");    // set current line number low byte
/* ab5d */                   STY.zpg ("curlin+1_003a");    // set current line number high byte
/* ab5f */        _`_ab5f`;  JMP.abs ("synerr_af08");      // do syntax error then warm start
                                                           // was INPUT
/* ab62 */        _`_ab62`;  LDA.zpg ("channl_0013");      // get current I/O channel
/* ab64 */                   BEQ.rel ("_ab6b");            // branch if default channel
/* ab66 */                   LDX.imm (0x18);               // else error $18, file data error
/* ab68 */                   JMP.abs ("error_a437");       // do error #X then warm start
/* ab6b */        _`_ab6b`;  LDA.imm (0x0c);               // set "?REDO FROM START" pointer low byte
/* ab6d */                   LDY.imm (0xad);               // set "?REDO FROM START" pointer high byte
/* ab6f */                   JSR.abs ("strout_ab1e");      // print null terminated string
/* ab72 */                   LDA.zpg ("oldtxt+0_003d");    // get continue pointer low byte
/* ab74 */                   LDY.zpg ("oldtxt+1_003e");    // get continue pointer high byte
/* ab76 */                   STA.zpg ("txtptr+0_007a");    // save BASIC execute pointer low byte
/* ab78 */                   STY.zpg ("txtptr+1_007b");    // save BASIC execute pointer high byte
/* ab7a */                   RTS.imp ();

// ------------------------------------------------------- // perform GET
/* ab7b */     _`get_ab7b`;  JSR.abs ("errdir_b3a6");      // check not Direct, back here if ok
/* ab7e */                   CMP.imm (0x23);               // compare with "#"
/* ab80 */                   BNE.rel ("_ab92");            // branch if not GET#
/* ab82 */                   JSR.abs ("chrget+0_0073");    // increment and scan memory
/* ab85 */                   JSR.abs ("_b79e");            // get byte parameter
/* ab88 */                   LDA.imm (0x2c);               // set ","
/* ab8a */                   JSR.abs ("chkcom_aeff");      // scan for CHR$(A), else do syntax error then warm start
/* ab8d */                   STX.zpg ("channl_0013");      // set current I/O channel
/* ab8f */                   JSR.abs ("bckin_e11e");       // open channel for input with error check
/* ab92 */        _`_ab92`;  LDX.imm (0x01);               // set pointer low byte
/* ab94 */                   LDY.imm (0x02);               // set pointer high byte
/* ab96 */                   LDA.imm (0x00);               // clear A
/* ab98 */                   STA.abs ("buf+1_0201");       // ensure null terminator
/* ab9b */                   LDA.imm (0x40);               // input mode = GET
/* ab9d */                   JSR.abs ("_ac0f");            // perform the GET part of READ
/* aba0 */                   LDX.zpg ("channl_0013");      // get current I/O channel
/* aba2 */                   BNE.rel ("_abb7");            // if not default channel go do channel close and return
/* aba4 */                   RTS.imp ();

// ------------------------------------------------------- // perform INPUT#
/* aba5 */  _`inputn_aba5`;  JSR.abs ("_b79e");            // get byte parameter
/* aba8 */                   LDA.imm (0x2c);               // set ","
/* abaa */                   JSR.abs ("chkcom_aeff");      // scan for CHR$(A), else do syntax error then warm start
/* abad */                   STX.zpg ("channl_0013");      // set current I/O channel
/* abaf */                   JSR.abs ("bckin_e11e");       // open channel for input with error check
/* abb2 */                   JSR.abs ("_abce");            // perform INPUT with no prompt string

// ------------------------------------------------------- // close input and output channels
/* abb5 */        _`_abb5`;  LDA.zpg ("channl_0013");      // get current I/O channel
/* abb7 */        _`_abb7`;  JSR.abs ("clrchn_ffcc");      // close input and output channels
/* abba */                   LDX.imm (0x00);               // clear X
/* abbc */                   STX.zpg ("channl_0013");      // clear current I/O channel, flag default
/* abbe */                   RTS.imp ();

// ------------------------------------------------------- // perform INPUT
/* abbf */   _`input_abbf`;  CMP.imm (0x22);               // compare next byte with open quote
/* abc1 */                   BNE.rel ("_abce");            // if no prompt string just do INPUT
/* abc3 */                   JSR.abs ("_aebd");            // print "..." string
/* abc6 */                   LDA.imm (0x3b);               // load A with ";"
/* abc8 */                   JSR.abs ("chkcom_aeff");      // scan for CHR$(A), else do syntax error then warm start
/* abcb */                   JSR.abs ("_ab21");            // print string from utility pointer
                                                           // done with prompt, now get data
/* abce */        _`_abce`;  JSR.abs ("errdir_b3a6");      // check not Direct, back here if ok
/* abd1 */                   LDA.imm (0x2c);               // set ","
/* abd3 */                   STA.abs ("bstack+192_01ff");  // save to start of buffer - 1
/* abd6 */        _`_abd6`;  JSR.abs ("qinlin_abf9");      // print "? " and get BASIC input
/* abd9 */                   LDA.zpg ("channl_0013");      // get current I/O channel
/* abdb */                   BEQ.rel ("bufful_abea");      // branch if default I/O channel
/* abdd */                   JSR.abs ("readst_ffb7");      // read I/O status word
/* abe0 */                   AND.imm (0x02);               // mask no DSR/timeout
/* abe2 */                   BEQ.rel ("bufful_abea");      // branch if not error
/* abe4 */                   JSR.abs ("_abb5");            // close input and output channels
/* abe7 */                   JMP.abs ("data_a8f8");        // perform DATA
/* abea */  _`bufful_abea`;  LDA.abs ("buf+0_0200");       // get first byte in input buffer
/* abed */                   BNE.rel ("_ac0d");            // branch if not null
                                                           // else ..
/* abef */                   LDA.zpg ("channl_0013");      // get current I/O channel
/* abf1 */                   BNE.rel ("_abd6");            // if not default channel go get BASIC input
/* abf3 */                   JSR.abs ("datan_a906");       // scan for next BASIC statement ([:] or [EOL])
/* abf6 */                   JMP.abs ("_a8fb");            // add Y to the BASIC execute pointer and return

// ------------------------------------------------------- // print "? " and get BASIC input
/* abf9 */  _`qinlin_abf9`;  LDA.zpg ("channl_0013");      // get current I/O channel
/* abfb */                   BNE.rel ("_ac03");            // skip "?" prompt if not default channel
/* abfd */                   JSR.abs ("_ab45");            // print "?"
/* ac00 */                   JSR.abs ("outspc_ab3b");      // print [SPACE] or [CURSOR RIGHT]
/* ac03 */        _`_ac03`;  JMP.abs ("inlin_a560");       // call for BASIC input and return

// ------------------------------------------------------- // perform READ
/* ac06 */    _`read_ac06`;  LDX.zpg ("datptr+0_0041");    // get DATA pointer low byte
/* ac08 */                   LDY.zpg ("datptr+1_0042");    // get DATA pointer high byte
/* ac0a */                   LDA.imm (0x98);               // set input mode = READ
/* ac0c */                   _.bytes(0x2c);                // makes next line BIT $00A9
/* ac0d */        _`_ac0d`;  LDA.imm (0x00);               // set input mode = INPUT

// ------------------------------------------------------- // perform GET
/* ac0f */        _`_ac0f`;  STA.zpg ("inpflg_0011");      // set input mode flag, $00 = INPUT, $40 = GET, $98 = READ
/* ac11 */                   STX.zpg ("inpptr+0_0043");    // save READ pointer low byte
/* ac13 */                   STY.zpg ("inpptr+1_0044");    // save READ pointer high byte
                                                           // READ, GET or INPUT next variable from list
/* ac15 */        _`_ac15`;  JSR.abs ("ptrget_b08b");      // get variable address
/* ac18 */                   STA.zpg ("forpnt+0_0049");    // save address low byte
/* ac1a */                   STY.zpg ("forpnt+1_004a");    // save address high byte
/* ac1c */                   LDA.zpg ("txtptr+0_007a");    // get BASIC execute pointer low byte
/* ac1e */                   LDY.zpg ("txtptr+1_007b");    // get BASIC execute pointer high byte
/* ac20 */                   STA.zpg ("opptr+0_004b");     // save BASIC execute pointer low byte
/* ac22 */                   STY.zpg ("opptr+1_004c");     // save BASIC execute pointer high byte
/* ac24 */                   LDX.zpg ("inpptr+0_0043");    // get READ pointer low byte
/* ac26 */                   LDY.zpg ("inpptr+1_0044");    // get READ pointer high byte
/* ac28 */                   STX.zpg ("txtptr+0_007a");    // save as BASIC execute pointer low byte
/* ac2a */                   STY.zpg ("txtptr+1_007b");    // save as BASIC execute pointer high byte
/* ac2c */                   JSR.abs ("chrgot_0079");      // scan memory
/* ac2f */                   BNE.rel ("_ac51");            // branch if not null
                                                           // pointer was to null entry
/* ac31 */                   BIT.zpg ("inpflg_0011");      // test input mode flag, $00 = INPUT, $40 = GET, $98 = READ
/* ac33 */                   BVC.rel ("_ac41");            // branch if not GET
                                                           // else was GET
/* ac35 */   _`rdget_ac35`;  JSR.abs ("bgetin_e124");      // get character from input device with error check
/* ac38 */                   STA.abs ("buf+0_0200");       // save to buffer
/* ac3b */                   LDX.imm (0xff);               // set pointer low byte
/* ac3d */                   LDY.imm (0x01);               // set pointer high byte
/* ac3f */                   BNE.rel ("_ac4d");            // go interpret single character
/* ac41 */        _`_ac41`;  BMI.rel ("_acb8");            // branch if READ
                                                           // else was INPUT
/* ac43 */                   LDA.zpg ("channl_0013");      // get current I/O channel
/* ac45 */                   BNE.rel ("_ac4a");            // skip "?" prompt if not default channel
/* ac47 */                   JSR.abs ("_ab45");            // print "?"
/* ac4a */        _`_ac4a`;  JSR.abs ("qinlin_abf9");      // print "? " and get BASIC input
/* ac4d */        _`_ac4d`;  STX.zpg ("txtptr+0_007a");    // save BASIC execute pointer low byte
/* ac4f */                   STY.zpg ("txtptr+1_007b");    // save BASIC execute pointer high byte
/* ac51 */        _`_ac51`;  JSR.abs ("chrget+0_0073");    // increment and scan memory, execute pointer now points to
                                                           // start of next data or null terminator
/* ac54 */                   BIT.zpg ("valtyp_000d");      // test data type flag, $FF = string, $00 = numeric
/* ac56 */                   BPL.rel ("_ac89");            // branch if numeric
                                                           // type is string
/* ac58 */                   BIT.zpg ("inpflg_0011");      // test INPUT mode flag, $00 = INPUT, $40 = GET, $98 = READ
/* ac5a */                   BVC.rel ("_ac65");            // branch if not GET
                                                           // else do string GET
/* ac5c */                   INX.imp ();                   // clear X ??
/* ac5d */                   STX.zpg ("txtptr+0_007a");    // save BASIC execute pointer low byte
/* ac5f */                   LDA.imm (0x00);               // clear A
/* ac61 */                   STA.zpg ("charac_0007");      // clear search character
/* ac63 */                   BEQ.rel ("_ac71");            // branch always
                                                           // is string INPUT or string READ
/* ac65 */        _`_ac65`;  STA.zpg ("charac_0007");      // save search character
/* ac67 */                   CMP.imm (0x22);               // compare with "
/* ac69 */                   BEQ.rel ("_ac72");            // branch if quote
                                                           // string is not in quotes so ":", "," or $00 are the
                                                           // termination characters
/* ac6b */                   LDA.imm (0x3a);               // set ":"
/* ac6d */                   STA.zpg ("charac_0007");      // set search character
/* ac6f */                   LDA.imm (0x2c);               // set ","
/* ac71 */        _`_ac71`;  CLC.imp ();                   // clear carry for add
/* ac72 */        _`_ac72`;  STA.zpg ("endchr_0008");      // set scan quotes flag
/* ac74 */                   LDA.zpg ("txtptr+0_007a");    // get BASIC execute pointer low byte
/* ac76 */                   LDY.zpg ("txtptr+1_007b");    // get BASIC execute pointer high byte
/* ac78 */                   ADC.imm (0x00);               // add to pointer low byte. this add increments the pointer
                                                           // if the mode is INPUT or READ and the data is a "..."
                                                           // string
/* ac7a */                   BCC.rel ("_ac7d");            // branch if no rollover
/* ac7c */                   INY.imp ();                   // else increment pointer high byte
/* ac7d */        _`_ac7d`;  JSR.abs ("_b48d");            // print string to utility pointer
/* ac80 */                   JSR.abs ("_b7e2");            // restore BASIC execute pointer from temp
/* ac83 */                   JSR.abs ("_a9da");            // perform string LET
/* ac86 */                   JMP.abs ("_ac91");            // continue processing command
                                                           // GET, INPUT or READ is numeric
/* ac89 */        _`_ac89`;  JSR.abs ("fin_bcf3");         // get FAC1 from string
/* ac8c */                   LDA.zpg ("intflg_000e");      // get data type flag, $80 = integer, $00 = float
/* ac8e */                   JSR.abs ("_a9c2");            // assign value to numeric variable
/* ac91 */        _`_ac91`;  JSR.abs ("chrgot_0079");      // scan memory
/* ac94 */                   BEQ.rel ("_ac9d");            // branch if ":" or [EOL]
/* ac96 */                   CMP.imm (0x2c);               // comparte with ","
/* ac98 */                   BEQ.rel ("_ac9d");            // branch if ","
/* ac9a */                   JMP.abs ("doagin_ab4d");      // else go do bad input routine
                                                           // string terminated with ":", "," or $00
/* ac9d */        _`_ac9d`;  LDA.zpg ("txtptr+0_007a");    // get BASIC execute pointer low byte
/* ac9f */                   LDY.zpg ("txtptr+1_007b");    // get BASIC execute pointer high byte
/* aca1 */                   STA.zpg ("inpptr+0_0043");    // save READ pointer low byte
/* aca3 */                   STY.zpg ("inpptr+1_0044");    // save READ pointer high byte
/* aca5 */                   LDA.zpg ("opptr+0_004b");     // get saved BASIC execute pointer low byte
/* aca7 */                   LDY.zpg ("opptr+1_004c");     // get saved BASIC execute pointer high byte
/* aca9 */                   STA.zpg ("txtptr+0_007a");    // restore BASIC execute pointer low byte
/* acab */                   STY.zpg ("txtptr+1_007b");    // restore BASIC execute pointer high byte
/* acad */                   JSR.abs ("chrgot_0079");      // scan memory
/* acb0 */                   BEQ.rel ("_acdf");            // branch if ":" or [EOL]
/* acb2 */                   JSR.abs ("_aefd");            // scan for ",", else do syntax error then warm start
/* acb5 */                   JMP.abs ("_ac15");            // go READ or INPUT next variable from list
                                                           // was READ
/* acb8 */        _`_acb8`;  JSR.abs ("datan_a906");       // scan for next BASIC statement ([:] or [EOL])
/* acbb */                   INY.imp ();                   // increment index to next byte
/* acbc */                   TAX.imp ();                   // copy byte to X
/* acbd */                   BNE.rel ("_acd1");            // branch if ":"
/* acbf */                   LDX.imm (0x0d);               // else set error $0D, out of data error
/* acc1 */                   INY.imp ();                   // increment index to next line pointer high byte
/* acc2 */                   LDA.iny ("txtptr+0_007a");    // get next line pointer high byte
/* acc4 */                   BEQ.rel ("_ad32");            // branch if program end, eventually does error X
/* acc6 */                   INY.imp ();                   // increment index
/* acc7 */                   LDA.iny ("txtptr+0_007a");    // get next line # low byte
/* acc9 */                   STA.zpg ("datlin+0_003f");    // save current DATA line low byte
/* accb */                   INY.imp ();                   // increment index
/* accc */                   LDA.iny ("txtptr+0_007a");    // get next line # high byte
/* acce */                   INY.imp ();                   // increment index
/* accf */                   STA.zpg ("datlin+1_0040");    // save current DATA line high byte
/* acd1 */        _`_acd1`;  JSR.abs ("_a8fb");            // add Y to the BASIC execute pointer
/* acd4 */                   JSR.abs ("chrgot_0079");      // scan memory
/* acd7 */                   TAX.imp ();                   // copy the byte
/* acd8 */                   CPX.imm (0x83);               // compare it with token for DATA
/* acda */                   BNE.rel ("_acb8");            // loop if not DATA
/* acdc */                   JMP.abs ("_ac51");            // continue evaluating READ
/* acdf */        _`_acdf`;  LDA.zpg ("inpptr+0_0043");    // get READ pointer low byte
/* ace1 */                   LDY.zpg ("inpptr+1_0044");    // get READ pointer high byte
/* ace3 */                   LDX.zpg ("inpflg_0011");      // get INPUT mode flag, $00 = INPUT, $40 = GET, $98 = READ
/* ace5 */                   BPL.rel ("_acea");            // branch if INPUT or GET
/* ace7 */                   JMP.abs ("_a827");            // else set data pointer and exit
/* acea */        _`_acea`;  LDY.imm (0x00);               // clear index
/* acec */                   LDA.iny ("inpptr+0_0043");    // get READ byte
/* acee */                   BEQ.rel ("_acfb");            // exit if [EOL]
/* acf0 */                   LDA.zpg ("channl_0013");      // get current I/O channel
/* acf2 */                   BNE.rel ("_acfb");            // exit if not default channel
/* acf4 */                   LDA.imm (0xfc);               // set "?EXTRA IGNORED" pointer low byte
/* acf6 */                   LDY.imm (0xac);               // set "?EXTRA IGNORED" pointer high byte
/* acf8 */                   JMP.abs ("strout_ab1e");      // print null terminated string
/* acfb */        _`_acfb`;  RTS.imp ();

// ------------------------------------------------------- // input error messages
                                                           // '?extra ignored'
/* acfc */   _`exint_acfc`;  _.bytes(0x3f, 0x45, 0x58, 0x54, 0x52, 0x41, 0x20, 0x49);
/* ad04 */                   _.bytes(0x47, 0x4e, 0x4f, 0x52, 0x45, 0x44, 0x0d, 0x00);
                                                           // '?redo from start'
/* ad0c */                   _.bytes(0x3f, 0x52, 0x45, 0x44, 0x4f, 0x20, 0x46, 0x52);
/* ad14 */                   _.bytes(0x4f, 0x4d, 0x20, 0x53, 0x54, 0x41, 0x52, 0x54);
/* ad1c */                   _.bytes(0x0d, 0x00);

// ------------------------------------------------------- // perform NEXT
/* ad1e */    _`next_ad1e`;  BNE.rel ("_ad24");            // branch if NEXT variable
/* ad20 */                   LDY.imm (0x00);               // else clear Y
/* ad22 */                   BEQ.rel ("_ad27");            // branch always
                                                           // NEXT variable
/* ad24 */        _`_ad24`;  JSR.abs ("ptrget_b08b");      // get variable address
/* ad27 */        _`_ad27`;  STA.zpg ("forpnt+0_0049");    // save FOR/NEXT variable pointer low byte
/* ad29 */                   STY.zpg ("forpnt+1_004a");    // save FOR/NEXT variable pointer high byte
                                                           // (high byte cleared if no variable defined)
/* ad2b */                   JSR.abs ("fndfor_a38a");      // search the stack for FOR or GOSUB activity
/* ad2e */                   BEQ.rel ("_ad35");            // branch if FOR, this variable, found
/* ad30 */                   LDX.imm (0x0a);               // else set error $0A, next without for error
/* ad32 */        _`_ad32`;  JMP.abs ("error_a437");       // do error #X then warm start
                                                           // found this FOR variable
/* ad35 */        _`_ad35`;  TXS.imp ();                   // update stack pointer
/* ad36 */                   TXA.imp ();                   // copy stack pointer
/* ad37 */                   CLC.imp ();                   // clear carry for add
/* ad38 */                   ADC.imm (0x04);               // point to STEP value
/* ad3a */                   PHA.imp ();                   // save it
/* ad3b */                   ADC.imm (0x06);               // point to TO value
/* ad3d */                   STA.zpg ("index+2_0024");     // save pointer to TO variable for compare
/* ad3f */                   PLA.imp ();                   // restore pointer to STEP value
/* ad40 */                   LDY.imm (0x01);               // point to stack page
/* ad42 */                   JSR.abs ("movfm_bba2");       // unpack memory (AY) into FAC1
/* ad45 */                   TSX.imp ();                   // get stack pointer back
/* ad46 */                   LDA.abx ("bad+9_0109");       // get step sign
/* ad49 */                   STA.zpg ("facsgn_0066");      // save FAC1 sign (b7)
/* ad4b */                   LDA.zpg ("forpnt+0_0049");    // get FOR/NEXT variable pointer low byte
/* ad4d */                   LDY.zpg ("forpnt+1_004a");    // get FOR/NEXT variable pointer high byte
/* ad4f */                   JSR.abs ("fadd_b867");        // add FOR variable to FAC1
/* ad52 */                   JSR.abs ("_bbd0");            // pack FAC1 into FOR variable
/* ad55 */                   LDY.imm (0x01);               // point to stack page
/* ad57 */                   JSR.abs ("_bc5d");            // compare FAC1 with TO value
/* ad5a */                   TSX.imp ();                   // get stack pointer back
/* ad5b */                   SEC.imp ();                   // set carry for subtract
/* ad5c */                   SBC.abx ("bad+9_0109");       // subtract step sign
/* ad5f */                   BEQ.rel ("_ad78");            // branch if =, loop complete
                                                           // loop back and do it all again
/* ad61 */  _`donext_ad61`;  LDA.abx ("bad+15_010f");      // get FOR line low byte
/* ad64 */                   STA.zpg ("curlin+0_0039");    // save current line number low byte
/* ad66 */                   LDA.abx ("bad+16_0110");      // get FOR line high byte
/* ad69 */                   STA.zpg ("curlin+1_003a");    // save current line number high byte
/* ad6b */                   LDA.abx ("bad+18_0112");      // get BASIC execute pointer low byte
/* ad6e */                   STA.zpg ("txtptr+0_007a");    // save BASIC execute pointer low byte
/* ad70 */                   LDA.abx ("bad+17_0111");      // get BASIC execute pointer high byte
/* ad73 */                   STA.zpg ("txtptr+1_007b");    // save BASIC execute pointer high byte
/* ad75 */        _`_ad75`;  JMP.abs ("newstt_a7ae");      // go do interpreter inner loop
                                                           // NEXT loop comlete
/* ad78 */        _`_ad78`;  TXA.imp ();                   // stack copy to A
/* ad79 */                   ADC.imm (0x11);               // add $12, $11 + carry, to dump FOR structure
/* ad7b */                   TAX.imp ();                   // copy back to index
/* ad7c */                   TXS.imp ();                   // copy to stack pointer
/* ad7d */                   JSR.abs ("chrgot_0079");      // scan memory
/* ad80 */                   CMP.imm (0x2c);               // compare with ","
/* ad82 */                   BNE.rel ("_ad75");            // if not "," go do interpreter inner loop
                                                           // was "," so another NEXT variable to do
/* ad84 */                   JSR.abs ("chrget+0_0073");    // increment and scan memory
/* ad87 */                   JSR.abs ("_ad24");            // do NEXT variable

// ------------------------------------------------------- // evaluate expression and check type mismatch
/* ad8a */  _`frmnum_ad8a`;  JSR.abs ("frmevl_ad9e");      // evaluate expression
                                                           // check if source and destination are numeric
/* ad8d */        _`_ad8d`;  CLC.imp ();
/* ad8e */                   _.bytes(0x24);                // makes next line BIT $38
                                                           // check if source and destination are string
/* ad8f */        _`_ad8f`;  SEC.imp ();                   // destination is string
                                                           // type match check, set C for string, clear C for numeric
/* ad90 */        _`_ad90`;  BIT.zpg ("valtyp_000d");      // test data type flag, $FF = string, $00 = numeric
/* ad92 */                   BMI.rel ("_ad97");            // branch if string
/* ad94 */                   BCS.rel ("_ad99");            // if destiantion is numeric do type missmatch error
/* ad96 */        _`_ad96`;  RTS.imp ();
/* ad97 */        _`_ad97`;  BCS.rel ("_ad96");            // exit if destination is string
                                                           // do type missmatch error
/* ad99 */        _`_ad99`;  LDX.imm (0x16);               // error code $16, type missmatch error
/* ad9b */                   JMP.abs ("error_a437");       // do error #X then warm start

// ------------------------------------------------------- // evaluate expression
/* ad9e */  _`frmevl_ad9e`;  LDX.zpg ("txtptr+0_007a");    // get BASIC execute pointer low byte
/* ada0 */                   BNE.rel ("_ada4");            // skip next if not zero
/* ada2 */                   DEC.zpg ("txtptr+1_007b");    // else decrement BASIC execute pointer high byte
/* ada4 */        _`_ada4`;  DEC.zpg ("txtptr+0_007a");    // decrement BASIC execute pointer low byte
/* ada6 */                   LDX.imm (0x00);               // set null precedence, flag done
/* ada8 */                   _.bytes(0x24);                // makes next line BIT $48
/* ada9 */        _`_ada9`;  PHA.imp ();                   // push compare evaluation byte if branch to here
/* adaa */                   TXA.imp ();                   // copy precedence byte
/* adab */                   PHA.imp ();                   // push precedence byte
/* adac */                   LDA.imm (0x01);               // 2 bytes
/* adae */                   JSR.abs ("getstk_a3fb");      // check room on stack for A*2 bytes
/* adb1 */                   JSR.abs ("eval_ae83");        // get value from line
/* adb4 */                   LDA.imm (0x00);               // clear A
/* adb6 */                   STA.zpg ("opmask_004d");      // clear comparrison evaluation flag
/* adb8 */        _`_adb8`;  JSR.abs ("chrgot_0079");      // scan memory
/* adbb */        _`_adbb`;  SEC.imp ();                   // set carry for subtract
/* adbc */                   SBC.imm (0xb1);               // subtract the token for ">"
/* adbe */                   BCC.rel ("_add7");            // branch if < ">"
/* adc0 */                   CMP.imm (0x03);               // compare with ">" to +3
/* adc2 */                   BCS.rel ("_add7");            // branch if >= 3
                                                           // was token for ">" "=" or "<"
/* adc4 */                   CMP.imm (0x01);               // compare with token for =
/* adc6 */                   ROL.acc ();                   // *2, b0 = carry (=1 if token was = or <)
/* adc7 */                   EOR.imm (0x01);               // toggle b0
/* adc9 */                   EOR.zpg ("opmask_004d");      // EOR with comparrison evaluation flag
/* adcb */                   CMP.zpg ("opmask_004d");      // compare with comparrison evaluation flag
/* adcd */                   BCC.rel ("_ae30");            // if < saved flag do syntax error then warm start
/* adcf */                   STA.zpg ("opmask_004d");      // save new comparrison evaluation flag
/* add1 */                   JSR.abs ("chrget+0_0073");    // increment and scan memory
/* add4 */                   JMP.abs ("_adbb");            // go do next character
/* add7 */        _`_add7`;  LDX.zpg ("opmask_004d");      // get comparrison evaluation flag
/* add9 */                   BNE.rel ("_ae07");            // branch if compare function
/* addb */                   BCS.rel ("_ae58");            // go do functions
                                                           // else was < TK_GT so is operator or lower
/* addd */                   ADC.imm (0x07);               // add # of operators (+, -, *, /, ^, AND or OR)
/* addf */                   BCC.rel ("_ae58");            // branch if < + operator
                                                           // carry was set so token was +, -, *, /, ^, AND or OR
/* ade1 */                   ADC.zpg ("valtyp_000d");      // add data type flag, $FF = string, $00 = numeric
/* ade3 */                   BNE.rel ("_ade8");            // branch if not string or not + token
                                                           // will only be $00 if type is string and token was +
/* ade5 */                   JMP.abs ("cat_b63d");         // add strings, string 1 is in the descriptor, string 2
                                                           // is in line, and return
/* ade8 */        _`_ade8`;  ADC.imm (0xff);               // -1 (corrects for carry add)
/* adea */                   STA.zpg ("index+0_0022");     // save it
/* adec */                   ASL.acc ();                   // *2
/* aded */                   ADC.zpg ("index+0_0022");     // *3
/* adef */                   TAY.imp ();                   // copy to index
/* adf0 */        _`_adf0`;  PLA.imp ();                   // pull previous precedence
/* adf1 */                   CMP.aby ("optab_a080");       // compare with precedence byte
/* adf4 */                   BCS.rel ("_ae5d");            // branch if A >=
/* adf6 */                   JSR.abs ("_ad8d");            // check if source is numeric, else do type mismatch
/* adf9 */        _`_adf9`;  PHA.imp ();                   // save precedence
/* adfa */        _`_adfa`;  JSR.abs ("_ae20");            // get vector, execute function then continue evaluation
/* adfd */                   PLA.imp ();                   // restore precedence
/* adfe */                   LDY.zpg ("opptr+0_004b");     // get precedence stacked flag
/* ae00 */                   BPL.rel ("_ae19");            // branch if stacked values
/* ae02 */                   TAX.imp ();                   // copy precedence, set flags
/* ae03 */                   BEQ.rel ("_ae5b");            // exit if done
/* ae05 */                   BNE.rel ("_ae66");            // else pop FAC2 and return, branch always
/* ae07 */        _`_ae07`;  LSR.zpg ("valtyp_000d");      // clear data type flag, $FF = string, $00 = numeric
/* ae09 */                   TXA.imp ();                   // copy compare function flag
/* ae0a */                   ROL.acc ();                   // <<1, shift data type flag into b0, 1 = string, 0 = num
/* ae0b */                   LDX.zpg ("txtptr+0_007a");    // get BASIC execute pointer low byte
/* ae0d */                   BNE.rel ("_ae11");            // branch if no underflow
/* ae0f */                   DEC.zpg ("txtptr+1_007b");    // else decrement BASIC execute pointer high byte
/* ae11 */        _`_ae11`;  DEC.zpg ("txtptr+0_007a");    // decrement BASIC execute pointer low byte
/* ae13 */                   LDY.imm (0x1b);
                                                           // set offset to = operator precedence entry
/* ae15 */                   STA.zpg ("opmask_004d");      // save new comparrison evaluation flag
/* ae17 */                   BNE.rel ("_adf0");            // branch always
/* ae19 */        _`_ae19`;  CMP.aby ("optab_a080");       // compare with stacked function precedence
/* ae1c */                   BCS.rel ("_ae66");            // if A >=, pop FAC2 and return
/* ae1e */                   BCC.rel ("_adf9");            // else go stack this one and continue, branch always

// ------------------------------------------------------- // get vector, execute function then continue evaluation
/* ae20 */        _`_ae20`;  LDA.aby (0xa082);             // get function vector high byte
/* ae23 */                   PHA.imp ();                   // onto stack
/* ae24 */                   LDA.aby (0xa081);             // get function vector low byte
/* ae27 */                   PHA.imp ();                   // onto stack
                                                           // now push sign, round FAC1 and put on stack
/* ae28 */                   JSR.abs ("_ae33");            // function will return here, then the next RTS will call
                                                           // the function
/* ae2b */                   LDA.zpg ("opmask_004d");      // get comparrison evaluation flag
/* ae2d */                   JMP.abs ("_ada9");            // continue evaluating expression
/* ae30 */        _`_ae30`;  JMP.abs ("synerr_af08");      // do syntax error then warm start
/* ae33 */        _`_ae33`;  LDA.zpg ("facsgn_0066");      // get FAC1 sign (b7)
/* ae35 */                   LDX.aby ("optab_a080");       // get precedence byte

// ------------------------------------------------------- // push sign, round FAC1 and put on stack
/* ae38 */        _`_ae38`;  TAY.imp ();                   // copy sign
/* ae39 */                   PLA.imp ();                   // get return address low byte
/* ae3a */                   STA.zpg ("index+0_0022");     // save it
/* ae3c */                   INC.zpg ("index+0_0022");     // increment it as return-1 is pushed
                                                           // note, no check is made on the high byte so if the calling
                                                           // routine ever assembles to a page edge then this all goes
                                                           // horribly wrong!
/* ae3e */                   PLA.imp ();                   // get return address high byte
/* ae3f */                   STA.zpg ("index+1_0023");     // save it
/* ae41 */                   TYA.imp ();                   // restore sign
/* ae42 */                   PHA.imp ();                   // push sign

// ------------------------------------------------------- // round FAC1 and put on stack
/* ae43 */        _`_ae43`;  JSR.abs ("round_bc1b");       // round FAC1
/* ae46 */                   LDA.zpg ("facho+3_0065");     // get FAC1 mantissa 4
/* ae48 */                   PHA.imp ();                   // save it
/* ae49 */                   LDA.zpg ("facho+2_0064");     // get FAC1 mantissa 3
/* ae4b */                   PHA.imp ();                   // save it
/* ae4c */                   LDA.zpg ("facho+1_0063");     // get FAC1 mantissa 2
/* ae4e */                   PHA.imp ();                   // save it
/* ae4f */                   LDA.zpg ("facho+0_0062");     // get FAC1 mantissa 1
/* ae51 */                   PHA.imp ();                   // save it
/* ae52 */                   LDA.zpg ("facexp_0061");      // get FAC1 exponent
/* ae54 */                   PHA.imp ();                   // save it
/* ae55 */                   JMP.ind ("index+0_0022");     // return, sort of

// ------------------------------------------------------- // do functions
/* ae58 */        _`_ae58`;  LDY.imm (0xff);               // flag function
/* ae5a */                   PLA.imp ();                   // pull precedence byte
/* ae5b */        _`_ae5b`;  BEQ.rel ("_ae80");            // exit if done
/* ae5d */        _`_ae5d`;  CMP.imm (0x64);               // compare previous precedence with $64
/* ae5f */                   BEQ.rel ("_ae64");            // branch if was $64 (< function)
/* ae61 */                   JSR.abs ("_ad8d");            // check if source is numeric, else do type mismatch
/* ae64 */        _`_ae64`;  STY.zpg ("opptr+0_004b");     // save precedence stacked flag
                                                           // pop FAC2 and return
/* ae66 */        _`_ae66`;  PLA.imp ();                   // pop byte
/* ae67 */                   LSR.acc ();                   // shift out comparison evaluation lowest bit
/* ae68 */                   STA.zpg ("tansgn_0012");      // save the comparison evaluation flag
/* ae6a */                   PLA.imp ();                   // pop exponent
/* ae6b */                   STA.zpg ("argexp_0069");      // save FAC2 exponent
/* ae6d */                   PLA.imp ();                   // pop mantissa 1
/* ae6e */                   STA.zpg ("argho+0_006a");     // save FAC2 mantissa 1
/* ae70 */                   PLA.imp ();                   // pop mantissa 2
/* ae71 */                   STA.zpg ("argho+1_006b");     // save FAC2 mantissa 2
/* ae73 */                   PLA.imp ();                   // pop mantissa 3
/* ae74 */                   STA.zpg ("argho+2_006c");     // save FAC2 mantissa 3
/* ae76 */                   PLA.imp ();                   // pop mantissa 4
/* ae77 */                   STA.zpg ("argho+3_006d");     // save FAC2 mantissa 4
/* ae79 */                   PLA.imp ();                   // pop sign
/* ae7a */                   STA.zpg ("argsgn_006e");      // save FAC2 sign (b7)
/* ae7c */                   EOR.zpg ("facsgn_0066");      // EOR FAC1 sign (b7)
/* ae7e */                   STA.zpg ("arisgn_006f");      // save sign compare (FAC1 EOR FAC2)
/* ae80 */        _`_ae80`;  LDA.zpg ("facexp_0061");      // get FAC1 exponent
/* ae82 */                   RTS.imp ();

// ------------------------------------------------------- // get value from line
/* ae83 */    _`eval_ae83`;  JMP.ind ("ieval+0_030a");     // get arithmetic element

// ------------------------------------------------------- // get arithmetic element, the get arithmetic element vector is initialised to point here
/* ae86 */                   LDA.imm (0x00);               // clear byte
/* ae88 */                   STA.zpg ("valtyp_000d");      // clear data type flag, $FF = string, $00 = numeric
/* ae8a */        _`_ae8a`;  JSR.abs ("chrget+0_0073");    // increment and scan memory
/* ae8d */                   BCS.rel ("_ae92");            // branch if not numeric character
                                                           // else numeric string found (e.g. 123)
/* ae8f */        _`_ae8f`;  JMP.abs ("fin_bcf3");         // get FAC1 from string and return
                                                           // get value from line .. continued
                                                           // wasn't a number so ...
/* ae92 */        _`_ae92`;  JSR.abs ("isletc_b113");      // check byte, return Cb = 0 if<"A" or >"Z"
/* ae95 */                   BCC.rel ("_ae9a");            // branch if not variable name
/* ae97 */                   JMP.abs ("isvar_af28");       // variable name set-up and return
/* ae9a */        _`_ae9a`;  CMP.imm (0xff);               // compare with token for PI
/* ae9c */                   BNE.rel ("qdot_aead");        // branch if not PI
/* ae9e */                   LDA.imm (0xa8);               // get PI pointer low byte
/* aea0 */                   LDY.imm (0xae);               // get PI pointer high byte
/* aea2 */                   JSR.abs ("movfm_bba2");       // unpack memory (AY) into FAC1
/* aea5 */                   JMP.abs ("chrget+0_0073");    // increment and scan memory and return

// ------------------------------------------------------- // PI as floating number
                                                           // 3.141592653
/* aea8 */   _`pival_aea8`;  _.bytes(0x82, 0x49, 0x0f, 0xda, 0xa1);

// ------------------------------------------------------- // get value from line .. continued
                                                           // wasn't variable name so ...
/* aead */    _`qdot_aead`;  CMP.imm (0x2e);               // compare with "."
/* aeaf */                   BEQ.rel ("_ae8f");            // if so get FAC1 from string and return, e.g. was .123
                                                           // wasn't .123 so ...
/* aeb1 */                   CMP.imm (0xab);               // compare with token for -
/* aeb3 */                   BEQ.rel ("domin_af0d");       // branch if - token, do set-up for functions
                                                           // wasn't -123 so ...
/* aeb5 */                   CMP.imm (0xaa);               // compare with token for +
/* aeb7 */                   BEQ.rel ("_ae8a");            // branch if + token, +1 = 1 so ignore leading +
                                                           // it wasn't any sort of number so ...
/* aeb9 */                   CMP.imm (0x22);               // compare with "
/* aebb */                   BNE.rel ("_aecc");            // branch if not open quote
                                                           // was open quote so get the enclosed string

// ------------------------------------------------------- // print "..." string to string utility area
/* aebd */        _`_aebd`;  LDA.zpg ("txtptr+0_007a");    // get BASIC execute pointer low byte
/* aebf */                   LDY.zpg ("txtptr+1_007b");    // get BASIC execute pointer high byte
/* aec1 */                   ADC.imm (0x00);               // add carry to low byte
/* aec3 */                   BCC.rel ("_aec6");            // branch if no overflow
/* aec5 */                   INY.imp ();                   // increment high byte
/* aec6 */        _`_aec6`;  JSR.abs ("strlit_b487");      // print " terminated string to utility pointer
/* aec9 */                   JMP.abs ("_b7e2");            // restore BASIC execute pointer from temp and return
                                                           // get value from line .. continued
                                                           // wasn't a string so ...
/* aecc */        _`_aecc`;  CMP.imm (0xa8);               // compare with token for NOT
/* aece */                   BNE.rel ("_aee3");            // branch if not token for NOT
                                                           // was NOT token
/* aed0 */                   LDY.imm (0x18);               // offset to NOT function
/* aed2 */                   BNE.rel ("_af0f");            // do set-up for function then execute, branch always
                                                           // do = compare
/* aed4 */                   JSR.abs ("ayint_b1bf");       // evaluate integer expression, no sign check
/* aed7 */                   LDA.zpg ("facho+3_0065");     // get FAC1 mantissa 4
/* aed9 */                   EOR.imm (0xff);               // invert it
/* aedb */                   TAY.imp ();                   // copy it
/* aedc */                   LDA.zpg ("facho+2_0064");     // get FAC1 mantissa 3
/* aede */                   EOR.imm (0xff);               // invert it
/* aee0 */                   JMP.abs ("givayf_b391");      // convert fixed integer AY to float FAC1 and return
                                                           // get value from line .. continued
                                                           // wasn't a string or NOT so ...
/* aee3 */        _`_aee3`;  CMP.imm (0xa5);               // compare with token for FN
/* aee5 */                   BNE.rel ("_aeea");            // branch if not token for FN
/* aee7 */                   JMP.abs ("fndoer_b3f4");      // else go evaluate FNx
                                                           // get value from line .. continued
                                                           // wasn't a string, NOT or FN so ...
/* aeea */        _`_aeea`;  CMP.imm (0xb4);               // compare with token for SGN
/* aeec */                   BCC.rel ("parchk_aef1");      // if less than SGN token evaluate expression in parentheses
                                                           // else was a function token
/* aeee */                   JMP.abs ("isfun_afa7");       // go set up function references, branch always
                                                           // get value from line .. continued
                                                           // if here it can only be something in brackets so ....
                                                           // evaluate expression within parentheses
/* aef1 */  _`parchk_aef1`;  JSR.abs ("chkopn_aefa");      // scan for "(", else do syntax error then warm start
/* aef4 */                   JSR.abs ("frmevl_ad9e");      // evaluate expression
                                                           // all the 'scan for' routines return the character after the sought character
                                                           // scan for ")", else do syntax error then warm start
/* aef7 */  _`chkcls_aef7`;  LDA.imm (0x29);               // load A with ")"
/* aef9 */                   _.bytes(0x2c);                // makes next line BIT $28A9
                                                           // scan for "(", else do syntax error then warm start
/* aefa */  _`chkopn_aefa`;  LDA.imm (0x28);               // load A with "("
/* aefc */                   _.bytes(0x2c);                // makes next line BIT $2CA9
                                                           // scan for ",", else do syntax error then warm start
/* aefd */        _`_aefd`;  LDA.imm (0x2c);               // load A with ","
                                                           // scan for CHR$(A), else do syntax error then warm start
/* aeff */  _`chkcom_aeff`;  LDY.imm (0x00);               // clear index
/* af01 */                   CMP.iny ("txtptr+0_007a");    // compare with BASIC byte
/* af03 */                   BNE.rel ("synerr_af08");      // if not expected byte do syntax error then warm start
/* af05 */                   JMP.abs ("chrget+0_0073");    // else increment and scan memory and return
                                                           // syntax error then warm start
/* af08 */  _`synerr_af08`;  LDX.imm (0x0b);               // error code $0B, syntax error
/* af0a */                   JMP.abs ("error_a437");       // do error #X then warm start
/* af0d */   _`domin_af0d`;  LDY.imm (0x15);               // set offset from base to > operator
/* af0f */        _`_af0f`;  PLA.imp ();                   // dump return address low byte
/* af10 */                   PLA.imp ();                   // dump return address high byte
/* af11 */                   JMP.abs ("_adfa");            // execute function then continue evaluation

// ------------------------------------------------------- // check address range, return Cb = 1 if address in BASIC ROM
/* af14 */  _`rsvvar_af14`;  SEC.imp ();                   // set carry for subtract
/* af15 */                   LDA.zpg ("facho+2_0064");     // get variable address low byte
/* af17 */                   SBC.imm (0x00);               // subtract $A000 low byte
/* af19 */                   LDA.zpg ("facho+3_0065");     // get variable address high byte
/* af1b */                   SBC.imm (0xa0);               // subtract $A000 high byte
/* af1d */                   BCC.rel ("_af27");            // exit if address < $A000
/* af1f */                   LDA.imm (0xa2);               // get end of BASIC marker low byte
/* af21 */                   SBC.zpg ("facho+2_0064");     // subtract variable address low byte
/* af23 */                   LDA.imm (0xe3);               // get end of BASIC marker high byte
/* af25 */                   SBC.zpg ("facho+3_0065");     // subtract variable address high byte
/* af27 */        _`_af27`;  RTS.imp ();

// ------------------------------------------------------- // variable name set-up
/* af28 */   _`isvar_af28`;  JSR.abs ("ptrget_b08b");      // get variable address
/* af2b */  _`isvret_af2b`;  STA.zpg ("facho+2_0064");     // save variable pointer low byte
/* af2d */                   STY.zpg ("facho+3_0065");     // save variable pointer high byte
/* af2f */                   LDX.zpg ("varnam+0_0045");    // get current variable name first character
/* af31 */                   LDY.zpg ("varnam+1_0046");    // get current variable name second character
/* af33 */                   LDA.zpg ("valtyp_000d");      // get data type flag, $FF = string, $00 = numeric
/* af35 */                   BEQ.rel ("_af5d");            // branch if numeric
                                                           // variable is string
/* af37 */                   LDA.imm (0x00);               // else clear A
/* af39 */                   STA.zpg ("facov_0070");       // clear FAC1 rounding byte
/* af3b */                   JSR.abs ("rsvvar_af14");      // check address range
/* af3e */                   BCC.rel ("_af5c");            // exit if not in BASIC ROM
/* af40 */                   CPX.imm (0x54);               // compare variable name first character with "T"
/* af42 */                   BNE.rel ("_af5c");            // exit if not "T"
/* af44 */                   CPY.imm (0xc9);               // compare variable name second character with "I$"
/* af46 */                   BNE.rel ("_af5c");            // exit if not "I$"
                                                           // variable name was "TI$"
/* af48 */  _`tisasc_af48`;  JSR.abs ("_af84");            // read real time clock into FAC1 mantissa, 0HML
/* af4b */                   STY.zpg ("tempf2+2_005e");    // clear exponent count adjust
/* af4d */                   DEY.imp ();                   // Y = $FF
/* af4e */                   STY.zpg ("fbufpt+0_0071");    // set output string index, -1 to allow for pre increment
/* af50 */                   LDY.imm (0x06);               // HH:MM:SS is six digits
/* af52 */                   STY.zpg ("tempf2+1_005d");    // set number of characters before the decimal point
/* af54 */                   LDY.imm (0x24);
                                                           // index to jiffy conversion table
/* af56 */                   JSR.abs ("foutim_be68");      // convert jiffy count to string
/* af59 */                   JMP.abs ("_b46f");            // exit via STR$() code tail
/* af5c */        _`_af5c`;  RTS.imp ();
                                                           // variable name set-up, variable is numeric
/* af5d */        _`_af5d`;  BIT.zpg ("intflg_000e");      // test data type flag, $80 = integer, $00 = float
/* af5f */                   BPL.rel ("_af6e");            // branch if float
/* af61 */                   LDY.imm (0x00);               // clear index
/* af63 */                   LDA.iny ("facho+2_0064");     // get integer variable low byte
/* af65 */                   TAX.imp ();                   // copy to X
/* af66 */                   INY.imp ();                   // increment index
/* af67 */                   LDA.iny ("facho+2_0064");     // get integer variable high byte
/* af69 */                   TAY.imp ();                   // copy to Y
/* af6a */                   TXA.imp ();                   // copy loa byte to A
/* af6b */                   JMP.abs ("givayf_b391");      // convert fixed integer AY to float FAC1 and return
                                                           // variable name set-up, variable is float
/* af6e */        _`_af6e`;  JSR.abs ("rsvvar_af14");      // check address range
/* af71 */                   BCC.rel ("_afa0");            // if not in BASIC ROM get pointer and unpack into FAC1
/* af73 */                   CPX.imm (0x54);               // compare variable name first character with "T"
/* af75 */                   BNE.rel ("_af92");            // branch if not "T"
/* af77 */                   CPY.imm (0x49);               // compare variable name second character with "I"
/* af79 */                   BNE.rel ("_afa0");            // branch if not "I"
                                                           // variable name was "TI"
/* af7b */                   JSR.abs ("_af84");            // read real time clock into FAC1 mantissa, 0HML
/* af7e */                   TYA.imp ();                   // clear A
/* af7f */                   LDX.imm (0xa0);               // set exponent to 32 bit value
/* af81 */                   JMP.abs ("_bc4f");            // set exponent = X and normalise FAC1

// ------------------------------------------------------- // read real time clock into FAC1 mantissa, 0HML
/* af84 */        _`_af84`;  JSR.abs ("rdtim_ffde");       // read real time clock
/* af87 */                   STX.zpg ("facho+2_0064");     // save jiffy clock mid byte as  FAC1 mantissa 3
/* af89 */                   STY.zpg ("facho+1_0063");     // save jiffy clock high byte as  FAC1 mantissa 2
/* af8b */                   STA.zpg ("facho+3_0065");     // save jiffy clock low byte as  FAC1 mantissa 4
/* af8d */                   LDY.imm (0x00);               // clear Y
/* af8f */                   STY.zpg ("facho+0_0062");     // clear FAC1 mantissa 1
/* af91 */                   RTS.imp ();
                                                           // variable name set-up, variable is float and not "Tx"
/* af92 */        _`_af92`;  CPX.imm (0x53);               // compare variable name first character with "S"
/* af94 */                   BNE.rel ("_afa0");            // if not "S" go do normal floating variable
/* af96 */                   CPY.imm (0x54);               // compare variable name second character with "
/* af98 */                   BNE.rel ("_afa0");            // if not "T" go do normal floating variable
                                                           // variable name was "ST"
/* af9a */                   JSR.abs ("readst_ffb7");      // read I/O status word
/* af9d */                   JMP.abs ("_bc3c");            // save A as integer byte and return
                                                           // variable is float
/* afa0 */        _`_afa0`;  LDA.zpg ("facho+2_0064");     // get variable pointer low byte
/* afa2 */                   LDY.zpg ("facho+3_0065");     // get variable pointer high byte
/* afa4 */                   JMP.abs ("movfm_bba2");       // unpack memory (AY) into FAC1

// ------------------------------------------------------- // get value from line continued
                                                           // only functions left so ..
                                                           // set up function references
/* afa7 */   _`isfun_afa7`;  ASL.acc ();                   // *2 (2 bytes per function address)
/* afa8 */                   PHA.imp ();                   // save function offset
/* afa9 */                   TAX.imp ();                   // copy function offset
/* afaa */                   JSR.abs ("chrget+0_0073");    // increment and scan memory
/* afad */                   CPX.imm (0x8f);               // compare function offset to CHR$ token offset+1
/* afaf */                   BCC.rel ("numfun_afd1");      // branch if < LEFT$ (can not be =)
                                                           // get value from line .. continued
                                                           // was LEFT$, RIGHT$ or MID$ so..
/* afb1 */  _`strfun_afb1`;  JSR.abs ("chkopn_aefa");      // scan for "(", else do syntax error then warm start
/* afb4 */                   JSR.abs ("frmevl_ad9e");      // evaluate, should be string, expression
/* afb7 */                   JSR.abs ("_aefd");            // scan for ",", else do syntax error then warm start
/* afba */                   JSR.abs ("_ad8f");            // check if source is string, else do type mismatch
/* afbd */                   PLA.imp ();                   // restore function offset
/* afbe */                   TAX.imp ();                   // copy it
/* afbf */                   LDA.zpg ("facho+3_0065");     // get descriptor pointer high byte
/* afc1 */                   PHA.imp ();                   // push string pointer high byte
/* afc2 */                   LDA.zpg ("facho+2_0064");     // get descriptor pointer low byte
/* afc4 */                   PHA.imp ();                   // push string pointer low byte
/* afc5 */                   TXA.imp ();                   // restore function offset
/* afc6 */                   PHA.imp ();                   // save function offset
/* afc7 */                   JSR.abs ("_b79e");            // get byte parameter
/* afca */                   PLA.imp ();                   // restore function offset
/* afcb */                   TAY.imp ();                   // copy function offset
/* afcc */                   TXA.imp ();                   // copy byte parameter to A
/* afcd */                   PHA.imp ();                   // push byte parameter
/* afce */                   JMP.abs ("_afd6");            // go call function
                                                           // get value from line .. continued
                                                           // was SGN() to CHR$() so..
/* afd1 */  _`numfun_afd1`;  JSR.abs ("parchk_aef1");      // evaluate expression within parentheses
/* afd4 */                   PLA.imp ();                   // restore function offset
/* afd5 */                   TAY.imp ();                   // copy to index
/* afd6 */        _`_afd6`;  LDA.aby ("_9fea");            // get function jump vector low byte
/* afd9 */                   STA.zpg ("jmper+1_0055");     // save functions jump vector low byte
/* afdb */                   LDA.aby ("_9feb");            // get function jump vector high byte
/* afde */                   STA.zpg ("jmper+2_0056");     // save functions jump vector high byte
/* afe0 */                   JSR.abs ("jmper+0_0054");     // do function call
/* afe3 */                   JMP.abs ("_ad8d");            // check if source is numeric and RTS, else do type mismatch
                                                           // string functions avoid this by dumping the return address

// ------------------------------------------------------- // perform OR
                                                           // this works because NOT(NOT(x) AND NOT(y)) = x OR y
/* afe6 */    _`orop_afe6`;  LDY.imm (0xff);               // set Y for OR
/* afe8 */                   _.bytes(0x2c);                // makes next line BIT $00A0

// ------------------------------------------------------- // perform AND
/* afe9 */   _`andop_afe9`;  LDY.imm (0x00);               // clear Y for AND
/* afeb */                   STY.zpg ("count_000b");       // set AND/OR invert value
/* afed */                   JSR.abs ("ayint_b1bf");       // evaluate integer expression, no sign check
/* aff0 */                   LDA.zpg ("facho+2_0064");     // get FAC1 mantissa 3
/* aff2 */                   EOR.zpg ("count_000b");       // EOR low byte
/* aff4 */                   STA.zpg ("charac_0007");      // save it
/* aff6 */                   LDA.zpg ("facho+3_0065");     // get FAC1 mantissa 4
/* aff8 */                   EOR.zpg ("count_000b");       // EOR high byte
/* affa */                   STA.zpg ("endchr_0008");      // save it
/* affc */                   JSR.abs ("movfa_bbfc");       // copy FAC2 to FAC1, get 2nd value in expression
/* afff */                   JSR.abs ("ayint_b1bf");       // evaluate integer expression, no sign check
/* b002 */                   LDA.zpg ("facho+3_0065");     // get FAC1 mantissa 4
/* b004 */                   EOR.zpg ("count_000b");       // EOR high byte
/* b006 */                   AND.zpg ("endchr_0008");      // AND with expression 1 high byte
/* b008 */                   EOR.zpg ("count_000b");       // EOR result high byte
/* b00a */                   TAY.imp ();                   // save in Y
/* b00b */                   LDA.zpg ("facho+2_0064");     // get FAC1 mantissa 3
/* b00d */                   EOR.zpg ("count_000b");       // EOR low byte
/* b00f */                   AND.zpg ("charac_0007");      // AND with expression 1 low byte
/* b011 */                   EOR.zpg ("count_000b");       // EOR result low byte
/* b013 */                   JMP.abs ("givayf_b391");      // convert fixed integer AY to float FAC1 and return

// ------------------------------------------------------- // perform comparisons
                                                           // do < compare
/* b016 */   _`dorel_b016`;  JSR.abs ("_ad90");            // type match check, set C for string
/* b019 */                   BCS.rel ("strrel_b02e");      // branch if string
                                                           // do numeric < compare
/* b01b */  _`numrel_b01b`;  LDA.zpg ("argsgn_006e");      // get FAC2 sign (b7)
/* b01d */                   ORA.imm (0x7f);               // set all non sign bits
/* b01f */                   AND.zpg ("argho+0_006a");     // and FAC2 mantissa 1 (AND in sign bit)
/* b021 */                   STA.zpg ("argho+0_006a");     // save FAC2 mantissa 1
/* b023 */                   LDA.imm (0x69);               // set pointer low byte to FAC2
/* b025 */                   LDY.imm (0x00);               // set pointer high byte to FAC2
/* b027 */                   JSR.abs ("fcomp_bc5b");       // compare FAC1 with (AY)
/* b02a */                   TAX.imp ();                   // copy the result
/* b02b */                   JMP.abs ("_b061");            // go evaluate result
                                                           // do string < compare
/* b02e */  _`strrel_b02e`;  LDA.imm (0x00);               // clear byte
/* b030 */                   STA.zpg ("valtyp_000d");      // clear data type flag, $FF = string, $00 = numeric
/* b032 */                   DEC.zpg ("opmask_004d");      // clear < bit in comparrison evaluation flag
/* b034 */                   JSR.abs ("_b6a6");            // pop string off descriptor stack, or from top of string
                                                           // space returns with A = length, X = pointer low byte,
                                                           // Y = pointer high byte
/* b037 */                   STA.zpg ("facexp_0061");      // save length
/* b039 */                   STX.zpg ("facho+0_0062");     // save string pointer low byte
/* b03b */                   STY.zpg ("facho+1_0063");     // save string pointer high byte
/* b03d */                   LDA.zpg ("argho+2_006c");     // get descriptor pointer low byte
/* b03f */                   LDY.zpg ("argho+3_006d");     // get descriptor pointer high byte
/* b041 */                   JSR.abs ("_b6aa");            // pop (YA) descriptor off stack or from top of string space
                                                           // returns with A = length, X = pointer low byte,
                                                           // Y = pointer high byte
/* b044 */                   STX.zpg ("argho+2_006c");     // save string pointer low byte
/* b046 */                   STY.zpg ("argho+3_006d");     // save string pointer high byte
/* b048 */                   TAX.imp ();                   // copy length
/* b049 */                   SEC.imp ();                   // set carry for subtract
/* b04a */                   SBC.zpg ("facexp_0061");      // subtract string 1 length
/* b04c */                   BEQ.rel ("_b056");            // branch if str 1 length = string 2 length
/* b04e */                   LDA.imm (0x01);               // set str 1 length > string 2 length
/* b050 */                   BCC.rel ("_b056");            // branch if so
/* b052 */                   LDX.zpg ("facexp_0061");      // get string 1 length
/* b054 */                   LDA.imm (0xff);               // set str 1 length < string 2 length
/* b056 */        _`_b056`;  STA.zpg ("facsgn_0066");      // save length compare
/* b058 */                   LDY.imm (0xff);               // set index
/* b05a */                   INX.imp ();                   // adjust for loop
/* b05b */        _`_b05b`;  INY.imp ();                   // increment index
/* b05c */                   DEX.imp ();                   // decrement count
/* b05d */                   BNE.rel ("_b066");            // branch if still bytes to do
/* b05f */                   LDX.zpg ("facsgn_0066");      // get length compare back
/* b061 */        _`_b061`;  BMI.rel ("_b072");            // branch if str 1 < str 2
/* b063 */                   CLC.imp ();                   // flag str 1 <= str 2
/* b064 */                   BCC.rel ("_b072");            // go evaluate result
/* b066 */        _`_b066`;  LDA.iny ("argho+2_006c");     // get string 2 byte
/* b068 */                   CMP.iny ("facho+0_0062");     // compare with string 1 byte
/* b06a */                   BEQ.rel ("_b05b");            // loop if bytes =
/* b06c */                   LDX.imm (0xff);               // set str 1 < string 2
/* b06e */                   BCS.rel ("_b072");            // branch if so
/* b070 */                   LDX.imm (0x01);               // set str 1 > string 2
/* b072 */        _`_b072`;  INX.imp ();                   // x = 0, 1 or 2
/* b073 */                   TXA.imp ();                   // copy to A
/* b074 */                   ROL.acc ();                   // * 2 (1, 2 or 4)
/* b075 */                   AND.zpg ("tansgn_0012");      // AND with the comparison evaluation flag
/* b077 */                   BEQ.rel ("_b07b");            // branch if 0 (compare is false)
/* b079 */                   LDA.imm (0xff);               // else set result true
/* b07b */        _`_b07b`;  JMP.abs ("_bc3c");            // save A as integer byte and return
/* b07e */        _`_b07e`;  JSR.abs ("_aefd");            // scan for ",", else do syntax error then warm start

// ------------------------------------------------------- // perform DIM
/* b081 */     _`dim_b081`;  TAX.imp ();                   // copy "DIM" flag to X
/* b082 */                   JSR.abs ("_b090");            // search for variable
/* b085 */                   JSR.abs ("chrgot_0079");      // scan memory
/* b088 */                   BNE.rel ("_b07e");            // scan for "," and loop if not null
/* b08a */                   RTS.imp ();

// ------------------------------------------------------- // search for variable
/* b08b */  _`ptrget_b08b`;  LDX.imm (0x00);               // set DIM flag = $00
/* b08d */                   JSR.abs ("chrgot_0079");      // scan memory, 1st character
/* b090 */        _`_b090`;  STX.zpg ("dimflg_000c");      // save DIM flag
/* b092 */        _`_b092`;  STA.zpg ("varnam+0_0045");    // save 1st character
/* b094 */                   JSR.abs ("chrgot_0079");      // scan memory
/* b097 */                   JSR.abs ("isletc_b113");      // check byte, return Cb = 0 if<"A" or >"Z"
/* b09a */                   BCS.rel ("_b09f");            // branch if ok
/* b09c */        _`_b09c`;  JMP.abs ("synerr_af08");      // else syntax error then warm start
                                                           // was variable name so ...
/* b09f */        _`_b09f`;  LDX.imm (0x00);               // clear 2nd character temp
/* b0a1 */                   STX.zpg ("valtyp_000d");      // clear data type flag, $FF = string, $00 = numeric
/* b0a3 */                   STX.zpg ("intflg_000e");      // clear data type flag, $80 = integer, $00 = float
/* b0a5 */                   JSR.abs ("chrget+0_0073");    // increment and scan memory, 2nd character
/* b0a8 */                   BCC.rel ("_b0af");            // if character = "0"-"9" (ok) go save 2nd character
                                                           // 2nd character wasn't "0" to "9" so ...
/* b0aa */                   JSR.abs ("isletc_b113");      // check byte, return Cb = 0 if<"A" or >"Z"
/* b0ad */                   BCC.rel ("_b0ba");            // branch if <"A" or >"Z" (go check if string)
/* b0af */        _`_b0af`;  TAX.imp ();                   // copy 2nd character
                                                           // ignore further (valid) characters in the variable name
/* b0b0 */        _`_b0b0`;  JSR.abs ("chrget+0_0073");    // increment and scan memory, 3rd character
/* b0b3 */                   BCC.rel ("_b0b0");            // loop if character = "0"-"9" (ignore)
/* b0b5 */                   JSR.abs ("isletc_b113");      // check byte, return Cb = 0 if<"A" or >"Z"
/* b0b8 */                   BCS.rel ("_b0b0");            // loop if character = "A"-"Z" (ignore)
                                                           // check if string variable
/* b0ba */        _`_b0ba`;  CMP.imm (0x24);               // compare with "$"
/* b0bc */                   BNE.rel ("_b0c4");            // branch if not string
                                                           // type is string
/* b0be */                   LDA.imm (0xff);               // set data type = string
/* b0c0 */                   STA.zpg ("valtyp_000d");      // set data type flag, $FF = string, $00 = numeric
/* b0c2 */                   BNE.rel ("_b0d4");            // branch always
/* b0c4 */        _`_b0c4`;  CMP.imm (0x25);               // compare with "%"
/* b0c6 */                   BNE.rel ("_b0db");            // branch if not integer
/* b0c8 */                   LDA.zpg ("subflg_0010");      // get subscript/FNX flag
/* b0ca */                   BNE.rel ("_b09c");            // if ?? do syntax error then warm start
/* b0cc */                   LDA.imm (0x80);               // set integer type
/* b0ce */                   STA.zpg ("intflg_000e");      // set data type = integer
/* b0d0 */                   ORA.zpg ("varnam+0_0045");    // OR current variable name first byte
/* b0d2 */                   STA.zpg ("varnam+0_0045");    // save current variable name first byte
/* b0d4 */        _`_b0d4`;  TXA.imp ();                   // get 2nd character back
/* b0d5 */                   ORA.imm (0x80);               // set top bit, indicate string or integer variable
/* b0d7 */                   TAX.imp ();                   // copy back to 2nd character temp
/* b0d8 */                   JSR.abs ("chrget+0_0073");    // increment and scan memory
/* b0db */        _`_b0db`;  STX.zpg ("varnam+1_0046");    // save 2nd character
/* b0dd */                   SEC.imp ();                   // set carry for subtract
/* b0de */                   ORA.zpg ("subflg_0010");      // or with subscript/FNX flag - or FN name
/* b0e0 */                   SBC.imm (0x28);               // subtract "("
/* b0e2 */                   BNE.rel ("ordvar_b0e7");      // branch if not "("
/* b0e4 */                   JMP.abs ("isary_b1d1");       // go find, or make, array
                                                           // either find or create variable
                                                           // variable name wasn't xx(.... so look for plain variable
/* b0e7 */  _`ordvar_b0e7`;  LDY.imm (0x00);               // clear A
/* b0e9 */                   STY.zpg ("subflg_0010");      // clear subscript/FNX flag
/* b0eb */                   LDA.zpg ("vartab+0_002d");    // get start of variables low byte
/* b0ed */                   LDX.zpg ("vartab+1_002e");    // get start of variables high byte
/* b0ef */        _`_b0ef`;  STX.zpg ("tempf2+4_0060");    // save search address high byte
/* b0f1 */        _`_b0f1`;  STA.zpg ("tempf2+3_005f");    // save search address low byte
/* b0f3 */                   CPX.zpg ("arytab+1_0030");    // compare with end of variables high byte
/* b0f5 */                   BNE.rel ("_b0fb");            // skip next compare if <>
                                                           // high addresses were = so compare low addresses
/* b0f7 */                   CMP.zpg ("arytab+0_002f");    // compare low address with end of variables low byte
/* b0f9 */                   BEQ.rel ("notfns_b11d");      // if not found go make new variable
/* b0fb */        _`_b0fb`;  LDA.zpg ("varnam+0_0045");    // get 1st character of variable to find
/* b0fd */                   CMP.iny ("tempf2+3_005f");    // compare with variable name 1st character
/* b0ff */                   BNE.rel ("_b109");            // branch if no match
                                                           // 1st characters match so compare 2nd character
/* b101 */                   LDA.zpg ("varnam+1_0046");    // get 2nd character of variable to find
/* b103 */                   INY.imp ();                   // index to point to variable name 2nd character
/* b104 */                   CMP.iny ("tempf2+3_005f");    // compare with variable name 2nd character
/* b106 */                   BEQ.rel ("finptr_b185");      // branch if match (found variable)
/* b108 */                   DEY.imp ();                   // else decrement index (now = $00)
/* b109 */        _`_b109`;  CLC.imp ();                   // clear carry for add
/* b10a */                   LDA.zpg ("tempf2+3_005f");    // get search address low byte
/* b10c */                   ADC.imm (0x07);               // +7, offset to next variable name
/* b10e */                   BCC.rel ("_b0f1");            // loop if no overflow to high byte
/* b110 */                   INX.imp ();                   // else increment high byte
/* b111 */                   BNE.rel ("_b0ef");            // loop always, RAM doesn't extend to $FFFF
                                                           // check byte, return Cb = 0 if<"A" or >"Z"
/* b113 */  _`isletc_b113`;  CMP.imm (0x41);               // compare with "A"
/* b115 */                   BCC.rel ("_b11c");            // exit if less
                                                           // carry is set
/* b117 */                   SBC.imm (0x5b);               // subtract "Z"+1
/* b119 */                   SEC.imp ();                   // set carry
/* b11a */                   SBC.imm (0xa5);               // subtract $A5 (restore byte)
                                                           // carry clear if byte > $5A
/* b11c */        _`_b11c`;  RTS.imp ();
                                                           // reached end of variable memory without match
                                                           // ... so create new variable
/* b11d */  _`notfns_b11d`;  PLA.imp ();                   // pop return address low byte
/* b11e */                   PHA.imp ();                   // push return address low byte
/* b11f */                   CMP.imm (0x2a);               // compare with expected calling routine return low byte
/* b121 */                   BNE.rel ("notevl_b128");      // if not get variable go create new variable
                                                           // this will only drop through if the call was from $AF28 and is only called
                                                           // from there if it is searching for a variable from the right hand side of a LET a=b
                                                           // statement, it prevents the creation of variables not assigned a value.
                                                           // value returned by this is either numeric zero, exponent byte is $00, or null string,
                                                           // descriptor length byte is $00. in fact a pointer to any $00 byte would have done.
                                                           // else return dummy null value
/* b123 */        _`_b123`;  LDA.imm (0x13);               // set result pointer low byte
/* b125 */                   LDY.imm (0xbf);               // set result pointer high byte
/* b127 */                   RTS.imp ();
                                                           // create new numeric variable
/* b128 */  _`notevl_b128`;  LDA.zpg ("varnam+0_0045");    // get variable name first character
/* b12a */                   LDY.zpg ("varnam+1_0046");    // get variable name second character
/* b12c */                   CMP.imm (0x54);               // compare first character with "T"
/* b12e */                   BNE.rel ("_b13b");            // branch if not "T"
/* b130 */                   CPY.imm (0xc9);               // compare second character with "I$"
/* b132 */                   BEQ.rel ("_b123");            // if "I$" return null value
/* b134 */                   CPY.imm (0x49);               // compare second character with "I"
/* b136 */                   BNE.rel ("_b13b");            // branch if not "I"
                                                           // if name is "TI" do syntax error
/* b138 */        _`_b138`;  JMP.abs ("synerr_af08");      // do syntax error then warm start
/* b13b */        _`_b13b`;  CMP.imm (0x53);               // compare first character with "S"
/* b13d */                   BNE.rel ("_b143");            // branch if not "S"
/* b13f */                   CPY.imm (0x54);               // compare second character with "T"
/* b141 */                   BEQ.rel ("_b138");            // if name is "ST" do syntax error
/* b143 */        _`_b143`;  LDA.zpg ("arytab+0_002f");    // get end of variables low byte
/* b145 */                   LDY.zpg ("arytab+1_0030");    // get end of variables high byte
/* b147 */                   STA.zpg ("tempf2+3_005f");    // save old block start low byte
/* b149 */                   STY.zpg ("tempf2+4_0060");    // save old block start high byte
/* b14b */                   LDA.zpg ("strend+0_0031");    // get end of arrays low byte
/* b14d */                   LDY.zpg ("strend+1_0032");    // get end of arrays high byte
/* b14f */                   STA.zpg ("tempf1+3_005a");    // save old block end low byte
/* b151 */                   STY.zpg ("tempf1+4_005b");    // save old block end high byte
/* b153 */                   CLC.imp ();                   // clear carry for add
/* b154 */                   ADC.imm (0x07);               // +7, space for one variable
/* b156 */                   BCC.rel ("_b159");            // branch if no overflow to high byte
/* b158 */                   INY.imp ();                   // else increment high byte
/* b159 */        _`_b159`;  STA.zpg ("tempf1+1_0058");    // set new block end low byte
/* b15b */                   STY.zpg ("tempf1+2_0059");    // set new block end high byte
/* b15d */                   JSR.abs ("bltu_a3b8");        // open up space in memory
/* b160 */                   LDA.zpg ("tempf1+1_0058");    // get new start low byte
/* b162 */                   LDY.zpg ("tempf1+2_0059");    // get new start high byte (-$100)
/* b164 */                   INY.imp ();                   // correct high byte
/* b165 */                   STA.zpg ("arytab+0_002f");    // set end of variables low byte
/* b167 */                   STY.zpg ("arytab+1_0030");    // set end of variables high byte
/* b169 */                   LDY.imm (0x00);               // clear index
/* b16b */                   LDA.zpg ("varnam+0_0045");    // get variable name 1st character
/* b16d */                   STA.iny ("tempf2+3_005f");    // save variable name 1st character
/* b16f */                   INY.imp ();                   // increment index
/* b170 */                   LDA.zpg ("varnam+1_0046");    // get variable name 2nd character
/* b172 */                   STA.iny ("tempf2+3_005f");    // save variable name 2nd character
/* b174 */                   LDA.imm (0x00);               // clear A
/* b176 */                   INY.imp ();                   // increment index
/* b177 */                   STA.iny ("tempf2+3_005f");    // initialise variable byte
/* b179 */                   INY.imp ();                   // increment index
/* b17a */                   STA.iny ("tempf2+3_005f");    // initialise variable byte
/* b17c */                   INY.imp ();                   // increment index
/* b17d */                   STA.iny ("tempf2+3_005f");    // initialise variable byte
/* b17f */                   INY.imp ();                   // increment index
/* b180 */                   STA.iny ("tempf2+3_005f");    // initialise variable byte
/* b182 */                   INY.imp ();                   // increment index
/* b183 */                   STA.iny ("tempf2+3_005f");    // initialise variable byte
                                                           // found a match for variable
/* b185 */  _`finptr_b185`;  LDA.zpg ("tempf2+3_005f");    // get variable address low byte
/* b187 */                   CLC.imp ();                   // clear carry for add
/* b188 */                   ADC.imm (0x02);               // +2, offset past variable name bytes
/* b18a */                   LDY.zpg ("tempf2+4_0060");    // get variable address high byte
/* b18c */                   BCC.rel ("_b18f");            // branch if no overflow from add
/* b18e */                   INY.imp ();                   // else increment high byte
/* b18f */        _`_b18f`;  STA.zpg ("varpnt+0_0047");    // save current variable pointer low byte
/* b191 */                   STY.zpg ("varpnt+1_0048");    // save current variable pointer high byte
/* b193 */                   RTS.imp ();
                                                           // set-up array pointer to first element in array
/* b194 */  _`aryget_b194`;  LDA.zpg ("count_000b");       // get # of dimensions (1, 2 or 3)
/* b196 */                   ASL.acc ();                   // *2 (also clears the carry !)
/* b197 */                   ADC.imm (0x05);               // +5 (result is 7, 9 or 11 here)
/* b199 */                   ADC.zpg ("tempf2+3_005f");    // add array start pointer low byte
/* b19b */                   LDY.zpg ("tempf2+4_0060");    // get array pointer high byte
/* b19d */                   BCC.rel ("_b1a0");            // branch if no overflow
/* b19f */                   INY.imp ();                   // else increment high byte
/* b1a0 */        _`_b1a0`;  STA.zpg ("tempf1+1_0058");    // save array data pointer low byte
/* b1a2 */                   STY.zpg ("tempf1+2_0059");    // save array data pointer high byte
/* b1a4 */                   RTS.imp ();

// ------------------------------------------------------- // -32768 as floating value
                                                           // -32768
/* b1a5 */  _`n32768_b1a5`;  _.bytes(0x90, 0x80, 0x00, 0x00, 0x00);

// ------------------------------------------------------- // convert float to fixed
/* b1aa */  _`facinx_b1aa`;  JSR.abs ("ayint_b1bf");       // evaluate integer expression, no sign check
/* b1ad */                   LDA.zpg ("facho+2_0064");     // get result low byte
/* b1af */                   LDY.zpg ("facho+3_0065");     // get result high byte
/* b1b1 */                   RTS.imp ();

// ------------------------------------------------------- // evaluate integer expression
/* b1b2 */  _`intidx_b1b2`;  JSR.abs ("chrget+0_0073");    // increment and scan memory
/* b1b5 */                   JSR.abs ("frmevl_ad9e");      // evaluate expression
                                                           // evaluate integer expression, sign check
/* b1b8 */        _`_b1b8`;  JSR.abs ("_ad8d");            // check if source is numeric, else do type mismatch
/* b1bb */                   LDA.zpg ("facsgn_0066");      // get FAC1 sign (b7)
/* b1bd */                   BMI.rel ("_b1cc");            // do illegal quantity error if -ve
                                                           // evaluate integer expression, no sign check
/* b1bf */   _`ayint_b1bf`;  LDA.zpg ("facexp_0061");      // get FAC1 exponent
/* b1c1 */                   CMP.imm (0x90);               // compare with exponent = 2^16 (n>2^15)
/* b1c3 */                   BCC.rel ("_b1ce");            // if n<2^16 go convert FAC1 floating to fixed and return
/* b1c5 */                   LDA.imm (0xa5);               // set pointer low byte to -32768
/* b1c7 */                   LDY.imm (0xb1);               // set pointer high byte to -32768
/* b1c9 */                   JSR.abs ("fcomp_bc5b");       // compare FAC1 with (AY)
/* b1cc */        _`_b1cc`;  BNE.rel ("fcerr_b248");       // if <> do illegal quantity error then warm start
/* b1ce */        _`_b1ce`;  JMP.abs ("qint_bc9b");        // convert FAC1 floating to fixed and return

// ------------------------------------------------------- // find or make array
                                                           // an array is stored as follows

                                                           // array name             two bytes with the following patterns for different types
                                                           //                        1st char    2nd char
                                                           //                           b7          b7       type             element size
                                                           //                        --------    --------    -----            ------------
                                                           //                           0           0        floating point   5
                                                           //                           0           1        string           3
                                                           //                           1           1        integer          2
                                                           // offset to next array   word
                                                           // dimension count        byte
                                                           // 1st dimension size     word, this is the number of elements including 0
                                                           // 2nd dimension size     word, only here if the array has a second dimension
                                                           // 2nd dimension size     word, only here if the array has a third dimension
                                                           //                        note: the dimension size word is in high byte low byte
                                                           //                        format, not like most 6502 words
                                                           // then for each element the required number of bytes given as the element size above
/* b1d1 */   _`isary_b1d1`;  LDA.zpg ("dimflg_000c");      // get DIM flag
/* b1d3 */                   ORA.zpg ("intflg_000e");      // OR with data type flag
/* b1d5 */                   PHA.imp ();                   // push it
/* b1d6 */                   LDA.zpg ("valtyp_000d");      // get data type flag, $FF = string, $00 = numeric
/* b1d8 */                   PHA.imp ();                   // push it
/* b1d9 */                   LDY.imm (0x00);               // clear dimensions count
                                                           // now get the array dimension(s) and stack it (them) before the data type and DIM flag
/* b1db */        _`_b1db`;  TYA.imp ();                   // copy dimensions count
/* b1dc */                   PHA.imp ();                   // save it
/* b1dd */                   LDA.zpg ("varnam+1_0046");    // get array name 2nd byte
/* b1df */                   PHA.imp ();                   // save it
/* b1e0 */                   LDA.zpg ("varnam+0_0045");    // get array name 1st byte
/* b1e2 */                   PHA.imp ();                   // save it
/* b1e3 */                   JSR.abs ("intidx_b1b2");      // evaluate integer expression
/* b1e6 */                   PLA.imp ();                   // pull array name 1st byte
/* b1e7 */                   STA.zpg ("varnam+0_0045");    // restore array name 1st byte
/* b1e9 */                   PLA.imp ();                   // pull array name 2nd byte
/* b1ea */                   STA.zpg ("varnam+1_0046");    // restore array name 2nd byte
/* b1ec */                   PLA.imp ();                   // pull dimensions count
/* b1ed */                   TAY.imp ();                   // restore it
/* b1ee */                   TSX.imp ();                   // copy stack pointer
/* b1ef */                   LDA.abx ("bad+2_0102");       // get DIM flag
/* b1f2 */                   PHA.imp ();                   // push it
/* b1f3 */                   LDA.abx ("bad+1_0101");       // get data type flag
/* b1f6 */                   PHA.imp ();                   // push it
/* b1f7 */                   LDA.zpg ("facho+2_0064");     // get this dimension size high byte
/* b1f9 */                   STA.abx ("bad+2_0102");       // stack before flag bytes
/* b1fc */                   LDA.zpg ("facho+3_0065");     // get this dimension size low byte
/* b1fe */                   STA.abx ("bad+1_0101");       // stack before flag bytes
/* b201 */                   INY.imp ();                   // increment dimensions count
/* b202 */                   JSR.abs ("chrgot_0079");      // scan memory
/* b205 */                   CMP.imm (0x2c);               // compare with ","
/* b207 */                   BEQ.rel ("_b1db");            // if found go do next dimension
/* b209 */                   STY.zpg ("count_000b");       // store dimensions count
/* b20b */                   JSR.abs ("chkcls_aef7");      // scan for ")", else do syntax error then warm start
/* b20e */                   PLA.imp ();                   // pull data type flag
/* b20f */                   STA.zpg ("valtyp_000d");      // restore data type flag, $FF = string, $00 = numeric
/* b211 */                   PLA.imp ();                   // pull data type flag
/* b212 */                   STA.zpg ("intflg_000e");      // restore data type flag, $80 = integer, $00 = float
/* b214 */                   AND.imm (0x7f);               // mask dim flag
/* b216 */                   STA.zpg ("dimflg_000c");      // restore DIM flag
/* b218 */  _`fndary_b218`;  LDX.zpg ("arytab+0_002f");    // set end of variables low byte
                                                           // (array memory start low byte)
/* b21a */                   LDA.zpg ("arytab+1_0030");    // set end of variables high byte
                                                           // (array memory start high byte)
                                                           // now check to see if we are at the end of array memory, we would be if there were
                                                           // no arrays.
/* b21c */        _`_b21c`;  STX.zpg ("tempf2+3_005f");    // save as array start pointer low byte
/* b21e */                   STA.zpg ("tempf2+4_0060");    // save as array start pointer high byte
/* b220 */                   CMP.zpg ("strend+1_0032");    // compare with end of arrays high byte
/* b222 */                   BNE.rel ("_b228");            // branch if not reached array memory end
/* b224 */                   CPX.zpg ("strend+0_0031");    // else compare with end of arrays low byte
/* b226 */                   BEQ.rel ("notfdd_b261");      // go build array if not found
                                                           // search for array
/* b228 */        _`_b228`;  LDY.imm (0x00);               // clear index
/* b22a */                   LDA.iny ("tempf2+3_005f");    // get array name first byte
/* b22c */                   INY.imp ();                   // increment index to second name byte
/* b22d */                   CMP.zpg ("varnam+0_0045");    // compare with this array name first byte
/* b22f */                   BNE.rel ("_b237");            // branch if no match
/* b231 */                   LDA.zpg ("varnam+1_0046");    // else get this array name second byte
/* b233 */                   CMP.iny ("tempf2+3_005f");    // compare with array name second byte
/* b235 */                   BEQ.rel ("_b24d");            // array found so branch
                                                           // no match
/* b237 */        _`_b237`;  INY.imp ();                   // increment index
/* b238 */                   LDA.iny ("tempf2+3_005f");    // get array size low byte
/* b23a */                   CLC.imp ();                   // clear carry for add
/* b23b */                   ADC.zpg ("tempf2+3_005f");    // add array start pointer low byte
/* b23d */                   TAX.imp ();                   // copy low byte to X
/* b23e */                   INY.imp ();                   // increment index
/* b23f */                   LDA.iny ("tempf2+3_005f");    // get array size high byte
/* b241 */                   ADC.zpg ("tempf2+4_0060");    // add array memory pointer high byte
/* b243 */                   BCC.rel ("_b21c");            // if no overflow go check next array

// ------------------------------------------------------- // do bad subscript error
/* b245 */   _`bserr_b245`;  LDX.imm (0x12);               // error $12, bad subscript error
/* b247 */                   _.bytes(0x2c);                // makes next line BIT $0EA2

// ------------------------------------------------------- // do illegal quantity error
/* b248 */   _`fcerr_b248`;  LDX.imm (0x0e);               // error $0E, illegal quantity error
/* b24a */        _`_b24a`;  JMP.abs ("error_a437");       // do error #X then warm start

// ------------------------------------------------------- // found the array
/* b24d */        _`_b24d`;  LDX.imm (0x13);               // set error $13, double dimension error
/* b24f */                   LDA.zpg ("dimflg_000c");      // get DIM flag
/* b251 */                   BNE.rel ("_b24a");            // if we are trying to dimension it do error #X then warm
                                                           // start
                                                           // found the array and we're not dimensioning it so we must find an element in it
/* b253 */                   JSR.abs ("aryget_b194");      // set-up array pointer to first element in array
/* b256 */                   LDA.zpg ("count_000b");       // get dimensions count
/* b258 */                   LDY.imm (0x04);               // set index to array's # of dimensions
/* b25a */                   CMP.iny ("tempf2+3_005f");    // compare with no of dimensions
/* b25c */                   BNE.rel ("bserr_b245");       // if wrong do bad subscript error
/* b25e */                   JMP.abs ("_b2ea");            // found array so go get element
                                                           // array not found, so build it
/* b261 */  _`notfdd_b261`;  JSR.abs ("aryget_b194");      // set-up array pointer to first element in array
/* b264 */                   JSR.abs ("reason_a408");      // check available memory, do out of memory error if no room
/* b267 */                   LDY.imm (0x00);               // clear Y
/* b269 */                   STY.zpg ("fbufpt+1_0072");    // clear array data size high byte
/* b26b */                   LDX.imm (0x05);               // set default element size
/* b26d */                   LDA.zpg ("varnam+0_0045");    // get variable name 1st byte
/* b26f */                   STA.iny ("tempf2+3_005f");    // save array name 1st byte
/* b271 */                   BPL.rel ("_b274");            // branch if not string or floating point array
/* b273 */                   DEX.imp ();                   // decrement element size, $04
/* b274 */        _`_b274`;  INY.imp ();                   // increment index
/* b275 */                   LDA.zpg ("varnam+1_0046");    // get variable name 2nd byte
/* b277 */                   STA.iny ("tempf2+3_005f");    // save array name 2nd byte
/* b279 */                   BPL.rel ("_b27d");            // branch if not integer or string
/* b27b */                   DEX.imp ();                   // decrement element size, $03
/* b27c */                   DEX.imp ();                   // decrement element size, $02
/* b27d */        _`_b27d`;  STX.zpg ("fbufpt+0_0071");    // save element size
/* b27f */                   LDA.zpg ("count_000b");       // get dimensions count
/* b281 */                   INY.imp ();                   // increment index ..
/* b282 */                   INY.imp ();                   // .. to array  ..
/* b283 */                   INY.imp ();                   // .. dimension count
/* b284 */                   STA.iny ("tempf2+3_005f");    // save array dimension count
/* b286 */        _`_b286`;  LDX.imm (0x0b);               // set default dimension size low byte
/* b288 */                   LDA.imm (0x00);               // set default dimension size high byte
/* b28a */                   BIT.zpg ("dimflg_000c");      // test DIM flag
/* b28c */                   BVC.rel ("_b296");            // branch if default to be used
/* b28e */                   PLA.imp ();                   // pull dimension size low byte
/* b28f */                   CLC.imp ();                   // clear carry for add
/* b290 */                   ADC.imm (0x01);               // add 1, allow for zeroeth element
/* b292 */                   TAX.imp ();                   // copy low byte to X
/* b293 */                   PLA.imp ();                   // pull dimension size high byte
/* b294 */                   ADC.imm (0x00);               // add carry to high byte
/* b296 */        _`_b296`;  INY.imp ();                   // incement index to dimension size high byte
/* b297 */                   STA.iny ("tempf2+3_005f");    // save dimension size high byte
/* b299 */                   INY.imp ();                   // incement index to dimension size low byte
/* b29a */                   TXA.imp ();                   // copy dimension size low byte
/* b29b */                   STA.iny ("tempf2+3_005f");    // save dimension size low byte
/* b29d */                   JSR.abs ("umult_b34c");       // compute array size
/* b2a0 */                   STX.zpg ("fbufpt+0_0071");    // save result low byte
/* b2a2 */                   STA.zpg ("fbufpt+1_0072");    // save result high byte
/* b2a4 */                   LDY.zpg ("index+0_0022");     // restore index
/* b2a6 */                   DEC.zpg ("count_000b");       // decrement dimensions count
/* b2a8 */                   BNE.rel ("_b286");            // loop if not all done
/* b2aa */                   ADC.zpg ("tempf1+2_0059");    // add array data pointer high byte
/* b2ac */                   BCS.rel ("_b30b");            // if overflow do out of memory error then warm start
/* b2ae */                   STA.zpg ("tempf1+2_0059");    // save array data pointer high byte
/* b2b0 */                   TAY.imp ();                   // copy array data pointer high byte
/* b2b1 */                   TXA.imp ();                   // copy array size low byte
/* b2b2 */                   ADC.zpg ("tempf1+1_0058");    // add array data pointer low byte
/* b2b4 */                   BCC.rel ("_b2b9");            // branch if no rollover
/* b2b6 */                   INY.imp ();                   // else increment next array pointer high byte
/* b2b7 */                   BEQ.rel ("_b30b");            // if rolled over do out of memory error then warm start
/* b2b9 */        _`_b2b9`;  JSR.abs ("reason_a408");      // check available memory, do out of memory error if no room
/* b2bc */                   STA.zpg ("strend+0_0031");    // set end of arrays low byte
/* b2be */                   STY.zpg ("strend+1_0032");    // set end of arrays high byte
                                                           // now the aray is created we need to zero all the elements in it
/* b2c0 */                   LDA.imm (0x00);               // clear A for array clear
/* b2c2 */                   INC.zpg ("fbufpt+1_0072");    // increment array size high byte, now block count
/* b2c4 */                   LDY.zpg ("fbufpt+0_0071");    // get array size low byte, now index to block
/* b2c6 */                   BEQ.rel ("_b2cd");            // branch if $00
/* b2c8 */        _`_b2c8`;  DEY.imp ();                   // decrement index, do 0 to n-1
/* b2c9 */                   STA.iny ("tempf1+1_0058");    // clear array element byte
/* b2cb */                   BNE.rel ("_b2c8");            // loop until this block done
/* b2cd */        _`_b2cd`;  DEC.zpg ("tempf1+2_0059");    // decrement array pointer high byte
/* b2cf */                   DEC.zpg ("fbufpt+1_0072");    // decrement block count high byte
/* b2d1 */                   BNE.rel ("_b2c8");            // loop until all blocks done
/* b2d3 */                   INC.zpg ("tempf1+2_0059");    // correct for last loop
/* b2d5 */                   SEC.imp ();                   // set carry for subtract
/* b2d6 */                   LDA.zpg ("strend+0_0031");    // get end of arrays low byte
/* b2d8 */                   SBC.zpg ("tempf2+3_005f");    // subtract array start low byte
/* b2da */                   LDY.imm (0x02);               // index to array size low byte
/* b2dc */                   STA.iny ("tempf2+3_005f");    // save array size low byte
/* b2de */                   LDA.zpg ("strend+1_0032");    // get end of arrays high byte
/* b2e0 */                   INY.imp ();                   // index to array size high byte
/* b2e1 */                   SBC.zpg ("tempf2+4_0060");    // subtract array start high byte
/* b2e3 */                   STA.iny ("tempf2+3_005f");    // save array size high byte
/* b2e5 */                   LDA.zpg ("dimflg_000c");      // get default DIM flag
/* b2e7 */                   BNE.rel ("_b34b");            // exit if this was a DIM command
                                                           // else, find element
/* b2e9 */                   INY.imp ();                   // set index to # of dimensions, the dimension indeces
                                                           // are on the stack and will be removed as the position
                                                           // of the array element is calculated
/* b2ea */        _`_b2ea`;  LDA.iny ("tempf2+3_005f");    // get array's dimension count
/* b2ec */                   STA.zpg ("count_000b");       // save it
/* b2ee */                   LDA.imm (0x00);               // clear byte
/* b2f0 */                   STA.zpg ("fbufpt+0_0071");    // clear array data pointer low byte
/* b2f2 */        _`_b2f2`;  STA.zpg ("fbufpt+1_0072");    // save array data pointer high byte
/* b2f4 */                   INY.imp ();                   // increment index, point to array bound high byte
/* b2f5 */                   PLA.imp ();                   // pull array index low byte
/* b2f6 */                   TAX.imp ();                   // copy to X
/* b2f7 */                   STA.zpg ("facho+2_0064");     // save index low byte to FAC1 mantissa 3
/* b2f9 */                   PLA.imp ();                   // pull array index high byte
/* b2fa */                   STA.zpg ("facho+3_0065");     // save index high byte to FAC1 mantissa 4
/* b2fc */                   CMP.iny ("tempf2+3_005f");    // compare with array bound high byte
/* b2fe */                   BCC.rel ("inlpn2_b30e");      // branch if within bounds
/* b300 */                   BNE.rel ("_b308");            // if outside bounds do bad subscript error
                                                           // else high byte was = so test low bytes
/* b302 */                   INY.imp ();                   // index to array bound low byte
/* b303 */                   TXA.imp ();                   // get array index low byte
/* b304 */                   CMP.iny ("tempf2+3_005f");    // compare with array bound low byte
/* b306 */                   BCC.rel ("_b30f");            // branch if within bounds
/* b308 */        _`_b308`;  JMP.abs ("bserr_b245");       // do bad subscript error
/* b30b */        _`_b30b`;  JMP.abs ("omerr_a435");       // do out of memory error then warm start
/* b30e */  _`inlpn2_b30e`;  INY.imp ();                   // index to array bound low byte
/* b30f */        _`_b30f`;  LDA.zpg ("fbufpt+1_0072");    // get array data pointer high byte
/* b311 */                   ORA.zpg ("fbufpt+0_0071");    // OR with array data pointer low byte
/* b313 */                   CLC.imp ();                   // clear carry for either add, carry always clear here ??
/* b314 */                   BEQ.rel ("_b320");            // branch if array data pointer = null, skip multiply
/* b316 */                   JSR.abs ("umult_b34c");       // compute array size
/* b319 */                   TXA.imp ();                   // get result low byte
/* b31a */                   ADC.zpg ("facho+2_0064");     // add index low byte from FAC1 mantissa 3
/* b31c */                   TAX.imp ();                   // save result low byte
/* b31d */                   TYA.imp ();                   // get result high byte
/* b31e */                   LDY.zpg ("index+0_0022");     // restore index
/* b320 */        _`_b320`;  ADC.zpg ("facho+3_0065");     // add index high byte from FAC1 mantissa 4
/* b322 */                   STX.zpg ("fbufpt+0_0071");    // save array data pointer low byte
/* b324 */                   DEC.zpg ("count_000b");       // decrement dimensions count
/* b326 */                   BNE.rel ("_b2f2");            // loop if dimensions still to do
/* b328 */                   STA.zpg ("fbufpt+1_0072");    // save array data pointer high byte
/* b32a */                   LDX.imm (0x05);               // set default element size
/* b32c */                   LDA.zpg ("varnam+0_0045");    // get variable name 1st byte
/* b32e */                   BPL.rel ("_b331");            // branch if not string or floating point array
/* b330 */                   DEX.imp ();                   // decrement element size, $04
/* b331 */        _`_b331`;  LDA.zpg ("varnam+1_0046");    // get variable name 2nd byte
/* b333 */                   BPL.rel ("_b337");            // branch if not integer or string
/* b335 */                   DEX.imp ();                   // decrement element size, $03
/* b336 */                   DEX.imp ();                   // decrement element size, $02
/* b337 */        _`_b337`;  STX.zpg ("resho+2_0028");     // save dimension size low byte
/* b339 */                   LDA.imm (0x00);               // clear dimension size high byte
/* b33b */                   JSR.abs ("_b355");            // compute array size
/* b33e */                   TXA.imp ();                   // copy array size low byte
/* b33f */                   ADC.zpg ("tempf1+1_0058");    // add array data start pointer low byte
/* b341 */                   STA.zpg ("varpnt+0_0047");    // save as current variable pointer low byte
/* b343 */                   TYA.imp ();                   // copy array size high byte
/* b344 */                   ADC.zpg ("tempf1+2_0059");    // add array data start pointer high byte
/* b346 */                   STA.zpg ("varpnt+1_0048");    // save as current variable pointer high byte
/* b348 */                   TAY.imp ();                   // copy high byte to Y
/* b349 */                   LDA.zpg ("varpnt+0_0047");    // get current variable pointer low byte
                                                           // pointer to element is now in AY
/* b34b */        _`_b34b`;  RTS.imp ();
                                                           // compute array size, result in XY
/* b34c */   _`umult_b34c`;  STY.zpg ("index+0_0022");     // save index
/* b34e */                   LDA.iny ("tempf2+3_005f");    // get dimension size low byte
/* b350 */                   STA.zpg ("resho+2_0028");     // save dimension size low byte
/* b352 */                   DEY.imp ();                   // decrement index
/* b353 */                   LDA.iny ("tempf2+3_005f");    // get dimension size high byte
/* b355 */        _`_b355`;  STA.zpg ("resho+3_0029");     // save dimension size high byte
/* b357 */                   LDA.imm (0x10);               // count = $10 (16 bit multiply)
/* b359 */                   STA.zpg ("tempf2+1_005d");    // save bit count
/* b35b */                   LDX.imm (0x00);               // clear result low byte
/* b35d */                   LDY.imm (0x00);               // clear result high byte
/* b35f */        _`_b35f`;  TXA.imp ();                   // get result low byte
/* b360 */                   ASL.acc ();                   // *2
/* b361 */                   TAX.imp ();                   // save result low byte
/* b362 */                   TYA.imp ();                   // get result high byte
/* b363 */                   ROL.acc ();                   // *2
/* b364 */                   TAY.imp ();                   // save result high byte
/* b365 */                   BCS.rel ("_b30b");            // if overflow go do "Out of memory" error
/* b367 */                   ASL.zpg ("fbufpt+0_0071");    // shift element size low byte
/* b369 */                   ROL.zpg ("fbufpt+1_0072");    // shift element size high byte
/* b36b */                   BCC.rel ("_b378");            // skip add if no carry
/* b36d */                   CLC.imp ();                   // else clear carry for add
/* b36e */                   TXA.imp ();                   // get result low byte
/* b36f */                   ADC.zpg ("resho+2_0028");     // add dimension size low byte
/* b371 */                   TAX.imp ();                   // save result low byte
/* b372 */                   TYA.imp ();                   // get result high byte
/* b373 */                   ADC.zpg ("resho+3_0029");     // add dimension size high byte
/* b375 */                   TAY.imp ();                   // save result high byte
/* b376 */                   BCS.rel ("_b30b");            // if overflow go do "Out of memory" error
/* b378 */        _`_b378`;  DEC.zpg ("tempf2+1_005d");    // decrement bit count
/* b37a */                   BNE.rel ("_b35f");            // loop until all done
/* b37c */                   RTS.imp ();
                                                           // perform FRE()
/* b37d */     _`fre_b37d`;  LDA.zpg ("valtyp_000d");      // get data type flag, $FF = string, $00 = numeric
/* b37f */                   BEQ.rel ("_b384");            // branch if numeric
/* b381 */                   JSR.abs ("_b6a6");            // pop string off descriptor stack, or from top of string
                                                           // space returns with A = length, X=$71=pointer low byte,
                                                           // Y=$72=pointer high byte
                                                           // FRE(n) was numeric so do this
/* b384 */        _`_b384`;  JSR.abs ("garbag_b526");      // go do garbage collection
/* b387 */                   SEC.imp ();                   // set carry for subtract
/* b388 */                   LDA.zpg ("fretop+0_0033");    // get bottom of string space low byte
/* b38a */                   SBC.zpg ("strend+0_0031");    // subtract end of arrays low byte
/* b38c */                   TAY.imp ();                   // copy result to Y
/* b38d */                   LDA.zpg ("fretop+1_0034");    // get bottom of string space high byte
/* b38f */                   SBC.zpg ("strend+1_0032");    // subtract end of arrays high byte

// ------------------------------------------------------- // convert fixed integer AY to float FAC1
/* b391 */  _`givayf_b391`;  LDX.imm (0x00);               // set type = numeric
/* b393 */                   STX.zpg ("valtyp_000d");      // clear data type flag, $FF = string, $00 = numeric
/* b395 */                   STA.zpg ("facho+0_0062");     // save FAC1 mantissa 1
/* b397 */                   STY.zpg ("facho+1_0063");     // save FAC1 mantissa 2
/* b399 */                   LDX.imm (0x90);               // set exponent=2^16 (integer)
/* b39b */                   JMP.abs ("_bc44");            // set exp = X, clear FAC1 3 and 4, normalise and return

// ------------------------------------------------------- // perform POS()
/* b39e */     _`pos_b39e`;  SEC.imp ();                   // set Cb for read cursor position
/* b39f */                   JSR.abs ("plot_fff0");        // read/set X,Y cursor position
/* b3a2 */        _`_b3a2`;  LDA.imm (0x00);               // clear high byte
/* b3a4 */                   BEQ.rel ("givayf_b391");      // convert fixed integer AY to float FAC1, branch always
                                                           // check not Direct, used by DEF and INPUT
/* b3a6 */  _`errdir_b3a6`;  LDX.zpg ("curlin+1_003a");    // get current line number high byte
/* b3a8 */                   INX.imp ();                   // increment it
/* b3a9 */                   BNE.rel ("_b34b");            // return if not direct mode
                                                           // else do illegal direct error
/* b3ab */                   LDX.imm (0x15);               // error $15, illegal direct error
/* b3ad */                   _.bytes(0x2c);                // makes next line BIT $1BA2
/* b3ae */        _`_b3ae`;  LDX.imm (0x1b);               // error $1B, undefined function error
/* b3b0 */                   JMP.abs ("error_a437");       // do error #X then warm start

// ------------------------------------------------------- // perform DEF
/* b3b3 */     _`def_b3b3`;  JSR.abs ("getfnm_b3e1");      // check FNx syntax
/* b3b6 */                   JSR.abs ("errdir_b3a6");      // check not direct, back here if ok
/* b3b9 */                   JSR.abs ("chkopn_aefa");      // scan for "(", else do syntax error then warm start
/* b3bc */                   LDA.imm (0x80);               // set flag for FNx
/* b3be */                   STA.zpg ("subflg_0010");      // save subscript/FNx flag
/* b3c0 */                   JSR.abs ("ptrget_b08b");      // get variable address
/* b3c3 */                   JSR.abs ("_ad8d");            // check if source is numeric, else do type mismatch
/* b3c6 */                   JSR.abs ("chkcls_aef7");      // scan for ")", else do syntax error then warm start
/* b3c9 */                   LDA.imm (0xb2);               // get = token
/* b3cb */                   JSR.abs ("chkcom_aeff");      // scan for CHR$(A), else do syntax error then warm start
/* b3ce */                   PHA.imp ();                   // push next character
/* b3cf */                   LDA.zpg ("varpnt+1_0048");    // get current variable pointer high byte
/* b3d1 */                   PHA.imp ();                   // push it
/* b3d2 */                   LDA.zpg ("varpnt+0_0047");    // get current variable pointer low byte
/* b3d4 */                   PHA.imp ();                   // push it
/* b3d5 */                   LDA.zpg ("txtptr+1_007b");    // get BASIC execute pointer high byte
/* b3d7 */                   PHA.imp ();                   // push it
/* b3d8 */                   LDA.zpg ("txtptr+0_007a");    // get BASIC execute pointer low byte
/* b3da */                   PHA.imp ();                   // push it
/* b3db */                   JSR.abs ("data_a8f8");        // perform DATA
/* b3de */                   JMP.abs ("_b44f");            // put execute pointer and variable pointer into function
                                                           // and return

// ------------------------------------------------------- // check FNx syntax
/* b3e1 */  _`getfnm_b3e1`;  LDA.imm (0xa5);               // set FN token
/* b3e3 */                   JSR.abs ("chkcom_aeff");      // scan for CHR$(A), else do syntax error then warm start
/* b3e6 */                   ORA.imm (0x80);               // set FN flag bit
/* b3e8 */                   STA.zpg ("subflg_0010");      // save FN name
/* b3ea */                   JSR.abs ("_b092");            // search for FN variable
/* b3ed */                   STA.zpg ("defpnt+0_004e");    // save function pointer low byte
/* b3ef */                   STY.zpg ("defpnt+1_004f");    // save function pointer high byte
/* b3f1 */                   JMP.abs ("_ad8d");            // check if source is numeric and return, else do type
                                                           // mismatch

// ------------------------------------------------------- // Evaluate FNx
/* b3f4 */  _`fndoer_b3f4`;  JSR.abs ("getfnm_b3e1");      // check FNx syntax
/* b3f7 */                   LDA.zpg ("defpnt+1_004f");    // get function pointer high byte
/* b3f9 */                   PHA.imp ();                   // push it
/* b3fa */                   LDA.zpg ("defpnt+0_004e");    // get function pointer low byte
/* b3fc */                   PHA.imp ();                   // push it
/* b3fd */                   JSR.abs ("parchk_aef1");      // evaluate expression within parentheses
/* b400 */                   JSR.abs ("_ad8d");            // check if source is numeric, else do type mismatch
/* b403 */                   PLA.imp ();                   // pop function pointer low byte
/* b404 */                   STA.zpg ("defpnt+0_004e");    // restore it
/* b406 */                   PLA.imp ();                   // pop function pointer high byte
/* b407 */                   STA.zpg ("defpnt+1_004f");    // restore it
/* b409 */                   LDY.imm (0x02);               // index to variable pointer high byte
/* b40b */                   LDA.iny ("defpnt+0_004e");    // get variable address low byte
/* b40d */                   STA.zpg ("varpnt+0_0047");    // save current variable pointer low byte
/* b40f */                   TAX.imp ();                   // copy address low byte
/* b410 */                   INY.imp ();                   // index to variable address high byte
/* b411 */                   LDA.iny ("defpnt+0_004e");    // get variable pointer high byte
/* b413 */                   BEQ.rel ("_b3ae");            // branch if high byte zero
/* b415 */                   STA.zpg ("varpnt+1_0048");    // save current variable pointer high byte
/* b417 */                   INY.imp ();                   // index to mantissa 3
                                                           // now stack the function variable value before use
/* b418 */        _`_b418`;  LDA.iny ("varpnt+0_0047");    // get byte from variable
/* b41a */                   PHA.imp ();                   // stack it
/* b41b */                   DEY.imp ();                   // decrement index
/* b41c */                   BPL.rel ("_b418");            // loop until variable stacked
/* b41e */                   LDY.zpg ("varpnt+1_0048");    // get current variable pointer high byte
/* b420 */                   JSR.abs ("_bbd4");            // pack FAC1 into (XY)
/* b423 */                   LDA.zpg ("txtptr+1_007b");    // get BASIC execute pointer high byte
/* b425 */                   PHA.imp ();                   // push it
/* b426 */                   LDA.zpg ("txtptr+0_007a");    // get BASIC execute pointer low byte
/* b428 */                   PHA.imp ();                   // push it
/* b429 */                   LDA.iny ("defpnt+0_004e");    // get function execute pointer low byte
/* b42b */                   STA.zpg ("txtptr+0_007a");    // save BASIC execute pointer low byte
/* b42d */                   INY.imp ();                   // index to high byte
/* b42e */                   LDA.iny ("defpnt+0_004e");    // get function execute pointer high byte
/* b430 */                   STA.zpg ("txtptr+1_007b");    // save BASIC execute pointer high byte
/* b432 */                   LDA.zpg ("varpnt+1_0048");    // get current variable pointer high byte
/* b434 */                   PHA.imp ();                   // push it
/* b435 */                   LDA.zpg ("varpnt+0_0047");    // get current variable pointer low byte
/* b437 */                   PHA.imp ();                   // push it
/* b438 */                   JSR.abs ("frmnum_ad8a");      // evaluate expression and check is numeric, else do
                                                           // type mismatch
/* b43b */                   PLA.imp ();                   // pull variable address low byte
/* b43c */                   STA.zpg ("defpnt+0_004e");    // save variable address low byte
/* b43e */                   PLA.imp ();                   // pull variable address high byte
/* b43f */                   STA.zpg ("defpnt+1_004f");    // save variable address high byte
/* b441 */                   JSR.abs ("chrgot_0079");      // scan memory
/* b444 */                   BEQ.rel ("_b449");            // branch if null (should be [EOL] marker)
/* b446 */                   JMP.abs ("synerr_af08");      // else syntax error then warm start

// ------------------------------------------------------- // restore BASIC execute pointer and function variable from stack
/* b449 */        _`_b449`;  PLA.imp ();                   // pull BASIC execute pointer low byte
/* b44a */                   STA.zpg ("txtptr+0_007a");    // save BASIC execute pointer low byte
/* b44c */                   PLA.imp ();                   // pull BASIC execute pointer high byte
/* b44d */                   STA.zpg ("txtptr+1_007b");    // save BASIC execute pointer high byte
                                                           // put execute pointer and variable pointer into function
/* b44f */        _`_b44f`;  LDY.imm (0x00);               // clear index
/* b451 */                   PLA.imp ();                   // pull BASIC execute pointer low byte
/* b452 */                   STA.iny ("defpnt+0_004e");    // save to function
/* b454 */                   PLA.imp ();                   // pull BASIC execute pointer high byte
/* b455 */                   INY.imp ();                   // increment index
/* b456 */                   STA.iny ("defpnt+0_004e");    // save to function
/* b458 */                   PLA.imp ();                   // pull current variable address low byte
/* b459 */                   INY.imp ();                   // increment index
/* b45a */                   STA.iny ("defpnt+0_004e");    // save to function
/* b45c */                   PLA.imp ();                   // pull current variable address high byte
/* b45d */                   INY.imp ();                   // increment index
/* b45e */                   STA.iny ("defpnt+0_004e");    // save to function
/* b460 */                   PLA.imp ();                   // pull ??
/* b461 */                   INY.imp ();                   // increment index
/* b462 */                   STA.iny ("defpnt+0_004e");    // save to function
/* b464 */                   RTS.imp ();

// ------------------------------------------------------- // perform STR$()
/* b465 */    _`strd_b465`;  JSR.abs ("_ad8d");            // check if source is numeric, else do type mismatch
/* b468 */                   LDY.imm (0x00);               // set string index
/* b46a */                   JSR.abs ("_bddf");            // convert FAC1 to string
/* b46d */                   PLA.imp ();                   // dump return address (skip type check)
/* b46e */                   PLA.imp ();                   // dump return address (skip type check)
/* b46f */        _`_b46f`;  LDA.imm (0xff);               // set result string low pointer
/* b471 */                   LDY.imm (0x00);               // set result string high pointer
/* b473 */                   BEQ.rel ("strlit_b487");      // print null terminated string to utility pointer

// ------------------------------------------------------- // do string vector
                                                           // copy descriptor pointer and make string space A bytes long
/* b475 */        _`_b475`;  LDX.zpg ("facho+2_0064");     // get descriptor pointer low byte
/* b477 */                   LDY.zpg ("facho+3_0065");     // get descriptor pointer high byte
/* b479 */                   STX.zpg ("dscpnt+0_0050");    // save descriptor pointer low byte
/* b47b */                   STY.zpg ("dscpnt+1_0051");    // save descriptor pointer high byte

// ------------------------------------------------------- // make string space A bytes long
/* b47d */        _`_b47d`;  JSR.abs ("getspa_b4f4");      // make space in string memory for string A long
/* b480 */                   STX.zpg ("facho+0_0062");     // save string pointer low byte
/* b482 */                   STY.zpg ("facho+1_0063");     // save string pointer high byte
/* b484 */                   STA.zpg ("facexp_0061");      // save length
/* b486 */                   RTS.imp ();

// ------------------------------------------------------- // scan, set up string
                                                           // print " terminated string to utility pointer
/* b487 */  _`strlit_b487`;  LDX.imm (0x22);               // set terminator to "
/* b489 */                   STX.zpg ("charac_0007");      // set search character, terminator 1
/* b48b */                   STX.zpg ("endchr_0008");      // set terminator 2
                                                           // print search or alternate terminated string to utility pointer
                                                           // source is AY
/* b48d */        _`_b48d`;  STA.zpg ("arisgn_006f");      // store string start low byte
/* b48f */                   STY.zpg ("facov_0070");       // store string start high byte
/* b491 */                   STA.zpg ("facho+0_0062");     // save string pointer low byte
/* b493 */                   STY.zpg ("facho+1_0063");     // save string pointer high byte
/* b495 */                   LDY.imm (0xff);               // set length to -1
/* b497 */        _`_b497`;  INY.imp ();                   // increment length
/* b498 */                   LDA.iny ("arisgn_006f");      // get byte from string
/* b49a */                   BEQ.rel ("_b4a8");            // exit loop if null byte [EOS]
/* b49c */                   CMP.zpg ("charac_0007");      // compare with search character, terminator 1
/* b49e */                   BEQ.rel ("_b4a4");            // branch if terminator
/* b4a0 */                   CMP.zpg ("endchr_0008");      // compare with terminator 2
/* b4a2 */                   BNE.rel ("_b497");            // loop if not terminator 2
/* b4a4 */        _`_b4a4`;  CMP.imm (0x22);               // compare with "
/* b4a6 */                   BEQ.rel ("_b4a9");            // branch if " (carry set if = !)
/* b4a8 */        _`_b4a8`;  CLC.imp ();                   // clear carry for add (only if [EOL] terminated string)
/* b4a9 */        _`_b4a9`;  STY.zpg ("facexp_0061");      // save length in FAC1 exponent
/* b4ab */                   TYA.imp ();                   // copy length to A
/* b4ac */                   ADC.zpg ("arisgn_006f");      // add string start low byte
/* b4ae */                   STA.zpg ("fbufpt+0_0071");    // save string end low byte
/* b4b0 */                   LDX.zpg ("facov_0070");       // get string start high byte
/* b4b2 */                   BCC.rel ("_b4b5");            // branch if no low byte overflow
/* b4b4 */                   INX.imp ();                   // else increment high byte
/* b4b5 */        _`_b4b5`;  STX.zpg ("fbufpt+1_0072");    // save string end high byte
/* b4b7 */                   LDA.zpg ("facov_0070");       // get string start high byte
/* b4b9 */                   BEQ.rel ("_b4bf");            // branch if in utility area
/* b4bb */                   CMP.imm (0x02);               // compare with input buffer memory high byte
/* b4bd */                   BNE.rel ("_b4ca");            // branch if not in input buffer memory
                                                           // string in input buffer or utility area, move to string
                                                           // memory
/* b4bf */        _`_b4bf`;  TYA.imp ();                   // copy length to A
/* b4c0 */                   JSR.abs ("_b475");            // copy descriptor pointer and make string space A bytes long
/* b4c3 */                   LDX.zpg ("arisgn_006f");      // get string start low byte
/* b4c5 */                   LDY.zpg ("facov_0070");       // get string start high byte
/* b4c7 */                   JSR.abs ("_b688");            // store string A bytes long from XY to utility pointer
                                                           // check for space on descriptor stack then ...
                                                           // put string address and length on descriptor stack and update stack pointers
/* b4ca */        _`_b4ca`;  LDX.zpg ("temppt_0016");      // get the descriptor stack pointer
/* b4cc */                   CPX.imm (0x22);               // compare it with the maximum + 1
/* b4ce */                   BNE.rel ("putnw1_b4d5");      // if there is space on the string stack continue
                                                           // else do string too complex error
/* b4d0 */                   LDX.imm (0x19);               // error $19, string too complex error
/* b4d2 */        _`_b4d2`;  JMP.abs ("error_a437");       // do error #X then warm start
                                                           // put string address and length on descriptor stack and update stack pointers
/* b4d5 */  _`putnw1_b4d5`;  LDA.zpg ("facexp_0061");      // get the string length
/* b4d7 */                   STA.zpx (0x00);               // put it on the string stack
/* b4d9 */                   LDA.zpg ("facho+0_0062");     // get the string pointer low byte
/* b4db */                   STA.zpx (0x01);               // put it on the string stack
/* b4dd */                   LDA.zpg ("facho+1_0063");     // get the string pointer high byte
/* b4df */                   STA.zpx (0x02);               // put it on the string stack
/* b4e1 */                   LDY.imm (0x00);               // clear Y
/* b4e3 */                   STX.zpg ("facho+2_0064");     // save the string descriptor pointer low byte
/* b4e5 */                   STY.zpg ("facho+3_0065");     // save the string descriptor pointer high byte, always $00
/* b4e7 */                   STY.zpg ("facov_0070");       // clear FAC1 rounding byte
/* b4e9 */                   DEY.imp ();                   // Y = $FF
/* b4ea */                   STY.zpg ("valtyp_000d");      // save the data type flag, $FF = string
/* b4ec */                   STX.zpg ("lastpt+0_0017");    // save the current descriptor stack item pointer low byte
/* b4ee */                   INX.imp ();                   // update the stack pointer
/* b4ef */                   INX.imp ();                   // update the stack pointer
/* b4f0 */                   INX.imp ();                   // update the stack pointer
/* b4f1 */                   STX.zpg ("temppt_0016");      // save the new descriptor stack pointer
/* b4f3 */                   RTS.imp ();

// ------------------------------------------------------- // make space in string memory for string A long
                                                           // return X = pointer low byte, Y = pointer high byte
/* b4f4 */  _`getspa_b4f4`;  LSR.zpg ("garbfl_000f");      // clear garbage collected flag (b7)
                                                           // make space for string A long
/* b4f6 */        _`_b4f6`;  PHA.imp ();                   // save string length
/* b4f7 */                   EOR.imm (0xff);               // complement it
/* b4f9 */                   SEC.imp ();                   // set carry for subtract, two's complement add
/* b4fa */                   ADC.zpg ("fretop+0_0033");    // add bottom of string space low byte, subtract length
/* b4fc */                   LDY.zpg ("fretop+1_0034");    // get bottom of string space high byte
/* b4fe */                   BCS.rel ("_b501");            // skip decrement if no underflow
/* b500 */                   DEY.imp ();                   // decrement bottom of string space high byte
/* b501 */        _`_b501`;  CPY.zpg ("strend+1_0032");    // compare with end of arrays high byte
/* b503 */                   BCC.rel ("_b516");            // do out of memory error if less
/* b505 */                   BNE.rel ("_b50b");            // if not = skip next test
/* b507 */                   CMP.zpg ("strend+0_0031");    // compare with end of arrays low byte
/* b509 */                   BCC.rel ("_b516");            // do out of memory error if less
/* b50b */        _`_b50b`;  STA.zpg ("fretop+0_0033");    // save bottom of string space low byte
/* b50d */                   STY.zpg ("fretop+1_0034");    // save bottom of string space high byte
/* b50f */                   STA.zpg ("frespc+0_0035");    // save string utility ptr low byte
/* b511 */                   STY.zpg ("frespc+1_0036");    // save string utility ptr high byte
/* b513 */                   TAX.imp ();                   // copy low byte to X
/* b514 */                   PLA.imp ();                   // get string length back
/* b515 */                   RTS.imp ();
/* b516 */        _`_b516`;  LDX.imm (0x10);               // error code $10, out of memory error
/* b518 */                   LDA.zpg ("garbfl_000f");      // get garbage collected flag
/* b51a */                   BMI.rel ("_b4d2");            // if set then do error code X
/* b51c */                   JSR.abs ("garbag_b526");      // else go do garbage collection
/* b51f */                   LDA.imm (0x80);               // flag for garbage collected
/* b521 */                   STA.zpg ("garbfl_000f");      // set garbage collected flag
/* b523 */                   PLA.imp ();                   // pull length
/* b524 */                   BNE.rel ("_b4f6");            // go try again (loop always, length should never be = $00)

// ------------------------------------------------------- // garbage collection routine
/* b526 */  _`garbag_b526`;  LDX.zpg ("memsiz+0_0037");    // get end of memory low byte
/* b528 */                   LDA.zpg ("memsiz+1_0038");    // get end of memory high byte
                                                           // re-run routine from last ending
/* b52a */        _`_b52a`;  STX.zpg ("fretop+0_0033");    // set bottom of string space low byte
/* b52c */                   STA.zpg ("fretop+1_0034");    // set bottom of string space high byte
/* b52e */                   LDY.imm (0x00);               // clear index
/* b530 */                   STY.zpg ("defpnt+1_004f");    // clear working pointer high byte
/* b532 */                   STY.zpg ("defpnt+0_004e");    // clear working pointer low byte
/* b534 */                   LDA.zpg ("strend+0_0031");    // get end of arrays low byte
/* b536 */                   LDX.zpg ("strend+1_0032");    // get end of arrays high byte
/* b538 */                   STA.zpg ("tempf2+3_005f");    // save as highest uncollected string pointer low byte
/* b53a */                   STX.zpg ("tempf2+4_0060");    // save as highest uncollected string pointer high byte
/* b53c */                   LDA.imm (0x19);               // set descriptor stack pointer
/* b53e */                   LDX.imm (0x00);               // clear X
/* b540 */                   STA.zpg ("index+0_0022");     // save descriptor stack pointer low byte
/* b542 */                   STX.zpg ("index+1_0023");     // save descriptor stack pointer high byte ($00)
/* b544 */        _`_b544`;  CMP.zpg ("temppt_0016");      // compare with descriptor stack pointer
/* b546 */                   BEQ.rel ("_b54d");            // branch if =
/* b548 */                   JSR.abs ("_b5c7");            // check string salvageability
/* b54b */                   BEQ.rel ("_b544");            // loop always
                                                           // done stacked strings, now do string variables
/* b54d */        _`_b54d`;  LDA.imm (0x07);               // set step size = $07, collecting variables
/* b54f */                   STA.zpg ("four6_0053");       // save garbage collection step size
/* b551 */                   LDA.zpg ("vartab+0_002d");    // get start of variables low byte
/* b553 */                   LDX.zpg ("vartab+1_002e");    // get start of variables high byte
/* b555 */                   STA.zpg ("index+0_0022");     // save as pointer low byte
/* b557 */                   STX.zpg ("index+1_0023");     // save as pointer high byte
/* b559 */        _`_b559`;  CPX.zpg ("arytab+1_0030");    // compare end of variables high byte,
                                                           // start of arrays high byte
/* b55b */                   BNE.rel ("_b561");            // branch if no high byte match
/* b55d */                   CMP.zpg ("arytab+0_002f");    // else compare end of variables low byte,
                                                           // start of arrays low byte
/* b55f */                   BEQ.rel ("_b566");            // branch if = variable memory end
/* b561 */        _`_b561`;  JSR.abs ("dvars_b5bd");       // check variable salvageability
/* b564 */                   BEQ.rel ("_b559");            // loop always
                                                           // done string variables, now do string arrays
/* b566 */        _`_b566`;  STA.zpg ("tempf1+1_0058");    // save start of arrays low byte as working pointer
/* b568 */                   STX.zpg ("tempf1+2_0059");    // save start of arrays high byte as working pointer
/* b56a */                   LDA.imm (0x03);               // set step size, collecting descriptors
/* b56c */                   STA.zpg ("four6_0053");       // save step size
/* b56e */        _`_b56e`;  LDA.zpg ("tempf1+1_0058");    // get pointer low byte
/* b570 */                   LDX.zpg ("tempf1+2_0059");    // get pointer high byte
/* b572 */        _`_b572`;  CPX.zpg ("strend+1_0032");    // compare with end of arrays high byte
/* b574 */                   BNE.rel ("_b57d");            // branch if not at end
/* b576 */                   CMP.zpg ("strend+0_0031");    // else compare with end of arrays low byte
/* b578 */                   BNE.rel ("_b57d");            // branch if not at end
/* b57a */                   JMP.abs ("grbpas_b606");      // collect string, tidy up and exit if at end ??
/* b57d */        _`_b57d`;  STA.zpg ("index+0_0022");     // save pointer low byte
/* b57f */                   STX.zpg ("index+1_0023");     // save pointer high byte
/* b581 */                   LDY.imm (0x00);               // set index
/* b583 */                   LDA.iny ("index+0_0022");     // get array name first byte
/* b585 */                   TAX.imp ();                   // copy it
/* b586 */                   INY.imp ();                   // increment index
/* b587 */                   LDA.iny ("index+0_0022");     // get array name second byte
/* b589 */                   PHP.imp ();                   // push the flags
/* b58a */                   INY.imp ();                   // increment index
/* b58b */                   LDA.iny ("index+0_0022");     // get array size low byte
/* b58d */                   ADC.zpg ("tempf1+1_0058");    // add start of this array low byte
/* b58f */                   STA.zpg ("tempf1+1_0058");    // save start of next array low byte
/* b591 */                   INY.imp ();                   // increment index
/* b592 */                   LDA.iny ("index+0_0022");     // get array size high byte
/* b594 */                   ADC.zpg ("tempf1+2_0059");    // add start of this array high byte
/* b596 */                   STA.zpg ("tempf1+2_0059");    // save start of next array high byte
/* b598 */                   PLP.imp ();                   // restore the flags
/* b599 */                   BPL.rel ("_b56e");            // skip if not string array
                                                           // was possibly string array so ...
/* b59b */                   TXA.imp ();                   // get name first byte back
/* b59c */                   BMI.rel ("_b56e");            // skip if not string array
/* b59e */                   INY.imp ();                   // increment index
/* b59f */                   LDA.iny ("index+0_0022");     // get # of dimensions
/* b5a1 */                   LDY.imm (0x00);               // clear index
/* b5a3 */                   ASL.acc ();                   // *2
/* b5a4 */                   ADC.imm (0x05);               // +5 (array header size)
/* b5a6 */                   ADC.zpg ("index+0_0022");     // add pointer low byte
/* b5a8 */                   STA.zpg ("index+0_0022");     // save pointer low byte
/* b5aa */                   BCC.rel ("_b5ae");            // branch if no rollover
/* b5ac */                   INC.zpg ("index+1_0023");     // else increment pointer hgih byte
/* b5ae */        _`_b5ae`;  LDX.zpg ("index+1_0023");     // get pointer high byte
/* b5b0 */        _`_b5b0`;  CPX.zpg ("tempf1+2_0059");    // compare pointer high byte with end of this array high byte
/* b5b2 */                   BNE.rel ("_b5b8");            // branch if not there yet
/* b5b4 */                   CMP.zpg ("tempf1+1_0058");    // compare pointer low byte with end of this array low byte
/* b5b6 */                   BEQ.rel ("_b572");            // if at end of this array go check next array
/* b5b8 */        _`_b5b8`;  JSR.abs ("_b5c7");            // check string salvageability
/* b5bb */                   BEQ.rel ("_b5b0");            // loop
                                                           // check variable salvageability
/* b5bd */   _`dvars_b5bd`;  LDA.iny ("index+0_0022");     // get variable name first byte
/* b5bf */                   BMI.rel ("_b5f6");            // add step and exit if not string
/* b5c1 */                   INY.imp ();                   // increment index
/* b5c2 */                   LDA.iny ("index+0_0022");     // get variable name second byte
/* b5c4 */                   BPL.rel ("_b5f6");            // add step and exit if not string
/* b5c6 */                   INY.imp ();                   // increment index
                                                           // check string salvageability
/* b5c7 */        _`_b5c7`;  LDA.iny ("index+0_0022");     // get string length
/* b5c9 */                   BEQ.rel ("_b5f6");            // add step and exit if null string
/* b5cb */                   INY.imp ();                   // increment index
/* b5cc */                   LDA.iny ("index+0_0022");     // get string pointer low byte
/* b5ce */                   TAX.imp ();                   // copy to X
/* b5cf */                   INY.imp ();                   // increment index
/* b5d0 */                   LDA.iny ("index+0_0022");     // get string pointer high byte
/* b5d2 */                   CMP.zpg ("fretop+1_0034");    // compare string pointer high byte with bottom of string
                                                           // space high byte
/* b5d4 */                   BCC.rel ("_b5dc");            // if bottom of string space greater go test against highest
                                                           // uncollected string
/* b5d6 */                   BNE.rel ("_b5f6");            // if bottom of string space less string has been collected
                                                           // so go update pointers, step to next and return
                                                           // high bytes were equal so test low bytes
/* b5d8 */                   CPX.zpg ("fretop+0_0033");    // compare string pointer low byte with bottom of string
                                                           // space low byte
/* b5da */                   BCS.rel ("_b5f6");            // if bottom of string space less string has been collected
                                                           // so go update pointers, step to next and return
                                                           // else test string against highest uncollected string so far
/* b5dc */        _`_b5dc`;  CMP.zpg ("tempf2+4_0060");    // compare string pointer high byte with highest uncollected
                                                           // string high byte
/* b5de */                   BCC.rel ("_b5f6");            // if highest uncollected string is greater then go update
                                                           // pointers, step to next and return
/* b5e0 */                   BNE.rel ("_b5e6");            // if highest uncollected string is less then go set this
                                                           // string as highest uncollected so far
                                                           // high bytes were equal so test low bytes
/* b5e2 */                   CPX.zpg ("tempf2+3_005f");    // compare string pointer low byte with highest uncollected
                                                           // string low byte
/* b5e4 */                   BCC.rel ("_b5f6");            // if highest uncollected string is greater then go update
                                                           // pointers, step to next and return
                                                           // else set current string as highest uncollected string
/* b5e6 */        _`_b5e6`;  STX.zpg ("tempf2+3_005f");    // save string pointer low byte as highest uncollected string
                                                           // low byte
/* b5e8 */                   STA.zpg ("tempf2+4_0060");    // save string pointer high byte as highest uncollected
                                                           // string high byte
/* b5ea */                   LDA.zpg ("index+0_0022");     // get descriptor pointer low byte
/* b5ec */                   LDX.zpg ("index+1_0023");     // get descriptor pointer high byte
/* b5ee */                   STA.zpg ("defpnt+0_004e");    // save working pointer high byte
/* b5f0 */                   STX.zpg ("defpnt+1_004f");    // save working pointer low byte
/* b5f2 */                   LDA.zpg ("four6_0053");       // get step size
/* b5f4 */                   STA.zpg ("jmper+1_0055");     // copy step size
/* b5f6 */        _`_b5f6`;  LDA.zpg ("four6_0053");       // get step size
/* b5f8 */                   CLC.imp ();                   // clear carry for add
/* b5f9 */                   ADC.zpg ("index+0_0022");     // add pointer low byte
/* b5fb */                   STA.zpg ("index+0_0022");     // save pointer low byte
/* b5fd */                   BCC.rel ("_b601");            // branch if no rollover
/* b5ff */                   INC.zpg ("index+1_0023");     // else increment pointer high byte
/* b601 */        _`_b601`;  LDX.zpg ("index+1_0023");     // get pointer high byte
/* b603 */                   LDY.imm (0x00);               // flag not moved
/* b605 */                   RTS.imp ();
                                                           // collect string
/* b606 */  _`grbpas_b606`;  LDA.zpg ("defpnt+1_004f");    // get working pointer low byte
/* b608 */                   ORA.zpg ("defpnt+0_004e");    // OR working pointer high byte
/* b60a */                   BEQ.rel ("_b601");            // exit if nothing to collect
/* b60c */                   LDA.zpg ("jmper+1_0055");     // get copied step size
/* b60e */                   AND.imm (0x04);               // mask step size, $04 for variables, $00 for array or stack
/* b610 */                   LSR.acc ();                   // >> 1
/* b611 */                   TAY.imp ();                   // copy to index
/* b612 */                   STA.zpg ("jmper+1_0055");     // save offset to descriptor start
/* b614 */                   LDA.iny ("defpnt+0_004e");    // get string length low byte
/* b616 */                   ADC.zpg ("tempf2+3_005f");    // add string start low byte
/* b618 */                   STA.zpg ("tempf1+3_005a");    // set block end low byte
/* b61a */                   LDA.zpg ("tempf2+4_0060");    // get string start high byte
/* b61c */                   ADC.imm (0x00);               // add carry
/* b61e */                   STA.zpg ("tempf1+4_005b");    // set block end high byte
/* b620 */                   LDA.zpg ("fretop+0_0033");    // get bottom of string space low byte
/* b622 */                   LDX.zpg ("fretop+1_0034");    // get bottom of string space high byte
/* b624 */                   STA.zpg ("tempf1+1_0058");    // save destination end low byte
/* b626 */                   STX.zpg ("tempf1+2_0059");    // save destination end high byte
/* b628 */                   JSR.abs ("_a3bf");            // open up space in memory, don't set array end. this
                                                           // copies the string from where it is to the end of the
                                                           // uncollected string memory
/* b62b */                   LDY.zpg ("jmper+1_0055");     // restore offset to descriptor start
/* b62d */                   INY.imp ();                   // increment index to string pointer low byte
/* b62e */                   LDA.zpg ("tempf1+1_0058");    // get new string pointer low byte
/* b630 */                   STA.iny ("defpnt+0_004e");    // save new string pointer low byte
/* b632 */                   TAX.imp ();                   // copy string pointer low byte
/* b633 */                   INC.zpg ("tempf1+2_0059");    // increment new string pointer high byte
/* b635 */                   LDA.zpg ("tempf1+2_0059");    // get new string pointer high byte
/* b637 */                   INY.imp ();                   // increment index to string pointer high byte
/* b638 */                   STA.iny ("defpnt+0_004e");    // save new string pointer high byte
/* b63a */                   JMP.abs ("_b52a");            // re-run routine from last ending, XA holds new bottom
                                                           // of string memory pointer

// ------------------------------------------------------- // concatenate
                                                           // add strings, the first string is in the descriptor, the second string is in line
/* b63d */     _`cat_b63d`;  LDA.zpg ("facho+3_0065");     // get descriptor pointer high byte
/* b63f */                   PHA.imp ();                   // put on stack
/* b640 */                   LDA.zpg ("facho+2_0064");     // get descriptor pointer low byte
/* b642 */                   PHA.imp ();                   // put on stack
/* b643 */                   JSR.abs ("eval_ae83");        // get value from line
/* b646 */                   JSR.abs ("_ad8f");            // check if source is string, else do type mismatch
/* b649 */                   PLA.imp ();                   // get descriptor pointer low byte back
/* b64a */                   STA.zpg ("arisgn_006f");      // set pointer low byte
/* b64c */                   PLA.imp ();                   // get descriptor pointer high byte back
/* b64d */                   STA.zpg ("facov_0070");       // set pointer high byte
/* b64f */                   LDY.imm (0x00);               // clear index
/* b651 */                   LDA.iny ("arisgn_006f");      // get length of first string from descriptor
/* b653 */                   CLC.imp ();                   // clear carry for add
/* b654 */                   ADC.iny ("facho+2_0064");     // add length of second string
/* b656 */                   BCC.rel ("_b65d");            // branch if no overflow
/* b658 */                   LDX.imm (0x17);               // else error $17, string too long error
/* b65a */                   JMP.abs ("error_a437");       // do error #X then warm start
/* b65d */        _`_b65d`;  JSR.abs ("_b475");            // copy descriptor pointer and make string space A bytes long
/* b660 */                   JSR.abs ("movins_b67a");      // copy string from descriptor to utility pointer
/* b663 */                   LDA.zpg ("dscpnt+0_0050");    // get descriptor pointer low byte
/* b665 */                   LDY.zpg ("dscpnt+1_0051");    // get descriptor pointer high byte
/* b667 */                   JSR.abs ("_b6aa");            // pop (YA) descriptor off stack or from top of string space
                                                           // returns with A = length, X = pointer low byte,
                                                           // Y = pointer high byte
/* b66a */                   JSR.abs ("_b68c");            // store string from pointer to utility pointer
/* b66d */                   LDA.zpg ("arisgn_006f");      // get descriptor pointer low byte
/* b66f */                   LDY.zpg ("facov_0070");       // get descriptor pointer high byte
/* b671 */                   JSR.abs ("_b6aa");            // pop (YA) descriptor off stack or from top of string space
                                                           // returns with A = length, X = pointer low byte,
                                                           // Y = pointer high byte
/* b674 */                   JSR.abs ("_b4ca");            // check space on descriptor stack then put string address
                                                           // and length on descriptor stack and update stack pointers
/* b677 */                   JMP.abs ("_adb8");            // continue evaluation

// ------------------------------------------------------- // copy string from descriptor to utility pointer
/* b67a */  _`movins_b67a`;  LDY.imm (0x00);               // clear index
/* b67c */                   LDA.iny ("arisgn_006f");      // get string length
/* b67e */                   PHA.imp ();                   // save it
/* b67f */                   INY.imp ();                   // increment index
/* b680 */                   LDA.iny ("arisgn_006f");      // get string pointer low byte
/* b682 */                   TAX.imp ();                   // copy to X
/* b683 */                   INY.imp ();                   // increment index
/* b684 */                   LDA.iny ("arisgn_006f");      // get string pointer high byte
/* b686 */                   TAY.imp ();                   // copy to Y
/* b687 */                   PLA.imp ();                   // get length back
/* b688 */        _`_b688`;  STX.zpg ("index+0_0022");     // save string pointer low byte
/* b68a */                   STY.zpg ("index+1_0023");     // save string pointer high byte
                                                           // store string from pointer to utility pointer
/* b68c */        _`_b68c`;  TAY.imp ();                   // copy length as index
/* b68d */                   BEQ.rel ("_b699");            // branch if null string
/* b68f */                   PHA.imp ();                   // save length
/* b690 */        _`_b690`;  DEY.imp ();                   // decrement length/index
/* b691 */                   LDA.iny ("index+0_0022");     // get byte from string
/* b693 */                   STA.iny ("frespc+0_0035");    // save byte to destination
/* b695 */                   TYA.imp ();                   // copy length/index
/* b696 */                   BNE.rel ("_b690");            // loop if not all done yet
/* b698 */                   PLA.imp ();                   // restore length
/* b699 */        _`_b699`;  CLC.imp ();                   // clear carry for add
/* b69a */                   ADC.zpg ("frespc+0_0035");    // add string utility ptr low byte
/* b69c */                   STA.zpg ("frespc+0_0035");    // save string utility ptr low byte
/* b69e */                   BCC.rel ("_b6a2");            // branch if no rollover
/* b6a0 */                   INC.zpg ("frespc+1_0036");    // increment string utility ptr high byte
/* b6a2 */        _`_b6a2`;  RTS.imp ();

// ------------------------------------------------------- // evaluate string
/* b6a3 */  _`frestr_b6a3`;  JSR.abs ("_ad8f");            // check if source is string, else do type mismatch
                                                           // pop string off descriptor stack, or from top of string space
                                                           // returns with A = length, X = pointer low byte, Y = pointer high byte
/* b6a6 */        _`_b6a6`;  LDA.zpg ("facho+2_0064");     // get descriptor pointer low byte
/* b6a8 */                   LDY.zpg ("facho+3_0065");     // get descriptor pointer high byte
                                                           // pop (YA) descriptor off stack or from top of string space
                                                           // returns with A = length, X = pointer low byte, Y = pointer high byte
/* b6aa */        _`_b6aa`;  STA.zpg ("index+0_0022");     // save string pointer low byte
/* b6ac */                   STY.zpg ("index+1_0023");     // save string pointer high byte
/* b6ae */                   JSR.abs ("frefac_b6db");      // clean descriptor stack, YA = pointer
/* b6b1 */                   PHP.imp ();                   // save status flags
/* b6b2 */                   LDY.imm (0x00);               // clear index
/* b6b4 */                   LDA.iny ("index+0_0022");     // get length from string descriptor
/* b6b6 */                   PHA.imp ();                   // put on stack
/* b6b7 */                   INY.imp ();                   // increment index
/* b6b8 */                   LDA.iny ("index+0_0022");     // get string pointer low byte from descriptor
/* b6ba */                   TAX.imp ();                   // copy to X
/* b6bb */                   INY.imp ();                   // increment index
/* b6bc */                   LDA.iny ("index+0_0022");     // get string pointer high byte from descriptor
/* b6be */                   TAY.imp ();                   // copy to Y
/* b6bf */                   PLA.imp ();                   // get string length back
/* b6c0 */                   PLP.imp ();                   // restore status
/* b6c1 */                   BNE.rel ("_b6d6");            // branch if pointer <> last_sl,last_sh
/* b6c3 */                   CPY.zpg ("fretop+1_0034");    // compare with bottom of string space high byte
/* b6c5 */                   BNE.rel ("_b6d6");            // branch if <>
/* b6c7 */                   CPX.zpg ("fretop+0_0033");    // else compare with bottom of string space low byte
/* b6c9 */                   BNE.rel ("_b6d6");            // branch if <>
/* b6cb */                   PHA.imp ();                   // save string length
/* b6cc */                   CLC.imp ();                   // clear carry for add
/* b6cd */                   ADC.zpg ("fretop+0_0033");    // add bottom of string space low byte
/* b6cf */                   STA.zpg ("fretop+0_0033");    // set bottom of string space low byte
/* b6d1 */                   BCC.rel ("_b6d5");            // skip increment if no overflow
/* b6d3 */                   INC.zpg ("fretop+1_0034");    // increment bottom of string space high byte
/* b6d5 */        _`_b6d5`;  PLA.imp ();                   // restore string length
/* b6d6 */        _`_b6d6`;  STX.zpg ("index+0_0022");     // save string pointer low byte
/* b6d8 */                   STY.zpg ("index+1_0023");     // save string pointer high byte
/* b6da */                   RTS.imp ();
                                                           // clean descriptor stack, YA = pointer
                                                           // checks if AY is on the descriptor stack, if so does a stack discard
/* b6db */  _`frefac_b6db`;  CPY.zpg ("lastpt+1_0018");    // compare high byte with current descriptor stack item
                                                           // pointer high byte
/* b6dd */                   BNE.rel ("_b6eb");            // exit if <>
/* b6df */                   CMP.zpg ("lastpt+0_0017");    // compare low byte with current descriptor stack item
                                                           // pointer low byte
/* b6e1 */                   BNE.rel ("_b6eb");            // exit if <>
/* b6e3 */                   STA.zpg ("temppt_0016");      // set descriptor stack pointer
/* b6e5 */                   SBC.imm (0x03);               // update last string pointer low byte
/* b6e7 */                   STA.zpg ("lastpt+0_0017");    // save current descriptor stack item pointer low byte
/* b6e9 */                   LDY.imm (0x00);               // clear high byte
/* b6eb */        _`_b6eb`;  RTS.imp ();

// ------------------------------------------------------- // perform CHR$()
/* b6ec */    _`chrd_b6ec`;  JSR.abs ("_b7a1");            // evaluate byte expression, result in X
/* b6ef */                   TXA.imp ();                   // copy to A
/* b6f0 */                   PHA.imp ();                   // save character
/* b6f1 */                   LDA.imm (0x01);               // string is single byte
/* b6f3 */                   JSR.abs ("_b47d");            // make string space A bytes long
/* b6f6 */                   PLA.imp ();                   // get character back
/* b6f7 */                   LDY.imm (0x00);               // clear index
/* b6f9 */                   STA.iny ("facho+0_0062");     // save byte in string - byte IS string!
/* b6fb */                   PLA.imp ();                   // dump return address (skip type check)
/* b6fc */                   PLA.imp ();                   // dump return address (skip type check)
/* b6fd */                   JMP.abs ("_b4ca");            // check space on descriptor stack then put string address
                                                           // and length on descriptor stack and update stack pointers

// ------------------------------------------------------- // perform LEFT$()
/* b700 */   _`leftd_b700`;  JSR.abs ("pream_b761");       // pull string data and byte parameter from stack
                                                           // return pointer in descriptor, byte in A (and X), Y=0
/* b703 */                   CMP.iny ("dscpnt+0_0050");    // compare byte parameter with string length
/* b705 */                   TYA.imp ();                   // clear A
/* b706 */        _`_b706`;  BCC.rel ("_b70c");            // branch if string length > byte parameter
/* b708 */                   LDA.iny ("dscpnt+0_0050");    // else make parameter = length
/* b70a */                   TAX.imp ();                   // copy to byte parameter copy
/* b70b */                   TYA.imp ();                   // clear string start offset
/* b70c */        _`_b70c`;  PHA.imp ();                   // save string start offset
/* b70d */        _`_b70d`;  TXA.imp ();                   // copy byte parameter (or string length if <)
/* b70e */        _`_b70e`;  PHA.imp ();                   // save string length
/* b70f */                   JSR.abs ("_b47d");            // make string space A bytes long
/* b712 */                   LDA.zpg ("dscpnt+0_0050");    // get descriptor pointer low byte
/* b714 */                   LDY.zpg ("dscpnt+1_0051");    // get descriptor pointer high byte
/* b716 */                   JSR.abs ("_b6aa");            // pop (YA) descriptor off stack or from top of string space
                                                           // returns with A = length, X = pointer low byte,
                                                           // Y = pointer high byte
/* b719 */                   PLA.imp ();                   // get string length back
/* b71a */                   TAY.imp ();                   // copy length to Y
/* b71b */                   PLA.imp ();                   // get string start offset back
/* b71c */                   CLC.imp ();                   // clear carry for add
/* b71d */                   ADC.zpg ("index+0_0022");     // add start offset to string start pointer low byte
/* b71f */                   STA.zpg ("index+0_0022");     // save string start pointer low byte
/* b721 */                   BCC.rel ("_b725");            // branch if no overflow
/* b723 */                   INC.zpg ("index+1_0023");     // else increment string start pointer high byte
/* b725 */        _`_b725`;  TYA.imp ();                   // copy length to A
/* b726 */                   JSR.abs ("_b68c");            // store string from pointer to utility pointer
/* b729 */                   JMP.abs ("_b4ca");            // check space on descriptor stack then put string address
                                                           // and length on descriptor stack and update stack pointers

// ------------------------------------------------------- // perform RIGHT$()
/* b72c */  _`rightd_b72c`;  JSR.abs ("pream_b761");       // pull string data and byte parameter from stack
                                                           // return pointer in descriptor, byte in A (and X), Y=0
/* b72f */                   CLC.imp ();                   // clear carry for add-1
/* b730 */                   SBC.iny ("dscpnt+0_0050");    // subtract string length
/* b732 */                   EOR.imm (0xff);               // invert it (A=LEN(expression$)-l)
/* b734 */                   JMP.abs ("_b706");            // go do rest of LEFT$()

// ------------------------------------------------------- // perform MID$()
/* b737 */    _`midd_b737`;  LDA.imm (0xff);               // set default length = 255
/* b739 */                   STA.zpg ("facho+3_0065");     // save default length
/* b73b */                   JSR.abs ("chrgot_0079");      // scan memory
/* b73e */                   CMP.imm (0x29);               // compare with ")"
/* b740 */                   BEQ.rel ("_b748");            // branch if = ")" (skip second byte get)
/* b742 */                   JSR.abs ("_aefd");            // scan for ",", else do syntax error then warm start
/* b745 */                   JSR.abs ("_b79e");            // get byte parameter
/* b748 */        _`_b748`;  JSR.abs ("pream_b761");       // pull string data and byte parameter from stack
                                                           // return pointer in descriptor, byte in A (and X), Y=0
/* b74b */                   BEQ.rel ("_b798");            // if null do illegal quantity error then warm start
/* b74d */                   DEX.imp ();                   // decrement start index
/* b74e */                   TXA.imp ();                   // copy to A
/* b74f */                   PHA.imp ();                   // save string start offset
/* b750 */                   CLC.imp ();                   // clear carry for sub-1
/* b751 */                   LDX.imm (0x00);               // clear output string length
/* b753 */                   SBC.iny ("dscpnt+0_0050");    // subtract string length
/* b755 */                   BCS.rel ("_b70d");            // if start>string length go do null string
/* b757 */                   EOR.imm (0xff);               // complement -length
/* b759 */                   CMP.zpg ("facho+3_0065");     // compare byte parameter
/* b75b */                   BCC.rel ("_b70e");            // if length>remaining string go do RIGHT$
/* b75d */                   LDA.zpg ("facho+3_0065");     // get length byte
/* b75f */                   BCS.rel ("_b70e");            // go do string copy, branch always

// ------------------------------------------------------- // pull string data and byte parameter from stack
                                                           // return pointer in descriptor, byte in A (and X), Y=0
/* b761 */   _`pream_b761`;  JSR.abs ("chkcls_aef7");      // scan for ")", else do syntax error then warm start
/* b764 */                   PLA.imp ();                   // pull return address low byte
/* b765 */                   TAY.imp ();                   // save return address low byte
/* b766 */                   PLA.imp ();                   // pull return address high byte
/* b767 */                   STA.zpg ("jmper+1_0055");     // save return address high byte
/* b769 */                   PLA.imp ();                   // dump call to function vector low byte
/* b76a */                   PLA.imp ();                   // dump call to function vector high byte
/* b76b */                   PLA.imp ();                   // pull byte parameter
/* b76c */                   TAX.imp ();                   // copy byte parameter to X
/* b76d */                   PLA.imp ();                   // pull string pointer low byte
/* b76e */                   STA.zpg ("dscpnt+0_0050");    // save it
/* b770 */                   PLA.imp ();                   // pull string pointer high byte
/* b771 */                   STA.zpg ("dscpnt+1_0051");    // save it
/* b773 */                   LDA.zpg ("jmper+1_0055");     // get return address high byte
/* b775 */                   PHA.imp ();                   // back on stack
/* b776 */                   TYA.imp ();                   // get return address low byte
/* b777 */                   PHA.imp ();                   // back on stack
/* b778 */                   LDY.imm (0x00);               // clear index
/* b77a */                   TXA.imp ();                   // copy byte parameter
/* b77b */                   RTS.imp ();

// ------------------------------------------------------- // perform LEN()
/* b77c */     _`len_b77c`;  JSR.abs ("len1_b782");        // evaluate string, get length in A (and Y)
/* b77f */                   JMP.abs ("_b3a2");            // convert Y to byte in FAC1 and return

// ------------------------------------------------------- // evaluate string, get length in Y
/* b782 */    _`len1_b782`;  JSR.abs ("frestr_b6a3");      // evaluate string
/* b785 */                   LDX.imm (0x00);               // set data type = numeric
/* b787 */                   STX.zpg ("valtyp_000d");      // clear data type flag, $FF = string, $00 = numeric
/* b789 */                   TAY.imp ();                   // copy length to Y
/* b78a */                   RTS.imp ();

// ------------------------------------------------------- // perform ASC()
/* b78b */     _`asc_b78b`;  JSR.abs ("len1_b782");        // evaluate string, get length in A (and Y)
/* b78e */                   BEQ.rel ("_b798");            // if null do illegal quantity error then warm start
/* b790 */                   LDY.imm (0x00);               // set index to first character
/* b792 */                   LDA.iny ("index+0_0022");     // get byte
/* b794 */                   TAY.imp ();                   // copy to Y
/* b795 */                   JMP.abs ("_b3a2");            // convert Y to byte in FAC1 and return

// ------------------------------------------------------- // do illegal quantity error then warm start
/* b798 */        _`_b798`;  JMP.abs ("fcerr_b248");       // do illegal quantity error then warm start

// ------------------------------------------------------- // scan and get byte parameter
/* b79b */  _`gtbytc_b79b`;  JSR.abs ("chrget+0_0073");    // increment and scan memory

// ------------------------------------------------------- // get byte parameter
/* b79e */        _`_b79e`;  JSR.abs ("frmnum_ad8a");      // evaluate expression and check is numeric, else do
                                                           // type mismatch

// ------------------------------------------------------- // evaluate byte expression, result in X
/* b7a1 */        _`_b7a1`;  JSR.abs ("_b1b8");            // evaluate integer expression, sign check
/* b7a4 */                   LDX.zpg ("facho+2_0064");     // get FAC1 mantissa 3
/* b7a6 */                   BNE.rel ("_b798");            // if not null do illegal quantity error then warm start
/* b7a8 */                   LDX.zpg ("facho+3_0065");     // get FAC1 mantissa 4
/* b7aa */                   JMP.abs ("chrgot_0079");      // scan memory and return

// ------------------------------------------------------- // perform VAL()
/* b7ad */     _`val_b7ad`;  JSR.abs ("len1_b782");        // evaluate string, get length in A (and Y)
/* b7b0 */                   BNE.rel ("strval_b7b5");      // branch if not null string
                                                           // string was null so set result = $00
/* b7b2 */                   JMP.abs ("_b8f7");            // clear FAC1 exponent and sign and return
/* b7b5 */  _`strval_b7b5`;  LDX.zpg ("txtptr+0_007a");    // get BASIC execute pointer low byte
/* b7b7 */                   LDY.zpg ("txtptr+1_007b");    // get BASIC execute pointer high byte
/* b7b9 */                   STX.zpg ("fbufpt+0_0071");    // save BASIC execute pointer low byte
/* b7bb */                   STY.zpg ("fbufpt+1_0072");    // save BASIC execute pointer high byte
/* b7bd */                   LDX.zpg ("index+0_0022");     // get string pointer low byte
/* b7bf */                   STX.zpg ("txtptr+0_007a");    // save BASIC execute pointer low byte
/* b7c1 */                   CLC.imp ();                   // clear carry for add
/* b7c2 */                   ADC.zpg ("index+0_0022");     // add string length
/* b7c4 */                   STA.zpg ("index+2_0024");     // save string end low byte
/* b7c6 */                   LDX.zpg ("index+1_0023");     // get string pointer high byte
/* b7c8 */                   STX.zpg ("txtptr+1_007b");    // save BASIC execute pointer high byte
/* b7ca */                   BCC.rel ("_b7cd");            // branch if no high byte increment
/* b7cc */                   INX.imp ();                   // increment string end high byte
/* b7cd */        _`_b7cd`;  STX.zpg ("index+3_0025");     // save string end high byte
/* b7cf */                   LDY.imm (0x00);               // set index to $00
/* b7d1 */                   LDA.iny ("index+2_0024");     // get string end byte
/* b7d3 */                   PHA.imp ();                   // push it
/* b7d4 */                   TYA.imp ();                   // clear A
/* b7d5 */                   STA.iny ("index+2_0024");     // terminate string with $00
/* b7d7 */                   JSR.abs ("chrgot_0079");      // scan memory
/* b7da */                   JSR.abs ("fin_bcf3");         // get FAC1 from string
/* b7dd */                   PLA.imp ();                   // restore string end byte
/* b7de */                   LDY.imm (0x00);               // clear index
/* b7e0 */                   STA.iny ("index+2_0024");     // put string end byte back

// ------------------------------------------------------- // restore BASIC execute pointer from temp
/* b7e2 */        _`_b7e2`;  LDX.zpg ("fbufpt+0_0071");    // get BASIC execute pointer low byte back
/* b7e4 */                   LDY.zpg ("fbufpt+1_0072");    // get BASIC execute pointer high byte back
/* b7e6 */                   STX.zpg ("txtptr+0_007a");    // save BASIC execute pointer low byte
/* b7e8 */                   STY.zpg ("txtptr+1_007b");    // save BASIC execute pointer high byte
/* b7ea */                   RTS.imp ();

// ------------------------------------------------------- // get parameters for POKE/WAIT
/* b7eb */  _`getnum_b7eb`;  JSR.abs ("frmnum_ad8a");      // evaluate expression and check is numeric, else do
                                                           // type mismatch
/* b7ee */                   JSR.abs ("getadr_b7f7");      // convert FAC_1 to integer in temporary integer
/* b7f1 */        _`_b7f1`;  JSR.abs ("_aefd");            // scan for ",", else do syntax error then warm start
/* b7f4 */                   JMP.abs ("_b79e");            // get byte parameter and return

// ------------------------------------------------------- // convert FAC_1 to integer in temporary integer
/* b7f7 */  _`getadr_b7f7`;  LDA.zpg ("facsgn_0066");      // get FAC1 sign
/* b7f9 */                   BMI.rel ("_b798");            // if -ve do illegal quantity error then warm start
/* b7fb */                   LDA.zpg ("facexp_0061");      // get FAC1 exponent
/* b7fd */                   CMP.imm (0x91);               // compare with exponent = 2^16
/* b7ff */                   BCS.rel ("_b798");            // if >= do illegal quantity error then warm start
/* b801 */                   JSR.abs ("qint_bc9b");        // convert FAC1 floating to fixed
/* b804 */                   LDA.zpg ("facho+2_0064");     // get FAC1 mantissa 3
/* b806 */                   LDY.zpg ("facho+3_0065");     // get FAC1 mantissa 4
/* b808 */                   STY.zpg ("linnum+0_0014");    // save temporary integer low byte
/* b80a */                   STA.zpg ("linnum+1_0015");    // save temporary integer high byte
/* b80c */                   RTS.imp ();

// ------------------------------------------------------- // perform PEEK()
/* b80d */    _`peek_b80d`;  LDA.zpg ("linnum+1_0015");    // get line number high byte
/* b80f */                   PHA.imp ();                   // save line number high byte
/* b810 */                   LDA.zpg ("linnum+0_0014");    // get line number low byte
/* b812 */                   PHA.imp ();                   // save line number low byte
/* b813 */                   JSR.abs ("getadr_b7f7");      // convert FAC_1 to integer in temporary integer
/* b816 */                   LDY.imm (0x00);               // clear index
/* b818 */                   LDA.iny ("linnum+0_0014");    // read byte
/* b81a */                   TAY.imp ();                   // copy byte to A
/* b81b */                   PLA.imp ();                   // pull byte
/* b81c */                   STA.zpg ("linnum+0_0014");    // restore line number low byte
/* b81e */                   PLA.imp ();                   // pull byte
/* b81f */                   STA.zpg ("linnum+1_0015");    // restore line number high byte
/* b821 */                   JMP.abs ("_b3a2");            // convert Y to byte in FAC_1 and return

// ------------------------------------------------------- // perform POKE
/* b824 */    _`poke_b824`;  JSR.abs ("getnum_b7eb");      // get parameters for POKE/WAIT
/* b827 */                   TXA.imp ();                   // copy byte to A
/* b828 */                   LDY.imm (0x00);               // clear index
/* b82a */                   STA.iny ("linnum+0_0014");    // write byte
/* b82c */                   RTS.imp ();

// ------------------------------------------------------- // perform WAIT
/* b82d */    _`wait_b82d`;  JSR.abs ("getnum_b7eb");      // get parameters for POKE/WAIT
/* b830 */                   STX.zpg ("forpnt+0_0049");    // save byte
/* b832 */                   LDX.imm (0x00);               // clear mask
/* b834 */                   JSR.abs ("chrgot_0079");      // scan memory
/* b837 */                   BEQ.rel ("_b83c");            // skip if no third argument
/* b839 */                   JSR.abs ("_b7f1");            // scan for "," and get byte, else syntax error then
                                                           // warm start
/* b83c */        _`_b83c`;  STX.zpg ("forpnt+1_004a");    // save EOR argument
/* b83e */                   LDY.imm (0x00);               // clear index
/* b840 */        _`_b840`;  LDA.iny ("linnum+0_0014");    // get byte via temporary integer (address)
/* b842 */                   EOR.zpg ("forpnt+1_004a");    // EOR with second argument       (mask)
/* b844 */                   AND.zpg ("forpnt+0_0049");    // AND with first argument        (byte)
/* b846 */                   BEQ.rel ("_b840");            // loop if result is zero
/* b848 */        _`_b848`;  RTS.imp ();

// ------------------------------------------------------- // add 0.5 to FAC1 (round FAC1)
/* b849 */   _`faddh_b849`;  LDA.imm (0x11);               // set 0.5 pointer low byte
/* b84b */                   LDY.imm (0xbf);               // set 0.5 pointer high byte
/* b84d */                   JMP.abs ("fadd_b867");        // add (AY) to FAC1

// ------------------------------------------------------- // perform subtraction, FAC1 from (AY)
/* b850 */    _`fsub_b850`;  JSR.abs ("conupk_ba8c");      // unpack memory (AY) into FAC2

// ------------------------------------------------------- // perform subtraction, FAC1 from FAC2
/* b853 */   _`fsubt_b853`;  LDA.zpg ("facsgn_0066");      // get FAC1 sign (b7)
/* b855 */                   EOR.imm (0xff);               // complement it
/* b857 */                   STA.zpg ("facsgn_0066");      // save FAC1 sign (b7)
/* b859 */                   EOR.zpg ("argsgn_006e");      // EOR with FAC2 sign (b7)
/* b85b */                   STA.zpg ("arisgn_006f");      // save sign compare (FAC1 EOR FAC2)
/* b85d */                   LDA.zpg ("facexp_0061");      // get FAC1 exponent
/* b85f */                   JMP.abs ("faddt_b86a");       // add FAC2 to FAC1 and return
/* b862 */   _`fadd5_b862`;  JSR.abs ("_b999");            // shift FACX A times right (>8 shifts)
/* b865 */                   BCC.rel ("_b8a3");            // go subtract mantissas

// ------------------------------------------------------- // add (AY) to FAC1
/* b867 */    _`fadd_b867`;  JSR.abs ("conupk_ba8c");      // unpack memory (AY) into FAC2

// ------------------------------------------------------- // add FAC2 to FAC1
/* b86a */   _`faddt_b86a`;  BNE.rel ("_b86f");            // branch if FAC1 is not zero
/* b86c */                   JMP.abs ("movfa_bbfc");       // FAC1 was zero so copy FAC2 to FAC1 and return
                                                           // FAC1 is non zero
/* b86f */        _`_b86f`;  LDX.zpg ("facov_0070");       // get FAC1 rounding byte
/* b871 */                   STX.zpg ("jmper+2_0056");     // save as FAC2 rounding byte
/* b873 */                   LDX.imm (0x69);               // set index to FAC2 exponent address
/* b875 */                   LDA.zpg ("argexp_0069");      // get FAC2 exponent
/* b877 */        _`_b877`;  TAY.imp ();                   // copy exponent
/* b878 */                   BEQ.rel ("_b848");            // exit if zero
/* b87a */                   SEC.imp ();                   // set carry for subtract
/* b87b */                   SBC.zpg ("facexp_0061");      // subtract FAC1 exponent
/* b87d */                   BEQ.rel ("_b8a3");            // if equal go add mantissas
/* b87f */                   BCC.rel ("_b893");            // if FAC2 < FAC1 then go shift FAC2 right
                                                           // else FAC2 > FAC1
/* b881 */                   STY.zpg ("facexp_0061");      // save FAC1 exponent
/* b883 */                   LDY.zpg ("argsgn_006e");      // get FAC2 sign (b7)
/* b885 */                   STY.zpg ("facsgn_0066");      // save FAC1 sign (b7)
/* b887 */                   EOR.imm (0xff);               // complement A
/* b889 */                   ADC.imm (0x00);               // +1, twos complement, carry is set
/* b88b */                   LDY.imm (0x00);               // clear Y
/* b88d */                   STY.zpg ("jmper+2_0056");     // clear FAC2 rounding byte
/* b88f */                   LDX.imm (0x61);               // set index to FAC1 exponent address
/* b891 */                   BNE.rel ("_b897");            // branch always
                                                           // FAC2 < FAC1
/* b893 */        _`_b893`;  LDY.imm (0x00);               // clear Y
/* b895 */                   STY.zpg ("facov_0070");       // clear FAC1 rounding byte
/* b897 */        _`_b897`;  CMP.imm (0xf9);               // compare exponent diff with $F9
/* b899 */                   BMI.rel ("fadd5_b862");       // branch if range $79-$F8
/* b89b */                   TAY.imp ();                   // copy exponent difference to Y
/* b89c */                   LDA.zpg ("facov_0070");       // get FAC1 rounding byte
/* b89e */                   LSR.zpx (0x01);               // shift FAC? mantissa 1
/* b8a0 */                   JSR.abs ("_b9b0");            // shift FACX Y times right
                                                           // exponents are equal now do mantissa subtract
/* b8a3 */        _`_b8a3`;  BIT.zpg ("arisgn_006f");      // test sign compare (FAC1 EOR FAC2)
/* b8a5 */                   BPL.rel ("normal_b8fe");      // if = add FAC2 mantissa to FAC1 mantissa and return
/* b8a7 */   _`fadd4_b8a7`;  LDY.imm (0x61);               // set the Y index to FAC1 exponent address
/* b8a9 */                   CPX.imm (0x69);               // compare X to FAC2 exponent address
/* b8ab */                   BEQ.rel ("_b8af");            // if = continue, Y = FAC1, X = FAC2
/* b8ad */                   LDY.imm (0x69);               // else set the Y index to FAC2 exponent address
                                                           // subtract the smaller from the bigger (take the sign of
                                                           // the bigger)
/* b8af */        _`_b8af`;  SEC.imp ();                   // set carry for subtract
/* b8b0 */                   EOR.imm (0xff);               // ones complement A
/* b8b2 */                   ADC.zpg ("jmper+2_0056");     // add FAC2 rounding byte
/* b8b4 */                   STA.zpg ("facov_0070");       // save FAC1 rounding byte
/* b8b6 */                   LDA.aby ("adray1+1_0004");    // get FACY mantissa 4
/* b8b9 */                   SBC.zpx (0x04);               // subtract FACX mantissa 4
/* b8bb */                   STA.zpg ("facho+3_0065");     // save FAC1 mantissa 4
/* b8bd */                   LDA.aby ("adray1+0_0003");    // get FACY mantissa 3
/* b8c0 */                   SBC.zpx (0x03);               // subtract FACX mantissa 3
/* b8c2 */                   STA.zpg ("facho+2_0064");     // save FAC1 mantissa 3
/* b8c4 */                   LDA.aby ("_0002");            // get FACY mantissa 2
/* b8c7 */                   SBC.zpx (0x02);               // subtract FACX mantissa 2
/* b8c9 */                   STA.zpg ("facho+1_0063");     // save FAC1 mantissa 2
/* b8cb */                   LDA.aby ("r6510_0001");       // get FACY mantissa 1
/* b8ce */                   SBC.zpx (0x01);               // subtract FACX mantissa 1
/* b8d0 */                   STA.zpg ("facho+0_0062");     // save FAC1 mantissa 1

// ------------------------------------------------------- // do ABS and normalise FAC1
/* b8d2 */        _`_b8d2`;  BCS.rel ("_b8d7");            // branch if number is +ve
/* b8d4 */                   JSR.abs ("negfac_b947");      // negate FAC1

// ------------------------------------------------------- // normalise FAC1
/* b8d7 */        _`_b8d7`;  LDY.imm (0x00);               // clear Y
/* b8d9 */                   TYA.imp ();                   // clear A
/* b8da */                   CLC.imp ();                   // clear carry for add
/* b8db */        _`_b8db`;  LDX.zpg ("facho+0_0062");     // get FAC1 mantissa 1
/* b8dd */                   BNE.rel ("_b929");            // if not zero normalise FAC1
/* b8df */                   LDX.zpg ("facho+1_0063");     // get FAC1 mantissa 2
/* b8e1 */                   STX.zpg ("facho+0_0062");     // save FAC1 mantissa 1
/* b8e3 */                   LDX.zpg ("facho+2_0064");     // get FAC1 mantissa 3
/* b8e5 */                   STX.zpg ("facho+1_0063");     // save FAC1 mantissa 2
/* b8e7 */                   LDX.zpg ("facho+3_0065");     // get FAC1 mantissa 4
/* b8e9 */                   STX.zpg ("facho+2_0064");     // save FAC1 mantissa 3
/* b8eb */                   LDX.zpg ("facov_0070");       // get FAC1 rounding byte
/* b8ed */                   STX.zpg ("facho+3_0065");     // save FAC1 mantissa 4
/* b8ef */                   STY.zpg ("facov_0070");       // clear FAC1 rounding byte
/* b8f1 */                   ADC.imm (0x08);               // add x to exponent offset
/* b8f3 */                   CMP.imm (0x20);               // compare with $20, max offset, all bits would be = 0
/* b8f5 */                   BNE.rel ("_b8db");            // loop if not max

// ------------------------------------------------------- // clear FAC1 exponent and sign
/* b8f7 */        _`_b8f7`;  LDA.imm (0x00);               // clear A
/* b8f9 */        _`_b8f9`;  STA.zpg ("facexp_0061");      // set FAC1 exponent

// ------------------------------------------------------- // save FAC1 sign
/* b8fb */        _`_b8fb`;  STA.zpg ("facsgn_0066");      // save FAC1 sign (b7)
/* b8fd */                   RTS.imp ();

// ------------------------------------------------------- // add FAC2 mantissa to FAC1 mantissa
/* b8fe */  _`normal_b8fe`;  ADC.zpg ("jmper+2_0056");     // add FAC2 rounding byte
/* b900 */                   STA.zpg ("facov_0070");       // save FAC1 rounding byte
/* b902 */                   LDA.zpg ("facho+3_0065");     // get FAC1 mantissa 4
/* b904 */                   ADC.zpg ("argho+3_006d");     // add FAC2 mantissa 4
/* b906 */                   STA.zpg ("facho+3_0065");     // save FAC1 mantissa 4
/* b908 */                   LDA.zpg ("facho+2_0064");     // get FAC1 mantissa 3
/* b90a */                   ADC.zpg ("argho+2_006c");     // add FAC2 mantissa 3
/* b90c */                   STA.zpg ("facho+2_0064");     // save FAC1 mantissa 3
/* b90e */                   LDA.zpg ("facho+1_0063");     // get FAC1 mantissa 2
/* b910 */                   ADC.zpg ("argho+1_006b");     // add FAC2 mantissa 2
/* b912 */                   STA.zpg ("facho+1_0063");     // save FAC1 mantissa 2
/* b914 */                   LDA.zpg ("facho+0_0062");     // get FAC1 mantissa 1
/* b916 */                   ADC.zpg ("argho+0_006a");     // add FAC2 mantissa 1
/* b918 */                   STA.zpg ("facho+0_0062");     // save FAC1 mantissa 1
/* b91a */                   JMP.abs ("_b936");            // test and normalise FAC1 for C=0/1
/* b91d */        _`_b91d`;  ADC.imm (0x01);               // add 1 to exponent offset
/* b91f */                   ASL.zpg ("facov_0070");       // shift FAC1 rounding byte
/* b921 */                   ROL.zpg ("facho+3_0065");     // shift FAC1 mantissa 4
/* b923 */                   ROL.zpg ("facho+2_0064");     // shift FAC1 mantissa 3
/* b925 */                   ROL.zpg ("facho+1_0063");     // shift FAC1 mantissa 2
/* b927 */                   ROL.zpg ("facho+0_0062");     // shift FAC1 mantissa 1
                                                           // normalise FAC1
/* b929 */        _`_b929`;  BPL.rel ("_b91d");            // loop if not normalised
/* b92b */                   SEC.imp ();                   // set carry for subtract
/* b92c */                   SBC.zpg ("facexp_0061");      // subtract FAC1 exponent
/* b92e */                   BCS.rel ("_b8f7");            // branch if underflow (set result = $0)
/* b930 */                   EOR.imm (0xff);               // complement exponent
/* b932 */                   ADC.imm (0x01);               // +1 (twos complement)
/* b934 */                   STA.zpg ("facexp_0061");      // save FAC1 exponent
                                                           // test and normalise FAC1 for C=0/1
/* b936 */        _`_b936`;  BCC.rel ("_b946");            // exit if no overflow
                                                           // normalise FAC1 for C=1
/* b938 */        _`_b938`;  INC.zpg ("facexp_0061");      // increment FAC1 exponent
/* b93a */                   BEQ.rel ("overr_b97e");       // if zero do overflow error then warm start
/* b93c */                   ROR.zpg ("facho+0_0062");     // shift FAC1 mantissa 1
/* b93e */                   ROR.zpg ("facho+1_0063");     // shift FAC1 mantissa 2
/* b940 */                   ROR.zpg ("facho+2_0064");     // shift FAC1 mantissa 3
/* b942 */                   ROR.zpg ("facho+3_0065");     // shift FAC1 mantissa 4
/* b944 */                   ROR.zpg ("facov_0070");       // shift FAC1 rounding byte
/* b946 */        _`_b946`;  RTS.imp ();

// ------------------------------------------------------- // negate FAC1
/* b947 */  _`negfac_b947`;  LDA.zpg ("facsgn_0066");      // get FAC1 sign (b7)
/* b949 */                   EOR.imm (0xff);               // complement it
/* b94b */                   STA.zpg ("facsgn_0066");      // save FAC1 sign (b7)
                                                           // twos complement FAC1 mantissa
/* b94d */        _`_b94d`;  LDA.zpg ("facho+0_0062");     // get FAC1 mantissa 1
/* b94f */                   EOR.imm (0xff);               // complement it
/* b951 */                   STA.zpg ("facho+0_0062");     // save FAC1 mantissa 1
/* b953 */                   LDA.zpg ("facho+1_0063");     // get FAC1 mantissa 2
/* b955 */                   EOR.imm (0xff);               // complement it
/* b957 */                   STA.zpg ("facho+1_0063");     // save FAC1 mantissa 2
/* b959 */                   LDA.zpg ("facho+2_0064");     // get FAC1 mantissa 3
/* b95b */                   EOR.imm (0xff);               // complement it
/* b95d */                   STA.zpg ("facho+2_0064");     // save FAC1 mantissa 3
/* b95f */                   LDA.zpg ("facho+3_0065");     // get FAC1 mantissa 4
/* b961 */                   EOR.imm (0xff);               // complement it
/* b963 */                   STA.zpg ("facho+3_0065");     // save FAC1 mantissa 4
/* b965 */                   LDA.zpg ("facov_0070");       // get FAC1 rounding byte
/* b967 */                   EOR.imm (0xff);               // complement it
/* b969 */                   STA.zpg ("facov_0070");       // save FAC1 rounding byte
/* b96b */                   INC.zpg ("facov_0070");       // increment FAC1 rounding byte
/* b96d */                   BNE.rel ("_b97d");            // exit if no overflow
                                                           // increment FAC1 mantissa
/* b96f */        _`_b96f`;  INC.zpg ("facho+3_0065");     // increment FAC1 mantissa 4
/* b971 */                   BNE.rel ("_b97d");            // finished if no rollover
/* b973 */                   INC.zpg ("facho+2_0064");     // increment FAC1 mantissa 3
/* b975 */                   BNE.rel ("_b97d");            // finished if no rollover
/* b977 */                   INC.zpg ("facho+1_0063");     // increment FAC1 mantissa 2
/* b979 */                   BNE.rel ("_b97d");            // finished if no rollover
/* b97b */                   INC.zpg ("facho+0_0062");     // increment FAC1 mantissa 1
/* b97d */        _`_b97d`;  RTS.imp ();

// ------------------------------------------------------- // do overflow error then warm start
/* b97e */   _`overr_b97e`;  LDX.imm (0x0f);               // error $0F, overflow error
/* b980 */                   JMP.abs ("error_a437");       // do error #X then warm start

// ------------------------------------------------------- // shift FCAtemp << A+8 times
/* b983 */  _`mulshf_b983`;  LDX.imm (0x25);               // set the offset to FACtemp
/* b985 */        _`_b985`;  LDY.zpx (0x04);               // get FACX mantissa 4
/* b987 */                   STY.zpg ("facov_0070");       // save as FAC1 rounding byte
/* b989 */                   LDY.zpx (0x03);               // get FACX mantissa 3
/* b98b */                   STY.zpx (0x04);               // save FACX mantissa 4
/* b98d */                   LDY.zpx (0x02);               // get FACX mantissa 2
/* b98f */                   STY.zpx (0x03);               // save FACX mantissa 3
/* b991 */                   LDY.zpx (0x01);               // get FACX mantissa 1
/* b993 */                   STY.zpx (0x02);               // save FACX mantissa 2
/* b995 */                   LDY.zpg ("bits_0068");        // get FAC1 overflow byte
/* b997 */                   STY.zpx (0x01);               // save FACX mantissa 1
                                                           // shift FACX -A times right (> 8 shifts)
/* b999 */        _`_b999`;  ADC.imm (0x08);               // add 8 to shift count
/* b99b */                   BMI.rel ("_b985");            // go do 8 shift if still -ve
/* b99d */                   BEQ.rel ("_b985");            // go do 8 shift if zero
/* b99f */                   SBC.imm (0x08);               // else subtract 8 again
/* b9a1 */                   TAY.imp ();                   // save count to Y
/* b9a2 */                   LDA.zpg ("facov_0070");       // get FAC1 rounding byte
/* b9a4 */                   BCS.rel ("_b9ba");
/* b9a6 */        _`_b9a6`;  ASL.zpx (0x01);               // shift FACX mantissa 1
/* b9a8 */                   BCC.rel ("_b9ac");            // branch if +ve
/* b9aa */                   INC.zpx (0x01);               // this sets b7 eventually
/* b9ac */        _`_b9ac`;  ROR.zpx (0x01);               // shift FACX mantissa 1 (correct for ASL)
/* b9ae */                   ROR.zpx (0x01);               // shift FACX mantissa 1 (put carry in b7)
                                                           // shift FACX Y times right
/* b9b0 */        _`_b9b0`;  ROR.zpx (0x02);               // shift FACX mantissa 2
/* b9b2 */                   ROR.zpx (0x03);               // shift FACX mantissa 3
/* b9b4 */                   ROR.zpx (0x04);               // shift FACX mantissa 4
/* b9b6 */                   ROR.acc ();                   // shift FACX rounding byte
/* b9b7 */                   INY.imp ();                   // increment exponent diff
/* b9b8 */                   BNE.rel ("_b9a6");            // branch if range adjust not complete
/* b9ba */        _`_b9ba`;  CLC.imp ();                   // just clear it
/* b9bb */                   RTS.imp ();

// ------------------------------------------------------- // constants and series for LOG(n)
                                                           // 1
/* b9bc */    _`fone_b9bc`;  _.bytes(0x81, 0x00, 0x00, 0x00, 0x00);
/* b9c1 */  _`logcn2_b9c1`;  _.bytes(0x03);                // series counter
                                                           //  .434255942
/* b9c2 */                   _.bytes(0x7f, 0x5e, 0x56, 0xcb, 0x79);
                                                           //  .576584541
/* b9c7 */                   _.bytes(0x80, 0x13, 0x9b, 0x0b, 0x64);
                                                           //  .961800759
/* b9cc */                   _.bytes(0x80, 0x76, 0x38, 0x93, 0x16);
                                                           // 2.88539007
/* b9d1 */                   _.bytes(0x82, 0x38, 0xaa, 0x3b, 0x20);
                                                           //  .707106781 = 1/SQR(2)
/* b9d6 */                   _.bytes(0x80, 0x35, 0x04, 0xf3, 0x34);
                                                           // 1.41421356 = SQR(2)
/* b9db */                   _.bytes(0x81, 0x35, 0x04, 0xf3, 0x34);
                                                           // -.5
/* b9e0 */                   _.bytes(0x80, 0x80, 0x00, 0x00, 0x00);
                                                           //  .693147181  =  LOG(2)
/* b9e5 */                   _.bytes(0x80, 0x31, 0x72, 0x17, 0xf8);

// ------------------------------------------------------- // perform LOG()
/* b9ea */     _`log_b9ea`;  JSR.abs ("sign_bc2b");        // test sign and zero
/* b9ed */                   BEQ.rel ("_b9f1");            // if zero do illegal quantity error then warm start
/* b9ef */                   BPL.rel ("_b9f4");            // skip error if +ve
/* b9f1 */        _`_b9f1`;  JMP.abs ("fcerr_b248");       // do illegal quantity error then warm start
/* b9f4 */        _`_b9f4`;  LDA.zpg ("facexp_0061");      // get FAC1 exponent
/* b9f6 */                   SBC.imm (0x7f);               // normalise it
/* b9f8 */                   PHA.imp ();                   // save it
/* b9f9 */                   LDA.imm (0x80);               // set exponent to zero
/* b9fb */                   STA.zpg ("facexp_0061");      // save FAC1 exponent
/* b9fd */                   LDA.imm (0xd6);               // pointer to 1/root 2 low byte
/* b9ff */                   LDY.imm (0xb9);               // pointer to 1/root 2 high byte
/* ba01 */                   JSR.abs ("fadd_b867");        // add (AY) to FAC1 (1/root2)
/* ba04 */                   LDA.imm (0xdb);               // pointer to root 2 low byte
/* ba06 */                   LDY.imm (0xb9);               // pointer to root 2 high byte
/* ba08 */                   JSR.abs ("fdiv_bb0f");        // convert AY and do (AY)/FAC1 (root2/(x+(1/root2)))
/* ba0b */                   LDA.imm (0xbc);               // pointer to 1 low byte
/* ba0d */                   LDY.imm (0xb9);               // pointer to 1 high byte
/* ba0f */                   JSR.abs ("fsub_b850");        // subtract FAC1 ((root2/(x+(1/root2)))-1) from (AY)
/* ba12 */                   LDA.imm (0xc1);               // pointer to series for LOG(n) low byte
/* ba14 */                   LDY.imm (0xb9);               // pointer to series for LOG(n) high byte
/* ba16 */                   JSR.abs ("polyx_e043");       // ^2 then series evaluation
/* ba19 */                   LDA.imm (0xe0);               // pointer to -0.5 low byte
/* ba1b */                   LDY.imm (0xb9);               // pointer to -0.5 high byte
/* ba1d */                   JSR.abs ("fadd_b867");        // add (AY) to FAC1
/* ba20 */                   PLA.imp ();                   // restore FAC1 exponent
/* ba21 */                   JSR.abs ("finlog_bd7e");      // evaluate new ASCII digit
/* ba24 */                   LDA.imm (0xe5);               // pointer to LOG(2) low byte
/* ba26 */                   LDY.imm (0xb9);               // pointer to LOG(2) high byte

// ------------------------------------------------------- // do convert AY, FCA1*(AY)
/* ba28 */   _`fmult_ba28`;  JSR.abs ("conupk_ba8c");      // unpack memory (AY) into FAC2
/* ba2b */                   BNE.rel ("_ba30");            // multiply FAC1 by FAC2 ??
/* ba2d */                   JMP.abs ("_ba8b");            // exit if zero
/* ba30 */        _`_ba30`;  JSR.abs ("muldiv_bab7");      // test and adjust accumulators
/* ba33 */                   LDA.imm (0x00);               // clear A
/* ba35 */                   STA.zpg ("resho+0_0026");     // clear temp mantissa 1
/* ba37 */                   STA.zpg ("resho+1_0027");     // clear temp mantissa 2
/* ba39 */                   STA.zpg ("resho+2_0028");     // clear temp mantissa 3
/* ba3b */                   STA.zpg ("resho+3_0029");     // clear temp mantissa 4
/* ba3d */                   LDA.zpg ("facov_0070");       // get FAC1 rounding byte
/* ba3f */                   JSR.abs ("mulply_ba59");      // go do shift/add FAC2
/* ba42 */                   LDA.zpg ("facho+3_0065");     // get FAC1 mantissa 4
/* ba44 */                   JSR.abs ("mulply_ba59");      // go do shift/add FAC2
/* ba47 */                   LDA.zpg ("facho+2_0064");     // get FAC1 mantissa 3
/* ba49 */                   JSR.abs ("mulply_ba59");      // go do shift/add FAC2
/* ba4c */                   LDA.zpg ("facho+1_0063");     // get FAC1 mantissa 2
/* ba4e */                   JSR.abs ("mulply_ba59");      // go do shift/add FAC2
/* ba51 */                   LDA.zpg ("facho+0_0062");     // get FAC1 mantissa 1
/* ba53 */                   JSR.abs ("_ba5e");            // go do shift/add FAC2
/* ba56 */                   JMP.abs ("_bb8f");            // copy temp to FAC1, normalise and return
/* ba59 */  _`mulply_ba59`;  BNE.rel ("_ba5e");            // branch if byte <> zero
/* ba5b */                   JMP.abs ("mulshf_b983");      // shift FCAtemp << A+8 times
                                                           // else do shift and add
/* ba5e */        _`_ba5e`;  LSR.acc ();                   // shift byte
/* ba5f */                   ORA.imm (0x80);               // set top bit (mark for 8 times)
/* ba61 */        _`_ba61`;  TAY.imp ();                   // copy result
/* ba62 */                   BCC.rel ("_ba7d");            // skip next if bit was zero
/* ba64 */                   CLC.imp ();                   // clear carry for add
/* ba65 */                   LDA.zpg ("resho+3_0029");     // get temp mantissa 4
/* ba67 */                   ADC.zpg ("argho+3_006d");     // add FAC2 mantissa 4
/* ba69 */                   STA.zpg ("resho+3_0029");     // save temp mantissa 4
/* ba6b */                   LDA.zpg ("resho+2_0028");     // get temp mantissa 3
/* ba6d */                   ADC.zpg ("argho+2_006c");     // add FAC2 mantissa 3
/* ba6f */                   STA.zpg ("resho+2_0028");     // save temp mantissa 3
/* ba71 */                   LDA.zpg ("resho+1_0027");     // get temp mantissa 2
/* ba73 */                   ADC.zpg ("argho+1_006b");     // add FAC2 mantissa 2
/* ba75 */                   STA.zpg ("resho+1_0027");     // save temp mantissa 2
/* ba77 */                   LDA.zpg ("resho+0_0026");     // get temp mantissa 1
/* ba79 */                   ADC.zpg ("argho+0_006a");     // add FAC2 mantissa 1
/* ba7b */                   STA.zpg ("resho+0_0026");     // save temp mantissa 1
/* ba7d */        _`_ba7d`;  ROR.zpg ("resho+0_0026");     // shift temp mantissa 1
/* ba7f */                   ROR.zpg ("resho+1_0027");     // shift temp mantissa 2
/* ba81 */                   ROR.zpg ("resho+2_0028");     // shift temp mantissa 3
/* ba83 */                   ROR.zpg ("resho+3_0029");     // shift temp mantissa 4
/* ba85 */                   ROR.zpg ("facov_0070");       // shift temp rounding byte
/* ba87 */                   TYA.imp ();                   // get byte back
/* ba88 */                   LSR.acc ();                   // shift byte
/* ba89 */                   BNE.rel ("_ba61");            // loop if all bits not done
/* ba8b */        _`_ba8b`;  RTS.imp ();

// ------------------------------------------------------- // unpack memory (AY) into FAC2
/* ba8c */  _`conupk_ba8c`;  STA.zpg ("index+0_0022");     // save pointer low byte
/* ba8e */                   STY.zpg ("index+1_0023");     // save pointer high byte
/* ba90 */                   LDY.imm (0x04);               // 5 bytes to get (0-4)
/* ba92 */                   LDA.iny ("index+0_0022");     // get mantissa 4
/* ba94 */                   STA.zpg ("argho+3_006d");     // save FAC2 mantissa 4
/* ba96 */                   DEY.imp ();                   // decrement index
/* ba97 */                   LDA.iny ("index+0_0022");     // get mantissa 3
/* ba99 */                   STA.zpg ("argho+2_006c");     // save FAC2 mantissa 3
/* ba9b */                   DEY.imp ();                   // decrement index
/* ba9c */                   LDA.iny ("index+0_0022");     // get mantissa 2
/* ba9e */                   STA.zpg ("argho+1_006b");     // save FAC2 mantissa 2
/* baa0 */                   DEY.imp ();                   // decrement index
/* baa1 */                   LDA.iny ("index+0_0022");     // get mantissa 1 + sign
/* baa3 */                   STA.zpg ("argsgn_006e");      // save FAC2 sign (b7)
/* baa5 */                   EOR.zpg ("facsgn_0066");      // EOR with FAC1 sign (b7)
/* baa7 */                   STA.zpg ("arisgn_006f");      // save sign compare (FAC1 EOR FAC2)
/* baa9 */                   LDA.zpg ("argsgn_006e");      // recover FAC2 sign (b7)
/* baab */                   ORA.imm (0x80);               // set 1xxx xxx (set normal bit)
/* baad */                   STA.zpg ("argho+0_006a");     // save FAC2 mantissa 1
/* baaf */                   DEY.imp ();                   // decrement index
/* bab0 */                   LDA.iny ("index+0_0022");     // get exponent byte
/* bab2 */                   STA.zpg ("argexp_0069");      // save FAC2 exponent
/* bab4 */                   LDA.zpg ("facexp_0061");      // get FAC1 exponent
/* bab6 */                   RTS.imp ();

// ------------------------------------------------------- // test and adjust accumulators
/* bab7 */  _`muldiv_bab7`;  LDA.zpg ("argexp_0069");      // get FAC2 exponent
/* bab9 */                   BEQ.rel ("_bada");            // branch if FAC2 = $00 (handle underflow)
/* babb */                   CLC.imp ();                   // clear carry for add
/* babc */                   ADC.zpg ("facexp_0061");      // add FAC1 exponent
/* babe */                   BCC.rel ("_bac4");            // branch if sum of exponents < $0100
/* bac0 */                   BMI.rel ("_badf");            // do overflow error
/* bac2 */                   CLC.imp ();                   // clear carry for the add
/* bac3 */                   _.bytes(0x2c);                // makes next line BIT $1410
/* bac4 */        _`_bac4`;  BPL.rel ("_bada");            // if +ve go handle underflow
/* bac6 */                   ADC.imm (0x80);               // adjust exponent
/* bac8 */                   STA.zpg ("facexp_0061");      // save FAC1 exponent
/* baca */                   BNE.rel ("_bacf");            // branch if not zero
/* bacc */                   JMP.abs ("_b8fb");            // save FAC1 sign and return
/* bacf */        _`_bacf`;  LDA.zpg ("arisgn_006f");      // get sign compare (FAC1 EOR FAC2)
/* bad1 */                   STA.zpg ("facsgn_0066");      // save FAC1 sign (b7)
/* bad3 */                   RTS.imp ();
                                                           // handle overflow and underflow
/* bad4 */  _`mldvex_bad4`;  LDA.zpg ("facsgn_0066");      // get FAC1 sign (b7)
/* bad6 */                   EOR.imm (0xff);               // complement it
/* bad8 */                   BMI.rel ("_badf");            // do overflow error
                                                           // handle underflow
/* bada */        _`_bada`;  PLA.imp ();                   // pop return address low byte
/* badb */                   PLA.imp ();                   // pop return address high byte
/* badc */                   JMP.abs ("_b8f7");            // clear FAC1 exponent and sign and return
/* badf */        _`_badf`;  JMP.abs ("overr_b97e");       // do overflow error then warm start

// ------------------------------------------------------- // multiply FAC1 by 10
/* bae2 */   _`mul10_bae2`;  JSR.abs ("movaf_bc0c");       // round and copy FAC1 to FAC2
/* bae5 */                   TAX.imp ();                   // copy exponent (set the flags)
/* bae6 */                   BEQ.rel ("_baf8");            // exit if zero
/* bae8 */                   CLC.imp ();                   // clear carry for add
/* bae9 */                   ADC.imm (0x02);               // add two to exponent (*4)
/* baeb */                   BCS.rel ("_badf");            // do overflow error if > $FF
                                                           // FAC1 = (FAC1 + FAC2) * 2
/* baed */        _`_baed`;  LDX.imm (0x00);               // clear byte
/* baef */                   STX.zpg ("arisgn_006f");      // clear sign compare (FAC1 EOR FAC2)
/* baf1 */                   JSR.abs ("_b877");            // add FAC2 to FAC1 (*5)
/* baf4 */                   INC.zpg ("facexp_0061");      // increment FAC1 exponent (*10)
/* baf6 */                   BEQ.rel ("_badf");            // if exponent now zero go do overflow error
/* baf8 */        _`_baf8`;  RTS.imp ();

// ------------------------------------------------------- // 10 as a floating value
                                                           // 10
/* baf9 */    _`tenc_baf9`;  _.bytes(0x84, 0x20, 0x00, 0x00, 0x00);

// ------------------------------------------------------- // divide FAC1 by 10
/* bafe */   _`div10_bafe`;  JSR.abs ("movaf_bc0c");       // round and copy FAC1 to FAC2
/* bb01 */                   LDA.imm (0xf9);               // set 10 pointer low byte
/* bb03 */                   LDY.imm (0xba);               // set 10 pointer high byte
/* bb05 */                   LDX.imm (0x00);               // clear sign

// ------------------------------------------------------- // divide by (AY) (X=sign)
/* bb07 */   _`fdivf_bb07`;  STX.zpg ("arisgn_006f");      // save sign compare (FAC1 EOR FAC2)
/* bb09 */                   JSR.abs ("movfm_bba2");       // unpack memory (AY) into FAC1
/* bb0c */                   JMP.abs ("fdivt_bb12");       // do FAC2/FAC1
                                                           // Perform divide-by

// ------------------------------------------------------- // convert AY and do (AY)/FAC1
/* bb0f */    _`fdiv_bb0f`;  JSR.abs ("conupk_ba8c");      // unpack memory (AY) into FAC2
/* bb12 */   _`fdivt_bb12`;  BEQ.rel ("_bb8a");            // if zero go do /0 error
/* bb14 */                   JSR.abs ("round_bc1b");       // round FAC1
/* bb17 */                   LDA.imm (0x00);               // clear A
/* bb19 */                   SEC.imp ();                   // set carry for subtract
/* bb1a */                   SBC.zpg ("facexp_0061");      // subtract FAC1 exponent (2s complement)
/* bb1c */                   STA.zpg ("facexp_0061");      // save FAC1 exponent
/* bb1e */                   JSR.abs ("muldiv_bab7");      // test and adjust accumulators
/* bb21 */                   INC.zpg ("facexp_0061");      // increment FAC1 exponent
/* bb23 */                   BEQ.rel ("_badf");            // if zero do overflow error
/* bb25 */                   LDX.imm (0xfc);               // set index to FAC temp
/* bb27 */                   LDA.imm (0x01);               // set byte
/* bb29 */        _`_bb29`;  LDY.zpg ("argho+0_006a");     // get FAC2 mantissa 1
/* bb2b */                   CPY.zpg ("facho+0_0062");     // compare FAC1 mantissa 1
/* bb2d */                   BNE.rel ("_bb3f");            // branch if <>
/* bb2f */                   LDY.zpg ("argho+1_006b");     // get FAC2 mantissa 2
/* bb31 */                   CPY.zpg ("facho+1_0063");     // compare FAC1 mantissa 2
/* bb33 */                   BNE.rel ("_bb3f");            // branch if <>
/* bb35 */                   LDY.zpg ("argho+2_006c");     // get FAC2 mantissa 3
/* bb37 */                   CPY.zpg ("facho+2_0064");     // compare FAC1 mantissa 3
/* bb39 */                   BNE.rel ("_bb3f");            // branch if <>
/* bb3b */                   LDY.zpg ("argho+3_006d");     // get FAC2 mantissa 4
/* bb3d */                   CPY.zpg ("facho+3_0065");     // compare FAC1 mantissa 4
/* bb3f */        _`_bb3f`;  PHP.imp ();                   // save FAC2-FAC1 compare status
/* bb40 */                   ROL.acc ();                   // shift byte
/* bb41 */                   BCC.rel ("_bb4c");            // skip next if no carry
/* bb43 */                   INX.imp ();                   // increment index to FAC temp
/* bb44 */                   STA.zpx (0x29);
/* bb46 */                   BEQ.rel ("_bb7a");
/* bb48 */                   BPL.rel ("_bb7e");
/* bb4a */                   LDA.imm (0x01);
/* bb4c */        _`_bb4c`;  PLP.imp ();                   // restore FAC2-FAC1 compare status
/* bb4d */                   BCS.rel ("_bb5d");            // if FAC2 >= FAC1 then do subtract
                                                           // FAC2 = FAC2*2
/* bb4f */        _`_bb4f`;  ASL.zpg ("argho+3_006d");     // shift FAC2 mantissa 4
/* bb51 */                   ROL.zpg ("argho+2_006c");     // shift FAC2 mantissa 3
/* bb53 */                   ROL.zpg ("argho+1_006b");     // shift FAC2 mantissa 2
/* bb55 */                   ROL.zpg ("argho+0_006a");     // shift FAC2 mantissa 1
/* bb57 */                   BCS.rel ("_bb3f");            // loop with no compare
/* bb59 */                   BMI.rel ("_bb29");            // loop with compare
/* bb5b */                   BPL.rel ("_bb3f");            // loop with no compare, branch always
/* bb5d */        _`_bb5d`;  TAY.imp ();                   // save FAC2-FAC1 compare status
/* bb5e */                   LDA.zpg ("argho+3_006d");     // get FAC2 mantissa 4
/* bb60 */                   SBC.zpg ("facho+3_0065");     // subtract FAC1 mantissa 4
/* bb62 */                   STA.zpg ("argho+3_006d");     // save FAC2 mantissa 4
/* bb64 */                   LDA.zpg ("argho+2_006c");     // get FAC2 mantissa 3
/* bb66 */                   SBC.zpg ("facho+2_0064");     // subtract FAC1 mantissa 3
/* bb68 */                   STA.zpg ("argho+2_006c");     // save FAC2 mantissa 3
/* bb6a */                   LDA.zpg ("argho+1_006b");     // get FAC2 mantissa 2
/* bb6c */                   SBC.zpg ("facho+1_0063");     // subtract FAC1 mantissa 2
/* bb6e */                   STA.zpg ("argho+1_006b");     // save FAC2 mantissa 2
/* bb70 */                   LDA.zpg ("argho+0_006a");     // get FAC2 mantissa 1
/* bb72 */                   SBC.zpg ("facho+0_0062");     // subtract FAC1 mantissa 1
/* bb74 */                   STA.zpg ("argho+0_006a");     // save FAC2 mantissa 1
/* bb76 */                   TYA.imp ();                   // restore FAC2-FAC1 compare status
/* bb77 */                   JMP.abs ("_bb4f");
/* bb7a */        _`_bb7a`;  LDA.imm (0x40);
/* bb7c */                   BNE.rel ("_bb4c");            // branch always
                                                           // do A<<6, save as FAC1 rounding byte, normalise and return
/* bb7e */        _`_bb7e`;  ASL.acc ();
/* bb7f */                   ASL.acc ();
/* bb80 */                   ASL.acc ();
/* bb81 */                   ASL.acc ();
/* bb82 */                   ASL.acc ();
/* bb83 */                   ASL.acc ();
/* bb84 */                   STA.zpg ("facov_0070");       // save FAC1 rounding byte
/* bb86 */                   PLP.imp ();                   // dump FAC2-FAC1 compare status
/* bb87 */                   JMP.abs ("_bb8f");            // copy temp to FAC1, normalise and return
                                                           // do "Divide by zero" error
/* bb8a */        _`_bb8a`;  LDX.imm (0x14);               // error $14, divide by zero error
/* bb8c */                   JMP.abs ("error_a437");       // do error #X then warm start
/* bb8f */        _`_bb8f`;  LDA.zpg ("resho+0_0026");     // get temp mantissa 1
/* bb91 */                   STA.zpg ("facho+0_0062");     // save FAC1 mantissa 1
/* bb93 */                   LDA.zpg ("resho+1_0027");     // get temp mantissa 2
/* bb95 */                   STA.zpg ("facho+1_0063");     // save FAC1 mantissa 2
/* bb97 */                   LDA.zpg ("resho+2_0028");     // get temp mantissa 3
/* bb99 */                   STA.zpg ("facho+2_0064");     // save FAC1 mantissa 3
/* bb9b */                   LDA.zpg ("resho+3_0029");     // get temp mantissa 4
/* bb9d */                   STA.zpg ("facho+3_0065");     // save FAC1 mantissa 4
/* bb9f */                   JMP.abs ("_b8d7");            // normalise FAC1 and return

// ------------------------------------------------------- // unpack memory (AY) into FAC1
/* bba2 */   _`movfm_bba2`;  STA.zpg ("index+0_0022");     // save pointer low byte
/* bba4 */                   STY.zpg ("index+1_0023");     // save pointer high byte
/* bba6 */                   LDY.imm (0x04);               // 5 bytes to do
/* bba8 */                   LDA.iny ("index+0_0022");     // get fifth byte
/* bbaa */                   STA.zpg ("facho+3_0065");     // save FAC1 mantissa 4
/* bbac */                   DEY.imp ();                   // decrement index
/* bbad */                   LDA.iny ("index+0_0022");     // get fourth byte
/* bbaf */                   STA.zpg ("facho+2_0064");     // save FAC1 mantissa 3
/* bbb1 */                   DEY.imp ();                   // decrement index
/* bbb2 */                   LDA.iny ("index+0_0022");     // get third byte
/* bbb4 */                   STA.zpg ("facho+1_0063");     // save FAC1 mantissa 2
/* bbb6 */                   DEY.imp ();                   // decrement index
/* bbb7 */                   LDA.iny ("index+0_0022");     // get second byte
/* bbb9 */                   STA.zpg ("facsgn_0066");      // save FAC1 sign (b7)
/* bbbb */                   ORA.imm (0x80);               // set 1xxx xxxx (add normal bit)
/* bbbd */                   STA.zpg ("facho+0_0062");     // save FAC1 mantissa 1
/* bbbf */                   DEY.imp ();                   // decrement index
/* bbc0 */                   LDA.iny ("index+0_0022");     // get first byte (exponent)
/* bbc2 */                   STA.zpg ("facexp_0061");      // save FAC1 exponent
/* bbc4 */                   STY.zpg ("facov_0070");       // clear FAC1 rounding byte
/* bbc6 */                   RTS.imp ();

// ------------------------------------------------------- // pack FAC1 into $5C
/* bbc7 */   _`mov2f_bbc7`;  LDX.imm (0x5c);               // set pointer low byte
/* bbc9 */                   _.bytes(0x2c);                // makes next line BIT $57A2

// ------------------------------------------------------- // pack FAC1 into $57
/* bbca */                   LDX.imm (0x57);               // set pointer low byte
/* bbcc */                   LDY.imm (0x00);               // set pointer high byte
/* bbce */                   BEQ.rel ("_bbd4");            // pack FAC1 into (XY) and return, branch always

// ------------------------------------------------------- // pack FAC1 into variable pointer
/* bbd0 */        _`_bbd0`;  LDX.zpg ("forpnt+0_0049");    // get destination pointer low byte
/* bbd2 */                   LDY.zpg ("forpnt+1_004a");    // get destination pointer high byte

// ------------------------------------------------------- // pack FAC1 into (XY)
/* bbd4 */        _`_bbd4`;  JSR.abs ("round_bc1b");       // round FAC1
/* bbd7 */                   STX.zpg ("index+0_0022");     // save pointer low byte
/* bbd9 */                   STY.zpg ("index+1_0023");     // save pointer high byte
/* bbdb */                   LDY.imm (0x04);               // set index
/* bbdd */                   LDA.zpg ("facho+3_0065");     // get FAC1 mantissa 4
/* bbdf */                   STA.iny ("index+0_0022");     // store in destination
/* bbe1 */                   DEY.imp ();                   // decrement index
/* bbe2 */                   LDA.zpg ("facho+2_0064");     // get FAC1 mantissa 3
/* bbe4 */                   STA.iny ("index+0_0022");     // store in destination
/* bbe6 */                   DEY.imp ();                   // decrement index
/* bbe7 */                   LDA.zpg ("facho+1_0063");     // get FAC1 mantissa 2
/* bbe9 */                   STA.iny ("index+0_0022");     // store in destination
/* bbeb */                   DEY.imp ();                   // decrement index
/* bbec */                   LDA.zpg ("facsgn_0066");      // get FAC1 sign (b7)
/* bbee */                   ORA.imm (0x7f);               // set bits x111 1111
/* bbf0 */                   AND.zpg ("facho+0_0062");     // AND in FAC1 mantissa 1
/* bbf2 */                   STA.iny ("index+0_0022");     // store in destination
/* bbf4 */                   DEY.imp ();                   // decrement index
/* bbf5 */                   LDA.zpg ("facexp_0061");      // get FAC1 exponent
/* bbf7 */                   STA.iny ("index+0_0022");     // store in destination
/* bbf9 */                   STY.zpg ("facov_0070");       // clear FAC1 rounding byte
/* bbfb */                   RTS.imp ();

// ------------------------------------------------------- // copy FAC2 to FAC1
/* bbfc */   _`movfa_bbfc`;  LDA.zpg ("argsgn_006e");      // get FAC2 sign (b7)
                                                           // save FAC1 sign and copy ABS(FAC2) to FAC1
/* bbfe */        _`_bbfe`;  STA.zpg ("facsgn_0066");      // save FAC1 sign (b7)
/* bc00 */                   LDX.imm (0x05);               // 5 bytes to copy
/* bc02 */        _`_bc02`;  LDA.zpx (0x68);               // get byte from FAC2,X
/* bc04 */                   STA.zpx (0x60);               // save byte at FAC1,X
/* bc06 */                   DEX.imp ();                   // decrement count
/* bc07 */                   BNE.rel ("_bc02");            // loop if not all done
/* bc09 */                   STX.zpg ("facov_0070");       // clear FAC1 rounding byte
/* bc0b */                   RTS.imp ();

// ------------------------------------------------------- // round and copy FAC1 to FAC2
/* bc0c */   _`movaf_bc0c`;  JSR.abs ("round_bc1b");       // round FAC1
                                                           // copy FAC1 to FAC2
/* bc0f */   _`movef_bc0f`;  LDX.imm (0x06);               // 6 bytes to copy
/* bc11 */        _`_bc11`;  LDA.zpx (0x60);               // get byte from FAC1,X
/* bc13 */                   STA.zpx (0x68);               // save byte at FAC2,X
/* bc15 */                   DEX.imp ();                   // decrement count
/* bc16 */                   BNE.rel ("_bc11");            // loop if not all done
/* bc18 */                   STX.zpg ("facov_0070");       // clear FAC1 rounding byte
/* bc1a */        _`_bc1a`;  RTS.imp ();

// ------------------------------------------------------- // round FAC1
/* bc1b */   _`round_bc1b`;  LDA.zpg ("facexp_0061");      // get FAC1 exponent
/* bc1d */                   BEQ.rel ("_bc1a");            // exit if zero
/* bc1f */                   ASL.zpg ("facov_0070");       // shift FAC1 rounding byte
/* bc21 */                   BCC.rel ("_bc1a");            // exit if no overflow
                                                           // round FAC1 (no check)
/* bc23 */        _`_bc23`;  JSR.abs ("_b96f");            // increment FAC1 mantissa
/* bc26 */                   BNE.rel ("_bc1a");            // branch if no overflow
/* bc28 */                   JMP.abs ("_b938");            // nornalise FAC1 for C=1 and return

// ------------------------------------------------------- // get FAC1 sign
                                                           // return A = $FF, Cb = 1/-ve A = $01, Cb = 0/+ve, A = $00, Cb = ?/0
/* bc2b */    _`sign_bc2b`;  LDA.zpg ("facexp_0061");      // get FAC1 exponent
/* bc2d */                   BEQ.rel ("_bc38");            // exit if zero (allready correct SGN(0)=0)

// ------------------------------------------------------- // return A = $FF, Cb = 1/-ve A = $01, Cb = 0/+ve
                                                           // no = 0 check
/* bc2f */        _`_bc2f`;  LDA.zpg ("facsgn_0066");      // else get FAC1 sign (b7)

// ------------------------------------------------------- // return A = $FF, Cb = 1/-ve A = $01, Cb = 0/+ve
                                                           // no = 0 check, sign in A
/* bc31 */        _`_bc31`;  ROL.acc ();                   // move sign bit to carry
/* bc32 */                   LDA.imm (0xff);               // set byte for -ve result
/* bc34 */                   BCS.rel ("_bc38");            // return if sign was set (-ve)
/* bc36 */                   LDA.imm (0x01);               // else set byte for +ve result
/* bc38 */        _`_bc38`;  RTS.imp ();

// ------------------------------------------------------- // perform SGN()
/* bc39 */     _`sgn_bc39`;  JSR.abs ("sign_bc2b");        // get FAC1 sign, return A = $FF -ve, A = $01 +ve

// ------------------------------------------------------- // save A as integer byte
/* bc3c */        _`_bc3c`;  STA.zpg ("facho+0_0062");     // save FAC1 mantissa 1
/* bc3e */                   LDA.imm (0x00);               // clear A
/* bc40 */                   STA.zpg ("facho+1_0063");     // clear FAC1 mantissa 2
/* bc42 */                   LDX.imm (0x88);               // set exponent
                                                           // set exponent = X, clear FAC1 3 and 4 and normalise
/* bc44 */        _`_bc44`;  LDA.zpg ("facho+0_0062");     // get FAC1 mantissa 1
/* bc46 */                   EOR.imm (0xff);               // complement it
/* bc48 */                   ROL.acc ();                   // sign bit into carry
                                                           // set exponent = X, clear mantissa 4 and 3 and normalise FAC1
/* bc49 */        _`_bc49`;  LDA.imm (0x00);               // clear A
/* bc4b */                   STA.zpg ("facho+3_0065");     // clear FAC1 mantissa 4
/* bc4d */                   STA.zpg ("facho+2_0064");     // clear FAC1 mantissa 3
                                                           // set exponent = X and normalise FAC1
/* bc4f */        _`_bc4f`;  STX.zpg ("facexp_0061");      // set FAC1 exponent
/* bc51 */                   STA.zpg ("facov_0070");       // clear FAC1 rounding byte
/* bc53 */                   STA.zpg ("facsgn_0066");      // clear FAC1 sign (b7)
/* bc55 */                   JMP.abs ("_b8d2");            // do ABS and normalise FAC1

// ------------------------------------------------------- // perform ABS()
/* bc58 */     _`abs_bc58`;  LSR.zpg ("facsgn_0066");      // clear FAC1 sign, put zero in b7
/* bc5a */                   RTS.imp ();

// ------------------------------------------------------- // compare FAC1 with (AY)
                                                           // returns A=$00 if FAC1 = (AY)
                                                           // returns A=$01 if FAC1 > (AY)
                                                           // returns A=$FF if FAC1 < (AY)
/* bc5b */   _`fcomp_bc5b`;  STA.zpg ("index+2_0024");     // save pointer low byte
/* bc5d */        _`_bc5d`;  STY.zpg ("index+3_0025");     // save pointer high byte
/* bc5f */                   LDY.imm (0x00);               // clear index
/* bc61 */                   LDA.iny ("index+2_0024");     // get exponent
/* bc63 */                   INY.imp ();                   // increment index
/* bc64 */                   TAX.imp ();                   // copy (AY) exponent to X
/* bc65 */                   BEQ.rel ("sign_bc2b");        // branch if (AY) exponent=0 and get FAC1 sign
                                                           // A = $FF, Cb = 1/-ve A = $01, Cb = 0/+ve
/* bc67 */                   LDA.iny ("index+2_0024");     // get (AY) mantissa 1, with sign
/* bc69 */                   EOR.zpg ("facsgn_0066");      // EOR FAC1 sign (b7)
/* bc6b */                   BMI.rel ("_bc2f");            // if signs <> do return A = $FF, Cb = 1/-ve
                                                           // A = $01, Cb = 0/+ve and return
/* bc6d */                   CPX.zpg ("facexp_0061");      // compare (AY) exponent with FAC1 exponent
/* bc6f */                   BNE.rel ("_bc92");            // branch if different
/* bc71 */                   LDA.iny ("index+2_0024");     // get (AY) mantissa 1, with sign
/* bc73 */                   ORA.imm (0x80);               // normalise top bit
/* bc75 */                   CMP.zpg ("facho+0_0062");     // compare with FAC1 mantissa 1
/* bc77 */                   BNE.rel ("_bc92");            // branch if different
/* bc79 */                   INY.imp ();                   // increment index
/* bc7a */                   LDA.iny ("index+2_0024");     // get mantissa 2
/* bc7c */                   CMP.zpg ("facho+1_0063");     // compare with FAC1 mantissa 2
/* bc7e */                   BNE.rel ("_bc92");            // branch if different
/* bc80 */                   INY.imp ();                   // increment index
/* bc81 */                   LDA.iny ("index+2_0024");     // get mantissa 3
/* bc83 */                   CMP.zpg ("facho+2_0064");     // compare with FAC1 mantissa 3
/* bc85 */                   BNE.rel ("_bc92");            // branch if different
/* bc87 */                   INY.imp ();                   // increment index
/* bc88 */                   LDA.imm (0x7f);               // set for 1/2 value rounding byte
/* bc8a */                   CMP.zpg ("facov_0070");       // compare with FAC1 rounding byte (set carry)
/* bc8c */                   LDA.iny ("index+2_0024");     // get mantissa 4
/* bc8e */                   SBC.zpg ("facho+3_0065");     // subtract FAC1 mantissa 4
/* bc90 */                   BEQ.rel ("_bcba");            // exit if mantissa 4 equal
                                                           // gets here if number <> FAC1
/* bc92 */        _`_bc92`;  LDA.zpg ("facsgn_0066");      // get FAC1 sign (b7)
/* bc94 */                   BCC.rel ("_bc98");            // branch if FAC1 > (AY)
/* bc96 */                   EOR.imm (0xff);               // else toggle FAC1 sign
/* bc98 */        _`_bc98`;  JMP.abs ("_bc31");            // return A = $FF, Cb = 1/-ve A = $01, Cb = 0/+ve

// ------------------------------------------------------- // convert FAC1 floating to fixed
/* bc9b */    _`qint_bc9b`;  LDA.zpg ("facexp_0061");      // get FAC1 exponent
/* bc9d */                   BEQ.rel ("_bce9");            // if zero go clear FAC1 and return
/* bc9f */                   SEC.imp ();                   // set carry for subtract
/* bca0 */                   SBC.imm (0xa0);               // subtract maximum integer range exponent
/* bca2 */                   BIT.zpg ("facsgn_0066");      // test FAC1 sign (b7)
/* bca4 */                   BPL.rel ("_bcaf");            // branch if FAC1 +ve
                                                           // FAC1 was -ve
/* bca6 */                   TAX.imp ();                   // copy subtracted exponent
/* bca7 */                   LDA.imm (0xff);               // overflow for -ve number
/* bca9 */                   STA.zpg ("bits_0068");        // set FAC1 overflow byte
/* bcab */                   JSR.abs ("_b94d");            // twos complement FAC1 mantissa
/* bcae */                   TXA.imp ();                   // restore subtracted exponent
/* bcaf */        _`_bcaf`;  LDX.imm (0x61);               // set index to FAC1
/* bcb1 */                   CMP.imm (0xf9);               // compare exponent result
/* bcb3 */                   BPL.rel ("_bcbb");            // if < 8 shifts shift FAC1 A times right and return
/* bcb5 */                   JSR.abs ("_b999");            // shift FAC1 A times right (> 8 shifts)
/* bcb8 */                   STY.zpg ("bits_0068");        // clear FAC1 overflow byte
/* bcba */        _`_bcba`;  RTS.imp ();

// ------------------------------------------------------- // shift FAC1 A times right
/* bcbb */        _`_bcbb`;  TAY.imp ();                   // copy shift count
/* bcbc */                   LDA.zpg ("facsgn_0066");      // get FAC1 sign (b7)
/* bcbe */                   AND.imm (0x80);               // mask sign bit only (x000 0000)
/* bcc0 */                   LSR.zpg ("facho+0_0062");     // shift FAC1 mantissa 1
/* bcc2 */                   ORA.zpg ("facho+0_0062");     // OR sign in b7 FAC1 mantissa 1
/* bcc4 */                   STA.zpg ("facho+0_0062");     // save FAC1 mantissa 1
/* bcc6 */                   JSR.abs ("_b9b0");            // shift FAC1 Y times right
/* bcc9 */                   STY.zpg ("bits_0068");        // clear FAC1 overflow byte
/* bccb */                   RTS.imp ();

// ------------------------------------------------------- // perform INT()
/* bccc */     _`int_bccc`;  LDA.zpg ("facexp_0061");      // get FAC1 exponent
/* bcce */                   CMP.imm (0xa0);               // compare with max int
/* bcd0 */                   BCS.rel ("_bcf2");            // exit if >= (allready int, too big for fractional part!)
/* bcd2 */                   JSR.abs ("qint_bc9b");        // convert FAC1 floating to fixed
/* bcd5 */                   STY.zpg ("facov_0070");       // save FAC1 rounding byte
/* bcd7 */                   LDA.zpg ("facsgn_0066");      // get FAC1 sign (b7)
/* bcd9 */                   STY.zpg ("facsgn_0066");      // save FAC1 sign (b7)
/* bcdb */                   EOR.imm (0x80);               // toggle FAC1 sign
/* bcdd */                   ROL.acc ();                   // shift into carry
/* bcde */                   LDA.imm (0xa0);               // set new exponent
/* bce0 */                   STA.zpg ("facexp_0061");      // save FAC1 exponent
/* bce2 */                   LDA.zpg ("facho+3_0065");     // get FAC1 mantissa 4
/* bce4 */                   STA.zpg ("charac_0007");      // save FAC1 mantissa 4 for power function
/* bce6 */                   JMP.abs ("_b8d2");            // do ABS and normalise FAC1

// ------------------------------------------------------- // clear FAC1 and return
/* bce9 */        _`_bce9`;  STA.zpg ("facho+0_0062");     // clear FAC1 mantissa 1
/* bceb */                   STA.zpg ("facho+1_0063");     // clear FAC1 mantissa 2
/* bced */                   STA.zpg ("facho+2_0064");     // clear FAC1 mantissa 3
/* bcef */                   STA.zpg ("facho+3_0065");     // clear FAC1 mantissa 4
/* bcf1 */                   TAY.imp ();                   // clear Y
/* bcf2 */        _`_bcf2`;  RTS.imp ();

// ------------------------------------------------------- // get FAC1 from string
/* bcf3 */     _`fin_bcf3`;  LDY.imm (0x00);               // clear Y
/* bcf5 */                   LDX.imm (0x0a);               // set index
/* bcf7 */        _`_bcf7`;  STY.zpx (0x5d);               // clear byte
/* bcf9 */                   DEX.imp ();                   // decrement index
/* bcfa */                   BPL.rel ("_bcf7");            // loop until numexp to negnum (and FAC1) = $00
/* bcfc */                   BCC.rel ("_bd0d");            // branch if first character is numeric
/* bcfe */                   CMP.imm (0x2d);               // else compare with "-"
/* bd00 */                   BNE.rel ("_bd06");            // branch if not "-"
/* bd02 */                   STX.zpg ("sgnflg_0067");      // set flag for -ve n (negnum = $FF)
/* bd04 */                   BEQ.rel ("_bd0a");            // branch always
/* bd06 */        _`_bd06`;  CMP.imm (0x2b);               // else compare with "+"
/* bd08 */                   BNE.rel ("_bd0f");            // branch if not "+"
/* bd0a */        _`_bd0a`;  JSR.abs ("chrget+0_0073");    // increment and scan memory
/* bd0d */        _`_bd0d`;  BCC.rel ("_bd6a");            // branch if numeric character
/* bd0f */        _`_bd0f`;  CMP.imm (0x2e);               // else compare with "."
/* bd11 */                   BEQ.rel ("_bd41");            // branch if "."
/* bd13 */                   CMP.imm (0x45);               // else compare with "E"
/* bd15 */                   BNE.rel ("_bd47");            // branch if not "E"
                                                           // was "E" so evaluate exponential part
/* bd17 */                   JSR.abs ("chrget+0_0073");    // increment and scan memory
/* bd1a */                   BCC.rel ("_bd33");            // branch if numeric character
/* bd1c */                   CMP.imm (0xab);               // else compare with token for -
/* bd1e */                   BEQ.rel ("_bd2e");            // branch if token for -
/* bd20 */                   CMP.imm (0x2d);               // else compare with "-"
/* bd22 */                   BEQ.rel ("_bd2e");            // branch if "-"
/* bd24 */                   CMP.imm (0xaa);               // else compare with token for +
/* bd26 */                   BEQ.rel ("_bd30");            // branch if token for +
/* bd28 */                   CMP.imm (0x2b);               // else compare with "+"
/* bd2a */                   BEQ.rel ("_bd30");            // branch if "+"
/* bd2c */                   BNE.rel ("_bd35");            // branch always
/* bd2e */        _`_bd2e`;  ROR.zpg ("tempf2+4_0060");    // set exponent -ve flag (C, which=1, into b7)
/* bd30 */        _`_bd30`;  JSR.abs ("chrget+0_0073");    // increment and scan memory
/* bd33 */        _`_bd33`;  BCC.rel ("_bd91");            // branch if numeric character
/* bd35 */        _`_bd35`;  BIT.zpg ("tempf2+4_0060");    // test exponent -ve flag
/* bd37 */                   BPL.rel ("_bd47");            // if +ve go evaluate exponent
                                                           // else do exponent = -exponent
/* bd39 */                   LDA.imm (0x00);               // clear result
/* bd3b */                   SEC.imp ();                   // set carry for subtract
/* bd3c */                   SBC.zpg ("tempf2+2_005e");    // subtract exponent byte
/* bd3e */                   JMP.abs ("_bd49");            // go evaluate exponent
/* bd41 */        _`_bd41`;  ROR.zpg ("tempf2+3_005f");    // set decimal point flag
/* bd43 */                   BIT.zpg ("tempf2+3_005f");    // test decimal point flag
/* bd45 */                   BVC.rel ("_bd0a");            // branch if only one decimal point so far
                                                           // evaluate exponent
/* bd47 */        _`_bd47`;  LDA.zpg ("tempf2+2_005e");    // get exponent count byte
/* bd49 */        _`_bd49`;  SEC.imp ();                   // set carry for subtract
/* bd4a */                   SBC.zpg ("tempf2+1_005d");    // subtract numerator exponent
/* bd4c */                   STA.zpg ("tempf2+2_005e");    // save exponent count byte
/* bd4e */                   BEQ.rel ("_bd62");            // branch if no adjustment
/* bd50 */                   BPL.rel ("_bd5b");            // else if +ve go do FAC1*10^expcnt
                                                           // else go do FAC1/10^(0-expcnt)
/* bd52 */        _`_bd52`;  JSR.abs ("div10_bafe");       // divide FAC1 by 10
/* bd55 */                   INC.zpg ("tempf2+2_005e");    // increment exponent count byte
/* bd57 */                   BNE.rel ("_bd52");            // loop until all done
/* bd59 */                   BEQ.rel ("_bd62");            // branch always
/* bd5b */        _`_bd5b`;  JSR.abs ("mul10_bae2");       // multiply FAC1 by 10
/* bd5e */                   DEC.zpg ("tempf2+2_005e");    // decrement exponent count byte
/* bd60 */                   BNE.rel ("_bd5b");            // loop until all done
/* bd62 */        _`_bd62`;  LDA.zpg ("sgnflg_0067");      // get -ve flag
/* bd64 */                   BMI.rel ("_bd67");            // if -ve do - FAC1 and return
/* bd66 */                   RTS.imp ();

// ------------------------------------------------------- // do - FAC1 and return
/* bd67 */        _`_bd67`;  JMP.abs ("negop_bfb4");       // do - FAC1
                                                           // do unsigned FAC1*10+number
/* bd6a */        _`_bd6a`;  PHA.imp ();                   // save character
/* bd6b */                   BIT.zpg ("tempf2+3_005f");    // test decimal point flag
/* bd6d */                   BPL.rel ("_bd71");            // skip exponent increment if not set
/* bd6f */                   INC.zpg ("tempf2+1_005d");    // else increment number exponent
/* bd71 */        _`_bd71`;  JSR.abs ("mul10_bae2");       // multiply FAC1 by 10
/* bd74 */                   PLA.imp ();                   // restore character
/* bd75 */                   SEC.imp ();                   // set carry for subtract
/* bd76 */                   SBC.imm (0x30);               // convert to binary
/* bd78 */                   JSR.abs ("finlog_bd7e");      // evaluate new ASCII digit
/* bd7b */                   JMP.abs ("_bd0a");            // go do next character
                                                           // evaluate new ASCII digit
                                                           // multiply FAC1 by 10 then (ABS) add in new digit
/* bd7e */  _`finlog_bd7e`;  PHA.imp ();                   // save digit
/* bd7f */                   JSR.abs ("movaf_bc0c");       // round and copy FAC1 to FAC2
/* bd82 */                   PLA.imp ();                   // restore digit
/* bd83 */                   JSR.abs ("_bc3c");            // save A as integer byte
/* bd86 */                   LDA.zpg ("argsgn_006e");      // get FAC2 sign (b7)
/* bd88 */                   EOR.zpg ("facsgn_0066");      // toggle with FAC1 sign (b7)
/* bd8a */                   STA.zpg ("arisgn_006f");      // save sign compare (FAC1 EOR FAC2)
/* bd8c */                   LDX.zpg ("facexp_0061");      // get FAC1 exponent
/* bd8e */                   JMP.abs ("faddt_b86a");       // add FAC2 to FAC1 and return
                                                           // evaluate next character of exponential part of number
/* bd91 */        _`_bd91`;  LDA.zpg ("tempf2+2_005e");    // get exponent count byte
/* bd93 */                   CMP.imm (0x0a);               // compare with 10 decimal
/* bd95 */                   BCC.rel ("_bda0");            // branch if less
/* bd97 */                   LDA.imm (0x64);               // make all -ve exponents = -100 decimal (causes underflow)
/* bd99 */                   BIT.zpg ("tempf2+4_0060");    // test exponent -ve flag
/* bd9b */                   BMI.rel ("_bdae");            // branch if -ve
/* bd9d */                   JMP.abs ("overr_b97e");       // else do overflow error then warm start
/* bda0 */        _`_bda0`;  ASL.acc ();                   // *2
/* bda1 */                   ASL.acc ();                   // *4
/* bda2 */                   CLC.imp ();                   // clear carry for add
/* bda3 */                   ADC.zpg ("tempf2+2_005e");    // *5
/* bda5 */                   ASL.acc ();                   // *10
/* bda6 */                   CLC.imp ();                   // clear carry for add
/* bda7 */                   LDY.imm (0x00);               // set index
/* bda9 */                   ADC.iny ("txtptr+0_007a");    // add character (will be $30 too much!)
/* bdab */                   SEC.imp ();                   // set carry for subtract
/* bdac */                   SBC.imm (0x30);               // convert character to binary
/* bdae */        _`_bdae`;  STA.zpg ("tempf2+2_005e");    // save exponent count byte
/* bdb0 */                   JMP.abs ("_bd30");            // go get next character

// ------------------------------------------------------- // limits for scientific mode
                                                           // 99999999.90625, maximum value with at least one decimal
/* bdb3 */   _`n0999_bdb3`;  _.bytes(0x9b, 0x3e, 0xbc, 0x1f, 0xfd);
                                                           // 999999999.25, maximum value before scientific notation
/* bdb8 */                   _.bytes(0x9e, 0x6e, 0x6b, 0x27, 0xfd);
                                                           // 1000000000
/* bdbd */                   _.bytes(0x9e, 0x6e, 0x6b, 0x28, 0x00);

// ------------------------------------------------------- // do " IN " line number message
/* bdc2 */   _`inprt_bdc2`;  LDA.imm (0x71);               // set " IN " pointer low byte
/* bdc4 */                   LDY.imm (0xa3);               // set " IN " pointer high byte
/* bdc6 */                   JSR.abs ("_bdda");            // print null terminated string
/* bdc9 */                   LDA.zpg ("curlin+1_003a");    // get the current line number high byte
/* bdcb */                   LDX.zpg ("curlin+0_0039");    // get the current line number low byte

// ------------------------------------------------------- // print XA as unsigned integer
/* bdcd */  _`linprt_bdcd`;  STA.zpg ("facho+0_0062");     // save high byte as FAC1 mantissa1
/* bdcf */                   STX.zpg ("facho+1_0063");     // save low byte as FAC1 mantissa2
/* bdd1 */                   LDX.imm (0x90);               // set exponent to 16d bits
/* bdd3 */                   SEC.imp ();                   // set integer is +ve flag
/* bdd4 */                   JSR.abs ("_bc49");            // set exponent = X, clear mantissa 4 and 3 and normalise
                                                           // FAC1
/* bdd7 */                   JSR.abs ("_bddf");            // convert FAC1 to string
/* bdda */        _`_bdda`;  JMP.abs ("strout_ab1e");      // print null terminated string

// ------------------------------------------------------- // convert FAC1 to ASCII string result in (AY)
/* bddd */    _`fout_bddd`;  LDY.imm (0x01);               // set index = 1
/* bddf */        _`_bddf`;  LDA.imm (0x20);               // character = " " (assume +ve)
/* bde1 */                   BIT.zpg ("facsgn_0066");      // test FAC1 sign (b7)
/* bde3 */                   BPL.rel ("_bde7");            // branch if +ve
/* bde5 */                   LDA.imm (0x2d);               // else character = "-"
/* bde7 */        _`_bde7`;  STA.aby ("baszpt_00ff");      // save leading character (" " or "-")
/* bdea */                   STA.zpg ("facsgn_0066");      // save FAC1 sign (b7)
/* bdec */                   STY.zpg ("fbufpt+0_0071");    // save index
/* bdee */                   INY.imp ();                   // increment index
/* bdef */                   LDA.imm (0x30);               // set character = "0"
/* bdf1 */                   LDX.zpg ("facexp_0061");      // get FAC1 exponent
/* bdf3 */                   BNE.rel ("_bdf8");            // branch if FAC1<>0
                                                           // exponent was $00 so FAC1 is 0
/* bdf5 */                   JMP.abs ("_bf04");            // save last character, [EOT] and exit
                                                           // FAC1 is some non zero value
/* bdf8 */        _`_bdf8`;  LDA.imm (0x00);               // clear (number exponent count)
/* bdfa */                   CPX.imm (0x80);               // compare FAC1 exponent with $80 (<1.00000)
/* bdfc */                   BEQ.rel ("_be00");            // branch if 0.5 <= FAC1 < 1.0
/* bdfe */                   BCS.rel ("_be09");            // branch if FAC1=>1
/* be00 */        _`_be00`;  LDA.imm (0xbd);               // set 1000000000 pointer low byte
/* be02 */                   LDY.imm (0xbd);               // set 1000000000 pointer high byte
/* be04 */                   JSR.abs ("fmult_ba28");       // do convert AY, FCA1*(AY)
/* be07 */                   LDA.imm (0xf7);               // set number exponent count
/* be09 */        _`_be09`;  STA.zpg ("tempf2+1_005d");    // save number exponent count
/* be0b */        _`_be0b`;  LDA.imm (0xb8);               // set 999999999.25 pointer low byte (max before sci note)
/* be0d */                   LDY.imm (0xbd);               // set 999999999.25 pointer high byte
/* be0f */                   JSR.abs ("fcomp_bc5b");       // compare FAC1 with (AY)
/* be12 */                   BEQ.rel ("_be32");            // exit if FAC1 = (AY)
/* be14 */                   BPL.rel ("_be28");            // go do /10 if FAC1 > (AY)
                                                           // FAC1 < (AY)
/* be16 */        _`_be16`;  LDA.imm (0xb3);               // set 99999999.90625 pointer low byte
/* be18 */                   LDY.imm (0xbd);               // set 99999999.90625 pointer high byte
/* be1a */                   JSR.abs ("fcomp_bc5b");       // compare FAC1 with (AY)
/* be1d */                   BEQ.rel ("_be21");            // branch if FAC1 = (AY) (allow decimal places)
/* be1f */                   BPL.rel ("_be2f");            // branch if FAC1 > (AY) (no decimal places)
                                                           // FAC1 <= (AY)
/* be21 */        _`_be21`;  JSR.abs ("mul10_bae2");       // multiply FAC1 by 10
/* be24 */                   DEC.zpg ("tempf2+1_005d");    // decrement number exponent count
/* be26 */                   BNE.rel ("_be16");            // go test again, branch always
/* be28 */        _`_be28`;  JSR.abs ("div10_bafe");       // divide FAC1 by 10
/* be2b */                   INC.zpg ("tempf2+1_005d");    // increment number exponent count
/* be2d */                   BNE.rel ("_be0b");            // go test again, branch always
                                                           // now we have just the digits to do
/* be2f */        _`_be2f`;  JSR.abs ("faddh_b849");       // add 0.5 to FAC1 (round FAC1)
/* be32 */        _`_be32`;  JSR.abs ("qint_bc9b");        // convert FAC1 floating to fixed
/* be35 */                   LDX.imm (0x01);               // set default digits before dp = 1
/* be37 */                   LDA.zpg ("tempf2+1_005d");    // get number exponent count
/* be39 */                   CLC.imp ();                   // clear carry for add
/* be3a */                   ADC.imm (0x0a);               // up to 9 digits before point
/* be3c */                   BMI.rel ("_be47");            // if -ve then 1 digit before dp
/* be3e */                   CMP.imm (0x0b);               // A>=$0B if n>=1E9
/* be40 */                   BCS.rel ("_be48");            // branch if >= $0B
                                                           // carry is clear
/* be42 */                   ADC.imm (0xff);               // take 1 from digit count
/* be44 */                   TAX.imp ();                   // copy to X
/* be45 */                   LDA.imm (0x02);               // set exponent adjust
/* be47 */        _`_be47`;  SEC.imp ();                   // set carry for subtract
/* be48 */        _`_be48`;  SBC.imm (0x02);               // -2
/* be4a */                   STA.zpg ("tempf2+2_005e");    // save exponent adjust
/* be4c */                   STX.zpg ("tempf2+1_005d");    // save digits before dp count
/* be4e */                   TXA.imp ();                   // copy to A
/* be4f */                   BEQ.rel ("_be53");            // branch if no digits before dp
/* be51 */                   BPL.rel ("_be66");            // branch if digits before dp
/* be53 */        _`_be53`;  LDY.zpg ("fbufpt+0_0071");    // get output string index
/* be55 */                   LDA.imm (0x2e);               // character "."
/* be57 */                   INY.imp ();                   // increment index
/* be58 */                   STA.aby ("baszpt_00ff");      // save to output string
/* be5b */                   TXA.imp ();
/* be5c */                   BEQ.rel ("_be64");
/* be5e */                   LDA.imm (0x30);               // character "0"
/* be60 */                   INY.imp ();                   // increment index
/* be61 */                   STA.aby ("baszpt_00ff");      // save to output string
/* be64 */        _`_be64`;  STY.zpg ("fbufpt+0_0071");    // save output string index
/* be66 */        _`_be66`;  LDY.imm (0x00);               // clear index (point to 100,000)
/* be68 */  _`foutim_be68`;  LDX.imm (0x80);
/* be6a */        _`_be6a`;  LDA.zpg ("facho+3_0065");     // get FAC1 mantissa 4
/* be6c */                   CLC.imp ();                   // clear carry for add
/* be6d */                   ADC.aby (0xbf19);             // add byte 4, least significant
/* be70 */                   STA.zpg ("facho+3_0065");     // save FAC1 mantissa4
/* be72 */                   LDA.zpg ("facho+2_0064");     // get FAC1 mantissa 3
/* be74 */                   ADC.aby (0xbf18);             // add byte 3
/* be77 */                   STA.zpg ("facho+2_0064");     // save FAC1 mantissa3
/* be79 */                   LDA.zpg ("facho+1_0063");     // get FAC1 mantissa 2
/* be7b */                   ADC.aby (0xbf17);             // add byte 2
/* be7e */                   STA.zpg ("facho+1_0063");     // save FAC1 mantissa2
/* be80 */                   LDA.zpg ("facho+0_0062");     // get FAC1 mantissa 1
/* be82 */                   ADC.aby ("_bf16");            // add byte 1, most significant
/* be85 */                   STA.zpg ("facho+0_0062");     // save FAC1 mantissa1
/* be87 */                   INX.imp ();                   // increment the digit, set the sign on the test sense bit
/* be88 */                   BCS.rel ("_be8e");            // if the carry is set go test if the result was positive
                                                           // else the result needs to be negative
/* be8a */                   BPL.rel ("_be6a");            // not -ve so try again
/* be8c */                   BMI.rel ("_be90");            // else done so return the digit
/* be8e */        _`_be8e`;  BMI.rel ("_be6a");            // not +ve so try again
                                                           // else done so return the digit
/* be90 */        _`_be90`;  TXA.imp ();                   // copy the digit
/* be91 */                   BCC.rel ("_be97");            // if Cb=0 just use it
/* be93 */                   EOR.imm (0xff);               // else make the 2's complement ..
/* be95 */                   ADC.imm (0x0a);               // .. and subtract it from 10
/* be97 */        _`_be97`;  ADC.imm (0x2f);               // add "0"-1 to result
/* be99 */                   INY.imp ();                   // increment ..
/* be9a */                   INY.imp ();                   // .. index to..
/* be9b */                   INY.imp ();                   // .. next less ..
/* be9c */                   INY.imp ();                   // .. power of ten
/* be9d */                   STY.zpg ("varpnt+0_0047");    // save current variable pointer low byte
/* be9f */                   LDY.zpg ("fbufpt+0_0071");    // get output string index
/* bea1 */                   INY.imp ();                   // increment output string index
/* bea2 */                   TAX.imp ();                   // copy character to X
/* bea3 */                   AND.imm (0x7f);               // mask out top bit
/* bea5 */                   STA.aby ("baszpt_00ff");      // save to output string
/* bea8 */                   DEC.zpg ("tempf2+1_005d");    // decrement # of characters before the dp
/* beaa */                   BNE.rel ("_beb2");            // branch if still characters to do
                                                           // else output the point
/* beac */                   LDA.imm (0x2e);               // character "."
/* beae */                   INY.imp ();                   // increment output string index
/* beaf */                   STA.aby ("baszpt_00ff");      // save to output string
/* beb2 */        _`_beb2`;  STY.zpg ("fbufpt+0_0071");    // save output string index
/* beb4 */                   LDY.zpg ("varpnt+0_0047");    // get current variable pointer low byte
/* beb6 */                   TXA.imp ();                   // get character back
/* beb7 */                   EOR.imm (0xff);               // toggle the test sense bit
/* beb9 */                   AND.imm (0x80);               // clear the digit
/* bebb */                   TAX.imp ();                   // copy it to the new digit
/* bebc */                   CPY.imm (0x24);
                                                           // compare the table index with the max for decimal numbers
/* bebe */                   BEQ.rel ("_bec4");            // if at the max exit the digit loop
/* bec0 */                   CPY.imm (0x3c);
                                                           // compare the table index with the max for time
/* bec2 */                   BNE.rel ("_be6a");            // loop if not at the max
                                                           // now remove trailing zeroes
/* bec4 */        _`_bec4`;  LDY.zpg ("fbufpt+0_0071");    // restore the output string index
/* bec6 */        _`_bec6`;  LDA.aby ("baszpt_00ff");      // get character from output string
/* bec9 */                   DEY.imp ();                   // decrement output string index
/* beca */                   CMP.imm (0x30);               // compare with "0"
/* becc */                   BEQ.rel ("_bec6");            // loop until non "0" character found
/* bece */                   CMP.imm (0x2e);               // compare with "."
/* bed0 */                   BEQ.rel ("_bed3");            // branch if was dp
                                                           // restore last character
/* bed2 */                   INY.imp ();                   // increment output string index
/* bed3 */        _`_bed3`;  LDA.imm (0x2b);               // character "+"
/* bed5 */                   LDX.zpg ("tempf2+2_005e");    // get exponent count
/* bed7 */                   BEQ.rel ("_bf07");            // if zero go set null terminator and exit
                                                           // exponent isn't zero so write exponent
/* bed9 */                   BPL.rel ("_bee3");            // branch if exponent count +ve
/* bedb */                   LDA.imm (0x00);               // clear A
/* bedd */                   SEC.imp ();                   // set carry for subtract
/* bede */                   SBC.zpg ("tempf2+2_005e");    // subtract exponent count adjust (convert -ve to +ve)
/* bee0 */                   TAX.imp ();                   // copy exponent count to X
/* bee1 */                   LDA.imm (0x2d);               // character "-"
/* bee3 */        _`_bee3`;  STA.aby ("bad+1_0101");       // save to output string
/* bee6 */                   LDA.imm (0x45);               // character "E"
/* bee8 */                   STA.aby ("bad+0_0100");       // save exponent sign to output string
/* beeb */                   TXA.imp ();                   // get exponent count back
/* beec */                   LDX.imm (0x2f);               // one less than "0" character
/* beee */                   SEC.imp ();                   // set carry for subtract
/* beef */        _`_beef`;  INX.imp ();                   // increment 10's character
/* bef0 */                   SBC.imm (0x0a);               // subtract 10 from exponent count
/* bef2 */                   BCS.rel ("_beef");            // loop while still >= 0
/* bef4 */                   ADC.imm (0x3a);               // add character ":" ($30+$0A, result is 10 less that value)
/* bef6 */                   STA.aby ("bad+3_0103");       // save to output string
/* bef9 */                   TXA.imp ();                   // copy 10's character
/* befa */                   STA.aby ("bad+2_0102");       // save to output string
/* befd */                   LDA.imm (0x00);               // set null terminator
/* beff */                   STA.aby ("bad+4_0104");       // save to output string
/* bf02 */                   BEQ.rel ("_bf0c");            // go set string pointer (AY) and exit, branch always
                                                           // save last character, [EOT] and exit
/* bf04 */        _`_bf04`;  STA.aby ("baszpt_00ff");      // save last character to output string
                                                           // set null terminator and exit
/* bf07 */        _`_bf07`;  LDA.imm (0x00);               // set null terminator
/* bf09 */                   STA.aby ("bad+0_0100");       // save after last character
                                                           // set string pointer (AY) and exit
/* bf0c */        _`_bf0c`;  LDA.imm (0x00);               // set result string pointer low byte
/* bf0e */                   LDY.imm (0x01);               // set result string pointer high byte
/* bf10 */                   RTS.imp ();

// ------------------------------------------------------- // constants
/* bf11 */   _`fhalf_bf11`;  _.bytes(0x80, 0x00);          // 0.5, first two bytes
/* bf13 */                   _.bytes(0x00, 0x00, 0x00);    // null return for undefined variables
                                                           // -100 000 000
/* bf16 */        _`_bf16`;  _.bytes(0xfa, 0x0a, 0x1f, 0x00);
                                                           //  +10 000 000
/* bf1a */                   _.bytes(0x00, 0x98, 0x96, 0x80);
                                                           //   -1 000 000
/* bf1e */                   _.bytes(0xff, 0xf0, 0xbd, 0xc0);
                                                           //     +100 000
/* bf22 */                   _.bytes(0x00, 0x01, 0x86, 0xa0);
                                                           //      -10 000
/* bf26 */                   _.bytes(0xff, 0xff, 0xd8, 0xf0);
                                                           //       +1 000
/* bf2a */                   _.bytes(0x00, 0x00, 0x03, 0xe8);
                                                           //        - 100
/* bf2e */                   _.bytes(0xff, 0xff, 0xff, 0x9c);
                                                           //          +10
/* bf32 */                   _.bytes(0x00, 0x00, 0x00, 0x0a);
                                                           //           -1
/* bf36 */                   _.bytes(0xff, 0xff, 0xff, 0xff);

// ------------------------------------------------------- // jiffy counts
                                                           // -2160000    10s hours
/* bf3a */  _`fdcend_bf3a`;  _.bytes(0xff, 0xdf, 0x0a, 0x80);
                                                           //  +216000        hours
/* bf3e */                   _.bytes(0x00, 0x03, 0x4b, 0xc0);
                                                           //   -36000    10s mins
/* bf42 */                   _.bytes(0xff, 0xff, 0x73, 0x60);
                                                           //    +3600        mins
/* bf46 */                   _.bytes(0x00, 0x00, 0x0e, 0x10);
                                                           //     -600    10s secs
/* bf4a */                   _.bytes(0xff, 0xff, 0xfd, 0xa8);
                                                           //      +60        secs
/* bf4e */                   _.bytes(0x00, 0x00, 0x00, 0x3c);

// ------------------------------------------------------- // not referenced
/* bf52 */                   _.bytes(0xec);                // checksum byte

// ------------------------------------------------------- // spare bytes, not referenced
/* bf53 */                   _.bytes(0xaa, 0xaa, 0xaa, 0xaa, 0xaa);
/* bf58 */                   _.bytes(0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa);
/* bf60 */                   _.bytes(0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa);
/* bf68 */                   _.bytes(0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa);
/* bf70 */                   _.bytes(0xaa);

// ------------------------------------------------------- // perform SQR()
/* bf71 */     _`sqr_bf71`;  JSR.abs ("movaf_bc0c");       // round and copy FAC1 to FAC2
/* bf74 */                   LDA.imm (0x11);               // set 0.5 pointer low address
/* bf76 */                   LDY.imm (0xbf);               // set 0.5 pointer high address
/* bf78 */                   JSR.abs ("movfm_bba2");       // unpack memory (AY) into FAC1

// ------------------------------------------------------- // perform power function
/* bf7b */   _`fpwrt_bf7b`;  BEQ.rel ("exp_bfed");         // perform EXP()
/* bf7d */                   LDA.zpg ("argexp_0069");      // get FAC2 exponent
/* bf7f */                   BNE.rel ("_bf84");            // branch if FAC2<>0
/* bf81 */                   JMP.abs ("_b8f9");            // clear FAC1 exponent and sign and return
/* bf84 */        _`_bf84`;  LDX.imm (0x4e);               // set destination pointer low byte
/* bf86 */                   LDY.imm (0x00);               // set destination pointer high byte
/* bf88 */                   JSR.abs ("_bbd4");            // pack FAC1 into (XY)
/* bf8b */                   LDA.zpg ("argsgn_006e");      // get FAC2 sign (b7)
/* bf8d */                   BPL.rel ("_bf9e");            // branch if FAC2>0
                                                           // else FAC2 is -ve and can only be raised to an
                                                           // integer power which gives an x + j0 result
/* bf8f */                   JSR.abs ("int_bccc");         // perform INT()
/* bf92 */                   LDA.imm (0x4e);               // set source pointer low byte
/* bf94 */                   LDY.imm (0x00);               // set source pointer high byte
/* bf96 */                   JSR.abs ("fcomp_bc5b");       // compare FAC1 with (AY)
/* bf99 */                   BNE.rel ("_bf9e");            // branch if FAC1 <> (AY) to allow Function Call error
                                                           // this will leave FAC1 -ve and cause a Function Call
                                                           // error when LOG() is called
/* bf9b */                   TYA.imp ();                   // clear sign b7
/* bf9c */                   LDY.zpg ("charac_0007");      // get FAC1 mantissa 4 from INT() function as sign in
                                                           // Y for possible later negation, b0 only needed
/* bf9e */        _`_bf9e`;  JSR.abs ("_bbfe");            // save FAC1 sign and copy ABS(FAC2) to FAC1
/* bfa1 */                   TYA.imp ();                   // copy sign back ..
/* bfa2 */                   PHA.imp ();                   // .. and save it
/* bfa3 */                   JSR.abs ("log_b9ea");         // perform LOG()
/* bfa6 */                   LDA.imm (0x4e);               // set pointer low byte
/* bfa8 */                   LDY.imm (0x00);               // set pointer high byte
/* bfaa */                   JSR.abs ("fmult_ba28");       // do convert AY, FCA1*(AY)
/* bfad */                   JSR.abs ("exp_bfed");         // perform EXP()
/* bfb0 */                   PLA.imp ();                   // pull sign from stack
/* bfb1 */                   LSR.acc ();                   // b0 is to be tested
/* bfb2 */                   BCC.rel ("_bfbe");            // if no bit then exit
                                                           // do - FAC1
/* bfb4 */   _`negop_bfb4`;  LDA.zpg ("facexp_0061");      // get FAC1 exponent
/* bfb6 */                   BEQ.rel ("_bfbe");            // exit if FAC1_e = $00
/* bfb8 */                   LDA.zpg ("facsgn_0066");      // get FAC1 sign (b7)
/* bfba */                   EOR.imm (0xff);               // complement it
/* bfbc */                   STA.zpg ("facsgn_0066");      // save FAC1 sign (b7)
/* bfbe */        _`_bfbe`;  RTS.imp ();

// ------------------------------------------------------- // exp(n) constant and series
                                                           // 1.44269504 = 1/LOG(2)
/* bfbf */  _`logeb2_bfbf`;  _.bytes(0x81, 0x38, 0xaa, 0x3b, 0x29);
/* bfc4 */                   _.bytes(0x07);                // series count
                                                           // 2.14987637E-5
/* bfc5 */                   _.bytes(0x71, 0x34, 0x58, 0x3e, 0x56);
                                                           // 1.43523140E-4
/* bfca */                   _.bytes(0x74, 0x16, 0x7e, 0xb3, 0x1b);
                                                           // 1.34226348E-3
/* bfcf */                   _.bytes(0x77, 0x2f, 0xee, 0xe3, 0x85);
                                                           // 9.61401701E-3
/* bfd4 */                   _.bytes(0x7a, 0x1d, 0x84, 0x1c, 0x2a);
                                                           // 5.55051269E-2
/* bfd9 */                   _.bytes(0x7c, 0x63, 0x59, 0x58, 0x0a);
                                                           // 2.40226385E-1
/* bfde */                   _.bytes(0x7e, 0x75, 0xfd, 0xe7, 0xc6);
                                                           // 6.93147186E-1
/* bfe3 */                   _.bytes(0x80, 0x31, 0x72, 0x18, 0x10);
                                                           // 1.00000000
/* bfe8 */                   _.bytes(0x81, 0x00, 0x00, 0x00, 0x00);

// ------------------------------------------------------- // perform EXP()
/* bfed */     _`exp_bfed`;  LDA.imm (0xbf);               // set 1.443 pointer low byte
/* bfef */                   LDY.imm (0xbf);               // set 1.443 pointer high byte
/* bff1 */                   JSR.abs ("fmult_ba28");       // do convert AY, FCA1*(AY)
/* bff4 */                   LDA.zpg ("facov_0070");       // get FAC1 rounding byte
/* bff6 */                   ADC.imm (0x50);               // +$50/$100
/* bff8 */                   BCC.rel ("_bffd");            // skip rounding if no carry
/* bffa */                   JSR.abs ("_bc23");            // round FAC1 (no check)
/* bffd */        _`_bffd`;  JMP.abs ("(exp_e000");        // continue EXP()

  }
);
