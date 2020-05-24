/*
   skipRamTest - exports a patched Kernal that skips the RAM test on boot, just
   to speed up the dev builds.
*/

import { assemble } from "../../tools/assembler";
import kernal       from "./kernal";

const KERNAL_START = 0xe000;
const PATCH_START  = 0xfd67;

const patch = assemble(
  PATCH_START,
  ({ LDA, STA, JMP, _ }) => {

    _.label(0xa000, "memtop");

    LDA.imm (_.l`memtop`);
    STA.abs (0x283);        // store memory top low byte
    LDA.imm (_.h`memtop`);
    STA.abs (0x284);        // store memory top low byte
    JMP.abs (0xfd90);       // first instruction after RAM test
  }
);

const patchedKernal = [...kernal];

for (let i = 0; i < patch.length; i++) {
  patchedKernal[i + PATCH_START - KERNAL_START] = patch[i];
}

export default patchedKernal;
