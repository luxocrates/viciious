/*
  makeParser turns schema functions into parsers that can turn byte arrays to
  structures.

  ...meaning that you can create a parser with:

            const myParser = makeParser((_) => ({
              desc:    _.string(32),
              version: _.byte(),
              _:       _.skip(2),
              start:   _.word_le(),
              length:  _.long_le(),
            };

  ...then call it with:

            const myStruct = myParser([.., .., ..]);

  ...to get:

            {
              desc:    "...",
              version: 4,
              start:   12,
              length:  1048576,
            }

  ...or an exception if data overflows.

  Note that you'll have to be explicit about the byte ordering of words
  (16-bit) and longs (32-bit): use suffix _be for big endian and _le for
  little-endian.
*/

export function makeParser(fn) {
  return (bytes) => {

    let offset = 0;
    function nextByte() {
      if (offset >= bytes.length) {
        throw new Error("Reading past the end of data");
      }
      return bytes[offset++];
    } 

    function remainder() {
      const ret = bytes.slice(offset);
      offset = bytes.length - 1;
      return ret;
    }

    return fn({
      byte:      () => byte(nextByte),
      word_be:   () => word_be(nextByte),
      word_le:   () => word_le(nextByte),
      long_be:   () => long_be(nextByte),
      long_le:   () => long_le(nextByte),
      skip:      (length) => skip(nextByte, length),
      string:    (length) => string(nextByte, length),
      remainder,
    });
  };
}

function byte(nextByte) {
  return nextByte();
}

function word_le(nextByte) {
  return nextByte() | (nextByte() << 8);
}

function word_be(nextByte) {
  return (nextByte() << 8) | nextByte();
}

function long_le(nextByte) {
  return (
    (nextByte() << 0)  ||
    (nextByte() << 8)  ||
    (nextByte() << 16) ||
    (nextByte() << 24)
  );
}

function long_be(nextByte) {
  return (
    (nextByte() << 24)  ||
    (nextByte() << 16)  ||
    (nextByte() << 8)   ||
    (nextByte() << 0)
  );
}

function skip(nextByte, length) {
  for (let i = 0; i < length; i++) nextByte();
}

function string(nextByte, length) {
  let ret = "";
  let ended = false;

  for (let offset = 0; offset < length; offset++) {
    const byte = nextByte();
    if (ended) continue;
    if (!byte) ended = true;
    else ret += String.fromCharCode(byte);
  }

  return ret.trim();
}
