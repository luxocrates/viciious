// Host interfaces
import { attach as video    } from "../host/video-stub";
import { attach as audio    } from "../host/audio-stub";
import { attach as joystick } from "../host/joystick-stub";
import { attach as keyboard } from "../host/keyboard-stub";

// Target devices
import { attach as wires } from "../target/wires";
import { attach as ram   } from "../target/ram";
import { attach as vic   } from "../target/vic";
import { attach as sid   } from "../target/sid";
import { attach as cias  } from "../target/cias";
import { attach as cpu   } from "../target/cpu";
import { attach as tape  } from "../target/tape";

// ROMs
import basic     from "../target/rom/basic";
import kernal    from "../target/rom/skipRamTest";
import character from "../target/rom/character";

// Bringup
import { bringup } from "../target/bringup";

// Everything else
import testsuite        from "../tests/lorenz-base64";
import { base64Decode } from "../tools/base64";
import { loadPrg }      from "../tools/loadPrg";
import { videoAsAnsi }  from "../tools/videoAsAnsi";
import { READY_PC }     from "../tools/romLocations";


// How long to run a test for before assuming it failed
const TIMEOUT_MINUTES = 1.5;

// Kernal routine called to load the next test. Note that it's declared here
// instead of romLocations because it's not a very well defined entrypoint.
// The tests have this address hardcoded, and it's somewhat in the middle of
// a Kernal call.
const LOAD_PC = 0xe16f;

/*
  Known failing tests right now are:

    cia1pb6
    cia1pb7
    cia1ta
    cia1tab
    cia1tb
    cia1tb123
    cia2pb6
    cia2pb7
    cia2ta
    cia2tb
    cia2tb123
    cnto2
    cpuport
    cputiming
    flipos
    icr01
    imr
    irq
    loadth
    nmi
    oneshot
    trap16
    trap17
*/

const c64 = bringup({
  host:   { audio, video, keyboard, joystick },
  target: { wires, ram, vic, sid, cpu, cias, tape, basic, kernal, character },
  attachments: [],
});

main();


function dumpScreen() {
  console.log(videoAsAnsi(c64.wires.cpuRead));
}

function loadTest(name) {
  loadPrg(c64, base64Decode(testsuite[name]));
}

async function runTest(name) {
  let ret;

  // For the purpose of timeout, let's say the CPU clock is exactly 1MHz
  const maxCycles = TIMEOUT_MINUTES * 60 * 1e6;

  // Reset the target, and run until it's about to display the READY. prompt
  // before injecting the PRG for the test
  c64.runloop.reset();
  await c64.runloop.untilPc(READY_PC, true);
  loadTest(name);

  // Force display to use mixed-case font. The Lorenz tests do this at the
  // start of their chain (test " start"), so if you come straight in to an
  // individual test, it'd get missed. It's only really necessary for showing
  // the flag statuses of the CPU status register.
  c64.wires.cpuWrite(0xd018, 23);

  // Start the test program
  c64.runloop.type("RUN\r");

  // Run until either the test calls the Kernal routine that would launch the
  // next test (which it would do on success), or a fixed number of CPU cycles
  // have elapsed.
  const cpuState     = c64.cpu.getState();
  const runloopState = c64.runloop.getState();

  await c64.runloop.run({
    fps: Infinity,
    tick: () => {
      if (cpuState.pc === LOAD_PC) {
        // Test succeeded
        ret = true;
        return true;
      }
      if (runloopState.cycle >= maxCycles) {
        // Test failed
        ret = false;
        return true;
      }
    }
  });

  return ret;
}

async function main() {

  // Run all tests, or just those named on the command line
  let tests = Object.keys(testsuite);
  if (process.argv.length > 2) {
    tests = process.argv.slice(2);
  }

  for (let test of tests) {

    if (testsuite[test] === undefined) {
      throw new Error("No such test: " + test);
    }

    // "finish" is a sentinel, not a real test.
    if (test === "finish") continue;

    console.log("Running", test);
    const result = await runTest(test);

    if (result) {
      console.log(" - PASS");
    }
    else {
      console.log(" - FAIL");
      dumpScreen();
    }
  }
}
