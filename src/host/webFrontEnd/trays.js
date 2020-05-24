import { initUpperTray } from "./upperTray";
import { initLowerTray } from "./lowerTray";
import { setHasTrays }   from "../video-canvas";
import css               from "./trays.css";

let isShowing = false;

export function toggleTrays() {
  isShowing = !isShowing;

  const upperTray = document.getElementById("upperTray");
  const upperTrayBlanket = upperTray.getElementsByClassName("tray-blanket")[0];

  const trayClassList    = upperTray       .classList;
  const blanketClassList = upperTrayBlanket.classList;

  if (isShowing) {
    trayClassList.remove("hidden");
    blanketClassList.add("hidden");
  }
  else {
    trayClassList.add("hidden");
    blanketClassList.remove("hidden");
  }

  // As above, so below
  const lowerTray = document.getElementById("lowerTray");
  const lowerTrayBlanket = lowerTray.getElementsByClassName("tray-blanket")[0];

  lowerTray.classList = trayClassList;
  lowerTrayBlanket.classList = blanketClassList;

  setHasTrays(isShowing);
  return isShowing;
}

export function initTrays(nascentC64) {
  initUpperTray(nascentC64);
  initLowerTray(nascentC64);
}
