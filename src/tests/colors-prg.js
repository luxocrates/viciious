// A .prg that shows the system color palette
//
// Colors are arranged in a 32x16 grid which guarantees that, per row, no color
// is shown next to itself. It's handy for verifying that the entries of the
// desaturated palette (for debug) are all distinguishable.

import { assemble } from "../tools/assembler";
import { CLEAR_SCREEN_PC } from "../tools/romLocations";

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
        JSR.abs (CLEAR_SCREEN_PC);
        LDA.imm (160);                        // 128+32: inverse-space

        // Center the block, just for aesthetics
        const xNudge = (40 - (2 * 15)) / 2;
        const yNudge = Math.floor((25 - 16) / 2);

        for (let yCol = 0; yCol < 16; yCol++) {

          let offset = ((yCol + yNudge) * 40) + xNudge;
          for (let xCol = 0; xCol < 16; xCol++) {

            // Don't show a color next to iself
            if (xCol === yCol) continue;

            // First column of pair: y color
            STA.abs (0x400 + offset);         // solid square to char RAM
            LDX.imm (yCol);
            STX.abs (0xd800 + offset);        // color code to color RAM
            offset++;

            // First column of pair: x color
            STA.abs (0x400 + offset);         // solid square to char RAM
            LDX.imm (xCol);
            STX.abs (0xd800 + offset);        // color code to color RAM
            offset++;
          }
        }

      _`loop`;
          JMP.abs ("loop");
    }
  )
];
