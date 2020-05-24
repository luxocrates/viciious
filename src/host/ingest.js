import { ingest_prg }  from "./ingest-prg";
import { ingest_t64 }  from "./ingest-t64";
import { ingest_sid }  from "./ingest-sid";
import { ingest_tap }  from "./ingest-tap";
import { ingest_json } from "./ingest-json";

const ingestors = [
  [/\.prg$/i , ingest_prg  ],
  [/\.t64$/i , ingest_t64  ],
  [/\.sid$/i , ingest_sid  ],
  [/\.tap$/i , ingest_tap  ],
  [/\.json$/i, ingest_json ],
];

export async function ingest(c64, filename, bytes) {
  try {

    for (let [regex, fn] of ingestors) {
      if (regex.test(filename)) {
        await fn(c64, bytes);

        if (c64.hooks.setTitle) {
          c64.hooks.setTitle(filename);
        }

        return;
      }
    }

    throw new Error("Can’t guess file format from name, or format is unsupported.");
  }
  catch (e) {
    const { message } = e;
    console.error(e);
    if (c64.hooks.reportError) c64.hooks.reportError(message);
    else alert(message);
  }
}
