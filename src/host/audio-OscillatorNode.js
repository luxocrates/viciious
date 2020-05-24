/*
   SID output using the Web Audio API. Specifically, an output path built upon
   a network of OscillatorNode nodes. Maybe someday there'd be an alternative
   audio-AudioWorklet too, so to avoid confusion between the two, this file
   isn't called audio-WebAudio.
*/

const state = {
  regs: new Uint8Array(32),
  suspended: true,
};

// Square waves are as loud as it gets. Dial it down...
const MASTER_MULTIPLIER = 0.2;

// Divide hibyte/lobyte frequency by MASTER_TUNING to get Hz.
// TODO: this isn't accurate. Tables exist which could give a better number,
// eg. https://codebase64.org/doku.php?id=base:pal_frequency_table
//     https://codebase64.org/doku.php?id=base:ntsc_frequency_table
//
// Note that it's different for PAL vs NTSC
const MASTER_TUNING = 16.9;

// create web audio API context
const audioCtx = new (globalThis.AudioContext || globalThis.webkitAudioContext)();

// If the browser won't allow audio context creation immediately we'll continue
// regardless and hope that userDidInteract gets called to unblock it. If that
// doesn't happen, the emulator will slow dramatically the more the audio API
// is used.
state.suspended = (audioCtx.state === "suspended");

if (state.suspended) {
  // Listen out for events that could allow resumption (though most likely
  // it'll be the drag-and-drop that unblocks us).
  window.addEventListener(
    "load",
    () => {
      document.addEventListener("click",   userDidInteract);
      document.addEventListener("keydown", userDidInteract);
    }
  );

  // Resumption may be asynchronous, so start an interval poller that watches
  // out for it and tears down the listeners.
  const poller = setInterval(
    () => {
      if (audioCtx.state === "running") {
        state.suspended = false;
        console.log("AudioContext resumed");

        // Tear down the listeners that are trying to update `suspended`. We'll
        // still get events from drag-and-drop, but they're completely harmless.
        clearInterval(poller);
        document.removeEventListener("click",   userDidInteract);
        document.removeEventListener("keydown", userDidInteract);
      }
    },
    250
  );
}

// uiGain is the ultimate chain in the link, connecting the emulated network
// to the browser.
const uiGain = audioCtx.createGain();
uiGain.gain.value = 1;
uiGain.connect(audioCtx.destination);

// 'master' in the context of 'within the C64'
const masterGain = audioCtx.createGain();
masterGain.gain.value = 0;
masterGain.connect(uiGain);

let voices = [];

// The thresholder curve is a response table that maps input (-1, 1) to output
// (-1, 1). The WaveShaperNode API linearly interpolates between points in the
// table that the domain maps to, so we need a table with enough entries that
// that's unlikely to matter much. 256 will do.
const nThresholderCurvePoints = 256;
const thresholderCurve = new Float32Array(nThresholderCurvePoints);
for (let n = 0; n < nThresholderCurvePoints; n++) {
  thresholderCurve[n] = (n < (nThresholderCurvePoints / 2)) ? -1 : 1;
}

// Static noise data
const noiseBufferSize = 2 * audioCtx.sampleRate;
const noiseBuffer = audioCtx.createBuffer(1, noiseBufferSize, audioCtx.sampleRate);
const noiseData = noiseBuffer.getChannelData(0);

// Or, better, use the actual SID noise pattern. See:
// https://codebase64.org/doku.php?id=base:noise_waveform
for (let i = 0; i < noiseBufferSize; i++) {
  noiseData[i] = (Math.random() * 2) - 1;
}

// At time of writing, macOS Safari (v13.0.3) doesn't support
// ConstantSourceNode, so we'll monkey patch a stub in its place.
// Alternatively, we could use a buffer node with constant output, but I'm
// hoping Apple will eventually implement it.
if (globalThis.ConstantSourceNode === undefined) {
  console.warn("Your browser doesn't support ConstantSourceNode. Pulse width modulation disabled.");
  globalThis.ConstantSourceNode = function () {
    this.start   = () => {};
    this.connect = () => {};
    this.offset  = {};
  };
}

// Set up voices
[0, 1, 2].forEach(
  voice => {

    const oscillator  = audioCtx.createOscillator();
    const whiteNoise  = audioCtx.createBufferSource();
    const voiceGain   = audioCtx.createGain();
    const waveGain    = audioCtx.createGain();
    const noiseGain   = audioCtx.createGain();
    const thresholder = audioCtx.createWaveShaper();

    // voiceGain: sets a voice volume (for the ADSR envelope), flowing in to
    // the master gain.
    voiceGain.gain.value = 0;
    voiceGain.connect(masterGain);

    // thresholder: to implement rectangle waves. Its inputs are a triangle
    // wave (from waveGain) and a variable DC offset (from dcSource).
    // It sums them and thresholds the output to (-1, 1).
    thresholder.curve = thresholderCurve;
    thresholder.connect(waveGain);

    // dcSource: set by the pulse width registers, to influence the thresholder.
    const dcSource = new ConstantSourceNode(audioCtx);
    dcSource.start();
    dcSource.connect(thresholder);

    // oscillator: the wave generator that will be used for triangle, sawtooth,
    // and rectangle waveforms.
    oscillator.type = "triangle";
    oscillator.frequency.value = 440;  // hertz
    oscillator.connect(waveGain);
    oscillator.start();

    // whiteNoise: the generator that will be used for the noise waveform.
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;
    whiteNoise.connect(noiseGain);
    whiteNoise.start(0);

    // noiseGain: sits between the whiteNoise generator and voiceGain to
    // determine whether or not noise will go out on the voice (all or
    // nothing).
    noiseGain.gain.value = 0;
    noiseGain.connect(voiceGain);

    // waveGain: sits between either the thresholder or the oscillator
    // (depending on whether we're playing a rectangle wave vs. sawtooth or
    // triangle), and determines whether or not sound from that source will
    // go out on the voice (all or nothing).
    waveGain.gain.value = 0;
    waveGain.connect(voiceGain);


    voices[voice] = {
      oscillator,
      voiceGain,
      noiseGain,
      waveGain,
      whiteNoise,
      dcSource,
      thresholder
    };
  }
)

function setMasterVolume(byte) {
  // byte is the raw write byte; needs disentangling
  masterGain.gain.value = ((byte & 0xf) / 15) * MASTER_MULTIPLIER;
}

function setVoiceFrequency(voice) {

  const lo = state.regs[(voice * 7) + 0];
  const hi = state.regs[(voice * 7) + 1];

  const word = (hi << 8) | lo;
  const freq = word / MASTER_TUNING;

  // voices[voice].oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime);
  voices[voice].oscillator.frequency.value = freq;
  voices[voice].whiteNoise.playbackRate.value = freq / 2000;
}

function setVoicePulseWidth(voice) {

  // Pulse width is a 12-bit number, split between a lowbyte and highbyte.
  const lo = (state.regs[(voice * 7) + 2]) & 0xff;
  const hi = (state.regs[(voice * 7) + 3]) & 0x0f;

  const width = (hi << 8) | lo;

  // Map (000, fff) width value to a (-1, 1) DC offset
  const dcOffset = ((width / 0xfff) * 2) - 1; 

  voices[voice].dcSource.offset.value = dcOffset;
}

function setControlRegister(voice, byte) {

  // TODO: this relies on reset configuring it to the lastControlRegister value
  // but I haven't made it do that yet.
  if ((byte & 0xf0) !== voices[voice].lastControlRegister) {

    // Theoretically, no two waveforms should be on at the same time. But
    // Wizball does that in voices 1 and 2 (triangle and rectangle) late into
    // song 3, and it's clear from real hardware (at least on a 6581) that
    // rectangle wins out.
    if (byte & 0x80) {
      // Noise
      voices[voice]. waveGain.gain.value = 0;
      voices[voice].noiseGain.gain.value = 1;
    }

    else if (byte & 0x40) {
      // Rectangle (pulse)
      // (Yes implemented as a triangle wave. It gets added to an offset, then
      // thresholded, to end up as the pulse wave requested.)
      voices[voice].oscillator.type = "triangle";
      voices[voice]. waveGain.gain.value = 1;
      voices[voice].noiseGain.gain.value = 0;
      voices[voice].oscillator.disconnect();
      voices[voice].oscillator.connect(voices[voice].thresholder);
    }

    else if (byte & 0x20) {
      // Sawtooth
      voices[voice].oscillator.type = "sawtooth";
      voices[voice]. waveGain.gain.value = 1;
      voices[voice].noiseGain.gain.value = 0;
      voices[voice].oscillator.disconnect();
      voices[voice].oscillator.connect(voices[voice].waveGain);
    }

    else if (byte & 0x10) {
      // Triangle
      voices[voice].oscillator.type = "triangle";
      voices[voice]. waveGain.gain.value = 1;
      voices[voice].noiseGain.gain.value = 0;
      voices[voice].oscillator.disconnect();
      voices[voice].oscillator.connect(voices[voice].waveGain);
    }
  }

  // TODO: add this to docs
  voices[voice].lastControlRegister = byte;
}

function setVoiceVolume(voice, volume) {
  voices[voice].voiceGain.gain.value = volume;
}

function onRegWrite(reg, byte) {

  state.regs[reg] = byte;

  switch (reg) {

    case 0x00:    // $d400: voice 1 frequency (low-byte)
    case 0x01:    // $d401: voice 1 frequency (high-byte)
      return setVoiceFrequency(0);

    case 0x02:    // $d402: voice 1 pulse width (low-byte)
    case 0x03:    // $d403: voice 1 pulse width (high-byte)
      return setVoicePulseWidth(0);

    case 0x04:    // $d404: voice 1 control register
      return setControlRegister(0, byte);


    case 0x07:    // $d407: voice 2 frequency (low-byte)
    case 0x08:    // $d408: voice 2 frequency (high-byte)
      return setVoiceFrequency(1);

    case 0x09:    // $d409: voice 2 pulse width (low-byte)
    case 0x0a:    // $d40a: voice 2 pulse width (high-byte)
      return setVoicePulseWidth(1);

    case 0x0b:    // $d40b: voice 2 control register
      return setControlRegister(1, byte);


    case 0x0e:    // $d40e: voice 3 frequency (low-byte)
    case 0x0f:    // $d40f: voice 3 frequency (high-byte)
      return setVoiceFrequency(2);

    case 0x10:    // $d410: voice 3 pulse width (low-byte)
    case 0x11:    // $d411: voice 3 pulse width (high-byte)
      return setVoicePulseWidth(2);

    case 0x12:    // $d412: voice 3 control register
      return setControlRegister(2, byte);


    case 0x18:    // $d418: master volume and filter modes
      return setMasterVolume(byte);
  }
}

function reset() {
  // TODO!
}

export function attach(nascentC64) {
  nascentC64.audio = {
    // Control
    reset,
    // Interface-specific handlers
    setVoiceVolume,
    onRegWrite,
    userDidInteract,
    setUiGain,
  };

  // https://stackoverflow.com/questions/7944460/detect-safari-browser
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  if (isSafari) {
    // Effects reported below relate to macOS Safari v13.0.3, current at time
    // of writing. Also, it'll run really slowly if the JavaScript console's
    // open.
    const useStub = confirm(
      "It looks like you're running Safari. Safari's sound implementation " +
      "introduces weird slides, and isn't comptible with our pulse width " +
      "modulator. Disable audio?"
    );

    if (useStub) {
      nascentC64.audio.setVoiceVolume  = () => {};
      nascentC64.audio.onRegWrite      = () => {};
      nascentC64.audio.userDidInteract = () => {};
    }
  }
}

function userDidInteract() {
  // If the audioContext was created in a suspended state (see
  // https://developers.google.com/web/updates/2017/09/autoplay-policy-changes#webaudio
  // ), let's try to resume it now that we've observed a user interaction.
  if (state.suspended) audioCtx.resume();

  // If successful, audioCtx.state may not change immediately. (My observation:
  // Firefox 75 does; Chrome 81 does not.)
  // Thus, just to track whether the audio's actually on at any given time (not
  // that the frontend currently reports it), we have an interval poller that 
  // checks and updates the `suspended` variable.

  // Also, note that this resumption may not be successful. A keydown event of
  // a modifier or escape key, for example, would trigger this function, but is
  // insufficient for the browser's anti-nuisance policy to allow the audio
  // resumption.
}

function setUiGain(value) {
  uiGain.gain.value = value; 
}
