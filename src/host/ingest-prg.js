import { loadPrg } from "../tools/loadPrg";
import { AWAIT_KEYBOARD_PC } from "../tools/romLocations"; 


export async function ingest_prg(c64, bytes) {
  c64.runloop.reset();
  await c64.runloop.untilPc(AWAIT_KEYBOARD_PC);

  loadPrg(c64, bytes);

  c64.runloop.type("RUN\r");
  c64.runloop.run();
}
