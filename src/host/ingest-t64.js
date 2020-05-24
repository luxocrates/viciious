import { makeParser }        from "../tools/parser";
import { loadPrg }           from "../tools/loadPrg";
import { AWAIT_KEYBOARD_PC } from "../tools/romLocations"; 


// Format references:
//    http://unusedino.de/ec64/technical/formats/t64.html
//    https://vice-emu.sourceforge.io/vice_16.html

const parseHeader = makeParser((_) => ({
  desc:        _.string(32),
  version:     _.word_le(),
  entries:     _.word_le(),
  usedEntries: _.word_le(),
  _:           _.skip(2),
  userDesc:    _.string(24),

  // The below should have its own separate structure, as theoretically
  // there's a sequence of multiple instances of it
  entryType:   _.byte(),
  fileType:    _.byte(),
  startAddr:   _.word_le(),
  endAddr:     _.word_le(),
  _:           _.skip(2),
  start:       _.long_le(),
  _:           _.skip(4),
  filename:    _.string(16),
}));

export async function ingest_t64(c64, bytes) {
  let header;
  
  try {
    header = parseHeader(bytes);
  }
  catch (e) {
    console.error("Unexpect early end to file");
  }

  validate(header);

  const prg = [
    header.startAddr & 0xff,
    header.startAddr >> 8,
    ...bytes.slice(header.start)
  ];

  c64.runloop.reset();
  await c64.runloop.untilPc(AWAIT_KEYBOARD_PC);

  loadPrg(c64, prg);

  c64.runloop.type("RUN\r");
  c64.runloop.run();
}

function validate(header) {
  // General policy is that we'll waive as much as we possibly can with
  // warnings, and only error if we absolutely can't load the file

  const warn = console.warn;

  if (header.usedEntries !== 1) {
    // I've seen an otherwise working .t64 report zero used entries, so waive
    // what you'd think would be a breaking case.
    warn(`.t64 file has ${header.usedEntries} used entries. One was expected.`);
  }

  if (header.startAddr !== 0x0801) {
    warn(".t64 file start address isn't $0801");
  }

  // We ignore the end addr

  if (header.entryType !== 1) {
    warn(`.t64 error: only entry type 1 supported (got ${header.entryType})`);
  }

  // Should try warn if the file size doesn't match what we'd expect from the
  // header, though this happens commonly for files that otherwise work.
}
