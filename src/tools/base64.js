/*
  Simple, basic Base64 encoding/decoding
*/

const tokens =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdef" + 
  "ghijklmnopqrstuvwxyz0123456789+/";

export function base64Encode(q) {
  let out = "";

  while (q.length) {

    let               w  = q[0] << 16;
    if (q.length > 1) w |= q[1] << 8;
    if (q.length > 2) w |= q[2] << 0;

    //                <--q0--><--q1--><--q2-->
    const o0 = (w & 0b111111000000000000000000) >> 18;
    const o1 = (w & 0b000000111111000000000000) >> 12;
    const o2 = (w & 0b000000000000111111000000) >> 6;
    const o3 = (w & 0b000000000000000000111111) >> 0;

    out +=                  tokens[o0]      ;
    out +=                  tokens[o1]      ;
    out += (q.length > 1) ? tokens[o2] : "=";
    out += (q.length > 2) ? tokens[o3] : "=";

    q = q.slice(3, q.length);
  }

  return out;
}

export function base64Decode(q) {
  let out = [];

  while (q.length) {

    const i0 =                tokens.indexOf(q[0])    ;
    const i1 =                tokens.indexOf(q[1])    ;
    const i2 = q[2] !== "=" ? tokens.indexOf(q[2]) : 0;
    const i3 = q[3] !== "=" ? tokens.indexOf(q[3]) : 0;

    const w = (i0 << 18) | (i1 << 12) | (i2 << 6) | (i3 << 0);

                      out.push((w >> 16) & 0xff);
    if (q[2] !== "=") out.push((w >>  8) & 0xff);
    if (q[3] !== "=") out.push((w >>  0) & 0xff);

    q = q.substr(4);
  }

  return out;
}
