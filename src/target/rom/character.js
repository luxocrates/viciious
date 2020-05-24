/*
   Characters ($d000 – $efff, when mapped)

   The source below assembles into a bytestream fully compatible with the C64's
   character ROM.

   If you want to substitute your own ROM, just export a byte array instead:
       export default [ 0x.., ... ];

   Unlike the rest of the Viciious project, which was authored from scratch and
   entered into the public domain, the source below is derived from works by
   multiple other authors and I make no representations as to its ownership or
   terms of use.
*/

export default [

  // Unshifted $00 (0) >@<
  "  XXXX  ",
  " XX  XX ",
  " XX XXX ",
  " XX XXX ",
  " XX     ",
  " XX   X ",
  "  XXXX  ",
  "        ",

  // Unshifted $01 (1) >A<
  "   XX   ",
  "  XXXX  ",
  " XX  XX ",
  " XXXXXX ",
  " XX  XX ",
  " XX  XX ",
  " XX  XX ",
  "        ",

  // Unshifted $02 (2) >B<
  " XXXXX  ",
  " XX  XX ",
  " XX  XX ",
  " XXXXX  ",
  " XX  XX ",
  " XX  XX ",
  " XXXXX  ",
  "        ",

  // Unshifted $03 (3) >C<
  "  XXXX  ",
  " XX  XX ",
  " XX     ",
  " XX     ",
  " XX     ",
  " XX  XX ",
  "  XXXX  ",
  "        ",

  // Unshifted $04 (4) >D<
  " XXXX   ",
  " XX XX  ",
  " XX  XX ",
  " XX  XX ",
  " XX  XX ",
  " XX XX  ",
  " XXXX   ",
  "        ",

  // Unshifted $05 (5) >E<
  " XXXXXX ",
  " XX     ",
  " XX     ",
  " XXXX   ",
  " XX     ",
  " XX     ",
  " XXXXXX ",
  "        ",

  // Unshifted $06 (6) >F<
  " XXXXXX ",
  " XX     ",
  " XX     ",
  " XXXX   ",
  " XX     ",
  " XX     ",
  " XX     ",
  "        ",

  // Unshifted $07 (7) >G<
  "  XXXX  ",
  " XX  XX ",
  " XX     ",
  " XX XXX ",
  " XX  XX ",
  " XX  XX ",
  "  XXXX  ",
  "        ",

  // Unshifted $08 (8) >H<
  " XX  XX ",
  " XX  XX ",
  " XX  XX ",
  " XXXXXX ",
  " XX  XX ",
  " XX  XX ",
  " XX  XX ",
  "        ",

  // Unshifted $09 (9) >I<
  "  XXXX  ",
  "   XX   ",
  "   XX   ",
  "   XX   ",
  "   XX   ",
  "   XX   ",
  "  XXXX  ",
  "        ",

  // Unshifted $0a (10) >J<
  "   XXXX ",
  "    XX  ",
  "    XX  ",
  "    XX  ",
  "    XX  ",
  " XX XX  ",
  "  XXX   ",
  "        ",

  // Unshifted $0b (11) >K<
  " XX  XX ",
  " XX XX  ",
  " XXXX   ",
  " XXX    ",
  " XXXX   ",
  " XX XX  ",
  " XX  XX ",
  "        ",

  // Unshifted $0c (12) >L<
  " XX     ",
  " XX     ",
  " XX     ",
  " XX     ",
  " XX     ",
  " XX     ",
  " XXXXXX ",
  "        ",

  // Unshifted $0d (13) >M<
  " XX   XX",
  " XXX XXX",
  " XXXXXXX",
  " XX X XX",
  " XX   XX",
  " XX   XX",
  " XX   XX",
  "        ",

  // Unshifted $0e (14) >N<
  " XX  XX ",
  " XXX XX ",
  " XXXXXX ",
  " XXXXXX ",
  " XX XXX ",
  " XX  XX ",
  " XX  XX ",
  "        ",

  // Unshifted $0f (15) >O<
  "  XXXX  ",
  " XX  XX ",
  " XX  XX ",
  " XX  XX ",
  " XX  XX ",
  " XX  XX ",
  "  XXXX  ",
  "        ",

  // Unshifted $10 (16) >P<
  " XXXXX  ",
  " XX  XX ",
  " XX  XX ",
  " XXXXX  ",
  " XX     ",
  " XX     ",
  " XX     ",
  "        ",

  // Unshifted $11 (17) >Q<
  "  XXXX  ",
  " XX  XX ",
  " XX  XX ",
  " XX  XX ",
  " XX  XX ",
  "  XXXX  ",
  "    XXX ",
  "        ",

  // Unshifted $12 (18) >R<
  " XXXXX  ",
  " XX  XX ",
  " XX  XX ",
  " XXXXX  ",
  " XXXX   ",
  " XX XX  ",
  " XX  XX ",
  "        ",

  // Unshifted $13 (19) >S<
  "  XXXX  ",
  " XX  XX ",
  " XX     ",
  "  XXXX  ",
  "     XX ",
  " XX  XX ",
  "  XXXX  ",
  "        ",

  // Unshifted $14 (20) >T<
  " XXXXXX ",
  "   XX   ",
  "   XX   ",
  "   XX   ",
  "   XX   ",
  "   XX   ",
  "   XX   ",
  "        ",

  // Unshifted $15 (21) >U<
  " XX  XX ",
  " XX  XX ",
  " XX  XX ",
  " XX  XX ",
  " XX  XX ",
  " XX  XX ",
  "  XXXX  ",
  "        ",

  // Unshifted $16 (22) >V<
  " XX  XX ",
  " XX  XX ",
  " XX  XX ",
  " XX  XX ",
  " XX  XX ",
  "  XXXX  ",
  "   XX   ",
  "        ",

  // Unshifted $17 (23) >W<
  " XX   XX",
  " XX   XX",
  " XX   XX",
  " XX X XX",
  " XXXXXXX",
  " XXX XXX",
  " XX   XX",
  "        ",

  // Unshifted $18 (24) >X<
  " XX  XX ",
  " XX  XX ",
  "  XXXX  ",
  "   XX   ",
  "  XXXX  ",
  " XX  XX ",
  " XX  XX ",
  "        ",

  // Unshifted $19 (25) >Y<
  " XX  XX ",
  " XX  XX ",
  " XX  XX ",
  "  XXXX  ",
  "   XX   ",
  "   XX   ",
  "   XX   ",
  "        ",

  // Unshifted $1a (26) >Z<
  " XXXXXX ",
  "     XX ",
  "    XX  ",
  "   XX   ",
  "  XX    ",
  " XX     ",
  " XXXXXX ",
  "        ",

  // Unshifted $1b (27) >[<
  "  XXXX  ",
  "  XX    ",
  "  XX    ",
  "  XX    ",
  "  XX    ",
  "  XX    ",
  "  XXXX  ",
  "        ",

  // Unshifted $1c (28) >£<
  "    XX  ",
  "   X  X ",
  "  XX    ",
  " XXXXX  ",
  "  XX    ",
  " XX   X ",
  "XXXXXX  ",
  "        ",

  // Unshifted $1d (29) >]<
  "  XXXX  ",
  "    XX  ",
  "    XX  ",
  "    XX  ",
  "    XX  ",
  "    XX  ",
  "  XXXX  ",
  "        ",

  // Unshifted $1e (30) >↑<
  "        ",
  "   XX   ",
  "  XXXX  ",
  " XXXXXX ",
  "   XX   ",
  "   XX   ",
  "   XX   ",
  "   XX   ",

  // Unshifted $1f (31) >←<
  "        ",
  "   X    ",
  "  XX    ",
  " XXXXXXX",
  " XXXXXXX",
  "  XX    ",
  "   X    ",
  "        ",

  // Unshifted $20 (32) > <
  "        ",
  "        ",
  "        ",
  "        ",
  "        ",
  "        ",
  "        ",
  "        ",

  // Unshifted $21 (33) >!<
  "   XX   ",
  "   XX   ",
  "   XX   ",
  "   XX   ",
  "        ",
  "        ",
  "   XX   ",
  "        ",

  // Unshifted $22 (34) >"<
  " XX  XX ",
  " XX  XX ",
  " XX  XX ",
  "        ",
  "        ",
  "        ",
  "        ",
  "        ",

  // Unshifted $23 (35) >#<
  " XX  XX ",
  " XX  XX ",
  "XXXXXXXX",
  " XX  XX ",
  "XXXXXXXX",
  " XX  XX ",
  " XX  XX ",
  "        ",

  // Unshifted $24 (36) >$<
  "   XX   ",
  "  XXXXX ",
  " XX     ",
  "  XXXX  ",
  "     XX ",
  " XXXXX  ",
  "   XX   ",
  "        ",

  // Unshifted $25 (37) >%<
  " XX   X ",
  " XX  XX ",
  "    XX  ",
  "   XX   ",
  "  XX    ",
  " XX  XX ",
  " X   XX ",
  "        ",

  // Unshifted $26 (38) >&<
  "  XXXX  ",
  " XX  XX ",
  "  XXXX  ",
  "  XXX   ",
  " XX  XXX",
  " XX  XX ",
  "  XXXXXX",
  "        ",

  // Unshifted $27 (39) >'<
  "     XX ",
  "    XX  ",
  "   XX   ",
  "        ",
  "        ",
  "        ",
  "        ",
  "        ",

  // Unshifted $28 (40) >(<
  "    XX  ",
  "   XX   ",
  "  XX    ",
  "  XX    ",
  "  XX    ",
  "   XX   ",
  "    XX  ",
  "        ",

  // Unshifted $29 (41) >)<
  "  XX    ",
  "   XX   ",
  "    XX  ",
  "    XX  ",
  "    XX  ",
  "   XX   ",
  "  XX    ",
  "        ",

  // Unshifted $2a (42) >*<
  "        ",
  " XX  XX ",
  "  XXXX  ",
  "XXXXXXXX",
  "  XXXX  ",
  " XX  XX ",
  "        ",
  "        ",

  // Unshifted $2b (43) >+<
  "        ",
  "   XX   ",
  "   XX   ",
  " XXXXXX ",
  "   XX   ",
  "   XX   ",
  "        ",
  "        ",

  // Unshifted $2c (44) >,<
  "        ",
  "        ",
  "        ",
  "        ",
  "        ",
  "   XX   ",
  "   XX   ",
  "  XX    ",

  // Unshifted $2d (45) >-<
  "        ",
  "        ",
  "        ",
  " XXXXXX ",
  "        ",
  "        ",
  "        ",
  "        ",

  // Unshifted $2e (46) >.<
  "        ",
  "        ",
  "        ",
  "        ",
  "        ",
  "   XX   ",
  "   XX   ",
  "        ",

  // Unshifted $2f (47) >/<
  "        ",
  "      XX",
  "     XX ",
  "    XX  ",
  "   XX   ",
  "  XX    ",
  " XX     ",
  "        ",

  // Unshifted $30 (48) >0<
  "  XXXX  ",
  " XX  XX ",
  " XX XXX ",
  " XXX XX ",
  " XX  XX ",
  " XX  XX ",
  "  XXXX  ",
  "        ",

  // Unshifted $31 (49) >1<
  "   XX   ",
  "   XX   ",
  "  XXX   ",
  "   XX   ",
  "   XX   ",
  "   XX   ",
  " XXXXXX ",
  "        ",

  // Unshifted $32 (50) >2<
  "  XXXX  ",
  " XX  XX ",
  "     XX ",
  "    XX  ",
  "  XX    ",
  " XX     ",
  " XXXXXX ",
  "        ",

  // Unshifted $33 (51) >3<
  "  XXXX  ",
  " XX  XX ",
  "     XX ",
  "   XXX  ",
  "     XX ",
  " XX  XX ",
  "  XXXX  ",
  "        ",

  // Unshifted $34 (52) >4<
  "     XX ",
  "    XXX ",
  "   XXXX ",
  " XX  XX ",
  " XXXXXXX",
  "     XX ",
  "     XX ",
  "        ",

  // Unshifted $35 (53) >5<
  " XXXXXX ",
  " XX     ",
  " XXXXX  ",
  "     XX ",
  "     XX ",
  " XX  XX ",
  "  XXXX  ",
  "        ",

  // Unshifted $36 (54) >6<
  "  XXXX  ",
  " XX  XX ",
  " XX     ",
  " XXXXX  ",
  " XX  XX ",
  " XX  XX ",
  "  XXXX  ",
  "        ",

  // Unshifted $37 (55) >7<
  " XXXXXX ",
  " XX  XX ",
  "    XX  ",
  "   XX   ",
  "   XX   ",
  "   XX   ",
  "   XX   ",
  "        ",

  // Unshifted $38 (56) >8<
  "  XXXX  ",
  " XX  XX ",
  " XX  XX ",
  "  XXXX  ",
  " XX  XX ",
  " XX  XX ",
  "  XXXX  ",
  "        ",

  // Unshifted $39 (57) >9<
  "  XXXX  ",
  " XX  XX ",
  " XX  XX ",
  "  XXXXX ",
  "     XX ",
  " XX  XX ",
  "  XXXX  ",
  "        ",

  // Unshifted $3a (58) >:<
  "        ",
  "        ",
  "   XX   ",
  "        ",
  "        ",
  "   XX   ",
  "        ",
  "        ",

  // Unshifted $3b (59) >;<
  "        ",
  "        ",
  "   XX   ",
  "        ",
  "        ",
  "   XX   ",
  "   XX   ",
  "  XX    ",

  // Unshifted $3c (60) ><<
  "    XXX ",
  "   XX   ",
  "  XX    ",
  " XX     ",
  "  XX    ",
  "   XX   ",
  "    XXX ",
  "        ",

  // Unshifted $3d (61) >=<
  "        ",
  "        ",
  " XXXXXX ",
  "        ",
  " XXXXXX ",
  "        ",
  "        ",
  "        ",

  // Unshifted $3e (62) >><
  " XXX    ",
  "   XX   ",
  "    XX  ",
  "     XX ",
  "    XX  ",
  "   XX   ",
  " XXX    ",
  "        ",

  // Unshifted $3f (63) >?<
  "  XXXX  ",
  " XX  XX ",
  "     XX ",
  "    XX  ",
  "   XX   ",
  "        ",
  "   XX   ",
  "        ",

  // Unshifted $40 (64) >─<
  "        ",
  "        ",
  "        ",
  "XXXXXXXX",
  "XXXXXXXX",
  "        ",
  "        ",
  "        ",

  // Unshifted $41 (65) >♠<
  "    X   ",
  "   XXX  ",
  "  XXXXX ",
  " XXXXXXX",
  " XXXXXXX",
  "   XXX  ",
  "  XXXXX ",
  "        ",

  // Unshifted $42 (66) >│<
  "   XX   ",
  "   XX   ",
  "   XX   ",
  "   XX   ",
  "   XX   ",
  "   XX   ",
  "   XX   ",
  "   XX   ",

  // Unshifted $43 (67) >─<
  "        ",
  "        ",
  "        ",
  "XXXXXXXX",
  "XXXXXXXX",
  "        ",
  "        ",
  "        ",

  // Unshifted $44 (68) >─<
  "        ",
  "        ",
  "XXXXXXXX",
  "XXXXXXXX",
  "        ",
  "        ",
  "        ",
  "        ",

  // Unshifted $45 (69) >▔<
  "        ",
  "XXXXXXXX",
  "XXXXXXXX",
  "        ",
  "        ",
  "        ",
  "        ",
  "        ",

  // Unshifted $46 (70) >─<
  "        ",
  "        ",
  "        ",
  "        ",
  "XXXXXXXX",
  "XXXXXXXX",
  "        ",
  "        ",

  // Unshifted $47 (71) >│<
  "  XX    ",
  "  XX    ",
  "  XX    ",
  "  XX    ",
  "  XX    ",
  "  XX    ",
  "  XX    ",
  "  XX    ",

  // Unshifted $48 (72) >│<
  "    XX  ",
  "    XX  ",
  "    XX  ",
  "    XX  ",
  "    XX  ",
  "    XX  ",
  "    XX  ",
  "    XX  ",

  // Unshifted $49 (73) >╮<
  "        ",
  "        ",
  "        ",
  "XXX     ",
  "XXXX    ",
  "  XXX   ",
  "   XX   ",
  "   XX   ",

  // Unshifted $4a (74) >╰<
  "   XX   ",
  "   XX   ",
  "   XXX  ",
  "    XXXX",
  "     XXX",
  "        ",
  "        ",
  "        ",

  // Unshifted $4b (75) >╯<
  "   XX   ",
  "   XX   ",
  "  XXX   ",
  "XXXX    ",
  "XXX     ",
  "        ",
  "        ",
  "        ",

  // Unshifted $4c (76) >⌞<
  "XX      ",
  "XX      ",
  "XX      ",
  "XX      ",
  "XX      ",
  "XX      ",
  "XXXXXXXX",
  "XXXXXXXX",

  // Unshifted $4d (77) >╲<
  "XX      ",
  "XXX     ",
  " XXX    ",
  "  XXX   ",
  "   XXX  ",
  "    XXX ",
  "     XXX",
  "      XX",

  // Unshifted $4e (78) >╱<
  "      XX",
  "     XXX",
  "    XXX ",
  "   XXX  ",
  "  XXX   ",
  " XXX    ",
  "XXX     ",
  "XX      ",

  // Unshifted $4f (79) >⌜<
  "XXXXXXXX",
  "XXXXXXXX",
  "XX      ",
  "XX      ",
  "XX      ",
  "XX      ",
  "XX      ",
  "XX      ",

  // Unshifted $50 (80) >⌝<
  "XXXXXXXX",
  "XXXXXXXX",
  "      XX",
  "      XX",
  "      XX",
  "      XX",
  "      XX",
  "      XX",

  // Unshifted $51 (81) >●<
  "        ",
  "  XXXX  ",
  " XXXXXX ",
  " XXXXXX ",
  " XXXXXX ",
  " XXXXXX ",
  "  XXXX  ",
  "        ",

  // Unshifted $52 (82) >_<
  "        ",
  "        ",
  "        ",
  "        ",
  "        ",
  "XXXXXXXX",
  "XXXXXXXX",
  "        ",

  // Unshifted $53 (83) >♥<
  "  XX XX ",
  " XXXXXXX",
  " XXXXXXX",
  " XXXXXXX",
  "  XXXXX ",
  "   XXX  ",
  "    X   ",
  "        ",

  // Unshifted $54 (84) >▎<
  " XX     ",
  " XX     ",
  " XX     ",
  " XX     ",
  " XX     ",
  " XX     ",
  " XX     ",
  " XX     ",

  // Unshifted $55 (85) >╭<
  "        ",
  "        ",
  "        ",
  "     XXX",
  "    XXXX",
  "   XXX  ",
  "   XX   ",
  "   XX   ",

  // Unshifted $56 (86) >╳<
  "XX    XX",
  "XXX  XXX",
  " XXXXXX ",
  "  XXXX  ",
  "  XXXX  ",
  " XXXXXX ",
  "XXX  XXX",
  "XX    XX",

  // Unshifted $57 (87) >○<
  "        ",
  "  XXXX  ",
  " XXXXXX ",
  " XX  XX ",
  " XX  XX ",
  " XXXXXX ",
  "  XXXX  ",
  "        ",

  // Unshifted $58 (88) >♣<
  "   XX   ",
  "   XX   ",
  " XX  XX ",
  " XX  XX ",
  "   XX   ",
  "   XX   ",
  "  XXXX  ",
  "        ",

  // Unshifted $59 (89) >▕<
  "     XX ",
  "     XX ",
  "     XX ",
  "     XX ",
  "     XX ",
  "     XX ",
  "     XX ",
  "     XX ",

  // Unshifted $5a (90) >♦<
  "    X   ",
  "   XXX  ",
  "  XXXXX ",
  " XXXXXXX",
  "  XXXXX ",
  "   XXX  ",
  "    X   ",
  "        ",

  // Unshifted $5b (91) >┼<
  "   XX   ",
  "   XX   ",
  "   XX   ",
  "XXXXXXXX",
  "XXXXXXXX",
  "   XX   ",
  "   XX   ",
  "   XX   ",

  // Unshifted $5c (92) >▒<
  "XX      ",
  "XX      ",
  "  XX    ",
  "  XX    ",
  "XX      ",
  "XX      ",
  "  XX    ",
  "  XX    ",

  // Unshifted $5d (93) >│<
  "   XX   ",
  "   XX   ",
  "   XX   ",
  "   XX   ",
  "   XX   ",
  "   XX   ",
  "   XX   ",
  "   XX   ",

  // Unshifted $5e (94) >π<
  "        ",
  "        ",
  "      XX",
  "  XXXXX ",
  " XXX XX ",
  "  XX XX ",
  "  XX XX ",
  "        ",

  // Unshifted $5f (95) >◥<
  "XXXXXXXX",
  " XXXXXXX",
  "  XXXXXX",
  "   XXXXX",
  "    XXXX",
  "     XXX",
  "      XX",
  "       X",

  // Unshifted $60 (96) > <
  "        ",
  "        ",
  "        ",
  "        ",
  "        ",
  "        ",
  "        ",
  "        ",

  // Unshifted $61 (97) >▌<
  "XXXX    ",
  "XXXX    ",
  "XXXX    ",
  "XXXX    ",
  "XXXX    ",
  "XXXX    ",
  "XXXX    ",
  "XXXX    ",

  // Unshifted $62 (98) >▄<
  "        ",
  "        ",
  "        ",
  "        ",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",

  // Unshifted $63 (99) >▔<
  "XXXXXXXX",
  "        ",
  "        ",
  "        ",
  "        ",
  "        ",
  "        ",
  "        ",

  // Unshifted $64 (100) >▁<
  "        ",
  "        ",
  "        ",
  "        ",
  "        ",
  "        ",
  "        ",
  "XXXXXXXX",

  // Unshifted $65 (101) >▎<
  "XX      ",
  "XX      ",
  "XX      ",
  "XX      ",
  "XX      ",
  "XX      ",
  "XX      ",
  "XX      ",

  // Unshifted $66 (102) >▒<
  "XX  XX  ",
  "XX  XX  ",
  "  XX  XX",
  "  XX  XX",
  "XX  XX  ",
  "XX  XX  ",
  "  XX  XX",
  "  XX  XX",

  // Unshifted $67 (103) >▕<
  "      XX",
  "      XX",
  "      XX",
  "      XX",
  "      XX",
  "      XX",
  "      XX",
  "      XX",

  // Unshifted $68 (104) >▒<
  "        ",
  "        ",
  "        ",
  "        ",
  "XX  XX  ",
  "XX  XX  ",
  "  XX  XX",
  "  XX  XX",

  // Unshifted $69 (105) >◤<
  "XXXXXXXX",
  "XXXXXXX ",
  "XXXXXX  ",
  "XXXXX   ",
  "XXXX    ",
  "XXX     ",
  "XX      ",
  "X       ",

  // Unshifted $6a (106) >▕<
  "      XX",
  "      XX",
  "      XX",
  "      XX",
  "      XX",
  "      XX",
  "      XX",
  "      XX",

  // Unshifted $6b (107) >├<
  "   XX   ",
  "   XX   ",
  "   XX   ",
  "   XXXXX",
  "   XXXXX",
  "   XX   ",
  "   XX   ",
  "   XX   ",

  // Unshifted $6c (108) >▗<
  "        ",
  "        ",
  "        ",
  "        ",
  "    XXXX",
  "    XXXX",
  "    XXXX",
  "    XXXX",

  // Unshifted $6d (109) >└<
  "   XX   ",
  "   XX   ",
  "   XX   ",
  "   XXXXX",
  "   XXXXX",
  "        ",
  "        ",
  "        ",

  // Unshifted $6e (110) >┐<
  "        ",
  "        ",
  "        ",
  "XXXXX   ",
  "XXXXX   ",
  "   XX   ",
  "   XX   ",
  "   XX   ",

  // Unshifted $6f (111) >▂<
  "        ",
  "        ",
  "        ",
  "        ",
  "        ",
  "        ",
  "XXXXXXXX",
  "XXXXXXXX",

  // Unshifted $70 (112) >┌<
  "        ",
  "        ",
  "        ",
  "   XXXXX",
  "   XXXXX",
  "   XX   ",
  "   XX   ",
  "   XX   ",

  // Unshifted $71 (113) >┴<
  "   XX   ",
  "   XX   ",
  "   XX   ",
  "XXXXXXXX",
  "XXXXXXXX",
  "        ",
  "        ",
  "        ",

  // Unshifted $72 (114) >┬<
  "        ",
  "        ",
  "        ",
  "XXXXXXXX",
  "XXXXXXXX",
  "   XX   ",
  "   XX   ",
  "   XX   ",

  // Unshifted $73 (115) >┤<
  "   XX   ",
  "   XX   ",
  "   XX   ",
  "XXXXX   ",
  "XXXXX   ",
  "   XX   ",
  "   XX   ",
  "   XX   ",

  // Unshifted $74 (116) >▎<
  "XX      ",
  "XX      ",
  "XX      ",
  "XX      ",
  "XX      ",
  "XX      ",
  "XX      ",
  "XX      ",

  // Unshifted $75 (117) >▍<
  "XXX     ",
  "XXX     ",
  "XXX     ",
  "XXX     ",
  "XXX     ",
  "XXX     ",
  "XXX     ",
  "XXX     ",

  // Unshifted $76 (118) >▕<
  "     XXX",
  "     XXX",
  "     XXX",
  "     XXX",
  "     XXX",
  "     XXX",
  "     XXX",
  "     XXX",

  // Unshifted $77 (119) >▔<
  "XXXXXXXX",
  "XXXXXXXX",
  "        ",
  "        ",
  "        ",
  "        ",
  "        ",
  "        ",

  // Unshifted $78 (120) >▔<
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "        ",
  "        ",
  "        ",
  "        ",
  "        ",

  // Unshifted $79 (121) >▃<
  "        ",
  "        ",
  "        ",
  "        ",
  "        ",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",

  // Unshifted $7a (122) >⌟<
  "      XX",
  "      XX",
  "      XX",
  "      XX",
  "      XX",
  "      XX",
  "XXXXXXXX",
  "XXXXXXXX",

  // Unshifted $7b (123) >▖<
  "        ",
  "        ",
  "        ",
  "        ",
  "XXXX    ",
  "XXXX    ",
  "XXXX    ",
  "XXXX    ",

  // Unshifted $7c (124) >▝<
  "    XXXX",
  "    XXXX",
  "    XXXX",
  "    XXXX",
  "        ",
  "        ",
  "        ",
  "        ",

  // Unshifted $7d (125) >┘<
  "   XX   ",
  "   XX   ",
  "   XX   ",
  "XXXXX   ",
  "XXXXX   ",
  "        ",
  "        ",
  "        ",

  // Unshifted $7e (126) >▘<
  "XXXX    ",
  "XXXX    ",
  "XXXX    ",
  "XXXX    ",
  "        ",
  "        ",
  "        ",
  "        ",

  // Unshifted $7f (127) >▚<
  "XXXX    ",
  "XXXX    ",
  "XXXX    ",
  "XXXX    ",
  "    XXXX",
  "    XXXX",
  "    XXXX",
  "    XXXX",

  // Unshifted $80 (128) >@<
  "XX    XX",
  "X  XX  X",
  "X  X   X",
  "X  X   X",
  "X  XXXXX",
  "X  XX  X",
  "XX    XX",
  "XXXXXXXX",

  // Unshifted $81 (129) >A<
  "XXX  XXX",
  "XX    XX",
  "X  XX  X",
  "X      X",
  "X  XX  X",
  "X  XX  X",
  "X  XX  X",
  "XXXXXXXX",

  // Unshifted $82 (130) >B<
  "X     XX",
  "X  XX  X",
  "X  XX  X",
  "X     XX",
  "X  XX  X",
  "X  XX  X",
  "X     XX",
  "XXXXXXXX",

  // Unshifted $83 (131) >C<
  "XX    XX",
  "X  XX  X",
  "X  XXXXX",
  "X  XXXXX",
  "X  XXXXX",
  "X  XX  X",
  "XX    XX",
  "XXXXXXXX",

  // Unshifted $84 (132) >D<
  "X    XXX",
  "X  X  XX",
  "X  XX  X",
  "X  XX  X",
  "X  XX  X",
  "X  X  XX",
  "X    XXX",
  "XXXXXXXX",

  // Unshifted $85 (133) >E<
  "X      X",
  "X  XXXXX",
  "X  XXXXX",
  "X    XXX",
  "X  XXXXX",
  "X  XXXXX",
  "X      X",
  "XXXXXXXX",

  // Unshifted $86 (134) >F<
  "X      X",
  "X  XXXXX",
  "X  XXXXX",
  "X    XXX",
  "X  XXXXX",
  "X  XXXXX",
  "X  XXXXX",
  "XXXXXXXX",

  // Unshifted $87 (135) >G<
  "XX    XX",
  "X  XX  X",
  "X  XXXXX",
  "X  X   X",
  "X  XX  X",
  "X  XX  X",
  "XX    XX",
  "XXXXXXXX",

  // Unshifted $88 (136) >H<
  "X  XX  X",
  "X  XX  X",
  "X  XX  X",
  "X      X",
  "X  XX  X",
  "X  XX  X",
  "X  XX  X",
  "XXXXXXXX",

  // Unshifted $89 (137) >I<
  "XX    XX",
  "XXX  XXX",
  "XXX  XXX",
  "XXX  XXX",
  "XXX  XXX",
  "XXX  XXX",
  "XX    XX",
  "XXXXXXXX",

  // Unshifted $8a (138) >J<
  "XXX    X",
  "XXXX  XX",
  "XXXX  XX",
  "XXXX  XX",
  "XXXX  XX",
  "X  X  XX",
  "XX   XXX",
  "XXXXXXXX",

  // Unshifted $8b (139) >K<
  "X  XX  X",
  "X  X  XX",
  "X    XXX",
  "X   XXXX",
  "X    XXX",
  "X  X  XX",
  "X  XX  X",
  "XXXXXXXX",

  // Unshifted $8c (140) >L<
  "X  XXXXX",
  "X  XXXXX",
  "X  XXXXX",
  "X  XXXXX",
  "X  XXXXX",
  "X  XXXXX",
  "X      X",
  "XXXXXXXX",

  // Unshifted $8d (141) >M<
  "X  XXX  ",
  "X   X   ",
  "X       ",
  "X  X X  ",
  "X  XXX  ",
  "X  XXX  ",
  "X  XXX  ",
  "XXXXXXXX",

  // Unshifted $8e (142) >N<
  "X  XX  X",
  "X   X  X",
  "X      X",
  "X      X",
  "X  X   X",
  "X  XX  X",
  "X  XX  X",
  "XXXXXXXX",

  // Unshifted $8f (143) >O<
  "XX    XX",
  "X  XX  X",
  "X  XX  X",
  "X  XX  X",
  "X  XX  X",
  "X  XX  X",
  "XX    XX",
  "XXXXXXXX",

  // Unshifted $90 (144) >P<
  "X     XX",
  "X  XX  X",
  "X  XX  X",
  "X     XX",
  "X  XXXXX",
  "X  XXXXX",
  "X  XXXXX",
  "XXXXXXXX",

  // Unshifted $91 (145) >Q<
  "XX    XX",
  "X  XX  X",
  "X  XX  X",
  "X  XX  X",
  "X  XX  X",
  "XX    XX",
  "XXXX   X",
  "XXXXXXXX",

  // Unshifted $92 (146) >R<
  "X     XX",
  "X  XX  X",
  "X  XX  X",
  "X     XX",
  "X    XXX",
  "X  X  XX",
  "X  XX  X",
  "XXXXXXXX",

  // Unshifted $93 (147) >S<
  "XX    XX",
  "X  XX  X",
  "X  XXXXX",
  "XX    XX",
  "XXXXX  X",
  "X  XX  X",
  "XX    XX",
  "XXXXXXXX",

  // Unshifted $94 (148) >T<
  "X      X",
  "XXX  XXX",
  "XXX  XXX",
  "XXX  XXX",
  "XXX  XXX",
  "XXX  XXX",
  "XXX  XXX",
  "XXXXXXXX",

  // Unshifted $95 (149) >U<
  "X  XX  X",
  "X  XX  X",
  "X  XX  X",
  "X  XX  X",
  "X  XX  X",
  "X  XX  X",
  "XX    XX",
  "XXXXXXXX",

  // Unshifted $96 (150) >V<
  "X  XX  X",
  "X  XX  X",
  "X  XX  X",
  "X  XX  X",
  "X  XX  X",
  "XX    XX",
  "XXX  XXX",
  "XXXXXXXX",

  // Unshifted $97 (151) >W<
  "X  XXX  ",
  "X  XXX  ",
  "X  XXX  ",
  "X  X X  ",
  "X       ",
  "X   X   ",
  "X  XXX  ",
  "XXXXXXXX",

  // Unshifted $98 (152) >X<
  "X  XX  X",
  "X  XX  X",
  "XX    XX",
  "XXX  XXX",
  "XX    XX",
  "X  XX  X",
  "X  XX  X",
  "XXXXXXXX",

  // Unshifted $99 (153) >Y<
  "X  XX  X",
  "X  XX  X",
  "X  XX  X",
  "XX    XX",
  "XXX  XXX",
  "XXX  XXX",
  "XXX  XXX",
  "XXXXXXXX",

  // Unshifted $9a (154) >Z<
  "X      X",
  "XXXXX  X",
  "XXXX  XX",
  "XXX  XXX",
  "XX  XXXX",
  "X  XXXXX",
  "X      X",
  "XXXXXXXX",

  // Unshifted $9b (155) >[<
  "XX    XX",
  "XX  XXXX",
  "XX  XXXX",
  "XX  XXXX",
  "XX  XXXX",
  "XX  XXXX",
  "XX    XX",
  "XXXXXXXX",

  // Unshifted $9c (156) >£<
  "XXXX  XX",
  "XXX XX X",
  "XX  XXXX",
  "X     XX",
  "XX  XXXX",
  "X  XXX X",
  "      XX",
  "XXXXXXXX",

  // Unshifted $9d (157) >]<
  "XX    XX",
  "XXXX  XX",
  "XXXX  XX",
  "XXXX  XX",
  "XXXX  XX",
  "XXXX  XX",
  "XX    XX",
  "XXXXXXXX",

  // Unshifted $9e (158) >↑<
  "XXXXXXXX",
  "XXX  XXX",
  "XX    XX",
  "X      X",
  "XXX  XXX",
  "XXX  XXX",
  "XXX  XXX",
  "XXX  XXX",

  // Unshifted $9f (159) >←<
  "XXXXXXXX",
  "XXX XXXX",
  "XX  XXXX",
  "X       ",
  "X       ",
  "XX  XXXX",
  "XXX XXXX",
  "XXXXXXXX",

  // Unshifted $a0 (160) > <
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",

  // Unshifted $a1 (161) >!<
  "XXX  XXX",
  "XXX  XXX",
  "XXX  XXX",
  "XXX  XXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXX  XXX",
  "XXXXXXXX",

  // Unshifted $a2 (162) >"<
  "X  XX  X",
  "X  XX  X",
  "X  XX  X",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",

  // Unshifted $a3 (163) >#<
  "X  XX  X",
  "X  XX  X",
  "        ",
  "X  XX  X",
  "        ",
  "X  XX  X",
  "X  XX  X",
  "XXXXXXXX",

  // Unshifted $a4 (164) >$<
  "XXX  XXX",
  "XX     X",
  "X  XXXXX",
  "XX    XX",
  "XXXXX  X",
  "X     XX",
  "XXX  XXX",
  "XXXXXXXX",

  // Unshifted $a5 (165) >%<
  "X  XXX X",
  "X  XX  X",
  "XXXX  XX",
  "XXX  XXX",
  "XX  XXXX",
  "X  XX  X",
  "X XXX  X",
  "XXXXXXXX",

  // Unshifted $a6 (166) >&<
  "XX    XX",
  "X  XX  X",
  "XX    XX",
  "XX   XXX",
  "X  XX   ",
  "X  XX  X",
  "XX      ",
  "XXXXXXXX",

  // Unshifted $a7 (167) >'<
  "XXXXX  X",
  "XXXX  XX",
  "XXX  XXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",

  // Unshifted $a8 (168) >(<
  "XXXX  XX",
  "XXX  XXX",
  "XX  XXXX",
  "XX  XXXX",
  "XX  XXXX",
  "XXX  XXX",
  "XXXX  XX",
  "XXXXXXXX",

  // Unshifted $a9 (169) >)<
  "XX  XXXX",
  "XXX  XXX",
  "XXXX  XX",
  "XXXX  XX",
  "XXXX  XX",
  "XXX  XXX",
  "XX  XXXX",
  "XXXXXXXX",

  // Unshifted $aa (170) >*<
  "XXXXXXXX",
  "X  XX  X",
  "XX    XX",
  "        ",
  "XX    XX",
  "X  XX  X",
  "XXXXXXXX",
  "XXXXXXXX",

  // Unshifted $ab (171) >+<
  "XXXXXXXX",
  "XXX  XXX",
  "XXX  XXX",
  "X      X",
  "XXX  XXX",
  "XXX  XXX",
  "XXXXXXXX",
  "XXXXXXXX",

  // Unshifted $ac (172) >,<
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXX  XXX",
  "XXX  XXX",
  "XX  XXXX",

  // Unshifted $ad (173) >-<
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "X      X",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",

  // Unshifted $ae (174) >.<
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXX  XXX",
  "XXX  XXX",
  "XXXXXXXX",

  // Unshifted $af (175) >/<
  "XXXXXXXX",
  "XXXXXX  ",
  "XXXXX  X",
  "XXXX  XX",
  "XXX  XXX",
  "XX  XXXX",
  "X  XXXXX",
  "XXXXXXXX",

  // Unshifted $b0 (176) >0<
  "XX    XX",
  "X  XX  X",
  "X  X   X",
  "X   X  X",
  "X  XX  X",
  "X  XX  X",
  "XX    XX",
  "XXXXXXXX",

  // Unshifted $b1 (177) >1<
  "XXX  XXX",
  "XXX  XXX",
  "XX   XXX",
  "XXX  XXX",
  "XXX  XXX",
  "XXX  XXX",
  "X      X",
  "XXXXXXXX",

  // Unshifted $b2 (178) >2<
  "XX    XX",
  "X  XX  X",
  "XXXXX  X",
  "XXXX  XX",
  "XX  XXXX",
  "X  XXXXX",
  "X      X",
  "XXXXXXXX",

  // Unshifted $b3 (179) >3<
  "XX    XX",
  "X  XX  X",
  "XXXXX  X",
  "XXX   XX",
  "XXXXX  X",
  "X  XX  X",
  "XX    XX",
  "XXXXXXXX",

  // Unshifted $b4 (180) >4<
  "XXXXX  X",
  "XXXX   X",
  "XXX    X",
  "X  XX  X",
  "X       ",
  "XXXXX  X",
  "XXXXX  X",
  "XXXXXXXX",

  // Unshifted $b5 (181) >5<
  "X      X",
  "X  XXXXX",
  "X     XX",
  "XXXXX  X",
  "XXXXX  X",
  "X  XX  X",
  "XX    XX",
  "XXXXXXXX",

  // Unshifted $b6 (182) >6<
  "XX    XX",
  "X  XX  X",
  "X  XXXXX",
  "X     XX",
  "X  XX  X",
  "X  XX  X",
  "XX    XX",
  "XXXXXXXX",

  // Unshifted $b7 (183) >7<
  "X      X",
  "X  XX  X",
  "XXXX  XX",
  "XXX  XXX",
  "XXX  XXX",
  "XXX  XXX",
  "XXX  XXX",
  "XXXXXXXX",

  // Unshifted $b8 (184) >8<
  "XX    XX",
  "X  XX  X",
  "X  XX  X",
  "XX    XX",
  "X  XX  X",
  "X  XX  X",
  "XX    XX",
  "XXXXXXXX",

  // Unshifted $b9 (185) >9<
  "XX    XX",
  "X  XX  X",
  "X  XX  X",
  "XX     X",
  "XXXXX  X",
  "X  XX  X",
  "XX    XX",
  "XXXXXXXX",

  // Unshifted $ba (186) >:<
  "XXXXXXXX",
  "XXXXXXXX",
  "XXX  XXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXX  XXX",
  "XXXXXXXX",
  "XXXXXXXX",

  // Unshifted $bb (187) >;<
  "XXXXXXXX",
  "XXXXXXXX",
  "XXX  XXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXX  XXX",
  "XXX  XXX",
  "XX  XXXX",

  // Unshifted $bc (188) ><<
  "XXXX   X",
  "XXX  XXX",
  "XX  XXXX",
  "X  XXXXX",
  "XX  XXXX",
  "XXX  XXX",
  "XXXX   X",
  "XXXXXXXX",

  // Unshifted $bd (189) >=<
  "XXXXXXXX",
  "XXXXXXXX",
  "X      X",
  "XXXXXXXX",
  "X      X",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",

  // Unshifted $be (190) >><
  "X   XXXX",
  "XXX  XXX",
  "XXXX  XX",
  "XXXXX  X",
  "XXXX  XX",
  "XXX  XXX",
  "X   XXXX",
  "XXXXXXXX",

  // Unshifted $bf (191) >?<
  "XX    XX",
  "X  XX  X",
  "XXXXX  X",
  "XXXX  XX",
  "XXX  XXX",
  "XXXXXXXX",
  "XXX  XXX",
  "XXXXXXXX",

  // Unshifted $c0 (192) >─<
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "        ",
  "        ",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",

  // Unshifted $c1 (193) >♠<
  "XXXX XXX",
  "XXX   XX",
  "XX     X",
  "X       ",
  "X       ",
  "XXX   XX",
  "XX     X",
  "XXXXXXXX",

  // Unshifted $c2 (194) >│<
  "XXX  XXX",
  "XXX  XXX",
  "XXX  XXX",
  "XXX  XXX",
  "XXX  XXX",
  "XXX  XXX",
  "XXX  XXX",
  "XXX  XXX",

  // Unshifted $c3 (195) >─<
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "        ",
  "        ",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",

  // Unshifted $c4 (196) >─<
  "XXXXXXXX",
  "XXXXXXXX",
  "        ",
  "        ",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",

  // Unshifted $c5 (197) >▔<
  "XXXXXXXX",
  "        ",
  "        ",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",

  // Unshifted $c6 (198) >─<
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "        ",
  "        ",
  "XXXXXXXX",
  "XXXXXXXX",

  // Unshifted $c7 (199) >│<
  "XX  XXXX",
  "XX  XXXX",
  "XX  XXXX",
  "XX  XXXX",
  "XX  XXXX",
  "XX  XXXX",
  "XX  XXXX",
  "XX  XXXX",

  // Unshifted $c8 (200) >│<
  "XXXX  XX",
  "XXXX  XX",
  "XXXX  XX",
  "XXXX  XX",
  "XXXX  XX",
  "XXXX  XX",
  "XXXX  XX",
  "XXXX  XX",

  // Unshifted $c9 (201) >╮<
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "   XXXXX",
  "    XXXX",
  "XX   XXX",
  "XXX  XXX",
  "XXX  XXX",

  // Unshifted $ca (202) >╰<
  "XXX  XXX",
  "XXX  XXX",
  "XXX   XX",
  "XXXX    ",
  "XXXXX   ",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",

  // Unshifted $cb (203) >╯<
  "XXX  XXX",
  "XXX  XXX",
  "XX   XXX",
  "    XXXX",
  "   XXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",

  // Unshifted $cc (204) >⌞<
  "  XXXXXX",
  "  XXXXXX",
  "  XXXXXX",
  "  XXXXXX",
  "  XXXXXX",
  "  XXXXXX",
  "        ",
  "        ",

  // Unshifted $cd (205) >╲<
  "  XXXXXX",
  "   XXXXX",
  "X   XXXX",
  "XX   XXX",
  "XXX   XX",
  "XXXX   X",
  "XXXXX   ",
  "XXXXXX  ",

  // Unshifted $ce (206) >╱<
  "XXXXXX  ",
  "XXXXX   ",
  "XXXX   X",
  "XXX   XX",
  "XX   XXX",
  "X   XXXX",
  "   XXXXX",
  "  XXXXXX",

  // Unshifted $cf (207) >⌜<
  "        ",
  "        ",
  "  XXXXXX",
  "  XXXXXX",
  "  XXXXXX",
  "  XXXXXX",
  "  XXXXXX",
  "  XXXXXX",

  // Unshifted $d0 (208) >⌝<
  "        ",
  "        ",
  "XXXXXX  ",
  "XXXXXX  ",
  "XXXXXX  ",
  "XXXXXX  ",
  "XXXXXX  ",
  "XXXXXX  ",

  // Unshifted $d1 (209) >●<
  "XXXXXXXX",
  "XX    XX",
  "X      X",
  "X      X",
  "X      X",
  "X      X",
  "XX    XX",
  "XXXXXXXX",

  // Unshifted $d2 (210) >_<
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "        ",
  "        ",
  "XXXXXXXX",

  // Unshifted $d3 (211) >♥<
  "XX  X  X",
  "X       ",
  "X       ",
  "X       ",
  "XX     X",
  "XXX   XX",
  "XXXX XXX",
  "XXXXXXXX",

  // Unshifted $d4 (212) >▎<
  "X  XXXXX",
  "X  XXXXX",
  "X  XXXXX",
  "X  XXXXX",
  "X  XXXXX",
  "X  XXXXX",
  "X  XXXXX",
  "X  XXXXX",

  // Unshifted $d5 (213) >╭<
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXX   ",
  "XXXX    ",
  "XXX   XX",
  "XXX  XXX",
  "XXX  XXX",

  // Unshifted $d6 (214) >╳<
  "  XXXX  ",
  "   XX   ",
  "X      X",
  "XX    XX",
  "XX    XX",
  "X      X",
  "   XX   ",
  "  XXXX  ",

  // Unshifted $d7 (215) >○<
  "XXXXXXXX",
  "XX    XX",
  "X      X",
  "X  XX  X",
  "X  XX  X",
  "X      X",
  "XX    XX",
  "XXXXXXXX",

  // Unshifted $d8 (216) >♣<
  "XXX  XXX",
  "XXX  XXX",
  "X  XX  X",
  "X  XX  X",
  "XXX  XXX",
  "XXX  XXX",
  "XX    XX",
  "XXXXXXXX",

  // Unshifted $d9 (217) >▕<
  "XXXXX  X",
  "XXXXX  X",
  "XXXXX  X",
  "XXXXX  X",
  "XXXXX  X",
  "XXXXX  X",
  "XXXXX  X",
  "XXXXX  X",

  // Unshifted $da (218) >♦<
  "XXXX XXX",
  "XXX   XX",
  "XX     X",
  "X       ",
  "XX     X",
  "XXX   XX",
  "XXXX XXX",
  "XXXXXXXX",

  // Unshifted $db (219) >┼<
  "XXX  XXX",
  "XXX  XXX",
  "XXX  XXX",
  "        ",
  "        ",
  "XXX  XXX",
  "XXX  XXX",
  "XXX  XXX",

  // Unshifted $dc (220) >▒<
  "  XXXXXX",
  "  XXXXXX",
  "XX  XXXX",
  "XX  XXXX",
  "  XXXXXX",
  "  XXXXXX",
  "XX  XXXX",
  "XX  XXXX",

  // Unshifted $dd (221) >│<
  "XXX  XXX",
  "XXX  XXX",
  "XXX  XXX",
  "XXX  XXX",
  "XXX  XXX",
  "XXX  XXX",
  "XXX  XXX",
  "XXX  XXX",

  // Unshifted $de (222) >π<
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXX  ",
  "XX     X",
  "X   X  X",
  "XX  X  X",
  "XX  X  X",
  "XXXXXXXX",

  // Unshifted $df (223) >◥<
  "        ",
  "X       ",
  "XX      ",
  "XXX     ",
  "XXXX    ",
  "XXXXX   ",
  "XXXXXX  ",
  "XXXXXXX ",

  // Unshifted $e0 (224) > <
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",

  // Unshifted $e1 (225) >▌<
  "    XXXX",
  "    XXXX",
  "    XXXX",
  "    XXXX",
  "    XXXX",
  "    XXXX",
  "    XXXX",
  "    XXXX",

  // Unshifted $e2 (226) >▄<
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "        ",
  "        ",
  "        ",
  "        ",

  // Unshifted $e3 (227) >▔<
  "        ",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",

  // Unshifted $e4 (228) >▁<
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "        ",

  // Unshifted $e5 (229) >▎<
  "  XXXXXX",
  "  XXXXXX",
  "  XXXXXX",
  "  XXXXXX",
  "  XXXXXX",
  "  XXXXXX",
  "  XXXXXX",
  "  XXXXXX",

  // Unshifted $e6 (230) >▒<
  "  XX  XX",
  "  XX  XX",
  "XX  XX  ",
  "XX  XX  ",
  "  XX  XX",
  "  XX  XX",
  "XX  XX  ",
  "XX  XX  ",

  // Unshifted $e7 (231) >▕<
  "XXXXXX  ",
  "XXXXXX  ",
  "XXXXXX  ",
  "XXXXXX  ",
  "XXXXXX  ",
  "XXXXXX  ",
  "XXXXXX  ",
  "XXXXXX  ",

  // Unshifted $e8 (232) >▒<
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "  XX  XX",
  "  XX  XX",
  "XX  XX  ",
  "XX  XX  ",

  // Unshifted $e9 (233) >◤<
  "        ",
  "       X",
  "      XX",
  "     XXX",
  "    XXXX",
  "   XXXXX",
  "  XXXXXX",
  " XXXXXXX",

  // Unshifted $ea (234) >▕<
  "XXXXXX  ",
  "XXXXXX  ",
  "XXXXXX  ",
  "XXXXXX  ",
  "XXXXXX  ",
  "XXXXXX  ",
  "XXXXXX  ",
  "XXXXXX  ",

  // Unshifted $eb (235) >├<
  "XXX  XXX",
  "XXX  XXX",
  "XXX  XXX",
  "XXX     ",
  "XXX     ",
  "XXX  XXX",
  "XXX  XXX",
  "XXX  XXX",

  // Unshifted $ec (236) >▗<
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXX    ",
  "XXXX    ",
  "XXXX    ",
  "XXXX    ",

  // Unshifted $ed (237) >└<
  "XXX  XXX",
  "XXX  XXX",
  "XXX  XXX",
  "XXX     ",
  "XXX     ",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",

  // Unshifted $ee (238) >┐<
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "     XXX",
  "     XXX",
  "XXX  XXX",
  "XXX  XXX",
  "XXX  XXX",

  // Unshifted $ef (239) >▂<
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "        ",
  "        ",

  // Unshifted $f0 (240) >┌<
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXX     ",
  "XXX     ",
  "XXX  XXX",
  "XXX  XXX",
  "XXX  XXX",

  // Unshifted $f1 (241) >┴<
  "XXX  XXX",
  "XXX  XXX",
  "XXX  XXX",
  "        ",
  "        ",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",

  // Unshifted $f2 (242) >┬<
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "        ",
  "        ",
  "XXX  XXX",
  "XXX  XXX",
  "XXX  XXX",

  // Unshifted $f3 (243) >┤<
  "XXX  XXX",
  "XXX  XXX",
  "XXX  XXX",
  "     XXX",
  "     XXX",
  "XXX  XXX",
  "XXX  XXX",
  "XXX  XXX",

  // Unshifted $f4 (244) >▎<
  "  XXXXXX",
  "  XXXXXX",
  "  XXXXXX",
  "  XXXXXX",
  "  XXXXXX",
  "  XXXXXX",
  "  XXXXXX",
  "  XXXXXX",

  // Unshifted $f5 (245) >▍<
  "   XXXXX",
  "   XXXXX",
  "   XXXXX",
  "   XXXXX",
  "   XXXXX",
  "   XXXXX",
  "   XXXXX",
  "   XXXXX",

  // Unshifted $f6 (246) >▕<
  "XXXXX   ",
  "XXXXX   ",
  "XXXXX   ",
  "XXXXX   ",
  "XXXXX   ",
  "XXXXX   ",
  "XXXXX   ",
  "XXXXX   ",

  // Unshifted $f7 (247) >▔<
  "        ",
  "        ",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",

  // Unshifted $f8 (248) >▔<
  "        ",
  "        ",
  "        ",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",

  // Unshifted $f9 (249) >▃<
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "        ",
  "        ",
  "        ",

  // Unshifted $fa (250) >⌟<
  "XXXXXX  ",
  "XXXXXX  ",
  "XXXXXX  ",
  "XXXXXX  ",
  "XXXXXX  ",
  "XXXXXX  ",
  "        ",
  "        ",

  // Unshifted $fb (251) >▖<
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "    XXXX",
  "    XXXX",
  "    XXXX",
  "    XXXX",

  // Unshifted $fc (252) >▝<
  "XXXX    ",
  "XXXX    ",
  "XXXX    ",
  "XXXX    ",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",

  // Unshifted $fd (253) >┘<
  "XXX  XXX",
  "XXX  XXX",
  "XXX  XXX",
  "     XXX",
  "     XXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",

  // Unshifted $fe (254) >▘<
  "    XXXX",
  "    XXXX",
  "    XXXX",
  "    XXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",

  // Unshifted $ff (255) >▚<
  "    XXXX",
  "    XXXX",
  "    XXXX",
  "    XXXX",
  "XXXX    ",
  "XXXX    ",
  "XXXX    ",
  "XXXX    ",

  // Shifted $00 (0) >@<
  "  XXXX  ",
  " XX  XX ",
  " XX XXX ",
  " XX XXX ",
  " XX     ",
  " XX   X ",
  "  XXXX  ",
  "        ",

  // Shifted $01 (1) >a<
  "        ",
  "        ",
  "  XXXX  ",
  "     XX ",
  "  XXXXX ",
  " XX  XX ",
  "  XXXXX ",
  "        ",

  // Shifted $02 (2) >b<
  "        ",
  " XX     ",
  " XX     ",
  " XXXXX  ",
  " XX  XX ",
  " XX  XX ",
  " XXXXX  ",
  "        ",

  // Shifted $03 (3) >c<
  "        ",
  "        ",
  "  XXXX  ",
  " XX     ",
  " XX     ",
  " XX     ",
  "  XXXX  ",
  "        ",

  // Shifted $04 (4) >d<
  "        ",
  "     XX ",
  "     XX ",
  "  XXXXX ",
  " XX  XX ",
  " XX  XX ",
  "  XXXXX ",
  "        ",

  // Shifted $05 (5) >e<
  "        ",
  "        ",
  "  XXXX  ",
  " XX  XX ",
  " XXXXXX ",
  " XX     ",
  "  XXXX  ",
  "        ",

  // Shifted $06 (6) >f<
  "        ",
  "    XXX ",
  "   XX   ",
  "  XXXXX ",
  "   XX   ",
  "   XX   ",
  "   XX   ",
  "        ",

  // Shifted $07 (7) >g<
  "        ",
  "        ",
  "  XXXXX ",
  " XX  XX ",
  " XX  XX ",
  "  XXXXX ",
  "     XX ",
  " XXXXX  ",

  // Shifted $08 (8) >h<
  "        ",
  " XX     ",
  " XX     ",
  " XXXXX  ",
  " XX  XX ",
  " XX  XX ",
  " XX  XX ",
  "        ",

  // Shifted $09 (9) >i<
  "        ",
  "   XX   ",
  "        ",
  "  XXX   ",
  "   XX   ",
  "   XX   ",
  "  XXXX  ",
  "        ",

  // Shifted $0a (10) >j<
  "        ",
  "     XX ",
  "        ",
  "     XX ",
  "     XX ",
  "     XX ",
  "     XX ",
  "  XXXX  ",

  // Shifted $0b (11) >k<
  "        ",
  " XX     ",
  " XX     ",
  " XX XX  ",
  " XXXX   ",
  " XX XX  ",
  " XX  XX ",
  "        ",

  // Shifted $0c (12) >l<
  "        ",
  "  XXX   ",
  "   XX   ",
  "   XX   ",
  "   XX   ",
  "   XX   ",
  "  XXXX  ",
  "        ",

  // Shifted $0d (13) >m<
  "        ",
  "        ",
  " XX  XX ",
  " XXXXXXX",
  " XXXXXXX",
  " XX X XX",
  " XX   XX",
  "        ",

  // Shifted $0e (14) >n<
  "        ",
  "        ",
  " XXXXX  ",
  " XX  XX ",
  " XX  XX ",
  " XX  XX ",
  " XX  XX ",
  "        ",

  // Shifted $0f (15) >o<
  "        ",
  "        ",
  "  XXXX  ",
  " XX  XX ",
  " XX  XX ",
  " XX  XX ",
  "  XXXX  ",
  "        ",

  // Shifted $10 (16) >p<
  "        ",
  "        ",
  " XXXXX  ",
  " XX  XX ",
  " XX  XX ",
  " XXXXX  ",
  " XX     ",
  " XX     ",

  // Shifted $11 (17) >q<
  "        ",
  "        ",
  "  XXXXX ",
  " XX  XX ",
  " XX  XX ",
  "  XXXXX ",
  "     XX ",
  "     XX ",

  // Shifted $12 (18) >r<
  "        ",
  "        ",
  " XXXXX  ",
  " XX  XX ",
  " XX     ",
  " XX     ",
  " XX     ",
  "        ",

  // Shifted $13 (19) >s<
  "        ",
  "        ",
  "  XXXXX ",
  " XX     ",
  "  XXXX  ",
  "     XX ",
  " XXXXX  ",
  "        ",

  // Shifted $14 (20) >t<
  "        ",
  "   XX   ",
  " XXXXXX ",
  "   XX   ",
  "   XX   ",
  "   XX   ",
  "    XXX ",
  "        ",

  // Shifted $15 (21) >u<
  "        ",
  "        ",
  " XX  XX ",
  " XX  XX ",
  " XX  XX ",
  " XX  XX ",
  "  XXXXX ",
  "        ",

  // Shifted $16 (22) >v<
  "        ",
  "        ",
  " XX  XX ",
  " XX  XX ",
  " XX  XX ",
  "  XXXX  ",
  "   XX   ",
  "        ",

  // Shifted $17 (23) >w<
  "        ",
  "        ",
  " XX   XX",
  " XX X XX",
  " XXXXXXX",
  "  XXXXX ",
  "  XX XX ",
  "        ",

  // Shifted $18 (24) >x<
  "        ",
  "        ",
  " XX  XX ",
  "  XXXX  ",
  "   XX   ",
  "  XXXX  ",
  " XX  XX ",
  "        ",

  // Shifted $19 (25) >y<
  "        ",
  "        ",
  " XX  XX ",
  " XX  XX ",
  " XX  XX ",
  "  XXXXX ",
  "    XX  ",
  " XXXX   ",

  // Shifted $1a (26) >z<
  "        ",
  "        ",
  " XXXXXX ",
  "    XX  ",
  "   XX   ",
  "  XX    ",
  " XXXXXX ",
  "        ",

  // Shifted $1b (27) >[<
  "  XXXX  ",
  "  XX    ",
  "  XX    ",
  "  XX    ",
  "  XX    ",
  "  XX    ",
  "  XXXX  ",
  "        ",

  // Shifted $1c (28) >£<
  "    XX  ",
  "   X  X ",
  "  XX    ",
  " XXXXX  ",
  "  XX    ",
  " XX   X ",
  "XXXXXX  ",
  "        ",

  // Shifted $1d (29) >]<
  "  XXXX  ",
  "    XX  ",
  "    XX  ",
  "    XX  ",
  "    XX  ",
  "    XX  ",
  "  XXXX  ",
  "        ",

  // Shifted $1e (30) >↑<
  "        ",
  "   XX   ",
  "  XXXX  ",
  " XXXXXX ",
  "   XX   ",
  "   XX   ",
  "   XX   ",
  "   XX   ",

  // Shifted $1f (31) >←<
  "        ",
  "   X    ",
  "  XX    ",
  " XXXXXXX",
  " XXXXXXX",
  "  XX    ",
  "   X    ",
  "        ",

  // Shifted $20 (32) > <
  "        ",
  "        ",
  "        ",
  "        ",
  "        ",
  "        ",
  "        ",
  "        ",

  // Shifted $21 (33) >!<
  "   XX   ",
  "   XX   ",
  "   XX   ",
  "   XX   ",
  "        ",
  "        ",
  "   XX   ",
  "        ",

  // Shifted $22 (34) >"<
  " XX  XX ",
  " XX  XX ",
  " XX  XX ",
  "        ",
  "        ",
  "        ",
  "        ",
  "        ",

  // Shifted $23 (35) >#<
  " XX  XX ",
  " XX  XX ",
  "XXXXXXXX",
  " XX  XX ",
  "XXXXXXXX",
  " XX  XX ",
  " XX  XX ",
  "        ",

  // Shifted $24 (36) >$<
  "   XX   ",
  "  XXXXX ",
  " XX     ",
  "  XXXX  ",
  "     XX ",
  " XXXXX  ",
  "   XX   ",
  "        ",

  // Shifted $25 (37) >%<
  " XX   X ",
  " XX  XX ",
  "    XX  ",
  "   XX   ",
  "  XX    ",
  " XX  XX ",
  " X   XX ",
  "        ",

  // Shifted $26 (38) >&<
  "  XXXX  ",
  " XX  XX ",
  "  XXXX  ",
  "  XXX   ",
  " XX  XXX",
  " XX  XX ",
  "  XXXXXX",
  "        ",

  // Shifted $27 (39) >'<
  "     XX ",
  "    XX  ",
  "   XX   ",
  "        ",
  "        ",
  "        ",
  "        ",
  "        ",

  // Shifted $28 (40) >(<
  "    XX  ",
  "   XX   ",
  "  XX    ",
  "  XX    ",
  "  XX    ",
  "   XX   ",
  "    XX  ",
  "        ",

  // Shifted $29 (41) >)<
  "  XX    ",
  "   XX   ",
  "    XX  ",
  "    XX  ",
  "    XX  ",
  "   XX   ",
  "  XX    ",
  "        ",

  // Shifted $2a (42) >*<
  "        ",
  " XX  XX ",
  "  XXXX  ",
  "XXXXXXXX",
  "  XXXX  ",
  " XX  XX ",
  "        ",
  "        ",

  // Shifted $2b (43) >+<
  "        ",
  "   XX   ",
  "   XX   ",
  " XXXXXX ",
  "   XX   ",
  "   XX   ",
  "        ",
  "        ",

  // Shifted $2c (44) >,<
  "        ",
  "        ",
  "        ",
  "        ",
  "        ",
  "   XX   ",
  "   XX   ",
  "  XX    ",

  // Shifted $2d (45) >-<
  "        ",
  "        ",
  "        ",
  " XXXXXX ",
  "        ",
  "        ",
  "        ",
  "        ",

  // Shifted $2e (46) >.<
  "        ",
  "        ",
  "        ",
  "        ",
  "        ",
  "   XX   ",
  "   XX   ",
  "        ",

  // Shifted $2f (47) >/<
  "        ",
  "      XX",
  "     XX ",
  "    XX  ",
  "   XX   ",
  "  XX    ",
  " XX     ",
  "        ",

  // Shifted $30 (48) >0<
  "  XXXX  ",
  " XX  XX ",
  " XX XXX ",
  " XXX XX ",
  " XX  XX ",
  " XX  XX ",
  "  XXXX  ",
  "        ",

  // Shifted $31 (49) >1<
  "   XX   ",
  "   XX   ",
  "  XXX   ",
  "   XX   ",
  "   XX   ",
  "   XX   ",
  " XXXXXX ",
  "        ",

  // Shifted $32 (50) >2<
  "  XXXX  ",
  " XX  XX ",
  "     XX ",
  "    XX  ",
  "  XX    ",
  " XX     ",
  " XXXXXX ",
  "        ",

  // Shifted $33 (51) >3<
  "  XXXX  ",
  " XX  XX ",
  "     XX ",
  "   XXX  ",
  "     XX ",
  " XX  XX ",
  "  XXXX  ",
  "        ",

  // Shifted $34 (52) >4<
  "     XX ",
  "    XXX ",
  "   XXXX ",
  " XX  XX ",
  " XXXXXXX",
  "     XX ",
  "     XX ",
  "        ",

  // Shifted $35 (53) >5<
  " XXXXXX ",
  " XX     ",
  " XXXXX  ",
  "     XX ",
  "     XX ",
  " XX  XX ",
  "  XXXX  ",
  "        ",

  // Shifted $36 (54) >6<
  "  XXXX  ",
  " XX  XX ",
  " XX     ",
  " XXXXX  ",
  " XX  XX ",
  " XX  XX ",
  "  XXXX  ",
  "        ",

  // Shifted $37 (55) >7<
  " XXXXXX ",
  " XX  XX ",
  "    XX  ",
  "   XX   ",
  "   XX   ",
  "   XX   ",
  "   XX   ",
  "        ",

  // Shifted $38 (56) >8<
  "  XXXX  ",
  " XX  XX ",
  " XX  XX ",
  "  XXXX  ",
  " XX  XX ",
  " XX  XX ",
  "  XXXX  ",
  "        ",

  // Shifted $39 (57) >9<
  "  XXXX  ",
  " XX  XX ",
  " XX  XX ",
  "  XXXXX ",
  "     XX ",
  " XX  XX ",
  "  XXXX  ",
  "        ",

  // Shifted $3a (58) >:<
  "        ",
  "        ",
  "   XX   ",
  "        ",
  "        ",
  "   XX   ",
  "        ",
  "        ",

  // Shifted $3b (59) >;<
  "        ",
  "        ",
  "   XX   ",
  "        ",
  "        ",
  "   XX   ",
  "   XX   ",
  "  XX    ",

  // Shifted $3c (60) ><<
  "    XXX ",
  "   XX   ",
  "  XX    ",
  " XX     ",
  "  XX    ",
  "   XX   ",
  "    XXX ",
  "        ",

  // Shifted $3d (61) >=<
  "        ",
  "        ",
  " XXXXXX ",
  "        ",
  " XXXXXX ",
  "        ",
  "        ",
  "        ",

  // Shifted $3e (62) >><
  " XXX    ",
  "   XX   ",
  "    XX  ",
  "     XX ",
  "    XX  ",
  "   XX   ",
  " XXX    ",
  "        ",

  // Shifted $3f (63) >?<
  "  XXXX  ",
  " XX  XX ",
  "     XX ",
  "    XX  ",
  "   XX   ",
  "        ",
  "   XX   ",
  "        ",

  // Shifted $40 (64) >─<
  "        ",
  "        ",
  "        ",
  "XXXXXXXX",
  "XXXXXXXX",
  "        ",
  "        ",
  "        ",

  // Shifted $41 (65) >A<
  "   XX   ",
  "  XXXX  ",
  " XX  XX ",
  " XXXXXX ",
  " XX  XX ",
  " XX  XX ",
  " XX  XX ",
  "        ",

  // Shifted $42 (66) >B<
  " XXXXX  ",
  " XX  XX ",
  " XX  XX ",
  " XXXXX  ",
  " XX  XX ",
  " XX  XX ",
  " XXXXX  ",
  "        ",

  // Shifted $43 (67) >C<
  "  XXXX  ",
  " XX  XX ",
  " XX     ",
  " XX     ",
  " XX     ",
  " XX  XX ",
  "  XXXX  ",
  "        ",

  // Shifted $44 (68) >D<
  " XXXX   ",
  " XX XX  ",
  " XX  XX ",
  " XX  XX ",
  " XX  XX ",
  " XX XX  ",
  " XXXX   ",
  "        ",

  // Shifted $45 (69) >E<
  " XXXXXX ",
  " XX     ",
  " XX     ",
  " XXXX   ",
  " XX     ",
  " XX     ",
  " XXXXXX ",
  "        ",

  // Shifted $46 (70) >F<
  " XXXXXX ",
  " XX     ",
  " XX     ",
  " XXXX   ",
  " XX     ",
  " XX     ",
  " XX     ",
  "        ",

  // Shifted $47 (71) >G<
  "  XXXX  ",
  " XX  XX ",
  " XX     ",
  " XX XXX ",
  " XX  XX ",
  " XX  XX ",
  "  XXXX  ",
  "        ",

  // Shifted $48 (72) >H<
  " XX  XX ",
  " XX  XX ",
  " XX  XX ",
  " XXXXXX ",
  " XX  XX ",
  " XX  XX ",
  " XX  XX ",
  "        ",

  // Shifted $49 (73) >I<
  "  XXXX  ",
  "   XX   ",
  "   XX   ",
  "   XX   ",
  "   XX   ",
  "   XX   ",
  "  XXXX  ",
  "        ",

  // Shifted $4a (74) >J<
  "   XXXX ",
  "    XX  ",
  "    XX  ",
  "    XX  ",
  "    XX  ",
  " XX XX  ",
  "  XXX   ",
  "        ",

  // Shifted $4b (75) >K<
  " XX  XX ",
  " XX XX  ",
  " XXXX   ",
  " XXX    ",
  " XXXX   ",
  " XX XX  ",
  " XX  XX ",
  "        ",

  // Shifted $4c (76) >L<
  " XX     ",
  " XX     ",
  " XX     ",
  " XX     ",
  " XX     ",
  " XX     ",
  " XXXXXX ",
  "        ",

  // Shifted $4d (77) >M<
  " XX   XX",
  " XXX XXX",
  " XXXXXXX",
  " XX X XX",
  " XX   XX",
  " XX   XX",
  " XX   XX",
  "        ",

  // Shifted $4e (78) >N<
  " XX  XX ",
  " XXX XX ",
  " XXXXXX ",
  " XXXXXX ",
  " XX XXX ",
  " XX  XX ",
  " XX  XX ",
  "        ",

  // Shifted $4f (79) >O<
  "  XXXX  ",
  " XX  XX ",
  " XX  XX ",
  " XX  XX ",
  " XX  XX ",
  " XX  XX ",
  "  XXXX  ",
  "        ",

  // Shifted $50 (80) >P<
  " XXXXX  ",
  " XX  XX ",
  " XX  XX ",
  " XXXXX  ",
  " XX     ",
  " XX     ",
  " XX     ",
  "        ",

  // Shifted $51 (81) >Q<
  "  XXXX  ",
  " XX  XX ",
  " XX  XX ",
  " XX  XX ",
  " XX  XX ",
  "  XXXX  ",
  "    XXX ",
  "        ",

  // Shifted $52 (82) >R<
  " XXXXX  ",
  " XX  XX ",
  " XX  XX ",
  " XXXXX  ",
  " XXXX   ",
  " XX XX  ",
  " XX  XX ",
  "        ",

  // Shifted $53 (83) >S<
  "  XXXX  ",
  " XX  XX ",
  " XX     ",
  "  XXXX  ",
  "     XX ",
  " XX  XX ",
  "  XXXX  ",
  "        ",

  // Shifted $54 (84) >T<
  " XXXXXX ",
  "   XX   ",
  "   XX   ",
  "   XX   ",
  "   XX   ",
  "   XX   ",
  "   XX   ",
  "        ",

  // Shifted $55 (85) >U<
  " XX  XX ",
  " XX  XX ",
  " XX  XX ",
  " XX  XX ",
  " XX  XX ",
  " XX  XX ",
  "  XXXX  ",
  "        ",

  // Shifted $56 (86) >V<
  " XX  XX ",
  " XX  XX ",
  " XX  XX ",
  " XX  XX ",
  " XX  XX ",
  "  XXXX  ",
  "   XX   ",
  "        ",

  // Shifted $57 (87) >W<
  " XX   XX",
  " XX   XX",
  " XX   XX",
  " XX X XX",
  " XXXXXXX",
  " XXX XXX",
  " XX   XX",
  "        ",

  // Shifted $58 (88) >X<
  " XX  XX ",
  " XX  XX ",
  "  XXXX  ",
  "   XX   ",
  "  XXXX  ",
  " XX  XX ",
  " XX  XX ",
  "        ",

  // Shifted $59 (89) >Y<
  " XX  XX ",
  " XX  XX ",
  " XX  XX ",
  "  XXXX  ",
  "   XX   ",
  "   XX   ",
  "   XX   ",
  "        ",

  // Shifted $5a (90) >Z<
  " XXXXXX ",
  "     XX ",
  "    XX  ",
  "   XX   ",
  "  XX    ",
  " XX     ",
  " XXXXXX ",
  "        ",

  // Shifted $5b (91) >┼<
  "   XX   ",
  "   XX   ",
  "   XX   ",
  "XXXXXXXX",
  "XXXXXXXX",
  "   XX   ",
  "   XX   ",
  "   XX   ",

  // Shifted $5c (92) >▒<
  "XX      ",
  "XX      ",
  "  XX    ",
  "  XX    ",
  "XX      ",
  "XX      ",
  "  XX    ",
  "  XX    ",

  // Shifted $5d (93) >│<
  "   XX   ",
  "   XX   ",
  "   XX   ",
  "   XX   ",
  "   XX   ",
  "   XX   ",
  "   XX   ",
  "   XX   ",

  // Shifted $5e (94) >▒<
  "  XX  XX",
  "  XX  XX",
  "XX  XX  ",
  "XX  XX  ",
  "  XX  XX",
  "  XX  XX",
  "XX  XX  ",
  "XX  XX  ",

  // Shifted $5f (95) >▒<
  "  XX  XX",
  "X  XX  X",
  "XX  XX  ",
  " XX  XX ",
  "  XX  XX",
  "X  XX  X",
  "XX  XX  ",
  " XX  XX ",

  // Shifted $60 (96) > <
  "        ",
  "        ",
  "        ",
  "        ",
  "        ",
  "        ",
  "        ",
  "        ",

  // Shifted $61 (97) >▌<
  "XXXX    ",
  "XXXX    ",
  "XXXX    ",
  "XXXX    ",
  "XXXX    ",
  "XXXX    ",
  "XXXX    ",
  "XXXX    ",

  // Shifted $62 (98) >▄<
  "        ",
  "        ",
  "        ",
  "        ",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",

  // Shifted $63 (99) >▔<
  "XXXXXXXX",
  "        ",
  "        ",
  "        ",
  "        ",
  "        ",
  "        ",
  "        ",

  // Shifted $64 (100) >▁<
  "        ",
  "        ",
  "        ",
  "        ",
  "        ",
  "        ",
  "        ",
  "XXXXXXXX",

  // Shifted $65 (101) >▎<
  "XX      ",
  "XX      ",
  "XX      ",
  "XX      ",
  "XX      ",
  "XX      ",
  "XX      ",
  "XX      ",

  // Shifted $66 (102) >▒<
  "XX  XX  ",
  "XX  XX  ",
  "  XX  XX",
  "  XX  XX",
  "XX  XX  ",
  "XX  XX  ",
  "  XX  XX",
  "  XX  XX",

  // Shifted $67 (103) >▕<
  "      XX",
  "      XX",
  "      XX",
  "      XX",
  "      XX",
  "      XX",
  "      XX",
  "      XX",

  // Shifted $68 (104) >▒<
  "        ",
  "        ",
  "        ",
  "        ",
  "XX  XX  ",
  "XX  XX  ",
  "  XX  XX",
  "  XX  XX",

  // Shifted $69 (105) >▒<
  "XX  XX  ",
  "X  XX  X",
  "  XX  XX",
  " XX  XX ",
  "XX  XX  ",
  "X  XX  X",
  "  XX  XX",
  " XX  XX ",

  // Shifted $6a (106) >▕<
  "      XX",
  "      XX",
  "      XX",
  "      XX",
  "      XX",
  "      XX",
  "      XX",
  "      XX",

  // Shifted $6b (107) >├<
  "   XX   ",
  "   XX   ",
  "   XX   ",
  "   XXXXX",
  "   XXXXX",
  "   XX   ",
  "   XX   ",
  "   XX   ",

  // Shifted $6c (108) >▗<
  "        ",
  "        ",
  "        ",
  "        ",
  "    XXXX",
  "    XXXX",
  "    XXXX",
  "    XXXX",

  // Shifted $6d (109) >└<
  "   XX   ",
  "   XX   ",
  "   XX   ",
  "   XXXXX",
  "   XXXXX",
  "        ",
  "        ",
  "        ",

  // Shifted $6e (110) >┐<
  "        ",
  "        ",
  "        ",
  "XXXXX   ",
  "XXXXX   ",
  "   XX   ",
  "   XX   ",
  "   XX   ",

  // Shifted $6f (111) >▂<
  "        ",
  "        ",
  "        ",
  "        ",
  "        ",
  "        ",
  "XXXXXXXX",
  "XXXXXXXX",

  // Shifted $70 (112) >┌<
  "        ",
  "        ",
  "        ",
  "   XXXXX",
  "   XXXXX",
  "   XX   ",
  "   XX   ",
  "   XX   ",

  // Shifted $71 (113) >┴<
  "   XX   ",
  "   XX   ",
  "   XX   ",
  "XXXXXXXX",
  "XXXXXXXX",
  "        ",
  "        ",
  "        ",

  // Shifted $72 (114) >┬<
  "        ",
  "        ",
  "        ",
  "XXXXXXXX",
  "XXXXXXXX",
  "   XX   ",
  "   XX   ",
  "   XX   ",

  // Shifted $73 (115) >┤<
  "   XX   ",
  "   XX   ",
  "   XX   ",
  "XXXXX   ",
  "XXXXX   ",
  "   XX   ",
  "   XX   ",
  "   XX   ",

  // Shifted $74 (116) >▎<
  "XX      ",
  "XX      ",
  "XX      ",
  "XX      ",
  "XX      ",
  "XX      ",
  "XX      ",
  "XX      ",

  // Shifted $75 (117) >▍<
  "XXX     ",
  "XXX     ",
  "XXX     ",
  "XXX     ",
  "XXX     ",
  "XXX     ",
  "XXX     ",
  "XXX     ",

  // Shifted $76 (118) >▕<
  "     XXX",
  "     XXX",
  "     XXX",
  "     XXX",
  "     XXX",
  "     XXX",
  "     XXX",
  "     XXX",

  // Shifted $77 (119) >▔<
  "XXXXXXXX",
  "XXXXXXXX",
  "        ",
  "        ",
  "        ",
  "        ",
  "        ",
  "        ",

  // Shifted $78 (120) >▔<
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "        ",
  "        ",
  "        ",
  "        ",
  "        ",

  // Shifted $79 (121) >▃<
  "        ",
  "        ",
  "        ",
  "        ",
  "        ",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",

  // Shifted $7a (122) >✓<
  "       X",
  "      XX",
  "     XX ",
  " XX XX  ",
  " XXXX   ",
  " XXX    ",
  " XX     ",
  "        ",

  // Shifted $7b (123) >▖<
  "        ",
  "        ",
  "        ",
  "        ",
  "XXXX    ",
  "XXXX    ",
  "XXXX    ",
  "XXXX    ",

  // Shifted $7c (124) >▝<
  "    XXXX",
  "    XXXX",
  "    XXXX",
  "    XXXX",
  "        ",
  "        ",
  "        ",
  "        ",

  // Shifted $7d (125) >┘<
  "   XX   ",
  "   XX   ",
  "   XX   ",
  "XXXXX   ",
  "XXXXX   ",
  "        ",
  "        ",
  "        ",

  // Shifted $7e (126) >▘<
  "XXXX    ",
  "XXXX    ",
  "XXXX    ",
  "XXXX    ",
  "        ",
  "        ",
  "        ",
  "        ",

  // Shifted $7f (127) >▚<
  "XXXX    ",
  "XXXX    ",
  "XXXX    ",
  "XXXX    ",
  "    XXXX",
  "    XXXX",
  "    XXXX",
  "    XXXX",

  // Shifted $80 (128) >@<
  "XX    XX",
  "X  XX  X",
  "X  X   X",
  "X  X   X",
  "X  XXXXX",
  "X  XX  X",
  "XX    XX",
  "XXXXXXXX",

  // Shifted $81 (129) >a<
  "XXXXXXXX",
  "XXXXXXXX",
  "XX    XX",
  "XXXXX  X",
  "XX     X",
  "X  XX  X",
  "XX     X",
  "XXXXXXXX",

  // Shifted $82 (130) >b<
  "XXXXXXXX",
  "X  XXXXX",
  "X  XXXXX",
  "X     XX",
  "X  XX  X",
  "X  XX  X",
  "X     XX",
  "XXXXXXXX",

  // Shifted $83 (131) >c<
  "XXXXXXXX",
  "XXXXXXXX",
  "XX    XX",
  "X  XXXXX",
  "X  XXXXX",
  "X  XXXXX",
  "XX    XX",
  "XXXXXXXX",

  // Shifted $84 (132) >d<
  "XXXXXXXX",
  "XXXXX  X",
  "XXXXX  X",
  "XX     X",
  "X  XX  X",
  "X  XX  X",
  "XX     X",
  "XXXXXXXX",

  // Shifted $85 (133) >e<
  "XXXXXXXX",
  "XXXXXXXX",
  "XX    XX",
  "X  XX  X",
  "X      X",
  "X  XXXXX",
  "XX    XX",
  "XXXXXXXX",

  // Shifted $86 (134) >f<
  "XXXXXXXX",
  "XXXX   X",
  "XXX  XXX",
  "XX     X",
  "XXX  XXX",
  "XXX  XXX",
  "XXX  XXX",
  "XXXXXXXX",

  // Shifted $87 (135) >g<
  "XXXXXXXX",
  "XXXXXXXX",
  "XX     X",
  "X  XX  X",
  "X  XX  X",
  "XX     X",
  "XXXXX  X",
  "X     XX",

  // Shifted $88 (136) >h<
  "XXXXXXXX",
  "X  XXXXX",
  "X  XXXXX",
  "X     XX",
  "X  XX  X",
  "X  XX  X",
  "X  XX  X",
  "XXXXXXXX",

  // Shifted $89 (137) >i<
  "XXXXXXXX",
  "XXX  XXX",
  "XXXXXXXX",
  "XX   XXX",
  "XXX  XXX",
  "XXX  XXX",
  "XX    XX",
  "XXXXXXXX",

  // Shifted $8a (138) >j<
  "XXXXXXXX",
  "XXXXX  X",
  "XXXXXXXX",
  "XXXXX  X",
  "XXXXX  X",
  "XXXXX  X",
  "XXXXX  X",
  "XX    XX",

  // Shifted $8b (139) >k<
  "XXXXXXXX",
  "X  XXXXX",
  "X  XXXXX",
  "X  X  XX",
  "X    XXX",
  "X  X  XX",
  "X  XX  X",
  "XXXXXXXX",

  // Shifted $8c (140) >l<
  "XXXXXXXX",
  "XX   XXX",
  "XXX  XXX",
  "XXX  XXX",
  "XXX  XXX",
  "XXX  XXX",
  "XX    XX",
  "XXXXXXXX",

  // Shifted $8d (141) >m<
  "XXXXXXXX",
  "XXXXXXXX",
  "X  XX  X",
  "X       ",
  "X       ",
  "X  X X  ",
  "X  XXX  ",
  "XXXXXXXX",

  // Shifted $8e (142) >n<
  "XXXXXXXX",
  "XXXXXXXX",
  "X     XX",
  "X  XX  X",
  "X  XX  X",
  "X  XX  X",
  "X  XX  X",
  "XXXXXXXX",

  // Shifted $8f (143) >o<
  "XXXXXXXX",
  "XXXXXXXX",
  "XX    XX",
  "X  XX  X",
  "X  XX  X",
  "X  XX  X",
  "XX    XX",
  "XXXXXXXX",

  // Shifted $90 (144) >p<
  "XXXXXXXX",
  "XXXXXXXX",
  "X     XX",
  "X  XX  X",
  "X  XX  X",
  "X     XX",
  "X  XXXXX",
  "X  XXXXX",

  // Shifted $91 (145) >q<
  "XXXXXXXX",
  "XXXXXXXX",
  "XX     X",
  "X  XX  X",
  "X  XX  X",
  "XX     X",
  "XXXXX  X",
  "XXXXX  X",

  // Shifted $92 (146) >r<
  "XXXXXXXX",
  "XXXXXXXX",
  "X     XX",
  "X  XX  X",
  "X  XXXXX",
  "X  XXXXX",
  "X  XXXXX",
  "XXXXXXXX",

  // Shifted $93 (147) >s<
  "XXXXXXXX",
  "XXXXXXXX",
  "XX     X",
  "X  XXXXX",
  "XX    XX",
  "XXXXX  X",
  "X     XX",
  "XXXXXXXX",

  // Shifted $94 (148) >t<
  "XXXXXXXX",
  "XXX  XXX",
  "X      X",
  "XXX  XXX",
  "XXX  XXX",
  "XXX  XXX",
  "XXXX   X",
  "XXXXXXXX",

  // Shifted $95 (149) >u<
  "XXXXXXXX",
  "XXXXXXXX",
  "X  XX  X",
  "X  XX  X",
  "X  XX  X",
  "X  XX  X",
  "XX     X",
  "XXXXXXXX",

  // Shifted $96 (150) >v<
  "XXXXXXXX",
  "XXXXXXXX",
  "X  XX  X",
  "X  XX  X",
  "X  XX  X",
  "XX    XX",
  "XXX  XXX",
  "XXXXXXXX",

  // Shifted $97 (151) >w<
  "XXXXXXXX",
  "XXXXXXXX",
  "X  XXX  ",
  "X  X X  ",
  "X       ",
  "XX     X",
  "XX  X  X",
  "XXXXXXXX",

  // Shifted $98 (152) >x<
  "XXXXXXXX",
  "XXXXXXXX",
  "X  XX  X",
  "XX    XX",
  "XXX  XXX",
  "XX    XX",
  "X  XX  X",
  "XXXXXXXX",

  // Shifted $99 (153) >y<
  "XXXXXXXX",
  "XXXXXXXX",
  "X  XX  X",
  "X  XX  X",
  "X  XX  X",
  "XX     X",
  "XXXX  XX",
  "X    XXX",

  // Shifted $9a (154) >z<
  "XXXXXXXX",
  "XXXXXXXX",
  "X      X",
  "XXXX  XX",
  "XXX  XXX",
  "XX  XXXX",
  "X      X",
  "XXXXXXXX",

  // Shifted $9b (155) >[<
  "XX    XX",
  "XX  XXXX",
  "XX  XXXX",
  "XX  XXXX",
  "XX  XXXX",
  "XX  XXXX",
  "XX    XX",
  "XXXXXXXX",

  // Shifted $9c (156) >£<
  "XXXX  XX",
  "XXX XX X",
  "XX  XXXX",
  "X     XX",
  "XX  XXXX",
  "X  XXX X",
  "      XX",
  "XXXXXXXX",

  // Shifted $9d (157) >]<
  "XX    XX",
  "XXXX  XX",
  "XXXX  XX",
  "XXXX  XX",
  "XXXX  XX",
  "XXXX  XX",
  "XX    XX",
  "XXXXXXXX",

  // Shifted $9e (158) >↑<
  "XXXXXXXX",
  "XXX  XXX",
  "XX    XX",
  "X      X",
  "XXX  XXX",
  "XXX  XXX",
  "XXX  XXX",
  "XXX  XXX",

  // Shifted $9f (159) >←<
  "XXXXXXXX",
  "XXX XXXX",
  "XX  XXXX",
  "X       ",
  "X       ",
  "XX  XXXX",
  "XXX XXXX",
  "XXXXXXXX",

  // Shifted $a0 (160) > <
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",

  // Shifted $a1 (161) >!<
  "XXX  XXX",
  "XXX  XXX",
  "XXX  XXX",
  "XXX  XXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXX  XXX",
  "XXXXXXXX",

  // Shifted $a2 (162) >"<
  "X  XX  X",
  "X  XX  X",
  "X  XX  X",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",

  // Shifted $a3 (163) >#<
  "X  XX  X",
  "X  XX  X",
  "        ",
  "X  XX  X",
  "        ",
  "X  XX  X",
  "X  XX  X",
  "XXXXXXXX",

  // Shifted $a4 (164) >$<
  "XXX  XXX",
  "XX     X",
  "X  XXXXX",
  "XX    XX",
  "XXXXX  X",
  "X     XX",
  "XXX  XXX",
  "XXXXXXXX",

  // Shifted $a5 (165) >%<
  "X  XXX X",
  "X  XX  X",
  "XXXX  XX",
  "XXX  XXX",
  "XX  XXXX",
  "X  XX  X",
  "X XXX  X",
  "XXXXXXXX",

  // Shifted $a6 (166) >&<
  "XX    XX",
  "X  XX  X",
  "XX    XX",
  "XX   XXX",
  "X  XX   ",
  "X  XX  X",
  "XX      ",
  "XXXXXXXX",

  // Shifted $a7 (167) >'<
  "XXXXX  X",
  "XXXX  XX",
  "XXX  XXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",

  // Shifted $a8 (168) >(<
  "XXXX  XX",
  "XXX  XXX",
  "XX  XXXX",
  "XX  XXXX",
  "XX  XXXX",
  "XXX  XXX",
  "XXXX  XX",
  "XXXXXXXX",

  // Shifted $a9 (169) >)<
  "XX  XXXX",
  "XXX  XXX",
  "XXXX  XX",
  "XXXX  XX",
  "XXXX  XX",
  "XXX  XXX",
  "XX  XXXX",
  "XXXXXXXX",

  // Shifted $aa (170) >*<
  "XXXXXXXX",
  "X  XX  X",
  "XX    XX",
  "        ",
  "XX    XX",
  "X  XX  X",
  "XXXXXXXX",
  "XXXXXXXX",

  // Shifted $ab (171) >+<
  "XXXXXXXX",
  "XXX  XXX",
  "XXX  XXX",
  "X      X",
  "XXX  XXX",
  "XXX  XXX",
  "XXXXXXXX",
  "XXXXXXXX",

  // Shifted $ac (172) >,<
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXX  XXX",
  "XXX  XXX",
  "XX  XXXX",

  // Shifted $ad (173) >-<
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "X      X",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",

  // Shifted $ae (174) >.<
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXX  XXX",
  "XXX  XXX",
  "XXXXXXXX",

  // Shifted $af (175) >/<
  "XXXXXXXX",
  "XXXXXX  ",
  "XXXXX  X",
  "XXXX  XX",
  "XXX  XXX",
  "XX  XXXX",
  "X  XXXXX",
  "XXXXXXXX",

  // Shifted $b0 (176) >0<
  "XX    XX",
  "X  XX  X",
  "X  X   X",
  "X   X  X",
  "X  XX  X",
  "X  XX  X",
  "XX    XX",
  "XXXXXXXX",

  // Shifted $b1 (177) >1<
  "XXX  XXX",
  "XXX  XXX",
  "XX   XXX",
  "XXX  XXX",
  "XXX  XXX",
  "XXX  XXX",
  "X      X",
  "XXXXXXXX",

  // Shifted $b2 (178) >2<
  "XX    XX",
  "X  XX  X",
  "XXXXX  X",
  "XXXX  XX",
  "XX  XXXX",
  "X  XXXXX",
  "X      X",
  "XXXXXXXX",

  // Shifted $b3 (179) >3<
  "XX    XX",
  "X  XX  X",
  "XXXXX  X",
  "XXX   XX",
  "XXXXX  X",
  "X  XX  X",
  "XX    XX",
  "XXXXXXXX",

  // Shifted $b4 (180) >4<
  "XXXXX  X",
  "XXXX   X",
  "XXX    X",
  "X  XX  X",
  "X       ",
  "XXXXX  X",
  "XXXXX  X",
  "XXXXXXXX",

  // Shifted $b5 (181) >5<
  "X      X",
  "X  XXXXX",
  "X     XX",
  "XXXXX  X",
  "XXXXX  X",
  "X  XX  X",
  "XX    XX",
  "XXXXXXXX",

  // Shifted $b6 (182) >6<
  "XX    XX",
  "X  XX  X",
  "X  XXXXX",
  "X     XX",
  "X  XX  X",
  "X  XX  X",
  "XX    XX",
  "XXXXXXXX",

  // Shifted $b7 (183) >7<
  "X      X",
  "X  XX  X",
  "XXXX  XX",
  "XXX  XXX",
  "XXX  XXX",
  "XXX  XXX",
  "XXX  XXX",
  "XXXXXXXX",

  // Shifted $b8 (184) >8<
  "XX    XX",
  "X  XX  X",
  "X  XX  X",
  "XX    XX",
  "X  XX  X",
  "X  XX  X",
  "XX    XX",
  "XXXXXXXX",

  // Shifted $b9 (185) >9<
  "XX    XX",
  "X  XX  X",
  "X  XX  X",
  "XX     X",
  "XXXXX  X",
  "X  XX  X",
  "XX    XX",
  "XXXXXXXX",

  // Shifted $ba (186) >:<
  "XXXXXXXX",
  "XXXXXXXX",
  "XXX  XXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXX  XXX",
  "XXXXXXXX",
  "XXXXXXXX",

  // Shifted $bb (187) >;<
  "XXXXXXXX",
  "XXXXXXXX",
  "XXX  XXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXX  XXX",
  "XXX  XXX",
  "XX  XXXX",

  // Shifted $bc (188) ><<
  "XXXX   X",
  "XXX  XXX",
  "XX  XXXX",
  "X  XXXXX",
  "XX  XXXX",
  "XXX  XXX",
  "XXXX   X",
  "XXXXXXXX",

  // Shifted $bd (189) >=<
  "XXXXXXXX",
  "XXXXXXXX",
  "X      X",
  "XXXXXXXX",
  "X      X",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",

  // Shifted $be (190) >><
  "X   XXXX",
  "XXX  XXX",
  "XXXX  XX",
  "XXXXX  X",
  "XXXX  XX",
  "XXX  XXX",
  "X   XXXX",
  "XXXXXXXX",

  // Shifted $bf (191) >?<
  "XX    XX",
  "X  XX  X",
  "XXXXX  X",
  "XXXX  XX",
  "XXX  XXX",
  "XXXXXXXX",
  "XXX  XXX",
  "XXXXXXXX",

  // Shifted $c0 (192) >─<
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "        ",
  "        ",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",

  // Shifted $c1 (193) >A<
  "XXX  XXX",
  "XX    XX",
  "X  XX  X",
  "X      X",
  "X  XX  X",
  "X  XX  X",
  "X  XX  X",
  "XXXXXXXX",

  // Shifted $c2 (194) >B<
  "X     XX",
  "X  XX  X",
  "X  XX  X",
  "X     XX",
  "X  XX  X",
  "X  XX  X",
  "X     XX",
  "XXXXXXXX",

  // Shifted $c3 (195) >C<
  "XX    XX",
  "X  XX  X",
  "X  XXXXX",
  "X  XXXXX",
  "X  XXXXX",
  "X  XX  X",
  "XX    XX",
  "XXXXXXXX",

  // Shifted $c4 (196) >D<
  "X    XXX",
  "X  X  XX",
  "X  XX  X",
  "X  XX  X",
  "X  XX  X",
  "X  X  XX",
  "X    XXX",
  "XXXXXXXX",

  // Shifted $c5 (197) >E<
  "X      X",
  "X  XXXXX",
  "X  XXXXX",
  "X    XXX",
  "X  XXXXX",
  "X  XXXXX",
  "X      X",
  "XXXXXXXX",

  // Shifted $c6 (198) >F<
  "X      X",
  "X  XXXXX",
  "X  XXXXX",
  "X    XXX",
  "X  XXXXX",
  "X  XXXXX",
  "X  XXXXX",
  "XXXXXXXX",

  // Shifted $c7 (199) >G<
  "XX    XX",
  "X  XX  X",
  "X  XXXXX",
  "X  X   X",
  "X  XX  X",
  "X  XX  X",
  "XX    XX",
  "XXXXXXXX",

  // Shifted $c8 (200) >H<
  "X  XX  X",
  "X  XX  X",
  "X  XX  X",
  "X      X",
  "X  XX  X",
  "X  XX  X",
  "X  XX  X",
  "XXXXXXXX",

  // Shifted $c9 (201) >I<
  "XX    XX",
  "XXX  XXX",
  "XXX  XXX",
  "XXX  XXX",
  "XXX  XXX",
  "XXX  XXX",
  "XX    XX",
  "XXXXXXXX",

  // Shifted $ca (202) >J<
  "XXX    X",
  "XXXX  XX",
  "XXXX  XX",
  "XXXX  XX",
  "XXXX  XX",
  "X  X  XX",
  "XX   XXX",
  "XXXXXXXX",

  // Shifted $cb (203) >K<
  "X  XX  X",
  "X  X  XX",
  "X    XXX",
  "X   XXXX",
  "X    XXX",
  "X  X  XX",
  "X  XX  X",
  "XXXXXXXX",

  // Shifted $cc (204) >L<
  "X  XXXXX",
  "X  XXXXX",
  "X  XXXXX",
  "X  XXXXX",
  "X  XXXXX",
  "X  XXXXX",
  "X      X",
  "XXXXXXXX",

  // Shifted $cd (205) >M<
  "X  XXX  ",
  "X   X   ",
  "X       ",
  "X  X X  ",
  "X  XXX  ",
  "X  XXX  ",
  "X  XXX  ",
  "XXXXXXXX",

  // Shifted $ce (206) >N<
  "X  XX  X",
  "X   X  X",
  "X      X",
  "X      X",
  "X  X   X",
  "X  XX  X",
  "X  XX  X",
  "XXXXXXXX",

  // Shifted $cf (207) >O<
  "XX    XX",
  "X  XX  X",
  "X  XX  X",
  "X  XX  X",
  "X  XX  X",
  "X  XX  X",
  "XX    XX",
  "XXXXXXXX",

  // Shifted $d0 (208) >P<
  "X     XX",
  "X  XX  X",
  "X  XX  X",
  "X     XX",
  "X  XXXXX",
  "X  XXXXX",
  "X  XXXXX",
  "XXXXXXXX",

  // Shifted $d1 (209) >Q<
  "XX    XX",
  "X  XX  X",
  "X  XX  X",
  "X  XX  X",
  "X  XX  X",
  "XX    XX",
  "XXXX   X",
  "XXXXXXXX",

  // Shifted $d2 (210) >R<
  "X     XX",
  "X  XX  X",
  "X  XX  X",
  "X     XX",
  "X    XXX",
  "X  X  XX",
  "X  XX  X",
  "XXXXXXXX",

  // Shifted $d3 (211) >S<
  "XX    XX",
  "X  XX  X",
  "X  XXXXX",
  "XX    XX",
  "XXXXX  X",
  "X  XX  X",
  "XX    XX",
  "XXXXXXXX",

  // Shifted $d4 (212) >T<
  "X      X",
  "XXX  XXX",
  "XXX  XXX",
  "XXX  XXX",
  "XXX  XXX",
  "XXX  XXX",
  "XXX  XXX",
  "XXXXXXXX",

  // Shifted $d5 (213) >U<
  "X  XX  X",
  "X  XX  X",
  "X  XX  X",
  "X  XX  X",
  "X  XX  X",
  "X  XX  X",
  "XX    XX",
  "XXXXXXXX",

  // Shifted $d6 (214) >V<
  "X  XX  X",
  "X  XX  X",
  "X  XX  X",
  "X  XX  X",
  "X  XX  X",
  "XX    XX",
  "XXX  XXX",
  "XXXXXXXX",

  // Shifted $d7 (215) >W<
  "X  XXX  ",
  "X  XXX  ",
  "X  XXX  ",
  "X  X X  ",
  "X       ",
  "X   X   ",
  "X  XXX  ",
  "XXXXXXXX",

  // Shifted $d8 (216) >X<
  "X  XX  X",
  "X  XX  X",
  "XX    XX",
  "XXX  XXX",
  "XX    XX",
  "X  XX  X",
  "X  XX  X",
  "XXXXXXXX",

  // Shifted $d9 (217) >Y<
  "X  XX  X",
  "X  XX  X",
  "X  XX  X",
  "XX    XX",
  "XXX  XXX",
  "XXX  XXX",
  "XXX  XXX",
  "XXXXXXXX",

  // Shifted $da (218) >Z<
  "X      X",
  "XXXXX  X",
  "XXXX  XX",
  "XXX  XXX",
  "XX  XXXX",
  "X  XXXXX",
  "X      X",
  "XXXXXXXX",

  // Shifted $db (219) >┼<
  "XXX  XXX",
  "XXX  XXX",
  "XXX  XXX",
  "        ",
  "        ",
  "XXX  XXX",
  "XXX  XXX",
  "XXX  XXX",

  // Shifted $dc (220) >▒<
  "  XXXXXX",
  "  XXXXXX",
  "XX  XXXX",
  "XX  XXXX",
  "  XXXXXX",
  "  XXXXXX",
  "XX  XXXX",
  "XX  XXXX",

  // Shifted $dd (221) >│<
  "XXX  XXX",
  "XXX  XXX",
  "XXX  XXX",
  "XXX  XXX",
  "XXX  XXX",
  "XXX  XXX",
  "XXX  XXX",
  "XXX  XXX",

  // Shifted $de (222) >▒<
  "XX  XX  ",
  "XX  XX  ",
  "  XX  XX",
  "  XX  XX",
  "XX  XX  ",
  "XX  XX  ",
  "  XX  XX",
  "  XX  XX",

  // Shifted $df (223) >▒<
  "XX  XX  ",
  " XX  XX ",
  "  XX  XX",
  "X  XX  X",
  "XX  XX  ",
  " XX  XX ",
  "  XX  XX",
  "X  XX  X",

  // Shifted $e0 (224) > <
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",

  // Shifted $e1 (225) >▌<
  "    XXXX",
  "    XXXX",
  "    XXXX",
  "    XXXX",
  "    XXXX",
  "    XXXX",
  "    XXXX",
  "    XXXX",

  // Shifted $e2 (226) >▄<
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "        ",
  "        ",
  "        ",
  "        ",

  // Shifted $e3 (227) >▔<
  "        ",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",

  // Shifted $e4 (228) >▁<
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "        ",

  // Shifted $e5 (229) >▎<
  "  XXXXXX",
  "  XXXXXX",
  "  XXXXXX",
  "  XXXXXX",
  "  XXXXXX",
  "  XXXXXX",
  "  XXXXXX",
  "  XXXXXX",

  // Shifted $e6 (230) >▒<
  "  XX  XX",
  "  XX  XX",
  "XX  XX  ",
  "XX  XX  ",
  "  XX  XX",
  "  XX  XX",
  "XX  XX  ",
  "XX  XX  ",

  // Shifted $e7 (231) >▕<
  "XXXXXX  ",
  "XXXXXX  ",
  "XXXXXX  ",
  "XXXXXX  ",
  "XXXXXX  ",
  "XXXXXX  ",
  "XXXXXX  ",
  "XXXXXX  ",

  // Shifted $e8 (232) >▒<
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "  XX  XX",
  "  XX  XX",
  "XX  XX  ",
  "XX  XX  ",

  // Shifted $e9 (233) >▒<
  "  XX  XX",
  " XX  XX ",
  "XX  XX  ",
  "X  XX  X",
  "  XX  XX",
  " XX  XX ",
  "XX  XX  ",
  "X  XX  X",

  // Shifted $ea (234) >▕<
  "XXXXXX  ",
  "XXXXXX  ",
  "XXXXXX  ",
  "XXXXXX  ",
  "XXXXXX  ",
  "XXXXXX  ",
  "XXXXXX  ",
  "XXXXXX  ",

  // Shifted $eb (235) >├<
  "XXX  XXX",
  "XXX  XXX",
  "XXX  XXX",
  "XXX     ",
  "XXX     ",
  "XXX  XXX",
  "XXX  XXX",
  "XXX  XXX",

  // Shifted $ec (236) >▗<
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXX    ",
  "XXXX    ",
  "XXXX    ",
  "XXXX    ",

  // Shifted $ed (237) >└<
  "XXX  XXX",
  "XXX  XXX",
  "XXX  XXX",
  "XXX     ",
  "XXX     ",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",

  // Shifted $ee (238) >┐<
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "     XXX",
  "     XXX",
  "XXX  XXX",
  "XXX  XXX",
  "XXX  XXX",

  // Shifted $ef (239) >▂<
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "        ",
  "        ",

  // Shifted $f0 (240) >┌<
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXX     ",
  "XXX     ",
  "XXX  XXX",
  "XXX  XXX",
  "XXX  XXX",

  // Shifted $f1 (241) >┴<
  "XXX  XXX",
  "XXX  XXX",
  "XXX  XXX",
  "        ",
  "        ",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",

  // Shifted $f2 (242) >┬<
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "        ",
  "        ",
  "XXX  XXX",
  "XXX  XXX",
  "XXX  XXX",

  // Shifted $f3 (243) >┤<
  "XXX  XXX",
  "XXX  XXX",
  "XXX  XXX",
  "     XXX",
  "     XXX",
  "XXX  XXX",
  "XXX  XXX",
  "XXX  XXX",

  // Shifted $f4 (244) >▎<
  "  XXXXXX",
  "  XXXXXX",
  "  XXXXXX",
  "  XXXXXX",
  "  XXXXXX",
  "  XXXXXX",
  "  XXXXXX",
  "  XXXXXX",

  // Shifted $f5 (245) >▍<
  "   XXXXX",
  "   XXXXX",
  "   XXXXX",
  "   XXXXX",
  "   XXXXX",
  "   XXXXX",
  "   XXXXX",
  "   XXXXX",

  // Shifted $f6 (246) >▕<
  "XXXXX   ",
  "XXXXX   ",
  "XXXXX   ",
  "XXXXX   ",
  "XXXXX   ",
  "XXXXX   ",
  "XXXXX   ",
  "XXXXX   ",

  // Shifted $f7 (247) >▔<
  "        ",
  "        ",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",

  // Shifted $f8 (248) >▔<
  "        ",
  "        ",
  "        ",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",

  // Shifted $f9 (249) >▃<
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "        ",
  "        ",
  "        ",

  // Shifted $fa (250) >✓<
  "XXXXXXX ",
  "XXXXXX  ",
  "XXXXX  X",
  "X  X  XX",
  "X    XXX",
  "X   XXXX",
  "X  XXXXX",
  "XXXXXXXX",

  // Shifted $fb (251) >▖<
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "    XXXX",
  "    XXXX",
  "    XXXX",
  "    XXXX",

  // Shifted $fc (252) >▝<
  "XXXX    ",
  "XXXX    ",
  "XXXX    ",
  "XXXX    ",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",

  // Shifted $fd (253) >┘<
  "XXX  XXX",
  "XXX  XXX",
  "XXX  XXX",
  "     XXX",
  "     XXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",

  // Shifted $fe (254) >▘<
  "    XXXX",
  "    XXXX",
  "    XXXX",
  "    XXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",
  "XXXXXXXX",

  // Shifted $ff (255) >▚<
  "    XXXX",
  "    XXXX",
  "    XXXX",
  "    XXXX",
  "XXXX    ",
  "XXXX    ",
  "XXXX    ",
  "XXXX    ",

].map(
  str => Array
    .from(str)
    .reduce((acc, cur) => (acc << 1) | ((cur === " ") ? 0 : 1), 0)
);
