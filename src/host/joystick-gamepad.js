// Reference: https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API/Using_the_Gamepad_API
//
// This is just a proof of concept. It's working for me right now on Chrome and
// Firefox, but not Safari

// Don't do 1000/50, just in case timing jitter means that spans two frames
const POLL_MS = 1000 / 60;

// bound by attach
let c64;

// Populated by cias
let setJoystick1 = () => {};
let setJoystick2 = () => {};

let interval;

// Called during initialization to tell the keyboard event handler how to send
// key matrices to CIA1.
function setSetJoystick1(fn) { setJoystick1 = fn; }
function setSetJoystick2(fn) { setJoystick2 = fn; }


const JOYSTICK_UP    = 0x01;
const JOYSTICK_DOWN  = 0x02;
const JOYSTICK_LEFT  = 0x04;
const JOYSTICK_RIGHT = 0x08;
const JOYSTICK_FIRE  = 0x10;

let buttonsDown = new Set();

function eventToJoystickButton(event) {
  switch (event.key) {
    case "Shift":      return JOYSTICK_FIRE;
    case "ArrowUp":    return JOYSTICK_UP;
    case "ArrowDown":  return JOYSTICK_DOWN;
    case "ArrowLeft":  return JOYSTICK_LEFT;
    case "ArrowRight": return JOYSTICK_RIGHT;
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

function pollPad(index) {
  const pad = navigator.getGamepads()[index];

  // let str = "";
  // for (let i = 0; i < pad.buttons.length; i++) {
  //   if (pad.buttons[i].pressed) str += `${i} `;
  // }
  // if (str) console.log(str);

  // DualShock 4 button assignments, as revealed by the above:
  // 12 = up
  // 13 = down
  // 14 = left
  // 15 = right
  // 0 = ecks;
  // 1 = circle;
  // 2 = square
  // 3 = triangle

  buttonsDown = new Set();

  if (pad.buttons[ 0].pressed) buttonsDown.add(JOYSTICK_FIRE);
  if (pad.buttons[12].pressed) buttonsDown.add(JOYSTICK_UP);
  if (pad.buttons[13].pressed) buttonsDown.add(JOYSTICK_DOWN);
  if (pad.buttons[14].pressed) buttonsDown.add(JOYSTICK_LEFT);
  if (pad.buttons[15].pressed) buttonsDown.add(JOYSTICK_RIGHT);

  tellCia();
}

function setUpEventListeners() {
  globalThis.addEventListener(
    "gamepadconnected",
    (e) => {

      console.log(
        "Gamepad connected at index %d: %s. %d buttons, %d axes.",
        e.gamepad.index,
        e.gamepad.id,
        e.gamepad.buttons.length,
        e.gamepad.axes.length
      );

      interval = setInterval(
        () => pollPad(e.gamepad.index),
        POLL_MS
      );
    }
  );

  globalThis.addEventListener(
    "gamepaddisconnected",
    (e) => {

      console.log(
        "Gamepad %d disconnected",
        e.gamepad.index,
      );

      clearInterval(interval);
    }
  );

  globalThis.addEventListener(
    "blur",
    event => {
      buttonsDown.clear();
      tellCia();
    }
  );
}

export function attach(nascentC64) {

  c64 = nascentC64;

  nascentC64.joystick = {
    setSetJoystick1,
    setSetJoystick2,
    toControlPort1: false,
    toControlPort2: true,
  };

  setUpEventListeners();
}
