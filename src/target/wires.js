/*
   wires: provides a system for interconnecting the hardware devices

   wires is the one part of the system that the bringup process guarantees is
   in place when the hardware devices attach, and those devices generally
   should use wires as a means to talk to each other, rather than accessing
   other devices' entries in the c64 structure directly.

   Wires simulates literal wires, like the IRQ and NMI lines, which can be
   driven from multiple sources, but arrive at the CPU as a wired-OR single
   value. It provides bus accesses, simulating the memory-mapping PLA that's
   driven by the processor port, and connecting the Vic to RAM or character
   ROM using the Vic bank output from CIA2 port A. It also simulates the
   processor port, which is really part of the CPU, but it was convenient to
   move it here since it's accessed through MMIO like the hardware devices.

   Contrary to what the name implies, wires does maintain state: it needs this
   for the processor port, but it also caches values that could be derived from
   other sources, like the interrupt lines and Vic bank.
*/

// References:
// Super helpful memory map: https://sta.c64.org/cbm64mem.html

import { vetAddress } from "../debug";
import {
  addToSerializerRegistry,
  functionToReference,
  referenceToFunction,
} from "../tools/serializerSupport";

// Configured by attach
let c64;
let basic, character, kernal;
let readRam, writeRam, vicReadRam;

let state;

export function attach(nascentC64) {
  c64 = nascentC64;

  basic      = c64.rom.basic;
  kernal     = c64.rom.kernal;
  character  = c64.rom.character;
  readRam    = c64.ram.readRam;
  writeRam   = c64.ram.writeRam;
  vicReadRam = c64.ram.vicReadRam;

  addToSerializerRegistry({
    readRam,
    writeRam,
  });

  reset();

  c64.wires = {
    // Control
    reset,
    serialize,
    deserialize,
    // State
    state,
    // Wires
    cpuRead,
    cpuWrite,
    vicRead,
    getIrq,
    getNmi,
    setVicIrq,
    setCia1Irq,
    setCia2Nmi,
    setVicBank,
    raiseTapeInterrupt,
  };
}

function reset() {
  state = {
    // Interrupt inputs
    // (use setVicIrq, setCia1Irq, setCia2Nmi to set them)
    irq_vic:  false,
    irq_cia1: false,
    nmi_cia2: false,

    // Interrupt outputs
    irq: false,
    nmi: false,

    // Processor port
    port:          0x37,
    portLastWrite: 0x37,
    portDirection: 0x2f,

    // CPU memory map
    // (as determined by the processor port)
    readAxxx: readAxxxBasic,
    readDxxx: readDxxxIo,
    readExxx: readExxxKernal,

    writeAxxx: writeRam,
    writeDxxx: writeDxxxIo,
    writeExxx: writeRam,

    // VIC memory map
    // (from CIA2, translated to a pointer. Use setVicBank to set)
    vicBankBase: 0x0000,

    // Tape
    lastTapeMotor: false,
  };

  mapMemoryFromPortOutput();
}

function readAxxxBasic     (addr) { return     basic[addr - 0xa000]; }
function readDxxxCharacter (addr) { return character[addr - 0xd000]; }
function readExxxKernal    (addr) { return    kernal[addr - 0xe000]; }

function reevaluateIrq() {
  state.irq = state.irq_vic || state.irq_cia1;
}

function reevaluateNmi() {
  // TODO: there are other sources. RESTORE key is one. Any others?
  state.nmi = state.nmi_cia2;
}

function getIrq() { return state.irq; }
function getNmi() { return state.nmi; }

function setVicIrq(status)  { state.irq_vic  = status; reevaluateIrq(); }
function setCia1Irq(status) { state.irq_cia1 = status; reevaluateIrq(); }
function setCia2Nmi(status) { state.nmi_cia2 = status; reevaluateNmi(); }

function setVicBank(bankNumber) {
  state.vicBankBase = bankNumber * 0x4000;
}

function vicRead(addr) {
  const { vicBankBase } = state;

  // We're translating to get character RAM here. I'm guessing that
  // all VIC reads to those addresses within its bank get the character
  // ROM, not just character reads.

  if ((vicBankBase === 0x0000) || (vicBankBase === 0x8000)) {
    if ((addr >= 0x1000) && (addr < 0x2000)) {
      return character[addr - 0x1000];
    }
  }

  return vicReadRam(vicBankBase + addr);
}

function cpuRead(addr) {
  vetAddress(addr);

  function realRead() {

    if ((addr === 0))                         return readPortDirection();
    if ((addr === 1))                         return readPort();

    if ((addr >= 0xa000) && (addr <= 0xbfff)) return state.readAxxx(addr);
    if ((addr >= 0xd000) && (addr <= 0xdfff)) return state.readDxxx(addr);
    if ((addr >= 0xe000) && (addr <= 0xffff)) return state.readExxx(addr);

    return readRam(addr);
  }

  const ret = realRead();

  if (!((ret >= 0) && (ret <= 255))) {
    debugger;
    throw new Error("Bus read got bad value for addr = " + addr);
  }

  return ret;
}

function readPortDirection() {
  return state.portDirection;
}

function readPort() {
  // TODO: what happens if a port input line is set to read/
  // write? If we read its value do we now get the last bit we tried to write
  // to it? I guess the CPU output would be fighting the external device
  // driving it.
 
  return state.port;
}

function getFloatingValue() {
  // datasette buttons: port shows 1 if nothing pressed
  const t = c64.tape.isAnyButtonPressed() ? 0 : 1;

  return (
    (0 << 7) |    // Not part of port. TODO: check value on real hardware
    (0 << 6) |    // Not part of port. TODO: check value on real hardware
    (1 << 5) |    // Datasette motor off
    (t << 4) |    // Datasette buttons (0 = something's pressed)
    (0 << 3) |    // Datasette output
    (1 << 2) |    // Memory config.
    (1 << 1) |    // Memory config.
    (1 << 0)      // Memory config.
  );
}

function writePortDirection(byte) {
  state.portDirection = byte;

  // Port lines that were read/write and are now read will now float to
  // wherever they're tied.

  state.port = (
    (state.portLastWrite & state.portDirection) |
    (getFloatingValue() & ~state.portDirection)
  );

  mapMemoryFromPortOutput();
}

function writePort(byte) {
  state.portLastWrite = byte;

  // Which lines are tied low/high. TODO: research this. The bank lines seem
  // to be tied high (or Buggy Boy and Hero of the Golden Talisman fail),

  // a 1 in a bit of portDirection means that bit can be written to
  state.port = (
    (byte               &  state.portDirection) |
    (getFloatingValue() & ~state.portDirection)
  );

  const tapeMotor = !(state.port & 0b00100000);
  if (tapeMotor !== state.lastTapeMotor) {
    state.lastTapeMotor = tapeMotor;
    c64.tape.setTapeMotor(tapeMotor);
  }

  mapMemoryFromPortOutput();
}

function mapMemoryFromPortOutput() {
  // The outgoing port value having changed, reconfigure the mappings accordingly

  const bank = state.port & 0b111;

  // TODO: I'm not _at all_ confident about these.
  // from https://sta.c64.org/cbm64mem.html
  ({
    0b000: () => {  state .readAxxx = readRam;
                    state .readDxxx = readRam;
                    state .readExxx = readRam;
                    state.writeAxxx = writeRam;
                    state.writeDxxx = writeRam;
                    state.writeExxx = writeRam;
    },
    0b001: () => {  state .readAxxx = readRam;
                    state .readDxxx = readDxxxCharacter;
                    state .readExxx = readRam;
                    state.writeAxxx = writeRam;
                    state.writeDxxx = writeRam;
                    state.writeExxx = writeRam;
    },
    0b010: () => {  state .readAxxx = readRam;
                    state .readDxxx = readDxxxCharacter;
                    state .readExxx = readExxxKernal;
                    state.writeAxxx = writeRam;
                    state.writeDxxx = writeRam;
                    state.writeExxx = writeRam;
    },
    0b011: () => {  state .readAxxx = readAxxxBasic;
                    state .readDxxx = readDxxxCharacter;
                    state .readExxx = readExxxKernal;
                    state.writeAxxx = writeRam;
                    state.writeDxxx = writeRam;
                    state.writeExxx = writeRam;
    },
    0b100: () => {  state .readAxxx = readRam;
                    state .readDxxx = readRam;
                    state .readExxx = readRam;
                    state.writeAxxx = writeRam;
                    state.writeDxxx = writeRam;
                    state.writeExxx = writeRam;
    },
    0b101: () => {  state .readAxxx = readRam;
                    state .readDxxx = readDxxxIo;
                    state .readExxx = readRam;
                    state.writeAxxx = writeRam;
                    state.writeDxxx = writeDxxxIo;
                    state.writeExxx = writeRam;
    },
    0b110: () => {  state .readAxxx = readRam;
                    state .readDxxx = readDxxxIo;
                    state .readExxx = readExxxKernal;
                    state.writeAxxx = writeRam;
                    state.writeDxxx = writeDxxxIo;
                    state.writeExxx = writeRam;
    },
    0b111: () => {  state .readAxxx = readAxxxBasic;
                    state .readDxxx = readDxxxIo;
                    state .readExxx = readExxxKernal;
                    state.writeAxxx = writeRam;
                    state.writeDxxx = writeDxxxIo;
                    state.writeExxx = writeRam;
    },
  })[bank]();
}

function cpuWrite(addr, byte) {
  vetAddress(addr);

  if ((addr === 0))                         return writePortDirection(byte);
  if ((addr === 1))                         return writePort(byte);

  if ((addr >= 0xa000) && (addr <= 0xbfff)) return state.writeAxxx(addr, byte);
  if ((addr >= 0xd000) && (addr <= 0xdfff)) return state.writeDxxx(addr, byte);
  if ((addr >= 0xe000) && (addr <= 0xffff)) return state.writeExxx(addr, byte);

                                            return writeRam(addr, byte);
}

function readDxxxIo(addr) {

  // VIC registers
  if ((addr >= 0xd000) && (addr <= 0xd3ff)) return c64.vic.read_d000_d3ff(addr);
  // SID
  if ((addr >= 0xd400) && (addr <= 0xd7ff)) return c64.sid.read_d400_d7ff(addr);
  // Color RAM
  if ((addr >= 0xd800) && (addr <= 0xdbff)) return c64.vic.read_d800_dbff(addr);
  // CIA1
  if ((addr >= 0xdc00) && (addr <= 0xdcff)) return c64.cias.read_dc00_dcff(addr);
  // CIA2
  if ((addr >= 0xdd00) && (addr <= 0xddff)) return c64.cias.read_dd00_ddff(addr);

  // $de00 - $dfff are for memory-mapped IO of any other devices you've plugged
  // into the bus. Consider them unmapped; a vanilla C64 just shows noise here.
  return 0xff;
}

function writeDxxxIo(addr, byte) {

  // VIC registers
  if ((addr >= 0xd000) && (addr <= 0xd3ff)) return c64.vic.write_d000_d3ff(addr, byte);
  // SID
  if ((addr >= 0xd400) && (addr <= 0xd7ff)) return c64.sid.write_d400_d7ff(addr, byte);
  // Color RAM
  if ((addr >= 0xd800) && (addr <= 0xdbff)) return c64.vic.write_d800_dbff(addr, byte);
  // CIA1
  if ((addr >= 0xdc00) && (addr <= 0xdcff)) return c64.cias.write_dc00_dcff(addr, byte);
  // CIA2
  if ((addr >= 0xdd00) && (addr <= 0xddff)) return c64.cias.write_dd00_ddff(addr, byte);

  // $de00 - $dfff are for memory-mapped IO of any other devices you've plugged
  // into the bus. Consider them unmapped.
  return;
}

function serialize() {
  return JSON.stringify({
    ...state,
    readAxxx:  functionToReference(state.readAxxx),
    readDxxx:  functionToReference(state.readDxxx),
    readExxx:  functionToReference(state.readExxx),
    writeAxxx: functionToReference(state.writeAxxx),
    writeDxxx: functionToReference(state.writeDxxx),
    writeExxx: functionToReference(state.writeExxx),
  });
}

function deserialize(json) {
  state = JSON.parse(json);

  state.readAxxx  = referenceToFunction(state.readAxxx);
  state.readDxxx  = referenceToFunction(state.readDxxx);
  state.readExxx  = referenceToFunction(state.readExxx);
  state.writeAxxx = referenceToFunction(state.writeAxxx);
  state.writeDxxx = referenceToFunction(state.writeDxxx);
  state.writeExxx = referenceToFunction(state.writeExxx);
}

function raiseTapeInterrupt() {
  c64.cias.raiseTapeInterrupt();
}

addToSerializerRegistry({
  readAxxxBasic,
  readDxxxCharacter,
  readExxxKernal,
  readDxxxIo,
  writeDxxxIo,
});
