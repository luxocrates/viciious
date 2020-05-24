import css from "./joystickDialog.css";

let c64;
let state;

const crsrsBindings = [
  ["crsrs_key", "cursorsToKeys"],
  ["crsrs_cp1", "cursorsToCp1"],
  ["crsrs_cp2", "cursorsToCp2"],
];

export function initJoystickDialog(nascentC64) {
  c64 = nascentC64;

  state = {
    // These maybe belong in some settings struct on c64
    cursorsToKeys: true,
    cursorsToCp1: false,
    cursorsToCp2: true,
  };

  for (let [id, stateKey] of crsrsBindings) {
    const el = document.getElementById(id);
    el.addEventListener(
      "click",
      () => {
        state[stateKey] = !state[stateKey];
        updateCursorElements();

        c64.keyboard.cursorsToKeys  = state.cursorsToKeys;
        c64.joystick.toControlPort1 = state.cursorsToCp1;
        c64.joystick.toControlPort2 = state.cursorsToCp2;

        event.stopImmediatePropagation();
      }
    );
  }

  updateCursorElements();
}

function updateCursorElements() {
  for (let [id, stateKey] of crsrsBindings) {
    const { classList } = document.getElementById(id);

    if (state[stateKey]) classList.add   ("selected");
    else                 classList.remove("selected");
  }
}
