// Host interfaces
import { attach as video    } from "../host/video-ansi";
import { attach as audio    } from "../host/audio-stub";
import { attach as joystick } from "../host/joystick-stub";
import { attach as keyboard } from "../host/keyboard-stdin";

// Target devices
import { attach as wires } from "../target/wires";
import { attach as ram   } from "../target/ram";
import { attach as vic   } from "../target/vic";
import { attach as sid   } from "../target/sid";
import { attach as cias  } from "../target/cias";
import { attach as cpu   } from "../target/cpu";
import { attach as tape  } from "../target/tape";

// ROMs
import basic     from "../target/rom/basic";
import kernal    from "../target/rom/kernal";
import character from "../target/rom/character";

// Bringup
import { bringup } from "../target/bringup";

// Everything else
import { ingest } from "../host/ingest";


function hideCursorButShowOnQuit() {
  const ANSI_SGR_RESET       = "\x1b[0m";
  const ANSI_CSI_CLEAR       = "\x1b[2J";
  const ANSI_CSI_CURSOR_HIDE = "\x1b[?25l";
  const ANSI_CSI_CURSOR_SHOW = "\x1b[?25h";

  console.log(ANSI_CSI_CLEAR, ANSI_CSI_CURSOR_HIDE);

  const cleanup = (cause) => {
    console.log(ANSI_SGR_RESET, ANSI_CSI_CURSOR_SHOW);
    console.log("Caught", cause);
    process.exit();
  }

  // We're leaving "uncaughtException" off this list because we want to be sure
  // that the exception messaging is printed.
  for (let cause of ["SIGTERM", "SIGINT", "SIGHUP", "disconnect"]) {
    process.on(cause, () => cleanup(cause));
  }
}


const c64 = bringup({
  host:   { audio, video, keyboard, joystick },
  target: { wires, ram, vic, sid, cpu, cias, tape, basic, kernal, character },
  attachments: [],
});


// If a filename was supplied as an argument, try run it
if (process.argv.length === 3) {
  const fs = require("fs");
  const filename = process.argv[2];
  const file = fs.readFileSync(filename);
  ingest(c64, filename, file);
}

// Otherwise, just boot a cleanly reset machine
else c64.runloop.run();

hideCursorButShowOnQuit();
