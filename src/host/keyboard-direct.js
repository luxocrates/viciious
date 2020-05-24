/*
   "Direct" keyboard mapping: translates what key you press on your keyboard to
   the C64 key in a roughly-corresponding position (see images at
   https://www.c64-wiki.com/wiki/Keyboard). Notable exceptions are:
  
     * RUN STOP is moved to Escape.
     * ← and ↑ are moved to cursor-left and cursor-up. Those two were unused
       as the C64 requires you to use shift+cursor-right and shift+cursor-up
       for them anyways.
       (Like, seriously, £, @, ← and ↑ got their own buttons, but cursor-up and
       cursor-left had to share?!)
     * = is moved to the backslash above Enter (on a US keyboard)
     * £ is moved to the backtick to the left of 1 (on a US keyboard)
     * CLR HOME is moved to F8, and, if your keyboard features it, Home. If
       you have a numeric keypad with a Clear key (like the Mac extended
       keyboard), it will effect a left-shift and CLR HOME.
     * RESTORE is presently unmapped, mostly because it's connected to the NMI
       line rather than the keyboard matrix. Still, it would be nice to get it
       in someday, not that we have an obvious physical space for it.

   Reference: see
     https://hacks.mozilla.org/2017/03/internationalize-your-keyboard-controls/
  
   Note that, unlike event.key, and unlike what the names of its values would
   suggest, event.code tells you the physical location of the key that was
   pressed. So an event.code of "KeyQ" means you'd hit the "Q" of a QWERTY
   keyboard *or* the "A" of a French AZERTY keyboard. A "KeyY" means you'd hit
   the Y of a QWERTY keyboard, or the Z of a German QWERTZ keyboard.
*/

const eventCodeToButtonNames = {

  // Top row, left-to-right
  "ArrowLeft":      ["LeftArrow"],    // Not where you might expect
  "Digit1":         ["Num1"],
  "Digit2":         ["Num2"],
  "Digit3":         ["Num3"],
  "Digit4":         ["Num4"],
  "Digit5":         ["Num5"],
  "Digit6":         ["Num6"],
  "Digit7":         ["Num7"],
  "Digit8":         ["Num8"],
  "Digit9":         ["Num9"],
  "Digit0":         ["Num0"],
  "Minus":          ["Plus"],
  "Equal":          ["Minus"],
  "Backquote":      ["Pound"],        // Not where you might expect
  "F8":             ["ClrHome"],      // Not where you might expect
  "Backspace":      ["InstDel"],

  // Second row, left-to-right
  "Tab":            ["Ctrl"],
  "KeyQ":           ["Q"],
  "KeyW":           ["W"],
  "KeyE":           ["E"],
  "KeyR":           ["R"],
  "KeyT":           ["T"],
  "KeyY":           ["Y"],
  "KeyU":           ["U"],
  "KeyI":           ["I"],
  "KeyO":           ["O"],
  "KeyP":           ["P"],
  "BracketLeft":    ["At"],
  "BracketRight":   ["Asterisk"],
  "ArrowUp":        ["UpArrow"],      // Not where you might expect

  // Third row, left-to-right
  "Escape":         ["RunStop"],
  "KeyA":           ["A"],
  "KeyS":           ["S"],
  "KeyD":           ["D"],
  "KeyF":           ["F"],
  "KeyG":           ["G"],
  "KeyH":           ["H"],
  "KeyJ":           ["J"],
  "KeyK":           ["K"],
  "KeyL":           ["L"],
  "Semicolon":      ["Colon"],
  "Quote":          ["Semicolon"],
  "Backslash":      ["Equal"],        // Not where you might expect
  "Enter":          ["Return"],

  // Fourth row, left-to-right
  "AltLeft":        ["Commodore"],
  "ShiftLeft":      ["LeftShift"],
  "KeyZ":           ["Z"],
  "KeyX":           ["X"],
  "KeyC":           ["C"],
  "KeyV":           ["V"],
  "KeyB":           ["B"],
  "KeyN":           ["N"],
  "KeyM":           ["M"],
  "Comma":          ["Comma"],
  "Period":         ["Period"],
  "Slash":          ["Slash"],
  "ShiftRight":     ["RightShift"],
  "ArrowDown":      ["CursorDown"],
  "ArrowRight":     ["CursorRight"],

  // Fifth row, left-to-right
  "Space":          ["Space"],

  // Function keys
  "F1":             ["F1"],
  "F3":             ["F3"],
  "F5":             ["F5"],
  "F7":             ["F7"],

  // Above that's a 1:1 mapping of everything. Now let's map some extra keys,
  // if your keyboard has them, to something vaguely intuitive:
  "Home":           ["ClrHome"],
  "Clear":          ["Home", "LeftShift"],
  "Delete":         ["InstDel"],
  "Numpad0":        ["Num0"],
  "Numpad1":        ["Num1"],
  "Numpad2":        ["Num2"],
  "Numpad3":        ["Num3"],
  "Numpad4":        ["Num4"],
  "Numpad5":        ["Num5"],
  "Numpad6":        ["Num6"],
  "Numpad7":        ["Num7"],
  "Numpad8":        ["Num8"],
  "Numpad9":        ["Num9"],
  "NumpadEqual":    ["Equal"],
  "NumpadDivide":   ["Slash"],
  "NumpadMultiply": ["Asterisk"],
  "NumpadSubtract": ["Minus"],
  "NumpadAdd":      ["Plus"],
  "NumpadEnter":    ["Return"],
  "F2":             ["F1", "LeftShift"],
  "F4":             ["F3", "LeftShift"],
  "F6":             ["F5", "LeftShift"],
  "F8":             ["F7", "LeftShift"],
}

export function eventToButtonNames(event) {
  return eventCodeToButtonNames[event.code];
}

export function keyStackToButtonNames(keyStack) {
  // For the direct keyboard handler, we're stacking all the pressed keys on
  // top of each other.
  const buttons = new Set();

  keyStack.forEach(
    ({ buttonNames }) => (
      buttonNames.forEach(
        buttonName => buttons.add(buttonName)
      )
    )
  );

  return Array.from(buttons);
}
