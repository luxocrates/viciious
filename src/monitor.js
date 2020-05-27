import { disasm } from "./tools/disasm";
import { petsciiToChar, xx, $xx, $xxxx } from "./debug";

// Bound by attach
let c64;
let runloop;
let cli;        // TODO: ugly

export function attach(nascentC64) {
  c64 = nascentC64;
  runloop = c64.runloop;
  installCli();
}

function help() {
  console.log("Monitor commands:");
  console.log("-----------------");
  cli.forEach(i => i.help.forEach(j => console.log(j)));
  console.log("---");
}

function installCli() {
  cli = [
    {
      name: "h",
      help: [
        "h()       - help",
      ],
      fn: help
    },
    {
      name: "b",
      help: [
        "b()       - stop"
      ],
      fn: runloop.stop,
    },
    {
      name: "c",
      help: [
        "c()       - continue execution           c(0xfce2)         - execute from $fce2",
      ],
      fn: (from) => {
        if (from !== undefined) c64.cpu.getState().pc = from;
        runloop.run();
      }
    },
    {
      name: "s",
      help: [
        "s()       - single-step instruction      s(5)              - step 5 instructions",

      ],
      fn: (...args) => void singleStep(...args) // don't return the promise
    },
      {
      name: "u",
      help: [
        "u(0xe3a0) - run until PC = $e3a0         u(0xe3a0, true)   - same, as fast as possible",
      ],
      fn: untilPc
    },
    {
      name: "w",
      help: [
        "w(0x400, 0xff) - write $ff to $0400",
      ],
      fn: (addr, byte) => c64.wires.cpuWrite(addr, byte)
    },
    {
      name: "x",
      help: [
        "x(0x0400) - show hex from $400           x(0x0400, 0x1000) - show from $0400 to $1000",
      ],
      fn: (from, to) => {
        busDump(from, Math.min(to === undefined ? from + 0x7f : to), 0xffff);
      }
    },
      {
      name: "d",
      help: [
        "d(0x6000) - disassemble from $6000       d(r().pc)         - disassemble from PC",
      ],
      fn: (from, to=0x20 + from) => console.log(disasm(c64.wires.cpuRead, from, to))
    },
    {
      name: "r",
      help: [
        "r()       - show registers               r().a=0xab        - set the acc to $ab",
      ],
      fn: () => {
        try {
          c64.cpu.showState();
        }
        catch (r) {}
        return c64.cpu.getState();
      }
    },
    {
      name: "y",
      help: [
        "y(370000) - run until cycle 370000",
      ],
      fn: untilCycle
    },
    {
      name: "f",
      help: [
        "f(5)      - run at 5 frames/second",
      ],
      fn: fps => runloop.run({ fps })
    },
    {
      name: "z",
      help: [
        "z()       - reset",
      ],
      fn: () => {
        runloop.reset();
        runloop.run();
      }
    },
  ];

  cli.forEach(
    i => {
      globalThis[i.name] = i.fn;
    }
  );

  help();

  // Strictly for the user to use, through the JavaScript console
  globalThis.c64 = c64;
}


async function singleStep(steps = 1) {
  while (steps--) {
    const initialPc = c64.cpu.getState().pc;
    await runloop.run({
      tick: () => c64.cpu.getState().pc !== initialPc
    });
    c64.cpu.showState();
  }
}

async function untilPc(pc, fast) {
  if (pc === undefined) {
    console.error("Missing argument: PC address");
    return;
  }

  await runloop.untilPc(pc, fast);
  c64.cpu.showState();
}

function untilCycle(cycle) {
  const runloopState = runloop.getState();
  runloop.run({
    tick: () => runloopState.cycle >= cycle,
    fps: Infinity,
  });
}

function busDump(from, to) {
  const { cpuRead } = c64.wires;
  const displayFrom = Math.floor(from / 16) * 16;
  const displayTo   = Math.floor(  to / 16) * 16;

  for (let addr = displayFrom; addr <= displayTo; addr += 16) {

    let line = "";
    let raw = "";

    for (let i = 0; i < 16; i++) {

      const a = addr + i;
      let hex = "  ";
      let char = " ";

      if ((a >= from) && (a <= to)) {
        const byte = cpuRead(a);
        hex = xx(byte);
        char = petsciiToChar[byte];
      }

      line += ` ${hex}`;
      if (i === 7) line += " ";

      raw += char;
    }

    console.log(`${$xxxx(addr)}: ${line}   ${raw}`);
  }
}
