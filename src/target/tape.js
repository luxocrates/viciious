/*
   tape: emulates a 1530 'Datasette' cassette deck

   Basically just feeds .tap file format data into the CIA1. Does not support
   saving.

   References:

   - http://wav-prg.sourceforge.net/tape.html
   - http://unusedino.de/ec64/technical/formats/tap.html
*/


// Bound by attach
let raiseTapeInterrupt;
let c64; // but do we need it?

let state;

function setTapeMotor(isOn) {
  state.motorEnabled = isOn;
}

function scheduleNextInterrupt() {
  // We're using the .tap file format as-is to peel off the interrupt timings.
  // (Minus the header, which got stripped off by the ingestor)

  // TODO: bounds check for the image
  const val = state.image[state.imageOffset++];

  if (val === 0) {
    state.ticksUntilInterrupt  = state.image[state.imageOffset++];
    state.ticksUntilInterrupt |= state.image[state.imageOffset++] << 8;
    state.ticksUntilInterrupt |= state.image[state.imageOffset++] << 16;
  }

  else state.ticksUntilInterrupt = val * 8;
}

function tick() {
  if (state.playPressed && state.motorEnabled) {

    if (state.ticksUntilInterrupt) state.ticksUntilInterrupt--;
    else {
      raiseTapeInterrupt();
      scheduleNextInterrupt();
    }
  }
}


export function attach(nascentC64) {
  c64 = nascentC64;
  raiseTapeInterrupt = c64.wires.raiseTapeInterrupt;

  reset();

  c64.tape = {
    // Control
    tick,
    reset,
    serialize,
    deserialize,
    // TODO: what did we call this section again?
    setTapeMotor,
    isAnyButtonPressed,

    setImage,
    pressPlay,
    pressStop,
  };
}

function reset() {
  state = {
    ticksUntilInterrupt: Infinity,
    image: null,
    imageOffset: 0,
    playPressed: false,
    motorEnabled: false,
  };
}

function serialize() {
  // TODO
  // (If this gets supported in future, expect the snapshot files to get huge)
}

function deserialize() {
  // TODO
}

function isAnyButtonPressed() {
  return state.playPressed;
}

function setImage(bytes) {
  state.image = bytes;
  state.imageOffset = 0;

  // Schedule an interrupt; it won't actually happen unless the play button's
  // pressed and the motor's enabled.
  scheduleNextInterrupt();
}

function pressPlay() {
  state.playPressed = true;
}

function pressStop() {
  state.playPressed = false;
}
