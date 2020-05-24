import { makeParser }             from "../tools/parser";
import { assemble }               from "../tools/assembler.js";
import { charToC64FontCodePoint } from "../tools/c64FontCodePoints";
import { READY_PC }               from "../tools/romLocations"; 
import { $xxxx }                  from "../debug";


// Format references:
// - https://gist.github.com/cbmeeks/2b107f0a8d36fc461ebb056e94b2f4d6
// - http://unusedino.de/ec64/technical/formats/sidplay.html
//
// (Beware: neither signal very well whether the numbers they quote are
// decimal or hex.)

const parseHeader = makeParser((_) => ({
  magicID:     _.string(4),
  version:     _.word_be(),
  dataOffset:  _.word_be(),
  loadAddress: _.word_be(),
  initAddress: _.word_be(),
  playAddress: _.word_be(),
  songs:       _.word_be(),
  startSong:   _.word_be(),
  speed:       _.long_be(),
  name:        _.string(32),
  author:      _.string(32),
  released:    _.string(32),
}));

export async function ingest_sid(c64, bytes) {
  let header;
  
  try {
    header = parseHeader(bytes);
  }
  catch (e) {
    console.error("Unexpected early end of file");
  }

  validate(header);

  let { loadAddress, dataOffset } = header;

  if (loadAddress === 0) {
    // means the load address is at the start of the data secion, like a
    // .prg file
    loadAddress = (
      bytes[dataOffset++] | 
      bytes[dataOffset++] << 8
    );
  }

  const fileData = bytes.slice(dataOffset);

  // It's only 130 bytes or so. Seems a safe place to stash it, no?
  // Just need to careful that it doesn't run into the PAL/NTSC flag at $02a6
  // as SIDs can rely on that.
  const playerOrg = 0x0200;
  // (Postscript: most of Richard Joesph's songs won't play at all with the
  // player org'ed there. Org it somewhere else and they'll play a litte better
  // but still not right. Haven't looked into why.)

  // PSID file is 1-indexed, code expects 0-indexed
  let startSong = (header.startSong - 1) & 0xff;

  playSong(
    c64,
    fileData,
    playerOrg,
    loadAddress,
    header
  );
}

function validate(header) {
  if (header.magicID !== "PSID") {
    throw new Error("Only PSID .sid files can be played.");
  }
}

function showHeader(c64, header, loadAddress, playerAddress, playerLength, loadLength) {

  const stringToScreen = (row, col, string) => {
    string = string.toLowerCase();
    for (let i = 0; i < string.length; i++) {
      c64.wires.cpuWrite(
        0x400 + col + (40 * row) + i, 
        charToC64FontCodePoint(string[i], true)
      );
      c64.wires.cpuWrite(
        0xd800 + col + (40 * row) + i, 
        15
      );
    }
  };

  stringToScreen( 6, 4, header.name);
  stringToScreen( 7, 4, header.author);
  stringToScreen( 8, 4, header.released);
  stringToScreen(10, 4, `load: ${$xxxx(loadAddress)}-${$xxxx(loadAddress + loadLength)}`);
  stringToScreen(11, 4, `init: ${$xxxx(header.initAddress)}`);
  stringToScreen(12, 4, `play: ${$xxxx(header.playAddress)}`);
  stringToScreen(14, 4, `# songs: ${header.songs} (start ${header.startSong})`);
  stringToScreen(16, 4, `player at ${$xxxx(playerAddress)}-${$xxxx(playerAddress + playerLength)}`);
  stringToScreen(20, 2, `joystick #2 left/right for prev/next`);
}

async function playSong(
  c64,
  fileData,
  playerOrg,
  fileOrg,
  header
) {

  c64.runloop.reset();
  await c64.runloop.untilPc(READY_PC);

  const { initAddress, playAddress, songs, startSong } = header;

  // Right now the player just uses raster time to cue the PSID's tick routine
  // so we're stuck with 50Hz playback, which a lot of PSID's aren't using.
  // We should use a CIA to fix that.

  const playerData = assemble(
    playerOrg,
    ({
      NOP, LDA, LDX, LDY, STA, STX, STY, CLC, CLD, CLI, CLV, SEC, SED, SEI, 
      TAX, TAY, TSX, TXA, TXS, TYA, CMP, CPX, CPY, BCS, BCC, BEQ, BNE, BMI,
      BPL, BVS, BVC, BIT, JSR, RTS, RTI, BRK, JMP, INC, DEC, DEX, DEY, INX,
      INY, ADC, SBC, AND, EOR, ORA, ASL, ROL, LSR, ROR, PHA, PHP, PLA, PLP,
      _
    }) => {

        // We've come in from Basic, so stop everything
        LDA.imm (0); 
        STA.abs (0xdc0e);           // stop CIA1 timer A
        STA.abs (0xdc0f);           // stop CIA1 timer B
        STA.abs (0xdd0e);           // stop CIA2 timer A
        STA.abs (0xdd0f);           // stop CIA2 timer B

        LDA.zpg (1);                // read processor port
        AND.imm (0xf8);             // clear bottom 3 bits
        ORA.imm (0x05);             // 0b101 = I/O mapped, otherwise max RAM
        STA.zpg (1);                // store processor port

        LDA.imm (startSong - 1);    // header's startSong is 1-indexed
        JMP.abs ("startSong");      // play it and enter loop

      _`main`;
        LDA.abs (0xd012);           // read raster line (bits 0-7)
        CMP.imm (0x40);             // there's no line 0x140, so if bits 0-7
        BNE.rel ("main");           // say 0x40, we're at 0x040. Loop until then.

        LDA.imm (15);
        STA.abs (0xd020);           // light border for the duration of the play routing
        JSR.abs (playAddress);      // call player's tick routine
        LDA.imm (14);
        STA.abs (0xd020);           // bring the border back

        LDX.abs (0xdc00);           // read joystick port 2
        TXA.imp ();
        AND.imm (0b1000);           // right?
        BEQ.rel ("nextSong");
        TXA.imp ();
        AND.imm (0b100);            // left?
        BEQ.rel ("prevSong");

      _`tail`;
        LDA.abs (0xd012);           // no changes to the song. just be sure we're
        CMP.imm (0x40);             // not still on that same 0x040 scanline...
        BEQ.rel ("tail");
        BNE.rel ("main");           // we're not. So now loop until we are.

      _`prevSong`;
        DEC.abs ("song");
        DEC.abs ("song");           // because it falls through...

      _`nextSong`;
        INC.abs ("song");

      _`untilReleased`;
        LDA.abs (0xdc00);           // wait until the joystick's let go of
        CMP.imm (0x7f);             // to prevent a double-advance
        BNE.rel ("untilReleased");

        LDA.abs ("song");           // now let's clamp the song number
        BPL.rel ("clamp");          // if positive, go check it's not too high
        LDA.imm (0);                // was negative so clamp to zero
        BEQ.rel ("startSong");      // play

      _`clamp`;
        CMP.imm (songs);            // already at the last song?
        BNE.rel ("startSong");      // no? kick it
        CLC.imp ();                 // (seriously, why is there no DEC.acc?)
        ADC.imm (0xff);             // decrement back to the last

      _`startSong`;
        STA.abs ("song");           // store post-inc/dec song num

        LDX.imm (0b1000);         
        STX.abs (0xd404);           // stop voice 1
        STX.abs (0xd40b);           // stop voice 2
        STX.abs (0xd412);           // stop voice 3

        LDX.imm (0);
        STX.abs (0xd417);           // reset filters
        STX.abs (0xd418);           // volume 0, reset more filters

        JSR.abs (initAddress);      // call player's init routine for song in acc
        JMP.abs ("main");           // re-run main loop

      _`song`;
        _.bytes(0);                 // current song (init'ed by startSong)
    }
  );

  showHeader(c64, header, fileOrg, playerOrg, playerData.length, fileData.length);

  const { cpuWrite } = c64.wires;

  fileData.forEach(
    (byte, index) => cpuWrite(fileOrg + index, byte)
  );

  playerData.forEach(
    (byte, index) => cpuWrite(playerOrg + index, byte)
  );

  c64.cpu.getState().pc = playerOrg;
  c64.runloop.run();
}
