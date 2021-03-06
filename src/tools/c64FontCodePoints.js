/*
   Tools for translating in and out of C64 font codepoints.

   Note that C64 font codepoints aren't PETSCII. They're how PETSCII is
   delivered, but take a different layout. A-Z, for instance, are 65-90 in
   PETSCII (and ASCII for that matter), but occupy positions 1-26 of the font.

   Reference: https://style64.org/petscii/
*/

const ANSI_SGR_REVERSE_ON  = "\x1b[7m";
const ANSI_SGR_REVERSE_OFF = "\x1b[27m";

// The right pair is the 'wide' version, comprising 'full-width' characters,
// and pairs of regular characters. On my text editor, the two don't quite
// match in length, but on my terminal (macOS Terminal) they do. It's a
// pretty tenuous mode.
const CLOSEST_UNICODES = [
  // unshifted   unshifted
  //     shifted      shifted
  [["@", "@"], ["＠", "＠"]], // 0x00 (0)
  [["A", "a"], ["Ａ", "ａ"]], // 0x01 (1)
  [["B", "b"], ["Ｂ", "ｂ"]], // 0x02 (2)
  [["C", "c"], ["Ｃ", "ｃ"]], // 0x03 (3)
  [["D", "d"], ["Ｄ", "ｄ"]], // 0x04 (4)
  [["E", "e"], ["Ｅ", "ｅ"]], // 0x05 (5)
  [["F", "f"], ["Ｆ", "ｆ"]], // 0x06 (6)
  [["G", "g"], ["Ｇ", "ｇ"]], // 0x07 (7)
  [["H", "h"], ["Ｈ", "ｈ"]], // 0x08 (8)
  [["I", "i"], ["Ｉ", "ｉ"]], // 0x09 (9)
  [["J", "j"], ["Ｊ", "ｊ"]], // 0x0a (10)
  [["K", "k"], ["Ｋ", "ｋ"]], // 0x0b (11)
  [["L", "l"], ["Ｌ", "ｌ"]], // 0x0c (12)
  [["M", "m"], ["Ｍ", "ｍ"]], // 0x0d (13)
  [["N", "n"], ["Ｎ", "ｎ"]], // 0x0e (14)
  [["O", "o"], ["Ｏ", "ｏ"]], // 0x0f (15)
  [["P", "p"], ["Ｐ", "ｐ"]], // 0x10 (16)
  [["Q", "q"], ["Ｑ", "ｑ"]], // 0x11 (17)
  [["R", "r"], ["Ｒ", "ｒ"]], // 0x12 (18)
  [["S", "s"], ["Ｓ", "ｓ"]], // 0x13 (19)
  [["T", "t"], ["Ｔ", "ｔ"]], // 0x14 (20)
  [["U", "u"], ["Ｕ", "ｕ"]], // 0x15 (21)
  [["V", "v"], ["Ｖ", "ｖ"]], // 0x16 (22)
  [["W", "w"], ["Ｗ", "ｗ"]], // 0x17 (23)
  [["X", "x"], ["Ｘ", "ｘ"]], // 0x18 (24)
  [["Y", "y"], ["Ｙ", "ｙ"]], // 0x19 (25)
  [["Z", "z"], ["Ｚ", "ｚ"]], // 0x1a (26)
  [["[", "["], ["［", "［"]], // 0x1b (27)
  [["£", "£"], ["￡", "￡"]], // 0x1c (28)
  [["]", "]"], ["］", "］"]], // 0x1d (29)
  [["↑", "↑"], [" ↑", " ↑"]], // 0x1e (30)
  [["←", "←"], [" ←", " ←"]], // 0x1f (31)
  [[" ", " "], ["　", "　"]], // 0x20 (32)
  [["!", "!"], ["！", "！"]], // 0x21 (33)
  [['"', '"'], ["＂", '＂']], // 0x22 (34)
  [["#", "#"], ["＃", "＃"]], // 0x23 (35)
  [["$", "$"], ["＄", "＄"]], // 0x24 (36)
  [["%", "%"], ["％", "％"]], // 0x25 (37)
  [["&", "&"], ["＆", "＆"]], // 0x26 (38)
  [["'", "'"], ["＇", "＇"]], // 0x27 (39)
  [["(", "("], ["（", "（"]], // 0x28 (40)
  [[")", ")"], ["）", "）"]], // 0x29 (41)
  [["*", "*"], ["＊", "＊"]], // 0x2a (42)
  [["+", "+"], ["＋", "＋"]], // 0x2b (43)
  [[",", ","], ["，", "，"]], // 0x2c (44)
  [["-", "-"], ["－", "－"]], // 0x2d (45)
  [[".", "."], ["．", "．"]], // 0x2e (46)
  [["/", "/"], ["／", "／"]], // 0x2f (47)
  [["0", "0"], ["０", "０"]], // 0x30 (48)
  [["1", "1"], ["１", "１"]], // 0x31 (49)
  [["2", "2"], ["２", "２"]], // 0x32 (50)
  [["3", "3"], ["３", "３"]], // 0x33 (51)
  [["4", "4"], ["４", "４"]], // 0x34 (52)
  [["5", "5"], ["５", "５"]], // 0x35 (53)
  [["6", "6"], ["６", "６"]], // 0x36 (54)
  [["7", "7"], ["７", "７"]], // 0x37 (55)
  [["8", "8"], ["８", "８"]], // 0x38 (56)
  [["9", "9"], ["９", "９"]], // 0x39 (57)
  [[":", ":"], ["：", "："]], // 0x3a (58)
  [[";", ";"], ["；", "；"]], // 0x3b (59)
  [["<", "<"], ["＜", "＜"]], // 0x3c (60)
  [["=", "="], ["＝", "＝"]], // 0x3d (61)
  [[">", ">"], ["＞", "＞"]], // 0x3e (62)
  [["?", "?"], ["？", "？"]], // 0x3f (63)
  [["─", "─"], ["－", "──"]], // 0x40 (64)
  [["♠", "A"], [" ♠", "Ａ"]], // 0x41 (65)
  [["│", "B"], ["｜", "Ｂ"]], // 0x42 (66)
  [["─", "C"], ["──", "Ｃ"]], // 0x43 (67)
  [["─", "D"], ["──", "Ｄ"]], // 0x44 (68)
  [["▔", "E"], ["￣", "Ｅ"]], // 0x45 (69)
  [["─", "F"], ["──", "Ｆ"]], // 0x46 (70)
  [["│", "G"], ["｜", "Ｇ"]], // 0x47 (71)
  [["│", "H"], ["｜", "Ｈ"]], // 0x48 (72)
  [["╮", "I"], ["─╮", "Ｉ"]], // 0x49 (73)
  [["╰", "J"], [" ╰", "Ｊ"]], // 0x4a (74)
  [["╯", "K"], ["─╯", "Ｋ"]], // 0x4b (75)
  [["⌞", "L"], [" ⌞", "Ｌ"]], // 0x4c (76)
  [["╲", "M"], [" ╲", "Ｍ"]], // 0x4d (77)
  [["╱", "N"], [" ╱", "Ｎ"]], // 0x4e (78)
  [["⌜", "O"], [" ⌜", "Ｏ"]], // 0x4f (79)
  [["⌝", "P"], ["▔⌝", "Ｐ"]], // 0x50 (80)
  [["●", "Q"], [" ●", "Ｑ"]], // 0x51 (81)
  [["_", "R"], ["＿", "Ｒ"]], // 0x52 (82)
  [["♥", "S"], [" ♥", "Ｓ"]], // 0x53 (83)
  [["▎", "T"], ["│ ", "Ｔ"]], // 0x54 (84)
  [["╭", "U"], [" ╭", "Ｕ"]], // 0x55 (85)
  [["╳", "V"], ["><", "Ｖ"]], // 0x56 (86)
  [["○", "W"], [" ○", "Ｗ"]], // 0x57 (87)
  [["♣", "X"], [" ♣", "Ｘ"]], // 0x58 (88)
  [["▕", "Y"], [" ▕", "Ｙ"]], // 0x59 (89)
  [["♦", "Z"], [" ♦", "Ｚ"]], // 0x5a (90)
  [["┼", "┼"], ["─┼", "─┼"]], // 0x5b (91)
  [["▒", "▒"], ["▒ ", "▒ "]], // 0x5c (92)
  [["│", "│"], [" │", " │"]], // 0x5d (93)
  [["π", "▒"], [" π", "▒▒"]], // 0x5e (94)
  [["◥", "▒"], [" ◥", "▒▒"]], // 0x5f (95)
  [[" ", " "], ["  ", "  "]], // 0x60 (96)
  [["▌", "▌"], ["▌ ", "▌ "]], // 0x61 (97)
  [["▄", "▄"], ["▄▄", "▄▄"]], // 0x62 (98)
  [["▔", "▔"], ["▔▔", "▔▔"]], // 0x63 (99)
  [["▁", "▁"], ["▁▁", "▁▁"]], // 0x64 (100)
  [["▎", "▎"], ["▎ ", "▎ "]], // 0x65 (101)
  [["▒", "▒"], ["▒▒", "▒▒"]], // 0x66 (102)
  [["▕", "▕"], [" ▕", " ▕"]], // 0x67 (103)
  [["▒", "▒"], ["▒▒", "▒▒"]], // 0x68 (104)
  [["◤", "▒"], [" ◤", "▒▒"]], // 0x69 (105)
  [["▕", "▕"], [" ▕", " ▕"]], // 0x6a (106)
  [["├", "├"], [" ├", " ├"]], // 0x6b (107)
  [["▗", "▗"], [" ▄", " ▄"]], // 0x6c (108)
  [["└", "└"], [" └", " └"]], // 0x6d (109)
  [["┐", "┐"], ["─┐", "─┐"]], // 0x6e (110)
  [["▂", "▂"], ["▂▂", "▂▂"]], // 0x6f (111)
  [["┌", "┌"], [" ┌", " ┌"]], // 0x70 (112)
  [["┴", "┴"], ["─┴", "─┴"]], // 0x71 (113)
  [["┬", "┬"], ["─┬", "─┬"]], // 0x72 (114)
  [["┤", "┤"], ["─┤", "─┤"]], // 0x73 (115)
  [["▎", "▎"], ["▎ ", "▎ "]], // 0x74 (116)
  [["▍", "▍"], ["▍ ", "▍ "]], // 0x75 (117)
  [["▕", "▕"], [" ▕", "▕ "]], // 0x76 (118)
  [["▔", "▔"], ["▔▔", "▔▔"]], // 0x77 (119)
  [["▔", "▔"], ["▔▔", "▔▔"]], // 0x78 (120)
  [["▃", "▃"], ["▃▃", "▃▃"]], // 0x79 (121)
  [["⌟", "✓"], ["▁⌟", " ✓"]], // 0x7a (122)
  [["▖", "▖"], ["▃ ", "▃ "]], // 0x7b (123)
  [["▝", "▝"], [" ▝", " ▝"]], // 0x7c (124)
  [["┘", "┘"], ["─┘", "─┘"]], // 0x7d (125)
  [["▘", "▘"], ["▘ ", "▘ "]], // 0x7e (126)
  [["▚", "▚"], ["▚▄", "▚▄"]], // 0x7f (127)
];

export function c64FontCodePointToChar(byte, shifted, wide) {
  if (byte >= 0x80) {
    return (
      ANSI_SGR_REVERSE_ON +
      c64FontCodePointToChar(byte & 0x7f, shifted, wide) +
      ANSI_SGR_REVERSE_OFF
    );
  };

  return CLOSEST_UNICODES[byte][wide ? 1 : 0][shifted ? 1 : 0];
}

export function charToC64FontCodePoint(char, shifted) {
  if (!shifted) {
    // Quick cases
    if ((char >= "0") && (char <= "9")) return char.charCodeAt(0);
    if ((char >= "A") && (char <= "Z")) return char.charCodeAt(0) - 0x40;
    if ((char >= "a") && (char <= "z")) return char.charCodeAt(0) - 0x60;
    if (char === " ")                   return 0x20;
  }

  for (let i = 0; i < 128; i++) {
    if (CLOSEST_UNICODES[i][0][shifted ? 1 : 0] === char) return i; 
  }

  return 0x20;
}

export const hexDigitToC64FontCodePoint = [
  0x30, 0x31, 0x32, 0x33,
  0x34, 0x35, 0x36, 0x37,
  0x38, 0x39, 0x01, 0x02,
  0x03, 0x04, 0x05, 0x06,
];

export function petsciiToFontCodePoint(num) {
  // See Kernal around $e737
  if (num <  0x20) return 0x20;
  if (num >= 0x60) return num & 0xdf;
  else             return num & 0x3f;
}
