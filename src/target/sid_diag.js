/*
   For debugging only - prints, into C64 screen memory, diagnostic info about
   what the virtual SID is doing.
*/

import {
  charToC64FontCodePoint,
  hexDigitToC64FontCodePoint
} from "../tools/c64FontCodePoints";

const    LEFT_COLUMN = 7;
const ROWS_PER_VOICE = 7;

const    FREQ_ROW = 1;
const     PWM_ROW = 1;
const CONTROL_ROW = 2;
const    ADSR_ROW = 3;
const     BAR_ROW = 5;

const  FILTER_ROW = 21;
const  VOLUME_ROW = 22;

const seq = [
  0x20,         // space
  0x65,         // 2 left
  0x61,         // even
  0x67 | 0x80,  // 2 right, inverted
];

let getRunloopState;
let cpuWrite;
let state;

function writeChar(row, col, char) {
  const offset = (row * 40) + col;

  cpuWrite( 0x400 + offset, char);
  cpuWrite(0xd800 + offset, 1);
}

function writeX(row, col, nybble) {
  writeChar(row, col, hexDigitToC64FontCodePoint[nybble]);
}

function writeXx(row, col, byte) {
  writeChar(row, col + 0, hexDigitToC64FontCodePoint[byte >> 4]);
  writeChar(row, col + 1, hexDigitToC64FontCodePoint[byte & 0xf]);
}

function writeStr(row, col, str) {
  str = str.toUpperCase();

  for (let i = 0; i < str.length; i++) {
    writeChar(row, col + i, str.charCodeAt(i) - 0x40)
  }
}

function writeBit(row, col, char, condition) {
  writeChar(row, col, charToC64FontCodePoint(char) + (condition ? 0x80 : 0));
}

function showAdsrState(voice) {
  const row = ADSR_ROW + (voice * ROWS_PER_VOICE);
  const phase = state.adsr[voice].phase;

  writeBit(row, LEFT_COLUMN - 5 + 0, "a", phase === "attack" );
  writeBit(row, LEFT_COLUMN - 5 + 1, "d", phase === "decay"  );
  writeBit(row, LEFT_COLUMN - 5 + 2, "s", phase === "sustain");
  writeBit(row, LEFT_COLUMN - 5 + 3, "r", phase === "release");

  const ad = state.regs[(voice * 7) + 5];
  const sr = state.regs[(voice * 7) + 6];

  writeX(row, LEFT_COLUMN + 0, ad >> 4);
  writeX(row, LEFT_COLUMN + 1, ad & 0xf);

  writeX(row, LEFT_COLUMN + 2, sr >> 4);
  writeX(row, LEFT_COLUMN + 3, sr & 0xf);
}

function envelopeBar(voice) {
  const row = BAR_ROW + (voice * ROWS_PER_VOICE);
  const length = Math.floor(state.adsr[voice].value * 40);

  for (let i = 0; i < 40; i++) {
    writeChar(row, i, 0x20 + (i < length ? 0x80 : 0));
  }

  const subChar = (state.adsr[voice].value * 40) - length;

  if (subChar) {
    writeChar(row, length, seq[Math.floor(subChar * seq.length)]);
  }
}

function showFreq(voice) {
  const row = FREQ_ROW + (ROWS_PER_VOICE * voice);

  writeStr(row, LEFT_COLUMN - 5, "freq");
  writeXx (row, LEFT_COLUMN + 0, state.regs[(voice * 7) + 1]);
  writeXx (row, LEFT_COLUMN + 2, state.regs[(voice * 7) + 0]);
}

function showPwm(voice) {
  const row = PWM_ROW + (ROWS_PER_VOICE * voice);

  writeStr(row,20, "pwm");
  writeXx(row, 25, state.regs[(voice * 7) + 3]);
  writeXx(row, 27, state.regs[(voice * 7) + 2]);
}

function showControl(voice) {
  const row = CONTROL_ROW + (ROWS_PER_VOICE * voice);
  const byte = state.regs[(voice * 7) + 4];

  writeStr(row, LEFT_COLUMN - 5, "ctrl");

  writeBit(row, LEFT_COLUMN + 0,  "V", byte & 0x01);
  writeBit(row, LEFT_COLUMN + 2,  "S", byte & 0x02);
  writeBit(row, LEFT_COLUMN + 3,  "R", byte & 0x04);
  writeBit(row, LEFT_COLUMN + 5,  "D", byte & 0x08);
  writeBit(row, LEFT_COLUMN + 7,  "T", byte & 0x10);
  writeBit(row, LEFT_COLUMN + 8,  "S", byte & 0x20);
  writeBit(row, LEFT_COLUMN + 9,  "R", byte & 0x40);
  writeBit(row, LEFT_COLUMN + 10, "N", byte & 0x80);
}

function showFilter() {
  const row = FILTER_ROW;
  const d417 = state.regs[0x17];
  const d418 = state.regs[0x18];

  writeStr(row, LEFT_COLUMN - 5, "fltr");

  writeBit(row, LEFT_COLUMN + 0, "1", d417 & 0x01);
  writeBit(row, LEFT_COLUMN + 1, "2", d417 & 0x02);
  writeBit(row, LEFT_COLUMN + 2, "3", d417 & 0x04);
  writeBit(row, LEFT_COLUMN + 3, "E", d417 & 0x08);

  // Resonance
  writeX(row, LEFT_COLUMN + 5, d417 >> 4);

  writeBit(row, LEFT_COLUMN + 7,  "L", d418 & 0x10);
  writeBit(row, LEFT_COLUMN + 8,  "B", d418 & 0x20);
  writeBit(row, LEFT_COLUMN + 9,  "H", d418 & 0x40);
  writeBit(row, LEFT_COLUMN + 10, "3", d418 & 0x80);
}

function showVolume() {
  const row = VOLUME_ROW;
  const d418 = state.regs[0x18];

  writeStr(row, LEFT_COLUMN - 4, "vol");
  writeX  (row, LEFT_COLUMN + 0, d418 & 0xf);
}

function showCycle() {
  const cycleStr = String(getRunloopState().cycle);

  Array.from(cycleStr).forEach(
    (digit, index) => {
      writeChar(23, 39 - cycleStr.length + index, charToC64FontCodePoint(digit));
    }
  );
}

export function diag(c64, sidState) {
  getRunloopState = c64.runloop.getState;
  cpuWrite        = c64.wires.cpuWrite;
  state           = sidState;

  // Clear the screen
  for (let i = 0; i < 1000; i++) {
    cpuWrite(0x400 + i, 0x20);
  }

  // Per-voice registers
  for (let voice = 0; voice < 3; voice++) {
    envelopeBar(voice);
    showAdsrState(voice);
    showFreq(voice);
    showPwm(voice);
    showControl(voice);
  }

  // SID-wide registers
  showFilter();
  showVolume();
  showCycle();
}
