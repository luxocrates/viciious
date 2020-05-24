import css from "./keyMapDialog.css";

let c64;

// Should get/set this from/to a cookie in future
let naturalMapping = true;

export function initKeyMapDialog(nascentC64) {
  c64 = nascentC64;

  document.getElementById("map_natural").addEventListener(
    "click",
    () => {
      naturalMapping = true;
      c64.keyboard.naturalMapping = true;
      updateMappingElements();
    }
  );

  document.getElementById("map_direct").addEventListener(
    "click",
    () => {
      naturalMapping = false;
      c64.keyboard.naturalMapping = false;
      updateMappingElements();
    }
  );

  updateMappingElements();
}

function updateMappingElements() {
  setSelectedness("map_natural", naturalMapping);
  setSelectedness("map_direct", !naturalMapping);
}

function setSelectedness(id, selected) {
  const { classList } = document.getElementById(id);
  if (selected) classList.add   ("selected");
  else          classList.remove("selected");
}
