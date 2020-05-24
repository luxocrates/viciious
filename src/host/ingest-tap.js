import { makeParser } from "../tools/parser";
import { AWAIT_KEYBOARD_PC } from "../tools/romLocations"; 


// Format references:
//    http://wav-prg.sourceforge.net/tape.html
//    http://unusedino.de/ec64/technical/formats/tap.html

const parseTap = makeParser((_) => ({
  header:   _.string(20),
  contents: _.remainder(),
}));

export async function ingest_tap(c64, bytes) {

  const struct = parseTap(bytes);

  validate(struct);

  c64.runloop.reset();
  await c64.runloop.untilPc(AWAIT_KEYBOARD_PC);

  c64.tape.setImage(bytes.slice(20));

  c64.runloop.type("LOAD\r");
  c64.runloop.run();
  c64.tape.pressPlay();
}

function validate(struct) {
  // In my experience, headers are always
  //    "C64-TAPE-RAW"
  // or "C64-TAPE-RAW\u0001"

  if (struct.header.indexOf("C64-TAPE-RAW") !== 0) {
    console.warn(
      "Expected to find 'C64-TAPE-RAW' in header, but got:",
      struct.header
    );
  }
}
