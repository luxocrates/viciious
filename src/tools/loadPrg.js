/*
   A tool for injecting PRG files (C64 programs) into memory.

   The file format is super-simple: it's just the load address (in lowbyte/
   highbyte form) followed by an arbitrary sequence of bytes to store there.
   But there's a little more manipulation required than just blasting them in.
   (TODO: ...that's based on guesswork, looking at obvious pointers in the
   memory map and seeing what works. I should stufy the Kernal's file loader at
   some point to see if there's anything else.)
*/

import { makeParser } from "../tools/parser";

const parsePrg = makeParser((_) => ({
  org:     _.word_le(),
  program: _.remainder(),
}));

export function loadPrg(c64, bytes) {
  const {wires: {cpuRead, cpuWrite}} = c64;

  const { org, program } = parsePrg(bytes);

  if (org !== 0x0801) {
    console.warn("Expecting PRGs to be loaded to $0801");
  }

  // Make a record of the current memory map configuation
  const dir  = cpuRead(0);
  const port = cpuRead(1);

  // Set the memory map to all-RAM. In other words, page out the MMIO, in case
  // the PRG's really big.
  cpuWrite(0, 0b111);
  cpuWrite(1, 0);

  // Perform the main write
  for (let i = 0; i < program.length; i++) cpuWrite(org + i, program[i]);

  // Having loaded the program into memory, we need to move the pointers to
  // Basic's variable regions to right after the program. Normally the Kernal's
  // loader would do this (and maybe we should be relying on that to load in
  // PRGs instead). If it's not done, Basic programs won't work, as the space
  // they'll allocate for the variables will overwrite the start of the program
  // itself.
  const endOfBasicPrg = 0x0801 + program.length;

  const hi = endOfBasicPrg >> 8;
  const lo = endOfBasicPrg & 0xff;

  cpuWrite(0x2d, lo); // pointer to beginning of variable area, low-byte
  cpuWrite(0x2e, hi); // pointer to beginning of variable area, high-byte

  cpuWrite(0x2f, lo); // pointer to beginning of array variable area, low-byte
  cpuWrite(0x30, hi); // pointer to beginning of array variable area, high-byte

  cpuWrite(0x31, lo); // pointer to end of array variable area, low-byte
  cpuWrite(0x32, hi); // pointer to end of array variable area, high-byte

  // Restore the CPU port, to return the memory mapping to what it was
  cpuWrite(0, dir);
  cpuWrite(1, port);
}
