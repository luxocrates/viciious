/*
   videoAsAnsi - given a function to read memory, creates a string, with ANSI
   escape codes for colors, that represents the display at that exact moment in
   time. Ignores sprites and bitmap mode.
*/

import { c64FontCodePointToChar } from "./c64FontCodePoints";

const WIDE_FONT = false;

const ANSI_SGR_RESET = "\x1b[0m";

// Quantizing the actual C64 colors to ANSI's 6x6x6 RGB cube results in an
// image that's washed out and over-bright. Hence this table employs quite a
// bit of artistic license.
// (There is a 24-bit mode, but my macOS terminal didn't seem to support it
// last I tried, so 216-color mode it is.)

const cols666 = [
  [0, 0, 0],  // black
  [5, 5, 5],  // white
  [2, 0, 0],  // red
  [1, 4, 4],  // cyan
  [2, 1, 3],  // purple
  [2, 3, 1],  // green
  [0, 0, 3],  // blue
  [4, 4, 2],  // yellow
  [3, 2, 0],  // orange
  [2, 1, 0],  // brown
  [4, 2, 2],  // pink
  [1, 1, 1],  // dark gray
  [2, 2, 2],  // mid gray
  [2, 4, 2],  // light green
  [1, 1, 4],  // light blue
  [3, 3, 3],  // light gray
];

export function videoAsAnsi(cpuRead) {

  let ret = "";

  // There's a few things we're ignoring here but could support:
  //
  // - display enable at $d011 (might not be helpful unless we follow
  //   the raster.)
  // - bitmap mode at $d011 (may as well tell people it's unrenderable)
  // - extended color mode

  const memorySetup = cpuRead(0xd018);
  const cia2portA   = cpuRead(0xdd00);

  const vicBank     = 3 - (cia2portA & 0b11);
  const vicBankBase = (vicBank * 0x4000);
  const charMemBase = ((memorySetup & 0b1110) >> 1) * 0x800;

  let strptr = ((memorySetup >> 4) * 0x400) + vicBankBase;
  let colptr = 0xd800;
  
  // If the VIC would be displaying the system font, in the unshifted (all-caps
  // and PETSCII) mode, then output with the unshifted character mappings. But
  // for all other cases, default to the shifted (mixed-case) font: it's
  // probably more instructive to show letters than it is to show PETSCII
  // characters that are highly unlikely to correspond to whatever's in that
  // custom font.
  let shifted = true;

  if ((vicBankBase === 0x0000) || (vicBankBase === 0x8000)) {
    if ((charMemBase >= 0x1000) && (charMemBase < 0x1800)) {
      shifted = false;
    }
  }

  let fgColCode;
  let lastFgColCode;
  let bgColCode = cpuRead(0xd021) & 0xf;

  let borderEscapeCode = escapeCodeForBgColCode(cpuRead(0xd020) & 0xf);
  let     bgEscapeCode = escapeCodeForBgColCode(bgColCode);

  let vBorderStr;
  let hBorderStr;
  let rowFrom;
  let rowTo;

  if (WIDE_FONT) {
    vBorderStr = borderEscapeCode + "".padStart(80);
    hBorderStr = borderEscapeCode + "".padStart(8);
    rowFrom = -3;
    rowTo   = 28;
  }
  else {
    vBorderStr = borderEscapeCode + "".padStart(40);
    hBorderStr = borderEscapeCode + "".padStart(4);
    rowFrom = -2;
    rowTo   = 27;
  }

  let str = "";

  for (let y = rowFrom; y < rowTo; y++) {

    if ((y < 0) || (y > 24)) {
      ret += (hBorderStr + vBorderStr + hBorderStr) + ANSI_SGR_RESET + "\n";
      continue;
    }

    str += hBorderStr;
    str += bgEscapeCode;

    for (let x = 0; x < 40; x++) {

      fgColCode = cpuRead(colptr++) & 0xf;

      if (fgColCode !== lastFgColCode) {
        lastFgColCode = fgColCode;
        str += escapeCodeForFgColCode(fgColCode);
      }

      str += c64FontCodePointToChar(cpuRead(strptr++), shifted, WIDE_FONT);
    }

    str += hBorderStr + ANSI_SGR_RESET + "\n";
    lastFgColCode = undefined; // as we reset at the end of the line

    ret += str;
    str = "";
  }

  return ret + ANSI_SGR_RESET;
}  

function c64ColCodeToAnsi666Number(colCode) {
  const [r, g, b] = cols666[colCode];
  return String((r * 36) + (g * 6) + (b * 1) + 16);
}

function escapeCodeForFgColCode(colCode) {
  return "\x1b[38;5;" + c64ColCodeToAnsi666Number(colCode) + "m";
}

function escapeCodeForBgColCode(colCode) {
  return "\x1b[48;5;" + c64ColCodeToAnsi666Number(colCode) + "m";
}
