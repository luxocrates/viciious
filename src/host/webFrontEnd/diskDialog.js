import { Dialog, closeAllDialogs } from "./dialogs";
import charRom from "../../target/rom/character";
import { petsciiToFontCodePoint } from "../../tools/c64FontCodePoints";
import css from "./diskDialog.css";

let c64;
let dialog;

export function initDiskDialog(nascentC64) {
  c64 = nascentC64;

  c64.hooks.onD64Ingest = showDiskDialog;
  dialog = new Dialog("diskDialog");
}

function petsciiStringToCanvas(petsciiSeq) {

  const canvas = document.createElement("canvas");
  canvas.width  = 8 * petsciiSeq.length;
  canvas.height = 8;

  const context = canvas.getContext("2d");

  canvas.style.width  = `${Math.round(canvas.width  * 1.0)}px`;
  canvas.style.height = `${Math.round(canvas.height * 1.0)}px`;
  canvas.style.imageRendering = "pixelated";
  
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const bitmap = imageData.data;  

  Array.from(petsciiSeq).forEach(
    (char, index) => {

      let codepoint = petsciiToFontCodePoint(char.charCodeAt(0));

      for (let y = 0; y < 8; y++) {

        const fontOffset = (codepoint * 8) + y;
        let seq = charRom[fontOffset];

        for (let x = 0; x < 8; x++) {
          let canvasOffset = ((y * canvas.width) + (index * 8) + x) * 4;

          if (seq & 0b10000000) {
            bitmap[canvasOffset + 0] = 0xff;
            bitmap[canvasOffset + 1] = 0xff;
            bitmap[canvasOffset + 2] = 0xff;
            bitmap[canvasOffset + 3] = 255;
          }

          seq <<= 1;
        }
      }
    }
  );

  context.putImageData(imageData, 0, 0);
  return canvas;
}

function showDiskDialog(dir) {

  let resolveWithDirEntry;

  const promise = new Promise(
    (resolve) => {
      resolveWithDirEntry = resolve;
    }
  );

  const container = document.getElementById("diskDialog-dirEntries");

  // Empty whatever might have been there before
  while (container.firstChild) {
    container.removeChild(container.lastChild);
  }

  for (let entry of dir) {
    const { name, blocks, type } = entry;
    
    const canvas = petsciiStringToCanvas(
      `${String(blocks).padEnd(5)}${`"${name}"`.padEnd(20)}${type}`
    );

    const button = document.createElement("button");
    button.appendChild(canvas);

    if (type === "PRG") {
      button.addEventListener(
        "click",
        () => {
          closeAllDialogs();
          resolveWithDirEntry(entry);
        }
      );
    }
    else {
      button.setAttribute("disabled", "disabled");
    }

    container.appendChild(button);
  }

  dialog.open();
  return promise;
}
