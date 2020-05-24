/*
   runloop: performs operations like tick, serialize and deserialize on the
   target system as a whole, and runs the simulation in a time-throttled loop,
   with an optional hook for breakpoints
*/

import {
  KEYBOARD_BUFFER_ADDR,
  KEYBOARD_BUFFER_INDEX,
  KEYBOARD_BUFFER_LENGTH,
} from "../tools/romLocations";

// Node.js doesn't have `performance` loaded by default. Not that we make use
// of it in that version, but the runloop expects it to be there.
if (!globalThis.performance) {
  globalThis.performance = { now: () => 0 };
}

// How many frames to run for a single frames-per-second sample
const FRAMES_PER_WAYPOINT = 50;

// Bound by attach
let c64;

// configure by setDevices
let wires;
let cpu;
let vic;
let cias;
let sid;
let tape;

let state;
let masterStop = false;
let frameStop  = false;

export function attach(nascentC64) {
  c64 = nascentC64;

  wires = c64.wires;
  cpu   = c64.cpu;
  vic   = c64.vic;
  cias  = c64.cias;
  sid   = c64.sid;
  tape  = c64.tape;

  reset();

  c64.runloop = {
    // Control
    run,
    stop,
    stopAfterFrame,
    isRunning,
    type,
    untilPc,
    reset,
    serialize,
    deserialize,
    // Debug
    getState,
  };
}

function reset() {
  state = {
    cycle: 0,
  };
  
  c64.wires.reset();
  c64.ram  .reset();
  c64.vic  .reset();
  c64.sid  .reset(); 
  c64.cpu  .reset();
  c64.cias .reset();
  c64.tape .reset();

  if (c64.hooks.setTitle) {
    c64.hooks.setTitle("");
  }
}

function getState() {
  return state;
}

function stop() {
  masterStop = true;
}

function stopAfterFrame() {
  frameStop = true;
}

function isRunning() {
  return !masterStop;
}

let timer;

function run(profile) {

  // Apply default run profile
  profile = {
    tick: () => false,
    fps: 50,
    ...profile,
  }

  let resolveBreakPromise;
  const breakPromise = new Promise(resolve => { resolveBreakPromise = resolve; });

  if (timer !== undefined) {
    masterStop = true;
    clearInterval(timer);
  }

  masterStop = false;
  frameStop  = false;

  const cleanUpOnBreak = () => {
    clearInterval(timer);
    if (c64.hooks.didStop) c64.hooks.didStop();
    timer = undefined;
    resolveBreakPromise();
  };

  let timeAtWaypoint = performance.now();
  let framesSinceWaypoint = 0;

  timer = setInterval(
    () => {
      try {
        // We'll loop for one video frame at a time. That is,
        // 312 rows of 63 cycles per row
        // (Which would be different if we support NTSC in future)
        for (let i = 0; i < (63 * 312); i++) {
          state.cycle++;

          cpu .tick();
          vic .tick();
          cias.tick();
          sid .tick();
          tape.tick();

          if (masterStop || profile.tick()) {
            cleanUpOnBreak();
            break;
          }
        }

        // Frames-per-second counter
        if (++framesSinceWaypoint === FRAMES_PER_WAYPOINT) {
          const now = performance.now();

          if (c64.hooks.updateFps) {
            c64.hooks.updateFps(
              Math.round((1000 * FRAMES_PER_WAYPOINT) / (now - timeAtWaypoint))
            );
          }

          timeAtWaypoint = now;
          framesSinceWaypoint = 0;
        }

        // Frame stop
        if (frameStop) cleanUpOnBreak();
      }
      catch (e) {
        console.error("Caught exception:", e);
        cleanUpOnBreak();
      }
    },
    1000 / profile.fps
  );

  if (c64.hooks.didStart) c64.hooks.didStart();

  return breakPromise;
}

async function untilPc(pc, fast = false) {

  const regs = c64.cpu.getState();

  if (pc === undefined) {
    // TODO: throw instead?
    console.error("Missing argument: PC address");
    return;
  }

  // If the PC was currently at the address we were waiting for,
  // advance past it. You want to be able to call this function
  // multple times to re-run.
  await run({
    tick: () => regs.pc !== pc,
  });

  return run({
    tick: () => regs.pc === pc,
    fps: fast ? Infinity : undefined,
  });
}

function type(str) {
  let bufLen = c64.wires.cpuRead(KEYBOARD_BUFFER_INDEX);

  for (let char of str) {

    if (bufLen >= KEYBOARD_BUFFER_LENGTH) {
      throw new Error("Overflow for Kernal keyboard buffer");
    }

    c64.wires.cpuWrite(KEYBOARD_BUFFER_ADDR + bufLen, char.charCodeAt(0));
    c64.wires.cpuWrite(KEYBOARD_BUFFER_INDEX, ++bufLen);
  }
}

function serialize() {
  return JSON.stringify(
    {
      version: {
        creator: "viciious",
        major: 0,
        minor: 1,
      },
      runloop: JSON.stringify(state),
      wires:   c64.wires.serialize(),
      ram:     c64.ram  .serialize(),
      vic:     c64.vic  .serialize(),
      sid:     c64.sid  .serialize(),
      cpu:     c64.cpu  .serialize(),
      cias:    c64.cias .serialize(),
      tape:    c64.tape .serialize(),
    }
  );
}

function deserialize(json) {
  const obj = JSON.parse(json);

  state = JSON.parse(obj.runloop);

  c64.wires.deserialize(obj.wires);
  c64.ram  .deserialize(obj.ram  );
  c64.vic  .deserialize(obj.vic  );
  c64.sid  .deserialize(obj.sid  );
  c64.cpu  .deserialize(obj.cpu  );
  c64.cias .deserialize(obj.cias );
  c64.tape .deserialize(obj.tape );
}
