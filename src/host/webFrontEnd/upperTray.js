let c64;
let serial = null;
let countdownInterval = null;

export function initUpperTray(nascentC64) {
  c64 = nascentC64;

  handlerForEventForId(
    "resetButton", 
    "click",
    () => undoableReset()
  );

  handlerForEventForId(
    "undoResetButton", 
    "click",
    () => {
      if (serial) {
        c64.runloop.deserialize(serial);
        c64.runloop.run();
        removeUndoResetButton();
      }
    }
  );
}

function handlerForEventForId(id, eventName, fn) {
  document
    .getElementById(id)
    .addEventListener(eventName, fn)
  ;
}

function undoableReset() {
  serial = c64.runloop.serialize();
  c64.runloop.reset();
  c64.runloop.run();

  removeUndoResetButton();
  addUndoResetButton();
}

function removeUndoResetButton() {

  const [ resetButton, undoResetButton, label ] = [
    "resetButton",
    "undoResetButton",
    "undoResetButton-label"
  ].map((id) => document.getElementById(id));

  resetButton.classList.remove("hidden");
  undoResetButton.classList.add("hidden");
  label.innerText = "";

  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }
}

function addUndoResetButton() {

  const [
    resetButton,
    undoResetButton,
    label
  ] = [
    "resetButton",
    "undoResetButton",
    "undoResetButton-label"
  ].map((id) => document.getElementById(id));

  resetButton.classList.add("hidden");
  undoResetButton.classList.remove("hidden");

  const updateLabelCountdown = () => {
    label.innerText = `Undo (${countdown})`;
  };
  
  let countdown = 6;
  updateLabelCountdown();

  if (countdownInterval) clearInterval(countdownInterval);

  countdownInterval = setInterval(
    () => {
      if (--countdown === 0) {
        removeUndoResetButton();
        serial = null;
      }
      else updateLabelCountdown();
    },
    1000
  );
}
