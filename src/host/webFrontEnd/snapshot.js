import { setHasSnapshots } from "../video-canvas";
import css from "./snapshots.css";

let numSnapshotsShowing = 0;
let lastSnapshotNum = 0;

let maskCanvas;

function createSnapshotCanvas() {

  // Would prob. be better to ask video-canvas for its element instead
  const mainCanvas = document.getElementById("canvas");

  // Create the 1701-monitor-bezel mask canvas if we haven't already
  if (!maskCanvas) {
    maskCanvas = document.createElement("canvas");

    maskCanvas.width  = mainCanvas.width;
    maskCanvas.height = mainCanvas.height;

    const context = maskCanvas.getContext("2d");

    // Fill color is irrelevant; we're just relying on alpha channel
    context.fill(
      new Path2D(
        "M386.79,141s.1,29.89-1,59.26c-1,26.65-3.3,52.86-4.21,56.07-2.22,7.8-3.75,17.87-18.83,20.46-8.38,1.44-34.53,2.84-62.95,3.65C253.8,281.75,201,282,201,282s-52.8-.25-98.76-1.56c-28.42-.81-54.57-2.21-62.95-3.65-15.08-2.59-16.61-12.66-18.83-20.46-.91-3.21-3.17-29.42-4.21-56.07-1.14-29.37-1-59.26-1-59.26s-.1-29.89,1-59.26c1-26.65,3.3-52.86,4.21-56.07,2.22-7.8,3.75-17.87,18.83-20.46,8.38-1.44,34.53-2.84,63-3.65C148.2.25,201,0,201,0s52.8.25,98.76,1.56c28.42.81,54.57,2.21,62.95,3.65,15.08,2.59,16.61,12.66,18.83,20.46.91,3.21,3.17,29.42,4.21,56.07C386.89,111.11,386.79,141,386.79,141Z"
      )
    );
  }

  const canvas = document.createElement("canvas");

  canvas.width  = mainCanvas.width;
  canvas.height = mainCanvas.height;

  const context = canvas.getContext("2d");

  context.drawImage(maskCanvas, 0, 0);
  context.globalCompositeOperation = "source-in";
  context.drawImage(mainCanvas, 0, 0);

  return canvas;
}


export function takeSnapshot(c64) {

  let alive = true;

  // TODO: inappropriate name now
  const bubble = document.createElement("div");

  const innerFrame = document.createElement("div");
  bubble.append(innerFrame);
  innerFrame.classList.add("innerFrame");

  const { classList } = bubble;

  classList.add("snapshot");
  classList.add("collapsed");

  requestAnimationFrame(
    () => {
      requestAnimationFrame(
        () => {
          classList.remove("collapsed");
        }
      );
    }
  );


  const close = document.createElement("button");
  close.setAttribute("class", "close");

  close.addEventListener(
    "click",
    (event) => {
      event.stopImmediatePropagation();
      if (alive) {
        onClose(classList);
        alive = false;
      }
    }
  );

  innerFrame.append(close);

  const button =  document.createElement("button");

  const canvas = createSnapshotCanvas();

  document
    .getElementById("snapshotsRail")
    .prepend(bubble)
  ;

  const serial = c64.runloop.serialize();
  const blob = new Blob(
    Array.from(
      // `serial` is serialized, but we'll JSON encode it for testing in source
      // for now. We won't need that later.
      JSON.stringify(serial)
    ),
    { type: "application/json" }
  );

  const link = document.createElement("a");
  link.innerText = `${++lastSnapshotNum}.json`;
  link.href = URL.createObjectURL(blob);

  link.addEventListener(
    "click",
    (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      onClickSnapshot(c64, serial)
    }
  );

  canvas.addEventListener(
    "click",
    () => onClickSnapshot(c64, serial)
  );

  bubble.addEventListener(
    "transitionend",
    (event) => {
      onTransitionEnd(event, bubble, alive);
    }
  );

  button.append(canvas);

  innerFrame.append(button);
  innerFrame.append(link);

  numSnapshotsShowing++;
  reconsiderSnapshotRail();
}

function onClickSnapshot(c64, serial) {
  c64.runloop.stop();
  c64.runloop.reset();
  c64.runloop.deserialize(serial);
  c64.runloop.run(); 
}

function reconsiderSnapshotRail() {
  // Unlike the scopeRail, the snapshots rail doesn't need a blanket. The only
  // we for it to be hidden is if all the snapshots have been deleted; hence we
  // don't need to worry about clicking on one that wasn't there.

  const shouldShow = numSnapshotsShowing > 0;
  setHasSnapshots(shouldShow);

  const { classList } = document.getElementById("snapshotsRail");

  if (shouldShow) classList.remove("hidden");
  else            classList.add   ("hidden");
}

function onTransitionEnd(event, bubble, alive) {
  if (event.target !== bubble) return;

  if (!alive) {
    console.log("onTransitionEnd");
    bubble.remove();
  }
}

function onClose(classList) {
  requestAnimationFrame(
    () => {
      requestAnimationFrame(
        () => {
          classList.add("collapsed");
        }
      );
    }
  );

  // transitionend handler will remove the bubble from the DOM, but for the
  // purposes of showing/hiding the rail, we'll consider it to have gone
  // already.
  numSnapshotsShowing--;
  reconsiderSnapshotRail();
}
