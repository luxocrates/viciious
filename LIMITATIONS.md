# Compatibility and Limitations

## Target hardware

 The following functionality of target hardware is **not implemented**:

Configuration
- Emulation of any external devices except the tape deck and joysticks. The emulator presently has no support for `.d64` files, and adding it is very high priority for the future. (Cartridges, less so.)
- 60Hz (NTSC) VIC/system-clock
- Minor timing differences between the C64 and C64C. The classic breadbox is the reference hardware for this emulator.

VIC
- BA pin output (for bad lines)
- Light pen

SID
- Filtering
- Ring modulation
- Pulse synchronization
- Voice 3 waveform output ($d41b) (except noise)
- Voice 3 envelope output ($d41c)
- DC offset. (Note: regardless of the DC offset itself, compatibility with sound samples might be impossible using the current OscillatorNode-based audio graphs, on account of the batched timing of emulation, and current browsers’ inability to effect an audio wave with passable fidelity from modulating a DC offset. It’s possible that a samples-based waveform generator might be attempted in future, but this would depend on audio worklets being somehow bundle-able in the single HTML source file (would a `data:.../...;base64,...` URL allow this? 🤔)
- Paddles

CPU
- RDY pin input (for bad lines)
- SYNC pin output (or other means to demarcate the start of an opcode. The PC/disassembly shown by the monitor tool could be from any byte within the current instruction)

CIAs
- Time-of-day clock write (time set, alarm set)
- Serial ports
- Timer underflow affecting port B bits 6-7
- Time-of-day clock 60Hz mode

Keyboard
- RESTORE key


The following functionality of target hardware is **not accurate**:

VIC
- Cycle-accurate timing
- Character output in border regions
- VSCROLL behavior ($d011)

SID
- ADSR shapes and timing
- Exact frequency output

CPU
- I’m suspicious of interrupt behavior, especially for NMIs
- Instruction execution timing, and the timing of interrupt servicing during instructions, is not verified. The Lorenz testsuite offers good tests for these; however, it relies on CIA timing being cycle-accurate to test the CPU timing, and the CPU timing being cycle-accurate to test the CIA timing. Right now the CIA is definitely not cycle-accurate.

CIAs
- Time-of-day clock write (time set, alarm set)
- Serial port


## File formats

- `.sid` support is rudimentary. Only PSID files are supported, and playback timing will always be at 50Hz regardless of the file timing info.
- `.t64` files: whichever file entry is first is what will get loaded.
- `.json` snapshots: don’t expect snapshot files to be interchangeable between different versions of the emulator prior to v1.0.0.


## Miscellaneous
 - The ANSI terminal-output mode is a toy. The stdout video interface was originally created to facilitate automated testing; then, for funsies, a stdin keyboard interface was created. The nature of what it can display, and how it can consume input, is very limited, but probably acceptable for most Basic programs (if they don’t rely too heavily on PETSCII or sprites) or text adventures.
 - There are bugs.
