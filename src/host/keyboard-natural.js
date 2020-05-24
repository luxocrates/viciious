/*
   "Natural" keyboard mapping: tries to map what was written on your key to a
   combination of C64 physical keys. Convenient for typing, but makes many C64
   keys, or key combinations, inaccessible.

   There is a problem with this approach: pressing repeated asterisks (if
   that's Shift-8 on your keyboard) alternates between telling the virtual
   machine that only SHIFT is pressed, and only the * key is pressed. If that
   transition happens in the middle of the keyboard matrix scan, it can look
   like both are pressed, resulting in a shifted-* key getting typed (a PETSCII
   horizontal line character). It's not as difficult to achieve as you might
   think.

   Arguably we shouldn't be sending shift-on-its-own to the virtual machine.
*/

const eventKeyToButtonNames = {
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

  " ":          ["Space"],
  "Backspace":  ["InstDel"],
  "Enter":      ["Return"],
  "Escape":     ["RunStop"],

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

  "Shift":      ["LeftShift"],
  "Home":       ["ClrHome"],
  "ArrowLeft":  ["CursorRight", "LeftShift"],
  "ArrowRight": ["CursorRight"],
  "ArrowUp":    ["CursorDown", "LeftShift"],
  "ArrowDown":  ["CursorDown"],

  "F1":         ["F1"],
  "F2":         ["F1", "LeftShift"],
  "F3":         ["F3"],
  "F4":         ["F3", "LeftShift"],
  "F5":         ["F5"],
  "F6":         ["F5", "LeftShift"],
  "F7":         ["F7"],
  "F8":         ["F7", "LeftShift"],

  // We're not going to translate all of our Unicode translations (see
  // videoAsAnsi.js) back to PETSCII, but we'll make an exception for π, since
  // Basic understands it as a token.
  "π":          ["UpArrow", "LeftShift"],

  // Not literal; provided for convenience
  "`":          ["LeftArrow"],
  "~":          ["UpArrow"],
  "\\":         ["ClrHome"],
  "|":          ["ClrHome", "LeftShift"],
  "^":          ["Commodore", "LeftShift"],
  "_":          ["RunStop", "LeftShift"],
  "{":          ["Ctrl", "Num9"],
  "}":          ["Ctrl", "Num0"],
};

export function eventToButtonNames(event) {
  return eventKeyToButtonNames[event.key];
}

export function keyStackToButtonNames(keyStack) {
  // For the natural keyboard handler, only the buttons for the most recent key
  // event are held. Thus, if you type an asterisk by Shift-8 (eg. on a US
  // keyboard), the result will be just the single key, ["Asterisk"], not
  // the combination ["Asterisk, LeftShift"], which corresponds to a PETSCII
  // horizontal line character.
  if (!keyStack.length) return [];
  return keyStack[0].buttonNames;
}
