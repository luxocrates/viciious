// A .prg that shows the time-of-day clock counting

import { assemble } from "../tools/assembler";
import {
  CLEAR_SCREEN_PC,
  CURSOR_COL_ADDR
} from "../tools/romLocations";

export default [
  0x01, 0x008, 
  ...assemble(
    0x0801,
    ({
      NOP, LDA, LDX, LDY, STA, STX, STY, CLC, CLD, CLI, CLV, SEC, SED, SEI, 
      TAX, TAY, TSX, TXA, TXS, TYA, CMP, CPX, CPY, BCS, BCC, BEQ, BNE, BMI,
      BPL, BVS, BVC, BIT, JSR, RTS, RTI, BRK, JMP, INC, DEC, DEX, DEY, INX,
      INY, ADC, SBC, AND, EOR, ORA, ASL, ROL, LSR, ROR, PHA, PHP, PLA, PLP,
      _
    }) => {
      
      _.basic(
        ({SYS}) => ({
          10: SYS("start"),
        })
      );

      _`start`;
        LDA.imm (1);
        STA.abs (CURSOR_COL_ADDR);
        JSR.abs (CLEAR_SCREEN_PC);

      _`loop`;

        const twoDigits = (from, to) => {
          LDX.abs (from);
          TXA.imp ();

          AND.imm (0xf0);
          LSR.acc ();
          LSR.acc ();
          LSR.acc ();
          LSR.acc ();

          ADC.imm ("0".charCodeAt(0));
          STA.abs (to);

          TXA.imp ();
          AND.imm (0xf);
          ADC.imm ("0".charCodeAt(0));
          STA.abs (to + 1);
        };

        twoDigits(0xdc0b, 0x400);   // hours
        twoDigits(0xdc0a, 0x403);   // minutes
        twoDigits(0xdc09, 0x406);   // seconds
        twoDigits(0xdc08, 0x409);   // tenths

        JMP.abs `loop`;
    }
  )
];
