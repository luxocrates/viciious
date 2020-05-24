/*
   Column-row combinations for the C64's physical keys
  
   Example: Commodore key is [7, 5], meaning that if, when writing to CIA1
   port A ($dc00), I set the keyboard scan to column 7 (by writing bit 7, so
   0b10000000), I'd expect to see the status of the Commodore key in bit 5 when
   reading CIA1 port B.
  
   Note that the Restore key doesn't have a position in this table: it's wired
   directly to the NMI line and has no position in the matrix. There's no
   separate entry for Shift Lock either.
 */

export const buttonNameToMatrixPos = {
  RunStop:      [ 7, 7 ],
  Q:            [ 7, 6 ],
  Commodore:    [ 7, 5 ],   // unmapped in natural
  Space:        [ 7, 4 ],
  Num2:         [ 7, 3 ],
  Ctrl:         [ 7, 2 ],
  LeftArrow:    [ 7, 1 ],   // the key that draws a '←', not cursor-left
  Num1:         [ 7, 0 ],

  Slash:        [ 6, 7 ],
  UpArrow:      [ 6, 6 ],   // the key that draws a '↑', not cursor-up
  Equal:        [ 6, 5 ],
  RightShift:   [ 6, 4 ],   // unmapped in natural
  ClrHome:      [ 6, 3 ],
  Semicolon:    [ 6, 2 ],
  Asterisk:     [ 6, 1 ],
  Pound:        [ 6, 0 ],

  Comma:        [ 5, 7 ],
  At:           [ 5, 6 ],
  Colon:        [ 5, 5 ],
  Period:       [ 5, 4 ],
  Minus:        [ 5, 3 ],
  L:            [ 5, 2 ],
  P:            [ 5, 1 ],
  Plus:         [ 5, 0 ],

  N:            [ 4, 7 ],
  O:            [ 4, 6 ],
  K:            [ 4, 5 ],
  M:            [ 4, 4 ],
  Num0:         [ 4, 3 ],
  J:            [ 4, 2 ],
  I:            [ 4, 1 ],
  Num9:         [ 4, 0 ],

  V:            [ 3, 7 ],
  U:            [ 3, 6 ],
  H:            [ 3, 5 ],
  B:            [ 3, 4 ],
  Num8:         [ 3, 3 ],
  G:            [ 3, 2 ],
  Y:            [ 3, 1 ],
  Num7:         [ 3, 0 ],

  X:            [ 2, 7 ],
  T:            [ 2, 6 ],
  F:            [ 2, 5 ],
  C:            [ 2, 4 ],
  Num6:         [ 2, 3 ],
  D:            [ 2, 2 ],
  R:            [ 2, 1 ],
  Num5:         [ 2, 0 ],

  LeftShift:    [ 1, 7 ],
  E:            [ 1, 6 ],
  S:            [ 1, 5 ],
  Z:            [ 1, 4 ],
  Num4:         [ 1, 3 ],
  A:            [ 1, 2 ],
  W:            [ 1, 1 ],
  Num3:         [ 1, 0 ],

  CursorDown:   [ 0, 7 ],
  F5:           [ 0, 6 ],
  F3:           [ 0, 5 ],
  F1:           [ 0, 4 ],
  F7:           [ 0, 3 ],
  CursorRight:  [ 0, 2 ],
  Return:       [ 0, 1 ],
  InstDel:      [ 0, 0 ],
};
