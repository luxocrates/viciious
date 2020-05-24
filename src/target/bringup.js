/*
   bringup: a bootstrapping sequencer for initializing the virtual machine.
  
   The C64 is a system of mutually dependent components. We have to be careful,
   in structuring the emulator sources, that we don't introduce cyclic
   dependencies between modules, and when initializing a component, we have to
   guarantee that it doesn't try interacting with another component that hasn't
   itself yet initialized.
  
   This module orchestrates this bringup. Supply it with a structure of
   components representing the whole machine, and it'll get it started.
*/

import { attach as runloop } from "./runloop";

export function bringup({
  host:   { audio, video, keyboard, joystick },
  target: { wires, ram, vic, sid, cpu, cias, tape, basic, kernal, character },
  attachments
}) {

  const c64 = {
    // 'hooks' is a way for the target machine to trigger a host-side action,
    // for example, updating the FPS count on the UI, if there is one.
    // Target shouldn't assume any particular hook is present, but the presence
    // of the `hooks` object is at least guaranteed.
    hooks: {},
  };

  // First the ROMs, which, being just data, are truly at the end of the chain.
  c64.rom = {
    basic,
    kernal,
    character,
  };

  // ...followed by the RAM, which likewise won't be calling anyone else
  ram(c64);

  // wires has to go next. The one guarantee that other modules have while
  // initializing is that its functions and state structure are present.
  // (But must not be called until after initialization.)
  wires(c64);

  // Host interfaces have to attach next (in any order).
  // The target devices can assume, when they attach, that the functions and
  // objects for the interfaces are final.
  audio(c64);
  video(c64);
  joystick(c64);
  keyboard(c64);

  // Now all the devices (in any order).
  // Each should add a structure to the c64 for their
  // state and accessors, and the device should be in a valid reset state, but
  // must not call other devices in resetting, since there's no guarantee that
  // other devices are yet attached.
  //
  // For example, CIA2, when assigning a default value for its Vic bank, must
  // not then call wires to announce the change in memory mapping. Rather, we
  // have to co-ordinate our reset states such that the devices' default values
  // happen to be consistent with each other.
  vic(c64);
  sid(c64);
  cias(c64);
  cpu(c64);
  tape(c64);

  // By this point we're done, and no longer have to be careful about order of
  // execution.
  runloop(c64);

  // Add any additional attachments for this configuration
  for (let attachment of attachments) attachment(c64);

  return c64;
}
