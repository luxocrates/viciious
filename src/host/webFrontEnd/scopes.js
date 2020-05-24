import { setHasScope } from "../video-canvas";
import { collision } from "./collisionScope";
import { ramAccess } from "./ramAccessScope";
import css from "./scopes.css";

let c64;
let isShowing = false;
// `selectedScope`: selected, but not necessarily active
let selectedScope = "sprites";

const scopes = {
  // Keys should match the <option> tag's `value`.
  sprites: {
    domId:       "spriteScope",
    onEnter:     () => c64.vic.setScope("scopeSprites"),
    onExit:      () => c64.vic.setScope(null),
  },
  background: {
    domId:       "backgroundScope",
    onEnter:     () => c64.vic.setScope("scopeBackground"),
    onExit:      () => c64.vic.setScope(null),
  },
  collision,
  colorRam: {
    onEnter:     () => c64.vic.setScope("scopeColorRam"),
    onExit:      () => c64.vic.setScope(null),
  },
  ramAccess,
};

export function initScopes(nascentC64) {
  c64 = nascentC64;

  const selectEl = document.getElementById("scopeSelect");

  selectEl
    .addEventListener(
      "change",
      (event) => {
        stopScope();
        hideScope();
        selectedScope = selectEl.value;
        showScope();
        startScope();
      }
    )
  ;

  for (const [,{ attach, domId }] of Object.entries(scopes)) {
    if (domId) {
      document
        .getElementById(domId)
        .classList
        .add("hidden")
      ;
    }
    if (attach) attach(nascentC64);
  }
}

export function toggleScopes() {
  isShowing = !isShowing;

  // Tell the layout manager the side panel's moving
  setHasScope(isShowing);

  // Open or close the side panel, and start/stop the selected scope
  const scopeRail        = document.getElementById("scopeRail");
  const scopeRailBlanket = document.getElementById("scopeRail-blanket");

  if (isShowing) {
    scopeRail.classList.remove("hidden");
    scopeRailBlanket.classList.add("hidden");
    startScope();
  }
  else {
    scopeRail.classList.add("hidden");
    scopeRailBlanket.classList.remove("hidden");
    stopScope();
  }
}

function startScope() {
  const { domId, onEnter } = scopes[selectedScope];
  if (domId) {
    document
      .getElementById(domId)
      .classList
      .remove("hidden")
    ;
  }
  onEnter();
}

function stopScope() {
  const { onExit } = scopes[selectedScope];
  onExit();
}

function hideScope() {
  const { domId } = scopes[selectedScope];
  if (domId) {
    document
      .getElementById(domId)
      .classList
      .add("hidden")
    ;
  }
}

function showScope() {
  const { domId } = scopes[selectedScope];
  if (domId) {
    document
      .getElementById(domId)
      .classList
      .remove("hidden")
    ;
  }
}
