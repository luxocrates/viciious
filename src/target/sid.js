/*
   sid: emulates the 6581 (SID) sound synthesizer

   This emulation is a pretty minimal implementation of the SID. It relies on a
   network of OscillatorNode nodes on the host side to actually do the sound
   synthesis. This is quirky for an emulator: it has the advantage that if the
   emulation is paused or slow, the sound will continue without stuttering a
   buffer loop; but it has manifest limitations.

   Essentially, this code is just emulating the ADSR envelope generator (and
   certainly has bugs in doing so), and hands everything else off to the host.

   As for those limitations:

   - no synchronization functionality (as in voice control registers bit 1)
   - voice 3 waveform output is noise only (which likely is its main purpose)
   - no timing accuracy within a frame. The core loop of the emulator runs a
     frame's worth of simulation in one go, then waits for a timeout to cue the
     next frame of simulation. As SID register writes are sent to the host as
     soon as they're encountered, this effectively means that sound commands
     are batched instead of staggered in real time. Since most sound commands
     are triggered from a 50 or 60Hz interrupt anyways, this isn't a big
     problem. But samples, on the other hand, will get badly distorted
     temporally. (Not that the host has a good way of playing them back, with
     the OscillatorNode network, even if timing could be guaranteed).
*/

import { $xx, $xxxx, unimplementedWarning } from "../debug";

// Just for diagnostics
import { diag } from "./sid_diag";

// For pre-generating exponential attack/decay curves
const ASYMPTOTE = 1.1;

// 1000 CPU cycles (= 1ms) per ADSR consideration tick
const CYCLES_PER_ADSR_TICK = 100;

// So tick duration is about 1ms
const MS_PER_ADSR_TICK = (1 / 1e6) * CYCLES_PER_ADSR_TICK * 1000;

function getMultiplier(asymptote, steps) {
  // Returns the multiplier you'd need for an attack multiplier,
  // For an upside-down exponential signal that would approach `asymptote`,
  // and would reach 1.0 after `steps` steps.

  // That is, for y = (asymptote).(multiplier)^x,
  // this returns multiplier

  return (Math.E ** (Math.log((asymptote - 1) / asymptote) / steps));
}

const attackMultiplierForDuration = [
     2,
     8,
    16,
    24,
    38,
    56,
    68,
    80,
   100,
   240,
   500,
   800,
  1000,
  3000,
  5000,
  8000,
].map(
  ms => getMultiplier(ASYMPTOTE, ms / MS_PER_ADSR_TICK)
);

const decayMultiplierForDuration = [
      6,
     24,
     48,
     72,
    114,
    168,
    204,
    240,
    300,
    750,
   1500,
   2400,
   3000,
   9000,
  15000,
  24000,
].map(
  ms => getMultiplier(ASYMPTOTE, ms / MS_PER_ADSR_TICK)
);

let state;

// Bound by attach
let regWriteToHost = () => {};
let setVolumeToHost = () => {};

function toBridge(adsr) {
  // Sanity-checking assertions
  if (
    (adsr.voice !== 0) &&
    (adsr.voice !== 1) &&
    (adsr.voice !== 2)
  ) debugger;

  if (adsr.value !== adsr.value) debugger;

  setVolumeToHost(adsr.voice, adsr.value);
}


const initialAdsr = {
  phase: "off",
  value: 0,

  curveScale: 1,
  multiplier: 0,

  attackDuration: 0,
  decayDuration: 0,
  sustainVolume: 0,
  releaseDuration: 0,
};

function reset() {
  state = {
    regs: new Uint8Array(0x20),
    adsr: [
      { ...initialAdsr, voice: 0 },
      { ...initialAdsr, voice: 1 },
      { ...initialAdsr, voice: 2 },
    ],
    cyclesUntilAdsrTick: CYCLES_PER_ADSR_TICK,
  };

  // TODO: should we tell the bridge to reset things too, or should we
  // rely on the bridge getting its own reset?
}

function tick_adsr(adsr) {

  // NaN auditing
  if (adsr.value !== adsr.value) debugger;

  switch (adsr.phase) {

    case "off":
      // Do nothing
      // toBridge(adsr);     // JUST FOR ILLUSTRATION
      break;

    case "attack":
      {
        let value;

        // curve here I think is always offset 0 scale 1

        value = adsr.value;

        value = 1 - value;
        value += (ASYMPTOTE - 1);

        value *= adsr.multiplier;

        value -= (ASYMPTOTE - 1);
        value = 1 - value;

        value = Math.min(value, 1);

        if (value === 1) {
          adsr.phase = "decay";
          adsr.multiplier = decayMultiplierForDuration[adsr.decayDuration];
          adsr.curveOffset = adsr.sustainVolume;
          adsr.curveScale = 1 - adsr.sustainVolume;

          if (!adsr.curveScale) adsr.curveScale = 0.001; // TODO! To avoid a NaN, but...
        }

        adsr.value = value;
        toBridge(adsr);
      }

      break;

    case "decay":
      {
        let value;

        value = adsr.value;

        // curve is:
        //    offset = sustain volume)
        //    scale  = 1 - sustain volume

        value -= adsr.curveOffset;
        value /= adsr.curveScale;
        value += (ASYMPTOTE - 1);
        value *= adsr.multiplier;
        value -= (ASYMPTOTE - 1);
        value *= adsr.curveScale;
        value += adsr.curveOffset;

        value = Math.max(value, adsr.curveOffset);

        if (value === adsr.curveOffset) {
          adsr.phase = "sustain";
          // no parameters needed for that one
        }

        adsr.value = value;
        // console.log("value =", value);
        toBridge(adsr);
      }
      break;

    case "sustain":
      // do nothing
      // toBridge(adsr);     // JUST FOR ILLUSTRATION
      break;

    case "release":

      // curve is:
      //    offset = 0
      //    scale  = sustain volume

      {
        let value = adsr.value;

        value /= adsr.curveScale;
        value += (ASYMPTOTE - 1);
        value *= adsr.multiplier;
        value -= (ASYMPTOTE - 1);
        value *= adsr.curveScale;

        value = Math.max(value, 0);    // times voice value

        if (!value) {
          adsr.phase = "off";
        }

        adsr.value = value;

        toBridge(adsr);
      }
      break;
  }
}

function stop(adsr) {
  adsr.phase = "off";
  adsr.value = 0;
  toBridge(adsr);
}

function keyon(adsr) {
  adsr.phase = "attack";
  adsr.multiplier = attackMultiplierForDuration[adsr.attackDuration];

  tick_adsr(adsr);

  // Let's not set value. We could be pumping it.
  // toBridge(adsr);
}

function keyoff(adsr) {
  adsr.phase = "release";
  adsr.multiplier = decayMultiplierForDuration[adsr.releaseDuration];
  adsr.curveScale = adsr.sustainVolume;
  if (!adsr.curveScale) adsr.curveScale = 0.001; // TODO! To avoid a NaN, but...
}


function tick() {

  if (!state.cyclesUntilAdsrTick--) {
    state.cyclesUntilAdsrTick = CYCLES_PER_ADSR_TICK;
    tick_adsr(state.adsr[0]);
    tick_adsr(state.adsr[1]);
    tick_adsr(state.adsr[2]);

    // diag(c64, state);
  }
}

function read_d400_d7ff(addr) {
  const reg = addr & 0x1f;

  switch (reg) {

    case 0x19:
    case 0x1a:
      unimplementedWarning("paddles");
      return 0xff; // verified
      break;

    case 0x1b:
      unimplementedWarning("voice 3 waveform output");
      // We can't give them waveform data, because we don't have it. But
      // chances are they're using white noise as a random number generator
      // (eg. for the smoke-fades in Master of the Lamps' title screen). So
      // let's just give return random numbers...
      return (Math.random() * 256) & 0xff;
      
    case 0x1c:
      unimplementedWarning("voice 3 ADSR output");
      break;
  }

  // Verified on real hardware that you really do get zero here
  return 0x00;
}

function write_d400_d7ff(addr, byte) {
  
  const reg = addr & 0x1f;
  const voice = Math.floor(reg / 7);

  switch (reg) {

    case 0x04:      // $d404: Voice 1 control register
    case 0x0b:      // $d40b: Voice 2 control register
    case 0x12:      // $d412: Voice 3 control register
      {
        const adsr = state.adsr[voice];

        if (byte & 0x8) {
          stop(adsr);
        }
        else {
          if (byte & 0x1) keyon(adsr);
          else            keyoff(adsr);
        }
      }
      break;

    case 0x05:      // $d405: Voice 1 attack and decay length
    case 0x0c:      // $d40c: Voice 2 attack and decay length
    case 0x13:      // $d413: Voice 3 attack and decay length

      // Do we do these? Yes, we do these all the time.
      // if (state.adsr[voice].phase === "attack") debugger;
      // if (state.adsr[voice].phase === "decay") debugger;

      // Store as a code
      state.adsr[voice]. decayDuration = byte & 0xf;
      state.adsr[voice].attackDuration = byte >> 4;
      break;

    case 0x06:      // $d406: Voice 1 sustain volume and release length
    case 0x0d:      // $d40d: Voice 2 sustain volume and release length
    case 0x14:      // $d414: Voice 3 sustain volume and release length

      // Store as a code
      state.adsr[voice].releaseDuration = byte & 0xf;

      // Store as a ratio
      state.adsr[voice].sustainVolume = (byte >> 4) / 15;
      break;

    case 0x18:      // $d414: Master volume, filter modes, voice 3 disable
      break;

    case 0x1b:      // $d41b: Voice 3 waveform output
    case 0x1c:      // $d41b: Voice 3 ADSR output
      break;
  }

  state.regs[reg] = byte;
  regWriteToHost(reg, byte);
}

function serialize() {
  return JSON.stringify(state);
}

function deserialize(json) {
  state = JSON.parse(json);

  // This has not been carefully considered, but, dare I say it, seems to work.
  // The runloop's reset function doesn't currently reset all of the host
  // devices. Should it?
  for (let reg = 0; reg <= 0x18; reg++) {
    regWriteToHost(reg, state.regs[reg]);
  }

  toBridge(state.adsr[0]);
  toBridge(state.adsr[1]);
  toBridge(state.adsr[2]);
}

// hookups...

let c64;

export function attach(nascentC64) {
  c64 = nascentC64;

  regWriteToHost  = c64.audio.onRegWrite;
  setVolumeToHost = c64.audio.setVoiceVolume;

  c64.sid = {
    // Control
    tick,
    reset,
    serialize,
    deserialize,
    // MMIO
    read_d400_d7ff,
    write_d400_d7ff,
  };

  reset();
}
