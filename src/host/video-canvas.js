// References:
// †1 http://www.zimmers.net/cbmpics/cbm/c64/vic-ii.txt

// A PAL frame (†1) is 312 lines of 504 pixels each. (8 pixels/cycle, 63 cycles
// per line). The emulated Vic will call our setPixel for each of those 157,248
// virtual pixels, many of which are in the hblank or vblank, and it's up to
// this interface to discard those.
//
// According to that same source, there are 284 visible lines of 403 visible
// pixels each. I'm coercing those numbers a little to get the dimentions
// below, and they'll likely change when the Vic emulation gets more cycle-
// accurate.


// Constants that may be variable in future
// x and y position (as arguments to setPixel) for first visible pixels
let first_x = 95;
let first_y = 10;

let canvas_w = 402;
let canvas_h = 282;

const SCOPE_WIDTH = 274;
const TRAY_HEIGHT = 70;     // TODO: unless the window is narrow
const SNAPSHOTS_WIDTH = 150;

let canvas;
let context;
let imageData;
let bitmap;
let showingTrays     = false;
let showingScope     = false;
let showingSnapshots = false;

export function attach(nascentC64) {
  nascentC64.video = {
    // Control
    reset,
    // Interface-specific handlers
    setPixel,
    blit,
  };

  createCanvas();
}

function reset() {
  clearCanvas();
}

function createCanvas() {
  canvas = document.getElementById("canvas");
  canvas.setAttribute("width",  canvas_w);
  canvas.setAttribute("height", canvas_h);

  context = canvas.getContext("2d");
  imageData = context.getImageData(0, 0, canvas_w, canvas_h);
  bitmap = imageData.data;  
  clearCanvas();

  positionCanvas();
  window.addEventListener("resize", onResize);
}

export function setHasScope(hasScope) {
  showingScope = hasScope;
  positionCanvas();
}

export function setHasTrays(hasTrays) {
  showingTrays = hasTrays;
  positionCanvas();
}

export function setHasSnapshots(hasSnapshots) {
  showingSnapshots = hasSnapshots;
  positionCanvas();
}

function onResize() {
  // Don't allow the canvas size transition to happen when the window resizes,
  // or it'll be a slow gloopy mess.
  requestAnimationFrame(
    () => {
      canvas.classList.add("no-transition");
      requestAnimationFrame(
        () => {
          positionCanvas();
          requestAnimationFrame(
            () => {
              canvas.classList.remove("no-transition");
            }
          );            
        }
      );
    }
  );
}

function positionCanvas() {
  const { innerWidth, innerHeight } = window;

  // First assess the extents of the potential area into which the canvas could
  // be positioned.

  // availWidth/Height, min/maxUsableX/Y: areas of the window not occupied by
  // the trays/rails.
  let availWidth  = innerWidth;
  let availHeight = innerHeight;
  let minUsableX  = 0;
  let maxUsableX  = innerWidth;
  let minUsableY  = 0;
  let maxUsableY  = innerHeight;

  if (showingScope) {
    availWidth -= SCOPE_WIDTH;
    maxUsableX -= SCOPE_WIDTH;
  }
  
  if (showingTrays) {
    availHeight -= 2 * TRAY_HEIGHT;
    minUsableY += TRAY_HEIGHT;
    maxUsableY -= TRAY_HEIGHT;
  }

  if (showingSnapshots) {
    availWidth -= SNAPSHOTS_WIDTH;
    minUsableX += SNAPSHOTS_WIDTH;
  }

  // Now consider its width and height: fill the available width or height
  // depending on which constrains us first.

  const srcRatio = canvas_w / canvas_h;
  let w, h;

  if ((availWidth / availHeight) > srcRatio) {
    // canvas has a wider ratio so bound it by height
    h = availHeight;
    w = availHeight * srcRatio;
  }
  else {
    // canvas has a taller ratio so bound it by width
    h = availWidth / srcRatio;
    w = availWidth;
  }

  // Finally consider centering. We'll first try centering within the original
  // window rather than within the whittled down-space. If we'd hit a rail in
  // doing so, nudge it until it's only just touching that rail.

  let idealX = (innerWidth - w) / 2;
  let x;

  if (idealX < minUsableX) x = minUsableX;
  else if ((idealX + w) >= maxUsableX) x = maxUsableX - w;
  else x = idealX;

  // Vertical centering's easy: either both trays are showing, or neither are.
  // And they'd both the same height, so the calculation can ignore them.

  let y = minUsableY;
  y += (availHeight - h) / 2;

  canvas.setAttribute(
    "style",
    `width: ${Math.round(w)}px;` +
    `height: ${Math.round(h)}px;` +
    `left: ${Math.round(x)}px;` +
    `top: ${Math.round(y)}px;`
  );
}

function clearCanvas() {
  let index = 0;

  for (let y = 0; y < canvas_h; y++) {
    for (let x = 0; x < canvas_w; x++) {
      bitmap[index++] = 0;
      bitmap[index++] = 0;
      bitmap[index++] = 0; 
      bitmap[index++] = 255;
    }
  }

  blit();
}

function setPixel(x, y, r, g, b) {
  x -= first_x;
  y -= first_y;

  if ((x < 0) || (x >= canvas_w)) return;
  if ((y < 0) || (y >= canvas_h)) return;

  let index = (((y * canvas_w) + x) * 4);

  // Relies on the alpha values having already been set by clearCanvas
  bitmap[index++] = r;
  bitmap[index++] = g;
  bitmap[index  ] = b;
}

function blit() {
  context.putImageData(imageData, 0, 0); 
}
