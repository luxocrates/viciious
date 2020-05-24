/*
   cias: emulates both of the 6526 complex interface adaptors

   As well as emulating the CIAs themselves, this module provides interfacing
   for the devices that would be attached to them. For example, when it sees
   that a new value will be emitted on CIA2 port A, it will instruct the Vic
   bank-mapper (in wires) that the Vic bank just changed. 

   The code below represents a failed attempt at making the CIA emulation
   cycle-accurate. Its nextTickFn attempts to model what the Lorenz tests
   expect to see happen at various cycles after events, but its model
   misunderstands what's really going on, and can't be adjusted to pass the
   tests.

   For an accurate model, see Lorenz's own, at:
      https://ist.uwaterloo.ca/~schepers/MJK/cia6526.html

   Some additional caveats:

   - https://en.wikipedia.org/wiki/MOS_Technology_CIA

      "Due to a bug in many 6526s (see also errata below), the alarm IRQ would
      not always occur when the seconds component of the alarm time is exactly
      zero. The workaround is to set the alarm's tenths value to 0.1 seconds.

      In addition to the aforementioned alarm clock interrupt bug, many CIAs
      exhibited a defect in which the part would fail to generate a timer B 
      hardware interrupt if the interrupt control register (ICR) was read one
      or two clock cycles before the time when the interrupt should have
      actually occurred. This defect, as well as logic errors in the Commodore
      provided (8 bit) operating system, caused frequent pseudo-RS-232 errors
      in the Commodore 64 and Commodore 128 computers when running at higher 
      baud rates."

   - https://codebase64.org/doku.php?id=base:detecting_6526_vs_6526a_cia_chips

      "This sets off a single-shot NMI to interrupt immediately before an INC
      statement. The older 6526 triggers one cycle later, so it will run the
      INC while the newer one won't.
*/

// TODO: I really need to rename irq_status and irq_control to be something
// like 'int_status', etc. as it might be NMI that they relate to.

import { $xx, $xxxx, unimplementedWarning } from "../debug";
import {
  addToSerializerRegistry,
  functionToReference,
  referenceToFunction,
} from "../tools/serializerSupport";

// Bound by attach
let c64;
let setCia1Irq;
let setCia2Nmi;
let setVicBank;

const CLOCK_SPEED = 985248;                 // cycles/second (PAL 50Hz)
const todOffset   = 10 * 60 * CLOCK_SPEED;  // 10 minutes in cycles

let state = {};

const defaultTimerRegs = {
  value_lo:       0,
  value_hi:       0,
  startValue_lo:  0,
  startValue_hi:  0,
  control:        0,
  status:         0,
  nextTickFn:     tick_timer_stopped,
};

const defaultPortRegs = {
  value:          0,
  direction:      0,
};

const makeDefaultCiaRegs = (is1) => ({
  is1,
  port_a:         { ...defaultPortRegs },
  port_b:         { ...defaultPortRegs },
  shift:          0,
  irq_status:     0,
  irq_control:    0,
  tod_10ths:      0,
  tod_seconds:    0,
  tod_minutes:    0,
  tod_hours:      0,
  timer_a:        { isA: true,  ...defaultTimerRegs },
  timer_b:        { isA: false, ...defaultTimerRegs },
});


export function attach(nascentC64) {
  c64 = nascentC64;

  setCia1Irq = c64.wires.setCia1Irq;
  setCia2Nmi = c64.wires.setCia2Nmi;
  setVicBank = c64.wires.setVicBank;

  c64.keyboard.setSetKeyMatrix(
    (keyMatrix) => {
      state.keyMatrix = keyMatrix;
    }
  );

  c64.joystick.setSetJoystick1((value) => { state.joystick1 = value; });
  c64.joystick.setSetJoystick2((value) => { state.joystick2 = value; });

  c64.cias = {
    // Control
    tick,
    reset,
    serialize,
    deserialize,
    // MMIO
    read_dc00_dcff,
    read_dd00_ddff,
    write_dc00_dcff,
    write_dd00_ddff,
    // Other wires
    raiseTapeInterrupt,
  };

  reset();
}

function reset() {
  state = {
    cia1: makeDefaultCiaRegs(true),
    cia2: makeDefaultCiaRegs(false),

    // joystick1/joystick2 represent what the respective port values would be
    // in isolation (if joystick port 1 wasn't shared with the keyboard). Lines
    // float high.
    joystick1: 0xff,
    joystick2: 0xff,

    // keyMatrix: what values should appear on CIA1 port B for each of the
    // eight bits that might be selected on its port A write, *except that*
    // - they appear inverted here (they'll be flipped back on read), and 
    // - the joystick port 1 contribution is stripped out.
    keyMatrix: [0, 0, 0, 0, 0, 0, 0, 0],
  };
}

function numberToBcd(num) {
  // Converts 59 -> 0x59, rounding down if num is floating-point.
  return parseInt(Math.floor(num), 16);
}

function underflow(timer, cia) {
  // Timer reloads from the latch, regardless of whether this was one-shot or
  // continuous.
  timer.value_lo = timer.startValue_lo;
  timer.value_hi = timer.startValue_hi;

  // Delay the actioning of this until the next cycle.
  timer.nextTickFn = tick_timer_postUnderflow_0;
}

/*
  #1 #2  DD06 sequence 1/2/3 (4)
  ---------------------------------
  00 01  keep   keep   count  count     tick_timer_startup_0     -> tick_timer_running
  00 10  keep   load   keep   keep      tick_timer_stoppedLoad_0 -> tick_timer_stopped
  00 11  keep   load   keep   count     tick_timer_startup_0     -> tick_timer_running
  01 11  count  load   keep   count     tick_timer_runningLoad_0 -> tick_timer_running
  01 10  count  load   keep   keep      tick_timer_shutdown_0    -> tick_timer_stopped
  01 00  count  count  keep   keep      tick_timer_shutdown_0    -> tick_timer_stopped
*/

function tick_timer_startup_0(timer, cia) {
  // First cycle is always a continuation
  timer.nextTickFn = tick_timer_startup_1;
}

function tick_timer_startup_1(timer, cia) {
  if (timer.control & 0x10) {
    load(timer);
    timer.nextTickFn = tick_timer_startup_2;
  }
  else timer.nextTickFn = tick_timer_running;
}

function tick_timer_startup_2(timer, cia) {
  // We did a load, and that stalls the count for a cycle
  timer.nextTickFn = tick_timer_running;
}

function tick_timer_shutdown_0(timer, cia) {
  // First cycle is always a continuation
  // decrement(timer, cia);
  // timer.nextTickFn = tick_timer_shutdown_1;

  // short-circuit what I thought it was doing; it doesn't look like it needs two cycles to stop
  tick_timer_shutdown_1(timer, cia);  
}

function tick_timer_shutdown_1(timer, cia) {
  if (timer.control & 0x10) {
    load(timer);
  }
  else decrement(timer, cia);
  timer.nextTickFn = tick_timer_stopped;
}

function tick_timer_stoppedLoad_0(timer, cia) {
  // First cycle is always a continuation
  timer.nextTickFn = tick_timer_stoppedLoad_1;
}

function tick_timer_stoppedLoad_1(timer, cia) {
  load(timer);
  timer.nextTickFn = tick_timer_stopped;
}

function tick_timer_runningLoad_0(timer, cia) {
  // First cycle is always a continuation
  decrement(timer, cia);
  timer.nextTickFn = tick_timer_runningLoad_1;
}

function tick_timer_runningLoad_1(timer, cia) {
  load(timer);
  timer.nextTickFn = tick_timer_runningLoad_2;
}

function tick_timer_runningLoad_2(timer, cia) {
  // We did a load, and that stalls the count for a cycle
  timer.nextTickFn = tick_timer_running;
}

function tick_timer_runningNonLoad_0(timer, cia) {
  // Starting while already started seems to cause a one-cycle pause
  timer.nextTickFn = tick_timer_running;
}


function tick_timer_running(timer, cia) {
  decrement(timer, cia);
}

function tick_timer_stopped(timer, cia) {
}

function tick_timer_postUnderflow_0(timer, cia) {

  if (timer.isA) {
    // Mark Timer A interrupt as having happened
    cia.irq_status |= 0b01;

    // Is Timer B configured to count when we underflow? (and not in
    // conjunction with the CNT pin)
    if ((cia.timer_b.control & 0b01100000) === 0b01000000) {
      decrement(cia.timer_b, cia);
    }
  }
  else {
    // Mark Timer B interrupt as having happened
    cia.irq_status |= 0b10;
  }

  reconsiderInterrupt(cia);

  // bit 3: 1 = timer stops on underflow
  if (timer.control & 0b1000) {
    timer.nextTickFn = tick_timer_postUnderflow_1;
  }
  else {
    // Timer restarts on underflow (but we still fire the interrupt)
    // In this case, we have a one-cycle delay before restarting the count,
    // presumably to compensate for the timer reloading instead of showing
    // a zero count.
    timer.nextTickFn = tick_timer_running;
  }

  // CIA1TAB test shows there's a one-cycle delay here
  // timer.nextTickFn = tick_timer_running;
}

function tick_timer_postUnderflow_1(timer, cia) {
  // We're on the one-shot flow here. Finally mark the timer as having stopped.
  timer.control &= 0xfe;
  timer.nextTickFn = tick_timer_stopped;
}



function load(timer) {
  timer.value_lo = timer.startValue_lo;
  timer.value_hi = timer.startValue_hi;
}


function decrement(timer, cia) {
  timer.value_lo--;

  // The 'underflow' interrupt, timer stop and reload happen if the timer
  // reaches zero, not if it actually underflows.
  if (!timer.value_lo && !timer.value_hi) {
    underflow(timer, cia);
    return;
  }

  if (timer.value_lo < 0) {
    timer.value_lo = 0xff;
    timer.value_hi = --timer.value_hi & 0xff;
  }
}

function reconsiderInterrupt(cia) {
  if (cia.irq_status & cia.irq_control) {
    if (cia.is1) setCia1Irq(true);
    else         setCia2Nmi(true);
  }

  // Otherwise... don't setCiaXXxx(false): nothing can un-set the interrupt
  // state except for reading the interrupt control/status register, handled by
  // the read logic

  // "Once the interrupt flip-flop has been set, changing the condition in the
  // IMR has no effect. Only reading the ICR will clear it."
  // - Lorenz (https://ist.uwaterloo.ca/~schepers/MJK/cia6526.html)
}

function tick_cia(cia) {

  // Set bit 7 of the irq_status
  const int_state = Boolean(cia.irq_status & cia.irq_control);
  cia.irq_status = (cia.irq_status & 0x7f) | (int_state ? 0x80 : 0);
  // maybe this is where we actually pull the interrupt line low

  cia.timer_a.nextTickFn(cia.timer_a, cia);
  cia.timer_b.nextTickFn(cia.timer_b, cia);
}

function tick() {
  tick_cia(state.cia1, setCia1Irq);
  tick_cia(state.cia2, setCia2Nmi);
}

function read(cia, reg) {

  switch (reg) {

    // cases 0x0 and 0x1: picked up by the read handlers specific to that CIA,
    // but this defines default behavior if they do nothing.

    case 0x0:     // $dc02 / $dd02: port A value
      // TODO: honor port direction
      return cia.port_a.value;

    case 0x1:     // $dc02 / $dd02: port A value
      // TODO: honor port direction
      return cia.port_b.value;

    case 0x2:     // $dc02 / $dd02: port A data direction
      // TODO: honor port direction
      return cia.port_a.direction;

    case 0x3:     // $dc03 / $dd03: port B data direction
      // TODO: honor port direction
      return cia.port_b.direction;

    case 0x4:     // $dc04 / $dd04: timer A value, low byte
      return cia.timer_a.value_lo;

    case 0x5:     // $dc05 / $dd05: timer A value, high byte
      return cia.timer_a.value_hi;

    case 0x6:     // $dc06 / $dd06: timer B value, low byte
      return cia.timer_b.value_lo;

    case 0x7:     // $dc07 / $dd07: timer B value, high byte
      return cia.timer_b.value_hi;

    case 0x8:     // $dc08 / $dd08: time of day, tenths
      {
        let t = (c64.runloop.getState().cycle + todOffset) / CLOCK_SPEED;
        t *= 10;  // tenths
        t %= 10;  // ...and just the tenths
        return numberToBcd(t);
      }

    case 0x9:     // $dc09 / $dd09: time of day, seconds
      {
        let t = (c64.runloop.getState().cycle + todOffset) / CLOCK_SPEED;
        t %= 60;  // ...and just the seconds
        return numberToBcd(t);
      }

    case 0xa:     // $dc0a / $dd0a: time of day, minutes
      {
        let t = (c64.runloop.getState().cycle + todOffset) / CLOCK_SPEED;
        t /= 60;  // minutes
        t %= 60;  // ...and just the minutes
        return numberToBcd(t);
      }

    case 0xb:     // $dc0b / $dd0b: time of day, hours
      {
        let t = (c64.runloop.getState().cycle + todOffset) / CLOCK_SPEED;
        t /= 60;  // minutes
        t /= 60;  // hours
        t %= 24;  // ...and just the hours

        // Result must be 12 hour, with MSB being the meridiem
        let ret = numberToBcd(t % 12);
        ret |= (t > 12) ? 0x80 : 0;
        return ret;
      }

    case 0xc:     // $dc0c / $dd0c: serial shift
      // TODO: Serial shifter not implemented
      unimplementedWarning("serial shifter read");
      return 0;

    case 0xd:     // $dc0d / $dd0d: interrupt status/control
      {
        // Reading the interrupt status clears it
        const ret = cia.irq_status;
        cia.irq_status = 0;

        if (cia.is1) setCia1Irq(false);
        else         setCia2Nmi(false);

        return ret;
      }

    // This is kludgey. The load doesn't get stored permanently; I am
    // storing it (the cycle sequence needs it remembered), so I'm just zeroing
    // it out on read. Do not like.

    case 0xe:     // $dc0e / $dd0e: timer A control
      return cia.timer_a.control & 0b11101111;

    case 0xf:     // $dc0f / $dd0f: timer B control
      return cia.timer_b.control & 0b11101111;
  }
}

function write_timerControl(timer, byte) {

  /*
    #1 #2  DD06 sequence 1/2/3 (4)
    ---------------------------------
    00 01  keep   keep   count  count     tick_timer_startup_0     -> tick_timer_running
    00 10  keep   load   keep   keep      tick_timer_stoppedLoad_0 -> tick_timer_stopped
    00 11  keep   load   keep   count     tick_timer_startup_0     -> tick_timer_running
    01 11  count  load   keep   count     tick_timer_runningLoad_0 -> tick_timer_running
    01 10  count  load   keep   keep      tick_timer_shutdown_0    -> tick_timer_stopped
    01 00  count  count  keep   keep      tick_timer_shutdown_0    -> tick_timer_stopped
  */

  // If we're not counting cycles CPU cycles...
  if (byte & 0b01100000) {
    // Maybe, like the cycle counter, it has a cycle for this to get noticed.
    // I haven't looked.
    timer.nextTickFn = tick_timer_stopped;

    // (There's an edge case here about if it was running but not counting cycles)
  }
  // We are counting cycles CPU cycles...
  else {

    // If timer was running...
    if (timer.control & 1) {
      // ...and we're keeping it running...
      if (byte & 1) {
        // ...but we're doing a load
        if (byte & 0x10) {
          timer.nextTickFn = tick_timer_runningLoad_0;
        }
        // ...or not doing a load
        else {
          timer.nextTickFn = tick_timer_runningNonLoad_0;
        }
      }
      // ...and we're stopping it...
      else {
        timer.nextTickFn = tick_timer_shutdown_0;
      }
    }
    // If timer was stopped...
    else {
      // ...but we're starting it...
      if (byte & 1) {
        timer.nextTickFn = tick_timer_startup_0;
      }
      // ...and we're keeping it stopped...
      else {
        // ...but we're doing a load
        if (byte & 0x10) {
          timer.nextTickFn = tick_timer_stoppedLoad_0;
        }
      }
    }
  }

  // TODO: we're not doing anything about bits 1 or 2, on setting bits of the
  // port when an underflow/overflow occurs. (How does an overflow even happen?
  // When used for the serial shift register?)
  // And as for the other bits... non-CPU-clock source, shift register
  // direction, 50/60Hz clock select... we don't do any of that.

  if (byte & 1) unimplementedWarning("indicate timer underflow on port B");

  timer.control = byte;
}

function write_timerLow(timer, byte) {
  timer.startValue_lo = byte;

}

function write_timerHigh(timer, byte) {
  timer.startValue_hi = byte;

  // Load the timer value immediately if the timer's not running
  if (!(timer.control & 1)) {
    load(timer);
  }
}

function raiseTapeInterrupt() {
  state.cia1.irq_status |= 0x10;
  reconsiderInterrupt(state.cia1);
}

function write(cia, reg, byte) {
  switch (reg) {

    case 0x0:
      // TODO: honor port direction
      cia.port_a.value = byte;
      break;

    case 0x1:
      // TODO: honor port direction
      cia.port_b.value = byte;
      break;

    case 0x2:     // $dc02 / $dd02: port A data direction
      cia.port_a.direction = byte;
      break;

    case 0x3:     // $dc03 / $dd03: port B data direction
      cia.port_b.direction = byte;
      break;

    case 0x4:     // $dc04 / $dd04: timer A value, low byte
      write_timerLow(cia.timer_a, byte);
      break;

    case 0x5:     // $dc05 / $dd05: timer A value, high byte
      write_timerHigh(cia.timer_a, byte);
      break;

    case 0x6:     // $dc06 / $dd06: timer B value, low byte
      write_timerLow(cia.timer_b, byte);
      break;

    case 0x7:     // $dc07 / $dd07: timer B value, high byte
      write_timerHigh(cia.timer_b, byte);
      break;

    case 0x8:     // $dc08 / $dd08: time of day
      unimplementedWarning("time of day clock write");
      break;

    case 0x9:     // $dc09 / $dd09: time of day
      unimplementedWarning("time of day clock write");
      break;

    case 0xa:     // $dc0a / $dd0a: time of day
      unimplementedWarning("time of day clock write");
      break;

    case 0xb:     // $dc0b / $dd0b: time of day
      unimplementedWarning("time of day clock write");
      break;

    case 0xc:     // $dc0c / $dd0c: serial shift
      unimplementedWarning("serial shifter write");
      break;

    case 0xd:     // $dc0d / $dd0d: interrupt control

      if (byte & 0x80) {
        // byte is specifying which bits of the control register to set
        cia.irq_control |= (byte & 0x7f);
      }
      else {
        // byte is specifying which bits of the control register to clear
        cia.irq_control &= ~byte;
      }

      reconsiderInterrupt(cia);
      break;

    case 0xe:     // $dc0e / $dd0e: timer A control
      write_timerControl(cia.timer_a, byte);
      break;

    case 0xf:     // $dc0f / $dd0f: timer B control
      write_timerControl(cia.timer_b, byte);
      break;
  }
}

function read_dc00_dcff(addr) {
  
  // CIA1 regs are from $dc00-$dc0f, with degenerate copies through $dcff
  const reg = addr & 0xf;

  switch (reg) {
    case 0x0:     // $dc00: joystick 2

      // The docs I read say that bits 0-4 are the joystick switches but don't
      // mention the others. In practice, bit 7 is tied low, and 6 and 5 are
      // high. Some games (Commando, Bomb Jack...) depend on this by testing
      // for the value $6f to wait for the fire button.

      return state.joystick2 & 0b01111111;

    case 0x1:     // $dc01: keyboard and joystick 1
      {
        // everything's inverted, unhelpfully

        const column = (~state.cia1.port_a.value) & 0xff;
        // const column = (~state.regs_1[0]) & 0xff;

        let ret = 0;

        for (let c = 0; c < 8; c++) {
          if (column & (1 << c)) ret |= state.keyMatrix[c];
        }

        // return (~ret) & 0xff;
        return (~(ret | ~state.joystick1)) & 0xff;
      }
  }

  return read(state.cia1, reg);
}

function read_dd00_ddff(addr) {

  // CIA2 regs are from $dd00-$dd0f, with degenerate copies through $ddff
  const reg = addr & 0xf;

  switch (reg) {
    case 0x0:     // $dd00: serial bus
      // TODO
      // Deliberately fall through
      break;

    case 0x1:     // $dd01: RS232
      // TODO
      // Deliberately fall through
      break;      
  }

  return read(state.cia2, reg);
}

function write_dc00_dcff(addr, byte) {

  // CIA1 regs are from $dc00-$dc0f, with degenerate copies through $dcff
  const reg = addr & 0xf;

  // CIA1-specific configuration
  switch (reg) {
    case 0x0:     // $dc00: keyboard column
    case 0x1:     // $cd01: RS232
      // deliberately fall through
      break;
  }

  // CIA-general functionality
  return write(state.cia1, reg, byte, setCia1Irq);
}

function write_dd00_ddff(addr, byte) {

  // CIA2 regs are from $dd00-$dd0f, with degenerate copies through $ddff
  const reg = addr & 0xf;

  // CIA2-specific configuration
  switch (reg) {
    case 0x0:     // $dd00: VIC bank select, serial bus

      // The 'bank number' that we're setting is the bitwise inverse of the
      // that's being written here; presumably because lines are tied high,
      // so setting the bit means pulling it low. It's just a matter of
      // convention, but to stay consistent with the documentation's
      // concept of the VIC bank number, we'll translate here.
      setVicBank(3 - (byte & 0b11));

      // TODO: and there's other bits here for the serial bus
      state.cia2.port_a.value = byte;
      // deliberately fall through
      break;

    case 0x1:     // $dd01: user port
      // TODO
      // deliberately fall through
      break;

    // direction
    case 0x2:
      // debugger;
      break;
    case 0x3:
      // debugger;
      break;
  }

  // CIA-general functionality
  return write(state.cia2, reg, byte, setCia2Nmi);
}

function serialize() {
  const obj = {
    ...state,
    cia1: {
      ...state.cia1,
      timer_a: {
        ...state.cia1.timer_a,
        nextTickFn: functionToReference(state.cia1.timer_a.nextTickFn),
      },
      timer_b: {
      ...state.cia1.timer_b,
        nextTickFn: functionToReference(state.cia1.timer_b.nextTickFn),
      },
    },
    cia2: {
      ...state.cia2,
      timer_a: {
        ...state.cia2.timer_a,
        nextTickFn: functionToReference(state.cia2.timer_a.nextTickFn),
      },
      timer_b: {
      ...state.cia2.timer_b,
        nextTickFn: functionToReference(state.cia2.timer_b.nextTickFn),
      },
    }
  };

  return JSON.stringify(obj);
}

function deserialize(json) {
  state = JSON.parse(json);

  state.cia1.timer_a.nextTickFn = referenceToFunction(state.cia1.timer_a.nextTickFn);
  state.cia1.timer_b.nextTickFn = referenceToFunction(state.cia1.timer_b.nextTickFn);
  state.cia2.timer_a.nextTickFn = referenceToFunction(state.cia2.timer_a.nextTickFn);
  state.cia2.timer_b.nextTickFn = referenceToFunction(state.cia2.timer_b.nextTickFn);
}

addToSerializerRegistry({
  tick_timer_startup_0,
  tick_timer_startup_1,
  tick_timer_startup_2,
  tick_timer_shutdown_0,
  tick_timer_shutdown_1,
  tick_timer_stoppedLoad_0,
  tick_timer_stoppedLoad_1,
  tick_timer_runningLoad_0,
  tick_timer_runningLoad_1,
  tick_timer_runningLoad_2,
  tick_timer_runningNonLoad_0,
  tick_timer_running,
  tick_timer_stopped,
  tick_timer_postUnderflow_0,
  tick_timer_postUnderflow_1,
});
