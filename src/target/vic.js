/*
   vic: emulates the 6569 (VIC-II; PAL) graphics processor

   ...a big proof-of-concept that grew to encompass all of the chip's
   functionality, and really needs to be re-done. In particular, its timing
   is just placeholder, and it doesn't try stun the CPU for bad lines (the BA
   line) so raster-stable routines aren't going to work, to say nothing of
   tricks like DMA delay.

   (We're a little loose with terminology too)

   The Vic simulation takes by far the bulk of the emulation time, which we'd
   expect given how much work it does compared to the CPU. But still, it's ripe
   for optimization.

   References:

   †1 http://www.zimmers.net/cbmpics/cbm/c64/vic-ii.txt
   †2 sta64 memory map: https://sta.c64.org/cbm64mem.html
    - http://unusedino.de/ec64/technical/project64/mapping_c64.html 
*/

import { $xx, $xxxx, unimplementedWarning } from "../debug";
import {
  systemPalette,
  grayscalePalette,
  highlightPalettes,
  colorColorPalettes
} from "../tools/palettes";

// Bound by attach
let c64;
let vicRead;
let setVicIrq;
let setPixel;
let blit;

let state = {};
const config = {
  ignoreSprSprCollisions: false,
  ignoreSprBgCollisions:  false,
  scopeSprites:           false,
  scopeBackground:        false,
  scopeCollision:         false,
  scopeColorRam:          false,
};

const specialStateValues = [
  ["charBuffer",       Uint8Array,  40    ],
  ["colorBuffer",      Uint8Array,  40    ],
  ["bgRgbQueue",       Uint32Array, 8     ],
  ["bgMaskQueue",      Uint8Array,  8     ],
  ["bgCollisionQueue", Uint8Array,  8     ],
  ["color",            Uint8Array,  0x400 ],
];

// Timing constants (PAL)

const     BORDER_OFF_LINE_25_ROWS = 51;
const     BORDER_OFF_LINE_24_ROWS = 55;
const      BORDER_ON_LINE_25_ROWS = 251;
const      BORDER_ON_LINE_24_ROWS = 247;

const            LAST_RASTER_LINE = 311;

// The first cycle within a line on which character pointer is read
const CHAR_FETCH_CYCLE = 16;

export function attach(nascentC64) {
  c64 = nascentC64;

  vicRead   = c64.wires.vicRead;
  setVicIrq = c64.wires.setVicIrq;
  setPixel  = c64.video.setPixel;
  blit      = c64.video.blit;

  c64.vic = {
    // Control
    tick,
    reset,
    serialize,
    deserialize,
    // MMIO
    read_d000_d3ff,
    read_d800_dbff,
    write_d000_d3ff,
    write_d800_dbff,
    // Scopes
    setIgnoreSprBgCol,
    setIgnoreSprSprCol,
    setScope,
    // Gimmicks
    showStatic,
  };

  reset();
}

function reset() {

  const makeDefaultSprite = () => ({
    x:       0,         // $d000, $d002, $d004, ..., with $d010
    y:       0,         // $d001, $d003, $d005, ...
    x2h:     false,     // $d017
    x2w:     false,     // $d01d
    color:   0,         // $d027, $d028, $d029, ...
    mcm:     0,         // $d01c
    behind:  false,     // $d01b
    enabled: false,     // $d015

    // sequence for next scanline:

    colorQueue:     new Array(48),
    maskQueue:      new Array(48),
    collisionQueue: new Array(48),

    xStart: undefined,
    xEnd:   undefined,
  });

  state = {
    cyclesUntilRasterInc: 62,
    cycleOfLine: 0,
    lineOfRaster: 0,
    dflag: true,                // top/bottom border
    vflag: true,                // left/right border
    badline: 0,                 // just for dev

    raster: 0,                  // $d011-2 read
    rasterIrq: 0,               // $d011-2 write
    memorySetup: 0,             // $d018
    interruptStatus: 0,         // $d019, but not but 7 (derive that from irq)
    interruptControl: 0,        // $d01a
    irq: false,                 // derived from interruptStatus and interruptControl

    xscroll: 0,                 // $d016
    yscroll: 0,                 // $d011

    fortyColumns:   true,       // $d016
    twentyFiveRows: true,       // $d011
    displayEnable:  true,       // $d011

    // These are all 4-bit color codes:
    borderColor:            0,  // $d020
    backgroundColor:        0,  // $d021
    extraBgColor1:          0,  // $d022
    extraBgColor2:          0,  // $d023
    extraBgColor3:          0,  // $d024
    spriteMulticolorColor0: 0,  // $d025
    spriteMulticolorColor1: 0,  // $d026

    // Screen modes
    multicolor: false,          // $d016
    bitmap:     false,          // $d011
    extendedBg: false,          // $d011

    // Collisions
    sprSprCol: 0,               // $d01e
    sprBgCol:  0,               // $d01f

    charBuffer:  new Uint8Array(40),
    colorBuffer: new Uint8Array(40),

    // The 'sequencers' of the background pixels (char/bitmap)
    bgQueuePos:       0,
    bgRgbQueue:       new Uint32Array(8),
    bgMaskQueue:      new Uint8Array(8),
    bgCollisionQueue: new Uint8Array(8),

    nextCharCode: 0,
    nextBgByte:   0,
    nextFgCol:    0,

    // Color RAM
    color: new Uint8Array(0x400), // see $d800. Only one nybble per address

    sprites: [
      makeDefaultSprite(),
      makeDefaultSprite(),
      makeDefaultSprite(),
      makeDefaultSprite(),
      makeDefaultSprite(),
      makeDefaultSprite(),
      makeDefaultSprite(),
      makeDefaultSprite(),
    ],

    // Gimmicks
    static: false,
  };
}

function onNewLine() {

  // state.lineOfRaster has been updated

  const lineOfChar = (state.raster - state.yscroll) & 0x7;
  state.badline = lineOfChar === 7;

  if (state.twentyFiveRows) {
    if      (state.lineOfRaster === BORDER_OFF_LINE_25_ROWS) state.dflag = false;
    else if (state.lineOfRaster ===  BORDER_ON_LINE_25_ROWS) state.dflag = true;
  }
  else {
    if      (state.lineOfRaster === BORDER_OFF_LINE_24_ROWS) state.dflag = false;
    else if (state.lineOfRaster ===  BORDER_ON_LINE_24_ROWS) state.dflag = true;
  }

  if (state.lineOfRaster > LAST_RASTER_LINE) {
    state.lineOfRaster = 0;
    blit();
    if (c64.hooks.onFrameEnd) c64.hooks.onFrameEnd();
  }
}

function loadNextBgByte() {

  let indexOfCharBuffer = state.cycleOfLine - 17;

  if (state.bitmap) {

    let char = state.charBuffer[indexOfCharBuffer];

    // rows are 8 lines. We should formalize the terminology.
    const row = Math.floor((state.raster - state.yscroll + 3 - BORDER_OFF_LINE_25_ROWS) / 8);
    const lineOfChar = (state.raster - state.yscroll) & 0x7;

    const bitmapMemBase = ((state.memorySetup & 0b1000) >> 3) * 0x2000;

    let bmByte = vicRead(
      bitmapMemBase +
      (((row * 40) + indexOfCharBuffer) * 8) + lineOfChar
    );

    // nextFgCol only necessary in bitmap mode
    state.nextCharCode = char;
    state.nextBgByte   = bmByte;
    state.nextFgCol    = state.colorBuffer[indexOfCharBuffer] & 0xf;
    return;
  }

  else {

    let char = state.charBuffer[indexOfCharBuffer];
    const fgColor = state.colorBuffer[indexOfCharBuffer] & 0xf;

    // In extended background color mode, the most significant three bits of the
    // character code will determine the background color instead of the
    // character shape.
    let charShapeBase = (state.extendedBg ? (char & 0b00111111) : char) * 8;

    let charByte;
    const lineOfChar = (state.raster - state.yscroll) & 0x7;


    let charMemBase = ((state.memorySetup & 0b1110) >> 1) * 0x800;

    charByte = vicRead(charMemBase + (charShapeBase + lineOfChar));

    state.nextCharCode = char;
    state.nextBgByte   = charByte;
    state.nextFgCol    = state.colorBuffer[indexOfCharBuffer] & 0xf;
  }
}

function loadBgQueues() {

  let rgbPalette = (
    config.scopeSprites ||
    config.scopeCollision
  )
    ? grayscalePalette
    : systemPalette
  ;

  let charByte = state.nextBgByte;
  let fgColor = state.nextFgCol;

  if (config.scopeColorRam) {
    rgbPalette = colorColorPalettes[fgColor];
  }

  state.bgQueuePos = 0;

  // Illegal modes
  if (state.extendedBg && (state.multicolor || state.bitmap)) {

    if (config.scopeBackground) {
      rgbPalette = highlightPalettes[
        (state.multicolor ? 0b100 : 0) |
        (state.extendedBg ? 0b010 : 0) |
        (state.bitmap     ? 0b001 : 0)
      ];
    }

    state.bgRgbQueue      .fill(rgbPalette[0]);  // color code 0 being black
    state.bgMaskQueue     .fill(0);
    state.bgCollisionQueue.fill(0);
    return;
  }

  if (state.bitmap) {
    
    if (state.multicolor) {

      if (config.scopeBackground) rgbPalette = highlightPalettes[0b101];

      const palette = [
        state.backgroundColor,
        state.nextCharCode >> 4,
        state.nextCharCode & 0xf,
        fgColor & 0xf,
      ];

      let nextBgByte = state.nextBgByte;

      for (let x = 0; x < 4; x++) {

        const index     = (nextBgByte & 0b11000000) >> 6;
        const colorCode = palette[index];
        const rgbCode   = rgbPalette[colorCode];

        state.bgRgbQueue[(2 * x) + 0] = rgbCode;
        state.bgRgbQueue[(2 * x) + 1] = rgbCode;

        state.bgMaskQueue[(2 * x) + 0] = index > 0;
        state.bgMaskQueue[(2 * x) + 1] = index > 0;

        state.bgCollisionQueue[(2 * x) + 0] = index > 1;
        state.bgCollisionQueue[(2 * x) + 1] = index > 1;

        nextBgByte <<= 2;
      }
    }
    else {

      if (config.scopeBackground) rgbPalette = highlightPalettes[0b001];

      const col0 = state.nextCharCode & 0xf;
      const col1 = state.nextCharCode >> 4;

      const rgbCol0 = rgbPalette[col0];
      const rgbCol1 = rgbPalette[col1];

      let nextBgByte = state.nextBgByte;

      for (let x = 0; x < 8; x++) {

        state.bgRgbQueue[x] = (nextBgByte & 0b10000000) ? rgbCol1 : rgbCol0;
        state.bgMaskQueue[x] = state.bgCollisionQueue[x] = (nextBgByte & 0b10000000) ? 1 : 0;

        nextBgByte <<= 1;
      }
    }

    return;
  }

  if (state.extendedBg) {

    if (config.scopeBackground) rgbPalette = highlightPalettes[0b010];

    let bgColor;

    if      (state.nextCharCode < 64)  bgColor = state.backgroundColor;
    else if (state.nextCharCode < 128) bgColor = state.extraBgColor1;
    else if (state.nextCharCode < 192) bgColor = state.extraBgColor2;
    else                               bgColor = state.extraBgColor3;

    for (let x = 0; x < 8; x++) {

      const colorCode = (charByte & 0b10000000) ? fgColor : bgColor;
      state.bgRgbQueue[x] = rgbPalette[colorCode];

      // TODO: I'm presuming here. Check this.
      state.bgMaskQueue[x] = state.bgCollisionQueue[x] = (charByte & 0b10000000) ? 1 : 0;

      charByte <<= 1;
    }
  }

  else if (state.multicolor && (fgColor > 7)) {

    if (config.scopeBackground) rgbPalette = highlightPalettes[0b100];

    const palette = [
      state.backgroundColor,
      state.extraBgColor1,
      state.extraBgColor2,
      fgColor & 0x7,
    ];

    for (let x = 0; x < 4; x++) {

      let index = (charByte & 0b11000000) >> 6;

      const colorCode = palette[index];
      const rgbCode = rgbPalette[colorCode];

      state.bgRgbQueue[(2 * x) + 0] = rgbCode;
      state.bgRgbQueue[(2 * x) + 1] = rgbCode;

      state.bgMaskQueue[(2 * x) + 0] = index > 0;
      state.bgMaskQueue[(2 * x) + 1] = index > 0;

      state.bgCollisionQueue[(2 * x) + 0] = index > 1;
      state.bgCollisionQueue[(2 * x) + 1] = index > 1;

      charByte <<= 2;
    }
  }

  else {
    // Regular, no-color-tricks background mode

    if (config.scopeBackground) {
      // Since the multicolor mode with color code < 8 falls through to this case
      if (state.multicolor) rgbPalette = highlightPalettes[0b100];
      else rgbPalette = highlightPalettes[0b000];
    }

    for (let x = 0; x < 8; x++) {

      // I feel we should just paint them all as the foreground color, and make
      // the bgMaskQueue processor take it out.
      const colorCode = (charByte & 0b10000000) ? fgColor : state.backgroundColor;
      
      state.bgRgbQueue      [x] = rgbPalette[colorCode];
      state.bgMaskQueue     [x] = (charByte & 0b10000000);
      state.bgCollisionQueue[x] = (charByte & 0b10000000);

      charByte <<= 1;
    }
  }
}


function get8BackgroundPixels(xc, y, color, mask, collision) {
  
  const aboveTop = (
    ((state.raster - state.yscroll) >> 3) < 
    (BORDER_OFF_LINE_25_ROWS >> 3)
  );

  const belowBottom = (
    ((state.raster - state.yscroll) >> 3) > 
    (BORDER_ON_LINE_24_ROWS >> 3)
  );

  if (aboveTop || belowBottom) {

    // TODO: the real VIC serves char data from $3fff here
    for (let i = 0; i < 8; i++) {

      // TODO: We're mapping scope to palettes in too many different places.
      // This needs a more elegant solution.
      const rgbPalette = (
        config.scopeSprites    ||
        config.scopeBackground ||
        config.scopeCollision  ||
        config.scopeColorRam
      )
        ? grayscalePalette
        : systemPalette
      ;

      color[i]     = rgbPalette[state.backgroundColor];
      mask [i]     = false;
      collision[i] = false;
    }
  }
  else {
    const ret = [];

    for (let x = 0; x < 8; x++) {

      // This loads the dot queue for the next character needed, but
      // - TODO - we need to wipe it before the first one.
      if (x === state.xscroll) {
        loadBgQueues();
      }

      color    [x] =         state.bgRgbQueue      [state.bgQueuePos];
      mask     [x] = Boolean(state.bgMaskQueue     [state.bgQueuePos]);
      collision[x] = Boolean(state.bgCollisionQueue[state.bgQueuePos]);

      // Visualizing debug aid
      // color[x] = mask[x] ? 0xff0000 : 0x000000;

      if (config.scopeCollision) {
        // Sadly we've lost the original color code by this point
        if (collision[x]) color[x] = highlightPalettes[3][15];
      }

      state.bgQueuePos++;
    }
  }
}


function reconsiderVicIrq() {
  state.irq = Boolean(state.interruptStatus & state.interruptControl);
  setVicIrq(state.irq);
}


function sprSprCollision(a, b) {
  if (config.ignoreSprSprCollisions) return;

  // Sprite #a collided with sprite #b

  // TODO: questions:
  // 1) if sprite-to-sprite collision interrupts aren't requested, does this
  //    register still get updated? (assuming yes)
  // 2) once a collision has happened to raise an interrupt, do they continue
  //    to stack up as more sprites collide? (assuming yes).

  const emptyOnEntry = state.sprSprCol;

  state.sprSprCol = state.sprSprCol
    | (1 << a)
    | (1 << b)
  ;

  // More interrupts don't fire if the register hasn't been read
  if (!emptyOnEntry) return;

  // Set the and 'spr-spr collision' flag
  state.interruptStatus |= 0b100;

  reconsiderVicIrq();
}

function sprBgCollision(spriteNum) {
  if (config.ignoreSprBgCollisions) return;

  const emptyOnEntry = state.sprBgCol;

  state.sprBgCol |= 1 << spriteNum;

  // More interrupts don't fire if the register hasn't been read
  if (!emptyOnEntry) return;

  // Set the 'spr-bg collision' flag
  state.interruptStatus |= 0b10;

  reconsiderVicIrq();
}

// Kinda want a better name for this function. The point is the raster line has
// reached the number that triggers an IRQ, though if raster IRQ's aren't
// enabled, there'll be no IRQ.
function rasterMightIrq() {

  // So this is what I think I learned recently... that the bit gets written 
  // to $d019 regardless of whether the interrupts are enabled.

  state.interruptStatus |= 1;
  reconsiderVicIrq();
}

function get8Pixels(xc, y) {
  const defaultPalette = (
    (
      config.scopeSprites    ||
      config.scopeBackground ||
      config.scopeCollision  ||
      config.scopeColorRam
    )
    ? grayscalePalette
    : systemPalette
  );

  // Display off?
  if (!state.displayEnable) return new Array(8).fill(defaultPalette[state.borderColor]);

  // If we're on the top/bottom border, output the border color
  if (state.dflag) {
    return new Array(8).fill(defaultPalette[state.borderColor]);
  }

  // TODO: we should probably avoid reallocating these each time
  let color     = new Array(8);
  let mask      = new Array(8);
  let collision = new Array(8);

  // Some nasty magic numbers that haven't been thought through and are just a
  // band-aid optimization.
  if ((state.cycleOfLine >= 16) && (state.cycleOfLine <= 57)) {
    get8BackgroundPixels(xc, y, color, mask, collision);
  }

  // If we're on the left/right border, output the border color, now that we've
  // done the background pixel fetch at least.
  // (Had we not, the character tiles wouldn't have loaded correctly)
  if (state.vflag) {

    // oh this won't work. The right border gets brought in 9 pixels in 38-column mode.
    return new Array(8).fill(defaultPalette[state.borderColor]);
  }

  for (let pixel = 0; pixel < 8; pixel++) {

    // Just for the collision scope
    let isAnySprColPix = false;

    let x = (xc * 8) + pixel;

    let dominantSprite;   // Sprite number of dominant sprite
    let spriteCol;        // Color code for dominant sprite
    let collidedSprite;

    // Iterate backwards through the sprites, as sprite 0 gets drawn above all
    // the others.
    for (let spriteNum = 7; spriteNum >= 0; spriteNum--) {

      const sprObj = state.sprites[spriteNum];

      if (sprObj.xStart === undefined) continue;

      if ((x >= sprObj.xStart) && (x < sprObj.xEnd)) {

        const sx = x - sprObj.xStart;

        if (sprObj.maskQueue[sx]) {

          // Overwrite the previous, which, as a higher numbered sprite,
          // would have a lower priority
          spriteCol = sprObj.colorQueue[sx];
          dominantSprite = spriteNum;
        }

        // Might be expensive to do it this way
        if (sprObj.collisionQueue[sx]) {

          isAnySprColPix = true;

          // Look for sprite-background collisions
          if (collision[pixel]) sprBgCollision(spriteNum);

          // Look for sprite-sprite collisions
          if (collidedSprite !== undefined) {
            sprSprCollision(collidedSprite, spriteNum);
          }
          collidedSprite = spriteNum;
        }        
      }
    }

    // We've now gone through all the sprites to see which, if any, is on top.
    // If there was a sprite on top, and the priority of that sprite is above
    // the background, paint it.

    if (dominantSprite !== undefined) {
      if (!state.sprites[dominantSprite].behind || !mask[pixel]) {

        if (config.scopeSprites) {
          color[pixel] = highlightPalettes[dominantSprite][spriteCol];
        }
        else if (config.scopeCollision && isAnySprColPix) {
          color[pixel] = highlightPalettes[0][spriteCol];
        }
        else {
          color[pixel] = defaultPalette[spriteCol];
        }

      }
    }
  }

  return color;
}

function fetchNextRowOfCharMatrix() {
  // start pulling in the char buffer for the next line
  if (
    (state.cycleOfLine >= CHAR_FETCH_CYCLE) &&
    (state.cycleOfLine <= (CHAR_FETCH_CYCLE + 40))
  ) {

    // Set the pointer up with the x...
    let ptr = state.cycleOfLine - CHAR_FETCH_CYCLE;

    // add the y...
    ptr += ((state.raster >> 3) - 6) * 40;

    // Don't read memory out of bounds
    if ((ptr >= 0) && (ptr < 1000)) {

      // Which character of this row of text are we loading
      const bufferIndex = state.cycleOfLine - CHAR_FETCH_CYCLE;

      let screenBase = (state.memorySetup >> 4) * 0x400;

      state.charBuffer[bufferIndex] = vicRead(screenBase + ptr);
      state.colorBuffer[bufferIndex] = state.color[ptr];
    }
  }
}

function fetchSpriteSequencesForLine() {

  // What's not accurate about this is when it does the fetching

  const screenBase = (state.memorySetup >> 4) * 0x400;
  const sprPtrsAddr = screenBase + (1024 - 8);

  // Work through the sprites backwards, as 0 has priority
  for (let spriteNum = 7; spriteNum >= 0; spriteNum--) {

    const sprObj = state.sprites[spriteNum];

    sprObj.xStart = undefined;

    if (!sprObj.enabled) continue;

    const doubleWidth = sprObj.x2w;

    let x = sprObj.x;
    let y = sprObj.y;

    // to be at this raster, what would the sprite's y have needed to be?
    let lineOfSprite = state.lineOfRaster - y;

    if (sprObj.x2h) {
      lineOfSprite = Math.floor(lineOfSprite / 2);
    }

    if (lineOfSprite  < 0) continue;
    if (lineOfSprite >= 21) continue;

    const spritePtr = sprPtrsAddr + spriteNum;

    let spriteDataPtr = vicRead(spritePtr);
    
    spriteDataPtr *= 64;
    spriteDataPtr += (lineOfSprite * 3);

    const byte0 = vicRead(spriteDataPtr + 0);
    const byte1 = vicRead(spriteDataPtr + 1);
    const byte2 = vicRead(spriteDataPtr + 2);

    // No need to clear out the old structures; we'll just write over them
    let     spriteColorQueue = sprObj.    colorQueue;
    let      spriteMaskQueue = sprObj.     maskQueue;
    let spriteCollisionQueue = sprObj.collisionQueue;

    const spriteColor = sprObj.color;

    let sprite24bits = (byte0 << 16) | (byte1 << 8) | (byte2 << 0);

    if (sprObj.mcm) {

      const colorCodes = [
        0,                               // irrelevant; masked out
        state.spriteMulticolorColor0,
        spriteColor,
        state.spriteMulticolorColor1,
      ];

      let qPos = 0;

      for (let i = 0; i < 12; i++) {
        let index = (sprite24bits & (0b11 << 22)) >> 22;
        
        for (let j = 0; j < (doubleWidth ? 4 : 2); j++) {
               spriteMaskQueue[qPos] = index !== 0;
              spriteColorQueue[qPos] = colorCodes[index];
          spriteCollisionQueue[qPos] = index > 1;

          qPos++;
        }

        sprite24bits <<= 2;
      }
    }
    else {

      let qPos = 0;

      for (let i = 0; i < 24; i++) {
        for (let j = 0; j < (doubleWidth ? 2 : 1); j++) {

          let isOn = (sprite24bits & (1 << 23)) ? true : false;

               spriteMaskQueue[qPos] = isOn;
              spriteColorQueue[qPos] = spriteColor;
          spriteCollisionQueue[qPos] = isOn;

          qPos++;
        }

        sprite24bits <<= 1;
      }
    }

    sprObj.xStart = sprObj.x + 112;
    sprObj.xEnd   = sprObj.xStart + (doubleWidth ? 48 : 24);
  }
}

function tick() {

  {
    const xc = state.cycleOfLine++;
    const y = state.lineOfRaster;

    const sequence = get8Pixels(xc, y);

    for (let i = 0; i < sequence.length; i++) {
      
      let rgb = sequence[i];

      if (state.static) {
        const rand = Math.random();
        if      (rand < 0.6) rgb = 0x000000;
        else if (rand < 0.7) rgb = 0x444444;
        else if (rand < 0.8) rgb = 0x888888;
        else if (rand < 0.9) rgb = 0xcccccc;
        else                 rgb = 0xffffff;
      }

      const x = (xc * 8) + i;
      
      setPixel(
        x,
        y,
        ((rgb & 0xff0000) >> 16),
        ((rgb & 0x00ff00) >>  8),
        ((rgb & 0x0000ff) >>  0),
      );
    }

    // Line up logic for next cycle

    if (state.badline) fetchNextRowOfCharMatrix();

    // Load black where we don't have anything else to load. This is bad.
    // Set it to white (0x11111111) and you'll see it bleed through in Wizball.
    if (state.cycleOfLine === 16) {
      state.bgQueuePos = 0;
      state.bgRgbQueue .fill(0); // color code 0 = black
      state.bgMaskQueue.fill(0);
    }

    else if ((state.cycleOfLine >= 17) && (state.cycleOfLine < 57)) {
      loadNextBgByte();
    }

    if (state.cycleOfLine === 17) {
      if (state.fortyColumns) state.vflag = 0;
    }

    else if (state.cycleOfLine === 18) {
      if (!state.fortyColumns) state.vflag = 0;
    }

    else if (state.cycleOfLine === 56) {
      if (!state.fortyColumns) state.vflag = 1;
    }

    else if (state.cycleOfLine === 57) {
      if (state.fortyColumns) state.vflag = 1;
    }

    else if (state.cycleOfLine >= 63) {

      fetchSpriteSequencesForLine();

      state.cycleOfLine = 0;
      state.lineOfRaster++;
      onNewLine();
    }
  }

  if (!state.cyclesUntilRasterInc--) {

    // We're on a new raster line. Update our count, and maybe trigger an interrupt

    if (++state.raster >= 312) {
      state.raster = 0;
    }

    if (state.raster === state.rasterIrq) {
      rasterMightIrq();
    }

    state.cyclesUntilRasterInc = 62;
  }
}

function makeRead() {

  const fns = {};

  // One-byte-per-sprite registers
  for (let sprite = 0; sprite < 8; sprite++) {

    // X co-ord bits 0-7 ($d000, $d002, $d004, ...)
    fns[(sprite * 2) + 0] = () => state.sprites[sprite].x & 0xff;

    // Y co-ord ($d001, $d003, $d005, ...)
    fns[(sprite * 2) + 1] = () => state.sprites[sprite].y;

    // Color ($d027, $d028, $d029, ...)
    fns[(sprite * 1) + 0x27] = () => state.sprites[sprite].color;
  }

  // One-bit-per-sprite registers
  const oneBitPerSprite = (fn) => () => {
    let ret = 0;
    for (let spriteNum = 0; spriteNum < 8; spriteNum++) {
      ret |= (fn(state.sprites[spriteNum]) ? (1 << spriteNum) : 0);
    }
    return ret;
  };

  // $d010 - bit 8 of X co-ords
  fns[0x10] = oneBitPerSprite((sprite) => sprite.x & 0x100);

  // $d015 - enable
  fns[0x15] = oneBitPerSprite((sprite) => sprite.enabled);

  // $d017 - double height
  fns[0x17] = oneBitPerSprite((sprite) => sprite.x2h);

  // $d01b - priotiy
  fns[0x1b] = oneBitPerSprite((sprite) => sprite.behind);

  // $d01c - multicolor mode
  fns[0x1c] = oneBitPerSprite((sprite) => sprite.mcm);

  // $d01d - double width
  fns[0x1d] = oneBitPerSprite((sprite) => sprite.x2w);

  // $d01e - sprite-sprite collision
  fns[0x1e] = () => {
    // †1 says:
    //
    //    "The registers $d01e and $d01f cannot be written and are automatically
    //    cleared on reading"
    //
    // †2 says:
    //
    //    "Write: Enable further detection of sprite-sprite collisions."
    //
    // I'm going with †1
    const ret = state.sprSprCol;
    state.sprSprCol = 0;
    return ret;
  }

  // $d01f - sprite-background collision
  fns[0x1f] = () => {
    const ret = state.sprBgCol;
    state.sprBgCol = 0;
    return ret;
  }

  // $d020: Border color
  fns[0x20] = () => 0xf0 | state.borderColor;

  // $d021: Background color
  fns[0x21] = () => 0xf0 | state.backgroundColor;

  // $d022: Extra background color 1
  fns[0x22] = () => 0xf0 | state.extraBgColor1;

  // $d023: Extra background color 2
  fns[0x23] = () => 0xf0 | state.extraBgColor2;

  // $d024: Extra background color 3
  fns[0x24] = () => 0xf0 | state.extraBgColor3;

  // $d025: Sprite multicolor color 0
  fns[0x25] = () => state.spriteMulticolorColor0;

  // $d026: Sprite extra color 2
  fns[0x26] = () => state.spriteMulticolorColor1;


  // $d018: Memory setup
  fns[0x18] = () => state.memorySetup;

  // $d019: Interrupt status
  // TODO: does real hardware set unused bits high?
  fns[0x19] = () => state.interruptStatus | (state.irq ? 0b10000000 : 0);

  // $d01a: Interrupt control
  // TODO: does real hardware set unused bits high?
  fns[0x1a] = () => state.interruptControl | 0xf0;


  // $d013: (Read-only) light pen X
  fns[0x13] = () => {
    // With nothing connected, real hardware just seems to emit noise for the
    // light pen registers. Previously, we'd sound a warning about
    // unimplemented functionality on accesses, but lots of software seems to
    // touch them for no apparent reason, so here we're just returning one of
    // many values that I've seen appear on real hardware.
    return 213;
  }

  // $d014: (Read-only) light pen Y
  fns[0x14] = () => {
    // As above
    return 120;
  }

  // $d011: current raster line bit 8
  fns[0x11] = () => (
    // bit 7: bit 8 of the raster line number
    ((state.raster & 0x100) ? 0x80 : 0x00) |

    // bit 6: extended background mode
    (state.extendedBg ? (1 << 6) : 0) |

    // bit 5: bitmap mode
    (state.bitmap ? (1 << 5) : 0) |

    // bit 4: display enable
    (state.displayEnable ? (1 << 4) : 0) |

    // bit 3: 25-row mode
    (state.twentyFiveRows ? (1 << 3) : 0) |

    // bits 0-2: vertical raster scroll
    state.yscroll

    // TODO: and there's more
  );

  // $d012, current raster line bits 0-7
  fns[0x12] = () => state.raster & 0xff;

  // $d016, Screen control register #2
  fns[0x16] = () => (
    state.xscroll |
    (state.multicolor   ? 0x10 : 0x00) |
    (state.fortyColumns ? 0x08 : 0x00) |

    // TODO: †2 says default is %11001000. But bit 5 doesn't seem to be
    // anything. Is that correct? Check on real hardware
    0b11100000
  );

  // $d02f - $d03f: unmapped
  for (let reg = 0x2f; reg <= 0x3f; reg++) {
    // TODO: pretty sure, but double-check it's 0xff.
    fns[reg] = () => 0xff;
  }

  // Regs are from $d000-$d03f, with degenerate copies through $d3ff
  return (addr) => fns[addr & 0x3f]();
}

function makeWrite() {
  const fns = {};

  // One-byte-per-sprite registers
  for (let sprite = 0; sprite < 8; sprite++) {

    // X co-ord bits 0-7 ($d000, $d002, $d004, ...)
    fns[(sprite * 2) + 0] = (byte) => state.sprites[sprite].x = (state.sprites[sprite].x & 0x100) | byte;

    // Y co-ord ($d001, $d003, $d005, ...)
    fns[(sprite * 2) + 1] = (byte) => state.sprites[sprite].y = byte;

    // Color ($d027, $d028, $d029, ...)
    fns[(sprite * 1) + 0x27] = (byte) => state.sprites[sprite].color = byte & 0xf;
  }

  // One-bit-per-sprite registers
  const oneBitPerSprite = (fn) => (byte) => {
    let ret = 0;
    for (let spriteNum = 0; spriteNum < 8; spriteNum++) {
      fn(state.sprites[spriteNum], Boolean(byte & (1 << spriteNum)));
    }
    return ret;
  };

  // $d010 - bit 8 of X co-ords
  fns[0x10] = oneBitPerSprite((sprite, bit) => sprite.x = bit ? (sprite.x | 0x100) : (sprite.x & 0xff));
  fns[0x15] = oneBitPerSprite((sprite, bit) => sprite.enabled = bit);  // $d015 - enable
  fns[0x17] = oneBitPerSprite((sprite, bit) => sprite.x2h     = bit);  // $d017 - double height
  fns[0x1b] = oneBitPerSprite((sprite, bit) => sprite.behind  = bit);  // $d01b - priority
  fns[0x1c] = oneBitPerSprite((sprite, bit) => sprite.mcm     = bit);  // $d01c - multicolor mode
  fns[0x1d] = oneBitPerSprite((sprite, bit) => sprite.x2w     = bit);  // $d01d - double width


  // $d01e - sprite-sprite collision
  fns[0x1e] = (byte) => state.sprSprCol = byte;

  // $d01f - sprite-background collision
  fns[0x1f] = (byte) => state.sprBgCol = byte;


  // $d011, screen control register 1, current raster line bit 8
  fns[0x11] = (byte) => {
    // update our view of raster IRQ line setting,
    // and fall through to update the rest of the register
    const rasterBit8 = (byte & 0x80) << 1;

    state.rasterIrq &= 0xff;
    state.rasterIrq |= rasterBit8;

    state.yscroll        =         byte & 0b00000111;
    state.twentyFiveRows = Boolean(byte & 0b00001000);
    state.displayEnable  = Boolean(byte & 0b00010000);
    state.bitmap         = Boolean(byte & 0b00100000);
    state.extendedBg     = Boolean(byte & 0b01000000);
  };

  // $d012, current raster line bits 0-7
  fns[0x12] = (byte) => {
    const rasterBit8 = state.rasterIrq & 0x100;
    state.rasterIrq = byte | rasterBit8;
  };

  // $d013, Light pen X-coordinate (read-only)
  // $d014, Light pen Y-coordinate (read-only)
  fns[0x13] = () => {};
  fns[0x14] = () => {};

  // $d016, Screen control register #2
  fns[0x16] = (byte) => {    
    state.xscroll      = byte & 0x7;
    state.multicolor   = Boolean(byte & 0x10);
    state.fortyColumns = Boolean(byte & 0x08);
    // TODO: and there's other bits
  };

  // $d018, Memory setup
  fns[0x18] = (byte) => state.memorySetup = byte;
  
  // $d019: Interrupt acknowledge
  fns[0x19] = (byte) => {

    // clear the bits that the writer's asking us to
    state.interruptStatus &= ~byte;
    state.interruptStatus &= 0x0f;

    reconsiderVicIrq();
  };

  // $d01a, Interrupt control register
  fns[0x1a] = (byte) => {    
    state.interruptControl = byte & 0xf;

    if (byte & 0x8) unimplementedWarning("light pen interrupts");

    // TODO: if an interrupt isn't enabled now, but was responsible for pulling
    // the IRQ line low, I guess that means it'll no longer be pulling the IRQ
    // line low? Is this how real hardware operates?

    reconsiderVicIrq();
  };

  fns[0x20] = (byte) => state.borderColor            = byte & 0xf;  // $d020, Border color
  fns[0x21] = (byte) => state.backgroundColor        = byte & 0xf;  // $d021, Background color
  fns[0x22] = (byte) => state.extraBgColor1          = byte & 0xf;  // $d022, Extra background color 1
  fns[0x23] = (byte) => state.extraBgColor2          = byte & 0xf;  // $d023, Extra background color 2
  fns[0x24] = (byte) => state.extraBgColor3          = byte & 0xf;  // $d024, Extra background color 3
  fns[0x25] = (byte) => state.spriteMulticolorColor0 = byte & 0xf;  // $d025: Sprite multicolor color 0
  fns[0x26] = (byte) => state.spriteMulticolorColor1 = byte & 0xf;  // $d026: Sprite extra color 2

  // $d02f - $d03f: unmapped
  for (let reg = 0x2f; reg <= 0x3f; reg++) {
    fns[reg] = () => {};
  }

  // regs are from $d000-$d03f, with degenerate copies through $d3ff
  return (addr, byte) => fns[addr & 0x3f](byte);
};

const read_d000_d3ff = makeRead();

function read_d800_dbff(addr) {
  return state.color[addr - 0xd800] | 0xf0;
}

const write_d000_d3ff = makeWrite();

function write_d800_dbff(addr, byte) {
  state.color[addr - 0xd800] = byte & 0xf;
}

function showStatic() {
  state.static = true;
}

function setIgnoreSprBgCol(ignore) {
  config.ignoreSprBgCollisions = ignore;
}

function setIgnoreSprSprCol(ignore) {
  config.ignoreSprSprCollisions = ignore;
}

function setScope(key) {
  // Not the most elegant...
  for (let i in config) {
    if (/^scope/.test(i)) {
      config[i] = false;
    }
  }
  
  if (key) config[key] = true;
}

function serialize() {
  // Transfer the special arrays to regular arrays
  // (Otherwise they'll get serialized as { 0:..., 1:..., 2:..., ...})
  const stateCopy = {...state};

  for (let [key, type, size] of specialStateValues) {
    stateCopy[key] = [];

    for (let i in state[key]) {
      // Should warn if we see unexpected keys
      stateCopy[key][i] = state[key][i];
    }
  }

  return JSON.stringify(stateCopy);
}

function deserialize(json) {
  state = JSON.parse(json);

  // Transfer the arrays to special arrays
  for (let [key, type, size] of specialStateValues) {
    const arr = new type(size);

    // Should warn if sizes don't match!
    for (let i = 0; i < state[key].length; i++) {
      arr[i] = state[key][i];
    }

    state[key] = arr;
  }
}
