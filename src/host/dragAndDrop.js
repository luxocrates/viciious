import { ingest } from "./ingest.js";

// bound by attach
let c64;

export function attach(nascentC64) {
  c64 = nascentC64;

  window.addEventListener(
    "load",
    () => {
      document.addEventListener(
        "dragover",
        (event) => {
          // This looks like it isn't doing anything, but without it, drag-and-drop
          // doesn't work.
          event.preventDefault();
        }
      );

      document.addEventListener(
        "drop",
        (event) => {
          event.preventDefault();
          onDrop(event);

          // For the web audio API, the drop event is one of the interactions
          // whose occurrence permits the AudioContext to be resumed. Moreover,
          // it's likely to be the only such interaction before the user would
          // expect to hear sound.
          if (c64.audio.userDidInteract) c64.audio.userDidInteract();
        }
      );
    }
  );
}

function onDrop(event) {
  const [file, extraFile] = event.dataTransfer.files;

  if (extraFile) {
    err("Drop only one file at once");
    return;
  }

  if (!file) {
    tryLoadFromInternallyDraggedSnapshot(event);
    return;
  }

  const reader = new FileReader();
  reader.onload = (event) => {
    ingest(c64, file.name, new Uint8Array(reader.result));
  };

  reader.readAsArrayBuffer(file);
}

function err(str) {
  if (c64.hooks.reportError) c64.hooks.reportError(str);
  else alert(str);
}

function tryLoadFromInternallyDraggedSnapshot(event) {
  // The event.file was falsy, meaning quite possibly that the user dragged a
  // snapshot link from the <a> to the main window. The code below is a super
  // awkward attempt at loading in that circumstance. At time of writing, it
  // works in Chrome, Firefox, and Safari, but I don't trust it very far.
  //
  // I believe there's a drag-and-drop interface which would allow for DOM
  // nodes to be dragged to your desktop in a way that creates files there. If
  // so, it'd be good to support that; and the below would likely adopt
  // accordingly.

  for (let item of event.dataTransfer.items) {
    if (item.type !== "text/plain") continue;

    item.getAsString(
      async (url) => {

        // expect a URL like `blob:http://localhost:8080/(some guid)`
        if (!/^blob\:/.test(url)) return;

        const json = await (await fetch(url)).json();

        ingest(
          c64,
          "snapshot.json",
          // 🤮
          new Uint8Array(
            Array
              .from(JSON.stringify(json))
              .map(str => str.charCodeAt(0))
          )
        );
      }
    );

    break;
  }
}
