import hoverBovverPrg from "./demos/hoverbovver_prg";
import firstPrg       from "./demos/first_prg";

import { closeAllDialogs } from "./dialogs";
import { ingest } from "../ingest";
import css from "./loaderDialog.css";

let c64;

export function initLoaderDialog(nascentC64) {
  c64 = nascentC64;

  document
    .getElementById("hoverBovverButton")
    .addEventListener(
      "click",
      // TODO: reassign joystick to port 1 automatically
      () => launch("Hover Bovver.prg", hoverBovverPrg)
    )
  ;

  document
    .getElementById("firstButton")
    .addEventListener(
      "click",
      () => launch("First.prg", firstPrg)
    )
  ;
}

function launch(filename, bytes) {
  ingest(c64, filename, bytes);
  closeAllDialogs();
}
