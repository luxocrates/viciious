// Addresses of notable routines and buffers in Basic or Kernal. 
// Handy for use as breakpoints when controlling the runloop from a script.

// Warm start (prints the READY. prompt)
export const READY_PC = 0xa474;

// A loop that waits for a key to be typed
export const AWAIT_KEYBOARD_PC = 0xe5cd;

// Clear screen
export const CLEAR_SCREEN_PC = 0xe544;


// Below are address that aren't ROM locations, but magic numbers hardcoded
// into the ROM routines.

// Cursor color code
export const CURSOR_COL_ADDR = 0x0286;

// The keyboard buffer
export const KEYBOARD_BUFFER_ADDR   = 0x0277; // 'keyd'
export const KEYBOARD_BUFFER_INDEX  = 0x00c6; // 'ndx'
export const KEYBOARD_BUFFER_LENGTH = 10;
