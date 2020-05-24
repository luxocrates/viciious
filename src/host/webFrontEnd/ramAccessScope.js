// bound by attach
let c64;

let canvas;
let context;
let imageData;
let bitmap;

function attach(nascentC64) {
  c64 = nascentC64;

  canvas    = document.getElementById("ramAccessCanvas");
  context   = canvas.getContext("2d");
  imageData = context.getImageData(0, 0, 256, 256);
  bitmap    = imageData.data;  
}

function onEnter() {
  clearCanvas();
  blitCanvas();

  c64.hooks.onRamRead = (addr) => {
    // +1 = green
    bitmap[(addr * 4) + 1] = 255;
  };

  c64.hooks.onRamWrite = (addr) => {
    // +0 = red
    bitmap[(addr * 4) + 0] = 255;
  };

  c64.hooks.onVicRead = (addr) => {
    // +2 = blue
    bitmap[(addr * 4) + 2] = 255;
  };

  c64.hooks.onFrameEnd = () => {
    blitCanvas();
    clearCanvas();
  };
}

function onExit() {
  c64.hooks.onRamRead  = undefined;
  c64.hooks.onRamWrite = undefined;
  c64.hooks.onVicRead  = undefined;
  c64.hooks.onFrameEnd = undefined;
}

function blitCanvas() {
  context.putImageData(imageData, 0, 0);
}

function clearCanvas() {
  let index = 0;

  for (let y = 0; y < 256; y++) {
    for (let x = 0; x < 256; x++) {
      bitmap[index++] = 0;
      bitmap[index++] = 0;
      bitmap[index++] = 0; 
      bitmap[index++] = 255;
    }
  }
}

export const ramAccess = {
  domId: "ramAccessScope",
  onEnter,
  onExit,
  attach,
};
