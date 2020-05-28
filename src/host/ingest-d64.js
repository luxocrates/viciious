import { makeParser }        from "../tools/parser";
import { loadPrg }           from "../tools/loadPrg";
import { AWAIT_KEYBOARD_PC } from "../tools/romLocations"; 


// Format reference:
// †1 http://unusedino.de/ec64/technical/formats/d64.html

const parseDirSector = makeParser((_) => {

  const entry = (_) => ({
    nextTrack:     _.byte(),
    nextSector:    _.byte(),
    type:          _.byte(),
    track:         _.byte(),
    sector:        _.byte(),
    name:          _.string(16),
    sideSecTrack:  _.byte(),
    sideSecSector: _.byte(),
    relLength:     _.byte(),
    _:             _.skip(6),
    blocks:        _.word_le(),
  });

  return new Array(8)
    .fill()
    .map(() => entry(_))
  ;
});

const parseFileSector = makeParser((_) => ({
  nextTrack:  _.byte(),
  nextSector: _.byte(),
  bytes:      _.remainder(),
}));


export async function ingest_d64(c64, bytes) {

  if (!c64.hooks.onD64Ingest) {
    throw new Error("Can’t show .d64 directories with this frontend");
  }

  const dir = loadDir(bytes);

  // d64 ingestor hook: give it a directory; it'll present a dialog for picking
  // which PRG to load, and return a promise which resolves to an entry from
  // the directory. That entry contains a track/sector, which defined the start
  // of the PRG.
  //
  // (TODO: right now, if you close the dialog, the promise just sits
  // unresolved forever. Better if it resolved to, or threw, null)
  const { track, sector } = await c64.hooks.onD64Ingest(dir);

  // Follow the track/sector links to pull in all the bytes
  const prg = loadFile(bytes, track, sector);

  // ...then boot it in the usual way.
  c64.runloop.reset();
  await c64.runloop.untilPc(AWAIT_KEYBOARD_PC);
  loadPrg(c64, prg);
  c64.runloop.type("RUN\r");
  c64.runloop.run();
}

function calcAbsSector(track, sector) {
  // Note: by convention, `track` is one-indexed; `sector` is zero-indexed.
  // We could do a sanity check that sector isn't too big a number for that
  // track.
  if ((track < 1) || (track > 40)) {
    throw new Error("Track out of range: " + track);
  }

  // Convert `sector` from being track-relative to absolute
  while (--track) {
    if      (track >= 31) sector += 17;
    else if (track >= 25) sector += 18;
    else if (track >= 18) sector += 19;
    else                  sector += 21;
  }

  return sector;
}

function loadAbsSector(d64, absSector) {
  const d64Offset = absSector * 256;
  return d64.slice(d64Offset, d64Offset + 256);
}

function getLoadTrackSectorWithRecurCheck(d64) {
  // Returns a function that will return a sector's bytes, given a track/sector
  // location, and will throw if the same absolute sector is requested twice.
  const seenAbsSectors = new Set();  

  return (track, sector) => {
    const absSector = calcAbsSector(track, sector);

    if (seenAbsSectors.has(absSector)) {
      throw new Error("Chain of disk sector links contains a loop");
    }

    seenAbsSectors.add(absSector);
    return loadAbsSector(d64, absSector);
  }
}

function loadDir(d64) {

  // Directory listing starts at 18/1 (even if 18/0 points elsewhere)
  let track = 18;
  let sector = 1;

  let entries = [];
  const loadTrackSector = getLoadTrackSectorWithRecurCheck(d64);

  while (track) {

    const newEntries = parseDirSector(
      loadTrackSector(track, sector)
    );

    entries = [
      ...entries,
      ...newEntries,
    ];

    track  = newEntries[0].nextTrack;
    sector = newEntries[0].nextSector;
  }

  return entries
    .map(
      (entry) => {
        const { type, ...ret } = entry;

        ret.type = [
          "DEL",
          "SEQ",
          "PRG",
          "USR",
          "REL",
        ][entry.type & 0b111];

        ret.locked = Boolean(entry.type & (1 << 6));
        ret.closed = Boolean(entry.type & (1 << 7));

        return ret;
      }
    )
    .filter(
      // I think this is right? DEL's don't show up in the "$"?
      ({ type }) => (type !== "DEL")
    )
  ;
}

function loadFile(d64, track, sector) {
  let ret = [];
  const loadTrackSector = getLoadTrackSectorWithRecurCheck(d64);

  while (track) {

    const sec = parseFileSector(
      loadTrackSector(track, sector)
    );

    if (!sec.nextTrack) {
      // If the nextTrack value is zero, then nextSector reveals how much of
      // this sector contains file data. †1 implies that if nextSector has a
      // value of 4, then, bearing in mind that the next link's track/sector
      // values are in bytes 0 and 1 respectively, the file data would be in
      // bytes 2, 3, and 4.
      // Thus a '4' would mean a slice parameter of '5' wrt. the raw sector's
      // data, hence a slice parameter of '3' wrt. the parsed `bytes` array
      // from that sector. Hence, in general, slice until `sector` minus one.

      ret = [...ret, ...sec.bytes.slice(0, sec.nextSector - 1)];
    }
    else {
      ret = [...ret, ...sec.bytes];
    }

    track  = sec.nextTrack;
    sector = sec.nextSector;
  }

  return ret;
}
