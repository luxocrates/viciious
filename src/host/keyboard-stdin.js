/*
   A keyboard ingestor that takes keys from stdin.
  
   This is a very different beast than the browser-based keyboard interfaces:
   whereas they receive separate `keydown` and `keyup` events, the stdin
   channel receives the equivalent of `keypress` events: notification that a
   key was pressed, but with no information on how long it was held for.
  
   For this and other reasons, this is a very restricted keyboard interface. In
   addition to the limitations of other keyboard handlers (like not emulating
   the RESTORE key or SHIFT LOCK keys), this one can't...
  
      - detect a shift key pressed on its own
      - emulate the Commodore key
      - emulate the CTRL key being held in conjunction with other keys
  
   See the keyToButtonNames table for mappings.
*/

import { buttonNameToMatrixPos } from "./buttonNameToMatrixPos";

// Bound by attach
let setKeyMatrix;

let timer;

const keyToButtonNames = {
  "a":          ["A"],
  "b":          ["B"],
  "c":          ["C"],
  "d":          ["D"],
  "e":          ["E"],
  "f":          ["F"],
  "g":          ["G"],
  "h":          ["H"],
  "i":          ["I"],
  "j":          ["J"],
  "k":          ["K"],
  "l":          ["L"],
  "m":          ["M"],
  "n":          ["N"],
  "o":          ["O"],
  "p":          ["P"],
  "q":          ["Q"],
  "r":          ["R"],
  "s":          ["S"],
  "t":          ["T"],
  "u":          ["U"],
  "v":          ["V"],
  "w":          ["W"],
  "x":          ["X"],
  "y":          ["Y"],
  "z":          ["Z"],

  "A":          ["A", "LeftShift"],
  "B":          ["B", "LeftShift"],
  "C":          ["C", "LeftShift"],
  "D":          ["D", "LeftShift"],
  "E":          ["E", "LeftShift"],
  "F":          ["F", "LeftShift"],
  "G":          ["G", "LeftShift"],
  "H":          ["H", "LeftShift"],
  "I":          ["I", "LeftShift"],
  "J":          ["J", "LeftShift"],
  "K":          ["K", "LeftShift"],
  "L":          ["L", "LeftShift"],
  "M":          ["M", "LeftShift"],
  "N":          ["N", "LeftShift"],
  "O":          ["O", "LeftShift"],
  "P":          ["P", "LeftShift"],
  "Q":          ["Q", "LeftShift"],
  "R":          ["R", "LeftShift"],
  "S":          ["S", "LeftShift"],
  "T":          ["T", "LeftShift"],
  "U":          ["U", "LeftShift"],
  "V":          ["V", "LeftShift"],
  "W":          ["W", "LeftShift"],
  "X":          ["X", "LeftShift"],
  "Y":          ["Y", "LeftShift"],
  "Z":          ["Z", "LeftShift"],

  "0":          ["Num0"],
  "1":          ["Num1"],
  "2":          ["Num2"],
  "3":          ["Num3"],
  "4":          ["Num4"],
  "5":          ["Num5"],
  "6":          ["Num6"],
  "7":          ["Num7"],
  "8":          ["Num8"],
  "9":          ["Num9"],

  "!":          ["Num1", "LeftShift"],
  '"':          ["Num2", "LeftShift"],
  "#":          ["Num3", "LeftShift"],
  "$":          ["Num4", "LeftShift"],
  "%":          ["Num5", "LeftShift"],
  "&":          ["Num6", "LeftShift"],
  "'":          ["Num7", "LeftShift"],
  "(":          ["Num8", "LeftShift"],
  ")":          ["Num9", "LeftShift"],

  "+":          ["Plus"],
  "-":          ["Minus"],
  "=":          ["Equal"],
  "@":          ["At"],
  "£":          ["Pound"],
  "*":          ["Asterisk"],
  ",":          ["Comma"],
  ".":          ["Period"],
  "/":          ["Slash"],
  "?":          ["Slash", "LeftShift"],
  ":":          ["Colon"],
  ";":          ["Semicolon"],
  "[":          ["Colon", "LeftShift"],
  "]":          ["Semicolon", "LeftShift"],
  "<":          ["Comma", "LeftShift"],
  ">":          ["Period", "LeftShift"],
  " ":          ["Space"],
  "\x7f":       ["InstDel"],
  "\r":         ["Return"],

  // We're not going to translate all of our Unicode translations (see
  // videoAsAnsi.js) back to PETSCII, but we'll make an exception for π, since
  // Basic understands it as a token.
  "π":          ["UpArrow", "LeftShift"],

  // We're using Escape for RunStop, but also declaring escape codes. This
  // relies on Node.js giving us the escape sequence all in one go. Seems a
  // little unsound.
  "\x1b":       ["RunStop"],                    // Escape
  "\x1b[A":     ["CursorDown", "LeftShift"],    // Cursor up
  "\x1b[B":     ["CursorDown"],                 // Cursor down
  "\x1b[C":     ["CursorRight"],                // Cursor right
  "\x1b[D":     ["CursorRight", "LeftShift"],   // Cursor left
  "\x1b[3~":    ["InstDel", "LeftShift"],       // Forward delete
  "\x1bOP":     ["F1"],                         // F1
  "\x1bOQ":     ["F1", "LeftShift"],            // F2
  "\x1bOR":     ["F3"],                         // F3
  "\x1bOS":     ["F3", "LeftShift"],            // F4
  "\x1b[15~":   ["F5"],                         // F5
  "\x1b[17~":   ["F5", "LeftShift"],            // F6
  "\x1b[18~":   ["F7"],                         // F7
  "\x1b[19~":   ["F7", "LeftShift"],            // F8

  // Not literal; provided for convenience
  "`":          ["LeftArrow"],
  "~":          ["UpArrow"],
  "\\":         ["ClrHome"],
  "|":          ["ClrHome", "LeftShift"],
  "^":          ["Commodore", "LeftShift"],
  "_":          ["RunStop", "LeftShift"],
  "{":          ["Ctrl", "Num9"],
  "}":          ["Ctrl", "Num0"],
  "\x09":       ["Ctrl"],                       // Tab

  "⁄":          ["Ctrl", "Num1"],               // Option-shift-1 (macOS US)
  "€":          ["Ctrl", "Num2"],               // Option-shift-2 (macOS US)
  "‹":          ["Ctrl", "Num3"],               // Option-shift-3 (macOS US)
  "›":          ["Ctrl", "Num4"],               // Option-shift-4 (macOS US)
  "ﬁ":          ["Ctrl", "Num5"],               // Option-shift-5 (macOS US)
  "ﬂ":          ["Ctrl", "Num6"],               // Option-shift-6 (macOS US)
  "‡":          ["Ctrl", "Num7"],               // Option-shift-7 (macOS US)
  "°":          ["Ctrl", "Num8"],               // Option-shift-8 (macOS US)
  "·":          ["Ctrl", "Num9"],               // Option-shift-9 (macOS US)
  "‚":          ["Ctrl", "Num0"],               // Option-shift-0 (macOS US)
};

export function attach(nascentC64) {
  nascentC64.keyboard = {
    setSetKeyMatrix: (fn) => { setKeyMatrix = fn; },
  };

  // Take keystrokes as they come, not line-at-a-time
  process.stdin.setRawMode( true );

  // Set up listeners for key events
  process.stdin.setEncoding("utf8");
  process.stdin.on("data", onData);
}

function onData(key) {
  // Catch ^C. (Isn't there a way of passing this to Node's default handler?)
  if (key === "\x03") process.emit("SIGINT");

  const buttonNames = keyToButtonNames[key];
  if (!buttonNames) return;

  // When we receive a key, we just know it's pressed; we have no way of
  // knowing how long for. So we'll hold it down for two frames to be sure that
  // the target program noticed, but not long enough to cause repeats.
  // 
  // On effecting the keydown, we'll start a timer to schedule its keyup. If
  // another keydown is received while the first one is still down, we'll
  // remove the first key from the matrix and cancel that timer.
  if (timer) clearTimeout(timer);

  dispatchKeyMatrix(buttonNames);

  timer = setTimeout(
    () => dispatchKeyMatrix([]),
    // Two 50Hz frames
    (1000 / 50) * 2
  );
}

function dispatchKeyMatrix(buttonNames) {
  const keyMatrix = [0, 0, 0, 0, 0, 0, 0, 0];

  for (let buttonName of buttonNames) {
    const [column, row] = buttonNameToMatrixPos[buttonName];
    keyMatrix[column] |= (1 << row);
  }

  setKeyMatrix(keyMatrix);
}
