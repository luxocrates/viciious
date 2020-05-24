// bound by attach
let c64;

const allOffState = {
  ignoreSprSpr: false,
  ignoreSprBg:  false,
  dontVis:      false,
};

const desiredState = { ...allOffState };

const checkboxes = [
  { domId: "noSprSprColButton", desiredStateKey: "ignoreSprSpr" },
  { domId: "noSprBgColButton",  desiredStateKey: "ignoreSprBg"  },
  { domId: "noVisColButton",    desiredStateKey: "dontVis"      },
];

function attach(nascentC64) {
  c64 = nascentC64;

  for (let { domId, desiredStateKey } of checkboxes) {
    attachEventHandler(domId, desiredStateKey);
  }
}

function applyState(state) {
  c64.vic.setScope(state.dontVis ? null : "scopeCollision");
  c64.vic.setIgnoreSprBgCol (state.ignoreSprBg);
  c64.vic.setIgnoreSprSprCol(state.ignoreSprSpr);
}

function setCheckboxesFromState(state) {
  for (let { domId, desiredStateKey } of checkboxes) {
    const { classList } = document.getElementById(domId);
    classList.remove("selected");
    if (state[desiredStateKey]) classList.add("selected");
  }
}

function attachEventHandler(domId, desiredStateKey) {
  document
    .getElementById(domId)
    .addEventListener(
      "click",
      (event) => {
        desiredState[desiredStateKey] = !desiredState[desiredStateKey];
        setCheckboxesFromState(desiredState);
        applyState(desiredState);
      }
    )
  ;
}

export const collision = {
  domId:   "collisionScope",
  onEnter: () => applyState(desiredState),
  onExit:  () => applyState({ ...allOffState, dontVis: true }),
  attach,
};
