/*
  This is a half-assembler. Rather than taking a text file as input, it
  converts 6502-esque JavaScript functions into object code, and links it,
  returning a byte array.

  Use like this:

  |   const bin = assemble(
  |     0x4000,                   // target address
  |     ({
  |       NOP, LDA, LDX, LDY, STA, STX, STY, CLC, CLD, CLI, CLV, SEC, SED, SEI,
  |       TAX, TAY, TSX, TXA, TXS, TYA, CMP, CPX, CPY, BCS, BCC, BEQ, BNE, BMI,
  |       BPL, BVS, BVC, BIT, JSR, RTS, RTI, BRK, JMP, INC, DEC, DEX, DEY, INX,
  |       INY, ADC, SBC, AND, EOR, ORA, ASL, ROL, LSR, ROR, PHA, PHP, PLA, PLP,
  |       _
  |     }) => {
  |
  |       LDX.imm (7);
  |       STX.abs (0xd020);       // set border color
  |
  |     _`loop`;
  |       STX.abs (0xd021);       // set background color
  |       DEX.imp ();
  |       BNE.rel `loop`;
  |
  |       RTS.imp ();
  |   });


  The format of the opcodes looks like this:

  |       Addressing mode   Assembler      JavaScript
  |       ---------------   ---------      ----------
  |       Implicit          RTI            RTI.imp ()
  |       Immediate         LDA #$10       LDA.imm (0x10)
  |       Accumulator       LSR A          LSR.acc ()
  |       Absolute          JMP $1000      JMP.abs (0x1000)
  |       Absolute,X        STA $3000,X    STA.abx (0x3000)
  |       Absolute,Y        AND $4000,Y    AND.aby (0x4000)
  |       Indirect          JMP ($FFFC)    JMP.ind (0xfffc)
  |       Indirect,X        LDA ($40,X)    LDA.inx (0x40)
  |       Indirect,Y        LDA ($40),Y    LDA.iny (0x40)
  |       Zero Page         LDA $20        LDA.zpg (0x20)
  |       Zero Page,X       STY $10,X      STY.zpx (0x10)
  |       Zero Page,Y       STX $10,Y      STX.zpy (0x10)
  |       Relative          BNE label      BNE.rel `label`


  Labels can be defined as:

  |       _`loop`;

  Or, for locations external to the program:

  |       _.label(0xd020, "extcol");

  ...and can then be referenced like:

  |       BNE.rel `label`;                    // label as branch target
  |       LDX.imm _.l`label`;                 // low byte of label
  |       LDY.imm _.h`label`;                 // high byte of label
  |       STA.abs (({label}) => label + 1);   // perform math on label

  In that last case, the function that's passed to that STA instruction is
  called during the linking phase, once all the labels have been assigned
  locations. It's passed in an object whose keys are all the labels' names, and
  whose values are the locations of those labels. The value it returns will
  become the operand to the STA instruction, converted automatically into
  lowbyte/highbyte.


  Arbitrary bytes can be injected into the code like this:

  |       _.bytes(0x4c, 0x16, 0x08, 0x00, 0x97, 0x32);


  The half-assembler also contains a Basic half-tokenizer, which provides
  only just enough commands to bootstrap a machine language routine. Call it
  like this:

  |       _.basic(
  |         ({REM, POKE, SYS}) => ({
  |           10: REM ("SIMPLE BASIC BOOTSTRAP"),
  |           20: POKE (53281, 0),
  |           30: SYS ("start"),
  |         })
  |       );
  |
  |       _`start`;
  |         // (6502 assembly starts here)

*/

// TODO: the quasi-ops aren't here yet, even though the rest of the emulator
// now supports them.
const opcodes = {
  ADC: { abs: 0x6d, abx: 0x7d, aby: 0x79, inx: 0x61, iny: 0x71, imm: 0x69, zpg: 0x65, zpx: 0x75 },
  AND: { abs: 0x2d, abx: 0x3d, aby: 0x39, inx: 0x21, iny: 0x31, imm: 0x29, zpg: 0x25, zpx: 0x35 },
  ASL: { abs: 0x0e, abx: 0x1e, acc: 0x0a, zpg: 0x06, zpx: 0x16 },
  BCC: { rel: 0x90 },
  BCS: { rel: 0xb0 },
  BEQ: { rel: 0xf0 },
  BIT: { abs: 0x2c, zpg: 0x24 },
  BMI: { rel: 0x30 },
  BNE: { rel: 0xd0 },
  BPL: { rel: 0x10 },
  BRK: { imp: 0x00 },
  BVC: { rel: 0x50 },
  BVS: { rel: 0x70 },
  CLC: { imp: 0x18 },
  CLD: { imp: 0xd8 },
  CLI: { imp: 0x58 },
  CLV: { imp: 0xb8 },
  CMP: { abs: 0xcd, abx: 0xdd, aby: 0xd9, inx: 0xc1, iny: 0xd1, imm: 0xc9, zpg: 0xc5, zpx: 0xd5 },
  CPX: { abs: 0xec, imm: 0xe0, zpg: 0xe4 },
  CPY: { abs: 0xcc, imm: 0xc0, zpg: 0xc4 },
  DEC: { abs: 0xce, abx: 0xde, zpg: 0xc6, zpx: 0xd6 },
  DEX: { imp: 0xca },
  DEY: { imp: 0x88 },
  EOR: { abs: 0x4d, abx: 0x5d, aby: 0x59, inx: 0x41, iny: 0x51, imm: 0x49, zpg: 0x45, zpx: 0x55 },
  INC: { abs: 0xee, abx: 0xfe, zpg: 0xe6, zpx: 0xf6 },
  INX: { imp: 0xe8 },
  INY: { imp: 0xc8 },
  JMP: { abs: 0x4c, ind: 0x6c },
  JSR: { abs: 0x20 },
  LDA: { abs: 0xad, abx: 0xbd, aby: 0xb9, inx: 0xa1, iny: 0xb1, imm: 0xa9, zpg: 0xa5, zpx: 0xb5 },
  LDX: { abs: 0xae, aby: 0xbe, imm: 0xa2, zpg: 0xa6, zpy: 0xb6 },
  LDY: { abs: 0xac, abx: 0xbc, imm: 0xa0, zpg: 0xa4, zpx: 0xb4 },
  LSR: { abs: 0x4e, abx: 0x5e, acc: 0x4a, zpg: 0x46, zpx: 0x56 },
  NOP: { imp: 0xea },
  ORA: { abs: 0x0d, abx: 0x1d, aby: 0x19, inx: 0x01, iny: 0x11, imm: 0x09, zpg: 0x05, zpx: 0x15 },
  PHA: { imp: 0x48 },
  PHP: { imp: 0x08 },
  PLA: { imp: 0x68 },
  PLP: { imp: 0x28 },
  ROL: { abs: 0x2e, abx: 0x3e, acc: 0x2a, zpg: 0x26, zpx: 0x36 },
  ROR: { abs: 0x6e, abx: 0x7e, acc: 0x6a, zpg: 0x66, zpx: 0x76 },
  RTI: { imp: 0x40 },
  RTS: { imp: 0x60 },
  SBC: { abs: 0xed, abx: 0xfd, aby: 0xf9, inx: 0xe1, iny: 0xf1, imm: 0xe9, zpg: 0xe5, zpx: 0xf5 },
  SEC: { imp: 0x38 },
  SED: { imp: 0xf8 },
  SEI: { imp: 0x78 },
  STA: { abs: 0x8d, abx: 0x9d, aby: 0x99, inx: 0x81, iny: 0x91, zpg: 0x85, zpx: 0x95 },
  STX: { abs: 0x8e, zpg: 0x86, zpy: 0x96 },
  STY: { abs: 0x8c, zpg: 0x84, zpx: 0x94 },
  TAX: { imp: 0xaa },
  TAY: { imp: 0xa8 },
  TSX: { imp: 0xba },
  TXA: { imp: 0x8a },
  TXS: { imp: 0x9a },
  TYA: { imp: 0x98 },
};

const basicTokens = {
  REM:  0x8f,
  POKE: 0x97,
  SYS:  0x9e,
}


function validateByte(byte) {
  if (typeof byte !== "number") throw new Error("Not a number");
  if (byte % 1)                 throw new Error("Not an integer");
  if (byte < 0)                 throw new Error("Can't be negative");
  if (byte > 0xff)              throw new Error("Too big");
}

function validateAddr(addr) {
  if (typeof addr !== "number") throw new Error("Not a number");
  if (addr % 1)                 throw new Error("Not an integer");
  if (addr < 0)                 throw new Error("Can't be negative");
  if (addr > 0xffff)            throw new Error("Too big");
}

// Operand handlers

function byteOperand(chunk, linkerTasks, arg) {
  let byte = "XX";

  if (typeof arg === "object") {
    // it's a reference, left by, say, a _.l``
    // (So shouldn't have called it a byte)
    linkerTasks.push({
      ...arg,
      at: chunk.length,
    });
  }

  else if (typeof arg === "string") {
    linkerTasks.push({
      at: chunk.length,
      format: "lo",
      label: arg,
    });
  }

  else {
    validateByte(arg);
    byte = arg;
  }

  chunk.push(byte);
}

function addrOperand(chunk, linkerTasks, arg) {
  if (typeof arg === "function") {

    linkerTasks.push({
      at: chunk.length,
      format: "lohiFn",
      fn: arg,
    });

    chunk.push("XX");
    return;
  }

  if (typeof arg === "number") {
    validateAddr(arg);
    chunk.push(arg & 0xff);
    chunk.push(arg >> 8);
    return;
  }

  else if (typeof arg === "string") {
    linkerTasks.push({
      at: chunk.length,
      format: "lo",
      label: arg,
    });

    chunk.push("XX");

    linkerTasks.push({
      at: chunk.length,
      format: "hi",
      label: arg,
    });

    chunk.push("XX");
  }

  else if (Array.isArray(arg)) {
     
    // Was called as, eg. "LDA `label`"

    linkerTasks.push({
      at: chunk.length,
      format: "lo",
      label: arg[0],
    });

    chunk.push("XX");

    linkerTasks.push({
      at: chunk.length,
      format: "hi",
      label: arg[0],
    });

    chunk.push("XX");
  }
}

function noOperand(chunk, linkerTasks, arg) {
}

function relOperand(chunk, linkerTasks, arg) {

  // TODO we should allow rel with a function arg
  if (typeof arg === "number") {

    // back when we pushed the relative arg
    // chunk.push(arg);

    linkerTasks.push({
      at: chunk.length,
      format: "relFromAbsolute",
      target: arg,
    });

    chunk.push("XX");
    return;
  }

  let label;

  if (Array.isArray(arg)) {
    label = arg[0];
  }
  else if (typeof arg === "string") {
    label = arg;
  }

  else throw new Error("Unexpected type for relative mode:" + arg);

  linkerTasks.push({
    at: chunk.length,
    format: "relFromLabel",
    label,
  });

  chunk.push("XX");
}

const operandHandler = {
  imm: byteOperand,
  acc:   noOperand,
  abs: addrOperand,
  abx: addrOperand,
  aby: addrOperand,
  imp:   noOperand,
  ind: addrOperand,
  inx: byteOperand,
  iny: byteOperand,
  rel:  relOperand,
  zpg: byteOperand,
  zpx: byteOperand,
  zpy: byteOperand,
};

function link(chunk, org, linkerTasks, labels) {

  const getLabel = label => {
    const addr = labels[label];
    if (addr === undefined) {
      throw new Error("Undefined label: " + label);
    }
    return addr;
  };

  linkerTasks.forEach(
    ({ at, format, label, fn, digits, target }) => {

      switch (format) {

        case "lohiFn":
        {
          // A function should be called, and its return value considered
          // an address, which we need to store in lowbyte/highbyte form.
          const addr = fn(labels);

          validateAddr(addr);

          chunk[at + 0] = addr & 0xff;
          chunk[at + 1] = addr >> 8;
          break;
        }

        case "petsciiFn":
        {
          // A function should be called, and its return value considered
          // an address, which we need to store in Petscii characters in
          // `digits` number of digits.
          const addr = fn(labels);

          validateAddr(addr);

          const addrAsString = String(addr);

          if (addrAsString.length > digits) {
            throw new Error("Can't fit address into requested number of digits");
          }

          const addrAsPaddedString = String(addr).padStart(digits, "0");

          Array.from(addrAsPaddedString).forEach(
            (letter, index) => {
              chunk[at + index] = letter.charCodeAt(0);
            }
          )

          break;
        }

        case "lo":
          chunk[at] = getLabel(label) & 0xff;
          break;

        case "hi":
          chunk[at] = getLabel(label) >> 8;
          break;

        case "relFromAbsolute":
        {
          // -1 instead of -2 because the 'at' in this case is the operand,
          // not the opcode
          const val = target - (at + org) - 1;

          if ((val > 127) || (val < -128)) 
            throw new Error(`branch target ${label} too far (${val}) at offset ${at}`);

          chunk[at] = val & 0xff;
          break;
        }

        case "relFromLabel":
        {
          const addr = getLabel(label);
          const val = addr - (at + org) - 1;

          if ((val > 127) || (val < -128)) 
            throw new Error(`branch target ${label} too far (${val})`);

          chunk[at] = val & 0xff;
          break;
        }
      }
    }
  );
}

function stringToPetsciiCodes(num) {
  return Array.from(num).map(char => char.charCodeAt(0));
}

function numberToPetsciiCodes(num) {
  return Array.from(String(num)).map(char => char.charCodeAt(0));
}

function basic(fn, chunk, org, linkerTasks) {

  const commands = {

    REM: (str) => () => {
      chunk.push(basicTokens.REM);
      chunk.push(...stringToPetsciiCodes(" "));
      chunk.push(...stringToPetsciiCodes(str));
    },

    POKE: (addr, byte) => () => {
      // The address, and the byte to store at that address, must both be
      // simple numbers. (Would be nice to change this in future).
      chunk.push(basicTokens.POKE);
      chunk.push(...stringToPetsciiCodes(" "));
      chunk.push(...numberToPetsciiCodes(addr));
      chunk.push(...stringToPetsciiCodes(","));
      chunk.push(...numberToPetsciiCodes(byte));
    },

    SYS: (addr, digits=5) => () => {
      // The address can be a number, a string (the name of a label), or a
      // function (which, given all the labels, returns a number)
      chunk.push(basicTokens.SYS);
      chunk.push(...stringToPetsciiCodes(" "));

      if (typeof addr === "string") {
        const label = addr;
        addr = (labels) => labels[label];
        // ...and fall through to function
      }

      if (typeof addr === "function") {
        linkerTasks.push({
          at: chunk.length,
          format: "petsciiFn",
          fn: addr,
          digits
        });

        for (let i = 0; i < digits; i++) {
          chunk.push("XX");
        }
      }

      else {
        chunk.push(...numberToPetsciiCodes(addr));
      }
    },
  };

  // Call the user-supplied function, which will return an object that maps
  // line numbers to functions which, when called, place the tokenized Basic
  // commands into the chunk.
  const numbersToLines = fn(commands);

  Object
    // Convert the object into a list of [line number, command] entries
    .entries(numbersToLines)

    // Sort the line numbers numerically
    .sort(
      ([numberA, commandA], [numberB, commandB]) => (
        Number(numberA) > Number(numberB) ? 1 : -1
      )
    )

    // Lay down each one
    .forEach(
      ([lineNum, lineFn]) => {

        // Add a placeholder for the address for the next line, while we're still
        // figuring out the length of this one.
        const posOfNextLinePtr = chunk.length;
        chunk.push("XX", "XX");

        // Declare the line number, in lowbyte/highbyte form.
        // It came from a object key, which is a string
        lineNum = Number(lineNum);
        chunk.push(lineNum & 0xff);
        chunk.push(lineNum >> 8);

        // Lay down the line (which may contain placeholders and generate
        // linker tasks)
        lineFn();

        // Null-terminate the Basic line
        chunk.push(0);

        // Now go back and set the 'next line address' of the current line to
        // the address that the next line is about to use.
        const addrOfNextLine = org + chunk.length;

        chunk[posOfNextLinePtr + 0] = addrOfNextLine & 0xff;
        chunk[posOfNextLinePtr + 1] = addrOfNextLine >> 8;
      }
    )
  ;

  // Two zero bytes instead of an address signifies the end of the Basic program
  chunk.push(0, 0);
}

export function assemble(org, fn) {

  let chunk = [];
  const linkerTasks = [];
  const labels = {};

  // --- label tools ---

  const tools = {};

  tools._ = (arg) => {
    if (!Array.isArray(arg)) {
      throw new Error("_ should be called as _``");
    }
    const name = arg[0];
    labels[name] = org + chunk.length;
  }

  tools._.basic = (program) => basic(program, chunk, org, linkerTasks);

  tools._.bytes = (...bytes) => {
    bytes.forEach(
      byte => {
        validateByte(byte);
        chunk.push(byte);
      }
    );
  };

  tools._.l = (arg) => (
    {
      // Calling function will add the `at`
      format: "lo",
      label: arg[0],
    }
  );

  tools._.h = (arg) => (
    {
      // Calling function will add the `at`
      format: "hi",
      label: arg[0],
    }
  );

  tools._.label = (addr, name) => {
    labels[name] = addr;
  };

  // --- ops ---

  for (let insn in opcodes) {
    tools[insn] = {};

    for (let mode in opcodes[insn]) {
      const opcode = opcodes[insn][mode];

      tools[insn][mode] = (arg) => {
        chunk.push(opcode);
        operandHandler[mode](chunk, linkerTasks, arg);
      };
    }
  }

  // "Assemble"
  fn(tools);

  // Link
  link(chunk, org, linkerTasks, labels);

  return chunk;
}
