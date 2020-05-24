// The only file type that can be brought in from JSON is a snapshot.

export async function ingest_json(c64, bytes) {
  // Convert the incoming byte array to a string
  let json = "";

  for (let i of bytes) {
    json += String.fromCharCode(i);
  }

  // Once the original snapshot was serialized, it was saved out in a JSON
  // format, meaning yet another layer of the onion. Unpeel that last one
  // to get the original serialiazation (which is in JSON, and encodes yet
  // more JSON in its subsections)
  const snapshot = JSON.parse(json);

  c64.runloop.stop();                // just out of caution
  c64.runloop.reset();               // just out of caution
  c64.runloop.deserialize(snapshot);
  c64.runloop.run();
}
