// TODO: this belongs in tools

export const petsciiToChar = (
  /* 0x00 */ "����������������" + /* 0x10 */ "����������������" +
  /* 0x20 */" !\"#$%&'()*+,-./" + /* 0x30 */ "0123456789:;<=>?" +
  /* 0x40 */ "@abcdefghijklmno" + /* 0x50 */ "pqrstuvwxyz[£]↑←" +
  /* 0x60 */ "—ABCDEFGHIJKLMNO" + /* 0x70 */ "PQRSTUVWXYZ┼▒│▒▒" +
  /* 0x80 */ "����������������" + /* 0x90 */ "����������������" +
  /* 0xa0 */ " ▌▄▔▁▎▒▕▒▒▕├▗└┐▂" + /* 0xb0 */ "┌┴┬┤▎▍▕▔▔▃✓▖▝┘▘▚" +
  /* 0xc0 */ "─ABCDEFGHIJKLMNO" + /* 0xd0 */ "PQRSTUVWXYZ┼▒│▒▒" +
  /* 0xe0 */ " ▌▄▔▁▎▒▕▒▒▕├▗└┐▂" + /* 0xf0 */ "┌┴┬┤▎▍▕▔▔▃✓▖▝┘▘▒"
);

function toHexStr(val, digits=2) {
  return val.toString(16).padStart(digits, "0");
}

export const xx   = val => toHexStr(val, 2);
export const xxxx = val => toHexStr(val, 4);

export const $xx   = val => `\$${xx(val)}`;
export const $xxxx = val => `\$${xxxx(val)}`;

export function vetAddress(addr) {
  if (
    (addr !== addr) // is NaN?
    || (typeof addr !== "number")
    || (addr !== Math.floor(addr))
    || (addr < 0)
    || (addr > 0xffff)
  ) {
    throw new Error(`Invalid bus address: ${addr}`);
  }
}

const encounteredWarnings = new Set();

export function unimplementedWarning(problem, details) {

  // Remove this to show warnings when the target software tries exercising
  // unimplemented hardware functionality, but you'll see lots of false
  // positives.
  return;

  if (encounteredWarnings.has(problem)) return;
  
  console.warn("Unimplemented:", problem);
  if (details) console.log(details);

  encounteredWarnings.add(problem);
}
