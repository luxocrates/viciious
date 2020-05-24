let c64;

export function initUpperTray(nascentC64) {
  c64 = nascentC64;

  handlerForEventForId(
    "resetButton", 
    "mousedown",
    () => {
      startShake();
      // The c64 needs to be running to show static, but we shouldn't be
      // hearing the last program play sounds still. So reset it, even though
      // there's another reset on the button up. Of course, anybody using a
      // scope won't be fooled.
      c64.runloop.reset();
      c64.vic.showStatic();
      c64.runloop.run();
    }
  );

  handlerForEventForId(
    "resetButton", 
    "click",
    () => {
      stopShake();
      c64.runloop.reset();
      c64.runloop.run();
    }
  );
}

function handlerForEventForId(id, eventName, fn) {
  document
    .getElementById(id)
    .addEventListener(eventName, fn)
  ;
}

function startShake() {
   document
   .getElementsByTagName("body")[0]
    .classList
    .add("shake");
}

function stopShake() {
   document
    .getElementsByTagName("body")[0]
    .classList
    .remove("shake");
}
