import { videoAsAnsi } from "../tools/videoAsAnsi.js";

const ANSI_CSI_R0C0 = "\x1b[0;0H";

let c64;
let lastScreen;

export function attach(nascentC64) {
  c64 = nascentC64;

  c64.video = {
    reset:    () => {},
    setPixel: () => {},
    blit,
  };
}

function blit() {
  const str = videoAsAnsi(c64.wires.cpuRead);

  if (str !== lastScreen) {
    lastScreen = str;
    console.log(ANSI_CSI_R0C0);
    console.log(str);
  }
}

