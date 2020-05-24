import css from "./dialogs.css";

let openDialogs;
let menuEl;
let errorDialog;

export class Dialog {

  constructor(id) {
    // this.state can be: "closed", "opening", "open", "closing"
    this.state = "closed";
    this.el = document.getElementById(id);
    this.el.addEventListener("transitionend", this.transitionDidEnd.bind(this));

    for (let closeButton of this.el.getElementsByClassName("close")) {
      closeButton.addEventListener(
        "click",
        this.close.bind(this)        
      );
    }
  }

  open() {

    openDialogs.add(this);
    reconsiderBlanket();

    // Maybe it matters what state we were in before?
    this.state = "opening";

    // On the first frame, make it display...
    requestAnimationFrame(
      () => {
        this.el.className = "dialog transparent";
        // ...only then, once it's up, can we start the transition
        requestAnimationFrame(
          () => {
            this.el.className = "dialog open";
          }
        );
      }
    );

    // Band-aid: without this, clicking on buttons to open the dialogs too
    // quickly can result in them opening with everything highighted.
    globalThis.getSelection().empty();
  }

  close() {
    // (Assuming it wasn't already closed)
    this.state = "closing";
    this.el.className = "dialog transparent";
  }

  transitionDidEnd() {
    switch (this.state) {
      case "closing":
        this.state = "closed";
        this.el.className = "dialog undisplayed";
        openDialogs.delete(this);
        reconsiderBlanket();
        break;
      case "opening":
        this.state = "open";
        break;
    }
  }
}

function reconsiderBlanket() {
  // TODO: ugh
  if (openDialogs.size) {
    menuEl.setAttribute(
      "style",
      `display: block;`
    );
  }
  else {
    menuEl.setAttribute(
      "style",
      `display: none;`
    );
  }
}

export function showErrorDialog(text) {
  // This exposes the weakness of not having a dynamic dialog manager, which
  // creates and destroys the DOM elements on-demand. It's luck that multiple
  // dialogs don't occur at the same time, and we don't handle the case well
  // when they do. Hence the errorDialog is at the end of the pre-baked HTML.
  document
    .getElementById("errorDialog-text")
    .innerText = text;

  errorDialog.open();
}

export function initDialogs() {

  openDialogs = new Set();
  menuEl = document.getElementById("menu");

  document
    .getElementById("blanket")
    .addEventListener(
      "click",
      () => {
        Array.from(openDialogs).forEach(
          dialog => dialog.close()
        );
      }
    )
  ;

  errorDialog = new Dialog("errorDialog");
}

export function closeAllDialogs() {
  for (let dialog of openDialogs) {
    // Doesn't mutate the list we're iterating over
    dialog.close();
  }
}
