/*
   ram: emulates 64KiB of byte-addressed RAM
*/

import { base64Encode, base64Decode } from "../tools/base64";

// bound by attach
let c64;

const state = new Uint8Array(65536);

export function attach(nascentC64) {
  c64 = nascentC64;

  nascentC64.ram = {
    // Control
    reset,
    serialize,
    deserialize,
    // Accessors
    readRam,
    writeRam,
    vicReadRam,
  };

  reset();
}

function reset() {
  // Initialize RAM with 0xdeadbeef. Not to help our own debugging, but to
  // simulate static noise. Some games, like Dominator's tape loader, look for
  // a constant value in memory as a sign that you're trying to hack them, and
  // will crash if they detect one.
  for (let i = 0; i < 65536; i += 4) {
    state[i + 0] = 0xde;
    state[i + 1] = 0xad;
    state[i + 2] = 0xbe;
    state[i + 3] = 0xef;
  }
}

function serialize() {
  return base64Encode(state);
}

function deserialize(base64) {
  const bytes = base64Decode(base64);
  for (let i in bytes) {
    state[i] = bytes[i];
  }
}

function readRam(addr) {
  if (c64.hooks.onRamRead) c64.hooks.onRamRead(addr);
  return state[addr];
}

function vicReadRam(addr) {
  if (c64.hooks.onVicRead) c64.hooks.onVicRead(addr);
  return state[addr];
}

function writeRam(addr, byte) {
  if (c64.hooks.onRamWrite) c64.hooks.onRamWrite(addr, byte);
  state[addr] = byte;
}
