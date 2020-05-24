// bound by attach
let c64;

// Populated by cias
let setJoystick1 = () => {};
let setJoystick2 = () => {};

// Called during initialization to tell the keyboard event handler how to send
// key matrices to CIA1.
function setSetJoystick1(fn) { setJoystick1 = fn; }
function setSetJoystick2(fn) { setJoystick2 = fn; }


const JOSTICK_UP    = 0x01;
const JOSTICK_DOWN  = 0x02;
const JOSTICK_LEFT  = 0x04;
const JOSTICK_RIGHT = 0x08;
const JOSTICK_FIRE  = 0x10;

let buttonsDown = new Set();

function eventToJoystickButton(event) {
  switch (event.key) {
    case "Shift":      return JOSTICK_FIRE;
    case "ArrowUp":    return JOSTICK_UP;
    case "ArrowDown":  return JOSTICK_DOWN;
    case "ArrowLeft":  return JOSTICK_LEFT;
    case "ArrowRight": return JOSTICK_RIGHT;
  }
}

function tellCia() {
  let byte = 0;

  for (let val of buttonsDown.values()) {
    byte |= val;
  }

  // values float high; the buttons pull them low
  if (c64.joystick.toControlPort1) setJoystick1((~byte) & 0xff);
  if (c64.joystick.toControlPort2) setJoystick2((~byte) & 0xff);
}

globalThis.addEventListener(
  "keydown",
  event => {
    const setKey = eventToJoystickButton(event);
    if (!setKey) return;

    buttonsDown.add(setKey);
    tellCia();
  }
);

globalThis.addEventListener(
  "keyup",
  event => {
    const setKey = eventToJoystickButton(event);
    if (!setKey) return;

    buttonsDown.delete(setKey);
    tellCia();
  }
);

globalThis.addEventListener(
  "blur",
  event => {
    buttonsDown.clear();
    tellCia();
  }
);

export function attach(nascentC64) {

  c64 = nascentC64;
  // TODO: this should be where we set up the event listeners

  nascentC64.joystick = {
    setSetJoystick1,
    setSetJoystick2,
    toControlPort1: false,
    toControlPort2: true,
  };
}
