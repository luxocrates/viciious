import { Dialog } from "./dialogs";
import { toggleScopes } from "./scopes";
import { takeSnapshot } from "./snapshot";

let c64;

export function initLowerTray(nascentC64) {
  c64 = nascentC64;

  for (let [buttonId, dialogId] of [
    ["joystickButton", "cursorKeysDialog"],
    ["keymapButton",   "keymapDialog"],
    ["loadButton",     "loadDialog"],
    ["aboutButton",    "aboutDialog"],
  ]) {
    const dialog = new Dialog(dialogId);

    handlerForEventForId(
      buttonId, 
      "click",
      () => dialog.open()
    );
  }

  handlerForEventForId(
    "pauseButton", 
    "click",
    () => c64.runloop.stop()
  );

  handlerForEventForId(
    "playButton", 
    "click",
    () => c64.runloop.run()
  );

  handlerForEventForId(
    "recordButton", 
    "click",
    () => takeSnapshot(c64)
  );

  handlerForEventForId(
    "muteButton", 
    "click",
    () => mute()
  );

  handlerForEventForId(
    "unmuteButton", 
    "click",
    () => unmute()
  );

  handlerForEventForId(
    "scopeButton", 
    "click",
    () => toggleScopes()
  );

  // TODO: we're choosing an initial state here, but what we should do is start
  // with it muted, and change it to unmuted when the audio API resumes itself
  // after the first interaction.
  document.getElementById("unmuteButton").classList.add("hidden");

  // TODO: This is a bad pattern, the tray taking the hook for itself. Other
  // components are quite likely to want access to the start/stop one. Ideally
  // have an EventTarget object in the frontend root, to which these
  // components should call an addEventListener.

  c64.hooks.didStart = () => {
    document.getElementById("pauseButton").classList.remove("hidden");
    document.getElementById("playButton") .classList.add   ("hidden");
    updateFpsMessage("...Hz");
  };

  c64.hooks.didStop = () => {
    document.getElementById("pauseButton").classList.add   ("hidden");
    document.getElementById("playButton") .classList.remove("hidden");
    updateFpsMessage("");
  };

  nascentC64.hooks.updateFps = (fps) => {
    updateFpsMessage(`${fps}Hz`);
  };
}

export function updateFpsMessage(message) {
  document.getElementById("fps").innerText = message;
}

function handlerForEventForId(id, eventName, fn) {
  document
    .getElementById(id)
    .addEventListener(eventName, fn)
  ;
}

function mute() {
  document.getElementById("muteButton")  .classList.add   ("hidden");
  document.getElementById("unmuteButton").classList.remove("hidden");
  c64.audio.setUiGain(0);
}

function unmute() {
  document.getElementById("muteButton")  .classList.remove("hidden");
  document.getElementById("unmuteButton").classList.add   ("hidden");
  c64.audio.setUiGain(1);
}
