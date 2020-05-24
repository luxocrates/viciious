export const systemPalette = [
  0x000000,  // black
  0xffffff,  // white
  0x994444,  // red
  0x88cccc,  // cyan
  0x9955bb,  // purple
  0x77bb44,  // green
  0x4433aa,  // blue
  0xdddd77,  // yellow
  0x996622,  // orange
  0x664400,  // brown
  0xcc8888,  // pink
  0x666666,  // dark gray
  0x888888,  // mid gray
  0xbbee99,  // light green
  0x8877dd,  // light blue
  0xbbbbbb,  // light gray
];

// A reassignment of luminance values to the default palette for when it's
// reduced to grayscale. Many colors would map to the same values under the
// usual HSL formula; this distributes them enough that they're all
// distinguishable against each other.
const adjustedL = [
    0,       // black
  100,       // white
   40,       // red
   64,       // cyan
   46,       // purple
   52,       // green
   34,       // blue
   82,       // yellow
   22,       // orange
   16,       // brown
   70,       // pink
   28,       // dark gray
   58,       // mid gray
   94,       // light green
   76,       // light blue
   88,       // light gray
];

export const grayscalePalette = systemPalette.map(
  (rgb, index) => {

    const r = (rgb & 0xff0000) >> 16;
    const g = (rgb & 0x00ff00) >>  8;
    const b = (rgb & 0x0000ff) >>  0;

    // Convert to HSL
    const [h, s, l] = rgbToHsl(r, g, b);

    // ...and then back to RGB, with no saturation, and scaled, nudged luminance
    {
      const [r, g, b] = hslToRgb(
        h,
        0,
        lerp(adjustedL[index], 0, 100, 20, 60)
      );

      return rgbToInt(r, g, b);
    }
  }
);


// highlightPalettes: an array of 8 palettes.
// highlightPalettes[0][colorCode] would give a red-ish highlight for colorCode.
// highlightPalettes[1][colorCode] would be more orange, etc.
export const highlightPalettes = [];

for (let i = 0; i < 8; i++) {

  highlightPalettes[i] = new Array(16);

  for (let cc = 0; cc < 16; cc++) {

    const [r, g, b] = hslToRgb(
      // Make each index 45° around the color wheel
      i * (360 / 8),
      // ...with a fixed saturation that's not excessive
      50,
      // ...and a luminance that's proportional to the (nudged) original,
      // scaled to avoid it being over-bright, or too dark to clearly see the
      // hue.
      lerp(adjustedL[cc], 0, 100, 45, 70)
    );

    highlightPalettes[i][cc] = rgbToInt(r, g, b);
  }
}


// colorColorPalettes: an array of 16 palettes.
// colorColorPalettes[2][3] would give color code 2 (red), with a hint of the
// (nudged) grayscale brightness of color code 3 (cyan)
export const colorColorPalettes = [];

for (let i = 0; i < 16; i++) {

  colorColorPalettes[i] = new Array(16);
  const [h, s, l] = rgbToHsl(...intToRgb(systemPalette[i]));

  for (let j = 0; j < 16; j++) {

    const modulatedL = lerp(
      l + (((adjustedL[j] - 50) / 100) * 10),
      -5,
      105,
      0,
      100
    );

    const [r, g, b] = hslToRgb(h, s, modulatedL);

    colorColorPalettes[i][j] = rgbToInt(r, g, b);
  }
}


function lerp(val, srcMin, srcMax, destMin, destMax) {
  return destMin + (((val - srcMin) / (srcMax - srcMin)) * (destMax - destMin));
}

function rgbToHsl(r,g,b) {
  // Source: https://css-tricks.com/converting-color-spaces-in-javascript/

  // Make r, g, and b fractions of 1
  r /= 255;
  g /= 255;
  b /= 255;

  // Find greatest and smallest channel values
  let cmin = Math.min(r,g,b);
  let cmax = Math.max(r,g,b);
  let delta = cmax - cmin;
  let h = 0;
  let s = 0;
  let l = 0;

  // Calculate hue
  // No difference
  if      (delta === 0) h = 0;
  else if (cmax === r)  h = ((g - b) / delta) % 6;
  else if (cmax === g)  h =  (b - r) / delta + 2;
  else                  h =  (r - g) / delta + 4;

  h = Math.round(h * 60);
    
  // Make negative hues positive behind 360°
  if (h < 0) h += 360;

   // Calculate lightness
  l = (cmax + cmin) / 2;

  // Calculate saturation
  s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    
  // Multiply l and s by 100
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  return [h, s, l];
}

function hslToRgb(h,s,l) {
  // Source: https://css-tricks.com/converting-color-spaces-in-javascript/

  // Must be fractions of 1
  s /= 100;
  l /= 100;

  let c = (1 - Math.abs(2 * l - 1)) * s;
  let x = c * (1 - Math.abs((h / 60) % 2 - 1));
  let m = l - c/2;
  let r = 0;
  let g = 0;
  let b = 0;

  if      (  0 <= h && h < 60 ) { r = c; g = x; b = 0; }
  else if ( 60 <= h && h < 120) { r = x; g = c; b = 0; }
  else if (120 <= h && h < 180) { r = 0; g = c; b = x; }
  else if (180 <= h && h < 240) { r = 0; g = x; b = c; }
  else if (240 <= h && h < 300) { r = x; g = 0; b = c; }
  else if (300 <= h && h < 360) { r = c; g = 0; b = x; }
  
  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return [r, g, b];
}

function intToRgb(i) {
  return [
    (i >> 16) & 0xff,
    (i >>  8) & 0xff,
    (i >>  0) & 0xff,
  ];
}

function rgbToInt(r, g, b) {
  return (
    (Math.floor(r) << 16) |
    (Math.floor(g) <<  8) |
    (Math.floor(b) <<  0)
  );
}
