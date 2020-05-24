/*
   Kernal ($e000 – $ffff)

   The source below assembles into a bytestream fully compatible with the C64's
   Kernal ROM. It's adapted from Michael Steil's adaptation(†1) of Lee Davison's
   investigation into the original firmware. All comments below are Lee's.

   The labels are informed by Project64's collection of memory maps(†2) and
   those used in Mapping The Commodore 64(†3). Where sources disagree on names/
   locations, I've based my choices on which had the most consensus and which
   best corresponds to the instructions or data to which they relate.

   †1 https://github.com/mist64/c64disasm
   †2 https://github.com/Project-64/reloaded/blob/master/c64/64MAP11.TXT
   †3 https://github.com/Project-64/reloaded/blob/master/c64/mapc64/MAPC6412.TXT

   If you want to substitute your own ROM, just export a byte array instead:
       export default [ 0x.., ... ];

   Unlike the rest of the Viciious project, which was authored from scratch and
   entered into the public domain, the source below is derived from works by
   multiple other authors and I make no representations as to its ownership or
   terms of use.
*/

import { assemble } from "../../tools/assembler";

export default assemble(
  0xe000,
  ({
    NOP, LDA, LDX, LDY, STA, STX, STY, CLC, CLD, CLI, CLV, SEC, SED, SEI,
    TAX, TAY, TSX, TXA, TXS, TYA, CMP, CPX, CPY, BCS, BCC, BEQ, BNE, BMI,
    BPL, BVS, BVC, BIT, JSR, RTS, RTI, BRK, JMP, INC, DEC, DEX, DEY, INX,
    INY, ADC, SBC, AND, EOR, ORA, ASL, ROL, LSR, ROR, PHA, PHP, PLA, PLP,
    _
  }) => {
            // External labels (RAM)
            _.label(0x0002, "_0002");
            _.label(0x0003, "adray1+0_0003");
            _.label(0x0004, "adray1+1_0004");
            _.label(0x0005, "adray2+0_0005");
            _.label(0x0006, "adray2+1_0006");
            _.label(0x0007, "charac_0007");
            _.label(0x000a, "verck_000a");
            _.label(0x0012, "tansgn_0012");
            _.label(0x0013, "channl_0013");
            _.label(0x0014, "linnum+0_0014");
            _.label(0x0016, "temppt_0016");
            _.label(0x0018, "lastpt+1_0018");
            _.label(0x0022, "index+0_0022");
            _.label(0x0023, "index+1_0023");
            _.label(0x002b, "txttab+0_002b");
            _.label(0x002c, "txttab+1_002c");
            _.label(0x002d, "vartab+0_002d");
            _.label(0x002e, "vartab+1_002e");
            _.label(0x0033, "fretop+0_0033");
            _.label(0x0034, "fretop+1_0034");
            _.label(0x0037, "memsiz+0_0037");
            _.label(0x0038, "memsiz+1_0038");
            _.label(0x0049, "forpnt+0_0049");
            _.label(0x004a, "forpnt+1_004a");
            _.label(0x0053, "four6_0053");
            _.label(0x0054, "jmper+0_0054");
            _.label(0x0056, "jmper+2_0056");
            _.label(0x0061, "facexp_0061");
            _.label(0x0062, "facho+0_0062");
            _.label(0x0063, "facho+1_0063");
            _.label(0x0064, "facho+2_0064");
            _.label(0x0065, "facho+3_0065");
            _.label(0x0066, "facsgn_0066");
            _.label(0x0067, "sgnflg_0067");
            _.label(0x0068, "bits_0068");
            _.label(0x006e, "argsgn_006e");
            _.label(0x006f, "arisgn_006f");
            _.label(0x0070, "facov_0070");
            _.label(0x0071, "fbufpt+0_0071");
            _.label(0x0072, "fbufpt+1_0072");
            _.label(0x0079, "chrgot_0079");
            _.label(0x007a, "txtptr+0_007a");
            _.label(0x007b, "txtptr+1_007b");
            _.label(0x0090, "status_0090");
            _.label(0x0091, "stkey_0091");
            _.label(0x0092, "svxt_0092");
            _.label(0x0093, "verck_0093");
            _.label(0x0094, "c3po_0094");
            _.label(0x0095, "bsour_0095");
            _.label(0x0096, "syno_0096");
            _.label(0x0097, "xsav_0097");
            _.label(0x0098, "ldtnd_0098");
            _.label(0x0099, "dfltn_0099");
            _.label(0x009a, "dflto_009a");
            _.label(0x009b, "prty_009b");
            _.label(0x009c, "dpsw_009c");
            _.label(0x009d, "msgflg_009d");
            _.label(0x009e, "ptr1_009e");
            _.label(0x009f, "ptr2_009f");
            _.label(0x00a0, "time+0_00a0");
            _.label(0x00a1, "time+1_00a1");
            _.label(0x00a2, "time+2_00a2");
            _.label(0x00a3, "tsfcnt_00a3");
            _.label(0x00a4, "tbtcnt_00a4");
            _.label(0x00a5, "cntdn_00a5");
            _.label(0x00a6, "bufpnt_00a6");
            _.label(0x00a7, "inbit_00a7");
            _.label(0x00a8, "bitci_00a8");
            _.label(0x00a9, "rinone_00a9");
            _.label(0x00aa, "ridata_00aa");
            _.label(0x00ab, "riprty_00ab");
            _.label(0x00ac, "sal+0_00ac");
            _.label(0x00ad, "sal+1_00ad");
            _.label(0x00ae, "eal+0_00ae");
            _.label(0x00af, "eal+1_00af");
            _.label(0x00b0, "cmp0+0_00b0");
            _.label(0x00b1, "cmp0+1_00b1");
            _.label(0x00b2, "tape1+0_00b2");
            _.label(0x00b3, "tape1+1_00b3");
            _.label(0x00b4, "bitts_00b4");
            _.label(0x00b5, "nxtbit_00b5");
            _.label(0x00b6, "rodata_00b6");
            _.label(0x00b7, "fnlen_00b7");
            _.label(0x00b8, "la_00b8");
            _.label(0x00b9, "sa_00b9");
            _.label(0x00ba, "fa_00ba");
            _.label(0x00bb, "fnadr+0_00bb");
            _.label(0x00bc, "fnadr+1_00bc");
            _.label(0x00bd, "roprty_00bd");
            _.label(0x00be, "fsblk_00be");
            _.label(0x00bf, "mych_00bf");
            _.label(0x00c0, "cas1_00c0");
            _.label(0x00c1, "stal+0_00c1");
            _.label(0x00c2, "stal+1_00c2");
            _.label(0x00c3, "memuss+0_00c3");
            _.label(0x00c4, "memuss+1_00c4");
            _.label(0x00c5, "lstx_00c5");
            _.label(0x00c6, "ndx_00c6");
            _.label(0x00c7, "rvs_00c7");
            _.label(0x00c8, "indx_00c8");
            _.label(0x00c9, "lxsp+0_00c9");
            _.label(0x00ca, "lxsp+1_00ca");
            _.label(0x00cb, "sfdx_00cb");
            _.label(0x00cc, "blnsw_00cc");
            _.label(0x00cd, "blnct_00cd");
            _.label(0x00ce, "gdbln_00ce");
            _.label(0x00cf, "blnon_00cf");
            _.label(0x00d0, "crsw_00d0");
            _.label(0x00d1, "pnt+0_00d1");
            _.label(0x00d2, "pnt+1_00d2");
            _.label(0x00d3, "pntr_00d3");
            _.label(0x00d4, "qtsw_00d4");
            _.label(0x00d5, "lnmx_00d5");
            _.label(0x00d6, "tblx_00d6");
            _.label(0x00d7, "schar_00d7");
            _.label(0x00d8, "insrt_00d8");
            _.label(0x00d9, "ldtb1+0_00d9");
            _.label(0x00f1, "ldtb1+24_00f1");
            _.label(0x00f3, "user+0_00f3");
            _.label(0x00f4, "user+1_00f4");
            _.label(0x00f5, "keytab+0_00f5");
            _.label(0x00f6, "keytab+1_00f6");
            _.label(0x00f7, "ribuf+0_00f7");
            _.label(0x00f8, "ribuf+1_00f8");
            _.label(0x00f9, "robuf+0_00f9");
            _.label(0x00fa, "robuf+1_00fa");
            _.label(0x0100, "bad+0_0100");
            _.label(0x0101, "bad+1_0101");
            _.label(0x0104, "bad+4_0104");
            _.label(0x01fc, "bstack+189_01fc");
            _.label(0x01fd, "bstack+190_01fd");
            _.label(0x0200, "buf+0_0200");
            _.label(0x0259, "lat+0_0259");
            _.label(0x0263, "fat+0_0263");
            _.label(0x026d, "sat+0_026d");
            _.label(0x0276, "sat+9_0276");
            _.label(0x0277, "keyd+0_0277");
            _.label(0x0278, "keyd+1_0278");
            _.label(0x0281, "memstr+0_0281");
            _.label(0x0282, "memstr+1_0282");
            _.label(0x0283, "memsiz+0_0283");
            _.label(0x0284, "memsiz+1_0284");
            _.label(0x0285, "timout_0285");
            _.label(0x0286, "color_0286");
            _.label(0x0287, "gdcol_0287");
            _.label(0x0288, "hibase_0288");
            _.label(0x0289, "xmax_0289");
            _.label(0x028a, "rptflg_028a");
            _.label(0x028b, "kount_028b");
            _.label(0x028c, "delay_028c");
            _.label(0x028d, "shflag_028d");
            _.label(0x028e, "lstshf_028e");
            _.label(0x028f, "keylog+0_028f");
            _.label(0x0290, "keylog+1_0290");
            _.label(0x0291, "mode_0291");
            _.label(0x0292, "autodn_0292");
            _.label(0x0293, "m51ctr_0293");
            _.label(0x0294, "m51cdr_0294");
            _.label(0x0295, "m51ajb+0_0295");
            _.label(0x0296, "m51ajb+1_0296");
            _.label(0x0297, "rsstat_0297");
            _.label(0x0298, "bitnum_0298");
            _.label(0x0299, "baudof+0_0299");
            _.label(0x029a, "baudof+1_029a");
            _.label(0x029b, "ridbe_029b");
            _.label(0x029c, "ridbs_029c");
            _.label(0x029d, "rodbs_029d");
            _.label(0x029e, "rodbe_029e");
            _.label(0x029f, "irqtmp+0_029f");
            _.label(0x02a0, "irqtmp+1_02a0");
            _.label(0x02a1, "enabl_02a1");
            _.label(0x02a2, "todsns_02a2");
            _.label(0x02a3, "trdtmp_02a3");
            _.label(0x02a4, "td1irq_02a4");
            _.label(0x02a5, "tlnidx_02a5");
            _.label(0x02a6, "tvsflg_02a6");
            _.label(0x0300, "ierror+0_0300");
            _.label(0x030c, "sareg_030c");
            _.label(0x030d, "sxreg_030d");
            _.label(0x030e, "syreg_030e");
            _.label(0x030f, "spreg_030f");
            _.label(0x0310, "usrpok_0310");
            _.label(0x0311, "usradd+0_0311");
            _.label(0x0312, "usradd+1_0312");
            _.label(0x0314, "cinv+0_0314");
            _.label(0x0315, "cinv+1_0315");
            _.label(0x0316, "cbinv+0_0316");
            _.label(0x0318, "nminv+0_0318");
            _.label(0x031a, "iopen+0_031a");
            _.label(0x031c, "iclose+0_031c");
            _.label(0x031e, "ichkin+0_031e");
            _.label(0x0320, "ickout+0_0320");
            _.label(0x0322, "iclrch+0_0322");
            _.label(0x0324, "ibasin+0_0324");
            _.label(0x0326, "ibsout+0_0326");
            _.label(0x0328, "istop+0_0328");
            _.label(0x032a, "igetin+0_032a");
            _.label(0x032c, "iclall+0_032c");
            _.label(0x0330, "iload+0_0330");
            _.label(0x0332, "isave+0_0332");
            _.label(0x8000, "_8000");
            _.label(0x8002, "_8002");
            _.label(0x8003, "_8003");
            _.label(0xcfff, "_cfff");

            // External labels (Memory-mapped IO)
            _.label(0x0000, "d6510_0000");
            _.label(0x0001, "r6510_0001");
            _.label(0xd011, "scroly_d011");
            _.label(0xd012, "raster_d012");
            _.label(0xd016, "scrolx_d016");
            _.label(0xd018, "vmcsb_d018");
            _.label(0xd019, "vicirq_d019");
            _.label(0xd418, "sigvol_d418");
            _.label(0xdc00, "ciapra_dc00");
            _.label(0xdc01, "ciaprb_dc01");
            _.label(0xdc02, "ciddra_dc02");
            _.label(0xdc03, "ciddrb_dc03");
            _.label(0xdc04, "timalo_dc04");
            _.label(0xdc05, "timahi_dc05");
            _.label(0xdc06, "timblo_dc06");
            _.label(0xdc07, "timbhi_dc07");
            _.label(0xdc0d, "ciaicr_dc0d");
            _.label(0xdc0e, "ciacra_dc0e");
            _.label(0xdc0f, "ciacrb_dc0f");
            _.label(0xdd00, "ci2pra_dd00");
            _.label(0xdd01, "ci2prb_dd01");
            _.label(0xdd02, "c2ddra_dd02");
            _.label(0xdd03, "c2ddrb_dd03");
            _.label(0xdd04, "ti2alo_dd04");
            _.label(0xdd05, "ti2ahi_dd05");
            _.label(0xdd06, "ti2blo_dd06");
            _.label(0xdd07, "ti2bhi_dd07");
            _.label(0xdd0d, "ci2icr_dd0d");
            _.label(0xdd0e, "ci2cra_dd0e");
            _.label(0xdd0f, "ci2crb_dd0f");

            // External labels (Basic ROM)
            _.label(0xa000, "restart_a000");
            _.label(0xa002, "_a002");
            _.label(0xa408, "reason_a408");
            _.label(0xa437, "error_a437");
            _.label(0xa43a, "_a43a");
            _.label(0xa474, "ready_a474");
            _.label(0xa52a, "_a52a");
            _.label(0xa533, "linkprg_a533");
            _.label(0xa644, "_a644");
            _.label(0xa663, "_a663");
            _.label(0xa677, "_a677");
            _.label(0xa67a, "_a67a");
            _.label(0xa68e, "stxpt_a68e");
            _.label(0xab1e, "strout_ab1e");
            _.label(0xad8a, "frmnum_ad8a");
            _.label(0xad9e, "frmevl_ad9e");
            _.label(0xaefd, "_aefd");
            _.label(0xaf08, "synerr_af08");
            _.label(0xb6a3, "frestr_b6a3");
            _.label(0xb79e, "_b79e");
            _.label(0xb7f7, "getadr_b7f7");
            _.label(0xb849, "faddh_b849");
            _.label(0xb850, "fsub_b850");
            _.label(0xb853, "fsubt_b853");
            _.label(0xb867, "fadd_b867");
            _.label(0xb8d7, "_b8d7");
            _.label(0xba28, "fmult_ba28");
            _.label(0xbab9, "_bab9");
            _.label(0xbad4, "mldvex_bad4");
            _.label(0xbb07, "fdivf_bb07");
            _.label(0xbb0f, "fdiv_bb0f");
            _.label(0xbba2, "movfm_bba2");
            _.label(0xbbc7, "mov2f_bbc7");
            _.label(0xbbca, "_bbca");
            _.label(0xbbd4, "_bbd4");
            _.label(0xbc0c, "movaf_bc0c");
            _.label(0xbc0f, "movef_bc0f");
            _.label(0xbc2b, "sign_bc2b");
            _.label(0xbccc, "int_bccc");
            _.label(0xbdcd, "linprt_bdcd");
            _.label(0xbfb4, "negop_bfb4");

// ---------------------------------------------------------- start of the kernal ROM
                                                           // EXP() continued
/* e000 */    _`(exp_e000`;  STA.zpg ("jmper+2_0056");     // save FAC2 rounding byte
/* e002 */                   JSR.abs ("movef_bc0f");       // copy FAC1 to FAC2
/* e005 */                   LDA.zpg ("facexp_0061");      // get FAC1 exponent
/* e007 */                   CMP.imm (0x88);               // compare with EXP limit (256d)
/* e009 */                   BCC.rel ("_e00e");            // branch if less
/* e00b */        _`_e00b`;  JSR.abs ("mldvex_bad4");      // handle overflow and underflow
/* e00e */        _`_e00e`;  JSR.abs ("int_bccc");         // perform INT()
/* e011 */                   LDA.zpg ("charac_0007");      // get mantissa 4 from INT()
/* e013 */                   CLC.imp ();                   // clear carry for add
/* e014 */                   ADC.imm (0x81);               // normalise +1
/* e016 */                   BEQ.rel ("_e00b");            // if $00 result has overflowed so go handle it
/* e018 */                   SEC.imp ();                   // set carry for subtract
/* e019 */                   SBC.imm (0x01);               // exponent now correct
/* e01b */                   PHA.imp ();                   // save FAC2 exponent
                                                           // swap FAC1 and FAC2
/* e01c */                   LDX.imm (0x05);               // 4 bytes to do
/* e01e */        _`_e01e`;  LDA.zpx (0x69);               // get FAC2,X
/* e020 */                   LDY.zpx (0x61);               // get FAC1,X
/* e022 */                   STA.zpx (0x61);               // save FAC1,X
/* e024 */                   STY.zpx (0x69);               // save FAC2,X
/* e026 */                   DEX.imp ();                   // decrement count/index
/* e027 */                   BPL.rel ("_e01e");            // loop if not all done
/* e029 */                   LDA.zpg ("jmper+2_0056");     // get FAC2 rounding byte
/* e02b */                   STA.zpg ("facov_0070");       // save as FAC1 rounding byte
/* e02d */                   JSR.abs ("fsubt_b853");       // perform subtraction, FAC2 from FAC1
/* e030 */                   JSR.abs ("negop_bfb4");       // do - FAC1
/* e033 */                   LDA.imm (0xc4);               // set counter pointer low byte
/* e035 */                   LDY.imm (0xbf);               // set counter pointer high byte
/* e037 */                   JSR.abs ("poly2_e059");       // go do series evaluation
/* e03a */                   LDA.imm (0x00);               // clear A
/* e03c */                   STA.zpg ("arisgn_006f");      // clear sign compare (FAC1 EOR FAC2)
/* e03e */                   PLA.imp ();                   // get saved FAC2 exponent
/* e03f */                   JSR.abs ("_bab9");            // test and adjust accumulators
/* e042 */                   RTS.imp ();
                                                           // ^2 then series evaluation
/* e043 */   _`polyx_e043`;  STA.zpg ("fbufpt+0_0071");    // save count pointer low byte
/* e045 */                   STY.zpg ("fbufpt+1_0072");    // save count pointer high byte
/* e047 */                   JSR.abs ("_bbca");            // pack FAC1 into $57
/* e04a */                   LDA.imm (0x57);               // set pointer low byte (Y already $00)
/* e04c */                   JSR.abs ("fmult_ba28");       // do convert AY, FCA1*(AY)
/* e04f */                   JSR.abs ("_e05d");            // go do series evaluation
/* e052 */                   LDA.imm (0x57);               // pointer to original # low byte
/* e054 */                   LDY.imm (0x00);               // pointer to original # high byte
/* e056 */                   JMP.abs ("fmult_ba28");       // do convert AY, FCA1*(AY)
                                                           // do series evaluation
/* e059 */   _`poly2_e059`;  STA.zpg ("fbufpt+0_0071");    // save count pointer low byte
/* e05b */                   STY.zpg ("fbufpt+1_0072");    // save count pointer high byte
                                                           // do series evaluation
/* e05d */        _`_e05d`;  JSR.abs ("mov2f_bbc7");       // pack FAC1 into $5C
/* e060 */                   LDA.iny ("fbufpt+0_0071");    // get constants count
/* e062 */                   STA.zpg ("sgnflg_0067");      // save constants count
/* e064 */                   LDY.zpg ("fbufpt+0_0071");    // get count pointer low byte
/* e066 */                   INY.imp ();                   // increment it (now constants pointer)
/* e067 */                   TYA.imp ();                   // copy it
/* e068 */                   BNE.rel ("_e06c");            // skip next if no overflow
/* e06a */                   INC.zpg ("fbufpt+1_0072");    // else increment high byte
/* e06c */        _`_e06c`;  STA.zpg ("fbufpt+0_0071");    // save low byte
/* e06e */                   LDY.zpg ("fbufpt+1_0072");    // get high byte
/* e070 */        _`_e070`;  JSR.abs ("fmult_ba28");       // do convert AY, FCA1*(AY)
/* e073 */                   LDA.zpg ("fbufpt+0_0071");    // get constants pointer low byte
/* e075 */                   LDY.zpg ("fbufpt+1_0072");    // get constants pointer high byte
/* e077 */                   CLC.imp ();                   // clear carry for add
/* e078 */                   ADC.imm (0x05);               // +5 to low pointer (5 bytes per constant)
/* e07a */                   BCC.rel ("_e07d");            // skip next if no overflow
/* e07c */                   INY.imp ();                   // increment high byte
/* e07d */        _`_e07d`;  STA.zpg ("fbufpt+0_0071");    // save pointer low byte
/* e07f */                   STY.zpg ("fbufpt+1_0072");    // save pointer high byte
/* e081 */                   JSR.abs ("fadd_b867");        // add (AY) to FAC1
/* e084 */                   LDA.imm (0x5c);               // set pointer low byte to partial
/* e086 */                   LDY.imm (0x00);               // set pointer high byte to partial
/* e088 */                   DEC.zpg ("sgnflg_0067");      // decrement constants count
/* e08a */                   BNE.rel ("_e070");            // loop until all done
/* e08c */                   RTS.imp ();

// ------------------------------------------------------- // RND values
                                                           // 11879546            multiplier
/* e08d */   _`rmulc_e08d`;  _.bytes(0x98, 0x35, 0x44, 0x7a, 0x00);
                                                           // 3.927677739E-8      offset
/* e092 */   _`raddc_e092`;  _.bytes(0x68, 0x28, 0xb1, 0x46, 0x00);

// ------------------------------------------------------- // perform RND()
/* e097 */     _`rnd_e097`;  JSR.abs ("sign_bc2b");        // get FAC1 sign
                                                           // return A = $FF -ve, A = $01 +ve
/* e09a */                   BMI.rel ("_e0d3");            // if n<0 copy byte swapped FAC1 into RND() seed
/* e09c */                   BNE.rel ("_e0be");            // if n>0 get next number in RND() sequence
                                                           // else n=0 so get the RND() number from VIA 1 timers
/* e09e */                   JSR.abs ("iobase_fff3");      // return base address of I/O devices
/* e0a1 */                   STX.zpg ("index+0_0022");     // save pointer low byte
/* e0a3 */                   STY.zpg ("index+1_0023");     // save pointer high byte
/* e0a5 */                   LDY.imm (0x04);               // set index to T1 low byte
/* e0a7 */                   LDA.iny ("index+0_0022");     // get T1 low byte
/* e0a9 */                   STA.zpg ("facho+0_0062");     // save FAC1 mantissa 1
/* e0ab */                   INY.imp ();                   // increment index
/* e0ac */                   LDA.iny ("index+0_0022");     // get T1 high byte
/* e0ae */                   STA.zpg ("facho+2_0064");     // save FAC1 mantissa 3
/* e0b0 */                   LDY.imm (0x08);               // set index to T2 low byte
/* e0b2 */                   LDA.iny ("index+0_0022");     // get T2 low byte
/* e0b4 */                   STA.zpg ("facho+1_0063");     // save FAC1 mantissa 2
/* e0b6 */                   INY.imp ();                   // increment index
/* e0b7 */                   LDA.iny ("index+0_0022");     // get T2 high byte
/* e0b9 */                   STA.zpg ("facho+3_0065");     // save FAC1 mantissa 4
/* e0bb */                   JMP.abs ("_e0e3");            // set exponent and exit
/* e0be */        _`_e0be`;  LDA.imm (0x8b);               // set seed pointer low address
/* e0c0 */                   LDY.imm (0x00);               // set seed pointer high address
/* e0c2 */                   JSR.abs ("movfm_bba2");       // unpack memory (AY) into FAC1
/* e0c5 */                   LDA.imm (0x8d);               // set 11879546 pointer low byte
/* e0c7 */                   LDY.imm (0xe0);               // set 11879546 pointer high byte
/* e0c9 */                   JSR.abs ("fmult_ba28");       // do convert AY, FCA1*(AY)
/* e0cc */                   LDA.imm (0x92);               // set 3.927677739E-8 pointer low byte
/* e0ce */                   LDY.imm (0xe0);               // set 3.927677739E-8 pointer high byte
/* e0d0 */                   JSR.abs ("fadd_b867");        // add (AY) to FAC1
/* e0d3 */        _`_e0d3`;  LDX.zpg ("facho+3_0065");     // get FAC1 mantissa 4
/* e0d5 */                   LDA.zpg ("facho+0_0062");     // get FAC1 mantissa 1
/* e0d7 */                   STA.zpg ("facho+3_0065");     // save FAC1 mantissa 4
/* e0d9 */                   STX.zpg ("facho+0_0062");     // save FAC1 mantissa 1
/* e0db */                   LDX.zpg ("facho+1_0063");     // get FAC1 mantissa 2
/* e0dd */                   LDA.zpg ("facho+2_0064");     // get FAC1 mantissa 3
/* e0df */                   STA.zpg ("facho+1_0063");     // save FAC1 mantissa 2
/* e0e1 */                   STX.zpg ("facho+2_0064");     // save FAC1 mantissa 3
/* e0e3 */        _`_e0e3`;  LDA.imm (0x00);               // clear byte
/* e0e5 */                   STA.zpg ("facsgn_0066");      // clear FAC1 sign (always +ve)
/* e0e7 */                   LDA.zpg ("facexp_0061");      // get FAC1 exponent
/* e0e9 */                   STA.zpg ("facov_0070");       // save FAC1 rounding byte
/* e0eb */                   LDA.imm (0x80);               // set exponent = $80
/* e0ed */                   STA.zpg ("facexp_0061");      // save FAC1 exponent
/* e0ef */                   JSR.abs ("_b8d7");            // normalise FAC1
/* e0f2 */                   LDX.imm (0x8b);               // set seed pointer low address
/* e0f4 */                   LDY.imm (0x00);               // set seed pointer high address

// ------------------------------------------------------- // pack FAC1 into (XY)
/* e0f6 */        _`_e0f6`;  JMP.abs ("_bbd4");            // pack FAC1 into (XY)

// ------------------------------------------------------- // handle BASIC I/O error
/* e0f9 */  _`bioerr_e0f9`;  CMP.imm (0xf0);               // compare error with $F0
/* e0fb */                   BNE.rel ("_e104");            // branch if not $F0
/* e0fd */                   STY.zpg ("memsiz+1_0038");    // set end of memory high byte
/* e0ff */                   STX.zpg ("memsiz+0_0037");    // set end of memory low byte
/* e101 */                   JMP.abs ("_a663");            // clear from start to end and return
                                                           // error was not $F0
/* e104 */        _`_e104`;  TAX.imp ();                   // copy error #
/* e105 */                   BNE.rel ("_e109");            // branch if not $00
/* e107 */                   LDX.imm (0x1e);               // else error $1E, break error
/* e109 */        _`_e109`;  JMP.abs ("error_a437");       // do error #X then warm start

// ------------------------------------------------------- // output character to channel with error check
/* e10c */  _`bchout_e10c`;  JSR.abs ("chrout_ffd2");      // output character to channel
/* e10f */                   BCS.rel ("bioerr_e0f9");      // if error go handle BASIC I/O error
/* e111 */                   RTS.imp ();

// ------------------------------------------------------- // input character from channel with error check
/* e112 */   _`bchin_e112`;  JSR.abs ("chrin_ffcf");       // input character from channel
/* e115 */                   BCS.rel ("bioerr_e0f9");      // if error go handle BASIC I/O error
/* e117 */                   RTS.imp ();

// ------------------------------------------------------- // open channel for output with error check
/* e118 */  _`bckout_e118`;  JSR.abs ("_e4ad");            // open channel for output
/* e11b */                   BCS.rel ("bioerr_e0f9");      // if error go handle BASIC I/O error
/* e11d */                   RTS.imp ();

// ------------------------------------------------------- // open channel for input with error check
/* e11e */   _`bckin_e11e`;  JSR.abs ("chkin_ffc6");       // open channel for input
/* e121 */                   BCS.rel ("bioerr_e0f9");      // if error go handle BASIC I/O error
/* e123 */                   RTS.imp ();

// ------------------------------------------------------- // get character from input device with error check
/* e124 */  _`bgetin_e124`;  JSR.abs ("getin_ffe4");       // get character from input device
/* e127 */                   BCS.rel ("bioerr_e0f9");      // if error go handle BASIC I/O error
/* e129 */                   RTS.imp ();

// ------------------------------------------------------- // perform SYS
/* e12a */     _`sys_e12a`;  JSR.abs ("frmnum_ad8a");      // evaluate expression and check is numeric, else do
                                                           // type mismatch
/* e12d */                   JSR.abs ("getadr_b7f7");      // convert FAC_1 to integer in temporary integer
/* e130 */                   LDA.imm (0xe1);               // get return address high byte
/* e132 */                   PHA.imp ();                   // push as return address
/* e133 */                   LDA.imm (0x46);               // get return address low byte
/* e135 */                   PHA.imp ();                   // push as return address
/* e136 */                   LDA.abs ("spreg_030f");       // get saved status register
/* e139 */                   PHA.imp ();                   // put on stack
/* e13a */                   LDA.abs ("sareg_030c");       // get saved A
/* e13d */                   LDX.abs ("sxreg_030d");       // get saved X
/* e140 */                   LDY.abs ("syreg_030e");       // get saved Y
/* e143 */                   PLP.imp ();                   // pull processor status
/* e144 */                   JMP.ind ("linnum+0_0014");    // call SYS address
                                                           // tail end of SYS code
/* e147 */                   PHP.imp ();                   // save status
/* e148 */                   STA.abs ("sareg_030c");       // save returned A
/* e14b */                   STX.abs ("sxreg_030d");       // save returned X
/* e14e */                   STY.abs ("syreg_030e");       // save returned Y
/* e151 */                   PLA.imp ();                   // restore saved status
/* e152 */                   STA.abs ("spreg_030f");       // save status
/* e155 */                   RTS.imp ();

// ------------------------------------------------------- // perform SAVE
/* e156 */   _`savet_e156`;  JSR.abs ("slpara_e1d4");      // get parameters for LOAD/SAVE
/* e159 */                   LDX.zpg ("vartab+0_002d");    // get start of variables low byte
/* e15b */                   LDY.zpg ("vartab+1_002e");    // get start of variables high byte
/* e15d */                   LDA.imm (0x2b);               // index to start of program memory
/* e15f */                   JSR.abs ("save_ffd8");        // save RAM to device, A = index to start address, XY = end
                                                           // address low/high
/* e162 */                   BCS.rel ("bioerr_e0f9");      // if error go handle BASIC I/O error
/* e164 */                   RTS.imp ();

// ------------------------------------------------------- // perform VERIFY
/* e165 */  _`verfyt_e165`;  LDA.imm (0x01);               // flag verify
/* e167 */                   _.bytes(0x2c);                // makes next line BIT $00A9

// ------------------------------------------------------- // perform LOAD
/* e168 */                   LDA.imm (0x00);               // flag load
/* e16a */                   STA.zpg ("verck_000a");       // set load/verify flag
/* e16c */                   JSR.abs ("slpara_e1d4");      // get parameters for LOAD/SAVE
/* e16f */                   LDA.zpg ("verck_000a");       // get load/verify flag
/* e171 */                   LDX.zpg ("txttab+0_002b");    // get start of memory low byte
/* e173 */                   LDY.zpg ("txttab+1_002c");    // get start of memory high byte
/* e175 */                   JSR.abs ("load_ffd5");        // load RAM from a device
/* e178 */                   BCS.rel ("_e1d1");            // if error go handle BASIC I/O error
/* e17a */                   LDA.zpg ("verck_000a");       // get load/verify flag
/* e17c */                   BEQ.rel ("_e195");            // branch if load
/* e17e */                   LDX.imm (0x1c);               // error $1C, verify error
/* e180 */                   JSR.abs ("readst_ffb7");      // read I/O status word
/* e183 */                   AND.imm (0x10);               // mask for tape read error
/* e185 */                   BNE.rel ("_e19e");            // branch if no read error
/* e187 */                   LDA.zpg ("txtptr+0_007a");    // get the BASIC execute pointer low byte
                                                           // is this correct ?? won't this mean the "OK" prompt
                                                           // when doing a load from within a program ?
/* e189 */                   CMP.imm (0x02);
/* e18b */                   BEQ.rel ("_e194");            // if ?? skip "OK" prompt
/* e18d */                   LDA.imm (0x64);               // set "OK" pointer low byte
/* e18f */                   LDY.imm (0xa3);               // set "OK" pointer high byte
/* e191 */                   JMP.abs ("strout_ab1e");      // print null terminated string
/* e194 */        _`_e194`;  RTS.imp ();

// ------------------------------------------------------- // do READY return to BASIC
/* e195 */        _`_e195`;  JSR.abs ("readst_ffb7");      // read I/O status word
/* e198 */                   AND.imm (0xbf);               // mask x0xx xxxx, clear read error
/* e19a */                   BEQ.rel ("_e1a1");            // branch if no errors
/* e19c */                   LDX.imm (0x1d);               // error $1D, load error
/* e19e */        _`_e19e`;  JMP.abs ("error_a437");       // do error #X then warm start
/* e1a1 */        _`_e1a1`;  LDA.zpg ("txtptr+1_007b");    // get BASIC execute pointer high byte
/* e1a3 */                   CMP.imm (0x02);               // compare with $02xx
/* e1a5 */                   BNE.rel ("_e1b5");            // branch if not immediate mode
/* e1a7 */                   STX.zpg ("vartab+0_002d");    // set start of variables low byte
/* e1a9 */                   STY.zpg ("vartab+1_002e");    // set start of variables high byte
/* e1ab */                   LDA.imm (0x76);               // set "READY." pointer low byte
/* e1ad */                   LDY.imm (0xa3);               // set "READY." pointer high byte
/* e1af */                   JSR.abs ("strout_ab1e");      // print null terminated string
/* e1b2 */                   JMP.abs ("_a52a");            // reset execution, clear variables, flush stack,
                                                           // rebuild BASIC chain and do warm start
/* e1b5 */        _`_e1b5`;  JSR.abs ("stxpt_a68e");       // set BASIC execute pointer to start of memory - 1
/* e1b8 */                   JSR.abs ("linkprg_a533");     // rebuild BASIC line chaining
/* e1bb */                   JMP.abs ("_a677");            // rebuild BASIC line chaining, do RESTORE and return

// ------------------------------------------------------- // perform OPEN
/* e1be */   _`opent_e1be`;  JSR.abs ("ocpara_e219");      // get parameters for OPEN/CLOSE
/* e1c1 */                   JSR.abs ("open_ffc0");        // open a logical file
/* e1c4 */                   BCS.rel ("_e1d1");            // branch if error
/* e1c6 */                   RTS.imp ();

// ------------------------------------------------------- // perform CLOSE
/* e1c7 */  _`closet_e1c7`;  JSR.abs ("ocpara_e219");      // get parameters for OPEN/CLOSE
/* e1ca */                   LDA.zpg ("forpnt+0_0049");    // get logical file number
/* e1cc */                   JSR.abs ("close_ffc3");       // close a specified logical file
/* e1cf */                   BCC.rel ("_e194");            // exit if no error
/* e1d1 */        _`_e1d1`;  JMP.abs ("bioerr_e0f9");      // go handle BASIC I/O error

// ------------------------------------------------------- // get parameters for LOAD/SAVE
/* e1d4 */  _`slpara_e1d4`;  LDA.imm (0x00);               // clear file name length
/* e1d6 */                   JSR.abs ("setnam_ffbd");      // clear the filename
/* e1d9 */                   LDX.imm (0x01);               // set default device number, cassette
/* e1db */                   LDY.imm (0x00);               // set default command
/* e1dd */                   JSR.abs ("setlfs_ffba");      // set logical, first and second addresses
/* e1e0 */                   JSR.abs ("deflt_e206");       // exit function if [EOT] or ":"
/* e1e3 */                   JSR.abs ("_e257");            // set filename
/* e1e6 */                   JSR.abs ("deflt_e206");       // exit function if [EOT] or ":"
/* e1e9 */                   JSR.abs ("combyt_e200");      // scan and get byte, else do syntax error then warm start
/* e1ec */                   LDY.imm (0x00);               // clear command
/* e1ee */                   STX.zpg ("forpnt+0_0049");    // save device number
/* e1f0 */                   JSR.abs ("setlfs_ffba");      // set logical, first and second addresses
/* e1f3 */                   JSR.abs ("deflt_e206");       // exit function if [EOT] or ":"
/* e1f6 */                   JSR.abs ("combyt_e200");      // scan and get byte, else do syntax error then warm start
/* e1f9 */                   TXA.imp ();                   // copy command to A
/* e1fa */                   TAY.imp ();                   // copy command to Y
/* e1fb */                   LDX.zpg ("forpnt+0_0049");    // get device number back
/* e1fd */                   JMP.abs ("setlfs_ffba");      // set logical, first and second addresses and return

// ------------------------------------------------------- // scan and get byte, else do syntax error then warm start
/* e200 */  _`combyt_e200`;  JSR.abs ("cmmerr_e20e");      // scan for ",byte", else do syntax error then warm start
/* e203 */                   JMP.abs ("_b79e");            // get byte parameter and return
                                                           // exit function if [EOT] or ":"
/* e206 */   _`deflt_e206`;  JSR.abs ("chrgot_0079");      // scan memory
/* e209 */                   BNE.rel ("_e20d");            // branch if not [EOL] or ":"
/* e20b */                   PLA.imp ();                   // dump return address low byte
/* e20c */                   PLA.imp ();                   // dump return address high byte
/* e20d */        _`_e20d`;  RTS.imp ();

// ------------------------------------------------------- // scan for ",valid byte", else do syntax error then warm start
/* e20e */  _`cmmerr_e20e`;  JSR.abs ("_aefd");            // scan for ",", else do syntax error then warm start

// ------------------------------------------------------- // scan for valid byte, not [EOL] or ":", else do syntax error then warm start
/* e211 */        _`_e211`;  JSR.abs ("chrgot_0079");      // scan memory
/* e214 */                   BNE.rel ("_e20d");            // exit if following byte
/* e216 */                   JMP.abs ("synerr_af08");      // else do syntax error then warm start

// ------------------------------------------------------- // get parameters for OPEN/CLOSE
/* e219 */  _`ocpara_e219`;  LDA.imm (0x00);               // clear the filename length
/* e21b */                   JSR.abs ("setnam_ffbd");      // clear the filename
/* e21e */                   JSR.abs ("_e211");            // scan for valid byte, else do syntax error then warm start
/* e221 */                   JSR.abs ("_b79e");            // get byte parameter, logical file number
/* e224 */                   STX.zpg ("forpnt+0_0049");    // save logical file number
/* e226 */                   TXA.imp ();                   // copy logical file number to A
/* e227 */                   LDX.imm (0x01);               // set default device number, cassette
/* e229 */                   LDY.imm (0x00);               // set default command
/* e22b */                   JSR.abs ("setlfs_ffba");      // set logical, first and second addresses
/* e22e */                   JSR.abs ("deflt_e206");       // exit function if [EOT] or ":"
/* e231 */                   JSR.abs ("combyt_e200");      // scan and get byte, else do syntax error then warm start
/* e234 */                   STX.zpg ("forpnt+1_004a");    // save device number
/* e236 */                   LDY.imm (0x00);               // clear command
/* e238 */                   LDA.zpg ("forpnt+0_0049");    // get logical file number
/* e23a */                   CPX.imm (0x03);               // compare device number with screen
/* e23c */                   BCC.rel ("_e23f");            // branch if less than screen
/* e23e */                   DEY.imp ();                   // else decrement command
/* e23f */        _`_e23f`;  JSR.abs ("setlfs_ffba");      // set logical, first and second addresses
/* e242 */                   JSR.abs ("deflt_e206");       // exit function if [EOT] or ":"
/* e245 */                   JSR.abs ("combyt_e200");      // scan and get byte, else do syntax error then warm start
/* e248 */                   TXA.imp ();                   // copy command to A
/* e249 */                   TAY.imp ();                   // copy command to Y
/* e24a */                   LDX.zpg ("forpnt+1_004a");    // get device number
/* e24c */                   LDA.zpg ("forpnt+0_0049");    // get logical file number
/* e24e */                   JSR.abs ("setlfs_ffba");      // set logical, first and second addresses
/* e251 */                   JSR.abs ("deflt_e206");       // exit function if [EOT] or ":"
/* e254 */                   JSR.abs ("cmmerr_e20e");      // scan for ",byte", else do syntax error then warm start

// ------------------------------------------------------- // set filename
/* e257 */        _`_e257`;  JSR.abs ("frmevl_ad9e");      // evaluate expression
/* e25a */                   JSR.abs ("frestr_b6a3");      // evaluate string
/* e25d */                   LDX.zpg ("index+0_0022");     // get string pointer low byte
/* e25f */                   LDY.zpg ("index+1_0023");     // get string pointer high byte
/* e261 */                   JMP.abs ("setnam_ffbd");      // set the filename and return

// ------------------------------------------------------- // perform COS()
/* e264 */     _`cos_e264`;  LDA.imm (0xe0);               // set pi/2 pointer low byte
/* e266 */                   LDY.imm (0xe2);               // set pi/2 pointer high byte
/* e268 */                   JSR.abs ("fadd_b867");        // add (AY) to FAC1

// ------------------------------------------------------- // perform SIN()
/* e26b */     _`sin_e26b`;  JSR.abs ("movaf_bc0c");       // round and copy FAC1 to FAC2
/* e26e */                   LDA.imm (0xe5);               // set 2*pi pointer low byte
/* e270 */                   LDY.imm (0xe2);               // set 2*pi pointer high byte
/* e272 */                   LDX.zpg ("argsgn_006e");      // get FAC2 sign (b7)
/* e274 */                   JSR.abs ("fdivf_bb07");       // divide by (AY) (X=sign)
/* e277 */                   JSR.abs ("movaf_bc0c");       // round and copy FAC1 to FAC2
/* e27a */                   JSR.abs ("int_bccc");         // perform INT()
/* e27d */                   LDA.imm (0x00);               // clear byte
/* e27f */                   STA.zpg ("arisgn_006f");      // clear sign compare (FAC1 EOR FAC2)
/* e281 */                   JSR.abs ("fsubt_b853");       // perform subtraction, FAC2 from FAC1
/* e284 */                   LDA.imm (0xea);               // set 0.25 pointer low byte
/* e286 */                   LDY.imm (0xe2);               // set 0.25 pointer high byte
/* e288 */                   JSR.abs ("fsub_b850");        // perform subtraction, FAC1 from (AY)
/* e28b */                   LDA.zpg ("facsgn_0066");      // get FAC1 sign (b7)
/* e28d */                   PHA.imp ();                   // save FAC1 sign
/* e28e */                   BPL.rel ("_e29d");            // branch if +ve
                                                           // FAC1 sign was -ve
/* e290 */                   JSR.abs ("faddh_b849");       // add 0.5 to FAC1 (round FAC1)
/* e293 */                   LDA.zpg ("facsgn_0066");      // get FAC1 sign (b7)
/* e295 */                   BMI.rel ("_e2a0");            // branch if -ve
/* e297 */                   LDA.zpg ("tansgn_0012");      // get the comparison evaluation flag
/* e299 */                   EOR.imm (0xff);               // toggle flag
/* e29b */                   STA.zpg ("tansgn_0012");      // save the comparison evaluation flag
/* e29d */        _`_e29d`;  JSR.abs ("negop_bfb4");       // do - FAC1
/* e2a0 */        _`_e2a0`;  LDA.imm (0xea);               // set 0.25 pointer low byte
/* e2a2 */                   LDY.imm (0xe2);               // set 0.25 pointer high byte
/* e2a4 */                   JSR.abs ("fadd_b867");        // add (AY) to FAC1
/* e2a7 */                   PLA.imp ();                   // restore FAC1 sign
/* e2a8 */                   BPL.rel ("_e2ad");            // branch if was +ve
                                                           // else correct FAC1
/* e2aa */                   JSR.abs ("negop_bfb4");       // do - FAC1
/* e2ad */        _`_e2ad`;  LDA.imm (0xef);               // set pointer low byte to counter
/* e2af */                   LDY.imm (0xe2);               // set pointer high byte to counter
/* e2b1 */                   JMP.abs ("polyx_e043");       // ^2 then series evaluation and return

// ------------------------------------------------------- // perform TAN()
/* e2b4 */     _`tan_e2b4`;  JSR.abs ("_bbca");            // pack FAC1 into $57
/* e2b7 */                   LDA.imm (0x00);               // clear A
/* e2b9 */                   STA.zpg ("tansgn_0012");      // clear the comparison evaluation flag
/* e2bb */                   JSR.abs ("sin_e26b");         // perform SIN()
/* e2be */                   LDX.imm (0x4e);               // set sin(n) pointer low byte
/* e2c0 */                   LDY.imm (0x00);               // set sin(n) pointer high byte
/* e2c2 */                   JSR.abs ("_e0f6");            // pack FAC1 into (XY)
/* e2c5 */                   LDA.imm (0x57);               // set n pointer low byte
/* e2c7 */                   LDY.imm (0x00);               // set n pointer high byte
/* e2c9 */                   JSR.abs ("movfm_bba2");       // unpack memory (AY) into FAC1
/* e2cc */                   LDA.imm (0x00);               // clear byte
/* e2ce */                   STA.zpg ("facsgn_0066");      // clear FAC1 sign (b7)
/* e2d0 */                   LDA.zpg ("tansgn_0012");      // get the comparison evaluation flag
/* e2d2 */                   JSR.abs ("_e2dc");            // save flag and go do series evaluation
/* e2d5 */                   LDA.imm (0x4e);               // set sin(n) pointer low byte
/* e2d7 */                   LDY.imm (0x00);               // set sin(n) pointer high byte
/* e2d9 */                   JMP.abs ("fdiv_bb0f");        // convert AY and do (AY)/FAC1

// ------------------------------------------------------- // save comparison flag and do series evaluation
/* e2dc */        _`_e2dc`;  PHA.imp ();                   // save comparison flag
/* e2dd */                   JMP.abs ("_e29d");            // add 0.25, ^2 then series evaluation

// ------------------------------------------------------- // constants and series for SIN/COS(n)
                                                           // 1.570796371, pi/2, as floating number
/* e2e0 */     _`pi2_e2e0`;  _.bytes(0x81, 0x49, 0x0f, 0xda, 0xa2);
                                                           // 6.28319, 2*pi, as floating number
/* e2e5 */   _`twopi_e2e5`;  _.bytes(0x83, 0x49, 0x0f, 0xda, 0xa2);
                                                           // 0.25
/* e2ea */     _`fr4_e2ea`;  _.bytes(0x7f, 0x00, 0x00, 0x00, 0x00);
/* e2ef */  _`sincon_e2ef`;  _.bytes(0x05);                // series counter
                                                           // -14.3813907
/* e2f0 */                   _.bytes(0x84, 0xe6, 0x1a, 0x2d, 0x1b);
                                                           //  42.0077971
/* e2f5 */                   _.bytes(0x86, 0x28, 0x07, 0xfb, 0xf8);
                                                           // -76.7041703
/* e2fa */                   _.bytes(0x87, 0x99, 0x68, 0x89, 0x01);
                                                           //  81.6052237
/* e2ff */                   _.bytes(0x87, 0x23, 0x35, 0xdf, 0xe1);
                                                           // -41.3147021
/* e304 */                   _.bytes(0x86, 0xa5, 0x5d, 0xe7, 0x28);
                                                           //   6.28318531   2*pi
/* e309 */                   _.bytes(0x83, 0x49, 0x0f, 0xda, 0xa2);

// ------------------------------------------------------- // perform ATN()
/* e30e */     _`atn_e30e`;  LDA.zpg ("facsgn_0066");      // get FAC1 sign (b7)
/* e310 */                   PHA.imp ();                   // save sign
/* e311 */                   BPL.rel ("_e316");            // branch if +ve
/* e313 */                   JSR.abs ("negop_bfb4");       // else do - FAC1
/* e316 */        _`_e316`;  LDA.zpg ("facexp_0061");      // get FAC1 exponent
/* e318 */                   PHA.imp ();                   // push exponent
/* e319 */                   CMP.imm (0x81);               // compare with 1
/* e31b */                   BCC.rel ("_e324");            // branch if FAC1 < 1
/* e31d */                   LDA.imm (0xbc);               // pointer to 1 low byte
/* e31f */                   LDY.imm (0xb9);               // pointer to 1 high byte
/* e321 */                   JSR.abs ("fdiv_bb0f");        // convert AY and do (AY)/FAC1
/* e324 */        _`_e324`;  LDA.imm (0x3e);               // pointer to series low byte
/* e326 */                   LDY.imm (0xe3);               // pointer to series high byte
/* e328 */                   JSR.abs ("polyx_e043");       // ^2 then series evaluation
/* e32b */                   PLA.imp ();                   // restore old FAC1 exponent
/* e32c */                   CMP.imm (0x81);               // compare with 1
/* e32e */                   BCC.rel ("_e337");            // branch if FAC1 < 1
/* e330 */                   LDA.imm (0xe0);               // pointer to (pi/2) low byte
/* e332 */                   LDY.imm (0xe2);               // pointer to (pi/2) low byte
/* e334 */                   JSR.abs ("fsub_b850");        // perform subtraction, FAC1 from (AY)
/* e337 */        _`_e337`;  PLA.imp ();                   // restore FAC1 sign
/* e338 */                   BPL.rel ("_e33d");            // exit if was +ve
/* e33a */                   JMP.abs ("negop_bfb4");       // else do - FAC1 and return
/* e33d */        _`_e33d`;  RTS.imp ();

// ------------------------------------------------------- // series for ATN(n)
/* e33e */  _`atncon_e33e`;  _.bytes(0x0b);                // series counter
                                                           // -6.84793912E-04
/* e33f */                   _.bytes(0x76, 0xb3, 0x83, 0xbd, 0xd3);
                                                           //  4.85094216E-03
/* e344 */                   _.bytes(0x79, 0x1e, 0xf4, 0xa6, 0xf5);
                                                           //  -.0161117015
/* e349 */                   _.bytes(0x7b, 0x83, 0xfc, 0xb0, 0x10);
                                                           //   .034209638
/* e34e */                   _.bytes(0x7c, 0x0c, 0x1f, 0x67, 0xca);
                                                           //  -.054279133
/* e353 */                   _.bytes(0x7c, 0xde, 0x53, 0xcb, 0xc1);
                                                           //   .0724571965
/* e358 */                   _.bytes(0x7d, 0x14, 0x64, 0x70, 0x4c);
                                                           //  -.0898019185
/* e35d */                   _.bytes(0x7d, 0xb7, 0xea, 0x51, 0x7a);
                                                           //   .110932413
/* e362 */                   _.bytes(0x7d, 0x63, 0x30, 0x88, 0x7e);
                                                           //  -.142839808
/* e367 */                   _.bytes(0x7e, 0x92, 0x44, 0x99, 0x3a);
                                                           //   .19999912
/* e36c */                   _.bytes(0x7e, 0x4c, 0xcc, 0x91, 0xc7);
                                                           //  -.333333316
/* e371 */                   _.bytes(0x7f, 0xaa, 0xaa, 0xaa, 0x13);
                                                           //  1
/* e376 */                   _.bytes(0x81, 0x00, 0x00, 0x00, 0x00);

// ------------------------------------------------------- // BASIC warm start entry point
/* e37b */  _`bassft_e37b`;  JSR.abs ("clrchn_ffcc");      // close input and output channels
/* e37e */                   LDA.imm (0x00);               // clear A
/* e380 */                   STA.zpg ("channl_0013");      // set current I/O channel, flag default
/* e382 */                   JSR.abs ("_a67a");            // flush BASIC stack and clear continue pointer
/* e385 */                   CLI.imp ();                   // enable the interrupts
/* e386 */        _`_e386`;  LDX.imm (0x80);               // set -ve error, just do warm start
/* e388 */                   JMP.ind ("ierror+0_0300");    // go handle error message, normally $E38B
/* e38b */                   TXA.imp ();                   // copy the error number
/* e38c */                   BMI.rel ("_e391");            // if -ve go do warm start
/* e38e */                   JMP.abs ("_a43a");            // else do error #X then warm start
/* e391 */        _`_e391`;  JMP.abs ("ready_a474");       // do warm start

// ------------------------------------------------------- // BASIC cold start entry point
/* e394 */    _`init_e394`;  JSR.abs ("initv_e453");       // initialise the BASIC vector table
/* e397 */                   JSR.abs ("initcz_e3bf");      // initialise the BASIC RAM locations
/* e39a */                   JSR.abs ("initms_e422");      // print the start up message and initialise the memory
                                                           // pointers
                                                           // not ok ??
/* e39d */                   LDX.imm (0xfb);               // value for start stack
/* e39f */                   TXS.imp ();                   // set stack pointer
/* e3a0 */                   BNE.rel ("_e386");            // do "READY." warm start, branch always

// ------------------------------------------------------- // character get subroutine for zero page
                                                           // the target address for the LDA $EA60 becomes the BASIC execute pointer once the
                                                           // block is copied to its destination, any non zero page address will do at assembly
                                                           // time, to assemble a three byte instruction. $EA60 is RTS, NOP.
                                                           // page 0 initialisation table from $0073
                                                           // increment and scan memory
/* e3a2 */  _`initat_e3a2`;  INC.zpg ("txtptr+0_007a");    // increment BASIC execute pointer low byte
/* e3a4 */                   BNE.rel ("_e3a8");            // branch if no carry
                                                           // else
/* e3a6 */                   INC.zpg ("txtptr+1_007b");    // increment BASIC execute pointer high byte
                                                           // page 0 initialisation table from $0079
                                                           // scan memory
/* e3a8 */        _`_e3a8`;  LDA.abs (0xea60);             // get byte to scan, address set by call routine
/* e3ab */                   CMP.imm (0x3a);               // compare with ":"
/* e3ad */                   BCS.rel ("_e3b9");            // exit if>=
                                                           // page 0 initialisation table from $0080
                                                           // clear Cb if numeric
/* e3af */                   CMP.imm (0x20);               // compare with " "
/* e3b1 */                   BEQ.rel ("initat_e3a2");      // if " " go do next
/* e3b3 */                   SEC.imp ();                   // set carry for SBC
/* e3b4 */                   SBC.imm (0x30);               // subtract "0"
/* e3b6 */                   SEC.imp ();                   // set carry for SBC
/* e3b7 */                   SBC.imm (0xd0);               // subtract -"0"
                                                           // clear carry if byte = "0"-"9"
/* e3b9 */        _`_e3b9`;  RTS.imp ();

// ------------------------------------------------------- // spare bytes, not referenced
                                                           // 0.811635157
/* e3ba */  _`rndsed_e3ba`;  _.bytes(0x80, 0x4f, 0xc7, 0x52, 0x58);

// ------------------------------------------------------- // initialise BASIC RAM locations
/* e3bf */  _`initcz_e3bf`;  LDA.imm (0x4c);               // opcode for JMP
/* e3c1 */                   STA.zpg ("jmper+0_0054");     // save for functions vector jump
/* e3c3 */                   STA.abs ("usrpok_0310");      // save for USR() vector jump
                                                           // set USR() vector to illegal quantity error
/* e3c6 */                   LDA.imm (0x48);               // set USR() vector low byte
/* e3c8 */                   LDY.imm (0xb2);               // set USR() vector high byte
/* e3ca */                   STA.abs ("usradd+0_0311");    // save USR() vector low byte
/* e3cd */                   STY.abs ("usradd+1_0312");    // save USR() vector high byte
/* e3d0 */                   LDA.imm (0x91);               // set fixed to float vector low byte
/* e3d2 */                   LDY.imm (0xb3);               // set fixed to float vector high byte
/* e3d4 */                   STA.zpg ("adray2+0_0005");    // save fixed to float vector low byte
/* e3d6 */                   STY.zpg ("adray2+1_0006");    // save fixed to float vector high byte
/* e3d8 */                   LDA.imm (0xaa);               // set float to fixed vector low byte
/* e3da */                   LDY.imm (0xb1);               // set float to fixed vector high byte
/* e3dc */                   STA.zpg ("adray1+0_0003");    // save float to fixed vector low byte
/* e3de */                   STY.zpg ("adray1+1_0004");    // save float to fixed vector high byte
                                                           // copy the character get subroutine from $E3A2 to $0074
/* e3e0 */                   LDX.imm (0x1c);               // set the byte count
/* e3e2 */        _`_e3e2`;  LDA.abx ("initat_e3a2");      // get a byte from the table
/* e3e5 */                   STA.zpx (0x73);               // save the byte in page zero
/* e3e7 */                   DEX.imp ();                   // decrement the count
/* e3e8 */                   BPL.rel ("_e3e2");            // loop if not all done
                                                           // clear descriptors, strings, program area and mamory pointers
/* e3ea */                   LDA.imm (0x03);               // set the step size, collecting descriptors
/* e3ec */                   STA.zpg ("four6_0053");       // save the garbage collection step size
/* e3ee */                   LDA.imm (0x00);               // clear A
/* e3f0 */                   STA.zpg ("bits_0068");        // clear FAC1 overflow byte
/* e3f2 */                   STA.zpg ("channl_0013");      // clear the current I/O channel, flag default
/* e3f4 */                   STA.zpg ("lastpt+1_0018");    // clear the current descriptor stack item pointer high byte
/* e3f6 */                   LDX.imm (0x01);               // set X
/* e3f8 */                   STX.abs ("bstack+190_01fd");  // set the chain link pointer low byte
/* e3fb */                   STX.abs ("bstack+189_01fc");  // set the chain link pointer high byte
/* e3fe */                   LDX.imm (0x19);               // initial the value for descriptor stack
/* e400 */                   STX.zpg ("temppt_0016");      // set descriptor stack pointer
/* e402 */                   SEC.imp ();                   // set Cb = 1 to read the bottom of memory
/* e403 */                   JSR.abs ("membot_ff9c");      // read/set the bottom of memory
/* e406 */                   STX.zpg ("txttab+0_002b");    // save the start of memory low byte
/* e408 */                   STY.zpg ("txttab+1_002c");    // save the start of memory high byte
/* e40a */                   SEC.imp ();                   // set Cb = 1 to read the top of memory
/* e40b */                   JSR.abs ("memtop_ff99");      // read/set the top of memory
/* e40e */                   STX.zpg ("memsiz+0_0037");    // save the end of memory low byte
/* e410 */                   STY.zpg ("memsiz+1_0038");    // save the end of memory high byte
/* e412 */                   STX.zpg ("fretop+0_0033");    // set the bottom of string space low byte
/* e414 */                   STY.zpg ("fretop+1_0034");    // set the bottom of string space high byte
/* e416 */                   LDY.imm (0x00);               // clear the index
/* e418 */                   TYA.imp ();                   // clear the A
/* e419 */                   STA.iny ("txttab+0_002b");    // clear the the first byte of memory
/* e41b */                   INC.zpg ("txttab+0_002b");    // increment the start of memory low byte
/* e41d */                   BNE.rel ("_e421");            // if no rollover skip the high byte increment
/* e41f */                   INC.zpg ("txttab+1_002c");    // increment start of memory high byte
/* e421 */        _`_e421`;  RTS.imp ();

// ------------------------------------------------------- // print the start up message and initialise the memory pointers
/* e422 */  _`initms_e422`;  LDA.zpg ("txttab+0_002b");    // get the start of memory low byte
/* e424 */                   LDY.zpg ("txttab+1_002c");    // get the start of memory high byte
/* e426 */                   JSR.abs ("reason_a408");      // check available memory, do out of memory error if no room
/* e429 */                   LDA.imm (0x73);               // set "**** COMMODORE 64 BASIC V2 ****" pointer low byte
/* e42b */                   LDY.imm (0xe4);               // set "**** COMMODORE 64 BASIC V2 ****" pointer high byte
/* e42d */                   JSR.abs ("strout_ab1e");      // print a null terminated string
/* e430 */                   LDA.zpg ("memsiz+0_0037");    // get the end of memory low byte
/* e432 */                   SEC.imp ();                   // set carry for subtract
/* e433 */                   SBC.zpg ("txttab+0_002b");    // subtract the start of memory low byte
/* e435 */                   TAX.imp ();                   // copy the result to X
/* e436 */                   LDA.zpg ("memsiz+1_0038");    // get the end of memory high byte
/* e438 */                   SBC.zpg ("txttab+1_002c");    // subtract the start of memory high byte
/* e43a */                   JSR.abs ("linprt_bdcd");      // print XA as unsigned integer
/* e43d */                   LDA.imm (0x60);               // set " BYTES FREE" pointer low byte
/* e43f */                   LDY.imm (0xe4);               // set " BYTES FREE" pointer high byte
/* e441 */                   JSR.abs ("strout_ab1e");      // print a null terminated string
/* e444 */                   JMP.abs ("_a644");            // do NEW, CLEAR, RESTORE and return

// ------------------------------------------------------- // BASIC vectors, these are copied to RAM from $0300 onwards
/* e447 */   _`bvtrs_e447`;  _.bytes(0x8b, 0xe3);          // error message          $0300
/* e449 */                   _.bytes(0x83, 0xa4);          // BASIC warm start       $0302
/* e44b */                   _.bytes(0x7c, 0xa5);          // crunch BASIC tokens    $0304
/* e44d */                   _.bytes(0x1a, 0xa7);          // uncrunch BASIC tokens  $0306
/* e44f */                   _.bytes(0xe4, 0xa7);          // start new BASIC code   $0308
/* e451 */                   _.bytes(0x86, 0xae);          // get arithmetic element $030A

// ------------------------------------------------------- // initialise the BASIC vectors
/* e453 */   _`initv_e453`;  LDX.imm (0x0b);               // set byte count
/* e455 */        _`_e455`;  LDA.abx ("bvtrs_e447");       // get byte from table
/* e458 */                   STA.abx ("ierror+0_0300");    // save byte to RAM
/* e45b */                   DEX.imp ();                   // decrement index
/* e45c */                   BPL.rel ("_e455");            // loop if more to do
/* e45e */                   RTS.imp ();

// ------------------------------------------------------- // BASIC startup messages
                                                           // basic bytes free
/* e45f */                   _.bytes(0x00, 0x20, 0x42, 0x41, 0x53, 0x49, 0x43, 0x20);
/* e467 */                   _.bytes(0x42, 0x59, 0x54, 0x45, 0x53, 0x20, 0x46, 0x52);
/* e46f */                   _.bytes(0x45, 0x45, 0x0d, 0x00);
                                                           // (clr) **** commodore 64 basic v2 ****
/* e473 */                   _.bytes(0x93, 0x0d, 0x20, 0x20, 0x20, 0x20, 0x2a, 0x2a);
                                                           // (cr) (cr) 64k ram system
/* e47b */                   _.bytes(0x2a, 0x2a, 0x20, 0x43, 0x4f, 0x4d, 0x4d, 0x4f);
/* e483 */                   _.bytes(0x44, 0x4f, 0x52, 0x45, 0x20, 0x36, 0x34, 0x20);
/* e48b */                   _.bytes(0x42, 0x41, 0x53, 0x49, 0x43, 0x20, 0x56, 0x32);
/* e493 */                   _.bytes(0x20, 0x2a, 0x2a, 0x2a, 0x2a, 0x0d, 0x0d, 0x20);
/* e49b */                   _.bytes(0x36, 0x34, 0x4b, 0x20, 0x52, 0x41, 0x4d, 0x20);
/* e4a3 */                   _.bytes(0x53, 0x59, 0x53, 0x54, 0x45, 0x4d, 0x20, 0x20);
/* e4ab */                   _.bytes(0x00);

// ------------------------------------------------------- // unused
/* e4ac */                   _.bytes(0x81);

// ------------------------------------------------------- // open channel for output
/* e4ad */        _`_e4ad`;  PHA.imp ();                   // save the flag byte
/* e4ae */                   JSR.abs ("chkout_ffc9");      // open channel for output
/* e4b1 */                   TAX.imp ();                   // copy the returned flag byte
/* e4b2 */                   PLA.imp ();                   // restore the alling flag byte
/* e4b3 */                   BCC.rel ("_e4b6");            // if there is no error skip copying the error flag
/* e4b5 */                   TXA.imp ();                   // else copy the error flag
/* e4b6 */        _`_e4b6`;  RTS.imp ();

// ------------------------------------------------------- // unused bytes
/* e4b7 */                   _.bytes(0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa);
/* e4bf */                   _.bytes(0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa);
/* e4c7 */                   _.bytes(0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa);
/* e4cf */                   _.bytes(0xaa, 0xaa, 0xaa, 0xaa);

// ------------------------------------------------------- // flag the RS232 start bit and set the parity
/* e4d3 */        _`_e4d3`;  STA.zpg ("rinone_00a9");      // save the start bit check flag, set start bit received
/* e4d5 */                   LDA.imm (0x01);               // set the initial parity state
/* e4d7 */                   STA.zpg ("riprty_00ab");      // save the receiver parity bit
/* e4d9 */                   RTS.imp ();

// ------------------------------------------------------- // save the current colour to the colour RAM
/* e4da */        _`_e4da`;  LDA.abs ("color_0286");       // get the current colour code
/* e4dd */                   STA.iny ("user+0_00f3");      // save it to the colour RAM
/* e4df */                   RTS.imp ();

// ------------------------------------------------------- // wait ~8.5 seconds for any key from the STOP key column
/* e4e0 */        _`_e4e0`;  ADC.imm (0x02);               // set the number of jiffies to wait
/* e4e2 */        _`_e4e2`;  LDY.zpg ("stkey_0091");       // read the stop key column
/* e4e4 */                   INY.imp ();                   // test for $FF, no keys pressed
/* e4e5 */                   BNE.rel ("_e4eb");            // if any keys were pressed just exit
/* e4e7 */                   CMP.zpg ("time+1_00a1");      // compare the wait time with the jiffy clock mid byte
/* e4e9 */                   BNE.rel ("_e4e2");            // if not there yet go wait some more
/* e4eb */        _`_e4eb`;  RTS.imp ();

// ------------------------------------------------------- // baud rate tables for PAL C64
                                                           // baud rate word is calculated from ..

                                                           // (system clock / baud rate) / 2 - 100

                                                           //     system clock
                                                           //     ------------
                                                           // PAL       985248 Hz
                                                           // NTSC     1022727 Hz
/* e4ec */                   _.bytes(0x19, 0x26);          //   50   baud   985300
/* e4ee */                   _.bytes(0x44, 0x19);          //   75   baud   985200
/* e4f0 */                   _.bytes(0x1a, 0x11);          //  110   baud   985160
/* e4f2 */                   _.bytes(0xe8, 0x0d);          //  134.5 baud   984540
/* e4f4 */                   _.bytes(0x70, 0x0c);          //  150   baud   985200
/* e4f6 */                   _.bytes(0x06, 0x06);          //  300   baud   985200
/* e4f8 */                   _.bytes(0xd1, 0x02);          //  600   baud   985200
/* e4fa */                   _.bytes(0x37, 0x01);          // 1200   baud   986400
/* e4fc */                   _.bytes(0xae, 0x00);          // 1800   baud   986400
/* e4fe */                   _.bytes(0x69, 0x00);          // 2400   baud   984000

// ------------------------------------------------------- // return the base address of the I/O devices
/* e500 */  _`iobase_e500`;  LDX.imm (0x00);               // get the I/O base address low byte
/* e502 */                   LDY.imm (0xdc);               // get the I/O base address high byte
/* e504 */                   RTS.imp ();

// ------------------------------------------------------- // return the x,y organization of the screen
/* e505 */  _`screen_e505`;  LDX.imm (0x28);               // get the x size
/* e507 */                   LDY.imm (0x19);               // get the y size
/* e509 */                   RTS.imp ();

// ------------------------------------------------------- // read/set the x,y cursor position
/* e50a */    _`plot_e50a`;  BCS.rel ("_e513");            // if read cursor go do read
/* e50c */                   STX.zpg ("tblx_00d6");        // save the cursor row
/* e50e */                   STY.zpg ("pntr_00d3");        // save the cursor column
/* e510 */                   JSR.abs ("_e56c");            // set the screen pointers for the cursor row, column
/* e513 */        _`_e513`;  LDX.zpg ("tblx_00d6");        // get the cursor row
/* e515 */                   LDY.zpg ("pntr_00d3");        // get the cursor column
/* e517 */                   RTS.imp ();

// ------------------------------------------------------- // initialise the screen and keyboard
/* e518 */   _`cint1_e518`;  JSR.abs ("_e5a0");            // initialise the vic chip
/* e51b */                   LDA.imm (0x00);               // clear A
/* e51d */                   STA.abs ("mode_0291");        // clear the shift mode switch
/* e520 */                   STA.zpg ("blnon_00cf");       // clear the cursor blink phase
/* e522 */                   LDA.imm (0x48);               // get the keyboard decode logic pointer low byte
/* e524 */                   STA.abs ("keylog+0_028f");    // save the keyboard decode logic pointer low byte
/* e527 */                   LDA.imm (0xeb);               // get the keyboard decode logic pointer high byte
/* e529 */                   STA.abs ("keylog+1_0290");    // save the keyboard decode logic pointer high byte
/* e52c */                   LDA.imm (0x0a);               // set the maximum size of the keyboard buffer
/* e52e */                   STA.abs ("xmax_0289");        // save the maximum size of the keyboard buffer
/* e531 */                   STA.abs ("delay_028c");       // save the repeat delay counter
/* e534 */                   LDA.imm (0x0e);               // set light blue
/* e536 */                   STA.abs ("color_0286");       // save the current colour code
/* e539 */                   LDA.imm (0x04);               // speed 4
/* e53b */                   STA.abs ("kount_028b");       // save the repeat speed counter
/* e53e */                   LDA.imm (0x0c);               // set the cursor flash timing
/* e540 */                   STA.zpg ("blnct_00cd");       // save the cursor timing countdown
/* e542 */                   STA.zpg ("blnsw_00cc");       // save the cursor enable, $00 = flash cursor

// ------------------------------------------------------- // clear the screen
/* e544 */        _`_e544`;  LDA.abs ("hibase_0288");      // get the screen memory page
/* e547 */                   ORA.imm (0x80);               // set the high bit, flag every line is a logical line start
/* e549 */                   TAY.imp ();                   // copy to Y
/* e54a */                   LDA.imm (0x00);               // clear the line start low byte
/* e54c */                   TAX.imp ();                   // clear the index
/* e54d */        _`_e54d`;  STY.zpx (0xd9);               // save the start of line X pointer high byte
/* e54f */                   CLC.imp ();                   // clear carry for add
/* e550 */                   ADC.imm (0x28);               // add the line length to the low byte
/* e552 */                   BCC.rel ("_e555");            // if no rollover skip the high byte increment
/* e554 */                   INY.imp ();                   // else increment the high byte
/* e555 */        _`_e555`;  INX.imp ();                   // increment the line index
/* e556 */                   CPX.imm (0x1a);               // compare it with the number of lines + 1
/* e558 */                   BNE.rel ("_e54d");            // loop if not all done
/* e55a */                   LDA.imm (0xff);               // set the end of table marker
/* e55c */                   STA.zpx (0xd9);               // mark the end of the table
/* e55e */                   LDX.imm (0x18);               // set the line count, 25 lines to do, 0 to 24
/* e560 */        _`_e560`;  JSR.abs ("_e9ff");            // clear screen line X
/* e563 */                   DEX.imp ();                   // decrement the count
/* e564 */                   BPL.rel ("_e560");            // loop if more to do

// ------------------------------------------------------- // home the cursor
/* e566 */        _`_e566`;  LDY.imm (0x00);               // clear Y
/* e568 */                   STY.zpg ("pntr_00d3");        // clear the cursor column
/* e56a */                   STY.zpg ("tblx_00d6");        // clear the cursor row

// ------------------------------------------------------- // set screen pointers for cursor row, column
/* e56c */        _`_e56c`;  LDX.zpg ("tblx_00d6");        // get the cursor row
/* e56e */                   LDA.zpg ("pntr_00d3");        // get the cursor column
/* e570 */        _`_e570`;  LDY.zpx (0xd9);               // get start of line X pointer high byte
/* e572 */                   BMI.rel ("_e57c");            // if it is the logical line start continue
/* e574 */                   CLC.imp ();                   // else clear carry for add
/* e575 */                   ADC.imm (0x28);               // add one line length
/* e577 */                   STA.zpg ("pntr_00d3");        // save the cursor column
/* e579 */                   DEX.imp ();                   // decrement the cursor row
/* e57a */                   BPL.rel ("_e570");            // loop, branch always
/* e57c */        _`_e57c`;  JSR.abs ("_e9f0");            // fetch a screen address
/* e57f */                   LDA.imm (0x27);               // set the line length
/* e581 */                   INX.imp ();                   // increment the cursor row
/* e582 */        _`_e582`;  LDY.zpx (0xd9);               // get the start of line X pointer high byte
/* e584 */                   BMI.rel ("_e58c");            // if logical line start exit
/* e586 */                   CLC.imp ();                   // else clear carry for add
/* e587 */                   ADC.imm (0x28);               // add one line length to the current line length
/* e589 */                   INX.imp ();                   // increment the cursor row
/* e58a */                   BPL.rel ("_e582");            // loop, branch always
/* e58c */        _`_e58c`;  STA.zpg ("lnmx_00d5");        // save current screen line length
/* e58e */                   JMP.abs ("_ea24");            // calculate the pointer to colour RAM and return
/* e591 */        _`_e591`;  CPX.zpg ("lxsp+0_00c9");      // compare it with the input cursor row
/* e593 */                   BEQ.rel ("_e598");            // if there just exit
/* e595 */                   JMP.abs ("_e6ed");            // else go ??
/* e598 */        _`_e598`;  RTS.imp ();

// ------------------------------------------------------- // orphan bytes ??
/* e599 */                   NOP.imp ();                   // huh
/* e59a */                   JSR.abs ("_e5a0");            // initialise the vic chip
/* e59d */                   JMP.abs ("_e566");            // home the cursor and return

// ------------------------------------------------------- // initialise the vic chip
/* e5a0 */        _`_e5a0`;  LDA.imm (0x03);               // set the screen as the output device
/* e5a2 */                   STA.zpg ("dflto_009a");       // save the output device number
/* e5a4 */                   LDA.imm (0x00);               // set the keyboard as the input device
/* e5a6 */                   STA.zpg ("dfltn_0099");       // save the input device number
/* e5a8 */                   LDX.imm (0x2f);               // set the count/index
/* e5aa */        _`_e5aa`;  LDA.abx ("_ecb8");            // get a vic ii chip initialisation value
/* e5ad */                   STA.abx ("_cfff");            // save it to the vic ii chip
/* e5b0 */                   DEX.imp ();                   // decrement the count/index
/* e5b1 */                   BNE.rel ("_e5aa");            // loop if more to do
/* e5b3 */                   RTS.imp ();

// ------------------------------------------------------- // input from the keyboard buffer
/* e5b4 */     _`lp2_e5b4`;  LDY.abs ("keyd+0_0277");      // get the current character from the buffer
/* e5b7 */                   LDX.imm (0x00);               // clear the index
/* e5b9 */        _`_e5b9`;  LDA.abx ("keyd+1_0278");      // get the next character,X from the buffer
/* e5bc */                   STA.abx ("keyd+0_0277");      // save it as the current character,X in the buffer
/* e5bf */                   INX.imp ();                   // increment the index
/* e5c0 */                   CPX.zpg ("ndx_00c6");         // compare it with the keyboard buffer index
/* e5c2 */                   BNE.rel ("_e5b9");            // loop if more to do
/* e5c4 */                   DEC.zpg ("ndx_00c6");         // decrement keyboard buffer index
/* e5c6 */                   TYA.imp ();                   // copy the key to A
/* e5c7 */                   CLI.imp ();                   // enable the interrupts
/* e5c8 */                   CLC.imp ();                   // flag got byte
/* e5c9 */                   RTS.imp ();

// ------------------------------------------------------- // write character and wait for key
/* e5ca */        _`_e5ca`;  JSR.abs ("_e716");            // output character

// ------------------------------------------------------- // wait for a key from the keyboard
/* e5cd */        _`_e5cd`;  LDA.zpg ("ndx_00c6");         // get the keyboard buffer index
/* e5cf */                   STA.zpg ("blnsw_00cc");       // cursor enable, $00 = flash cursor, $xx = no flash
/* e5d1 */                   STA.abs ("autodn_0292");      // screen scrolling flag, $00 = scroll, $xx = no scroll
                                                           // this disables both the cursor flash and the screen scroll
                                                           // while there are characters in the keyboard buffer
/* e5d4 */                   BEQ.rel ("_e5cd");            // loop if the buffer is empty
/* e5d6 */                   SEI.imp ();                   // disable the interrupts
/* e5d7 */                   LDA.zpg ("blnon_00cf");       // get the cursor blink phase
/* e5d9 */                   BEQ.rel ("_e5e7");            // if cursor phase skip the overwrite
                                                           // else it is the character phase
/* e5db */                   LDA.zpg ("gdbln_00ce");       // get the character under the cursor
/* e5dd */                   LDX.abs ("gdcol_0287");       // get the colour under the cursor
/* e5e0 */                   LDY.imm (0x00);               // clear Y
/* e5e2 */                   STY.zpg ("blnon_00cf");       // clear the cursor blink phase
/* e5e4 */                   JSR.abs ("_ea13");            // print character A and colour X
/* e5e7 */        _`_e5e7`;  JSR.abs ("lp2_e5b4");         // input from the keyboard buffer
/* e5ea */                   CMP.imm (0x83);               // compare with [SHIFT][RUN]
/* e5ec */                   BNE.rel ("_e5fe");            // if not [SHIFT][RUN] skip the buffer fill
                                                           // keys are [SHIFT][RUN] so put "LOAD",$0D,"RUN",$0D into
                                                           // the buffer
/* e5ee */                   LDX.imm (0x09);               // set the byte count
/* e5f0 */                   SEI.imp ();                   // disable the interrupts
/* e5f1 */                   STX.zpg ("ndx_00c6");         // set the keyboard buffer index
/* e5f3 */        _`_e5f3`;  LDA.abx ("_ece6");            // get byte from the auto load/run table
/* e5f6 */                   STA.abx ("sat+9_0276");       // save it to the keyboard buffer
/* e5f9 */                   DEX.imp ();                   // decrement the count/index
/* e5fa */                   BNE.rel ("_e5f3");            // loop while more to do
/* e5fc */                   BEQ.rel ("_e5cd");            // loop for the next key, branch always
                                                           // was not [SHIFT][RUN]
/* e5fe */        _`_e5fe`;  CMP.imm (0x0d);               // compare the key with [CR]
/* e600 */                   BNE.rel ("_e5ca");            // if not [CR] print the character and get the next key
                                                           // else it was [CR]
/* e602 */                   LDY.zpg ("lnmx_00d5");        // get the current screen line length
/* e604 */                   STY.zpg ("crsw_00d0");        // input from keyboard or screen, $xx = screen,
                                                           // $00 = keyboard
/* e606 */        _`_e606`;  LDA.iny ("pnt+0_00d1");       // get the character from the current screen line
/* e608 */                   CMP.imm (0x20);               // compare it with [SPACE]
/* e60a */                   BNE.rel ("_e60f");            // if not [SPACE] continue
/* e60c */                   DEY.imp ();                   // else eliminate the space, decrement end of input line
/* e60d */                   BNE.rel ("_e606");            // loop, branch always
/* e60f */        _`_e60f`;  INY.imp ();                   // increment past the last non space character on line
/* e610 */                   STY.zpg ("indx_00c8");        // save the input [EOL] pointer
/* e612 */                   LDY.imm (0x00);               // clear A
/* e614 */                   STY.abs ("autodn_0292");      // clear the screen scrolling flag, $00 = scroll
/* e617 */                   STY.zpg ("pntr_00d3");        // clear the cursor column
/* e619 */                   STY.zpg ("qtsw_00d4");        // clear the cursor quote flag, $xx = quote, $00 = no quote
/* e61b */                   LDA.zpg ("lxsp+0_00c9");      // get the input cursor row
/* e61d */                   BMI.rel ("_e63a");
/* e61f */                   LDX.zpg ("tblx_00d6");        // get the cursor row
/* e621 */                   JSR.abs ("_e591");            // find and set the pointers for the start of logical line
/* e624 */                   CPX.zpg ("lxsp+0_00c9");      // compare with input cursor row
/* e626 */                   BNE.rel ("_e63a");
/* e628 */                   LDA.zpg ("lxsp+1_00ca");      // get the input cursor column
/* e62a */                   STA.zpg ("pntr_00d3");        // save the cursor column
/* e62c */                   CMP.zpg ("indx_00c8");        // compare the cursor column with input [EOL] pointer
/* e62e */                   BCC.rel ("_e63a");            // if less, cursor is in line, go ??
/* e630 */                   BCS.rel ("_e65d");            // else the cursor is beyond the line end, branch always

// ------------------------------------------------------- // input from screen or keyboard
/* e632 */        _`_e632`;  TYA.imp ();                   // copy Y
/* e633 */                   PHA.imp ();                   // save Y
/* e634 */                   TXA.imp ();                   // copy X
/* e635 */                   PHA.imp ();                   // save X
/* e636 */                   LDA.zpg ("crsw_00d0");        // input from keyboard or screen, $xx = screen,
                                                           // $00 = keyboard
/* e638 */                   BEQ.rel ("_e5cd");            // if keyboard go wait for key
/* e63a */        _`_e63a`;  LDY.zpg ("pntr_00d3");        // get the cursor column
/* e63c */                   LDA.iny ("pnt+0_00d1");       // get character from the current screen line
/* e63e */                   STA.zpg ("schar_00d7");       // save temporary last character
/* e640 */                   AND.imm (0x3f);               // mask key bits
/* e642 */                   ASL.zpg ("schar_00d7");       // << temporary last character
/* e644 */                   BIT.zpg ("schar_00d7");       // test it
/* e646 */                   BPL.rel ("_e64a");            // branch if not [NO KEY]
/* e648 */                   ORA.imm (0x80);
/* e64a */        _`_e64a`;  BCC.rel ("_e650");
/* e64c */                   LDX.zpg ("qtsw_00d4");        // get the cursor quote flag, $xx = quote, $00 = no quote
/* e64e */                   BNE.rel ("_e654");            // if in quote mode go ??
/* e650 */        _`_e650`;  BVS.rel ("_e654");
/* e652 */                   ORA.imm (0x40);
/* e654 */        _`_e654`;  INC.zpg ("pntr_00d3");        // increment the cursor column
/* e656 */                   JSR.abs ("_e684");            // if open quote toggle the cursor quote flag
/* e659 */                   CPY.zpg ("indx_00c8");        // compare ?? with input [EOL] pointer
/* e65b */                   BNE.rel ("_e674");            // if not at line end go ??
/* e65d */        _`_e65d`;  LDA.imm (0x00);               // clear A
/* e65f */                   STA.zpg ("crsw_00d0");        // clear input from keyboard or screen, $xx = screen,
                                                           // $00 = keyboard
/* e661 */                   LDA.imm (0x0d);               // set character [CR]
/* e663 */                   LDX.zpg ("dfltn_0099");       // get the input device number
/* e665 */                   CPX.imm (0x03);               // compare the input device with the screen
/* e667 */                   BEQ.rel ("_e66f");            // if screen go ??
/* e669 */                   LDX.zpg ("dflto_009a");       // get the output device number
/* e66b */                   CPX.imm (0x03);               // compare the output device with the screen
/* e66d */                   BEQ.rel ("_e672");            // if screen go ??
/* e66f */        _`_e66f`;  JSR.abs ("_e716");            // output the character
/* e672 */        _`_e672`;  LDA.imm (0x0d);               // set character [CR]
/* e674 */        _`_e674`;  STA.zpg ("schar_00d7");       // save character
/* e676 */                   PLA.imp ();                   // pull X
/* e677 */                   TAX.imp ();                   // restore X
/* e678 */                   PLA.imp ();                   // pull Y
/* e679 */                   TAY.imp ();                   // restore Y
/* e67a */                   LDA.zpg ("schar_00d7");       // restore character
/* e67c */                   CMP.imm (0xde);
/* e67e */                   BNE.rel ("_e682");
/* e680 */                   LDA.imm (0xff);
/* e682 */        _`_e682`;  CLC.imp ();                   // flag ok
/* e683 */                   RTS.imp ();

// ------------------------------------------------------- // if open quote toggle cursor quote flag
/* e684 */        _`_e684`;  CMP.imm (0x22);               // comapre byte with "
/* e686 */                   BNE.rel ("_e690");            // exit if not "
/* e688 */                   LDA.zpg ("qtsw_00d4");        // get cursor quote flag, $xx = quote, $00 = no quote
/* e68a */                   EOR.imm (0x01);               // toggle it
/* e68c */                   STA.zpg ("qtsw_00d4");        // save cursor quote flag
/* e68e */                   LDA.imm (0x22);               // restore the "
/* e690 */        _`_e690`;  RTS.imp ();

// ------------------------------------------------------- // insert uppercase/graphic character
/* e691 */        _`_e691`;  ORA.imm (0x40);               // change to uppercase/graphic
/* e693 */        _`_e693`;  LDX.zpg ("rvs_00c7");         // get the reverse flag
/* e695 */                   BEQ.rel ("_e699");            // branch if not reverse
                                                           // else ..
                                                           // insert reversed character
/* e697 */        _`_e697`;  ORA.imm (0x80);               // reverse character
/* e699 */        _`_e699`;  LDX.zpg ("insrt_00d8");       // get the insert count
/* e69b */                   BEQ.rel ("_e69f");            // branch if none
/* e69d */                   DEC.zpg ("insrt_00d8");       // else decrement the insert count
/* e69f */        _`_e69f`;  LDX.abs ("color_0286");       // get the current colour code
/* e6a2 */                   JSR.abs ("_ea13");            // print character A and colour X
/* e6a5 */                   JSR.abs ("_e6b6");            // advance the cursor
                                                           // restore the registers, set the quote flag and exit
/* e6a8 */        _`_e6a8`;  PLA.imp ();                   // pull Y
/* e6a9 */                   TAY.imp ();                   // restore Y
/* e6aa */                   LDA.zpg ("insrt_00d8");       // get the insert count
/* e6ac */                   BEQ.rel ("_e6b0");            // skip quote flag clear if inserts to do
/* e6ae */                   LSR.zpg ("qtsw_00d4");        // clear cursor quote flag, $xx = quote, $00 = no quote
/* e6b0 */        _`_e6b0`;  PLA.imp ();                   // pull X
/* e6b1 */                   TAX.imp ();                   // restore X
/* e6b2 */                   PLA.imp ();                   // restore A
/* e6b3 */                   CLC.imp ();
/* e6b4 */                   CLI.imp ();                   // enable the interrupts
/* e6b5 */                   RTS.imp ();

// ------------------------------------------------------- // advance the cursor
/* e6b6 */        _`_e6b6`;  JSR.abs ("_e8b3");            // test for line increment
/* e6b9 */                   INC.zpg ("pntr_00d3");        // increment the cursor column
/* e6bb */                   LDA.zpg ("lnmx_00d5");        // get current screen line length
/* e6bd */                   CMP.zpg ("pntr_00d3");        // compare ?? with the cursor column
/* e6bf */                   BCS.rel ("_e700");            // exit if line length >= cursor column
/* e6c1 */                   CMP.imm (0x4f);               // compare with max length
/* e6c3 */                   BEQ.rel ("_e6f7");            // if at max clear column, back cursor up and do newline
/* e6c5 */                   LDA.abs ("autodn_0292");      // get the autoscroll flag
/* e6c8 */                   BEQ.rel ("_e6cd");            // branch if autoscroll on
/* e6ca */                   JMP.abs ("_e967");            // else open space on screen
/* e6cd */        _`_e6cd`;  LDX.zpg ("tblx_00d6");        // get the cursor row
/* e6cf */                   CPX.imm (0x19);               // compare with max + 1
/* e6d1 */                   BCC.rel ("_e6da");            // if less than max + 1 go add this row to the current
                                                           // logical line
/* e6d3 */                   JSR.abs ("_e8ea");            // else scroll the screen
/* e6d6 */                   DEC.zpg ("tblx_00d6");        // decrement the cursor row
/* e6d8 */                   LDX.zpg ("tblx_00d6");        // get the cursor row
                                                           // add this row to the current logical line
/* e6da */        _`_e6da`;  ASL.zpx (0xd9);               // shift start of line X pointer high byte
/* e6dc */                   LSR.zpx (0xd9);               // shift start of line X pointer high byte back,
                                                           // make next screen line start of logical line, increment line length and set pointers
                                                           // clear b7, start of logical line
/* e6de */                   INX.imp ();                   // increment screen row
/* e6df */                   LDA.zpx (0xd9);               // get start of line X pointer high byte
/* e6e1 */                   ORA.imm (0x80);               // mark as start of logical line
/* e6e3 */                   STA.zpx (0xd9);               // set start of line X pointer high byte
/* e6e5 */                   DEX.imp ();                   // restore screen row
/* e6e6 */                   LDA.zpg ("lnmx_00d5");        // get current screen line length
                                                           // add one line length and set the pointers for the start of the line
/* e6e8 */                   CLC.imp ();                   // clear carry for add
/* e6e9 */                   ADC.imm (0x28);               // add one line length
/* e6eb */                   STA.zpg ("lnmx_00d5");        // save current screen line length
/* e6ed */        _`_e6ed`;  LDA.zpx (0xd9);               // get start of line X pointer high byte
/* e6ef */                   BMI.rel ("_e6f4");            // exit loop if start of logical line
/* e6f1 */                   DEX.imp ();                   // else back up one line
/* e6f2 */                   BNE.rel ("_e6ed");            // loop if not on first line
/* e6f4 */        _`_e6f4`;  JMP.abs ("_e9f0");            // fetch a screen address
/* e6f7 */        _`_e6f7`;  DEC.zpg ("tblx_00d6");        // decrement the cursor row
/* e6f9 */                   JSR.abs ("_e87c");            // do newline
/* e6fc */                   LDA.imm (0x00);               // clear A
/* e6fe */                   STA.zpg ("pntr_00d3");        // clear the cursor column
/* e700 */        _`_e700`;  RTS.imp ();

// ------------------------------------------------------- // back onto the previous line if possible
/* e701 */        _`_e701`;  LDX.zpg ("tblx_00d6");        // get the cursor row
/* e703 */                   BNE.rel ("_e70b");            // branch if not top row
/* e705 */                   STX.zpg ("pntr_00d3");        // clear cursor column
/* e707 */                   PLA.imp ();                   // dump return address low byte
/* e708 */                   PLA.imp ();                   // dump return address high byte
/* e709 */                   BNE.rel ("_e6a8");            // restore registers, set quote flag and exit, branch always
/* e70b */        _`_e70b`;  DEX.imp ();                   // decrement the cursor row
/* e70c */                   STX.zpg ("tblx_00d6");        // save the cursor row
/* e70e */                   JSR.abs ("_e56c");            // set the screen pointers for cursor row, column
/* e711 */                   LDY.zpg ("lnmx_00d5");        // get current screen line length
/* e713 */                   STY.zpg ("pntr_00d3");        // save the cursor column
/* e715 */                   RTS.imp ();

// ------------------------------------------------------- // output a character to the screen
/* e716 */        _`_e716`;  PHA.imp ();                   // save character
/* e717 */                   STA.zpg ("schar_00d7");       // save temporary last character
/* e719 */                   TXA.imp ();                   // copy X
/* e71a */                   PHA.imp ();                   // save X
/* e71b */                   TYA.imp ();                   // copy Y
/* e71c */                   PHA.imp ();                   // save Y
/* e71d */                   LDA.imm (0x00);               // clear A
/* e71f */                   STA.zpg ("crsw_00d0");        // clear input from keyboard or screen, $xx = screen,
                                                           // $00 = keyboard
/* e721 */                   LDY.zpg ("pntr_00d3");        // get cursor column
/* e723 */                   LDA.zpg ("schar_00d7");       // restore last character
/* e725 */                   BPL.rel ("_e72a");            // branch if unshifted
/* e727 */                   JMP.abs ("_e7d4");            // do shifted characters and return
/* e72a */        _`_e72a`;  CMP.imm (0x0d);               // compare with [CR]
/* e72c */                   BNE.rel ("_e731");            // branch if not [CR]
/* e72e */                   JMP.abs ("_e891");            // else output [CR] and return
/* e731 */        _`_e731`;  CMP.imm (0x20);               // compare with [SPACE]
/* e733 */                   BCC.rel ("_e745");            // branch if < [SPACE], not a printable character
/* e735 */                   CMP.imm (0x60);
/* e737 */                   BCC.rel ("_e73d");            // branch if $20 to $5F
                                                           // character is $60 or greater
/* e739 */                   AND.imm (0xdf);               // conversion of PETSCII character to screen code
/* e73b */                   BNE.rel ("_e73f");            // branch always
                                                           // character is $20 to $5F
/* e73d */        _`_e73d`;  AND.imm (0x3f);               // conversion of PETSCII character to screen code
/* e73f */        _`_e73f`;  JSR.abs ("_e684");            // if open quote toggle cursor direct/programmed flag
/* e742 */                   JMP.abs ("_e693");
                                                           // character was < [SPACE] so is a control character
                                                           // of some sort
/* e745 */        _`_e745`;  LDX.zpg ("insrt_00d8");       // get the insert count
/* e747 */                   BEQ.rel ("_e74c");            // if no characters to insert continue
/* e749 */                   JMP.abs ("_e697");            // insert reversed character
/* e74c */        _`_e74c`;  CMP.imm (0x14);               // compare the character with [INSERT]/[DELETE]
/* e74e */                   BNE.rel ("_e77e");            // if not [INSERT]/[DELETE] go ??
/* e750 */                   TYA.imp ();
/* e751 */                   BNE.rel ("_e759");
/* e753 */                   JSR.abs ("_e701");            // back onto the previous line if possible
/* e756 */                   JMP.abs ("_e773");
/* e759 */        _`_e759`;  JSR.abs ("_e8a1");            // test for line decrement
                                                           // now close up the line
/* e75c */                   DEY.imp ();                   // decrement index to previous character
/* e75d */                   STY.zpg ("pntr_00d3");        // save the cursor column
/* e75f */                   JSR.abs ("_ea24");            // calculate the pointer to colour RAM
/* e762 */        _`_e762`;  INY.imp ();                   // increment index to next character
/* e763 */                   LDA.iny ("pnt+0_00d1");       // get character from current screen line
/* e765 */                   DEY.imp ();                   // decrement index to previous character
/* e766 */                   STA.iny ("pnt+0_00d1");       // save character to current screen line
/* e768 */                   INY.imp ();                   // increment index to next character
/* e769 */                   LDA.iny ("user+0_00f3");      // get colour RAM byte
/* e76b */                   DEY.imp ();                   // decrement index to previous character
/* e76c */                   STA.iny ("user+0_00f3");      // save colour RAM byte
/* e76e */                   INY.imp ();                   // increment index to next character
/* e76f */                   CPY.zpg ("lnmx_00d5");        // compare with current screen line length
/* e771 */                   BNE.rel ("_e762");            // loop if not there yet
/* e773 */        _`_e773`;  LDA.imm (0x20);               // set [SPACE]
/* e775 */                   STA.iny ("pnt+0_00d1");       // clear last character on current screen line
/* e777 */                   LDA.abs ("color_0286");       // get the current colour code
/* e77a */                   STA.iny ("user+0_00f3");      // save to colour RAM
/* e77c */                   BPL.rel ("_e7cb");            // branch always
/* e77e */        _`_e77e`;  LDX.zpg ("qtsw_00d4");        // get cursor quote flag, $xx = quote, $00 = no quote
/* e780 */                   BEQ.rel ("_e785");            // branch if not quote mode
/* e782 */                   JMP.abs ("_e697");            // insert reversed character
/* e785 */        _`_e785`;  CMP.imm (0x12);               // compare with [RVS ON]
/* e787 */                   BNE.rel ("_e78b");            // if not [RVS ON] skip setting the reverse flag
/* e789 */                   STA.zpg ("rvs_00c7");         // else set the reverse flag
/* e78b */        _`_e78b`;  CMP.imm (0x13);               // compare with [CLR HOME]
/* e78d */                   BNE.rel ("_e792");            // if not [CLR HOME] continue
/* e78f */                   JSR.abs ("_e566");            // home the cursor
/* e792 */        _`_e792`;  CMP.imm (0x1d);               // compare with [CURSOR RIGHT]
/* e794 */                   BNE.rel ("_e7ad");            // if not [CURSOR RIGHT] go ??
/* e796 */                   INY.imp ();                   // increment the cursor column
/* e797 */                   JSR.abs ("_e8b3");            // test for line increment
/* e79a */                   STY.zpg ("pntr_00d3");        // save the cursor column
/* e79c */                   DEY.imp ();                   // decrement the cursor column
/* e79d */                   CPY.zpg ("lnmx_00d5");        // compare cursor column with current screen line length
/* e79f */                   BCC.rel ("_e7aa");            // exit if less
                                                           // else the cursor column is >= the current screen line
                                                           // length so back onto the current line and do a newline
/* e7a1 */                   DEC.zpg ("tblx_00d6");        // decrement the cursor row
/* e7a3 */                   JSR.abs ("_e87c");            // do newline
/* e7a6 */                   LDY.imm (0x00);               // clear cursor column
/* e7a8 */        _`_e7a8`;  STY.zpg ("pntr_00d3");        // save the cursor column
/* e7aa */        _`_e7aa`;  JMP.abs ("_e6a8");            // restore the registers, set the quote flag and exit
/* e7ad */        _`_e7ad`;  CMP.imm (0x11);               // compare with [CURSOR DOWN]
/* e7af */                   BNE.rel ("_e7ce");            // if not [CURSOR DOWN] go ??
/* e7b1 */                   CLC.imp ();                   // clear carry for add
/* e7b2 */                   TYA.imp ();                   // copy the cursor column
/* e7b3 */                   ADC.imm (0x28);               // add one line
/* e7b5 */                   TAY.imp ();                   // copy back to Y
/* e7b6 */                   INC.zpg ("tblx_00d6");        // increment the cursor row
/* e7b8 */                   CMP.zpg ("lnmx_00d5");        // compare cursor column with current screen line length
/* e7ba */                   BCC.rel ("_e7a8");            // if less go save cursor column and exit
/* e7bc */                   BEQ.rel ("_e7a8");            // if equal go save cursor column and exit
                                                           // else the cursor has moved beyond the end of this line
                                                           // so back it up until it's on the start of the logical line
/* e7be */                   DEC.zpg ("tblx_00d6");        // decrement the cursor row
/* e7c0 */        _`_e7c0`;  SBC.imm (0x28);               // subtract one line
/* e7c2 */                   BCC.rel ("_e7c8");            // if on previous line exit the loop
/* e7c4 */                   STA.zpg ("pntr_00d3");        // else save the cursor column
/* e7c6 */                   BNE.rel ("_e7c0");            // loop if not at the start of the line
/* e7c8 */        _`_e7c8`;  JSR.abs ("_e87c");            // do newline
/* e7cb */        _`_e7cb`;  JMP.abs ("_e6a8");            // restore the registers, set the quote flag and exit
/* e7ce */        _`_e7ce`;  JSR.abs ("_e8cb");            // set the colour code
/* e7d1 */                   JMP.abs ("_ec44");            // go check for special character codes
/* e7d4 */        _`_e7d4`;  AND.imm (0x7f);               // mask 0xxx xxxx, clear b7
/* e7d6 */                   CMP.imm (0x7f);               // was it $FF before the mask
/* e7d8 */                   BNE.rel ("_e7dc");            // branch if not
/* e7da */                   LDA.imm (0x5e);               // else make it $5E
/* e7dc */        _`_e7dc`;  CMP.imm (0x20);               // compare the character with [SPACE]
/* e7de */                   BCC.rel ("_e7e3");            // if < [SPACE] go ??
/* e7e0 */                   JMP.abs ("_e691");            // insert uppercase/graphic character and return
                                                           // character was $80 to $9F and is now $00 to $1F
/* e7e3 */        _`_e7e3`;  CMP.imm (0x0d);               // compare with [CR]
/* e7e5 */                   BNE.rel ("_e7ea");            // if not [CR] continue
/* e7e7 */                   JMP.abs ("_e891");            // else output [CR] and return
                                                           // was not [CR]
/* e7ea */        _`_e7ea`;  LDX.zpg ("qtsw_00d4");        // get the cursor quote flag, $xx = quote, $00 = no quote
/* e7ec */                   BNE.rel ("_e82d");            // branch if quote mode
/* e7ee */                   CMP.imm (0x14);               // compare with [INSERT DELETE]
/* e7f0 */                   BNE.rel ("_e829");            // if not [INSERT DELETE] go ??
/* e7f2 */                   LDY.zpg ("lnmx_00d5");        // get current screen line length
/* e7f4 */                   LDA.iny ("pnt+0_00d1");       // get character from current screen line
/* e7f6 */                   CMP.imm (0x20);               // compare the character with [SPACE]
/* e7f8 */                   BNE.rel ("_e7fe");            // if not [SPACE] continue
/* e7fa */                   CPY.zpg ("pntr_00d3");        // compare the current column with the cursor column
/* e7fc */                   BNE.rel ("_e805");            // if not cursor column go open up space on line
/* e7fe */        _`_e7fe`;  CPY.imm (0x4f);               // compare current column with max line length
/* e800 */                   BEQ.rel ("_e826");            // if at line end just exit
/* e802 */                   JSR.abs ("_e965");            // else open up a space on the screen
                                                           // now open up space on the line to insert a character
/* e805 */        _`_e805`;  LDY.zpg ("lnmx_00d5");        // get current screen line length
/* e807 */                   JSR.abs ("_ea24");            // calculate the pointer to colour RAM
/* e80a */        _`_e80a`;  DEY.imp ();                   // decrement the index to previous character
/* e80b */                   LDA.iny ("pnt+0_00d1");       // get the character from the current screen line
/* e80d */                   INY.imp ();                   // increment the index to next character
/* e80e */                   STA.iny ("pnt+0_00d1");       // save the character to the current screen line
/* e810 */                   DEY.imp ();                   // decrement the index to previous character
/* e811 */                   LDA.iny ("user+0_00f3");      // get the current screen line colour RAM byte
/* e813 */                   INY.imp ();                   // increment the index to next character
/* e814 */                   STA.iny ("user+0_00f3");      // save the current screen line colour RAM byte
/* e816 */                   DEY.imp ();                   // decrement the index to the previous character
/* e817 */                   CPY.zpg ("pntr_00d3");        // compare the index with the cursor column
/* e819 */                   BNE.rel ("_e80a");            // loop if not there yet
/* e81b */                   LDA.imm (0x20);               // set [SPACE]
/* e81d */                   STA.iny ("pnt+0_00d1");       // clear character at cursor position on current screen line
/* e81f */                   LDA.abs ("color_0286");       // get current colour code
/* e822 */                   STA.iny ("user+0_00f3");      // save to cursor position on current screen line colour RAM
/* e824 */                   INC.zpg ("insrt_00d8");       // increment insert count
/* e826 */        _`_e826`;  JMP.abs ("_e6a8");            // restore the registers, set the quote flag and exit
/* e829 */        _`_e829`;  LDX.zpg ("insrt_00d8");       // get the insert count
/* e82b */                   BEQ.rel ("_e832");            // branch if no insert space
/* e82d */        _`_e82d`;  ORA.imm (0x40);               // change to uppercase/graphic
/* e82f */                   JMP.abs ("_e697");            // insert reversed character
/* e832 */        _`_e832`;  CMP.imm (0x11);               // compare with [CURSOR UP]
/* e834 */                   BNE.rel ("_e84c");            // branch if not [CURSOR UP]
/* e836 */                   LDX.zpg ("tblx_00d6");        // get the cursor row
/* e838 */                   BEQ.rel ("_e871");            // if on the top line go restore the registers, set the
                                                           // quote flag and exit
/* e83a */                   DEC.zpg ("tblx_00d6");        // decrement the cursor row
/* e83c */                   LDA.zpg ("pntr_00d3");        // get the cursor column
/* e83e */                   SEC.imp ();                   // set carry for subtract
/* e83f */                   SBC.imm (0x28);               // subtract one line length
/* e841 */                   BCC.rel ("_e847");            // branch if stepped back to previous line
/* e843 */                   STA.zpg ("pntr_00d3");        // else save the cursor column ..
/* e845 */                   BPL.rel ("_e871");            // .. and exit, branch always
/* e847 */        _`_e847`;  JSR.abs ("_e56c");            // set the screen pointers for cursor row, column ..
/* e84a */                   BNE.rel ("_e871");            // .. and exit, branch always
/* e84c */        _`_e84c`;  CMP.imm (0x12);               // compare with [RVS OFF]
/* e84e */                   BNE.rel ("_e854");            // if not [RVS OFF] continue
/* e850 */                   LDA.imm (0x00);               // else clear A
/* e852 */                   STA.zpg ("rvs_00c7");         // clear the reverse flag
/* e854 */        _`_e854`;  CMP.imm (0x1d);               // compare with [CURSOR LEFT]
/* e856 */                   BNE.rel ("_e86a");            // if not [CURSOR LEFT] go ??
/* e858 */                   TYA.imp ();                   // copy the cursor column
/* e859 */                   BEQ.rel ("_e864");            // if at start of line go back onto the previous line
/* e85b */                   JSR.abs ("_e8a1");            // test for line decrement
/* e85e */                   DEY.imp ();                   // decrement the cursor column
/* e85f */                   STY.zpg ("pntr_00d3");        // save the cursor column
/* e861 */                   JMP.abs ("_e6a8");            // restore the registers, set the quote flag and exit
/* e864 */        _`_e864`;  JSR.abs ("_e701");            // back onto the previous line if possible
/* e867 */                   JMP.abs ("_e6a8");            // restore the registers, set the quote flag and exit
/* e86a */        _`_e86a`;  CMP.imm (0x13);               // compare with [CLR]
/* e86c */                   BNE.rel ("_e874");            // if not [CLR] continue
/* e86e */                   JSR.abs ("_e544");            // clear the screen
/* e871 */        _`_e871`;  JMP.abs ("_e6a8");            // restore the registers, set the quote flag and exit
/* e874 */        _`_e874`;  ORA.imm (0x80);               // restore b7, colour can only be black, cyan, magenta
                                                           // or yellow
/* e876 */                   JSR.abs ("_e8cb");            // set the colour code
/* e879 */                   JMP.abs ("_ec4f");            // go check for special character codes except fro switch
                                                           // to lower case

// ------------------------------------------------------- // do newline
/* e87c */        _`_e87c`;  LSR.zpg ("lxsp+0_00c9");      // shift >> input cursor row
/* e87e */                   LDX.zpg ("tblx_00d6");        // get the cursor row
/* e880 */        _`_e880`;  INX.imp ();                   // increment the row
/* e881 */                   CPX.imm (0x19);               // compare it with last row + 1
/* e883 */                   BNE.rel ("_e888");            // if not last row + 1 skip the screen scroll
/* e885 */                   JSR.abs ("_e8ea");            // else scroll the screen
/* e888 */        _`_e888`;  LDA.zpx (0xd9);               // get start of line X pointer high byte
/* e88a */                   BPL.rel ("_e880");            // loop if not start of logical line
/* e88c */                   STX.zpg ("tblx_00d6");        // save the cursor row
/* e88e */                   JMP.abs ("_e56c");            // set the screen pointers for cursor row, column and return

// ------------------------------------------------------- // output [CR]
/* e891 */        _`_e891`;  LDX.imm (0x00);               // clear X
/* e893 */                   STX.zpg ("insrt_00d8");       // clear the insert count
/* e895 */                   STX.zpg ("rvs_00c7");         // clear the reverse flag
/* e897 */                   STX.zpg ("qtsw_00d4");        // clear the cursor quote flag, $xx = quote, $00 = no quote
/* e899 */                   STX.zpg ("pntr_00d3");        // save the cursor column
/* e89b */                   JSR.abs ("_e87c");            // do newline
/* e89e */                   JMP.abs ("_e6a8");            // restore the registers, set the quote flag and exit

// ------------------------------------------------------- // test for line decrement
/* e8a1 */        _`_e8a1`;  LDX.imm (0x02);               // set the count
/* e8a3 */                   LDA.imm (0x00);               // set the column
/* e8a5 */        _`_e8a5`;  CMP.zpg ("pntr_00d3");        // compare the column with the cursor column
/* e8a7 */                   BEQ.rel ("_e8b0");            // if at the start of the line go decrement the cursor row
                                                           // and exit
/* e8a9 */                   CLC.imp ();                   // else clear carry for add
/* e8aa */                   ADC.imm (0x28);               // increment to next line
/* e8ac */                   DEX.imp ();                   // decrement loop count
/* e8ad */                   BNE.rel ("_e8a5");            // loop if more to test
/* e8af */                   RTS.imp ();
/* e8b0 */        _`_e8b0`;  DEC.zpg ("tblx_00d6");        // else decrement the cursor row
/* e8b2 */                   RTS.imp ();

// ------------------------------------------------------- // test for line increment

                                                           // if at end of the line, but not at end of the last line, increment the cursor row
/* e8b3 */        _`_e8b3`;  LDX.imm (0x02);               // set the count
/* e8b5 */                   LDA.imm (0x27);               // set the column
/* e8b7 */        _`_e8b7`;  CMP.zpg ("pntr_00d3");        // compare the column with the cursor column
/* e8b9 */                   BEQ.rel ("_e8c2");            // if at end of line test and possibly increment cursor row
/* e8bb */                   CLC.imp ();                   // else clear carry for add
/* e8bc */                   ADC.imm (0x28);               // increment to the next line
/* e8be */                   DEX.imp ();                   // decrement the loop count
/* e8bf */                   BNE.rel ("_e8b7");            // loop if more to test
/* e8c1 */                   RTS.imp ();
                                                           // cursor is at end of line
/* e8c2 */        _`_e8c2`;  LDX.zpg ("tblx_00d6");        // get the cursor row
/* e8c4 */                   CPX.imm (0x19);               // compare it with the end of the screen
/* e8c6 */                   BEQ.rel ("_e8ca");            // if at the end of screen just exit
/* e8c8 */                   INC.zpg ("tblx_00d6");        // else increment the cursor row
/* e8ca */        _`_e8ca`;  RTS.imp ();

// ------------------------------------------------------- // set the colour code. enter with the colour character in A. if A does not contain a
                                                           // colour character this routine exits without changing the colour
/* e8cb */        _`_e8cb`;  LDX.imm (0x0f);
                                                           // set the colour code count
/* e8cd */        _`_e8cd`;  CMP.abx ("_e8da");            // compare the character with a table code
/* e8d0 */                   BEQ.rel ("_e8d6");            // if a match go save the colour and exit
/* e8d2 */                   DEX.imp ();                   // else decrement the index
/* e8d3 */                   BPL.rel ("_e8cd");            // loop if more to do
/* e8d5 */                   RTS.imp ();
/* e8d6 */        _`_e8d6`;  STX.abs ("color_0286");       // save the current colour code
/* e8d9 */                   RTS.imp ();

// ------------------------------------------------------- // ASCII colour code table
                                                           // CHR$()  colour
                                                           // ------  ------
/* e8da */        _`_e8da`;  _.bytes(0x90);                //  144    black
/* e8db */                   _.bytes(0x05);                //    5    white 
/* e8dc */                   _.bytes(0x1c);                //   28    red 
/* e8dd */                   _.bytes(0x9f);                //  159    cyan
/* e8de */                   _.bytes(0x9c);                //  156    purple
/* e8df */                   _.bytes(0x1e);                //   30    green
/* e8e0 */                   _.bytes(0x1f);                //   31    blue
/* e8e1 */                   _.bytes(0x9e);                //  158    yellow
/* e8e2 */                   _.bytes(0x81);                //  129    orange
/* e8e3 */                   _.bytes(0x95);                //  149    brown
/* e8e4 */                   _.bytes(0x96);                //  150    light red
/* e8e5 */                   _.bytes(0x97);                //  151    dark grey
/* e8e6 */                   _.bytes(0x98);                //  152    medium grey
/* e8e7 */                   _.bytes(0x99);                //  153    light green
/* e8e8 */                   _.bytes(0x9a);                //  154    light blue
/* e8e9 */                   _.bytes(0x9b);                //  155    light grey

// ------------------------------------------------------- // scroll the screen
/* e8ea */        _`_e8ea`;  LDA.zpg ("sal+0_00ac");       // copy the tape buffer start pointer
/* e8ec */                   PHA.imp ();                   // save it
/* e8ed */                   LDA.zpg ("sal+1_00ad");       // copy the tape buffer start pointer
/* e8ef */                   PHA.imp ();                   // save it
/* e8f0 */                   LDA.zpg ("eal+0_00ae");       // copy the tape buffer end pointer
/* e8f2 */                   PHA.imp ();                   // save it
/* e8f3 */                   LDA.zpg ("eal+1_00af");       // copy the tape buffer end pointer
/* e8f5 */                   PHA.imp ();                   // save it
/* e8f6 */        _`_e8f6`;  LDX.imm (0xff);               // set to -1 for pre increment loop
/* e8f8 */                   DEC.zpg ("tblx_00d6");        // decrement the cursor row
/* e8fa */                   DEC.zpg ("lxsp+0_00c9");      // decrement the input cursor row
/* e8fc */                   DEC.abs ("tlnidx_02a5");      // decrement the screen row marker
/* e8ff */        _`_e8ff`;  INX.imp ();                   // increment the line number
/* e900 */                   JSR.abs ("_e9f0");            // fetch a screen address, set the start of line X
/* e903 */                   CPX.imm (0x18);               // compare with last line
/* e905 */                   BCS.rel ("_e913");            // branch if >= $16
/* e907 */                   LDA.abx (0xecf1);             // get the start of the next line pointer low byte
/* e90a */                   STA.zpg ("sal+0_00ac");       // save the next line pointer low byte
/* e90c */                   LDA.zpx (0xda);               // get the start of the next line pointer high byte
/* e90e */                   JSR.abs ("_e9c8");            // shift the screen line up
/* e911 */                   BMI.rel ("_e8ff");            // loop, branch always
/* e913 */        _`_e913`;  JSR.abs ("_e9ff");            // clear screen line X
                                                           // now shift up the start of logical line bits
/* e916 */                   LDX.imm (0x00);               // clear index
/* e918 */        _`_e918`;  LDA.zpx (0xd9);               // get the start of line X pointer high byte
/* e91a */                   AND.imm (0x7f);               // clear the line X start of logical line bit
/* e91c */                   LDY.zpx (0xda);               // get the start of the next line pointer high byte
/* e91e */                   BPL.rel ("_e922");            // if next line is not a start of line skip the start set
/* e920 */                   ORA.imm (0x80);               // set line X start of logical line bit
/* e922 */        _`_e922`;  STA.zpx (0xd9);               // set start of line X pointer high byte
/* e924 */                   INX.imp ();                   // increment line number
/* e925 */                   CPX.imm (0x18);               // compare with last line
/* e927 */                   BNE.rel ("_e918");            // loop if not last line
/* e929 */                   LDA.zpg ("ldtb1+24_00f1");    // get start of last line pointer high byte
/* e92b */                   ORA.imm (0x80);               // mark as start of logical line
/* e92d */                   STA.zpg ("ldtb1+24_00f1");    // set start of last line pointer high byte
/* e92f */                   LDA.zpg ("ldtb1+0_00d9");     // get start of first line pointer high byte
/* e931 */                   BPL.rel ("_e8f6");            // if not start of logical line loop back and
                                                           // scroll the screen up another line
/* e933 */                   INC.zpg ("tblx_00d6");        // increment the cursor row
/* e935 */                   INC.abs ("tlnidx_02a5");      // increment screen row marker
/* e938 */                   LDA.imm (0x7f);               // set keyboard column c7
/* e93a */                   STA.abs ("ciapra_dc00");      // save VIA 1 DRA, keyboard column drive
/* e93d */                   LDA.abs ("ciaprb_dc01");      // read VIA 1 DRB, keyboard row port
/* e940 */                   CMP.imm (0xfb);               // compare with row r2 active, [CTL]
/* e942 */                   PHP.imp ();                   // save status
/* e943 */                   LDA.imm (0x7f);               // set keyboard column c7
/* e945 */                   STA.abs ("ciapra_dc00");      // save VIA 1 DRA, keyboard column drive
/* e948 */                   PLP.imp ();                   // restore status
/* e949 */                   BNE.rel ("_e956");            // skip delay if ??
                                                           // first time round the inner loop X will be $16
/* e94b */                   LDY.imm (0x00);               // clear delay outer loop count, do this 256 times
/* e94d */        _`_e94d`;  NOP.imp ();                   // waste cycles
/* e94e */                   DEX.imp ();                   // decrement inner loop count
/* e94f */                   BNE.rel ("_e94d");            // loop if not all done
/* e951 */                   DEY.imp ();                   // decrement outer loop count
/* e952 */                   BNE.rel ("_e94d");            // loop if not all done
/* e954 */                   STY.zpg ("ndx_00c6");         // clear the keyboard buffer index
/* e956 */        _`_e956`;  LDX.zpg ("tblx_00d6");        // get the cursor row
                                                           // restore the tape buffer pointers and exit
/* e958 */        _`_e958`;  PLA.imp ();                   // pull tape buffer end pointer
/* e959 */                   STA.zpg ("eal+1_00af");       // restore it
/* e95b */                   PLA.imp ();                   // pull tape buffer end pointer
/* e95c */                   STA.zpg ("eal+0_00ae");       // restore it
/* e95e */                   PLA.imp ();                   // pull tape buffer pointer
/* e95f */                   STA.zpg ("sal+1_00ad");       // restore it
/* e961 */                   PLA.imp ();                   // pull tape buffer pointer
/* e962 */                   STA.zpg ("sal+0_00ac");       // restore it
/* e964 */                   RTS.imp ();

// ------------------------------------------------------- // open up a space on the screen
/* e965 */        _`_e965`;  LDX.zpg ("tblx_00d6");        // get the cursor row
/* e967 */        _`_e967`;  INX.imp ();                   // increment the row
/* e968 */                   LDA.zpx (0xd9);               // get the start of line X pointer high byte
/* e96a */                   BPL.rel ("_e967");            // loop if not start of logical line
/* e96c */                   STX.abs ("tlnidx_02a5");      // save the screen row marker
/* e96f */                   CPX.imm (0x18);               // compare it with the last line
/* e971 */                   BEQ.rel ("_e981");            // if = last line go ??
/* e973 */                   BCC.rel ("_e981");            // if < last line go ??
                                                           // else it was > last line
/* e975 */                   JSR.abs ("_e8ea");            // scroll the screen
/* e978 */                   LDX.abs ("tlnidx_02a5");      // get the screen row marker
/* e97b */                   DEX.imp ();                   // decrement the screen row marker
/* e97c */                   DEC.zpg ("tblx_00d6");        // decrement the cursor row
/* e97e */                   JMP.abs ("_e6da");            // add this row to the current logical line and return
/* e981 */        _`_e981`;  LDA.zpg ("sal+0_00ac");       // copy tape buffer pointer
/* e983 */                   PHA.imp ();                   // save it
/* e984 */                   LDA.zpg ("sal+1_00ad");       // copy tape buffer pointer
/* e986 */                   PHA.imp ();                   // save it
/* e987 */                   LDA.zpg ("eal+0_00ae");       // copy tape buffer end pointer
/* e989 */                   PHA.imp ();                   // save it
/* e98a */                   LDA.zpg ("eal+1_00af");       // copy tape buffer end pointer
/* e98c */                   PHA.imp ();                   // save it
/* e98d */                   LDX.imm (0x19);               // set to end line + 1 for predecrement loop
/* e98f */        _`_e98f`;  DEX.imp ();                   // decrement the line number
/* e990 */                   JSR.abs ("_e9f0");            // fetch a screen address
/* e993 */                   CPX.abs ("tlnidx_02a5");      // compare it with the screen row marker
/* e996 */                   BCC.rel ("_e9a6");            // if < screen row marker go ??
/* e998 */                   BEQ.rel ("_e9a6");            // if = screen row marker go ??
/* e99a */                   LDA.abx (0xecef);             // else get the start of the previous line low byte from the
                                                           // ROM table
/* e99d */                   STA.zpg ("sal+0_00ac");       // save previous line pointer low byte
/* e99f */                   LDA.zpx (0xd8);               // get the start of the previous line pointer high byte
/* e9a1 */                   JSR.abs ("_e9c8");            // shift the screen line down
/* e9a4 */                   BMI.rel ("_e98f");            // loop, branch always
/* e9a6 */        _`_e9a6`;  JSR.abs ("_e9ff");            // clear screen line X
/* e9a9 */                   LDX.imm (0x17);
/* e9ab */        _`_e9ab`;  CPX.abs ("tlnidx_02a5");      // compare it with the screen row marker
/* e9ae */                   BCC.rel ("_e9bf");
/* e9b0 */                   LDA.zpx (0xda);
/* e9b2 */                   AND.imm (0x7f);
/* e9b4 */                   LDY.zpx (0xd9);               // get start of line X pointer high byte
/* e9b6 */                   BPL.rel ("_e9ba");
/* e9b8 */                   ORA.imm (0x80);
/* e9ba */        _`_e9ba`;  STA.zpx (0xda);
/* e9bc */                   DEX.imp ();
/* e9bd */                   BNE.rel ("_e9ab");
/* e9bf */        _`_e9bf`;  LDX.abs ("tlnidx_02a5");      // get the screen row marker
/* e9c2 */                   JSR.abs ("_e6da");            // add this row to the current logical line
/* e9c5 */                   JMP.abs ("_e958");            // restore the tape buffer pointers and exit

// ------------------------------------------------------- // shift screen line up/down
/* e9c8 */        _`_e9c8`;  AND.imm (0x03);               // mask 0000 00xx, line memory page
/* e9ca */                   ORA.abs ("hibase_0288");      // OR with screen memory page
/* e9cd */                   STA.zpg ("sal+1_00ad");       // save next/previous line pointer high byte
/* e9cf */                   JSR.abs ("_e9e0");            // calculate pointers to screen lines colour RAM
/* e9d2 */                   LDY.imm (0x27);               // set the column count
/* e9d4 */        _`_e9d4`;  LDA.iny ("sal+0_00ac");       // get character from next/previous screen line
/* e9d6 */                   STA.iny ("pnt+0_00d1");       // save character to current screen line
/* e9d8 */                   LDA.iny ("eal+0_00ae");       // get colour from next/previous screen line colour RAM
/* e9da */                   STA.iny ("user+0_00f3");      // save colour to current screen line colour RAM
/* e9dc */                   DEY.imp ();                   // decrement column index/count
/* e9dd */                   BPL.rel ("_e9d4");            // loop if more to do
/* e9df */                   RTS.imp ();

// ------------------------------------------------------- // calculate pointers to screen lines colour RAM
/* e9e0 */        _`_e9e0`;  JSR.abs ("_ea24");            // calculate the pointer to the current screen line colour
                                                           // RAM
/* e9e3 */                   LDA.zpg ("sal+0_00ac");       // get the next screen line pointer low byte
/* e9e5 */                   STA.zpg ("eal+0_00ae");       // save the next screen line colour RAM pointer low byte
/* e9e7 */                   LDA.zpg ("sal+1_00ad");       // get the next screen line pointer high byte
/* e9e9 */                   AND.imm (0x03);               // mask 0000 00xx, line memory page
/* e9eb */                   ORA.imm (0xd8);               // set  1101 01xx, colour memory page
/* e9ed */                   STA.zpg ("eal+1_00af");       // save the next screen line colour RAM pointer high byte
/* e9ef */                   RTS.imp ();

// ------------------------------------------------------- // fetch a screen address
/* e9f0 */        _`_e9f0`;  LDA.abx ("_ecf0");            // get the start of line low byte from the ROM table
/* e9f3 */                   STA.zpg ("pnt+0_00d1");       // set the current screen line pointer low byte
/* e9f5 */                   LDA.zpx (0xd9);               // get the start of line high byte from the RAM table
/* e9f7 */                   AND.imm (0x03);               // mask 0000 00xx, line memory page
/* e9f9 */                   ORA.abs ("hibase_0288");      // OR with the screen memory page
/* e9fc */                   STA.zpg ("pnt+1_00d2");       // save the current screen line pointer high byte
/* e9fe */                   RTS.imp ();

// ------------------------------------------------------- // clear screen line X
/* e9ff */        _`_e9ff`;  LDY.imm (0x27);               // set number of columns to clear
/* ea01 */                   JSR.abs ("_e9f0");            // fetch a screen address
/* ea04 */                   JSR.abs ("_ea24");            // calculate the pointer to colour RAM
/* ea07 */        _`_ea07`;  JSR.abs ("_e4da");            // save the current colour to the colour RAM
/* ea0a */                   LDA.imm (0x20);               // set [SPACE]
/* ea0c */                   STA.iny ("pnt+0_00d1");       // clear character in current screen line
/* ea0e */                   DEY.imp ();                   // decrement index
/* ea0f */                   BPL.rel ("_ea07");            // loop if more to do
/* ea11 */                   RTS.imp ();

// ------------------------------------------------------- // orphan byte
/* ea12 */                   NOP.imp ();                   // unused

// ------------------------------------------------------- // print character A and colour X
/* ea13 */        _`_ea13`;  TAY.imp ();                   // copy the character
/* ea14 */                   LDA.imm (0x02);               // count to $02, usually $14 ??
/* ea16 */                   STA.zpg ("blnct_00cd");       // save the cursor countdown
/* ea18 */                   JSR.abs ("_ea24");            // calculate the pointer to colour RAM
/* ea1b */                   TYA.imp ();                   // get the character back

// ------------------------------------------------------- // save the character and colour to the screen @ the cursor
/* ea1c */        _`_ea1c`;  LDY.zpg ("pntr_00d3");        // get the cursor column
/* ea1e */                   STA.iny ("pnt+0_00d1");       // save the character from current screen line
/* ea20 */                   TXA.imp ();                   // copy the colour to A
/* ea21 */                   STA.iny ("user+0_00f3");      // save to colour RAM
/* ea23 */                   RTS.imp ();

// ------------------------------------------------------- // calculate the pointer to colour RAM
/* ea24 */        _`_ea24`;  LDA.zpg ("pnt+0_00d1");       // get current screen line pointer low byte
/* ea26 */                   STA.zpg ("user+0_00f3");      // save pointer to colour RAM low byte
/* ea28 */                   LDA.zpg ("pnt+1_00d2");       // get current screen line pointer high byte
/* ea2a */                   AND.imm (0x03);               // mask 0000 00xx, line memory page
/* ea2c */                   ORA.imm (0xd8);               // set  1101 01xx, colour memory page
/* ea2e */                   STA.zpg ("user+1_00f4");      // save pointer to colour RAM high byte
/* ea30 */                   RTS.imp ();

// ------------------------------------------------------- // IRQ vector
/* ea31 */                   JSR.abs ("udtim_ffea");       // increment the real time clock
/* ea34 */                   LDA.zpg ("blnsw_00cc");       // get the cursor enable, $00 = flash cursor
/* ea36 */                   BNE.rel ("_ea61");            // if flash not enabled skip the flash
/* ea38 */                   DEC.zpg ("blnct_00cd");       // decrement the cursor timing countdown
/* ea3a */                   BNE.rel ("_ea61");            // if not counted out skip the flash
/* ea3c */                   LDA.imm (0x14);               // set the flash count
/* ea3e */                   STA.zpg ("blnct_00cd");       // save the cursor timing countdown
/* ea40 */                   LDY.zpg ("pntr_00d3");        // get the cursor column
/* ea42 */                   LSR.zpg ("blnon_00cf");       // shift b0 cursor blink phase into carry
/* ea44 */                   LDX.abs ("gdcol_0287");       // get the colour under the cursor
/* ea47 */                   LDA.iny ("pnt+0_00d1");       // get the character from current screen line
/* ea49 */                   BCS.rel ("_ea5c");            // branch if cursor phase b0 was 1
/* ea4b */                   INC.zpg ("blnon_00cf");       // set the cursor blink phase to 1
/* ea4d */                   STA.zpg ("gdbln_00ce");       // save the character under the cursor
/* ea4f */                   JSR.abs ("_ea24");            // calculate the pointer to colour RAM
/* ea52 */                   LDA.iny ("user+0_00f3");      // get the colour RAM byte
/* ea54 */                   STA.abs ("gdcol_0287");       // save the colour under the cursor
/* ea57 */                   LDX.abs ("color_0286");       // get the current colour code
/* ea5a */                   LDA.zpg ("gdbln_00ce");       // get the character under the cursor
/* ea5c */        _`_ea5c`;  EOR.imm (0x80);               // toggle b7 of character under cursor
/* ea5e */                   JSR.abs ("_ea1c");            // save the character and colour to the screen @ the cursor
/* ea61 */        _`_ea61`;  LDA.zpg ("r6510_0001");       // read the 6510 I/O port
/* ea63 */                   AND.imm (0x10);               // mask 000x 0000, the cassette switch sense
/* ea65 */                   BEQ.rel ("_ea71");            // if the cassette sense is low skip the motor stop
                                                           // the cassette sense was high, the switch was open, so turn
                                                           // off the motor and clear the interlock
/* ea67 */                   LDY.imm (0x00);               // clear Y
/* ea69 */                   STY.zpg ("cas1_00c0");        // clear the tape motor interlock
/* ea6b */                   LDA.zpg ("r6510_0001");       // read the 6510 I/O port
/* ea6d */                   ORA.imm (0x20);               // mask xxxx xx1x, turn off the motor
/* ea6f */                   BNE.rel ("_ea79");            // go save the port value, branch always
                                                           // the cassette sense was low so turn the motor on, perhaps
/* ea71 */        _`_ea71`;  LDA.zpg ("cas1_00c0");        // get the tape motor interlock
/* ea73 */                   BNE.rel ("_ea7b");            // if the cassette interlock <> 0 don't turn on motor
/* ea75 */                   LDA.zpg ("r6510_0001");       // read the 6510 I/O port
/* ea77 */                   AND.imm (0x1f);               // mask xxxx xx0x, turn on the motor
/* ea79 */        _`_ea79`;  STA.zpg ("r6510_0001");       // save the 6510 I/O port
/* ea7b */        _`_ea7b`;  JSR.abs ("scnkey_ea87");      // scan the keyboard
/* ea7e */                   LDA.abs ("ciaicr_dc0d");      // read VIA 1 ICR, clear the timer interrupt flag
/* ea81 */                   PLA.imp ();                   // pull Y
/* ea82 */                   TAY.imp ();                   // restore Y
/* ea83 */                   PLA.imp ();                   // pull X
/* ea84 */                   TAX.imp ();                   // restore X
/* ea85 */                   PLA.imp ();                   // restore A
/* ea86 */                   RTI.imp ();

// ------------------------------------------------------- // scan keyboard performs the following ..

                                                           // 1) check if key pressed, if not then exit the routine

                                                           // 2) init I/O ports of VIA ?? for keyboard scan and set pointers to decode table 1.
                                                           // clear the character counter

                                                           // 3) set one line of port B low and test for a closed key on port A by shifting the
                                                           // byte read from the port. if the carry is clear then a key is closed so save the
                                                           // count which is incremented on each shift. check for shift/stop/cbm keys and
                                                           // flag if closed

                                                           // 4) repeat step 3 for the whole matrix

                                                           // 5) evaluate the SHIFT/CTRL/C= keys, this may change the decode table selected

                                                           // 6) use the key count saved in step 3 as an index into the table selected in step 5

                                                           // 7) check for key repeat operation

                                                           // 8) save the decoded key to the buffer if first press or repeat
                                                           // scan the keyboard
/* ea87 */  _`scnkey_ea87`;  LDA.imm (0x00);               // clear A
/* ea89 */                   STA.abs ("shflag_028d");      // clear the keyboard shift/control/c= flag
/* ea8c */                   LDY.imm (0x40);               // set no key
/* ea8e */                   STY.zpg ("sfdx_00cb");        // save which key
/* ea90 */                   STA.abs ("ciapra_dc00");      // clear VIA 1 DRA, keyboard column drive
/* ea93 */                   LDX.abs ("ciaprb_dc01");      // read VIA 1 DRB, keyboard row port
/* ea96 */                   CPX.imm (0xff);               // compare with all bits set
/* ea98 */                   BEQ.rel ("_eafb");            // if no key pressed clear current key and exit (does
                                                           // further BEQ to $EBBA)
/* ea9a */                   TAY.imp ();                   // clear the key count
/* ea9b */                   LDA.imm (0x81);               // get the decode table low byte
/* ea9d */                   STA.zpg ("keytab+0_00f5");    // save the keyboard pointer low byte
/* ea9f */                   LDA.imm (0xeb);               // get the decode table high byte
/* eaa1 */                   STA.zpg ("keytab+1_00f6");    // save the keyboard pointer high byte
/* eaa3 */                   LDA.imm (0xfe);               // set column 0 low
/* eaa5 */                   STA.abs ("ciapra_dc00");      // save VIA 1 DRA, keyboard column drive
/* eaa8 */        _`_eaa8`;  LDX.imm (0x08);               // set the row count
/* eaaa */                   PHA.imp ();                   // save the column
/* eaab */        _`_eaab`;  LDA.abs ("ciaprb_dc01");      // read VIA 1 DRB, keyboard row port
/* eaae */                   CMP.abs ("ciaprb_dc01");      // compare it with itself
/* eab1 */                   BNE.rel ("_eaab");            // loop if changing
/* eab3 */        _`_eab3`;  LSR.acc ();                   // shift row to Cb
/* eab4 */                   BCS.rel ("_eacc");            // if no key closed on this row go do next row
/* eab6 */                   PHA.imp ();                   // save row
/* eab7 */                   LDA.iny ("keytab+0_00f5");    // get character from decode table
/* eab9 */                   CMP.imm (0x05);               // compare with $05, there is no $05 key but the control
                                                           // keys are all less than $05
/* eabb */                   BCS.rel ("_eac9");            // if not shift/control/c=/stop go save key count
                                                           // else was shift/control/c=/stop key
/* eabd */                   CMP.imm (0x03);               // compare with $03, stop
/* eabf */                   BEQ.rel ("_eac9");            // if stop go save key count and continue
                                                           // character is $01 - shift, $02 - c= or $04 - control
/* eac1 */                   ORA.abs ("shflag_028d");      // OR it with the keyboard shift/control/c= flag
/* eac4 */                   STA.abs ("shflag_028d");      // save the keyboard shift/control/c= flag
/* eac7 */                   BPL.rel ("_eacb");            // skip save key, branch always
/* eac9 */        _`_eac9`;  STY.zpg ("sfdx_00cb");        // save key count
/* eacb */        _`_eacb`;  PLA.imp ();                   // restore row
/* eacc */        _`_eacc`;  INY.imp ();                   // increment key count
/* eacd */                   CPY.imm (0x41);               // compare with max+1
/* eacf */                   BCS.rel ("_eadc");            // exit loop if >= max+1
                                                           // else still in matrix
/* ead1 */                   DEX.imp ();                   // decrement row count
/* ead2 */                   BNE.rel ("_eab3");            // loop if more rows to do
/* ead4 */                   SEC.imp ();                   // set carry for keyboard column shift
/* ead5 */                   PLA.imp ();                   // restore the column
/* ead6 */                   ROL.acc ();                   // shift the keyboard column
/* ead7 */                   STA.abs ("ciapra_dc00");      // save VIA 1 DRA, keyboard column drive
/* eada */                   BNE.rel ("_eaa8");            // loop for next column, branch always
/* eadc */        _`_eadc`;  PLA.imp ();                   // dump the saved column
/* eadd */                   JMP.ind ("keylog+0_028f");    // evaluate the SHIFT/CTRL/C= keys, $EBDC
                                                           // key decoding continues here after the SHIFT/CTRL/C= keys are evaluated
/* eae0 */        _`_eae0`;  LDY.zpg ("sfdx_00cb");        // get saved key count
/* eae2 */                   LDA.iny ("keytab+0_00f5");    // get character from decode table
/* eae4 */                   TAX.imp ();                   // copy character to X
/* eae5 */                   CPY.zpg ("lstx_00c5");        // compare key count with last key count
/* eae7 */                   BEQ.rel ("_eaf0");            // if this key = current key, key held, go test repeat
/* eae9 */                   LDY.imm (0x10);               // set the repeat delay count
/* eaeb */                   STY.abs ("delay_028c");       // save the repeat delay count
/* eaee */                   BNE.rel ("_eb26");            // go save key to buffer and exit, branch always
/* eaf0 */        _`_eaf0`;  AND.imm (0x7f);               // clear b7
/* eaf2 */                   BIT.abs ("rptflg_028a");      // test key repeat
/* eaf5 */                   BMI.rel ("_eb0d");            // if repeat all go ??
/* eaf7 */                   BVS.rel ("_eb42");            // if repeat none go ??
/* eaf9 */                   CMP.imm (0x7f);               // compare with end marker
/* eafb */        _`_eafb`;  BEQ.rel ("_eb26");            // if $00/end marker go save key to buffer and exit
/* eafd */                   CMP.imm (0x14);               // compare with [INSERT]/[DELETE]
/* eaff */                   BEQ.rel ("_eb0d");            // if [INSERT]/[DELETE] go test for repeat
/* eb01 */                   CMP.imm (0x20);               // compare with [SPACE]
/* eb03 */                   BEQ.rel ("_eb0d");            // if [SPACE] go test for repeat
/* eb05 */                   CMP.imm (0x1d);               // compare with [CURSOR RIGHT]
/* eb07 */                   BEQ.rel ("_eb0d");            // if [CURSOR RIGHT] go test for repeat
/* eb09 */                   CMP.imm (0x11);               // compare with [CURSOR DOWN]
/* eb0b */                   BNE.rel ("_eb42");            // if not [CURSOR DOWN] just exit
                                                           // was one of the cursor movement keys, insert/delete
                                                           // key or the space bar so always do repeat tests
/* eb0d */        _`_eb0d`;  LDY.abs ("delay_028c");       // get the repeat delay counter
/* eb10 */                   BEQ.rel ("_eb17");            // if delay expired go ??
/* eb12 */                   DEC.abs ("delay_028c");       // else decrement repeat delay counter
/* eb15 */                   BNE.rel ("_eb42");            // if delay not expired go ??
                                                           // repeat delay counter has expired
/* eb17 */        _`_eb17`;  DEC.abs ("kount_028b");       // decrement the repeat speed counter
/* eb1a */                   BNE.rel ("_eb42");            // branch if repeat speed count not expired
/* eb1c */                   LDY.imm (0x04);               // set for 4/60ths of a second
/* eb1e */                   STY.abs ("kount_028b");       // save the repeat speed counter
/* eb21 */                   LDY.zpg ("ndx_00c6");         // get the keyboard buffer index
/* eb23 */                   DEY.imp ();                   // decrement it
/* eb24 */                   BPL.rel ("_eb42");            // if the buffer isn't empty just exit
                                                           // else repeat the key immediately
                                                           // possibly save the key to the keyboard buffer. if there was no key pressed or the key
                                                           // was not found during the scan (possibly due to key bounce) then X will be $FF here
/* eb26 */        _`_eb26`;  LDY.zpg ("sfdx_00cb");        // get the key count
/* eb28 */                   STY.zpg ("lstx_00c5");        // save it as the current key count
/* eb2a */                   LDY.abs ("shflag_028d");      // get the keyboard shift/control/c= flag
/* eb2d */                   STY.abs ("lstshf_028e");      // save it as last keyboard shift pattern
/* eb30 */                   CPX.imm (0xff);               // compare the character with the table end marker or no key
/* eb32 */                   BEQ.rel ("_eb42");            // if it was the table end marker or no key just exit
/* eb34 */                   TXA.imp ();                   // copy the character to A
/* eb35 */                   LDX.zpg ("ndx_00c6");         // get the keyboard buffer index
/* eb37 */                   CPX.abs ("xmax_0289");        // compare it with the keyboard buffer size
/* eb3a */                   BCS.rel ("_eb42");            // if the buffer is full just exit
/* eb3c */                   STA.abx ("keyd+0_0277");      // save the character to the keyboard buffer
/* eb3f */                   INX.imp ();                   // increment the index
/* eb40 */                   STX.zpg ("ndx_00c6");         // save the keyboard buffer index
/* eb42 */        _`_eb42`;  LDA.imm (0x7f);               // enable column 7 for the stop key
/* eb44 */                   STA.abs ("ciapra_dc00");      // save VIA 1 DRA, keyboard column drive
/* eb47 */                   RTS.imp ();

// ------------------------------------------------------- // evaluate the SHIFT/CTRL/C= keys
/* eb48 */                   LDA.abs ("shflag_028d");      // get the keyboard shift/control/c= flag
/* eb4b */                   CMP.imm (0x03);               // compare with [SHIFT][C=]
/* eb4d */                   BNE.rel ("_eb64");            // if not [SHIFT][C=] go ??
/* eb4f */                   CMP.abs ("lstshf_028e");      // compare with last
/* eb52 */                   BEQ.rel ("_eb42");            // exit if still the same
/* eb54 */                   LDA.abs ("mode_0291");        // get the shift mode switch $00 = enabled, $80 = locked
/* eb57 */                   BMI.rel ("_eb76");            // if locked continue keyboard decode
                                                           // toggle text mode
/* eb59 */                   LDA.abs ("vmcsb_d018");       // get the start of character memory address
/* eb5c */                   EOR.imm (0x02);               // toggle address b1
/* eb5e */                   STA.abs ("vmcsb_d018");       // save the start of character memory address
/* eb61 */                   JMP.abs ("_eb76");            // continue the keyboard decode
                                                           // select keyboard table
/* eb64 */        _`_eb64`;  ASL.acc ();                   // << 1
/* eb65 */                   CMP.imm (0x08);               // compare with [CTRL]
/* eb67 */                   BCC.rel ("_eb6b");            // if [CTRL] is not pressed skip the index change
/* eb69 */                   LDA.imm (0x06);               // else [CTRL] was pressed so make the index = $06
/* eb6b */        _`_eb6b`;  TAX.imp ();                   // copy the index to X
/* eb6c */                   LDA.abx ("_eb79");            // get the decode table pointer low byte
/* eb6f */                   STA.zpg ("keytab+0_00f5");    // save the decode table pointer low byte
/* eb71 */                   LDA.abx (0xeb7a);             // get the decode table pointer high byte
/* eb74 */                   STA.zpg ("keytab+1_00f6");    // save the decode table pointer high byte
/* eb76 */        _`_eb76`;  JMP.abs ("_eae0");            // continue the keyboard decode

// ------------------------------------------------------- // table addresses
/* eb79 */        _`_eb79`;  _.bytes(0x81, 0xeb);          // standard
/* eb7b */                   _.bytes(0xc2, 0xeb);          // shift
/* eb7d */                   _.bytes(0x03, 0xec);          // commodore
/* eb7f */                   _.bytes(0x78, 0xec);          // control

// ------------------------------------------------------- // standard keyboard table
/* eb81 */                   _.bytes(0x14, 0x0d, 0x1d, 0x88, 0x85, 0x86, 0x87, 0x11);
/* eb89 */                   _.bytes(0x33, 0x57, 0x41, 0x34, 0x5a, 0x53, 0x45, 0x01);
/* eb91 */                   _.bytes(0x35, 0x52, 0x44, 0x36, 0x43, 0x46, 0x54, 0x58);
/* eb99 */                   _.bytes(0x37, 0x59, 0x47, 0x38, 0x42, 0x48, 0x55, 0x56);
/* eba1 */                   _.bytes(0x39, 0x49, 0x4a, 0x30, 0x4d, 0x4b, 0x4f, 0x4e);
/* eba9 */                   _.bytes(0x2b, 0x50, 0x4c, 0x2d, 0x2e, 0x3a, 0x40, 0x2c);
/* ebb1 */                   _.bytes(0x5c, 0x2a, 0x3b, 0x13, 0x01, 0x3d, 0x5e, 0x2f);
/* ebb9 */                   _.bytes(0x31, 0x5f, 0x04, 0x32, 0x20, 0x02, 0x51, 0x03);
/* ebc1 */                   _.bytes(0xff);
// ------------------------------------------------------- // shifted keyboard table
/* ebc2 */                   _.bytes(0x94, 0x8d, 0x9d, 0x8c, 0x89, 0x8a, 0x8b, 0x91);
/* ebca */                   _.bytes(0x23, 0xd7, 0xc1, 0x24, 0xda, 0xd3, 0xc5, 0x01);
/* ebd2 */                   _.bytes(0x25, 0xd2, 0xc4, 0x26, 0xc3, 0xc6, 0xd4, 0xd8);
/* ebda */                   _.bytes(0x27, 0xd9, 0xc7, 0x28, 0xc2, 0xc8, 0xd5, 0xd6);
/* ebe2 */                   _.bytes(0x29, 0xc9, 0xca, 0x30, 0xcd, 0xcb, 0xcf, 0xce);
/* ebea */                   _.bytes(0xdb, 0xd0, 0xcc, 0xdd, 0x3e, 0x5b, 0xba, 0x3c);
/* ebf2 */                   _.bytes(0xa9, 0xc0, 0x5d, 0x93, 0x01, 0x3d, 0xde, 0x3f);
/* ebfa */                   _.bytes(0x21, 0x5f, 0x04, 0x22, 0xa0, 0x02, 0xd1, 0x83);
/* ec02 */                   _.bytes(0xff);
// ------------------------------------------------------- // CBM key keyboard table
/* ec03 */                   _.bytes(0x94, 0x8d, 0x9d, 0x8c, 0x89, 0x8a, 0x8b, 0x91);
/* ec0b */                   _.bytes(0x96, 0xb3, 0xb0, 0x97, 0xad, 0xae, 0xb1, 0x01);
/* ec13 */                   _.bytes(0x98, 0xb2, 0xac, 0x99, 0xbc, 0xbb, 0xa3, 0xbd);
/* ec1b */                   _.bytes(0x9a, 0xb7, 0xa5, 0x9b, 0xbf, 0xb4, 0xb8, 0xbe);
/* ec23 */                   _.bytes(0x29, 0xa2, 0xb5, 0x30, 0xa7, 0xa1, 0xb9, 0xaa);
/* ec2b */                   _.bytes(0xa6, 0xaf, 0xb6, 0xdc, 0x3e, 0x5b, 0xa4, 0x3c);
/* ec33 */                   _.bytes(0xa8, 0xdf, 0x5d, 0x93, 0x01, 0x3d, 0xde, 0x3f);
/* ec3b */                   _.bytes(0x81, 0x5f, 0x04, 0x95, 0xa0, 0x02, 0xab, 0x83);
/* ec43 */                   _.bytes(0xff);

// ------------------------------------------------------- // check for special character codes
/* ec44 */        _`_ec44`;  CMP.imm (0x0e);               // compare with [SWITCH TO LOWER CASE]
/* ec46 */                   BNE.rel ("_ec4f");            // if not [SWITCH TO LOWER CASE] skip the switch
/* ec48 */                   LDA.abs ("vmcsb_d018");       // get the start of character memory address
/* ec4b */                   ORA.imm (0x02);               // mask xxxx xx1x, set lower case characters
/* ec4d */                   BNE.rel ("_ec58");            // go save the new value, branch always
                                                           // check for special character codes except fro switch to lower case
/* ec4f */        _`_ec4f`;  CMP.imm (0x8e);               // compare with [SWITCH TO UPPER CASE]
/* ec51 */                   BNE.rel ("_ec5e");            // if not [SWITCH TO UPPER CASE] go do the [SHIFT]+[C=] key
                                                           // check
/* ec53 */                   LDA.abs ("vmcsb_d018");       // get the start of character memory address
/* ec56 */                   AND.imm (0xfd);               // mask xxxx xx0x, set upper case characters
/* ec58 */        _`_ec58`;  STA.abs ("vmcsb_d018");       // save the start of character memory address
/* ec5b */        _`_ec5b`;  JMP.abs ("_e6a8");            // restore the registers, set the quote flag and exit
                                                           // do the [SHIFT]+[C=] key check
/* ec5e */        _`_ec5e`;  CMP.imm (0x08);               // compare with disable [SHIFT][C=]
/* ec60 */                   BNE.rel ("_ec69");            // if not disable [SHIFT][C=] skip the set
/* ec62 */                   LDA.imm (0x80);               // set to lock shift mode switch
/* ec64 */                   ORA.abs ("mode_0291");        // OR it with the shift mode switch
/* ec67 */                   BMI.rel ("_ec72");            // go save the value, branch always
/* ec69 */        _`_ec69`;  CMP.imm (0x09);               // compare with enable [SHIFT][C=]
/* ec6b */                   BNE.rel ("_ec5b");            // exit if not enable [SHIFT][C=]
/* ec6d */                   LDA.imm (0x7f);               // set to unlock shift mode switch
/* ec6f */                   AND.abs ("mode_0291");        // AND it with the shift mode switch
/* ec72 */        _`_ec72`;  STA.abs ("mode_0291");        // save the shift mode switch $00 = enabled, $80 = locked
/* ec75 */                   JMP.abs ("_e6a8");            // restore the registers, set the quote flag and exit

// ------------------------------------------------------- // control keyboard table
/* ec78 */                   _.bytes(0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff);
/* ec80 */                   _.bytes(0x1c, 0x17, 0x01, 0x9f, 0x1a, 0x13, 0x05, 0xff);
/* ec88 */                   _.bytes(0x9c, 0x12, 0x04, 0x1e, 0x03, 0x06, 0x14, 0x18);
/* ec90 */                   _.bytes(0x1f, 0x19, 0x07, 0x9e, 0x02, 0x08, 0x15, 0x16);
/* ec98 */                   _.bytes(0x12, 0x09, 0x0a, 0x92, 0x0d, 0x0b, 0x0f, 0x0e);
/* eca0 */                   _.bytes(0xff, 0x10, 0x0c, 0xff, 0xff, 0x1b, 0x00, 0xff);
/* eca8 */                   _.bytes(0x1c, 0xff, 0x1d, 0xff, 0xff, 0x1f, 0x1e, 0xff);
/* ecb0 */                   _.bytes(0x90, 0x06, 0xff, 0x05, 0xff, 0xff, 0x11, 0xff);
/* ecb8 */        _`_ecb8`;  _.bytes(0xff);

// ------------------------------------------------------- // vic ii chip initialisation values
/* ecb9 */                   _.bytes(0x00, 0x00);          // sprite 0 x,y
/* ecbb */                   _.bytes(0x00, 0x00);          // sprite 1 x,y 
/* ecbd */                   _.bytes(0x00, 0x00);          // sprite 2 x,y 
/* ecbf */                   _.bytes(0x00, 0x00);          // sprite 3 x,y
/* ecc1 */                   _.bytes(0x00, 0x00);          // sprite 4 x,y 
/* ecc3 */                   _.bytes(0x00, 0x00);          // sprite 5 x,y 
/* ecc5 */                   _.bytes(0x00, 0x00);          // sprite 6 x,y 
/* ecc7 */                   _.bytes(0x00, 0x00);          // sprite 7 x,y
/* ecc9 */                   _.bytes(0x00);                // sprites 0 to 7 x bit 8
/* ecca */                   _.bytes(0x9b);                // enable screen, enable 25 rows
                                                           // vertical fine scroll and control
                                                           // bit function
                                                           // --- -------
                                                           //  7  raster compare bit 8
                                                           //  6  1 = enable extended color text mode
                                                           //  5  1 = enable bitmap graphics mode
                                                           //  4  1 = enable screen, 0 = blank screen
                                                           //  3  1 = 25 row display, 0 = 24 row display
                                                           // 2-0 vertical scroll count
/* eccb */                   _.bytes(0x37);                // raster compare
/* eccc */                   _.bytes(0x00);                // light pen x
/* eccd */                   _.bytes(0x00);                // light pen y
/* ecce */                   _.bytes(0x00);                // sprite 0 to 7 enable
/* eccf */                   _.bytes(0x08);                // enable 40 column display
                                                           // horizontal fine scroll and control
                                                           // bit function
                                                           // --- -------
                                                           // 7-6 unused
                                                           //  5  1 = vic reset, 0 = vic on
                                                           //  4  1 = enable multicolor mode
                                                           //  3  1 = 40 column display, 0 = 38 column display
                                                           // 2-0 horizontal scroll count
/* ecd0 */                   _.bytes(0x00);                // sprite 0 to 7 y expand
/* ecd1 */                   _.bytes(0x14);                // memory control
                                                           // bit function
                                                           // --- -------
                                                           // 7-4 video matrix base address
                                                           // 3-1 character data base address
                                                           //  0  unused
/* ecd2 */                   _.bytes(0x0f);                // clear all interrupts
                                                           // interrupt flags
                                                           //  7 1 = interrupt
                                                           // 6-4 unused
                                                           //  3  1 = light pen interrupt
                                                           //  2  1 = sprite to sprite collision interrupt
                                                           //  1  1 = sprite to foreground collision interrupt
                                                           //  0  1 = raster compare interrupt
/* ecd3 */                   _.bytes(0x00);                // all vic IRQs disabeld
                                                           // IRQ enable
                                                           // bit function
                                                           // --- -------
                                                           // 7-4 unused
                                                           //  3  1 = enable light pen
                                                           //  2  1 = enable sprite to sprite collision
                                                           //  1  1 = enable sprite to foreground collision
                                                           //  0  1 = enable raster compare
/* ecd4 */                   _.bytes(0x00);                // sprite 0 to 7 foreground priority
/* ecd5 */                   _.bytes(0x00);                // sprite 0 to 7 multicolour
/* ecd6 */                   _.bytes(0x00);                // sprite 0 to 7 x expand
/* ecd7 */                   _.bytes(0x00);                // sprite 0 to 7 sprite collision
/* ecd8 */                   _.bytes(0x00);                // sprite 0 to 7 foreground collision
/* ecd9 */                   _.bytes(0x0e);                // border colour
/* ecda */                   _.bytes(0x06);                // background colour 0
/* ecdb */                   _.bytes(0x01);                // background colour 1
/* ecdc */                   _.bytes(0x02);                // background colour 2
/* ecdd */                   _.bytes(0x03);                // background colour 3
/* ecde */                   _.bytes(0x04);                // sprite multicolour 0
/* ecdf */                   _.bytes(0x00);                // sprite multicolour 1
/* ece0 */                   _.bytes(0x01);                // sprite 0 colour
/* ece1 */                   _.bytes(0x02);                // sprite 1 colour
/* ece2 */                   _.bytes(0x03);                // sprite 2 colour
/* ece3 */                   _.bytes(0x04);                // sprite 3 colour
/* ece4 */                   _.bytes(0x05);                // sprite 4 colour
/* ece5 */                   _.bytes(0x06);                // sprite 5 colour
/* ece6 */        _`_ece6`;  _.bytes(0x07);                // sprite 6 colour
                                                           // sprite 7 colour is actually the first character of "LOAD" ($4C)

// ------------------------------------------------------- // keyboard buffer for auto load/run
/* ece7 */                   _.bytes(0x4c, 0x4f, 0x41);    // 'load (cr) run (cr)'
/* ecea */                   _.bytes(0x44, 0x0d, 0x52, 0x55, 0x4e, 0x0d);

// ------------------------------------------------------- // low bytes of screen line addresses
/* ecf0 */        _`_ecf0`;  _.bytes(0x00, 0x28, 0x50, 0x78, 0xa0, 0xc8, 0xf0, 0x18);
/* ecf8 */                   _.bytes(0x40, 0x68, 0x90, 0xb8, 0xe0, 0x08, 0x30, 0x58);
/* ed00 */                   _.bytes(0x80, 0xa8, 0xd0, 0xf8, 0x20, 0x48, 0x70, 0x98);
/* ed08 */                   _.bytes(0xc0);

// ------------------------------------------------------- // command serial bus device to TALK
/* ed09 */    _`talk_ed09`;  ORA.imm (0x40);               // OR with the TALK command
/* ed0b */                   _.bytes(0x2c);                // makes next line BIT $2009

// ------------------------------------------------------- // command devices on the serial bus to LISTEN
/* ed0c */  _`listen_ed0c`;  ORA.imm (0x20);               // OR with the LISTEN command
/* ed0e */                   JSR.abs ("_f0a4");            // check RS232 bus idle

// ------------------------------------------------------- // send a control character
/* ed11 */        _`_ed11`;  PHA.imp ();                   // save device address
/* ed12 */                   BIT.zpg ("c3po_0094");        // test deferred character flag
/* ed14 */                   BPL.rel ("_ed20");            // if no defered character continue
/* ed16 */                   SEC.imp ();                   // else flag EOI
/* ed17 */                   ROR.zpg ("tsfcnt_00a3");      // rotate into EOI flag byte
/* ed19 */                   JSR.abs ("_ed40");            // Tx byte on serial bus
/* ed1c */                   LSR.zpg ("c3po_0094");        // clear deferred character flag
/* ed1e */                   LSR.zpg ("tsfcnt_00a3");      // clear EOI flag
/* ed20 */        _`_ed20`;  PLA.imp ();                   // restore the device address

// ------------------------------------------------------- // defer a command
/* ed21 */                   STA.zpg ("bsour_0095");       // save as serial defered character
/* ed23 */                   SEI.imp ();                   // disable the interrupts
/* ed24 */                   JSR.abs ("_ee97");            // set the serial data out high
/* ed27 */                   CMP.imm (0x3f);               // compare read byte with $3F
/* ed29 */                   BNE.rel ("_ed2e");            // branch if not $3F, this branch will always be taken as
                                                           // after VIA 2's PCR is read it is ANDed with $DF, so the
                                                           // result can never be $3F ??
/* ed2b */                   JSR.abs ("_ee85");            // set the serial clock out high
/* ed2e */        _`_ed2e`;  LDA.abs ("ci2pra_dd00");      // read VIA 2 DRA, serial port and video address
/* ed31 */                   ORA.imm (0x08);               // mask xxxx 1xxx, set serial ATN low
/* ed33 */                   STA.abs ("ci2pra_dd00");      // save VIA 2 DRA, serial port and video address
                                                           // if the code drops through to here the serial clock is low and the serial data has been
                                                           // released so the following code will have no effect apart from delaying the first byte
                                                           // by 1ms
                                                           // set the serial clk/data, wait and Tx byte on the serial bus
/* ed36 */        _`_ed36`;  SEI.imp ();                   // disable the interrupts
/* ed37 */                   JSR.abs ("_ee8e");            // set the serial clock out low
/* ed3a */                   JSR.abs ("_ee97");            // set the serial data out high
/* ed3d */                   JSR.abs ("_eeb3");            // 1ms delay

// ------------------------------------------------------- // Tx byte on serial bus
/* ed40 */        _`_ed40`;  SEI.imp ();                   // disable the interrupts
/* ed41 */                   JSR.abs ("_ee97");            // set the serial data out high
/* ed44 */                   JSR.abs ("_eea9");            // get the serial data status in Cb
/* ed47 */                   BCS.rel ("_edad");            // if the serial data is high go do 'device not present'
/* ed49 */                   JSR.abs ("_ee85");            // set the serial clock out high
/* ed4c */                   BIT.zpg ("tsfcnt_00a3");      // test the EOI flag
/* ed4e */                   BPL.rel ("_ed5a");            // if not EOI go ??
                                                           // I think this is the EOI sequence so the serial clock has been released and the serial
                                                           // data is being held low by the peripheral. first up wait for the serial data to rise
/* ed50 */        _`_ed50`;  JSR.abs ("_eea9");            // get the serial data status in Cb
/* ed53 */                   BCC.rel ("_ed50");            // loop if the data is low
                                                           // now the data is high, EOI is signalled by waiting for at least 200us without pulling
                                                           // the serial clock line low again. the listener should respond by pulling the serial
                                                           // data line low
/* ed55 */        _`_ed55`;  JSR.abs ("_eea9");            // get the serial data status in Cb
/* ed58 */                   BCS.rel ("_ed55");            // loop if the data is high
                                                           // the serial data has gone low ending the EOI sequence, now just wait for the serial
                                                           // data line to go high again or, if this isn't an EOI sequence, just wait for the serial
                                                           // data to go high the first time
/* ed5a */        _`_ed5a`;  JSR.abs ("_eea9");            // get the serial data status in Cb
/* ed5d */                   BCC.rel ("_ed5a");            // loop if the data is low
                                                           // serial data is high now pull the clock low, preferably within 60us
/* ed5f */                   JSR.abs ("_ee8e");            // set the serial clock out low
                                                           // now the C64 has to send the eight bits, LSB first. first it sets the serial data line
                                                           // to reflect the bit in the byte, then it sets the serial clock to high. The serial
                                                           // clock is left high for 26 cycles, 23us on a PAL Vic, before it is again pulled low
                                                           // and the serial data is allowed high again
/* ed62 */                   LDA.imm (0x08);               // eight bits to do
/* ed64 */                   STA.zpg ("cntdn_00a5");       // set serial bus bit count
/* ed66 */        _`_ed66`;  LDA.abs ("ci2pra_dd00");      // read VIA 2 DRA, serial port and video address
/* ed69 */                   CMP.abs ("ci2pra_dd00");      // compare it with itself
/* ed6c */                   BNE.rel ("_ed66");            // if changed go try again
/* ed6e */                   ASL.acc ();                   // shift the serial data into Cb
/* ed6f */                   BCC.rel ("_edb0");            // if the serial data is low go do serial bus timeout
/* ed71 */                   ROR.zpg ("bsour_0095");       // rotate the transmit byte
/* ed73 */                   BCS.rel ("_ed7a");            // if the bit = 1 go set the serial data out high
/* ed75 */                   JSR.abs ("_eea0");            // else set the serial data out low
/* ed78 */                   BNE.rel ("_ed7d");            // continue, branch always
/* ed7a */        _`_ed7a`;  JSR.abs ("_ee97");            // set the serial data out high
/* ed7d */        _`_ed7d`;  JSR.abs ("_ee85");            // set the serial clock out high
/* ed80 */                   NOP.imp ();                   // waste ..
/* ed81 */                   NOP.imp ();                   // .. a ..
/* ed82 */                   NOP.imp ();                   // .. cycle ..
/* ed83 */                   NOP.imp ();                   // .. or two
/* ed84 */                   LDA.abs ("ci2pra_dd00");      // read VIA 2 DRA, serial port and video address
/* ed87 */                   AND.imm (0xdf);               // mask xx0x xxxx, set the serial data out high
/* ed89 */                   ORA.imm (0x10);               // mask xxx1 xxxx, set the serial clock out low
/* ed8b */                   STA.abs ("ci2pra_dd00");      // save VIA 2 DRA, serial port and video address
/* ed8e */                   DEC.zpg ("cntdn_00a5");       // decrement the serial bus bit count
/* ed90 */                   BNE.rel ("_ed66");            // loop if not all done
                                                           // now all eight bits have been sent it's up to the peripheral to signal the byte was
                                                           // received by pulling the serial data low. this should be done within one milisecond
/* ed92 */                   LDA.imm (0x04);               // wait for up to about 1ms
/* ed94 */                   STA.abs ("timbhi_dc07");      // save VIA 1 timer B high byte
/* ed97 */                   LDA.imm (0x19);               // load timer B, timer B single shot, start timer B
/* ed99 */                   STA.abs ("ciacrb_dc0f");      // save VIA 1 CRB
/* ed9c */                   LDA.abs ("ciaicr_dc0d");      // read VIA 1 ICR
/* ed9f */        _`_ed9f`;  LDA.abs ("ciaicr_dc0d");      // read VIA 1 ICR
/* eda2 */                   AND.imm (0x02);               // mask 0000 00x0, timer A interrupt
/* eda4 */                   BNE.rel ("_edb0");            // if timer A interrupt go do serial bus timeout
/* eda6 */                   JSR.abs ("_eea9");            // get the serial data status in Cb
/* eda9 */                   BCS.rel ("_ed9f");            // if the serial data is high go wait some more
/* edab */                   CLI.imp ();                   // enable the interrupts
/* edac */                   RTS.imp ();
                                                           // device not present
/* edad */        _`_edad`;  LDA.imm (0x80);               // error $80, device not present
/* edaf */                   _.bytes(0x2c);                // makes next line BIT $03A9
                                                           // timeout on serial bus
/* edb0 */        _`_edb0`;  LDA.imm (0x03);               // error $03, read timeout, write timeout
/* edb2 */        _`_edb2`;  JSR.abs ("_fe1c");            // OR into the serial status byte
/* edb5 */                   CLI.imp ();                   // enable the interrupts
/* edb6 */                   CLC.imp ();                   // clear for branch
/* edb7 */                   BCC.rel ("_ee03");            // ATN high, delay, clock high then data high, branch always

// ------------------------------------------------------- // send secondary address after LISTEN
/* edb9 */  _`second_edb9`;  STA.zpg ("bsour_0095");       // save the defered Tx byte
/* edbb */                   JSR.abs ("_ed36");            // set the serial clk/data, wait and Tx the byte

// ------------------------------------------------------- // set serial ATN high
/* edbe */        _`_edbe`;  LDA.abs ("ci2pra_dd00");      // read VIA 2 DRA, serial port and video address
/* edc1 */                   AND.imm (0xf7);               // mask xxxx 0xxx, set serial ATN high
/* edc3 */                   STA.abs ("ci2pra_dd00");      // save VIA 2 DRA, serial port and video address
/* edc6 */                   RTS.imp ();

// ------------------------------------------------------- // send secondary address after TALK
/* edc7 */    _`tksa_edc7`;  STA.zpg ("bsour_0095");       // save the defered Tx byte
/* edc9 */                   JSR.abs ("_ed36");            // set the serial clk/data, wait and Tx the byte

// ------------------------------------------------------- // wait for the serial bus end after send
                                                           // return address from patch 6
/* edcc */        _`_edcc`;  SEI.imp ();                   // disable the interrupts
/* edcd */                   JSR.abs ("_eea0");            // set the serial data out low
/* edd0 */                   JSR.abs ("_edbe");            // set serial ATN high
/* edd3 */                   JSR.abs ("_ee85");            // set the serial clock out high
/* edd6 */        _`_edd6`;  JSR.abs ("_eea9");            // get the serial data status in Cb
/* edd9 */                   BMI.rel ("_edd6");            // loop if the clock is high
/* eddb */                   CLI.imp ();                   // enable the interrupts
/* eddc */                   RTS.imp ();

// ------------------------------------------------------- // output a byte to the serial bus
/* eddd */   _`ciout_eddd`;  BIT.zpg ("c3po_0094");        // test the deferred character flag
/* eddf */                   BMI.rel ("_ede6");            // if there is a defered character go send it
/* ede1 */                   SEC.imp ();                   // set carry
/* ede2 */                   ROR.zpg ("c3po_0094");        // shift into the deferred character flag
/* ede4 */                   BNE.rel ("_edeb");            // save the byte and exit, branch always
/* ede6 */        _`_ede6`;  PHA.imp ();                   // save the byte
/* ede7 */                   JSR.abs ("_ed40");            // Tx byte on serial bus
/* edea */                   PLA.imp ();                   // restore the byte
/* edeb */        _`_edeb`;  STA.zpg ("bsour_0095");       // save the defered Tx byte
/* eded */                   CLC.imp ();                   // flag ok
/* edee */                   RTS.imp ();

// ------------------------------------------------------- // command serial bus to UNTALK
/* edef */   _`untlk_edef`;  SEI.imp ();                   // disable the interrupts
/* edf0 */                   JSR.abs ("_ee8e");            // set the serial clock out low
/* edf3 */                   LDA.abs ("ci2pra_dd00");      // read VIA 2 DRA, serial port and video address
/* edf6 */                   ORA.imm (0x08);               // mask xxxx 1xxx, set the serial ATN low
/* edf8 */                   STA.abs ("ci2pra_dd00");      // save VIA 2 DRA, serial port and video address
/* edfb */                   LDA.imm (0x5f);               // set the UNTALK command
/* edfd */                   _.bytes(0x2c);                // makes next line BIT $3FA9

// ------------------------------------------------------- // command serial bus to UNLISTEN
/* edfe */   _`unlsn_edfe`;  LDA.imm (0x3f);               // set the UNLISTEN command
/* ee00 */                   JSR.abs ("_ed11");            // send a control character
/* ee03 */        _`_ee03`;  JSR.abs ("_edbe");            // set serial ATN high
                                                           // 1ms delay, clock high then data high
/* ee06 */        _`_ee06`;  TXA.imp ();                   // save the device number
/* ee07 */                   LDX.imm (0x0a);               // short delay
/* ee09 */        _`_ee09`;  DEX.imp ();                   // decrement the count
/* ee0a */                   BNE.rel ("_ee09");            // loop if not all done
/* ee0c */                   TAX.imp ();                   // restore the device number
/* ee0d */                   JSR.abs ("_ee85");            // set the serial clock out high
/* ee10 */                   JMP.abs ("_ee97");            // set the serial data out high and return

// ------------------------------------------------------- // input a byte from the serial bus
/* ee13 */   _`acptr_ee13`;  SEI.imp ();                   // disable the interrupts
/* ee14 */                   LDA.imm (0x00);               // set 0 bits to do, will flag EOI on timeour
/* ee16 */                   STA.zpg ("cntdn_00a5");       // save the serial bus bit count
/* ee18 */                   JSR.abs ("_ee85");            // set the serial clock out high
/* ee1b */        _`_ee1b`;  JSR.abs ("_eea9");            // get the serial data status in Cb
/* ee1e */                   BPL.rel ("_ee1b");            // loop if the serial clock is low
/* ee20 */        _`_ee20`;  LDA.imm (0x01);               // set the timeout count high byte
/* ee22 */                   STA.abs ("timbhi_dc07");      // save VIA 1 timer B high byte
/* ee25 */                   LDA.imm (0x19);               // load timer B, timer B single shot, start timer B
/* ee27 */                   STA.abs ("ciacrb_dc0f");      // save VIA 1 CRB
/* ee2a */                   JSR.abs ("_ee97");            // set the serial data out high
/* ee2d */                   LDA.abs ("ciaicr_dc0d");      // read VIA 1 ICR
/* ee30 */        _`_ee30`;  LDA.abs ("ciaicr_dc0d");      // read VIA 1 ICR
/* ee33 */                   AND.imm (0x02);               // mask 0000 00x0, timer A interrupt
/* ee35 */                   BNE.rel ("_ee3e");            // if timer A interrupt go ??
/* ee37 */                   JSR.abs ("_eea9");            // get the serial data status in Cb
/* ee3a */                   BMI.rel ("_ee30");            // loop if the serial clock is low
/* ee3c */                   BPL.rel ("_ee56");            // else go set 8 bits to do, branch always
                                                           // timer A timed out
/* ee3e */        _`_ee3e`;  LDA.zpg ("cntdn_00a5");       // get the serial bus bit count
/* ee40 */                   BEQ.rel ("_ee47");            // if not already EOI then go flag EOI
/* ee42 */                   LDA.imm (0x02);               // else error $02, read timeour
/* ee44 */                   JMP.abs ("_edb2");            // set the serial status and exit
/* ee47 */        _`_ee47`;  JSR.abs ("_eea0");            // set the serial data out low
/* ee4a */                   JSR.abs ("_ee85");            // set the serial clock out high
/* ee4d */                   LDA.imm (0x40);               // set EOI
/* ee4f */                   JSR.abs ("_fe1c");            // OR into the serial status byte
/* ee52 */                   INC.zpg ("cntdn_00a5");       // increment the serial bus bit count, do error on the next
                                                           // timeout
/* ee54 */                   BNE.rel ("_ee20");            // go try again, branch always
/* ee56 */        _`_ee56`;  LDA.imm (0x08);               // set 8 bits to do
/* ee58 */                   STA.zpg ("cntdn_00a5");       // save the serial bus bit count
/* ee5a */        _`_ee5a`;  LDA.abs ("ci2pra_dd00");      // read VIA 2 DRA, serial port and video address
/* ee5d */                   CMP.abs ("ci2pra_dd00");      // compare it with itself
/* ee60 */                   BNE.rel ("_ee5a");            // if changing go try again
/* ee62 */                   ASL.acc ();                   // shift the serial data into the carry
/* ee63 */                   BPL.rel ("_ee5a");            // loop while the serial clock is low
/* ee65 */                   ROR.zpg ("tbtcnt_00a4");      // shift the data bit into the receive byte
/* ee67 */        _`_ee67`;  LDA.abs ("ci2pra_dd00");      // read VIA 2 DRA, serial port and video address
/* ee6a */                   CMP.abs ("ci2pra_dd00");      // compare it with itself
/* ee6d */                   BNE.rel ("_ee67");            // if changing go try again
/* ee6f */                   ASL.acc ();                   // shift the serial data into the carry
/* ee70 */                   BMI.rel ("_ee67");            // loop while the serial clock is high
/* ee72 */                   DEC.zpg ("cntdn_00a5");       // decrement the serial bus bit count
/* ee74 */                   BNE.rel ("_ee5a");            // loop if not all done
/* ee76 */                   JSR.abs ("_eea0");            // set the serial data out low
/* ee79 */                   BIT.zpg ("status_0090");      // test the serial status byte
/* ee7b */                   BVC.rel ("_ee80");            // if EOI not set skip the bus end sequence
/* ee7d */                   JSR.abs ("_ee06");            // 1ms delay, clock high then data high
/* ee80 */        _`_ee80`;  LDA.zpg ("tbtcnt_00a4");      // get the receive byte
/* ee82 */                   CLI.imp ();                   // enable the interrupts
/* ee83 */                   CLC.imp ();                   // flag ok
/* ee84 */                   RTS.imp ();

// ------------------------------------------------------- // set the serial clock out high
/* ee85 */        _`_ee85`;  LDA.abs ("ci2pra_dd00");      // read VIA 2 DRA, serial port and video address
/* ee88 */                   AND.imm (0xef);               // mask xxx0 xxxx, set serial clock out high
/* ee8a */                   STA.abs ("ci2pra_dd00");      // save VIA 2 DRA, serial port and video address
/* ee8d */                   RTS.imp ();

// ------------------------------------------------------- // set the serial clock out low
/* ee8e */        _`_ee8e`;  LDA.abs ("ci2pra_dd00");      // read VIA 2 DRA, serial port and video address
/* ee91 */                   ORA.imm (0x10);               // mask xxx1 xxxx, set serial clock out low
/* ee93 */                   STA.abs ("ci2pra_dd00");      // save VIA 2 DRA, serial port and video address
/* ee96 */                   RTS.imp ();

// ------------------------------------------------------- // set the serial data out high
/* ee97 */        _`_ee97`;  LDA.abs ("ci2pra_dd00");      // read VIA 2 DRA, serial port and video address
/* ee9a */                   AND.imm (0xdf);               // mask xx0x xxxx, set serial data out high
/* ee9c */                   STA.abs ("ci2pra_dd00");      // save VIA 2 DRA, serial port and video address
/* ee9f */                   RTS.imp ();

// ------------------------------------------------------- // set the serial data out low
/* eea0 */        _`_eea0`;  LDA.abs ("ci2pra_dd00");      // read VIA 2 DRA, serial port and video address
/* eea3 */                   ORA.imm (0x20);               // mask xx1x xxxx, set serial data out low
/* eea5 */                   STA.abs ("ci2pra_dd00");      // save VIA 2 DRA, serial port and video address
/* eea8 */                   RTS.imp ();

// ------------------------------------------------------- // get the serial data status in Cb
/* eea9 */        _`_eea9`;  LDA.abs ("ci2pra_dd00");      // read VIA 2 DRA, serial port and video address
/* eeac */                   CMP.abs ("ci2pra_dd00");      // compare it with itself
/* eeaf */                   BNE.rel ("_eea9");            // if changing got try again
/* eeb1 */                   ASL.acc ();                   // shift the serial data into Cb
/* eeb2 */                   RTS.imp ();

// ------------------------------------------------------- // 1ms delay
/* eeb3 */        _`_eeb3`;  TXA.imp ();                   // save X
/* eeb4 */                   LDX.imm (0xb8);               // set the loop count
/* eeb6 */        _`_eeb6`;  DEX.imp ();                   // decrement the loop count
/* eeb7 */                   BNE.rel ("_eeb6");            // loop if more to do
/* eeb9 */                   TAX.imp ();                   // restore X
/* eeba */                   RTS.imp ();

// ------------------------------------------------------- // RS232 Tx NMI routine
/* eebb */        _`_eebb`;  LDA.zpg ("bitts_00b4");       // get RS232 bit count
/* eebd */                   BEQ.rel ("_ef06");            // if zero go setup next RS232 Tx byte and return
/* eebf */                   BMI.rel ("_ef00");            // if -ve go do stop bit(s)
                                                           // else bit count is non zero and +ve
/* eec1 */                   LSR.zpg ("rodata_00b6");      // shift RS232 output byte buffer
/* eec3 */                   LDX.imm (0x00);               // set $00 for bit = 0
/* eec5 */                   BCC.rel ("_eec8");            // branch if bit was 0
/* eec7 */                   DEX.imp ();                   // set $FF for bit = 1
/* eec8 */        _`_eec8`;  TXA.imp ();                   // copy bit to A
/* eec9 */                   EOR.zpg ("roprty_00bd");      // EOR with RS232 parity byte
/* eecb */                   STA.zpg ("roprty_00bd");      // save RS232 parity byte
/* eecd */                   DEC.zpg ("bitts_00b4");       // decrement RS232 bit count
/* eecf */                   BEQ.rel ("_eed7");            // if RS232 bit count now zero go do parity bit
                                                           // save bit and exit
/* eed1 */        _`_eed1`;  TXA.imp ();                   // copy bit to A
/* eed2 */                   AND.imm (0x04);               // mask 0000 0x00, RS232 Tx DATA bit
/* eed4 */                   STA.zpg ("nxtbit_00b5");      // save the next RS232 data bit to send
/* eed6 */                   RTS.imp ();

// ------------------------------------------------------- // do RS232 parity bit, enters with RS232 bit count = 0
/* eed7 */        _`_eed7`;  LDA.imm (0x20);               // mask 00x0 0000, parity enable bit
/* eed9 */                   BIT.abs ("m51cdr_0294");      // test the pseudo 6551 command register
/* eedc */                   BEQ.rel ("_eef2");            // if parity disabled go ??
/* eede */                   BMI.rel ("_eefc");            // if fixed mark or space parity go ??
/* eee0 */                   BVS.rel ("_eef6");            // if even parity go ??
                                                           // else odd parity
/* eee2 */                   LDA.zpg ("roprty_00bd");      // get RS232 parity byte
/* eee4 */                   BNE.rel ("_eee7");            // if parity not zero leave parity bit = 0
/* eee6 */        _`_eee6`;  DEX.imp ();                   // make parity bit = 1
/* eee7 */        _`_eee7`;  DEC.zpg ("bitts_00b4");       // decrement RS232 bit count, 1 stop bit
/* eee9 */                   LDA.abs ("m51ctr_0293");      // get pseudo 6551 control register
/* eeec */                   BPL.rel ("_eed1");            // if 1 stop bit save parity bit and exit
                                                           // else two stop bits ..
/* eeee */                   DEC.zpg ("bitts_00b4");       // decrement RS232 bit count, 2 stop bits
/* eef0 */                   BNE.rel ("_eed1");            // save bit and exit, branch always
                                                           // parity is disabled so the parity bit becomes the first,
                                                           // and possibly only, stop bit. to do this increment the bit
                                                           // count which effectively decrements the stop bit count.
/* eef2 */        _`_eef2`;  INC.zpg ("bitts_00b4");       // increment RS232 bit count, = -1 stop bit
/* eef4 */                   BNE.rel ("_eee6");            // set stop bit = 1 and exit
                                                           // do even parity
/* eef6 */        _`_eef6`;  LDA.zpg ("roprty_00bd");      // get RS232 parity byte
/* eef8 */                   BEQ.rel ("_eee7");            // if parity zero leave parity bit = 0
/* eefa */                   BNE.rel ("_eee6");            // else make parity bit = 1, branch always
                                                           // fixed mark or space parity
/* eefc */        _`_eefc`;  BVS.rel ("_eee7");            // if fixed space parity leave parity bit = 0
/* eefe */                   BVC.rel ("_eee6");            // else fixed mark parity make parity bit = 1, branch always
                                                           // decrement stop bit count, set stop bit = 1 and exit. $FF is one stop bit, $FE is two
                                                           // stop bits
/* ef00 */        _`_ef00`;  INC.zpg ("bitts_00b4");       // decrement RS232 bit count
/* ef02 */                   LDX.imm (0xff);               // set stop bit = 1
/* ef04 */                   BNE.rel ("_eed1");            // save stop bit and exit, branch always

// ------------------------------------------------------- // setup next RS232 Tx byte
/* ef06 */        _`_ef06`;  LDA.abs ("m51cdr_0294");      // read the 6551 pseudo command register
/* ef09 */                   LSR.acc ();                   // handshake bit inot Cb
/* ef0a */                   BCC.rel ("_ef13");            // if 3 line interface go ??
/* ef0c */                   BIT.abs ("ci2prb_dd01");      // test VIA 2 DRB, RS232 port
/* ef0f */                   BPL.rel ("_ef2e");            // if DSR = 0 set DSR signal not present and exit
/* ef11 */                   BVC.rel ("_ef31");            // if CTS = 0 set CTS signal not present and exit
                                                           // was 3 line interface
/* ef13 */        _`_ef13`;  LDA.imm (0x00);               // clear A
/* ef15 */                   STA.zpg ("roprty_00bd");      // clear the RS232 parity byte
/* ef17 */                   STA.zpg ("nxtbit_00b5");      // clear the RS232 next bit to send
/* ef19 */                   LDX.abs ("bitnum_0298");      // get the number of bits to be sent/received
/* ef1c */                   STX.zpg ("bitts_00b4");       // set the RS232 bit count
/* ef1e */                   LDY.abs ("rodbs_029d");       // get the index to the Tx buffer start
/* ef21 */                   CPY.abs ("rodbe_029e");       // compare it with the index to the Tx buffer end
/* ef24 */                   BEQ.rel ("_ef39");            // if all done go disable T?? interrupt and return
/* ef26 */                   LDA.iny ("robuf+0_00f9");     // else get a byte from the buffer
/* ef28 */                   STA.zpg ("rodata_00b6");      // save it to the RS232 output byte buffer
/* ef2a */                   INC.abs ("rodbs_029d");       // increment the index to the Tx buffer start
/* ef2d */                   RTS.imp ();

// ------------------------------------------------------- // set DSR signal not present
/* ef2e */        _`_ef2e`;  LDA.imm (0x40);               // set DSR signal not present
/* ef30 */                   _.bytes(0x2c);                // makes next line BIT $10A9

// ------------------------------------------------------- // set CTS signal not present
/* ef31 */        _`_ef31`;  LDA.imm (0x10);               // set CTS signal not present
/* ef33 */                   ORA.abs ("rsstat_0297");      // OR it with the RS232 status register
/* ef36 */                   STA.abs ("rsstat_0297");      // save the RS232 status register

// ------------------------------------------------------- // disable timer A interrupt
/* ef39 */        _`_ef39`;  LDA.imm (0x01);               // disable timer A interrupt

// ------------------------------------------------------- // set VIA 2 ICR from A
/* ef3b */        _`_ef3b`;  STA.abs ("ci2icr_dd0d");      // save VIA 2 ICR
/* ef3e */                   EOR.abs ("enabl_02a1");       // EOR with the RS-232 interrupt enable byte
/* ef41 */                   ORA.imm (0x80);               // set the interrupts enable bit
/* ef43 */                   STA.abs ("enabl_02a1");       // save the RS-232 interrupt enable byte
/* ef46 */                   STA.abs ("ci2icr_dd0d");      // save VIA 2 ICR
/* ef49 */                   RTS.imp ();

// ------------------------------------------------------- // compute bit count
/* ef4a */        _`_ef4a`;  LDX.imm (0x09);               // set bit count to 9, 8 data + 1 stop bit
/* ef4c */                   LDA.imm (0x20);               // mask for 8/7 data bits
/* ef4e */                   BIT.abs ("m51ctr_0293");      // test pseudo 6551 control register
/* ef51 */                   BEQ.rel ("_ef54");            // branch if 8 bits
/* ef53 */                   DEX.imp ();                   // else decrement count for 7 data bits
/* ef54 */        _`_ef54`;  BVC.rel ("_ef58");            // branch if 7 bits
/* ef56 */                   DEX.imp ();                   // else decrement count ..
/* ef57 */                   DEX.imp ();                   // .. for 5 data bits
/* ef58 */        _`_ef58`;  RTS.imp ();

// ------------------------------------------------------- // RS232 Rx NMI
/* ef59 */        _`_ef59`;  LDX.zpg ("rinone_00a9");      // get start bit check flag
/* ef5b */                   BNE.rel ("_ef90");            // if no start bit received go ??
/* ef5d */                   DEC.zpg ("bitci_00a8");       // decrement receiver bit count in
/* ef5f */                   BEQ.rel ("_ef97");            // if the byte is complete go add it to the buffer
/* ef61 */                   BMI.rel ("_ef70");
/* ef63 */                   LDA.zpg ("inbit_00a7");       // get the RS232 received data bit
/* ef65 */                   EOR.zpg ("riprty_00ab");      // EOR with the receiver parity bit
/* ef67 */                   STA.zpg ("riprty_00ab");      // save the receiver parity bit
/* ef69 */                   LSR.zpg ("inbit_00a7");       // shift the RS232 received data bit
/* ef6b */                   ROR.zpg ("ridata_00aa");
/* ef6d */        _`_ef6d`;  RTS.imp ();
/* ef6e */        _`_ef6e`;  DEC.zpg ("bitci_00a8");       // decrement receiver bit count in
/* ef70 */        _`_ef70`;  LDA.zpg ("inbit_00a7");       // get the RS232 received data bit
/* ef72 */                   BEQ.rel ("_efdb");
/* ef74 */                   LDA.abs ("m51ctr_0293");      // get pseudo 6551 control register
/* ef77 */                   ASL.acc ();                   // shift the stop bit flag to Cb
/* ef78 */                   LDA.imm (0x01);               // + 1
/* ef7a */                   ADC.zpg ("bitci_00a8");       // add receiver bit count in
/* ef7c */                   BNE.rel ("_ef6d");            // exit, branch always

// ------------------------------------------------------- // setup to receive an RS232 bit
/* ef7e */        _`_ef7e`;  LDA.imm (0x90);               // enable FLAG interrupt
/* ef80 */                   STA.abs ("ci2icr_dd0d");      // save VIA 2 ICR
/* ef83 */                   ORA.abs ("enabl_02a1");       // OR with the RS-232 interrupt enable byte
/* ef86 */                   STA.abs ("enabl_02a1");       // save the RS-232 interrupt enable byte
/* ef89 */                   STA.zpg ("rinone_00a9");      // set start bit check flag, set no start bit received
/* ef8b */                   LDA.imm (0x02);               // disable timer B interrupt
/* ef8d */                   JMP.abs ("_ef3b");            // set VIA 2 ICR from A and return

// ------------------------------------------------------- // no RS232 start bit received
/* ef90 */        _`_ef90`;  LDA.zpg ("inbit_00a7");       // get the RS232 received data bit
/* ef92 */                   BNE.rel ("_ef7e");            // if ?? go setup to receive an RS232 bit and return
/* ef94 */                   JMP.abs ("_e4d3");            // flag the RS232 start bit and set the parity

// ------------------------------------------------------- // received a whole byte, add it to the buffer
/* ef97 */        _`_ef97`;  LDY.abs ("ridbe_029b");       // get index to Rx buffer end
/* ef9a */                   INY.imp ();                   // increment index
/* ef9b */                   CPY.abs ("ridbs_029c");       // compare with index to Rx buffer start
/* ef9e */                   BEQ.rel ("_efca");            // if buffer full go do Rx overrun error
/* efa0 */                   STY.abs ("ridbe_029b");       // save index to Rx buffer end
/* efa3 */                   DEY.imp ();                   // decrement index
/* efa4 */                   LDA.zpg ("ridata_00aa");      // get assembled byte
/* efa6 */                   LDX.abs ("bitnum_0298");      // get bit count
/* efa9 */        _`_efa9`;  CPX.imm (0x09);               // compare with byte + stop
/* efab */                   BEQ.rel ("_efb1");            // branch if all nine bits received
/* efad */                   LSR.acc ();                   // else shift byte
/* efae */                   INX.imp ();                   // increment bit count
/* efaf */                   BNE.rel ("_efa9");            // loop, branch always
/* efb1 */        _`_efb1`;  STA.iny ("ribuf+0_00f7");     // save received byte to Rx buffer
/* efb3 */                   LDA.imm (0x20);               // mask 00x0 0000, parity enable bit
/* efb5 */                   BIT.abs ("m51cdr_0294");      // test the pseudo 6551 command register
/* efb8 */                   BEQ.rel ("_ef6e");            // branch if parity disabled
/* efba */                   BMI.rel ("_ef6d");            // branch if mark or space parity
/* efbc */                   LDA.zpg ("inbit_00a7");       // get the RS232 received data bit
/* efbe */                   EOR.zpg ("riprty_00ab");      // EOR with the receiver parity bit
/* efc0 */                   BEQ.rel ("_efc5");
/* efc2 */                   BVS.rel ("_ef6d");            // if ?? just exit
/* efc4 */                   _.bytes(0x2c);                // makes next line BIT $A650
/* efc5 */        _`_efc5`;  BVC.rel ("_ef6d");            // if ?? just exit
/* efc7 */                   LDA.imm (0x01);               // set Rx parity error
/* efc9 */                   _.bytes(0x2c);                // makes next line BIT $04A9
/* efca */        _`_efca`;  LDA.imm (0x04);               // set Rx overrun error
/* efcc */                   _.bytes(0x2c);                // makes next line BIT $80A9
/* efcd */        _`_efcd`;  LDA.imm (0x80);               // set Rx break error
/* efcf */                   _.bytes(0x2c);                // makes next line BIT $02A9
/* efd0 */        _`_efd0`;  LDA.imm (0x02);               // set Rx frame error
/* efd2 */                   ORA.abs ("rsstat_0297");      // OR it with the RS232 status byte
/* efd5 */                   STA.abs ("rsstat_0297");      // save the RS232 status byte
/* efd8 */                   JMP.abs ("_ef7e");            // setup to receive an RS232 bit and return
/* efdb */        _`_efdb`;  LDA.zpg ("ridata_00aa");
/* efdd */                   BNE.rel ("_efd0");            // if ?? do frame error
/* efdf */                   BEQ.rel ("_efcd");            // else do break error, branch always

// ------------------------------------------------------- // open RS232 channel for output
/* efe1 */        _`_efe1`;  STA.zpg ("dflto_009a");       // save the output device number
/* efe3 */                   LDA.abs ("m51cdr_0294");      // read the pseudo 6551 command register
/* efe6 */                   LSR.acc ();                   // shift handshake bit to carry
/* efe7 */                   BCC.rel ("_f012");            // if 3 line interface go ??
/* efe9 */                   LDA.imm (0x02);               // mask 0000 00x0, RTS out
/* efeb */                   BIT.abs ("ci2prb_dd01");      // test VIA 2 DRB, RS232 port
/* efee */                   BPL.rel ("_f00d");            // if DSR = 0 set DSR not present and exit
/* eff0 */                   BNE.rel ("_f012");            // if RTS = 1 just exit
/* eff2 */        _`_eff2`;  LDA.abs ("enabl_02a1");       // get the RS-232 interrupt enable byte
/* eff5 */                   AND.imm (0x02);               // mask 0000 00x0, timer B interrupt
/* eff7 */                   BNE.rel ("_eff2");            // loop while the timer B interrupt is enebled
/* eff9 */        _`_eff9`;  BIT.abs ("ci2prb_dd01");      // test VIA 2 DRB, RS232 port
/* effc */                   BVS.rel ("_eff9");            // loop while CTS high
/* effe */                   LDA.abs ("ci2prb_dd01");      // read VIA 2 DRB, RS232 port
/* f001 */                   ORA.imm (0x02);               // mask xxxx xx1x, set RTS high
/* f003 */                   STA.abs ("ci2prb_dd01");      // save VIA 2 DRB, RS232 port
/* f006 */        _`_f006`;  BIT.abs ("ci2prb_dd01");      // test VIA 2 DRB, RS232 port
/* f009 */                   BVS.rel ("_f012");            // exit if CTS high
/* f00b */                   BMI.rel ("_f006");            // loop while DSR high
                                                           // set no DSR and exit
/* f00d */        _`_f00d`;  LDA.imm (0x40);               // set DSR signal not present
/* f00f */                   STA.abs ("rsstat_0297");      // save the RS232 status register
/* f012 */        _`_f012`;  CLC.imp ();                   // flag ok
/* f013 */                   RTS.imp ();

// ------------------------------------------------------- // send byte to the RS232 buffer
/* f014 */        _`_f014`;  JSR.abs ("_f028");            // setup for RS232 transmit
                                                           // send byte to the RS232 buffer, no setup
/* f017 */        _`_f017`;  LDY.abs ("rodbe_029e");       // get index to Tx buffer end
/* f01a */                   INY.imp ();                   // + 1
/* f01b */                   CPY.abs ("rodbs_029d");       // compare with index to Tx buffer start
/* f01e */                   BEQ.rel ("_f014");            // loop while buffer full
/* f020 */                   STY.abs ("rodbe_029e");       // set index to Tx buffer end
/* f023 */                   DEY.imp ();                   // index to available buffer byte
/* f024 */                   LDA.zpg ("ptr1_009e");        // read the RS232 character buffer
/* f026 */                   STA.iny ("robuf+0_00f9");     // save the byte to the buffer

// ------------------------------------------------------- // setup for RS232 transmit
/* f028 */        _`_f028`;  LDA.abs ("enabl_02a1");       // get the RS-232 interrupt enable byte
/* f02b */                   LSR.acc ();                   // shift the enable bit to Cb
/* f02c */                   BCS.rel ("_f04c");            // if interrupts are enabled just exit
/* f02e */                   LDA.imm (0x10);               // start timer A
/* f030 */                   STA.abs ("ci2cra_dd0e");      // save VIA 2 CRA
/* f033 */                   LDA.abs ("baudof+0_0299");    // get the baud rate bit time low byte
/* f036 */                   STA.abs ("ti2alo_dd04");      // save VIA 2 timer A low byte
/* f039 */                   LDA.abs ("baudof+1_029a");    // get the baud rate bit time high byte
/* f03c */                   STA.abs ("ti2ahi_dd05");      // save VIA 2 timer A high byte
/* f03f */                   LDA.imm (0x81);               // enable timer A interrupt
/* f041 */                   JSR.abs ("_ef3b");            // set VIA 2 ICR from A
/* f044 */                   JSR.abs ("_ef06");            // setup next RS232 Tx byte
/* f047 */                   LDA.imm (0x11);               // load timer A, start timer A
/* f049 */                   STA.abs ("ci2cra_dd0e");      // save VIA 2 CRA
/* f04c */        _`_f04c`;  RTS.imp ();

// ------------------------------------------------------- // input from RS232 buffer
/* f04d */        _`_f04d`;  STA.zpg ("dfltn_0099");       // save the input device number
/* f04f */                   LDA.abs ("m51cdr_0294");      // get pseudo 6551 command register
/* f052 */                   LSR.acc ();                   // shift the handshake bit to Cb
/* f053 */                   BCC.rel ("_f07d");            // if 3 line interface go ??
/* f055 */                   AND.imm (0x08);               // mask the duplex bit, pseudo 6551 command is >> 1
/* f057 */                   BEQ.rel ("_f07d");            // if full duplex go ??
/* f059 */                   LDA.imm (0x02);               // mask 0000 00x0, RTS out
/* f05b */                   BIT.abs ("ci2prb_dd01");      // test VIA 2 DRB, RS232 port
/* f05e */                   BPL.rel ("_f00d");            // if DSR = 0 set no DSR and exit
/* f060 */                   BEQ.rel ("_f084");            // if RTS = 0 just exit
/* f062 */        _`_f062`;  LDA.abs ("enabl_02a1");       // get the RS-232 interrupt enable byte
/* f065 */                   LSR.acc ();                   // shift the timer A interrupt enable bit to Cb
/* f066 */                   BCS.rel ("_f062");            // loop while the timer A interrupt is enabled
/* f068 */                   LDA.abs ("ci2prb_dd01");      // read VIA 2 DRB, RS232 port
/* f06b */                   AND.imm (0xfd);               // mask xxxx xx0x, clear RTS out
/* f06d */                   STA.abs ("ci2prb_dd01");      // save VIA 2 DRB, RS232 port
/* f070 */        _`_f070`;  LDA.abs ("ci2prb_dd01");      // read VIA 2 DRB, RS232 port
/* f073 */                   AND.imm (0x04);               // mask xxxx x1xx, DTR in
/* f075 */                   BEQ.rel ("_f070");            // loop while DTR low
/* f077 */        _`_f077`;  LDA.imm (0x90);               // enable the FLAG interrupt
/* f079 */                   CLC.imp ();                   // flag ok
/* f07a */                   JMP.abs ("_ef3b");            // set VIA 2 ICR from A and return
/* f07d */        _`_f07d`;  LDA.abs ("enabl_02a1");       // get the RS-232 interrupt enable byte
/* f080 */                   AND.imm (0x12);               // mask 000x 00x0
/* f082 */                   BEQ.rel ("_f077");            // if FLAG or timer B bits set go enable the FLAG inetrrupt
/* f084 */        _`_f084`;  CLC.imp ();                   // flag ok
/* f085 */                   RTS.imp ();

// ------------------------------------------------------- // get byte from RS232 buffer
/* f086 */        _`_f086`;  LDA.abs ("rsstat_0297");      // get the RS232 status register
/* f089 */                   LDY.abs ("ridbs_029c");       // get index to Rx buffer start
/* f08c */                   CPY.abs ("ridbe_029b");       // compare with index to Rx buffer end
/* f08f */                   BEQ.rel ("_f09c");            // return null if buffer empty
/* f091 */                   AND.imm (0xf7);               // clear the Rx buffer empty bit
/* f093 */                   STA.abs ("rsstat_0297");      // save the RS232 status register
/* f096 */                   LDA.iny ("ribuf+0_00f7");     // get byte from Rx buffer
/* f098 */                   INC.abs ("ridbs_029c");       // increment index to Rx buffer start
/* f09b */                   RTS.imp ();
/* f09c */        _`_f09c`;  ORA.imm (0x08);               // set the Rx buffer empty bit
/* f09e */                   STA.abs ("rsstat_0297");      // save the RS232 status register
/* f0a1 */                   LDA.imm (0x00);               // return null
/* f0a3 */                   RTS.imp ();

// ------------------------------------------------------- // check RS232 bus idle
/* f0a4 */        _`_f0a4`;  PHA.imp ();                   // save A
/* f0a5 */                   LDA.abs ("enabl_02a1");       // get the RS-232 interrupt enable byte
/* f0a8 */                   BEQ.rel ("_f0bb");            // if no interrupts enabled just exit
/* f0aa */        _`_f0aa`;  LDA.abs ("enabl_02a1");       // get the RS-232 interrupt enable byte
/* f0ad */                   AND.imm (0x03);               // mask 0000 00xx, the error bits
/* f0af */                   BNE.rel ("_f0aa");            // if there are errors loop
/* f0b1 */                   LDA.imm (0x10);               // disable FLAG interrupt
/* f0b3 */                   STA.abs ("ci2icr_dd0d");      // save VIA 2 ICR
/* f0b6 */                   LDA.imm (0x00);               // clear A
/* f0b8 */                   STA.abs ("enabl_02a1");       // clear the RS-232 interrupt enable byte
/* f0bb */        _`_f0bb`;  PLA.imp ();                   // restore A
/* f0bc */                   RTS.imp ();

// ------------------------------------------------------- // kernel I/O messages
                                                           // I/O ERROR #
/* f0bd */        _`_f0bd`;  _.bytes(0x0d, 0x49, 0x2f, 0x4f, 0x20, 0x45, 0x52, 0x52);
/* f0c5 */                   _.bytes(0x4f, 0x52, 0x20, 0xa3);
                                                           // SEARCHING
/* f0c9 */                   _.bytes(0x0d, 0x53, 0x45, 0x41, 0x52, 0x43, 0x48, 0x49);
/* f0d1 */                   _.bytes(0x4e, 0x47, 0xa0);
/* f0d4 */                   _.bytes(0x46, 0x4f, 0x52, 0xa0);
                                                           // PRESS PLAY ON TAPE
/* f0d8 */                   _.bytes(0x0d, 0x50, 0x52, 0x45, 0x53, 0x53, 0x20, 0x50);
/* f0e0 */                   _.bytes(0x4c, 0x41, 0x59, 0x20, 0x4f, 0x4e, 0x20, 0x54);
/* f0e8 */                   _.bytes(0x41, 0x50, 0xc5);
                                                           // PRESS RECORD & PLAY ON TAPE
/* f0eb */                   _.bytes(0x50, 0x52, 0x45, 0x53, 0x53, 0x20, 0x52, 0x45);
/* f0f3 */                   _.bytes(0x43, 0x4f, 0x52, 0x44, 0x20, 0x26, 0x20, 0x50);
/* f0fb */                   _.bytes(0x4c, 0x41, 0x59, 0x20, 0x4f, 0x4e, 0x20, 0x54);
/* f103 */                   _.bytes(0x41, 0x50, 0xc5);
                                                           // LOADING
/* f106 */                   _.bytes(0x0d, 0x4c, 0x4f, 0x41, 0x44, 0x49, 0x4e, 0xc7);
                                                           // SAVING
/* f10e */                   _.bytes(0x0d, 0x53, 0x41, 0x56, 0x49, 0x4e, 0x47, 0xa0);
                                                           // VERIFYING
/* f116 */                   _.bytes(0x0d, 0x56, 0x45, 0x52, 0x49, 0x46, 0x59, 0x49);
/* f11e */                   _.bytes(0x4e, 0xc7);
                                                           // FOUND
/* f120 */                   _.bytes(0x0d, 0x46, 0x4f, 0x55, 0x4e, 0x44, 0xa0);
                                                           // OK
/* f127 */                   _.bytes(0x0d, 0x4f, 0x4b, 0x8d);

// ------------------------------------------------------- // display control I/O message if in direct mode
/* f12b */        _`_f12b`;  BIT.zpg ("msgflg_009d");      // test message mode flag
/* f12d */                   BPL.rel ("_f13c");            // exit if control messages off
                                                           // display kernel I/O message
/* f12f */        _`_f12f`;  LDA.aby ("_f0bd");            // get byte from message table
/* f132 */                   PHP.imp ();                   // save status
/* f133 */                   AND.imm (0x7f);               // clear b7
/* f135 */                   JSR.abs ("chrout_ffd2");      // output character to channel
/* f138 */                   INY.imp ();                   // increment index
/* f139 */                   PLP.imp ();                   // restore status
/* f13a */                   BPL.rel ("_f12f");            // loop if not end of message
/* f13c */        _`_f13c`;  CLC.imp ();
/* f13d */                   RTS.imp ();

// ------------------------------------------------------- // get character from the input device
/* f13e */   _`getin_f13e`;  LDA.zpg ("dfltn_0099");       // get the input device number
/* f140 */                   BNE.rel ("_f14a");            // if not the keyboard go handle other devices
                                                           // the input device was the keyboard
/* f142 */                   LDA.zpg ("ndx_00c6");         // get the keyboard buffer index
/* f144 */                   BEQ.rel ("_f155");            // if the buffer is empty go flag no byte and return
/* f146 */                   SEI.imp ();                   // disable the interrupts
/* f147 */                   JMP.abs ("lp2_e5b4");         // get input from the keyboard buffer and return
                                                           // the input device was not the keyboard
/* f14a */        _`_f14a`;  CMP.imm (0x02);               // compare the device with the RS232 device
/* f14c */                   BNE.rel ("_f166");            // if not the RS232 device go ??
                                                           // the input device is the RS232 device
/* f14e */        _`_f14e`;  STY.zpg ("xsav_0097");        // save Y
/* f150 */                   JSR.abs ("_f086");            // get a byte from RS232 buffer
/* f153 */                   LDY.zpg ("xsav_0097");        // restore Y
/* f155 */        _`_f155`;  CLC.imp ();                   // flag no error
/* f156 */                   RTS.imp ();

// ------------------------------------------------------- // input a character from channel
/* f157 */   _`chrin_f157`;  LDA.zpg ("dfltn_0099");       // get the input device number
/* f159 */                   BNE.rel ("_f166");            // if not the keyboard continue
                                                           // the input device was the keyboard
/* f15b */                   LDA.zpg ("pntr_00d3");        // get the cursor column
/* f15d */                   STA.zpg ("lxsp+1_00ca");      // set the input cursor column
/* f15f */                   LDA.zpg ("tblx_00d6");        // get the cursor row
/* f161 */                   STA.zpg ("lxsp+0_00c9");      // set the input cursor row
/* f163 */                   JMP.abs ("_e632");            // input from screen or keyboard
                                                           // the input device was not the keyboard
/* f166 */        _`_f166`;  CMP.imm (0x03);               // compare device number with screen
/* f168 */                   BNE.rel ("_f173");            // if not screen continue
                                                           // the input device was the screen
/* f16a */                   STA.zpg ("crsw_00d0");        // input from keyboard or screen, $xx = screen,
                                                           // $00 = keyboard
/* f16c */                   LDA.zpg ("lnmx_00d5");        // get current screen line length
/* f16e */                   STA.zpg ("indx_00c8");        // save input [EOL] pointer
/* f170 */                   JMP.abs ("_e632");            // input from screen or keyboard
                                                           // the input device was not the screen
/* f173 */        _`_f173`;  BCS.rel ("_f1ad");            // if input device > screen go do IEC devices
                                                           // the input device was < screen
/* f175 */                   CMP.imm (0x02);               // compare the device with the RS232 device
/* f177 */                   BEQ.rel ("_f1b8");            // if RS232 device go get a byte from the RS232 device
                                                           // only the tape device left ..
/* f179 */                   STX.zpg ("xsav_0097");        // save X
/* f17b */                   JSR.abs ("_f199");            // get a byte from tape
/* f17e */                   BCS.rel ("_f196");            // if error just exit
/* f180 */                   PHA.imp ();                   // save the byte
/* f181 */                   JSR.abs ("_f199");            // get the next byte from tape
/* f184 */                   BCS.rel ("_f193");            // if error just exit
/* f186 */                   BNE.rel ("_f18d");            // if end reached ??
/* f188 */                   LDA.imm (0x40);               // set EOI
/* f18a */                   JSR.abs ("_fe1c");            // OR into the serial status byte
/* f18d */        _`_f18d`;  DEC.zpg ("bufpnt_00a6");      // decrement tape buffer index
/* f18f */                   LDX.zpg ("xsav_0097");        // restore X
/* f191 */                   PLA.imp ();                   // restore the saved byte
/* f192 */                   RTS.imp ();
/* f193 */        _`_f193`;  TAX.imp ();                   // copy the error byte
/* f194 */                   PLA.imp ();                   // dump the saved byte
/* f195 */                   TXA.imp ();                   // restore error byte
/* f196 */        _`_f196`;  LDX.zpg ("xsav_0097");        // restore X
/* f198 */                   RTS.imp ();

// ------------------------------------------------------- // get byte from tape
/* f199 */        _`_f199`;  JSR.abs ("_f80d");            // bump tape pointer
/* f19c */                   BNE.rel ("_f1a9");            // if not end get next byte and exit
/* f19e */                   JSR.abs ("_f841");            // initiate tape read
/* f1a1 */                   BCS.rel ("_f1b4");            // exit if error flagged
/* f1a3 */                   LDA.imm (0x00);               // clear A
/* f1a5 */                   STA.zpg ("bufpnt_00a6");      // clear tape buffer index
/* f1a7 */                   BEQ.rel ("_f199");            // loop, branch always
/* f1a9 */        _`_f1a9`;  LDA.iny ("tape1+0_00b2");     // get next byte from buffer
/* f1ab */                   CLC.imp ();                   // flag no error
/* f1ac */                   RTS.imp ();
                                                           // input device was serial bus
/* f1ad */        _`_f1ad`;  LDA.zpg ("status_0090");      // get the serial status byte
/* f1af */                   BEQ.rel ("_f1b5");            // if no errors flagged go input byte and return
/* f1b1 */        _`_f1b1`;  LDA.imm (0x0d);               // else return [EOL]
/* f1b3 */        _`_f1b3`;  CLC.imp ();                   // flag no error
/* f1b4 */        _`_f1b4`;  RTS.imp ();
/* f1b5 */        _`_f1b5`;  JMP.abs ("acptr_ee13");       // input byte from serial bus and return
                                                           // input device was RS232 device
/* f1b8 */        _`_f1b8`;  JSR.abs ("_f14e");            // get byte from RS232 device
/* f1bb */                   BCS.rel ("_f1b4");            // branch if error, this doesn't get taken as the last
                                                           // instruction in the get byte from RS232 device routine
                                                           // is CLC ??
/* f1bd */                   CMP.imm (0x00);               // compare with null
/* f1bf */                   BNE.rel ("_f1b3");            // exit if not null
/* f1c1 */                   LDA.abs ("rsstat_0297");      // get the RS232 status register
/* f1c4 */                   AND.imm (0x60);               // mask 0xx0 0000, DSR detected and ??
/* f1c6 */                   BNE.rel ("_f1b1");            // if ?? return null
/* f1c8 */                   BEQ.rel ("_f1b8");            // else loop, branch always

// ------------------------------------------------------- // output character to channel
/* f1ca */  _`chrout_f1ca`;  PHA.imp ();                   // save the character to output
/* f1cb */                   LDA.zpg ("dflto_009a");       // get the output device number
/* f1cd */                   CMP.imm (0x03);               // compare the output device with the screen
/* f1cf */                   BNE.rel ("_f1d5");            // if not the screen go ??
/* f1d1 */                   PLA.imp ();                   // else restore the output character
/* f1d2 */                   JMP.abs ("_e716");            // go output the character to the screen
/* f1d5 */        _`_f1d5`;  BCC.rel ("_f1db");            // if < screen go ??
/* f1d7 */                   PLA.imp ();                   // else restore the output character
/* f1d8 */                   JMP.abs ("ciout_eddd");       // go output the character to the serial bus
/* f1db */        _`_f1db`;  LSR.acc ();                   // shift b0 of the device into Cb
/* f1dc */                   PLA.imp ();                   // restore the output character

// ------------------------------------------------------- // output the character to the cassette or RS232 device
/* f1dd */        _`_f1dd`;  STA.zpg ("ptr1_009e");        // save the character to the character buffer
/* f1df */                   TXA.imp ();                   // copy X
/* f1e0 */                   PHA.imp ();                   // save X
/* f1e1 */                   TYA.imp ();                   // copy Y
/* f1e2 */                   PHA.imp ();                   // save Y
/* f1e3 */                   BCC.rel ("_f208");            // if Cb is clear it must be the RS232 device
                                                           // output the character to the cassette
/* f1e5 */                   JSR.abs ("_f80d");            // bump the tape pointer
/* f1e8 */                   BNE.rel ("_f1f8");            // if not end save next byte and exit
/* f1ea */                   JSR.abs ("_f864");            // initiate tape write
/* f1ed */                   BCS.rel ("_f1fd");            // exit if error
/* f1ef */                   LDA.imm (0x02);               // set data block type ??
/* f1f1 */                   LDY.imm (0x00);               // clear index
/* f1f3 */                   STA.iny ("tape1+0_00b2");     // save type to buffer ??
/* f1f5 */                   INY.imp ();                   // increment index
/* f1f6 */                   STY.zpg ("bufpnt_00a6");      // save tape buffer index
/* f1f8 */        _`_f1f8`;  LDA.zpg ("ptr1_009e");        // restore character from character buffer
/* f1fa */                   STA.iny ("tape1+0_00b2");     // save to buffer
/* f1fc */        _`_f1fc`;  CLC.imp ();                   // flag no error
/* f1fd */        _`_f1fd`;  PLA.imp ();                   // pull Y
/* f1fe */                   TAY.imp ();                   // restore Y
/* f1ff */                   PLA.imp ();                   // pull X
/* f200 */                   TAX.imp ();                   // restore X
/* f201 */                   LDA.zpg ("ptr1_009e");        // get the character from the character buffer
/* f203 */                   BCC.rel ("_f207");            // exit if no error
/* f205 */                   LDA.imm (0x00);               // else clear A
/* f207 */        _`_f207`;  RTS.imp ();
                                                           // output the character to the RS232 device
/* f208 */        _`_f208`;  JSR.abs ("_f017");            // send byte to the RS232 buffer, no setup
/* f20b */                   JMP.abs ("_f1fc");            // do no error exit

// ------------------------------------------------------- // open channel for input
/* f20e */   _`chkin_f20e`;  JSR.abs ("_f30f");            // find a file
/* f211 */                   BEQ.rel ("_f216");            // if the file is open continue
/* f213 */                   JMP.abs ("_f701");            // else do 'file not open' error and return
/* f216 */        _`_f216`;  JSR.abs ("_f31f");            // set file details from table,X
/* f219 */                   LDA.zpg ("fa_00ba");          // get the device number
/* f21b */                   BEQ.rel ("_f233");            // if the device was the keyboard save the device #, flag
                                                           // ok and exit
/* f21d */                   CMP.imm (0x03);               // compare the device number with the screen
/* f21f */                   BEQ.rel ("_f233");            // if the device was the screen save the device #, flag ok
                                                           // and exit
/* f221 */                   BCS.rel ("_f237");            // if the device was a serial bus device go ??
/* f223 */                   CMP.imm (0x02);               // else compare the device with the RS232 device
/* f225 */                   BNE.rel ("_f22a");            // if not the RS232 device continue
/* f227 */                   JMP.abs ("_f04d");            // else go get input from the RS232 buffer and return
/* f22a */        _`_f22a`;  LDX.zpg ("sa_00b9");          // get the secondary address
/* f22c */                   CPX.imm (0x60);
/* f22e */                   BEQ.rel ("_f233");
/* f230 */                   JMP.abs ("_f70a");            // go do 'not input file' error and return
/* f233 */        _`_f233`;  STA.zpg ("dfltn_0099");       // save the input device number
/* f235 */                   CLC.imp ();                   // flag ok
/* f236 */                   RTS.imp ();
                                                           // the device was a serial bus device
/* f237 */        _`_f237`;  TAX.imp ();                   // copy device number to X
/* f238 */                   JSR.abs ("talk_ed09");        // command serial bus device to TALK
/* f23b */                   LDA.zpg ("sa_00b9");          // get the secondary address
/* f23d */                   BPL.rel ("_f245");
/* f23f */                   JSR.abs ("_edcc");            // wait for the serial bus end after send
/* f242 */                   JMP.abs ("_f248");
/* f245 */        _`_f245`;  JSR.abs ("tksa_edc7");        // send secondary address after TALK
/* f248 */        _`_f248`;  TXA.imp ();                   // copy device back to A
/* f249 */                   BIT.zpg ("status_0090");      // test the serial status byte
/* f24b */                   BPL.rel ("_f233");            // if device present save device number and exit
/* f24d */                   JMP.abs ("_f707");            // do 'device not present' error and return

// ------------------------------------------------------- // open channel for output
/* f250 */  _`chkout_f250`;  JSR.abs ("_f30f");            // find a file
/* f253 */                   BEQ.rel ("_f258");            // if file found continue
/* f255 */                   JMP.abs ("_f701");            // else do 'file not open' error and return
/* f258 */        _`_f258`;  JSR.abs ("_f31f");            // set file details from table,X
/* f25b */                   LDA.zpg ("fa_00ba");          // get the device number
/* f25d */                   BNE.rel ("_f262");            // if the device is not the keyboard go ??
/* f25f */        _`_f25f`;  JMP.abs ("_f70d");            // go do 'not output file' error and return
/* f262 */        _`_f262`;  CMP.imm (0x03);               // compare the device with the screen
/* f264 */                   BEQ.rel ("_f275");            // if the device is the screen go save output the output
                                                           // device number and exit
/* f266 */                   BCS.rel ("_f279");            // if > screen then go handle a serial bus device
/* f268 */                   CMP.imm (0x02);               // compare the device with the RS232 device
/* f26a */                   BNE.rel ("_f26f");            // if not the RS232 device then it must be the tape device
/* f26c */                   JMP.abs ("_efe1");            // else go open RS232 channel for output
                                                           // open a tape channel for output
/* f26f */        _`_f26f`;  LDX.zpg ("sa_00b9");          // get the secondary address
/* f271 */                   CPX.imm (0x60);
/* f273 */                   BEQ.rel ("_f25f");            // if ?? do not output file error and return
/* f275 */        _`_f275`;  STA.zpg ("dflto_009a");       // save the output device number
/* f277 */                   CLC.imp ();                   // flag ok
/* f278 */                   RTS.imp ();
/* f279 */        _`_f279`;  TAX.imp ();                   // copy the device number
/* f27a */                   JSR.abs ("listen_ed0c");      // command devices on the serial bus to LISTEN
/* f27d */                   LDA.zpg ("sa_00b9");          // get the secondary address
/* f27f */                   BPL.rel ("_f286");            // if address to send go ??
/* f281 */                   JSR.abs ("_edbe");            // else set serial ATN high
/* f284 */                   BNE.rel ("_f289");            // go ??, branch always
/* f286 */        _`_f286`;  JSR.abs ("second_edb9");      // send secondary address after LISTEN
/* f289 */        _`_f289`;  TXA.imp ();                   // copy device number back to A
/* f28a */                   BIT.zpg ("status_0090");      // test the serial status byte
/* f28c */                   BPL.rel ("_f275");            // if the device is present go save the output device number
                                                           // and exit
/* f28e */                   JMP.abs ("_f707");            // else do 'device not present error' and return

// ------------------------------------------------------- // close a specified logical file
/* f291 */   _`close_f291`;  JSR.abs ("_f314");            // find file A
/* f294 */                   BEQ.rel ("_f298");            // if file found go close it
/* f296 */                   CLC.imp ();                   // else the file was closed so just flag ok
/* f297 */                   RTS.imp ();
                                                           // file found so close it
/* f298 */        _`_f298`;  JSR.abs ("_f31f");            // set file details from table,X
/* f29b */                   TXA.imp ();                   // copy file index to A
/* f29c */                   PHA.imp ();                   // save file index
/* f29d */                   LDA.zpg ("fa_00ba");          // get the device number
/* f29f */                   BEQ.rel ("_f2f1");            // if it is the keyboard go restore the index and close the
                                                           // file
/* f2a1 */                   CMP.imm (0x03);               // compare the device number with the screen
/* f2a3 */                   BEQ.rel ("_f2f1");            // if it is the screen go restore the index and close the
                                                           // file
/* f2a5 */                   BCS.rel ("_f2ee");            // if > screen go do serial bus device close
/* f2a7 */                   CMP.imm (0x02);               // compare the device with the RS232 device
/* f2a9 */                   BNE.rel ("_f2c8");            // if not the RS232 device go ??
                                                           // else close RS232 device
/* f2ab */                   PLA.imp ();                   // restore file index
/* f2ac */                   JSR.abs ("_f2f2");            // close file index X
/* f2af */                   JSR.abs ("_f483");            // initialise RS232 output
/* f2b2 */                   JSR.abs ("_fe27");            // read the top of memory
/* f2b5 */                   LDA.zpg ("ribuf+1_00f8");     // get the RS232 input buffer pointer high byte
/* f2b7 */                   BEQ.rel ("_f2ba");            // if no RS232 input buffer go ??
/* f2b9 */                   INY.imp ();                   // else reclaim RS232 input buffer memory
/* f2ba */        _`_f2ba`;  LDA.zpg ("robuf+1_00fa");     // get the RS232 output buffer pointer high byte
/* f2bc */                   BEQ.rel ("_f2bf");            // if no RS232 output buffer skip the reclaim
/* f2be */                   INY.imp ();                   // else reclaim the RS232 output buffer memory
/* f2bf */        _`_f2bf`;  LDA.imm (0x00);               // clear A
/* f2c1 */                   STA.zpg ("ribuf+1_00f8");     // clear the RS232 input buffer pointer high byte
/* f2c3 */                   STA.zpg ("robuf+1_00fa");     // clear the RS232 output buffer pointer high byte
/* f2c5 */                   JMP.abs ("_f47d");            // go set the top of memory to F0xx
                                                           // is not the RS232 device
/* f2c8 */        _`_f2c8`;  LDA.zpg ("sa_00b9");          // get the secondary address
/* f2ca */                   AND.imm (0x0f);               // mask the device #
/* f2cc */                   BEQ.rel ("_f2f1");            // if ?? restore index and close file
/* f2ce */                   JSR.abs ("_f7d0");            // get tape buffer start pointer in XY
/* f2d1 */                   LDA.imm (0x00);               // character $00
/* f2d3 */                   SEC.imp ();                   // flag the tape device
/* f2d4 */                   JSR.abs ("_f1dd");            // output the character to the cassette or RS232 device
/* f2d7 */                   JSR.abs ("_f864");            // initiate tape write
/* f2da */                   BCC.rel ("_f2e0");
/* f2dc */                   PLA.imp ();
/* f2dd */                   LDA.imm (0x00);
/* f2df */                   RTS.imp ();
/* f2e0 */        _`_f2e0`;  LDA.zpg ("sa_00b9");          // get the secondary address
/* f2e2 */                   CMP.imm (0x62);
/* f2e4 */                   BNE.rel ("_f2f1");            // if not ?? restore index and close file
/* f2e6 */                   LDA.imm (0x05);               // set logical end of the tape
/* f2e8 */                   JSR.abs ("_f76a");            // write tape header
/* f2eb */                   JMP.abs ("_f2f1");            // restore index and close file

// ------------------------------------------------------- // serial bus device close
/* f2ee */        _`_f2ee`;  JSR.abs ("_f642");            // close serial bus device
/* f2f1 */        _`_f2f1`;  PLA.imp ();                   // restore file index

// ------------------------------------------------------- // close file index X
/* f2f2 */        _`_f2f2`;  TAX.imp ();                   // copy index to file to close
/* f2f3 */                   DEC.zpg ("ldtnd_0098");       // decrement the open file count
/* f2f5 */                   CPX.zpg ("ldtnd_0098");       // compare the index with the open file count
/* f2f7 */                   BEQ.rel ("_f30d");            // exit if equal, last entry was closing file
                                                           // else entry was not last in list so copy last table entry
                                                           // file details over the details of the closing one
/* f2f9 */                   LDY.zpg ("ldtnd_0098");       // get the open file count as index
/* f2fb */                   LDA.aby ("lat+0_0259");       // get last+1 logical file number from logical file table
/* f2fe */                   STA.abx ("lat+0_0259");       // save logical file number over closed file
/* f301 */                   LDA.aby ("fat+0_0263");       // get last+1 device number from device number table
/* f304 */                   STA.abx ("fat+0_0263");       // save device number over closed file
/* f307 */                   LDA.aby ("sat+0_026d");       // get last+1 secondary address from secondary address table
/* f30a */                   STA.abx ("sat+0_026d");       // save secondary address over closed file
/* f30d */        _`_f30d`;  CLC.imp ();                   // flag ok
/* f30e */                   RTS.imp ();

// ------------------------------------------------------- // find a file
/* f30f */        _`_f30f`;  LDA.imm (0x00);               // clear A
/* f311 */                   STA.zpg ("status_0090");      // clear the serial status byte
/* f313 */                   TXA.imp ();                   // copy the logical file number to A

// ------------------------------------------------------- // find file A
/* f314 */        _`_f314`;  LDX.zpg ("ldtnd_0098");       // get the open file count
/* f316 */        _`_f316`;  DEX.imp ();                   // decrememnt the count to give the index
/* f317 */                   BMI.rel ("_f32e");            // if no files just exit
/* f319 */                   CMP.abx ("lat+0_0259");       // compare the logical file number with the table logical
                                                           // file number
/* f31c */                   BNE.rel ("_f316");            // if no match go try again
/* f31e */                   RTS.imp ();

// ------------------------------------------------------- // set file details from table,X
/* f31f */        _`_f31f`;  LDA.abx ("lat+0_0259");       // get logical file from logical file table
/* f322 */                   STA.zpg ("la_00b8");          // save the logical file
/* f324 */                   LDA.abx ("fat+0_0263");       // get device number from device number table
/* f327 */                   STA.zpg ("fa_00ba");          // save the device number
/* f329 */                   LDA.abx ("sat+0_026d");       // get secondary address from secondary address table
/* f32c */                   STA.zpg ("sa_00b9");          // save the secondary address
/* f32e */        _`_f32e`;  RTS.imp ();

// ------------------------------------------------------- // close all channels and files
/* f32f */   _`clall_f32f`;  LDA.imm (0x00);               // clear A
/* f331 */                   STA.zpg ("ldtnd_0098");       // clear the open file count

// ------------------------------------------------------- // close input and output channels
/* f333 */  _`clrchn_f333`;  LDX.imm (0x03);               // set the screen device
/* f335 */                   CPX.zpg ("dflto_009a");       // compare the screen with the output device number
/* f337 */                   BCS.rel ("_f33c");            // if <= screen skip the serial bus unlisten
/* f339 */                   JSR.abs ("unlsn_edfe");       // else command the serial bus to UNLISTEN
/* f33c */        _`_f33c`;  CPX.zpg ("dfltn_0099");       // compare the screen with the input device number
/* f33e */                   BCS.rel ("_f343");            // if <= screen skip the serial bus untalk
/* f340 */                   JSR.abs ("untlk_edef");       // else command the serial bus to UNTALK
/* f343 */        _`_f343`;  STX.zpg ("dflto_009a");       // save the screen as the output device number
/* f345 */                   LDA.imm (0x00);               // set the keyboard as the input device
/* f347 */                   STA.zpg ("dfltn_0099");       // save the input device number
/* f349 */                   RTS.imp ();

// ------------------------------------------------------- // open a logical file
/* f34a */    _`open_f34a`;  LDX.zpg ("la_00b8");          // get the logical file
/* f34c */                   BNE.rel ("_f351");            // if there is a file continue
/* f34e */                   JMP.abs ("_f70a");            // else do 'not input file error' and return
/* f351 */        _`_f351`;  JSR.abs ("_f30f");            // find a file
/* f354 */                   BNE.rel ("_f359");            // if file not found continue
/* f356 */                   JMP.abs ("_f6fe");            // else do 'file already open' error and return
/* f359 */        _`_f359`;  LDX.zpg ("ldtnd_0098");       // get the open file count
/* f35b */                   CPX.imm (0x0a);               // compare it with the maximum + 1
/* f35d */                   BCC.rel ("_f362");            // if less than maximum + 1 go open the file
/* f35f */                   JMP.abs ("_f6fb");            // else do 'too many files error' and return
/* f362 */        _`_f362`;  INC.zpg ("ldtnd_0098");       // increment the open file count
/* f364 */                   LDA.zpg ("la_00b8");          // get the logical file
/* f366 */                   STA.abx ("lat+0_0259");       // save it to the logical file table
/* f369 */                   LDA.zpg ("sa_00b9");          // get the secondary address
/* f36b */                   ORA.imm (0x60);               // OR with the OPEN CHANNEL command
/* f36d */                   STA.zpg ("sa_00b9");          // save the secondary address
/* f36f */                   STA.abx ("sat+0_026d");       // save it to the secondary address table
/* f372 */                   LDA.zpg ("fa_00ba");          // get the device number
/* f374 */                   STA.abx ("fat+0_0263");       // save it to the device number table
/* f377 */                   BEQ.rel ("_f3d3");            // if it is the keyboard go do the ok exit
/* f379 */                   CMP.imm (0x03);               // compare the device number with the screen
/* f37b */                   BEQ.rel ("_f3d3");            // if it is the screen go do the ok exit
/* f37d */                   BCC.rel ("_f384");            // if tape or RS232 device go ??
                                                           // else it is a serial bus device
/* f37f */                   JSR.abs ("_f3d5");            // send the secondary address and filename
/* f382 */                   BCC.rel ("_f3d3");            // go do ok exit, branch always
/* f384 */        _`_f384`;  CMP.imm (0x02);
/* f386 */                   BNE.rel ("_f38b");
/* f388 */                   JMP.abs ("_f409");            // go open RS232 device and return
/* f38b */        _`_f38b`;  JSR.abs ("_f7d0");            // get tape buffer start pointer in XY
/* f38e */                   BCS.rel ("_f393");            // if >= $0200 go ??
/* f390 */                   JMP.abs ("_f713");            // else do 'illegal device number' and return
/* f393 */        _`_f393`;  LDA.zpg ("sa_00b9");          // get the secondary address
/* f395 */                   AND.imm (0x0f);
/* f397 */                   BNE.rel ("_f3b8");
/* f399 */                   JSR.abs ("_f817");            // wait for PLAY
/* f39c */                   BCS.rel ("_f3d4");            // exit if STOP was pressed
/* f39e */                   JSR.abs ("_f5af");            // print "Searching..."
/* f3a1 */                   LDA.zpg ("fnlen_00b7");       // get file name length
/* f3a3 */                   BEQ.rel ("_f3af");            // if null file name just go find header
/* f3a5 */                   JSR.abs ("_f7ea");            // find specific tape header
/* f3a8 */                   BCC.rel ("_f3c2");            // branch if no error
/* f3aa */                   BEQ.rel ("_f3d4");            // exit if ??
/* f3ac */        _`_f3ac`;  JMP.abs ("_f704");            // do file not found error and return
/* f3af */        _`_f3af`;  JSR.abs ("_f72c");            // find tape header, exit with header in buffer
/* f3b2 */                   BEQ.rel ("_f3d4");            // exit if end of tape found
/* f3b4 */                   BCC.rel ("_f3c2");
/* f3b6 */                   BCS.rel ("_f3ac");
/* f3b8 */        _`_f3b8`;  JSR.abs ("_f838");            // wait for PLAY/RECORD
/* f3bb */                   BCS.rel ("_f3d4");            // exit if STOP was pressed
/* f3bd */                   LDA.imm (0x04);               // set data file header
/* f3bf */                   JSR.abs ("_f76a");            // write tape header
/* f3c2 */        _`_f3c2`;  LDA.imm (0xbf);
/* f3c4 */                   LDY.zpg ("sa_00b9");          // get the secondary address
/* f3c6 */                   CPY.imm (0x60);
/* f3c8 */                   BEQ.rel ("_f3d1");
/* f3ca */                   LDY.imm (0x00);               // clear index
/* f3cc */                   LDA.imm (0x02);
/* f3ce */                   STA.iny ("tape1+0_00b2");     // save to tape buffer
/* f3d0 */                   TYA.imp ();                   // clear A
/* f3d1 */        _`_f3d1`;  STA.zpg ("bufpnt_00a6");      // save tape buffer index
/* f3d3 */        _`_f3d3`;  CLC.imp ();                   // flag ok
/* f3d4 */        _`_f3d4`;  RTS.imp ();

// ------------------------------------------------------- // send secondary address and filename
/* f3d5 */        _`_f3d5`;  LDA.zpg ("sa_00b9");          // get the secondary address
/* f3d7 */                   BMI.rel ("_f3d3");            // ok exit if -ve
/* f3d9 */                   LDY.zpg ("fnlen_00b7");       // get file name length
/* f3db */                   BEQ.rel ("_f3d3");            // ok exit if null
/* f3dd */                   LDA.imm (0x00);               // clear A
/* f3df */                   STA.zpg ("status_0090");      // clear the serial status byte
/* f3e1 */                   LDA.zpg ("fa_00ba");          // get the device number
/* f3e3 */                   JSR.abs ("listen_ed0c");      // command devices on the serial bus to LISTEN
/* f3e6 */                   LDA.zpg ("sa_00b9");          // get the secondary address
/* f3e8 */                   ORA.imm (0xf0);               // OR with the OPEN command
/* f3ea */                   JSR.abs ("second_edb9");      // send secondary address after LISTEN
/* f3ed */                   LDA.zpg ("status_0090");      // get the serial status byte
/* f3ef */                   BPL.rel ("_f3f6");            // if device present skip the 'device not present' error
/* f3f1 */                   PLA.imp ();                   // else dump calling address low byte
/* f3f2 */                   PLA.imp ();                   // dump calling address high byte
/* f3f3 */                   JMP.abs ("_f707");            // do 'device not present' error and return
/* f3f6 */        _`_f3f6`;  LDA.zpg ("fnlen_00b7");       // get file name length
/* f3f8 */                   BEQ.rel ("_f406");            // branch if null name
/* f3fa */                   LDY.imm (0x00);               // clear index
/* f3fc */        _`_f3fc`;  LDA.iny ("fnadr+0_00bb");     // get file name byte
/* f3fe */                   JSR.abs ("ciout_eddd");       // output byte to serial bus
/* f401 */                   INY.imp ();                   // increment index
/* f402 */                   CPY.zpg ("fnlen_00b7");       // compare with file name length
/* f404 */                   BNE.rel ("_f3fc");            // loop if not all done
/* f406 */        _`_f406`;  JMP.abs ("_f654");            // command serial bus to UNLISTEN and return

// ------------------------------------------------------- // open RS232 device
/* f409 */        _`_f409`;  JSR.abs ("_f483");            // initialise RS232 output
/* f40c */                   STY.abs ("rsstat_0297");      // save the RS232 status register
/* f40f */        _`_f40f`;  CPY.zpg ("fnlen_00b7");       // compare with file name length
/* f411 */                   BEQ.rel ("_f41d");            // exit loop if done
/* f413 */                   LDA.iny ("fnadr+0_00bb");     // get file name byte
/* f415 */                   STA.aby ("m51ctr_0293");      // copy to 6551 register set
/* f418 */                   INY.imp ();                   // increment index
/* f419 */                   CPY.imm (0x04);               // compare with $04
/* f41b */                   BNE.rel ("_f40f");            // loop if not to 4 yet
/* f41d */        _`_f41d`;  JSR.abs ("_ef4a");            // compute bit count
/* f420 */                   STX.abs ("bitnum_0298");      // save bit count
/* f423 */                   LDA.abs ("m51ctr_0293");      // get pseudo 6551 control register
/* f426 */                   AND.imm (0x0f);               // mask 0000 xxxx, baud rate
/* f428 */                   BEQ.rel ("_f446");            // if zero skip the baud rate setup
/* f42a */                   ASL.acc ();                   // * 2 bytes per entry
/* f42b */                   TAX.imp ();                   // copy to the index
/* f42c */                   LDA.abs ("tvsflg_02a6");      // get the PAL/NTSC flag
/* f42f */                   BNE.rel ("_f43a");            // if PAL go set PAL timing
/* f431 */                   LDY.abx ("_fec1");            // get the NTSC baud rate value high byte
/* f434 */                   LDA.abx ("_fec0");            // get the NTSC baud rate value low byte
/* f437 */                   JMP.abs ("_f440");            // go save the baud rate values
/* f43a */        _`_f43a`;  LDY.abx ("_e4eb");            // get the PAL baud rate value high byte
/* f43d */                   LDA.abx (0xe4ea);             // get the PAL baud rate value low byte
/* f440 */        _`_f440`;  STY.abs ("m51ajb+1_0296");    // save the nonstandard bit timing high byte
/* f443 */                   STA.abs ("m51ajb+0_0295");    // save the nonstandard bit timing low byte
/* f446 */        _`_f446`;  LDA.abs ("m51ajb+0_0295");    // get the nonstandard bit timing low byte
/* f449 */                   ASL.acc ();                   // * 2
/* f44a */                   JSR.abs ("_ff2e");
/* f44d */                   LDA.abs ("m51cdr_0294");      // read the pseudo 6551 command register
/* f450 */                   LSR.acc ();                   // shift the X line/3 line bit into Cb
/* f451 */                   BCC.rel ("_f45c");            // if 3 line skip the DRS test
/* f453 */                   LDA.abs ("ci2prb_dd01");      // read VIA 2 DRB, RS232 port
/* f456 */                   ASL.acc ();                   // shift DSR in into Cb
/* f457 */                   BCS.rel ("_f45c");            // if DSR present skip the error set
/* f459 */                   JSR.abs ("_f00d");            // set no DSR
/* f45c */        _`_f45c`;  LDA.abs ("ridbe_029b");       // get index to Rx buffer end
/* f45f */                   STA.abs ("ridbs_029c");       // set index to Rx buffer start, clear Rx buffer
/* f462 */                   LDA.abs ("rodbe_029e");       // get index to Tx buffer end
/* f465 */                   STA.abs ("rodbs_029d");       // set index to Tx buffer start, clear Tx buffer
/* f468 */                   JSR.abs ("_fe27");            // read the top of memory
/* f46b */                   LDA.zpg ("ribuf+1_00f8");     // get the RS232 input buffer pointer high byte
/* f46d */                   BNE.rel ("_f474");            // if buffer already set skip the save
/* f46f */                   DEY.imp ();                   // decrement top of memory high byte, 256 byte buffer
/* f470 */                   STY.zpg ("ribuf+1_00f8");     // save the RS232 input buffer pointer high byte
/* f472 */                   STX.zpg ("ribuf+0_00f7");     // save the RS232 input buffer pointer low byte
/* f474 */        _`_f474`;  LDA.zpg ("robuf+1_00fa");     // get the RS232 output buffer pointer high byte
/* f476 */                   BNE.rel ("_f47d");            // if ?? go set the top of memory to F0xx
/* f478 */                   DEY.imp ();
/* f479 */                   STY.zpg ("robuf+1_00fa");     // save the RS232 output buffer pointer high byte
/* f47b */                   STX.zpg ("robuf+0_00f9");     // save the RS232 output buffer pointer low byte

// ------------------------------------------------------- // set the top of memory to F0xx
/* f47d */        _`_f47d`;  SEC.imp ();                   // read the top of memory
/* f47e */                   LDA.imm (0xf0);               // set $F000
/* f480 */                   JMP.abs ("_fe2d");            // set the top of memory and return

// ------------------------------------------------------- // initialise RS232 output
/* f483 */        _`_f483`;  LDA.imm (0x7f);               // disable all interrupts
/* f485 */                   STA.abs ("ci2icr_dd0d");      // save VIA 2 ICR
/* f488 */                   LDA.imm (0x06);               // set RS232 DTR output, RS232 RTS output
/* f48a */                   STA.abs ("c2ddrb_dd03");      // save VIA 2 DDRB, RS232 port
/* f48d */                   STA.abs ("ci2prb_dd01");      // save VIA 2 DRB, RS232 port
/* f490 */                   LDA.imm (0x04);               // mask xxxx x1xx, set RS232 Tx DATA high
/* f492 */                   ORA.abs ("ci2pra_dd00");      // OR it with VIA 2 DRA, serial port and video address
/* f495 */                   STA.abs ("ci2pra_dd00");      // save VIA 2 DRA, serial port and video address
/* f498 */                   LDY.imm (0x00);               // clear Y
/* f49a */                   STY.abs ("enabl_02a1");       // clear the RS-232 interrupt enable byte
/* f49d */                   RTS.imp ();

// ------------------------------------------------------- // load RAM from a device
/* f49e */    _`load_f49e`;  STX.zpg ("memuss+0_00c3");    // set kernal setup pointer low byte
/* f4a0 */                   STY.zpg ("memuss+1_00c4");    // set kernal setup pointer high byte
/* f4a2 */                   JMP.ind ("iload+0_0330");     // do LOAD vector, usually points to $F4A5

// ------------------------------------------------------- // load
/* f4a5 */                   STA.zpg ("verck_0093");       // save load/verify flag
/* f4a7 */                   LDA.imm (0x00);               // clear A
/* f4a9 */                   STA.zpg ("status_0090");      // clear the serial status byte
/* f4ab */                   LDA.zpg ("fa_00ba");          // get the device number
/* f4ad */                   BNE.rel ("_f4b2");            // if not the keyboard continue
                                                           // do 'illegal device number'
/* f4af */        _`_f4af`;  JMP.abs ("_f713");            // else do 'illegal device number' and return
/* f4b2 */        _`_f4b2`;  CMP.imm (0x03);
/* f4b4 */                   BEQ.rel ("_f4af");
/* f4b6 */                   BCC.rel ("_f533");
/* f4b8 */                   LDY.zpg ("fnlen_00b7");       // get file name length
/* f4ba */                   BNE.rel ("_f4bf");            // if not null name go ??
/* f4bc */                   JMP.abs ("_f710");            // else do 'missing file name' error and return
/* f4bf */        _`_f4bf`;  LDX.zpg ("sa_00b9");          // get the secondary address
/* f4c1 */                   JSR.abs ("_f5af");            // print "Searching..."
/* f4c4 */                   LDA.imm (0x60);
/* f4c6 */                   STA.zpg ("sa_00b9");          // save the secondary address
/* f4c8 */                   JSR.abs ("_f3d5");            // send secondary address and filename
/* f4cb */                   LDA.zpg ("fa_00ba");          // get the device number
/* f4cd */                   JSR.abs ("talk_ed09");        // command serial bus device to TALK
/* f4d0 */                   LDA.zpg ("sa_00b9");          // get the secondary address
/* f4d2 */                   JSR.abs ("tksa_edc7");        // send secondary address after TALK
/* f4d5 */                   JSR.abs ("acptr_ee13");       // input byte from serial bus
/* f4d8 */                   STA.zpg ("eal+0_00ae");       // save program start address low byte
/* f4da */                   LDA.zpg ("status_0090");      // get the serial status byte
/* f4dc */                   LSR.acc ();                   // shift time out read ..
/* f4dd */                   LSR.acc ();                   // .. into carry bit
/* f4de */                   BCS.rel ("_f530");            // if timed out go do file not found error and return
/* f4e0 */                   JSR.abs ("acptr_ee13");       // input byte from serial bus
/* f4e3 */                   STA.zpg ("eal+1_00af");       // save program start address high byte
/* f4e5 */                   TXA.imp ();                   // copy secondary address
/* f4e6 */                   BNE.rel ("_f4f0");            // load location not set in LOAD call, so continue with the
                                                           // load
/* f4e8 */                   LDA.zpg ("memuss+0_00c3");    // get the load address low byte
/* f4ea */                   STA.zpg ("eal+0_00ae");       // save the program start address low byte
/* f4ec */                   LDA.zpg ("memuss+1_00c4");    // get the load address high byte
/* f4ee */                   STA.zpg ("eal+1_00af");       // save the program start address high byte
/* f4f0 */        _`_f4f0`;  JSR.abs ("_f5d2");
/* f4f3 */        _`_f4f3`;  LDA.imm (0xfd);               // mask xxxx xx0x, clear time out read bit
/* f4f5 */                   AND.zpg ("status_0090");      // mask the serial status byte
/* f4f7 */                   STA.zpg ("status_0090");      // set the serial status byte
/* f4f9 */                   JSR.abs ("stop_ffe1");        // scan stop key, return Zb = 1 = [STOP]
/* f4fc */                   BNE.rel ("_f501");            // if not [STOP] go ??
/* f4fe */                   JMP.abs ("_f633");            // else close the serial bus device and flag stop
/* f501 */        _`_f501`;  JSR.abs ("acptr_ee13");       // input byte from serial bus
/* f504 */                   TAX.imp ();                   // copy byte
/* f505 */                   LDA.zpg ("status_0090");      // get the serial status byte
/* f507 */                   LSR.acc ();                   // shift time out read ..
/* f508 */                   LSR.acc ();                   // .. into carry bit
/* f509 */                   BCS.rel ("_f4f3");            // if timed out go try again
/* f50b */                   TXA.imp ();                   // copy received byte back
/* f50c */                   LDY.zpg ("verck_0093");       // get load/verify flag
/* f50e */                   BEQ.rel ("_f51c");            // if load go load
                                                           // else is verify
/* f510 */                   LDY.imm (0x00);               // clear index
/* f512 */                   CMP.iny ("eal+0_00ae");       // compare byte with previously loaded byte
/* f514 */                   BEQ.rel ("_f51e");            // if match go ??
/* f516 */                   LDA.imm (0x10);               // flag read error
/* f518 */                   JSR.abs ("_fe1c");            // OR into the serial status byte
/* f51b */                   _.bytes(0x2c);                // makes next line BIT $AE91
/* f51c */        _`_f51c`;  STA.iny ("eal+0_00ae");       // save byte to memory
/* f51e */        _`_f51e`;  INC.zpg ("eal+0_00ae");       // increment save pointer low byte
/* f520 */                   BNE.rel ("_f524");            // if no rollover go ??
/* f522 */                   INC.zpg ("eal+1_00af");       // else increment save pointer high byte
/* f524 */        _`_f524`;  BIT.zpg ("status_0090");      // test the serial status byte
/* f526 */                   BVC.rel ("_f4f3");            // loop if not end of file
                                                           // close file and exit
/* f528 */                   JSR.abs ("untlk_edef");       // command serial bus to UNTALK
/* f52b */                   JSR.abs ("_f642");            // close serial bus device
/* f52e */                   BCC.rel ("_f5a9");            // if ?? go flag ok and exit
/* f530 */        _`_f530`;  JMP.abs ("_f704");            // do file not found error and return

// ------------------------------------------------------- // ??
/* f533 */        _`_f533`;  LSR.acc ();
/* f534 */                   BCS.rel ("_f539");
/* f536 */                   JMP.abs ("_f713");            // else do 'illegal device number' and return
/* f539 */        _`_f539`;  JSR.abs ("_f7d0");            // get tape buffer start pointer in XY
/* f53c */                   BCS.rel ("_f541");            // if ??
/* f53e */                   JMP.abs ("_f713");            // else do 'illegal device number' and return
/* f541 */        _`_f541`;  JSR.abs ("_f817");            // wait for PLAY
/* f544 */                   BCS.rel ("_f5ae");            // exit if STOP was pressed
/* f546 */                   JSR.abs ("_f5af");            // print "Searching..."
/* f549 */        _`_f549`;  LDA.zpg ("fnlen_00b7");       // get file name length
/* f54b */                   BEQ.rel ("_f556");
/* f54d */                   JSR.abs ("_f7ea");            // find specific tape header
/* f550 */                   BCC.rel ("_f55d");            // if no error continue
/* f552 */                   BEQ.rel ("_f5ae");            // exit if ??
/* f554 */                   BCS.rel ("_f530");            // , branch always
/* f556 */        _`_f556`;  JSR.abs ("_f72c");            // find tape header, exit with header in buffer
/* f559 */                   BEQ.rel ("_f5ae");            // exit if ??
/* f55b */                   BCS.rel ("_f530");
/* f55d */        _`_f55d`;  LDA.zpg ("status_0090");      // get the serial status byte
/* f55f */                   AND.imm (0x10);               // mask 000x 0000, read error
/* f561 */                   SEC.imp ();                   // flag fail
/* f562 */                   BNE.rel ("_f5ae");            // if read error just exit
/* f564 */                   CPX.imm (0x01);
/* f566 */                   BEQ.rel ("_f579");
/* f568 */                   CPX.imm (0x03);
/* f56a */                   BNE.rel ("_f549");
/* f56c */        _`_f56c`;  LDY.imm (0x01);
/* f56e */                   LDA.iny ("tape1+0_00b2");
/* f570 */                   STA.zpg ("memuss+0_00c3");
/* f572 */                   INY.imp ();
/* f573 */                   LDA.iny ("tape1+0_00b2");
/* f575 */                   STA.zpg ("memuss+1_00c4");
/* f577 */                   BCS.rel ("_f57d");
/* f579 */        _`_f579`;  LDA.zpg ("sa_00b9");          // get the secondary address
/* f57b */                   BNE.rel ("_f56c");
/* f57d */        _`_f57d`;  LDY.imm (0x03);
/* f57f */                   LDA.iny ("tape1+0_00b2");
/* f581 */                   LDY.imm (0x01);
/* f583 */                   SBC.iny ("tape1+0_00b2");
/* f585 */                   TAX.imp ();
/* f586 */                   LDY.imm (0x04);
/* f588 */                   LDA.iny ("tape1+0_00b2");
/* f58a */                   LDY.imm (0x02);
/* f58c */                   SBC.iny ("tape1+0_00b2");
/* f58e */                   TAY.imp ();
/* f58f */                   CLC.imp ();
/* f590 */                   TXA.imp ();
/* f591 */                   ADC.zpg ("memuss+0_00c3");
/* f593 */                   STA.zpg ("eal+0_00ae");
/* f595 */                   TYA.imp ();
/* f596 */                   ADC.zpg ("memuss+1_00c4");
/* f598 */                   STA.zpg ("eal+1_00af");
/* f59a */                   LDA.zpg ("memuss+0_00c3");
/* f59c */                   STA.zpg ("stal+0_00c1");      // set I/O start addresses low byte
/* f59e */                   LDA.zpg ("memuss+1_00c4");
/* f5a0 */                   STA.zpg ("stal+1_00c2");      // set I/O start addresses high byte
/* f5a2 */                   JSR.abs ("_f5d2");            // display "LOADING" or "VERIFYING"
/* f5a5 */                   JSR.abs ("_f84a");            // do the tape read
/* f5a8 */                   _.bytes(0x24);                // makes next line BIT $18, keep the error flag in Cb
/* f5a9 */        _`_f5a9`;  CLC.imp ();                   // flag ok
/* f5aa */                   LDX.zpg ("eal+0_00ae");       // get the LOAD end pointer low byte
/* f5ac */                   LDY.zpg ("eal+1_00af");       // get the LOAD end pointer high byte
/* f5ae */        _`_f5ae`;  RTS.imp ();

// ------------------------------------------------------- // print "Searching..."
/* f5af */        _`_f5af`;  LDA.zpg ("msgflg_009d");      // get message mode flag
/* f5b1 */                   BPL.rel ("_f5d1");            // exit if control messages off
/* f5b3 */                   LDY.imm (0x0c);
                                                           // index to "SEARCHING "
/* f5b5 */                   JSR.abs ("_f12f");            // display kernel I/O message
/* f5b8 */                   LDA.zpg ("fnlen_00b7");       // get file name length
/* f5ba */                   BEQ.rel ("_f5d1");            // exit if null name
/* f5bc */                   LDY.imm (0x17);
                                                           // else index to "FOR "
/* f5be */                   JSR.abs ("_f12f");            // display kernel I/O message

// ------------------------------------------------------- // print file name
/* f5c1 */        _`_f5c1`;  LDY.zpg ("fnlen_00b7");       // get file name length
/* f5c3 */                   BEQ.rel ("_f5d1");            // exit if null file name
/* f5c5 */                   LDY.imm (0x00);               // clear index
/* f5c7 */        _`_f5c7`;  LDA.iny ("fnadr+0_00bb");     // get file name byte
/* f5c9 */                   JSR.abs ("chrout_ffd2");      // output character to channel
/* f5cc */                   INY.imp ();                   // increment index
/* f5cd */                   CPY.zpg ("fnlen_00b7");       // compare with file name length
/* f5cf */                   BNE.rel ("_f5c7");            // loop if more to do
/* f5d1 */        _`_f5d1`;  RTS.imp ();

// ------------------------------------------------------- // display "LOADING" or "VERIFYING"
/* f5d2 */        _`_f5d2`;  LDY.imm (0x49);
                                                           // point to "LOADING"
/* f5d4 */                   LDA.zpg ("verck_0093");       // get load/verify flag
/* f5d6 */                   BEQ.rel ("_f5da");            // branch if load
/* f5d8 */                   LDY.imm (0x59);
                                                           // point to "VERIFYING"
/* f5da */        _`_f5da`;  JMP.abs ("_f12b");            // display kernel I/O message if in direct mode and return

// ------------------------------------------------------- // save RAM to device, A = index to start address, XY = end address low/high
/* f5dd */    _`save_f5dd`;  STX.zpg ("eal+0_00ae");       // save end address low byte
/* f5df */                   STY.zpg ("eal+1_00af");       // save end address high byte
/* f5e1 */                   TAX.imp ();                   // copy index to start pointer
/* f5e2 */                   LDA.zpx (0x00);               // get start address low byte
/* f5e4 */                   STA.zpg ("stal+0_00c1");      // set I/O start addresses low byte
/* f5e6 */                   LDA.zpx (0x01);               // get start address high byte
/* f5e8 */                   STA.zpg ("stal+1_00c2");      // set I/O start addresses high byte
/* f5ea */                   JMP.ind ("isave+0_0332");     // go save, usually points to $F685

// ------------------------------------------------------- // save
/* f5ed */                   LDA.zpg ("fa_00ba");          // get the device number
/* f5ef */                   BNE.rel ("_f5f4");            // if not keyboard go ??
                                                           // else ..
/* f5f1 */        _`_f5f1`;  JMP.abs ("_f713");            // else do 'illegal device number' and return
/* f5f4 */        _`_f5f4`;  CMP.imm (0x03);               // compare device number with screen
/* f5f6 */                   BEQ.rel ("_f5f1");            // if screen do illegal device number and return
/* f5f8 */                   BCC.rel ("_f659");            // branch if < screen
                                                           // is greater than screen so is serial bus
/* f5fa */                   LDA.imm (0x61);               // set secondary address to $01
                                                           // when a secondary address is to be sent to a device on
                                                           // the serial bus the address must first be ORed with $60
/* f5fc */                   STA.zpg ("sa_00b9");          // save the secondary address
/* f5fe */                   LDY.zpg ("fnlen_00b7");       // get the file name length
/* f600 */                   BNE.rel ("_f605");            // if filename not null continue
/* f602 */                   JMP.abs ("_f710");            // else do 'missing file name' error and return
/* f605 */        _`_f605`;  JSR.abs ("_f3d5");            // send secondary address and filename
/* f608 */                   JSR.abs ("_f68f");            // print saving <file name>
/* f60b */                   LDA.zpg ("fa_00ba");          // get the device number
/* f60d */                   JSR.abs ("listen_ed0c");      // command devices on the serial bus to LISTEN
/* f610 */                   LDA.zpg ("sa_00b9");          // get the secondary address
/* f612 */                   JSR.abs ("second_edb9");      // send secondary address after LISTEN
/* f615 */                   LDY.imm (0x00);               // clear index
/* f617 */                   JSR.abs ("_fb8e");            // copy I/O start address to buffer address
/* f61a */                   LDA.zpg ("sal+0_00ac");       // get buffer address low byte
/* f61c */                   JSR.abs ("ciout_eddd");       // output byte to serial bus
/* f61f */                   LDA.zpg ("sal+1_00ad");       // get buffer address high byte
/* f621 */                   JSR.abs ("ciout_eddd");       // output byte to serial bus
/* f624 */        _`_f624`;  JSR.abs ("_fcd1");            // check read/write pointer, return Cb = 1 if pointer >= end
/* f627 */                   BCS.rel ("_f63f");            // go do UNLISTEN if at end
/* f629 */                   LDA.iny ("sal+0_00ac");       // get byte from buffer
/* f62b */                   JSR.abs ("ciout_eddd");       // output byte to serial bus
/* f62e */                   JSR.abs ("stop_ffe1");        // scan stop key
/* f631 */                   BNE.rel ("_f63a");            // if stop not pressed go increment pointer and loop for next
                                                           // else ..
                                                           // close the serial bus device and flag stop
/* f633 */        _`_f633`;  JSR.abs ("_f642");            // close serial bus device
/* f636 */                   LDA.imm (0x00);
/* f638 */                   SEC.imp ();                   // flag stop
/* f639 */                   RTS.imp ();
/* f63a */        _`_f63a`;  JSR.abs ("_fcdb");            // increment read/write pointer
/* f63d */                   BNE.rel ("_f624");            // loop, branch always
/* f63f */        _`_f63f`;  JSR.abs ("unlsn_edfe");       // command serial bus to UNLISTEN
                                                           // close serial bus device
/* f642 */        _`_f642`;  BIT.zpg ("sa_00b9");          // test the secondary address
/* f644 */                   BMI.rel ("_f657");            // if already closed just exit
/* f646 */                   LDA.zpg ("fa_00ba");          // get the device number
/* f648 */                   JSR.abs ("listen_ed0c");      // command devices on the serial bus to LISTEN
/* f64b */                   LDA.zpg ("sa_00b9");          // get the secondary address
/* f64d */                   AND.imm (0xef);               // mask the channel number
/* f64f */                   ORA.imm (0xe0);               // OR with the CLOSE command
/* f651 */                   JSR.abs ("second_edb9");      // send secondary address after LISTEN
/* f654 */        _`_f654`;  JSR.abs ("unlsn_edfe");       // command serial bus to UNLISTEN
/* f657 */        _`_f657`;  CLC.imp ();                   // flag ok
/* f658 */                   RTS.imp ();
/* f659 */        _`_f659`;  LSR.acc ();
/* f65a */                   BCS.rel ("_f65f");            // if not RS232 device ??
/* f65c */                   JMP.abs ("_f713");            // else do 'illegal device number' and return
/* f65f */        _`_f65f`;  JSR.abs ("_f7d0");            // get tape buffer start pointer in XY
/* f662 */                   BCC.rel ("_f5f1");            // if < $0200 do illegal device number and return
/* f664 */                   JSR.abs ("_f838");            // wait for PLAY/RECORD
/* f667 */                   BCS.rel ("_f68e");            // exit if STOP was pressed
/* f669 */                   JSR.abs ("_f68f");            // print saving <file name>
/* f66c */                   LDX.imm (0x03);               // set header for a non relocatable program file
/* f66e */                   LDA.zpg ("sa_00b9");          // get the secondary address
/* f670 */                   AND.imm (0x01);               // mask non relocatable bit
/* f672 */                   BNE.rel ("_f676");            // if non relocatable program go ??
/* f674 */                   LDX.imm (0x01);               // else set header for a relocatable program file
/* f676 */        _`_f676`;  TXA.imp ();                   // copy header type to A
/* f677 */                   JSR.abs ("_f76a");            // write tape header
/* f67a */                   BCS.rel ("_f68e");            // exit if error
/* f67c */                   JSR.abs ("_f867");            // do tape write, 20 cycle count
/* f67f */                   BCS.rel ("_f68e");            // exit if error
/* f681 */                   LDA.zpg ("sa_00b9");          // get the secondary address
/* f683 */                   AND.imm (0x02);               // mask end of tape flag
/* f685 */                   BEQ.rel ("_f68d");            // if not end of tape go ??
/* f687 */                   LDA.imm (0x05);               // else set logical end of the tape
/* f689 */                   JSR.abs ("_f76a");            // write tape header
/* f68c */                   _.bytes(0x24);                // makes next line BIT $18 so Cb is not changed
/* f68d */        _`_f68d`;  CLC.imp ();                   // flag ok
/* f68e */        _`_f68e`;  RTS.imp ();

// ------------------------------------------------------- // print saving <file name>
/* f68f */        _`_f68f`;  LDA.zpg ("msgflg_009d");      // get message mode flag
/* f691 */                   BPL.rel ("_f68e");            // exit if control messages off
/* f693 */                   LDY.imm (0x51);
                                                           // index to "SAVING "
/* f695 */                   JSR.abs ("_f12f");            // display kernel I/O message
/* f698 */                   JMP.abs ("_f5c1");            // print file name and return

// ------------------------------------------------------- // increment the real time clock
/* f69b */   _`udtim_f69b`;  LDX.imm (0x00);               // clear X
/* f69d */                   INC.zpg ("time+2_00a2");      // increment the jiffy clock low byte
/* f69f */                   BNE.rel ("_f6a7");            // if no rollover ??
/* f6a1 */                   INC.zpg ("time+1_00a1");      // increment the jiffy clock mid byte
/* f6a3 */                   BNE.rel ("_f6a7");            // branch if no rollover
/* f6a5 */                   INC.zpg ("time+0_00a0");      // increment the jiffy clock high byte
                                                           // now subtract a days worth of jiffies from current count
                                                           // and remember only the Cb result
/* f6a7 */        _`_f6a7`;  SEC.imp ();                   // set carry for subtract
/* f6a8 */                   LDA.zpg ("time+2_00a2");      // get the jiffy clock low byte
/* f6aa */                   SBC.imm (0x01);               // subtract $4F1A01 low byte
/* f6ac */                   LDA.zpg ("time+1_00a1");      // get the jiffy clock mid byte
/* f6ae */                   SBC.imm (0x1a);               // subtract $4F1A01 mid byte
/* f6b0 */                   LDA.zpg ("time+0_00a0");      // get the jiffy clock high byte
/* f6b2 */                   SBC.imm (0x4f);               // subtract $4F1A01 high byte
/* f6b4 */                   BCC.rel ("_f6bc");            // if less than $4F1A01 jiffies skip the clock reset
                                                           // else ..
/* f6b6 */                   STX.zpg ("time+0_00a0");      // clear the jiffy clock high byte
/* f6b8 */                   STX.zpg ("time+1_00a1");      // clear the jiffy clock mid byte
/* f6ba */                   STX.zpg ("time+2_00a2");      // clear the jiffy clock low byte
                                                           // this is wrong, there are $4F1A00 jiffies in a day so
                                                           // the reset to zero should occur when the value reaches
                                                           // $4F1A00 and not $4F1A01. this would give an extra jiffy
                                                           // every day and a possible TI value of 24:00:00
/* f6bc */        _`_f6bc`;  LDA.abs ("ciaprb_dc01");      // read VIA 1 DRB, keyboard row port
/* f6bf */                   CMP.abs ("ciaprb_dc01");      // compare it with itself
/* f6c2 */                   BNE.rel ("_f6bc");            // loop if changing
/* f6c4 */                   TAX.imp ();
/* f6c5 */                   BMI.rel ("_f6da");
/* f6c7 */                   LDX.imm (0xbd);               // set c6
/* f6c9 */                   STX.abs ("ciapra_dc00");      // save VIA 1 DRA, keyboard column drive
/* f6cc */        _`_f6cc`;  LDX.abs ("ciaprb_dc01");      // read VIA 1 DRB, keyboard row port
/* f6cf */                   CPX.abs ("ciaprb_dc01");      // compare it with itself
/* f6d2 */                   BNE.rel ("_f6cc");            // loop if changing
/* f6d4 */                   STA.abs ("ciapra_dc00");      // save VIA 1 DRA, keyboard column drive
/* f6d7 */                   INX.imp ();
/* f6d8 */                   BNE.rel ("_f6dc");
/* f6da */        _`_f6da`;  STA.zpg ("stkey_0091");       // save the stop key column
/* f6dc */        _`_f6dc`;  RTS.imp ();

// ------------------------------------------------------- // read the real time clock
/* f6dd */   _`rdtim_f6dd`;  SEI.imp ();                   // disable the interrupts
/* f6de */                   LDA.zpg ("time+2_00a2");      // get the jiffy clock low byte
/* f6e0 */                   LDX.zpg ("time+1_00a1");      // get the jiffy clock mid byte
/* f6e2 */                   LDY.zpg ("time+0_00a0");      // get the jiffy clock high byte

// ------------------------------------------------------- // set the real time clock
/* f6e4 */  _`settim_f6e4`;  SEI.imp ();                   // disable the interrupts
/* f6e5 */                   STA.zpg ("time+2_00a2");      // save the jiffy clock low byte
/* f6e7 */                   STX.zpg ("time+1_00a1");      // save the jiffy clock mid byte
/* f6e9 */                   STY.zpg ("time+0_00a0");      // save the jiffy clock high byte
/* f6eb */                   CLI.imp ();                   // enable the interrupts
/* f6ec */                   RTS.imp ();

// ------------------------------------------------------- // scan the stop key, return Zb = 1 = [STOP]
/* f6ed */    _`stop_f6ed`;  LDA.zpg ("stkey_0091");       // read the stop key column
/* f6ef */                   CMP.imm (0x7f);               // compare with [STP] down
/* f6f1 */                   BNE.rel ("_f6fa");            // if not [STP] or not just [STP] exit
                                                           // just [STP] was pressed
/* f6f3 */                   PHP.imp ();                   // save status
/* f6f4 */                   JSR.abs ("clrchn_ffcc");      // close input and output channels
/* f6f7 */                   STA.zpg ("ndx_00c6");         // save the keyboard buffer index
/* f6f9 */                   PLP.imp ();                   // restore status
/* f6fa */        _`_f6fa`;  RTS.imp ();

// ------------------------------------------------------- // file error messages
/* f6fb */        _`_f6fb`;  LDA.imm (0x01);               // 'too many files' error
/* f6fd */                   _.bytes(0x2c);                // makes next line BIT $02A9
/* f6fe */        _`_f6fe`;  LDA.imm (0x02);               // 'file already open' error
/* f700 */                   _.bytes(0x2c);                // makes next line BIT $03A9
/* f701 */        _`_f701`;  LDA.imm (0x03);               // 'file not open' error
/* f703 */                   _.bytes(0x2c);                // makes next line BIT $04A9
/* f704 */        _`_f704`;  LDA.imm (0x04);               // 'file not found' error
/* f706 */                   _.bytes(0x2c);                // makes next line BIT $05A9
/* f707 */        _`_f707`;  LDA.imm (0x05);               // 'device not present' error
/* f709 */                   _.bytes(0x2c);                // makes next line BIT $06A9
/* f70a */        _`_f70a`;  LDA.imm (0x06);               // 'not input file' error
/* f70c */                   _.bytes(0x2c);                // makes next line BIT $07A9
/* f70d */        _`_f70d`;  LDA.imm (0x07);               // 'not output file' error
/* f70f */                   _.bytes(0x2c);                // makes next line BIT $08A9
/* f710 */        _`_f710`;  LDA.imm (0x08);               // 'missing file name' error
/* f712 */                   _.bytes(0x2c);                // makes next line BIT $09A9
/* f713 */        _`_f713`;  LDA.imm (0x09);               // do 'illegal device number'
/* f715 */                   PHA.imp ();                   // save the error #
/* f716 */                   JSR.abs ("clrchn_ffcc");      // close input and output channels
/* f719 */                   LDY.imm (0x00);
                                                           // index to "I/O ERROR #"
/* f71b */                   BIT.zpg ("msgflg_009d");      // test message mode flag
/* f71d */                   BVC.rel ("_f729");            // exit if kernal messages off
/* f71f */                   JSR.abs ("_f12f");            // display kernel I/O message
/* f722 */                   PLA.imp ();                   // restore error #
/* f723 */                   PHA.imp ();                   // copy error #
/* f724 */                   ORA.imm (0x30);               // convert to ASCII
/* f726 */                   JSR.abs ("chrout_ffd2");      // output character to channel
/* f729 */        _`_f729`;  PLA.imp ();                   // pull error number
/* f72a */                   SEC.imp ();                   // flag error
/* f72b */                   RTS.imp ();

// ------------------------------------------------------- // find the tape header, exit with header in buffer
/* f72c */        _`_f72c`;  LDA.zpg ("verck_0093");       // get load/verify flag
/* f72e */                   PHA.imp ();                   // save load/verify flag
/* f72f */                   JSR.abs ("_f841");            // initiate tape read
/* f732 */                   PLA.imp ();                   // restore load/verify flag
/* f733 */                   STA.zpg ("verck_0093");       // save load/verify flag
/* f735 */                   BCS.rel ("_f769");            // exit if error
/* f737 */                   LDY.imm (0x00);               // clear the index
/* f739 */                   LDA.iny ("tape1+0_00b2");     // read first byte from tape buffer
/* f73b */                   CMP.imm (0x05);               // compare with logical end of the tape
/* f73d */                   BEQ.rel ("_f769");            // if end of the tape exit
/* f73f */                   CMP.imm (0x01);               // compare with header for a relocatable program file
/* f741 */                   BEQ.rel ("_f74b");            // if program file header go ??
/* f743 */                   CMP.imm (0x03);               // compare with header for a non relocatable program file
/* f745 */                   BEQ.rel ("_f74b");            // if program file header go  ??
/* f747 */                   CMP.imm (0x04);               // compare with data file header
/* f749 */                   BNE.rel ("_f72c");            // if data file loop to find the tape header
                                                           // was a program file header
/* f74b */        _`_f74b`;  TAX.imp ();                   // copy header type
/* f74c */                   BIT.zpg ("msgflg_009d");      // get message mode flag
/* f74e */                   BPL.rel ("_f767");            // exit if control messages off
/* f750 */                   LDY.imm (0x63);
                                                           // index to "FOUND "
/* f752 */                   JSR.abs ("_f12f");            // display kernel I/O message
/* f755 */                   LDY.imm (0x05);               // index to the tape filename
/* f757 */        _`_f757`;  LDA.iny ("tape1+0_00b2");     // get byte from tape buffer
/* f759 */                   JSR.abs ("chrout_ffd2");      // output character to channel
/* f75c */                   INY.imp ();                   // increment the index
/* f75d */                   CPY.imm (0x15);               // compare it with end+1
/* f75f */                   BNE.rel ("_f757");            // loop if more to do
/* f761 */                   LDA.zpg ("time+1_00a1");      // get the jiffy clock mid byte
/* f763 */                   JSR.abs ("_e4e0");            // wait ~8.5 seconds for any key from the STOP key column
/* f766 */                   NOP.imp ();                   // waste cycles
/* f767 */        _`_f767`;  CLC.imp ();                   // flag no error
/* f768 */                   DEY.imp ();                   // decrement the index
/* f769 */        _`_f769`;  RTS.imp ();

// ------------------------------------------------------- // write the tape header
/* f76a */        _`_f76a`;  STA.zpg ("ptr1_009e");        // save header type
/* f76c */                   JSR.abs ("_f7d0");            // get tape buffer start pointer in XY
/* f76f */                   BCC.rel ("_f7cf");            // if < $0200 just exit ??
/* f771 */                   LDA.zpg ("stal+1_00c2");      // get I/O start address high byte
/* f773 */                   PHA.imp ();                   // save it
/* f774 */                   LDA.zpg ("stal+0_00c1");      // get I/O start address low byte
/* f776 */                   PHA.imp ();                   // save it
/* f777 */                   LDA.zpg ("eal+1_00af");       // get tape end address high byte
/* f779 */                   PHA.imp ();                   // save it
/* f77a */                   LDA.zpg ("eal+0_00ae");       // get tape end address low byte
/* f77c */                   PHA.imp ();                   // save it
/* f77d */                   LDY.imm (0xbf);               // index to header end
/* f77f */                   LDA.imm (0x20);               // clear byte, [SPACE]
/* f781 */        _`_f781`;  STA.iny ("tape1+0_00b2");     // clear header byte
/* f783 */                   DEY.imp ();                   // decrement index
/* f784 */                   BNE.rel ("_f781");            // loop if more to do
/* f786 */                   LDA.zpg ("ptr1_009e");        // get the header type back
/* f788 */                   STA.iny ("tape1+0_00b2");     // write it to header
/* f78a */                   INY.imp ();                   // increment the index
/* f78b */                   LDA.zpg ("stal+0_00c1");      // get the I/O start address low byte
/* f78d */                   STA.iny ("tape1+0_00b2");     // write it to header
/* f78f */                   INY.imp ();                   // increment the index
/* f790 */                   LDA.zpg ("stal+1_00c2");      // get the I/O start address high byte
/* f792 */                   STA.iny ("tape1+0_00b2");     // write it to header
/* f794 */                   INY.imp ();                   // increment the index
/* f795 */                   LDA.zpg ("eal+0_00ae");       // get the tape end address low byte
/* f797 */                   STA.iny ("tape1+0_00b2");     // write it to header
/* f799 */                   INY.imp ();                   // increment the index
/* f79a */                   LDA.zpg ("eal+1_00af");       // get the tape end address high byte
/* f79c */                   STA.iny ("tape1+0_00b2");     // write it to header
/* f79e */                   INY.imp ();                   // increment the index
/* f79f */                   STY.zpg ("ptr2_009f");        // save the index
/* f7a1 */                   LDY.imm (0x00);               // clear Y
/* f7a3 */                   STY.zpg ("ptr1_009e");        // clear the name index
/* f7a5 */        _`_f7a5`;  LDY.zpg ("ptr1_009e");        // get name index
/* f7a7 */                   CPY.zpg ("fnlen_00b7");       // compare with file name length
/* f7a9 */                   BEQ.rel ("_f7b7");            // if all done exit the loop
/* f7ab */                   LDA.iny ("fnadr+0_00bb");     // get file name byte
/* f7ad */                   LDY.zpg ("ptr2_009f");        // get buffer index
/* f7af */                   STA.iny ("tape1+0_00b2");     // save file name byte to buffer
/* f7b1 */                   INC.zpg ("ptr1_009e");        // increment file name index
/* f7b3 */                   INC.zpg ("ptr2_009f");        // increment tape buffer index
/* f7b5 */                   BNE.rel ("_f7a5");            // loop, branch always
/* f7b7 */        _`_f7b7`;  JSR.abs ("_f7d7");            // set tape buffer start and end pointers
/* f7ba */                   LDA.imm (0x69);               // set write lead cycle count
/* f7bc */                   STA.zpg ("riprty_00ab");      // save write lead cycle count
/* f7be */                   JSR.abs ("_f86b");            // do tape write, no cycle count set
/* f7c1 */                   TAY.imp ();
/* f7c2 */                   PLA.imp ();                   // pull tape end address low byte
/* f7c3 */                   STA.zpg ("eal+0_00ae");       // restore it
/* f7c5 */                   PLA.imp ();                   // pull tape end address high byte
/* f7c6 */                   STA.zpg ("eal+1_00af");       // restore it
/* f7c8 */                   PLA.imp ();                   // pull I/O start addresses low byte
/* f7c9 */                   STA.zpg ("stal+0_00c1");      // restore it
/* f7cb */                   PLA.imp ();                   // pull I/O start addresses high byte
/* f7cc */                   STA.zpg ("stal+1_00c2");      // restore it
/* f7ce */                   TYA.imp ();
/* f7cf */        _`_f7cf`;  RTS.imp ();

// ------------------------------------------------------- // get the tape buffer start pointer
/* f7d0 */        _`_f7d0`;  LDX.zpg ("tape1+0_00b2");     // get tape buffer start pointer low byte
/* f7d2 */                   LDY.zpg ("tape1+1_00b3");     // get tape buffer start pointer high byte
/* f7d4 */                   CPY.imm (0x02);               // compare high byte with $02xx
/* f7d6 */                   RTS.imp ();

// ------------------------------------------------------- // set the tape buffer start and end pointers
/* f7d7 */        _`_f7d7`;  JSR.abs ("_f7d0");            // get tape buffer start pointer in XY
/* f7da */                   TXA.imp ();                   // copy tape buffer start pointer low byte
/* f7db */                   STA.zpg ("stal+0_00c1");      // save as I/O address pointer low byte
/* f7dd */                   CLC.imp ();                   // clear carry for add
/* f7de */                   ADC.imm (0xc0);               // add buffer length low byte
/* f7e0 */                   STA.zpg ("eal+0_00ae");       // save tape buffer end pointer low byte
/* f7e2 */                   TYA.imp ();                   // copy tape buffer start pointer high byte
/* f7e3 */                   STA.zpg ("stal+1_00c2");      // save as I/O address pointer high byte
/* f7e5 */                   ADC.imm (0x00);               // add buffer length high byte
/* f7e7 */                   STA.zpg ("eal+1_00af");       // save tape buffer end pointer high byte
/* f7e9 */                   RTS.imp ();

// ------------------------------------------------------- // find specific tape header
/* f7ea */        _`_f7ea`;  JSR.abs ("_f72c");            // find tape header, exit with header in buffer
/* f7ed */                   BCS.rel ("_f80c");            // just exit if error
/* f7ef */                   LDY.imm (0x05);               // index to name
/* f7f1 */                   STY.zpg ("ptr2_009f");        // save as tape buffer index
/* f7f3 */                   LDY.imm (0x00);               // clear Y
/* f7f5 */                   STY.zpg ("ptr1_009e");        // save as name buffer index
/* f7f7 */        _`_f7f7`;  CPY.zpg ("fnlen_00b7");       // compare with file name length
/* f7f9 */                   BEQ.rel ("_f80b");            // ok exit if match
/* f7fb */                   LDA.iny ("fnadr+0_00bb");     // get file name byte
/* f7fd */                   LDY.zpg ("ptr2_009f");        // get index to tape buffer
/* f7ff */                   CMP.iny ("tape1+0_00b2");     // compare with tape header name byte
/* f801 */                   BNE.rel ("_f7ea");            // if no match go get next header
/* f803 */                   INC.zpg ("ptr1_009e");        // else increment name buffer index
/* f805 */                   INC.zpg ("ptr2_009f");        // increment tape buffer index
/* f807 */                   LDY.zpg ("ptr1_009e");        // get name buffer index
/* f809 */                   BNE.rel ("_f7f7");            // loop, branch always
/* f80b */        _`_f80b`;  CLC.imp ();                   // flag ok
/* f80c */        _`_f80c`;  RTS.imp ();

// ------------------------------------------------------- // bump tape pointer
/* f80d */        _`_f80d`;  JSR.abs ("_f7d0");            // get tape buffer start pointer in XY
/* f810 */                   INC.zpg ("bufpnt_00a6");      // increment tape buffer index
/* f812 */                   LDY.zpg ("bufpnt_00a6");      // get tape buffer index
/* f814 */                   CPY.imm (0xc0);               // compare with buffer length
/* f816 */                   RTS.imp ();

// ------------------------------------------------------- // wait for PLAY
/* f817 */        _`_f817`;  JSR.abs ("_f82e");            // return cassette sense in Zb
/* f81a */                   BEQ.rel ("_f836");            // if switch closed just exit
                                                           // cassette switch was open
/* f81c */                   LDY.imm (0x1b);
                                                           // index to "PRESS PLAY ON TAPE"
/* f81e */        _`_f81e`;  JSR.abs ("_f12f");            // display kernel I/O message
/* f821 */        _`_f821`;  JSR.abs ("_f8d0");            // scan stop key and flag abort if pressed
                                                           // note if STOP was pressed the return is to the
                                                           // routine that called this one and not here
/* f824 */                   JSR.abs ("_f82e");            // return cassette sense in Zb
/* f827 */                   BNE.rel ("_f821");            // loop if the cassette switch is open
/* f829 */                   LDY.imm (0x6a);
                                                           // index to "OK"
/* f82b */                   JMP.abs ("_f12f");            // display kernel I/O message and return

// ------------------------------------------------------- // return cassette sense in Zb
/* f82e */        _`_f82e`;  LDA.imm (0x10);               // set the mask for the cassette switch
/* f830 */                   BIT.zpg ("r6510_0001");       // test the 6510 I/O port
/* f832 */                   BNE.rel ("_f836");            // branch if cassette sense high
/* f834 */                   BIT.zpg ("r6510_0001");       // test the 6510 I/O port
/* f836 */        _`_f836`;  CLC.imp ();
/* f837 */                   RTS.imp ();

// ------------------------------------------------------- // wait for PLAY/RECORD
/* f838 */        _`_f838`;  JSR.abs ("_f82e");            // return the cassette sense in Zb
/* f83b */                   BEQ.rel ("_f836");            // exit if switch closed
                                                           // cassette switch was open
/* f83d */                   LDY.imm (0x2e);
                                                           // index to "PRESS RECORD & PLAY ON TAPE"
/* f83f */                   BNE.rel ("_f81e");            // display message and wait for switch, branch always

// ------------------------------------------------------- // initiate a tape read
/* f841 */        _`_f841`;  LDA.imm (0x00);               // clear A
/* f843 */                   STA.zpg ("status_0090");      // clear serial status byte
/* f845 */                   STA.zpg ("verck_0093");       // clear the load/verify flag
/* f847 */                   JSR.abs ("_f7d7");            // set the tape buffer start and end pointers
/* f84a */        _`_f84a`;  JSR.abs ("_f817");            // wait for PLAY
/* f84d */                   BCS.rel ("_f86e");            // exit if STOP was pressed, uses a further BCS at the
                                                           // target address to reach final target at $F8DC
/* f84f */                   SEI.imp ();                   // disable interrupts
/* f850 */                   LDA.imm (0x00);               // clear A
/* f852 */                   STA.zpg ("ridata_00aa");
/* f854 */                   STA.zpg ("bitts_00b4");
/* f856 */                   STA.zpg ("cmp0+0_00b0");      // clear tape timing constant min byte
/* f858 */                   STA.zpg ("ptr1_009e");        // clear tape pass 1 error log/char buffer
/* f85a */                   STA.zpg ("ptr2_009f");        // clear tape pass 2 error log corrected
/* f85c */                   STA.zpg ("dpsw_009c");        // clear byte received flag
/* f85e */                   LDA.imm (0x90);               // enable CA1 interrupt ??
/* f860 */                   LDX.imm (0x0e);               // set index for tape read vector
/* f862 */                   BNE.rel ("_f875");            // go do tape read/write, branch always

// ------------------------------------------------------- // initiate a tape write
/* f864 */        _`_f864`;  JSR.abs ("_f7d7");            // set tape buffer start and end pointers
                                                           // do tape write, 20 cycle count
/* f867 */        _`_f867`;  LDA.imm (0x14);               // set write lead cycle count
/* f869 */                   STA.zpg ("riprty_00ab");      // save write lead cycle count
                                                           // do tape write, no cycle count set
/* f86b */        _`_f86b`;  JSR.abs ("_f838");            // wait for PLAY/RECORD
/* f86e */        _`_f86e`;  BCS.rel ("_f8dc");            // if STOPped clear save IRQ address and exit
/* f870 */                   SEI.imp ();                   // disable interrupts
/* f871 */                   LDA.imm (0x82);               // enable ?? interrupt
/* f873 */                   LDX.imm (0x08);               // set index for tape write tape leader vector

// ------------------------------------------------------- // tape read/write
/* f875 */        _`_f875`;  LDY.imm (0x7f);               // disable all interrupts
/* f877 */                   STY.abs ("ciaicr_dc0d");      // save VIA 1 ICR, disable all interrupts
/* f87a */                   STA.abs ("ciaicr_dc0d");      // save VIA 1 ICR, enable interrupts according to A
                                                           // check RS232 bus idle
/* f87d */                   LDA.abs ("ciacra_dc0e");      // read VIA 1 CRA
/* f880 */                   ORA.imm (0x19);               // load timer B, timer B single shot, start timer B
/* f882 */                   STA.abs ("ciacrb_dc0f");      // save VIA 1 CRB
/* f885 */                   AND.imm (0x91);               // mask x00x 000x, TOD clock, load timer A, start timer A
/* f887 */                   STA.abs ("todsns_02a2");      // save VIA 1 CRB shadow copy
/* f88a */                   JSR.abs ("_f0a4");
/* f88d */                   LDA.abs ("scroly_d011");      // read the vertical fine scroll and control register
/* f890 */                   AND.imm (0xef);               // mask xxx0 xxxx, blank the screen
/* f892 */                   STA.abs ("scroly_d011");      // save the vertical fine scroll and control register
/* f895 */                   LDA.abs ("cinv+0_0314");      // get IRQ vector low byte
/* f898 */                   STA.abs ("irqtmp+0_029f");    // save IRQ vector low byte
/* f89b */                   LDA.abs ("cinv+1_0315");      // get IRQ vector high byte
/* f89e */                   STA.abs ("irqtmp+1_02a0");    // save IRQ vector high byte
/* f8a1 */                   JSR.abs ("_fcbd");            // set the tape vector
/* f8a4 */                   LDA.imm (0x02);               // set copies count. the first copy is the load copy, the
                                                           // second copy is the verify copy
/* f8a6 */                   STA.zpg ("fsblk_00be");       // save copies count
/* f8a8 */                   JSR.abs ("_fb97");            // new tape byte setup
/* f8ab */                   LDA.zpg ("r6510_0001");       // read the 6510 I/O port
/* f8ad */                   AND.imm (0x1f);               // mask 000x xxxx, cassette motor on ??
/* f8af */                   STA.zpg ("r6510_0001");       // save the 6510 I/O port
/* f8b1 */                   STA.zpg ("cas1_00c0");        // set the tape motor interlock
                                                           // 326656 cycle delay, allow tape motor speed to stabilise
/* f8b3 */                   LDX.imm (0xff);               // outer loop count
/* f8b5 */        _`_f8b5`;  LDY.imm (0xff);               // inner loop count
/* f8b7 */        _`_f8b7`;  DEY.imp ();                   // decrement inner loop count
/* f8b8 */                   BNE.rel ("_f8b7");            // loop if more to do
/* f8ba */                   DEX.imp ();                   // decrement outer loop count
/* f8bb */                   BNE.rel ("_f8b5");            // loop if more to do
/* f8bd */                   CLI.imp ();                   // enable tape interrupts
/* f8be */        _`_f8be`;  LDA.abs ("irqtmp+1_02a0");    // get saved IRQ high byte
/* f8c1 */                   CMP.abs ("cinv+1_0315");      // compare with the current IRQ high byte
/* f8c4 */                   CLC.imp ();                   // flag ok
/* f8c5 */                   BEQ.rel ("_f8dc");            // if tape write done go clear saved IRQ address and exit
/* f8c7 */                   JSR.abs ("_f8d0");            // scan stop key and flag abort if pressed
                                                           // note if STOP was pressed the return is to the
                                                           // routine that called this one and not here
/* f8ca */                   JSR.abs ("_f6bc");            // increment real time clock
/* f8cd */                   JMP.abs ("_f8be");            // loop

// ------------------------------------------------------- // scan stop key and flag abort if pressed
/* f8d0 */        _`_f8d0`;  JSR.abs ("stop_ffe1");        // scan stop key
/* f8d3 */                   CLC.imp ();                   // flag no stop
/* f8d4 */                   BNE.rel ("_f8e1");            // exit if no stop
/* f8d6 */                   JSR.abs ("_fc93");            // restore everything for STOP
/* f8d9 */                   SEC.imp ();                   // flag stopped
/* f8da */                   PLA.imp ();                   // dump return address low byte
/* f8db */                   PLA.imp ();                   // dump return address high byte

// ------------------------------------------------------- // clear saved IRQ address
/* f8dc */        _`_f8dc`;  LDA.imm (0x00);               // clear A
/* f8de */                   STA.abs ("irqtmp+1_02a0");    // clear saved IRQ address high byte
/* f8e1 */        _`_f8e1`;  RTS.imp ();

// ------------------------------------------------------- // # set timing
/* f8e2 */        _`_f8e2`;  STX.zpg ("cmp0+1_00b1");      // save tape timing constant max byte
/* f8e4 */                   LDA.zpg ("cmp0+0_00b0");      // get tape timing constant min byte
/* f8e6 */                   ASL.acc ();                   // *2
/* f8e7 */                   ASL.acc ();                   // *4
/* f8e8 */                   CLC.imp ();                   // clear carry for add
/* f8e9 */                   ADC.zpg ("cmp0+0_00b0");      // add tape timing constant min byte *5
/* f8eb */                   CLC.imp ();                   // clear carry for add
/* f8ec */                   ADC.zpg ("cmp0+1_00b1");      // add tape timing constant max byte
/* f8ee */                   STA.zpg ("cmp0+1_00b1");      // save tape timing constant max byte
/* f8f0 */                   LDA.imm (0x00);
/* f8f2 */                   BIT.zpg ("cmp0+0_00b0");      // test tape timing constant min byte
/* f8f4 */                   BMI.rel ("_f8f7");            // branch if b7 set
/* f8f6 */                   ROL.acc ();                   // else shift carry into ??
/* f8f7 */        _`_f8f7`;  ASL.zpg ("cmp0+1_00b1");      // shift tape timing constant max byte
/* f8f9 */                   ROL.acc ();
/* f8fa */                   ASL.zpg ("cmp0+1_00b1");      // shift tape timing constant max byte
/* f8fc */                   ROL.acc ();
/* f8fd */                   TAX.imp ();
/* f8fe */        _`_f8fe`;  LDA.abs ("timblo_dc06");      // get VIA 1 timer B low byte
/* f901 */                   CMP.imm (0x16);               // compare with ??
/* f903 */                   BCC.rel ("_f8fe");            // loop if less
/* f905 */                   ADC.zpg ("cmp0+1_00b1");      // add tape timing constant max byte
/* f907 */                   STA.abs ("timalo_dc04");      // save VIA 1 timer A low byte
/* f90a */                   TXA.imp ();
/* f90b */                   ADC.abs ("timbhi_dc07");      // add VIA 1 timer B high byte
/* f90e */                   STA.abs ("timahi_dc05");      // save VIA 1 timer A high byte
/* f911 */                   LDA.abs ("todsns_02a2");      // read VIA 1 CRB shadow copy
/* f914 */                   STA.abs ("ciacra_dc0e");      // save VIA 1 CRA
/* f917 */                   STA.abs ("td1irq_02a4");      // save VIA 1 CRA shadow copy
/* f91a */                   LDA.abs ("ciaicr_dc0d");      // read VIA 1 ICR
/* f91d */                   AND.imm (0x10);               // mask 000x 0000, FLAG interrupt
/* f91f */                   BEQ.rel ("_f92a");            // if no FLAG interrupt just exit
                                                           // else first call the IRQ routine
/* f921 */                   LDA.imm (0xf9);               // set the return address high byte
/* f923 */                   PHA.imp ();                   // push the return address high byte
/* f924 */                   LDA.imm (0x2a);               // set the return address low byte
/* f926 */                   PHA.imp ();                   // push the return address low byte
/* f927 */                   JMP.abs ("_ff43");            // save the status and do the IRQ routine
/* f92a */        _`_f92a`;  CLI.imp ();                   // enable interrupts
/* f92b */                   RTS.imp ();

// ------------------------------------------------------- // On Commodore computers, the streams consist of four kinds of symbols
                                                           // that denote different kinds of low-to-high-to-low transitions on the
                                                           // read or write signals of the Commodore cassette interface.

                                                           // A A break in the communications, or a pulse with very long cycle
                                                           //   time.

                                                           // B A short pulse, whose cycle time typically ranges from 296 to 424
                                                           //   microseconds, depending on the computer model.

                                                           // C A medium-length pulse, whose cycle time typically ranges from
                                                           //   440 to 576 microseconds, depending on the computer model.

                                                           // D A long pulse, whose cycle time typically ranges from 600 to 744
                                                           //   microseconds, depending on the computer model.

                                                           //  The actual interpretation of the serial data takes a little more work to explain.
                                                           // The typical ROM tape loader (and the turbo loaders) will initialize a timer with a
                                                           // specified value and start it counting down. If either the tape data changes or the
                                                           // timer runs out, an IRQ will occur. The loader will determine which condition caused
                                                           // the IRQ. If the tape data changed before the timer ran out, we have a short pulse,
                                                           // or a "0" bit. If the timer ran out first, we have a long pulse, or a "1" bit. Doing
                                                           // this continuously and we decode the entire file.
                                                           // read tape bits, IRQ routine
                                                           // read T2C which has been counting down from $FFFF. subtract this from $FFFF
/* f92c */        _`_f92c`;  LDX.abs ("timbhi_dc07");      // read VIA 1 timer B high byte
/* f92f */                   LDY.imm (0xff);               // set $FF
/* f931 */                   TYA.imp ();                   // A = $FF
/* f932 */                   SBC.abs ("timblo_dc06");      // subtract VIA 1 timer B low byte
/* f935 */                   CPX.abs ("timbhi_dc07");      // compare it with VIA 1 timer B high byte
/* f938 */                   BNE.rel ("_f92c");            // if timer low byte rolled over loop
/* f93a */                   STX.zpg ("cmp0+1_00b1");      // save tape timing constant max byte
/* f93c */                   TAX.imp ();                   // copy $FF - T2C_l
/* f93d */                   STY.abs ("timblo_dc06");      // save VIA 1 timer B low byte
/* f940 */                   STY.abs ("timbhi_dc07");      // save VIA 1 timer B high byte
/* f943 */                   LDA.imm (0x19);               // load timer B, timer B single shot, start timer B
/* f945 */                   STA.abs ("ciacrb_dc0f");      // save VIA 1 CRB
/* f948 */                   LDA.abs ("ciaicr_dc0d");      // read VIA 1 ICR
/* f94b */                   STA.abs ("trdtmp_02a3");      // save VIA 1 ICR shadow copy
/* f94e */                   TYA.imp ();                   // y = $FF
/* f94f */                   SBC.zpg ("cmp0+1_00b1");      // subtract tape timing constant max byte
                                                           // A = $FF - T2C_h
/* f951 */                   STX.zpg ("cmp0+1_00b1");      // save tape timing constant max byte
                                                           // $B1 = $FF - T2C_l
/* f953 */                   LSR.acc ();                   // A = $FF - T2C_h >> 1
/* f954 */                   ROR.zpg ("cmp0+1_00b1");      // shift tape timing constant max byte
                                                           // $B1 = $FF - T2C_l >> 1
/* f956 */                   LSR.acc ();                   // A = $FF - T2C_h >> 1
/* f957 */                   ROR.zpg ("cmp0+1_00b1");      // shift tape timing constant max byte
                                                           // $B1 = $FF - T2C_l >> 1
/* f959 */                   LDA.zpg ("cmp0+0_00b0");      // get tape timing constant min byte
/* f95b */                   CLC.imp ();                   // clear carry for add
/* f95c */                   ADC.imm (0x3c);
/* f95e */                   CMP.zpg ("cmp0+1_00b1");      // compare with tape timing constant max byte
                                                           // compare with ($FFFF - T2C) >> 2
/* f960 */                   BCS.rel ("_f9ac");            // branch if min + $3C >= ($FFFF - T2C) >> 2
                                                           // min + $3C < ($FFFF - T2C) >> 2
/* f962 */                   LDX.zpg ("dpsw_009c");        // get byte received flag
/* f964 */                   BEQ.rel ("_f969");            //  if not byte received ??
/* f966 */                   JMP.abs ("_fa60");            // store the tape character
/* f969 */        _`_f969`;  LDX.zpg ("tsfcnt_00a3");      // get EOI flag byte
/* f96b */                   BMI.rel ("_f988");
/* f96d */                   LDX.imm (0x00);
/* f96f */                   ADC.imm (0x30);
/* f971 */                   ADC.zpg ("cmp0+0_00b0");      // add tape timing constant min byte
/* f973 */                   CMP.zpg ("cmp0+1_00b1");      // compare with tape timing constant max byte
/* f975 */                   BCS.rel ("_f993");
/* f977 */                   INX.imp ();
/* f978 */                   ADC.imm (0x26);
/* f97a */                   ADC.zpg ("cmp0+0_00b0");      // add tape timing constant min byte
/* f97c */                   CMP.zpg ("cmp0+1_00b1");      // compare with tape timing constant max byte
/* f97e */                   BCS.rel ("_f997");
/* f980 */                   ADC.imm (0x2c);
/* f982 */                   ADC.zpg ("cmp0+0_00b0");      // add tape timing constant min byte
/* f984 */                   CMP.zpg ("cmp0+1_00b1");      // compare with tape timing constant max byte
/* f986 */                   BCC.rel ("_f98b");
/* f988 */        _`_f988`;  JMP.abs ("_fa10");
/* f98b */        _`_f98b`;  LDA.zpg ("bitts_00b4");       // get the bit count
/* f98d */                   BEQ.rel ("_f9ac");            // if all done go ??
/* f98f */                   STA.zpg ("bitci_00a8");       // save receiver bit count in
/* f991 */                   BNE.rel ("_f9ac");            // branch always
/* f993 */        _`_f993`;  INC.zpg ("rinone_00a9");      // increment ?? start bit check flag
/* f995 */                   BCS.rel ("_f999");
/* f997 */        _`_f997`;  DEC.zpg ("rinone_00a9");      // decrement ?? start bit check flag
/* f999 */        _`_f999`;  SEC.imp ();
/* f99a */                   SBC.imm (0x13);
/* f99c */                   SBC.zpg ("cmp0+1_00b1");      // subtract tape timing constant max byte
/* f99e */                   ADC.zpg ("svxt_0092");        // add timing constant for tape
/* f9a0 */                   STA.zpg ("svxt_0092");        // save timing constant for tape
/* f9a2 */                   LDA.zpg ("tbtcnt_00a4");      // get tape bit cycle phase
/* f9a4 */                   EOR.imm (0x01);
/* f9a6 */                   STA.zpg ("tbtcnt_00a4");      // save tape bit cycle phase
/* f9a8 */                   BEQ.rel ("_f9d5");
/* f9aa */                   STX.zpg ("schar_00d7");
/* f9ac */        _`_f9ac`;  LDA.zpg ("bitts_00b4");       // get the bit count
/* f9ae */                   BEQ.rel ("_f9d2");            // if all done go ??
/* f9b0 */                   LDA.abs ("trdtmp_02a3");      // read VIA 1 ICR shadow copy
/* f9b3 */                   AND.imm (0x01);               // mask 0000 000x, timer A interrupt enabled
/* f9b5 */                   BNE.rel ("_f9bc");            // if timer A is enabled go ??
/* f9b7 */                   LDA.abs ("td1irq_02a4");      // read VIA 1 CRA shadow copy
/* f9ba */                   BNE.rel ("_f9d2");            // if ?? just exit
/* f9bc */        _`_f9bc`;  LDA.imm (0x00);               // clear A
/* f9be */                   STA.zpg ("tbtcnt_00a4");      // clear the tape bit cycle phase
/* f9c0 */                   STA.abs ("td1irq_02a4");      // save VIA 1 CRA shadow copy
/* f9c3 */                   LDA.zpg ("tsfcnt_00a3");      // get EOI flag byte
/* f9c5 */                   BPL.rel ("_f9f7");
/* f9c7 */                   BMI.rel ("_f988");
/* f9c9 */        _`_f9c9`;  LDX.imm (0xa6);               // set timimg max byte
/* f9cb */                   JSR.abs ("_f8e2");            // set timing
/* f9ce */                   LDA.zpg ("prty_009b");
/* f9d0 */                   BNE.rel ("_f98b");
/* f9d2 */        _`_f9d2`;  JMP.abs ("_febc");            // restore registers and exit interrupt
/* f9d5 */        _`_f9d5`;  LDA.zpg ("svxt_0092");        // get timing constant for tape
/* f9d7 */                   BEQ.rel ("_f9e0");
/* f9d9 */                   BMI.rel ("_f9de");
/* f9db */                   DEC.zpg ("cmp0+0_00b0");      // decrement tape timing constant min byte
/* f9dd */                   _.bytes(0x2c);                // makes next line BIT $B0E6
/* f9de */        _`_f9de`;  INC.zpg ("cmp0+0_00b0");      // increment tape timing constant min byte
/* f9e0 */        _`_f9e0`;  LDA.imm (0x00);
/* f9e2 */                   STA.zpg ("svxt_0092");        // clear timing constant for tape
/* f9e4 */                   CPX.zpg ("schar_00d7");
/* f9e6 */                   BNE.rel ("_f9f7");
/* f9e8 */                   TXA.imp ();
/* f9e9 */                   BNE.rel ("_f98b");
/* f9eb */                   LDA.zpg ("rinone_00a9");      // get start bit check flag
/* f9ed */                   BMI.rel ("_f9ac");
/* f9ef */                   CMP.imm (0x10);
/* f9f1 */                   BCC.rel ("_f9ac");
/* f9f3 */                   STA.zpg ("syno_0096");        // save cassette block synchronization number
/* f9f5 */                   BCS.rel ("_f9ac");
/* f9f7 */        _`_f9f7`;  TXA.imp ();
/* f9f8 */                   EOR.zpg ("prty_009b");
/* f9fa */                   STA.zpg ("prty_009b");
/* f9fc */                   LDA.zpg ("bitts_00b4");
/* f9fe */                   BEQ.rel ("_f9d2");
/* fa00 */                   DEC.zpg ("tsfcnt_00a3");      // decrement EOI flag byte
/* fa02 */                   BMI.rel ("_f9c9");
/* fa04 */                   LSR.zpg ("schar_00d7");
/* fa06 */                   ROR.zpg ("mych_00bf");        // parity count
/* fa08 */                   LDX.imm (0xda);               // set timimg max byte
/* fa0a */                   JSR.abs ("_f8e2");            // set timing
/* fa0d */                   JMP.abs ("_febc");            // restore registers and exit interrupt
/* fa10 */        _`_fa10`;  LDA.zpg ("syno_0096");        // get cassette block synchronization number
/* fa12 */                   BEQ.rel ("_fa18");
/* fa14 */                   LDA.zpg ("bitts_00b4");
/* fa16 */                   BEQ.rel ("_fa1f");
/* fa18 */        _`_fa18`;  LDA.zpg ("tsfcnt_00a3");      // get EOI flag byte
/* fa1a */                   BMI.rel ("_fa1f");
/* fa1c */                   JMP.abs ("_f997");
/* fa1f */        _`_fa1f`;  LSR.zpg ("cmp0+1_00b1");      // shift tape timing constant max byte
/* fa21 */                   LDA.imm (0x93);
/* fa23 */                   SEC.imp ();
/* fa24 */                   SBC.zpg ("cmp0+1_00b1");      // subtract tape timing constant max byte
/* fa26 */                   ADC.zpg ("cmp0+0_00b0");      // add tape timing constant min byte
/* fa28 */                   ASL.acc ();
/* fa29 */                   TAX.imp ();                   // copy timimg high byte
/* fa2a */                   JSR.abs ("_f8e2");            // set timing
/* fa2d */                   INC.zpg ("dpsw_009c");
/* fa2f */                   LDA.zpg ("bitts_00b4");
/* fa31 */                   BNE.rel ("_fa44");
/* fa33 */                   LDA.zpg ("syno_0096");        // get cassette block synchronization number
/* fa35 */                   BEQ.rel ("_fa5d");
/* fa37 */                   STA.zpg ("bitci_00a8");       // save receiver bit count in
/* fa39 */                   LDA.imm (0x00);               // clear A
/* fa3b */                   STA.zpg ("syno_0096");        // clear cassette block synchronization number
/* fa3d */                   LDA.imm (0x81);               // enable timer A interrupt
/* fa3f */                   STA.abs ("ciaicr_dc0d");      // save VIA 1 ICR
/* fa42 */                   STA.zpg ("bitts_00b4");
/* fa44 */        _`_fa44`;  LDA.zpg ("syno_0096");        // get cassette block synchronization number
/* fa46 */                   STA.zpg ("nxtbit_00b5");
/* fa48 */                   BEQ.rel ("_fa53");
/* fa4a */                   LDA.imm (0x00);
/* fa4c */                   STA.zpg ("bitts_00b4");
/* fa4e */                   LDA.imm (0x01);               // disable timer A interrupt
/* fa50 */                   STA.abs ("ciaicr_dc0d");      // save VIA 1 ICR
/* fa53 */        _`_fa53`;  LDA.zpg ("mych_00bf");        // parity count
/* fa55 */                   STA.zpg ("roprty_00bd");      // save RS232 parity byte
/* fa57 */                   LDA.zpg ("bitci_00a8");       // get receiver bit count in
/* fa59 */                   ORA.zpg ("rinone_00a9");      // OR with start bit check flag
/* fa5b */                   STA.zpg ("rodata_00b6");
/* fa5d */        _`_fa5d`;  JMP.abs ("_febc");            // restore registers and exit interrupt

// ------------------------------------------------------- // # store character
/* fa60 */        _`_fa60`;  JSR.abs ("_fb97");            // new tape byte setup
/* fa63 */                   STA.zpg ("dpsw_009c");        // clear byte received flag
/* fa65 */                   LDX.imm (0xda);               // set timimg max byte
/* fa67 */                   JSR.abs ("_f8e2");            // set timing
/* fa6a */                   LDA.zpg ("fsblk_00be");       // get copies count
/* fa6c */                   BEQ.rel ("_fa70");
/* fa6e */                   STA.zpg ("inbit_00a7");       // save receiver input bit temporary storage
/* fa70 */        _`_fa70`;  LDA.imm (0x0f);
/* fa72 */                   BIT.zpg ("ridata_00aa");
/* fa74 */                   BPL.rel ("_fa8d");
/* fa76 */                   LDA.zpg ("nxtbit_00b5");
/* fa78 */                   BNE.rel ("_fa86");
/* fa7a */                   LDX.zpg ("fsblk_00be");       // get copies count
/* fa7c */                   DEX.imp ();
/* fa7d */                   BNE.rel ("_fa8a");            // if ?? restore registers and exit interrupt
/* fa7f */                   LDA.imm (0x08);               // set short block
/* fa81 */                   JSR.abs ("_fe1c");            // OR into serial status byte
/* fa84 */                   BNE.rel ("_fa8a");            // restore registers and exit interrupt, branch always
/* fa86 */        _`_fa86`;  LDA.imm (0x00);
/* fa88 */                   STA.zpg ("ridata_00aa");
/* fa8a */        _`_fa8a`;  JMP.abs ("_febc");            // restore registers and exit interrupt
/* fa8d */        _`_fa8d`;  BVS.rel ("_fac0");
/* fa8f */                   BNE.rel ("_faa9");
/* fa91 */                   LDA.zpg ("nxtbit_00b5");
/* fa93 */                   BNE.rel ("_fa8a");
/* fa95 */                   LDA.zpg ("rodata_00b6");
/* fa97 */                   BNE.rel ("_fa8a");
/* fa99 */                   LDA.zpg ("inbit_00a7");       // get receiver input bit temporary storage
/* fa9b */                   LSR.acc ();
/* fa9c */                   LDA.zpg ("roprty_00bd");      // get RS232 parity byte
/* fa9e */                   BMI.rel ("_faa3");
/* faa0 */                   BCC.rel ("_faba");
/* faa2 */                   CLC.imp ();
/* faa3 */        _`_faa3`;  BCS.rel ("_faba");
/* faa5 */                   AND.imm (0x0f);
/* faa7 */                   STA.zpg ("ridata_00aa");
/* faa9 */        _`_faa9`;  DEC.zpg ("ridata_00aa");
/* faab */                   BNE.rel ("_fa8a");
/* faad */                   LDA.imm (0x40);
/* faaf */                   STA.zpg ("ridata_00aa");
/* fab1 */                   JSR.abs ("_fb8e");            // copy I/O start address to buffer address
/* fab4 */                   LDA.imm (0x00);
/* fab6 */                   STA.zpg ("riprty_00ab");
/* fab8 */                   BEQ.rel ("_fa8a");
/* faba */        _`_faba`;  LDA.imm (0x80);
/* fabc */                   STA.zpg ("ridata_00aa");
/* fabe */                   BNE.rel ("_fa8a");            // restore registers and exit interrupt, branch always
/* fac0 */        _`_fac0`;  LDA.zpg ("nxtbit_00b5");
/* fac2 */                   BEQ.rel ("_face");
/* fac4 */                   LDA.imm (0x04);
/* fac6 */                   JSR.abs ("_fe1c");            // OR into serial status byte
/* fac9 */                   LDA.imm (0x00);
/* facb */                   JMP.abs ("_fb4a");
/* face */        _`_face`;  JSR.abs ("_fcd1");            // check read/write pointer, return Cb = 1 if pointer >= end
/* fad1 */                   BCC.rel ("_fad6");
/* fad3 */                   JMP.abs ("_fb48");
/* fad6 */        _`_fad6`;  LDX.zpg ("inbit_00a7");       // get receiver input bit temporary storage
/* fad8 */                   DEX.imp ();
/* fad9 */                   BEQ.rel ("_fb08");
/* fadb */                   LDA.zpg ("verck_0093");       // get load/verify flag
/* fadd */                   BEQ.rel ("_faeb");            // if load go ??
/* fadf */                   LDY.imm (0x00);               // clear index
/* fae1 */                   LDA.zpg ("roprty_00bd");      // get RS232 parity byte
/* fae3 */                   CMP.iny ("sal+0_00ac");
/* fae5 */                   BEQ.rel ("_faeb");
/* fae7 */                   LDA.imm (0x01);
/* fae9 */                   STA.zpg ("rodata_00b6");
/* faeb */        _`_faeb`;  LDA.zpg ("rodata_00b6");
/* faed */                   BEQ.rel ("_fb3a");
/* faef */                   LDX.imm (0x3d);
/* faf1 */                   CPX.zpg ("ptr1_009e");
/* faf3 */                   BCC.rel ("_fb33");
/* faf5 */                   LDX.zpg ("ptr1_009e");
/* faf7 */                   LDA.zpg ("sal+1_00ad");
/* faf9 */                   STA.abx ("bad+1_0101");
/* fafc */                   LDA.zpg ("sal+0_00ac");
/* fafe */                   STA.abx ("bad+0_0100");
/* fb01 */                   INX.imp ();
/* fb02 */                   INX.imp ();
/* fb03 */                   STX.zpg ("ptr1_009e");
/* fb05 */                   JMP.abs ("_fb3a");
/* fb08 */        _`_fb08`;  LDX.zpg ("ptr2_009f");
/* fb0a */                   CPX.zpg ("ptr1_009e");
/* fb0c */                   BEQ.rel ("_fb43");
/* fb0e */                   LDA.zpg ("sal+0_00ac");
/* fb10 */                   CMP.abx ("bad+0_0100");
/* fb13 */                   BNE.rel ("_fb43");
/* fb15 */                   LDA.zpg ("sal+1_00ad");
/* fb17 */                   CMP.abx ("bad+1_0101");
/* fb1a */                   BNE.rel ("_fb43");
/* fb1c */                   INC.zpg ("ptr2_009f");
/* fb1e */                   INC.zpg ("ptr2_009f");
/* fb20 */                   LDA.zpg ("verck_0093");       // get load/verify flag
/* fb22 */                   BEQ.rel ("_fb2f");            // if load ??
/* fb24 */                   LDA.zpg ("roprty_00bd");      // get RS232 parity byte
/* fb26 */                   LDY.imm (0x00);
/* fb28 */                   CMP.iny ("sal+0_00ac");
/* fb2a */                   BEQ.rel ("_fb43");
/* fb2c */                   INY.imp ();
/* fb2d */                   STY.zpg ("rodata_00b6");
/* fb2f */        _`_fb2f`;  LDA.zpg ("rodata_00b6");
/* fb31 */                   BEQ.rel ("_fb3a");
/* fb33 */        _`_fb33`;  LDA.imm (0x10);
/* fb35 */                   JSR.abs ("_fe1c");            // OR into serial status byte
/* fb38 */                   BNE.rel ("_fb43");
/* fb3a */        _`_fb3a`;  LDA.zpg ("verck_0093");       // get load/verify flag
/* fb3c */                   BNE.rel ("_fb43");            // if verify go ??
/* fb3e */                   TAY.imp ();
/* fb3f */                   LDA.zpg ("roprty_00bd");      // get RS232 parity byte
/* fb41 */                   STA.iny ("sal+0_00ac");
/* fb43 */        _`_fb43`;  JSR.abs ("_fcdb");            // increment read/write pointer
/* fb46 */                   BNE.rel ("_fb8b");            // restore registers and exit interrupt, branch always
/* fb48 */        _`_fb48`;  LDA.imm (0x80);
/* fb4a */        _`_fb4a`;  STA.zpg ("ridata_00aa");
/* fb4c */                   SEI.imp ();
/* fb4d */                   LDX.imm (0x01);               // disable timer A interrupt
/* fb4f */                   STX.abs ("ciaicr_dc0d");      // save VIA 1 ICR
/* fb52 */                   LDX.abs ("ciaicr_dc0d");      // read VIA 1 ICR
/* fb55 */                   LDX.zpg ("fsblk_00be");       // get copies count
/* fb57 */                   DEX.imp ();
/* fb58 */                   BMI.rel ("_fb5c");
/* fb5a */                   STX.zpg ("fsblk_00be");       // save copies count
/* fb5c */        _`_fb5c`;  DEC.zpg ("inbit_00a7");       // decrement receiver input bit temporary storage
/* fb5e */                   BEQ.rel ("_fb68");
/* fb60 */                   LDA.zpg ("ptr1_009e");
/* fb62 */                   BNE.rel ("_fb8b");            // if ?? restore registers and exit interrupt
/* fb64 */                   STA.zpg ("fsblk_00be");       // save copies count
/* fb66 */                   BEQ.rel ("_fb8b");            // restore registers and exit interrupt, branch always
/* fb68 */        _`_fb68`;  JSR.abs ("_fc93");            // restore everything for STOP
/* fb6b */                   JSR.abs ("_fb8e");            // copy I/O start address to buffer address
/* fb6e */                   LDY.imm (0x00);               // clear index
/* fb70 */                   STY.zpg ("riprty_00ab");      // clear checksum
/* fb72 */        _`_fb72`;  LDA.iny ("sal+0_00ac");       // get byte from buffer
/* fb74 */                   EOR.zpg ("riprty_00ab");      // XOR with checksum
/* fb76 */                   STA.zpg ("riprty_00ab");      // save new checksum
/* fb78 */                   JSR.abs ("_fcdb");            // increment read/write pointer
/* fb7b */                   JSR.abs ("_fcd1");            // check read/write pointer, return Cb = 1 if pointer >= end
/* fb7e */                   BCC.rel ("_fb72");            // loop if not at end
/* fb80 */                   LDA.zpg ("riprty_00ab");      // get computed checksum
/* fb82 */                   EOR.zpg ("roprty_00bd");      // compare with stored checksum ??
/* fb84 */                   BEQ.rel ("_fb8b");            // if checksum ok restore registers and exit interrupt
/* fb86 */                   LDA.imm (0x20);               // else set checksum error
/* fb88 */                   JSR.abs ("_fe1c");            // OR into the serial status byte
/* fb8b */        _`_fb8b`;  JMP.abs ("_febc");            // restore registers and exit interrupt

// ------------------------------------------------------- // copy I/O start address to buffer address
/* fb8e */        _`_fb8e`;  LDA.zpg ("stal+1_00c2");      // get I/O start address high byte
/* fb90 */                   STA.zpg ("sal+1_00ad");       // set buffer address high byte
/* fb92 */                   LDA.zpg ("stal+0_00c1");      // get I/O start address low byte
/* fb94 */                   STA.zpg ("sal+0_00ac");       // set buffer address low byte
/* fb96 */                   RTS.imp ();

// ------------------------------------------------------- // new tape byte setup
/* fb97 */        _`_fb97`;  LDA.imm (0x08);               // eight bits to do
/* fb99 */                   STA.zpg ("tsfcnt_00a3");      // set bit count
/* fb9b */                   LDA.imm (0x00);               // clear A
/* fb9d */                   STA.zpg ("tbtcnt_00a4");      // clear tape bit cycle phase
/* fb9f */                   STA.zpg ("bitci_00a8");       // clear start bit first cycle done flag
/* fba1 */                   STA.zpg ("prty_009b");        // clear byte parity
/* fba3 */                   STA.zpg ("rinone_00a9");      // clear start bit check flag, set no start bit yet
/* fba5 */                   RTS.imp ();

// ------------------------------------------------------- // send lsb from tape write byte to tape
                                                           // this routine tests the least significant bit in the tape write byte and sets VIA 2 T2
                                                           // depending on the state of the bit. if the bit is a 1 a time of $00B0 cycles is set, if
                                                           // the bot is a 0 a time of $0060 cycles is set. note that this routine does not shift the
                                                           // bits of the tape write byte but uses a copy of that byte, the byte itself is shifted
                                                           // elsewhere
/* fba6 */        _`_fba6`;  LDA.zpg ("roprty_00bd");      // get tape write byte
/* fba8 */                   LSR.acc ();                   // shift lsb into Cb
/* fba9 */                   LDA.imm (0x60);               // set time constant low byte for bit = 0
/* fbab */                   BCC.rel ("_fbaf");            // branch if bit was 0
                                                           // set time constant for bit = 1 and toggle tape
/* fbad */        _`_fbad`;  LDA.imm (0xb0);               // set time constant low byte for bit = 1
                                                           // write time constant and toggle tape
/* fbaf */        _`_fbaf`;  LDX.imm (0x00);               // set time constant high byte
                                                           // write time constant and toggle tape
/* fbb1 */        _`_fbb1`;  STA.abs ("timblo_dc06");      // save VIA 1 timer B low byte
/* fbb4 */                   STX.abs ("timbhi_dc07");      // save VIA 1 timer B high byte
/* fbb7 */                   LDA.abs ("ciaicr_dc0d");      // read VIA 1 ICR
/* fbba */                   LDA.imm (0x19);               // load timer B, timer B single shot, start timer B
/* fbbc */                   STA.abs ("ciacrb_dc0f");      // save VIA 1 CRB
/* fbbf */                   LDA.zpg ("r6510_0001");       // read the 6510 I/O port
/* fbc1 */                   EOR.imm (0x08);               // toggle tape out bit
/* fbc3 */                   STA.zpg ("r6510_0001");       // save the 6510 I/O port
/* fbc5 */                   AND.imm (0x08);               // mask tape out bit
/* fbc7 */                   RTS.imp ();

// ------------------------------------------------------- // flag block done and exit interrupt
/* fbc8 */        _`_fbc8`;  SEC.imp ();                   // set carry flag
/* fbc9 */                   ROR.zpg ("rodata_00b6");      // set buffer address high byte negative, flag all sync,
                                                           // data and checksum bytes written
/* fbcb */                   BMI.rel ("_fc09");            // restore registers and exit interrupt, branch always

// ------------------------------------------------------- // tape write IRQ routine
                                                           // this is the routine that writes the bits to the tape. it is called each time VIA 2 T2
                                                           // times out and checks if the start bit is done, if so checks if the data bits are done,
                                                           // if so it checks if the byte is done, if so it checks if the synchronisation bytes are
                                                           // done, if so it checks if the data bytes are done, if so it checks if the checksum byte
                                                           // is done, if so it checks if both the load and verify copies have been done, if so it
                                                           // stops the tape
/* fbcd */                   LDA.zpg ("bitci_00a8");       // get start bit first cycle done flag
/* fbcf */                   BNE.rel ("_fbe3");            // if first cycle done go do rest of byte
                                                           // each byte sent starts with two half cycles of $0110 ststem clocks and the whole block
                                                           // ends with two more such half cycles
/* fbd1 */                   LDA.imm (0x10);               // set first start cycle time constant low byte
/* fbd3 */                   LDX.imm (0x01);               // set first start cycle time constant high byte
/* fbd5 */                   JSR.abs ("_fbb1");            // write time constant and toggle tape
/* fbd8 */                   BNE.rel ("_fc09");            // if first half cycle go restore registers and exit
                                                           // interrupt
/* fbda */                   INC.zpg ("bitci_00a8");       // set start bit first start cycle done flag
/* fbdc */                   LDA.zpg ("rodata_00b6");      // get buffer address high byte
/* fbde */                   BPL.rel ("_fc09");            // if block not complete go restore registers and exit
                                                           // interrupt. the end of a block is indicated by the tape
                                                           // buffer high byte b7 being set to 1
/* fbe0 */                   JMP.abs ("_fc57");            // else do tape routine, block complete exit
                                                           // continue tape byte write. the first start cycle, both half cycles of it, is complete
                                                           // so the routine drops straight through to here
/* fbe3 */        _`_fbe3`;  LDA.zpg ("rinone_00a9");      // get start bit check flag
/* fbe5 */                   BNE.rel ("_fbf0");            // if the start bit is complete go send the byte bits
                                                           // after the two half cycles of $0110 ststem clocks the start bit is completed with two
                                                           // half cycles of $00B0 system clocks. this is the same as the first part of a 1 bit
/* fbe7 */                   JSR.abs ("_fbad");            // set time constant for bit = 1 and toggle tape
/* fbea */                   BNE.rel ("_fc09");            // if first half cycle go restore registers and exit
                                                           // interrupt
/* fbec */                   INC.zpg ("rinone_00a9");      // set start bit check flag
/* fbee */                   BNE.rel ("_fc09");            // restore registers and exit interrupt, branch always
                                                           // continue tape byte write. the start bit, both cycles of it, is complete so the routine
                                                           // drops straight through to here. now the cycle pairs for each bit, and the parity bit,
                                                           // are sent
/* fbf0 */        _`_fbf0`;  JSR.abs ("_fba6");            // send lsb from tape write byte to tape
/* fbf3 */                   BNE.rel ("_fc09");            // if first half cycle go restore registers and exit
                                                           // interrupt
                                                           // else two half cycles have been done
/* fbf5 */                   LDA.zpg ("tbtcnt_00a4");      // get tape bit cycle phase
/* fbf7 */                   EOR.imm (0x01);               // toggle b0
/* fbf9 */                   STA.zpg ("tbtcnt_00a4");      // save tape bit cycle phase
/* fbfb */                   BEQ.rel ("_fc0c");            // if bit cycle phase complete go setup for next bit
                                                           // each bit is written as two full cycles. a 1 is sent as a full cycle of $0160 system
                                                           // clocks then a full cycle of $00C0 system clocks. a 0 is sent as a full cycle of $00C0
                                                           // system clocks then a full cycle of $0160 system clocks. to do this each bit from the
                                                           // write byte is inverted during the second bit cycle phase. as the bit is inverted it
                                                           // is also added to the, one bit, parity count for this byte
/* fbfd */                   LDA.zpg ("roprty_00bd");      // get tape write byte
/* fbff */                   EOR.imm (0x01);               // invert bit being sent
/* fc01 */                   STA.zpg ("roprty_00bd");      // save tape write byte
/* fc03 */                   AND.imm (0x01);               // mask b0
/* fc05 */                   EOR.zpg ("prty_009b");        // EOR with tape write byte parity bit
/* fc07 */                   STA.zpg ("prty_009b");        // save tape write byte parity bit
/* fc09 */        _`_fc09`;  JMP.abs ("_febc");            // restore registers and exit interrupt
                                                           // the bit cycle phase is complete so shift out the just written bit and test for byte
                                                           // end
/* fc0c */        _`_fc0c`;  LSR.zpg ("roprty_00bd");      // shift bit out of tape write byte
/* fc0e */                   DEC.zpg ("tsfcnt_00a3");      // decrement tape write bit count
/* fc10 */                   LDA.zpg ("tsfcnt_00a3");      // get tape write bit count
/* fc12 */                   BEQ.rel ("_fc4e");            // if all the data bits have been written go setup for
                                                           // sending the parity bit next and exit the interrupt
/* fc14 */                   BPL.rel ("_fc09");            // if all the data bits are not yet sent just restore the
                                                           // registers and exit the interrupt
                                                           // do next tape byte
                                                           // the byte is complete. the start bit, data bits and parity bit have been written to
                                                           // the tape so setup for the next byte
/* fc16 */        _`_fc16`;  JSR.abs ("_fb97");            // new tape byte setup
/* fc19 */                   CLI.imp ();                   // enable the interrupts
/* fc1a */                   LDA.zpg ("cntdn_00a5");       // get cassette synchronization character count
/* fc1c */                   BEQ.rel ("_fc30");            // if synchronisation characters done go do block data
                                                           // at the start of each block sent to tape there are a number of synchronisation bytes
                                                           // that count down to the actual data. the commodore tape system saves two copies of all
                                                           // the tape data, the first is loaded and is indicated by the synchronisation bytes
                                                           // having b7 set, and the second copy is indicated by the synchronisation bytes having b7
                                                           // clear. the sequence goes $09, $08, ..... $02, $01, data bytes
/* fc1e */                   LDX.imm (0x00);               // clear X
/* fc20 */                   STX.zpg ("schar_00d7");       // clear checksum byte
/* fc22 */                   DEC.zpg ("cntdn_00a5");       // decrement cassette synchronization byte count
/* fc24 */                   LDX.zpg ("fsblk_00be");       // get cassette copies count
/* fc26 */                   CPX.imm (0x02);               // compare with load block indicator
/* fc28 */                   BNE.rel ("_fc2c");            // branch if not the load block
/* fc2a */                   ORA.imm (0x80);               // this is the load block so make the synchronisation count
                                                           // go $89, $88, ..... $82, $81
/* fc2c */        _`_fc2c`;  STA.zpg ("roprty_00bd");      // save the synchronisation byte as the tape write byte
/* fc2e */                   BNE.rel ("_fc09");            // restore registers and exit interrupt, branch always
                                                           // the synchronization bytes have been done so now check and do the actual block data
/* fc30 */        _`_fc30`;  JSR.abs ("_fcd1");            // check read/write pointer, return Cb = 1 if pointer >= end
/* fc33 */                   BCC.rel ("_fc3f");            // if not all done yet go get the byte to send
/* fc35 */                   BNE.rel ("_fbc8");            // if pointer > end go flag block done and exit interrupt
                                                           // else the block is complete, it only remains to write the
                                                           // checksum byte to the tape so setup for that
/* fc37 */                   INC.zpg ("sal+1_00ad");       // increment buffer pointer high byte, this means the block
                                                           // done branch will always be taken next time without having
                                                           // to worry about the low byte wrapping to zero
/* fc39 */                   LDA.zpg ("schar_00d7");       // get checksum byte
/* fc3b */                   STA.zpg ("roprty_00bd");      // save checksum as tape write byte
/* fc3d */                   BCS.rel ("_fc09");            // restore registers and exit interrupt, branch always
                                                           // the block isn't finished so get the next byte to write to tape
/* fc3f */        _`_fc3f`;  LDY.imm (0x00);               // clear index
/* fc41 */                   LDA.iny ("sal+0_00ac");       // get byte from buffer
/* fc43 */                   STA.zpg ("roprty_00bd");      // save as tape write byte
/* fc45 */                   EOR.zpg ("schar_00d7");       // XOR with checksum byte
/* fc47 */                   STA.zpg ("schar_00d7");       // save new checksum byte
/* fc49 */                   JSR.abs ("_fcdb");            // increment read/write pointer
/* fc4c */                   BNE.rel ("_fc09");            // restore registers and exit interrupt, branch always
                                                           // set parity as next bit and exit interrupt
/* fc4e */        _`_fc4e`;  LDA.zpg ("prty_009b");        // get parity bit
/* fc50 */                   EOR.imm (0x01);               // toggle it
/* fc52 */                   STA.zpg ("roprty_00bd");      // save as tape write byte
/* fc54 */        _`_fc54`;  JMP.abs ("_febc");            // restore registers and exit interrupt
                                                           // tape routine, block complete exit
/* fc57 */        _`_fc57`;  DEC.zpg ("fsblk_00be");       // decrement copies remaining to read/write
/* fc59 */                   BNE.rel ("_fc5e");            // branch if more to do
/* fc5b */                   JSR.abs ("_fcca");            // stop the cassette motor
/* fc5e */        _`_fc5e`;  LDA.imm (0x50);               // set tape write leader count
/* fc60 */                   STA.zpg ("inbit_00a7");       // save tape write leader count
/* fc62 */                   LDX.imm (0x08);               // set index for write tape leader vector
/* fc64 */                   SEI.imp ();                   // disable the interrupts
/* fc65 */                   JSR.abs ("_fcbd");            // set the tape vector
/* fc68 */                   BNE.rel ("_fc54");            // restore registers and exit interrupt, branch always

// ------------------------------------------------------- // write tape leader IRQ routine
/* fc6a */                   LDA.imm (0x78);               // set time constant low byte for bit = leader
/* fc6c */                   JSR.abs ("_fbaf");            // write time constant and toggle tape
/* fc6f */                   BNE.rel ("_fc54");            // if tape bit high restore registers and exit interrupt
/* fc71 */                   DEC.zpg ("inbit_00a7");       // decrement cycle count
/* fc73 */                   BNE.rel ("_fc54");            // if not all done restore registers and exit interrupt
/* fc75 */                   JSR.abs ("_fb97");            // new tape byte setup
/* fc78 */                   DEC.zpg ("riprty_00ab");      // decrement cassette leader count
/* fc7a */                   BPL.rel ("_fc54");            // if not all done restore registers and exit interrupt
/* fc7c */                   LDX.imm (0x0a);               // set index for tape write vector
/* fc7e */                   JSR.abs ("_fcbd");            // set the tape vector
/* fc81 */                   CLI.imp ();                   // enable the interrupts
/* fc82 */                   INC.zpg ("riprty_00ab");      // clear cassette leader counter, was $FF
/* fc84 */                   LDA.zpg ("fsblk_00be");       // get cassette block count
/* fc86 */                   BEQ.rel ("_fcb8");            // if all done restore everything for STOP and exit the
                                                           // interrupt
/* fc88 */                   JSR.abs ("_fb8e");            // copy I/O start address to buffer address
/* fc8b */                   LDX.imm (0x09);               // set nine synchronisation bytes
/* fc8d */                   STX.zpg ("cntdn_00a5");       // save cassette synchronization byte count
/* fc8f */                   STX.zpg ("rodata_00b6");
/* fc91 */                   BNE.rel ("_fc16");            // go do the next tape byte, branch always

// ------------------------------------------------------- // restore everything for STOP
/* fc93 */        _`_fc93`;  PHP.imp ();                   // save status
/* fc94 */                   SEI.imp ();                   // disable the interrupts
/* fc95 */                   LDA.abs ("scroly_d011");      // read the vertical fine scroll and control register
/* fc98 */                   ORA.imm (0x10);               // mask xxx1 xxxx, unblank the screen
/* fc9a */                   STA.abs ("scroly_d011");      // save the vertical fine scroll and control register
/* fc9d */                   JSR.abs ("_fcca");            // stop the cassette motor
/* fca0 */                   LDA.imm (0x7f);               // disable all interrupts
/* fca2 */                   STA.abs ("ciaicr_dc0d");      // save VIA 1 ICR
/* fca5 */                   JSR.abs ("_fddd");
/* fca8 */                   LDA.abs ("irqtmp+1_02a0");    // get saved IRQ vector high byte
/* fcab */                   BEQ.rel ("_fcb6");            // branch if null
/* fcad */                   STA.abs ("cinv+1_0315");      // restore IRQ vector high byte
/* fcb0 */                   LDA.abs ("irqtmp+0_029f");    // get saved IRQ vector low byte
/* fcb3 */                   STA.abs ("cinv+0_0314");      // restore IRQ vector low byte
/* fcb6 */        _`_fcb6`;  PLP.imp ();                   // restore status
/* fcb7 */                   RTS.imp ();

// ------------------------------------------------------- // reset vector
/* fcb8 */        _`_fcb8`;  JSR.abs ("_fc93");            // restore everything for STOP
/* fcbb */                   BEQ.rel ("_fc54");            // restore registers and exit interrupt, branch always

// ------------------------------------------------------- // set tape vector
/* fcbd */        _`_fcbd`;  LDA.abx (0xfd93);             // get tape IRQ vector low byte
/* fcc0 */                   STA.abs ("cinv+0_0314");      // set IRQ vector low byte
/* fcc3 */                   LDA.abx (0xfd94);             // get tape IRQ vector high byte
/* fcc6 */                   STA.abs ("cinv+1_0315");      // set IRQ vector high byte
/* fcc9 */                   RTS.imp ();

// ------------------------------------------------------- // stop the cassette motor
/* fcca */        _`_fcca`;  LDA.zpg ("r6510_0001");       // read the 6510 I/O port
/* fccc */                   ORA.imm (0x20);               // mask xxxx xx1x, turn the cassette motor off
/* fcce */                   STA.zpg ("r6510_0001");       // save the 6510 I/O port
/* fcd0 */                   RTS.imp ();

// ------------------------------------------------------- // check read/write pointer
                                                           // return Cb = 1 if pointer >= end
/* fcd1 */        _`_fcd1`;  SEC.imp ();                   // set carry for subtract
/* fcd2 */                   LDA.zpg ("sal+0_00ac");       // get buffer address low byte
/* fcd4 */                   SBC.zpg ("eal+0_00ae");       // subtract buffer end low byte
/* fcd6 */                   LDA.zpg ("sal+1_00ad");       // get buffer address high byte
/* fcd8 */                   SBC.zpg ("eal+1_00af");       // subtract buffer end high byte
/* fcda */                   RTS.imp ();

// ------------------------------------------------------- // increment read/write pointer
/* fcdb */        _`_fcdb`;  INC.zpg ("sal+0_00ac");       // increment buffer address low byte
/* fcdd */                   BNE.rel ("_fce1");            // branch if no overflow
/* fcdf */                   INC.zpg ("sal+1_00ad");       // increment buffer address low byte
/* fce1 */        _`_fce1`;  RTS.imp ();

// ------------------------------------------------------- // RESET, hardware reset starts here
/* fce2 */                   LDX.imm (0xff);               // set X for stack
/* fce4 */                   SEI.imp ();                   // disable the interrupts
/* fce5 */                   TXS.imp ();                   // clear stack
/* fce6 */                   CLD.imp ();                   // clear decimal mode
/* fce7 */                   JSR.abs ("_fd02");            // scan for autostart ROM at $8000
/* fcea */                   BNE.rel ("_fcef");            // if not there continue startup
/* fcec */                   JMP.ind ("_8000");            // else call ROM start code
/* fcef */        _`_fcef`;  STX.abs ("scrolx_d016");      // read the horizontal fine scroll and control register
/* fcf2 */                   JSR.abs ("ioinit_fda3");      // initialise SID, CIA and IRQ
/* fcf5 */                   JSR.abs ("ramtas_fd50");      // RAM test and find RAM end
/* fcf8 */                   JSR.abs ("restor_fd15");      // restore default I/O vectors
/* fcfb */                   JSR.abs ("cint_ff5b");        // initialise VIC and screen editor
/* fcfe */                   CLI.imp ();                   // enable the interrupts
/* fcff */                   JMP.ind ("restart_a000");     // execute BASIC

// ------------------------------------------------------- // scan for autostart ROM at $8000, returns Zb=1 if ROM found
/* fd02 */        _`_fd02`;  LDX.imm (0x05);               // five characters to test
/* fd04 */        _`_fd04`;  LDA.abx ("_fd0f");            // get test character
/* fd07 */                   CMP.abx ("_8003");            // compare wiith byte in ROM space
/* fd0a */                   BNE.rel ("_fd0f");            // exit if no match
/* fd0c */                   DEX.imp ();                   // decrement index
/* fd0d */                   BNE.rel ("_fd04");            // loop if not all done
/* fd0f */        _`_fd0f`;  RTS.imp ();
// ------------------------------------------------------- // autostart ROM signature
                                                           // 'CBM80’
/* fd10 */                   _.bytes(0xc3, 0xc2, 0xcd, 0x38, 0x30);

// ------------------------------------------------------- // restore default I/O vectors
/* fd15 */  _`restor_fd15`;  LDX.imm (0x30);               // pointer to vector table low byte
/* fd17 */                   LDY.imm (0xfd);               // pointer to vector table high byte
/* fd19 */                   CLC.imp ();                   // flag set vectors

// ------------------------------------------------------- // set/read vectored I/O from (XY), Cb = 1 to read, Cb = 0 to set
/* fd1a */  _`vector_fd1a`;  STX.zpg ("memuss+0_00c3");    // save pointer low byte
/* fd1c */                   STY.zpg ("memuss+1_00c4");    // save pointer high byte
/* fd1e */                   LDY.imm (0x1f);               // set byte count
/* fd20 */        _`_fd20`;  LDA.aby ("cinv+0_0314");      // read vector byte from vectors
/* fd23 */                   BCS.rel ("_fd27");            // branch if read vectors
/* fd25 */                   LDA.iny ("memuss+0_00c3");    // read vector byte from (XY)
/* fd27 */        _`_fd27`;  STA.iny ("memuss+0_00c3");    // save byte to (XY)
/* fd29 */                   STA.aby ("cinv+0_0314");      // save byte to vector
/* fd2c */                   DEY.imp ();                   // decrement index
/* fd2d */                   BPL.rel ("_fd20");            // loop if more to do
/* fd2f */                   RTS.imp ();
                                                           //  The above code works but it tries to write to the ROM. while this is usually harmless
                                                           //  systems that use flash ROM may suffer. Here is a version that makes the extra write
                                                           //  to RAM instead but is otherwise identical in function. ##

                                                           //  set/read vectored I/O from (XY), Cb = 1 to read, Cb = 0 to set

                                                           // STX $C3         ; save pointer low byte
                                                           // STY $C4         ; save pointer high byte
                                                           // LDY #$1F        ; set byte count
                                                           // LDA ($C3),Y     ; read vector byte from (XY)
                                                           // BCC $FD29       ; branch if set vectors

                                                           // LDA $0314,Y     ; else read vector byte from vectors
                                                           // STA ($C3),Y     ; save byte to (XY)
                                                           // STA $0314,Y     ; save byte to vector
                                                           // DEY             ; decrement index
                                                           // BPL $FD20       ; loop if more to do

                                                           // RTS

// ------------------------------------------------------- // kernal vectors
/* fd30 */                   _.bytes(0x31, 0xea);          // $0314 IRQ vector
/* fd32 */                   _.bytes(0x66, 0xfe);          // $0316 BRK vector
/* fd34 */                   _.bytes(0x47, 0xfe);          // $0318 NMI vector
/* fd36 */                   _.bytes(0x4a, 0xf3);          // $031A open a logical file
/* fd38 */                   _.bytes(0x91, 0xf2);          // $031C close a specified logical file
/* fd3a */                   _.bytes(0x0e, 0xf2);          // $031E open channel for input
/* fd3c */                   _.bytes(0x50, 0xf2);          // $0320 open channel for output
/* fd3e */                   _.bytes(0x33, 0xf3);          // $0322 close input and output channels
/* fd40 */                   _.bytes(0x57, 0xf1);          // $0324 input character from channel
/* fd42 */                   _.bytes(0xca, 0xf1);          // $0326 output character to channel
/* fd44 */                   _.bytes(0xed, 0xf6);          // $0328 scan stop key
/* fd46 */                   _.bytes(0x3e, 0xf1);          // $032A get character from the input device
/* fd48 */                   _.bytes(0x2f, 0xf3);          // $032C close all channels and files
/* fd4a */                   _.bytes(0x66, 0xfe);          // $032E user function
                                                           // Vector to user defined command, currently points to BRK.
                                                           // This appears to be a holdover from PET days, when the built-in machine language monitor
                                                           // would jump through the $032E vector when it encountered a command that it did not
                                                           // understand, allowing the user to add new commands to the monitor.
                                                           // Although this vector is initialized to point to the routine called by STOP/RESTORE and
                                                           // the BRK interrupt, and is updated by the kernal vector routine at $FD57, it no longer
                                                           // has any function.
/* fd4c */                   _.bytes(0xa5, 0xf4);          // $0330 load
/* fd4e */                   _.bytes(0xed, 0xf5);          // $0332 save

// ------------------------------------------------------- // test RAM and find RAM end
/* fd50 */  _`ramtas_fd50`;  LDA.imm (0x00);               // clear A
/* fd52 */                   TAY.imp ();                   // clear index
/* fd53 */        _`_fd53`;  STA.aby ("_0002");            // clear page 0, don't do $0000 or $0001
/* fd56 */                   STA.aby ("buf+0_0200");       // clear page 2
/* fd59 */                   STA.aby ("ierror+0_0300");    // clear page 3
/* fd5c */                   INY.imp ();                   // increment index
/* fd5d */                   BNE.rel ("_fd53");            // loop if more to do
/* fd5f */                   LDX.imm (0x3c);               // set cassette buffer pointer low byte
/* fd61 */                   LDY.imm (0x03);               // set cassette buffer pointer high byte
/* fd63 */                   STX.zpg ("tape1+0_00b2");     // save tape buffer start pointer low byte
/* fd65 */                   STY.zpg ("tape1+1_00b3");     // save tape buffer start pointer high byte
/* fd67 */                   TAY.imp ();                   // clear Y
/* fd68 */                   LDA.imm (0x03);               // set RAM test pointer high byte
/* fd6a */                   STA.zpg ("stal+1_00c2");      // save RAM test pointer high byte
/* fd6c */        _`_fd6c`;  INC.zpg ("stal+1_00c2");      // increment RAM test pointer high byte
/* fd6e */        _`_fd6e`;  LDA.iny ("stal+0_00c1");
/* fd70 */                   TAX.imp ();
/* fd71 */                   LDA.imm (0x55);
/* fd73 */                   STA.iny ("stal+0_00c1");
/* fd75 */                   CMP.iny ("stal+0_00c1");
/* fd77 */                   BNE.rel ("_fd88");
/* fd79 */                   ROL.acc ();
/* fd7a */                   STA.iny ("stal+0_00c1");
/* fd7c */                   CMP.iny ("stal+0_00c1");
/* fd7e */                   BNE.rel ("_fd88");
/* fd80 */                   TXA.imp ();
/* fd81 */                   STA.iny ("stal+0_00c1");
/* fd83 */                   INY.imp ();
/* fd84 */                   BNE.rel ("_fd6e");
/* fd86 */                   BEQ.rel ("_fd6c");
/* fd88 */        _`_fd88`;  TYA.imp ();
/* fd89 */                   TAX.imp ();
/* fd8a */                   LDY.zpg ("stal+1_00c2");
/* fd8c */                   CLC.imp ();
/* fd8d */                   JSR.abs ("_fe2d");            // set the top of memory
/* fd90 */                   LDA.imm (0x08);
/* fd92 */                   STA.abs ("memstr+1_0282");    // save the OS start of memory high byte
/* fd95 */                   LDA.imm (0x04);
/* fd97 */                   STA.abs ("hibase_0288");      // save the screen memory page
/* fd9a */                   RTS.imp ();

// ------------------------------------------------------- // tape IRQ vectors
/* fd9b */                   _.bytes(0x6a, 0xfc);          // $08 write tape leader IRQ routine
/* fd9d */                   _.bytes(0xcd, 0xfb);          // $0A tape write IRQ routine
/* fd9f */                   _.bytes(0x31, 0xea);          // $0C normal IRQ vector
/* fda1 */                   _.bytes(0x2c, 0xf9);          // $0E read tape bits IRQ routine

// ------------------------------------------------------- // initialise SID, CIA and IRQ
/* fda3 */  _`ioinit_fda3`;  LDA.imm (0x7f);               // disable all interrupts
/* fda5 */                   STA.abs ("ciaicr_dc0d");      // save VIA 1 ICR
/* fda8 */                   STA.abs ("ci2icr_dd0d");      // save VIA 2 ICR
/* fdab */                   STA.abs ("ciapra_dc00");      // save VIA 1 DRA, keyboard column drive
/* fdae */                   LDA.imm (0x08);               // set timer single shot
/* fdb0 */                   STA.abs ("ciacra_dc0e");      // save VIA 1 CRA
/* fdb3 */                   STA.abs ("ci2cra_dd0e");      // save VIA 2 CRA
/* fdb6 */                   STA.abs ("ciacrb_dc0f");      // save VIA 1 CRB
/* fdb9 */                   STA.abs ("ci2crb_dd0f");      // save VIA 2 CRB
/* fdbc */                   LDX.imm (0x00);               // set all inputs
/* fdbe */                   STX.abs ("ciddrb_dc03");      // save VIA 1 DDRB, keyboard row
/* fdc1 */                   STX.abs ("c2ddrb_dd03");      // save VIA 2 DDRB, RS232 port
/* fdc4 */                   STX.abs ("sigvol_d418");      // clear the volume and filter select register
/* fdc7 */                   DEX.imp ();                   // set X = $FF
/* fdc8 */                   STX.abs ("ciddra_dc02");      // save VIA 1 DDRA, keyboard column
/* fdcb */                   LDA.imm (0x07);               // DATA out high, CLK out high, ATN out high, RE232 Tx DATA
                                                           // high, video address 15 = 1, video address 14 = 1
/* fdcd */                   STA.abs ("ci2pra_dd00");      // save VIA 2 DRA, serial port and video address
/* fdd0 */                   LDA.imm (0x3f);               // set serial DATA input, serial CLK input
/* fdd2 */                   STA.abs ("c2ddra_dd02");      // save VIA 2 DDRA, serial port and video address
/* fdd5 */                   LDA.imm (0xe7);               // set 1110 0111, motor off, enable I/O, enable KERNAL,
                                                           // enable BASIC
/* fdd7 */                   STA.zpg ("r6510_0001");       // save the 6510 I/O port
/* fdd9 */                   LDA.imm (0x2f);               // set 0010 1111, 0 = input, 1 = output
/* fddb */                   STA.zpg ("d6510_0000");       // save the 6510 I/O port direction register
/* fddd */        _`_fddd`;  LDA.abs ("tvsflg_02a6");      // get the PAL/NTSC flag
/* fde0 */                   BEQ.rel ("_fdec");            // if NTSC go set NTSC timing
                                                           // else set PAL timing
/* fde2 */                   LDA.imm (0x25);
/* fde4 */                   STA.abs ("timalo_dc04");      // save VIA 1 timer A low byte
/* fde7 */                   LDA.imm (0x40);
/* fde9 */                   JMP.abs ("_fdf3");
/* fdec */        _`_fdec`;  LDA.imm (0x95);
/* fdee */                   STA.abs ("timalo_dc04");      // save VIA 1 timer A low byte
/* fdf1 */                   LDA.imm (0x42);
/* fdf3 */        _`_fdf3`;  STA.abs ("timahi_dc05");      // save VIA 1 timer A high byte
/* fdf6 */                   JMP.abs ("_ff6e");

// ------------------------------------------------------- // set filename
/* fdf9 */  _`setnam_fdf9`;  STA.zpg ("fnlen_00b7");       // set file name length
/* fdfb */                   STX.zpg ("fnadr+0_00bb");     // set file name pointer low byte
/* fdfd */                   STY.zpg ("fnadr+1_00bc");     // set file name pointer high byte
/* fdff */                   RTS.imp ();

// ------------------------------------------------------- // set logical, first and second addresses
/* fe00 */  _`setlfs_fe00`;  STA.zpg ("la_00b8");          // save the logical file
/* fe02 */                   STX.zpg ("fa_00ba");          // save the device number
/* fe04 */                   STY.zpg ("sa_00b9");          // save the secondary address
/* fe06 */                   RTS.imp ();

// ------------------------------------------------------- // read I/O status word
/* fe07 */  _`readst_fe07`;  LDA.zpg ("fa_00ba");          // get the device number
/* fe09 */                   CMP.imm (0x02);               // compare device with RS232 device
/* fe0b */                   BNE.rel ("_fe1a");            // if not RS232 device go ??
                                                           // get RS232 device status
/* fe0d */                   LDA.abs ("rsstat_0297");      // get the RS232 status register
/* fe10 */                   PHA.imp ();                   // save the RS232 status value
/* fe11 */                   LDA.imm (0x00);               // clear A
/* fe13 */                   STA.abs ("rsstat_0297");      // clear the RS232 status register
/* fe16 */                   PLA.imp ();                   // restore the RS232 status value
/* fe17 */                   RTS.imp ();

// ------------------------------------------------------- // control kernal messages
/* fe18 */  _`setmsg_fe18`;  STA.zpg ("msgflg_009d");      // set message mode flag
/* fe1a */        _`_fe1a`;  LDA.zpg ("status_0090");      // read the serial status byte

// ------------------------------------------------------- // OR into the serial status byte
/* fe1c */        _`_fe1c`;  ORA.zpg ("status_0090");      // OR with the serial status byte
/* fe1e */                   STA.zpg ("status_0090");      // save the serial status byte
/* fe20 */                   RTS.imp ();

// ------------------------------------------------------- // set timeout on serial bus
/* fe21 */  _`settmo_fe21`;  STA.abs ("timout_0285");      // save serial bus timeout flag
/* fe24 */                   RTS.imp ();

// ------------------------------------------------------- // read/set the top of memory, Cb = 1 to read, Cb = 0 to set
/* fe25 */  _`memtop_fe25`;  BCC.rel ("_fe2d");            // if Cb clear go set the top of memory

// ------------------------------------------------------- // read the top of memory
/* fe27 */        _`_fe27`;  LDX.abs ("memsiz+0_0283");    // get memory top low byte
/* fe2a */                   LDY.abs ("memsiz+1_0284");    // get memory top high byte

// ------------------------------------------------------- // set the top of memory
/* fe2d */        _`_fe2d`;  STX.abs ("memsiz+0_0283");    // set memory top low byte
/* fe30 */                   STY.abs ("memsiz+1_0284");    // set memory top high byte
/* fe33 */                   RTS.imp ();

// ------------------------------------------------------- // read/set the bottom of memory, Cb = 1 to read, Cb = 0 to set
/* fe34 */  _`membot_fe34`;  BCC.rel ("_fe3c");            // if Cb clear go set the bottom of memory
/* fe36 */                   LDX.abs ("memstr+0_0281");    // get the OS start of memory low byte
/* fe39 */                   LDY.abs ("memstr+1_0282");    // get the OS start of memory high byte
/* fe3c */        _`_fe3c`;  STX.abs ("memstr+0_0281");    // save the OS start of memory low byte
/* fe3f */                   STY.abs ("memstr+1_0282");    // save the OS start of memory high byte
/* fe42 */                   RTS.imp ();

// ------------------------------------------------------- // NMI vector
/* fe43 */                   SEI.imp ();                   // disable the interrupts
/* fe44 */                   JMP.ind ("nminv+0_0318");     // do NMI vector

// ------------------------------------------------------- // NMI handler
/* fe47 */                   PHA.imp ();                   // save A
/* fe48 */                   TXA.imp ();                   // copy X
/* fe49 */                   PHA.imp ();                   // save X
/* fe4a */                   TYA.imp ();                   // copy Y
/* fe4b */                   PHA.imp ();                   // save Y
/* fe4c */                   LDA.imm (0x7f);               // disable all interrupts
/* fe4e */                   STA.abs ("ci2icr_dd0d");      // save VIA 2 ICR
/* fe51 */                   LDY.abs ("ci2icr_dd0d");      // save VIA 2 ICR
/* fe54 */                   BMI.rel ("_fe72");
/* fe56 */                   JSR.abs ("_fd02");            // scan for autostart ROM at $8000
/* fe59 */                   BNE.rel ("_fe5e");            // branch if no autostart ROM
/* fe5b */                   JMP.ind ("_8002");            // else do autostart ROM break entry
/* fe5e */        _`_fe5e`;  JSR.abs ("_f6bc");            // increment real time clock
/* fe61 */                   JSR.abs ("stop_ffe1");        // scan stop key
/* fe64 */                   BNE.rel ("_fe72");            // if not [STOP] restore registers and exit interrupt

// ------------------------------------------------------- // user function default vector
                                                           // BRK handler
/* fe66 */                   JSR.abs ("restor_fd15");      // restore default I/O vectors
/* fe69 */                   JSR.abs ("ioinit_fda3");      // initialise SID, CIA and IRQ
/* fe6c */                   JSR.abs ("cint1_e518");       // initialise the screen and keyboard
/* fe6f */                   JMP.ind ("_a002");            // do BASIC break entry

// ------------------------------------------------------- // RS232 NMI routine
/* fe72 */        _`_fe72`;  TYA.imp ();
/* fe73 */                   AND.abs ("enabl_02a1");       // AND with the RS-232 interrupt enable byte
/* fe76 */                   TAX.imp ();
/* fe77 */                   AND.imm (0x01);
/* fe79 */                   BEQ.rel ("_fea3");
/* fe7b */                   LDA.abs ("ci2pra_dd00");      // read VIA 2 DRA, serial port and video address
/* fe7e */                   AND.imm (0xfb);               // mask xxxx x0xx, clear RS232 Tx DATA
/* fe80 */                   ORA.zpg ("nxtbit_00b5");      // OR in the RS232 transmit data bit
/* fe82 */                   STA.abs ("ci2pra_dd00");      // save VIA 2 DRA, serial port and video address
/* fe85 */                   LDA.abs ("enabl_02a1");       // get the RS-232 interrupt enable byte
/* fe88 */                   STA.abs ("ci2icr_dd0d");      // save VIA 2 ICR
/* fe8b */                   TXA.imp ();
/* fe8c */                   AND.imm (0x12);
/* fe8e */                   BEQ.rel ("_fe9d");
/* fe90 */                   AND.imm (0x02);
/* fe92 */                   BEQ.rel ("_fe9a");
/* fe94 */                   JSR.abs ("_fed6");
/* fe97 */                   JMP.abs ("_fe9d");
/* fe9a */        _`_fe9a`;  JSR.abs ("_ff07");
/* fe9d */        _`_fe9d`;  JSR.abs ("_eebb");
/* fea0 */                   JMP.abs ("_feb6");
/* fea3 */        _`_fea3`;  TXA.imp ();                   // get active interrupts back
/* fea4 */                   AND.imm (0x02);               // mask ?? interrupt
/* fea6 */                   BEQ.rel ("_feae");            // branch if not ?? interrupt
                                                           // was ?? interrupt
/* fea8 */                   JSR.abs ("_fed6");
/* feab */                   JMP.abs ("_feb6");
/* feae */        _`_feae`;  TXA.imp ();                   // get active interrupts back
/* feaf */                   AND.imm (0x10);               // mask CB1 interrupt, Rx data bit transition
/* feb1 */                   BEQ.rel ("_feb6");            // if no bit restore registers and exit interrupt
/* feb3 */                   JSR.abs ("_ff07");
/* feb6 */        _`_feb6`;  LDA.abs ("enabl_02a1");       // get the RS-232 interrupt enable byte
/* feb9 */                   STA.abs ("ci2icr_dd0d");      // save VIA 2 ICR
/* febc */        _`_febc`;  PLA.imp ();                   // pull Y
/* febd */                   TAY.imp ();                   // restore Y
/* febe */                   PLA.imp ();                   // pull X
/* febf */                   TAX.imp ();                   // restore X
/* fec0 */        _`_fec0`;  PLA.imp ();                   // restore A
/* fec1 */        _`_fec1`;  RTI.imp ();

// ------------------------------------------------------- // baud rate word is calculated from ..

                                                           // (system clock / baud rate) / 2 - 100

                                                           //     system clock
                                                           //     ------------
                                                           // PAL        985248 Hz
                                                           // NTSC     1022727 Hz
                                                           // baud rate tables for NTSC C64
/* fec2 */                   _.bytes(0xc1, 0x27);          //   50   baud   1027700
/* fec4 */                   _.bytes(0x3e, 0x1a);          //   75   baud   1022700
/* fec6 */                   _.bytes(0xc5, 0x11);          //  110   baud   1022780
/* fec8 */                   _.bytes(0x74, 0x0e);          //  134.5 baud   1022200
/* feca */                   _.bytes(0xed, 0x0c);          //  150   baud   1022700
/* fecc */                   _.bytes(0x45, 0x06);          //  300   baud   1023000
/* fece */                   _.bytes(0xf0, 0x02);          //  600   baud   1022400
/* fed0 */                   _.bytes(0x46, 0x01);          // 1200   baud   1022400
/* fed2 */                   _.bytes(0xb8, 0x00);          // 1800   baud   1022400
/* fed4 */                   _.bytes(0x71, 0x00);          // 2400   baud   1022400

// ------------------------------------------------------- // ??
/* fed6 */        _`_fed6`;  LDA.abs ("ci2prb_dd01");      // read VIA 2 DRB, RS232 port
/* fed9 */                   AND.imm (0x01);               // mask 0000 000x, RS232 Rx DATA
/* fedb */                   STA.zpg ("inbit_00a7");       // save the RS232 received data bit
/* fedd */                   LDA.abs ("ti2blo_dd06");      // get VIA 2 timer B low byte
/* fee0 */                   SBC.imm (0x1c);
/* fee2 */                   ADC.abs ("baudof+0_0299");
/* fee5 */                   STA.abs ("ti2blo_dd06");      // save VIA 2 timer B low byte
/* fee8 */                   LDA.abs ("ti2bhi_dd07");      // get VIA 2 timer B high byte
/* feeb */                   ADC.abs ("baudof+1_029a");
/* feee */                   STA.abs ("ti2bhi_dd07");      // save VIA 2 timer B high byte
/* fef1 */                   LDA.imm (0x11);               // set timer B single shot, start timer B
/* fef3 */                   STA.abs ("ci2crb_dd0f");      // save VIA 2 CRB
/* fef6 */                   LDA.abs ("enabl_02a1");       // get the RS-232 interrupt enable byte
/* fef9 */                   STA.abs ("ci2icr_dd0d");      // save VIA 2 ICR
/* fefc */                   LDA.imm (0xff);
/* fefe */                   STA.abs ("ti2blo_dd06");      // save VIA 2 timer B low byte
/* ff01 */                   STA.abs ("ti2bhi_dd07");      // save VIA 2 timer B high byte
/* ff04 */                   JMP.abs ("_ef59");
/* ff07 */        _`_ff07`;  LDA.abs ("m51ajb+0_0295");    // nonstandard bit timing low byte
/* ff0a */                   STA.abs ("ti2blo_dd06");      // save VIA 2 timer B low byte
/* ff0d */                   LDA.abs ("m51ajb+1_0296");    // nonstandard bit timing high byte
/* ff10 */                   STA.abs ("ti2bhi_dd07");      // save VIA 2 timer B high byte
/* ff13 */                   LDA.imm (0x11);               // set timer B single shot, start timer B
/* ff15 */                   STA.abs ("ci2crb_dd0f");      // save VIA 2 CRB
/* ff18 */                   LDA.imm (0x12);
/* ff1a */                   EOR.abs ("enabl_02a1");       // EOR with the RS-232 interrupt enable byte
/* ff1d */                   STA.abs ("enabl_02a1");       // save the RS-232 interrupt enable byte
/* ff20 */                   LDA.imm (0xff);
/* ff22 */                   STA.abs ("ti2blo_dd06");      // save VIA 2 timer B low byte
/* ff25 */                   STA.abs ("ti2bhi_dd07");      // save VIA 2 timer B high byte
/* ff28 */                   LDX.abs ("bitnum_0298");
/* ff2b */                   STX.zpg ("bitci_00a8");
/* ff2d */                   RTS.imp ();

// ------------------------------------------------------- // ??
/* ff2e */        _`_ff2e`;  TAX.imp ();
/* ff2f */                   LDA.abs ("m51ajb+1_0296");    // nonstandard bit timing high byte
/* ff32 */                   ROL.acc ();
/* ff33 */                   TAY.imp ();
/* ff34 */                   TXA.imp ();
/* ff35 */                   ADC.imm (0xc8);
/* ff37 */                   STA.abs ("baudof+0_0299");
/* ff3a */                   TYA.imp ();
/* ff3b */                   ADC.imm (0x00);               // add any carry
/* ff3d */                   STA.abs ("baudof+1_029a");
/* ff40 */                   RTS.imp ();

// ------------------------------------------------------- // unused bytes
/* ff41 */                   NOP.imp ();                   // waste cycles
/* ff42 */                   NOP.imp ();                   // waste cycles

// ------------------------------------------------------- // save the status and do the IRQ routine
/* ff43 */        _`_ff43`;  PHP.imp ();                   // save the processor status
/* ff44 */                   PLA.imp ();                   // pull the processor status
/* ff45 */                   AND.imm (0xef);               // mask xxx0 xxxx, clear the break bit
/* ff47 */                   PHA.imp ();                   // save the modified processor status

// ------------------------------------------------------- // IRQ vector
/* ff48 */                   PHA.imp ();                   // save A
/* ff49 */                   TXA.imp ();                   // copy X
/* ff4a */                   PHA.imp ();                   // save X
/* ff4b */                   TYA.imp ();                   // copy Y
/* ff4c */                   PHA.imp ();                   // save Y
/* ff4d */                   TSX.imp ();                   // copy stack pointer
/* ff4e */                   LDA.abx ("bad+4_0104");       // get stacked status register
/* ff51 */                   AND.imm (0x10);               // mask BRK flag
/* ff53 */                   BEQ.rel ("_ff58");            // branch if not BRK
/* ff55 */                   JMP.ind ("cbinv+0_0316");     // else do BRK vector (iBRK)
/* ff58 */        _`_ff58`;  JMP.ind ("cinv+0_0314");      // do IRQ vector (iIRQ)

// ------------------------------------------------------- // initialise VIC and screen editor
/* ff5b */    _`cint_ff5b`;  JSR.abs ("cint1_e518");       // initialise the screen and keyboard
/* ff5e */        _`_ff5e`;  LDA.abs ("raster_d012");      // read the raster compare register
/* ff61 */                   BNE.rel ("_ff5e");            // loop if not raster line $00
/* ff63 */                   LDA.abs ("vicirq_d019");      // read the vic interrupt flag register
/* ff66 */                   AND.imm (0x01);               // mask the raster compare flag
/* ff68 */                   STA.abs ("tvsflg_02a6");      // save the PAL/NTSC flag
/* ff6b */                   JMP.abs ("_fddd");

// ------------------------------------------------------- // ??
/* ff6e */        _`_ff6e`;  LDA.imm (0x81);               // enable timer A interrupt
/* ff70 */                   STA.abs ("ciaicr_dc0d");      // save VIA 1 ICR
/* ff73 */                   LDA.abs ("ciacra_dc0e");      // read VIA 1 CRA
/* ff76 */                   AND.imm (0x80);               // mask x000 0000, TOD clock
/* ff78 */                   ORA.imm (0x11);               // mask xxx1 xxx1, load timer A, start timer A
/* ff7a */                   STA.abs ("ciacra_dc0e");      // save VIA 1 CRA
/* ff7d */                   JMP.abs ("_ee8e");            // set the serial clock out low and return

// ------------------------------------------------------- // unused
/* ff80 */                   _.bytes(0x03);

// ------------------------------------------------------- // initialise VIC and screen editor
/* ff81 */    _`cint_ff81`;  JMP.abs ("cint_ff5b");        // initialise VIC and screen editor

// ------------------------------------------------------- // initialise SID, CIA and IRQ, unused
/* ff84 */  _`ioinit_ff84`;  JMP.abs ("ioinit_fda3");      // initialise SID, CIA and IRQ

// ------------------------------------------------------- // RAM test and find RAM end
/* ff87 */  _`ramtas_ff87`;  JMP.abs ("ramtas_fd50");      // RAM test and find RAM end

// ------------------------------------------------------- // restore default I/O vectors
                                                           // this routine restores the default values of all system vectors used in KERNAL and
                                                           // BASIC routines and interrupts.
/* ff8a */  _`restor_ff8a`;  JMP.abs ("restor_fd15");      // restore default I/O vectors

// ------------------------------------------------------- // read/set vectored I/O
                                                           // this routine manages all system vector jump addresses stored in RAM. Calling this
                                                           // routine with the carry bit set will store the current contents of the RAM vectors
                                                           // in a list pointed to by the X and Y registers. When this routine is called with
                                                           // the carry bit clear, the user list pointed to by the X and Y registers is copied
                                                           // to the system RAM vectors.
                                                           // NOTE: This routine requires caution in its use. The best way to use it is to first
                                                           // read the entire vector contents into the user area, alter the desired vectors and
                                                           // then copy the contents back to the system vectors.
/* ff8d */  _`vector_ff8d`;  JMP.abs ("vector_fd1a");      // read/set vectored I/O

// ------------------------------------------------------- // control kernal messages
                                                           // this routine controls the printing of error and control messages by the KERNAL.
                                                           // Either print error messages or print control messages can be selected by setting
                                                           // the accumulator when the routine is called.
                                                           // FILE NOT FOUND is an example of an error message. PRESS PLAY ON CASSETTE is an
                                                           // example of a control message.
                                                           // bits 6 and 7 of this value determine where the message will come from. If bit 7
                                                           // is set one of the error messages from the KERNAL will be printed. If bit 6 is set
                                                           // a control message will be printed.
/* ff90 */  _`setmsg_ff90`;  JMP.abs ("setmsg_fe18");      // control kernal messages

// ------------------------------------------------------- // send secondary address after LISTEN
                                                           // this routine is used to send a secondary address to an I/O device after a call to
                                                           // the LISTEN routine is made and the device commanded to LISTEN. The routine cannot
                                                           // be used to send a secondary address after a call to the TALK routine.
                                                           // A secondary address is usually used to give set-up information to a device before
                                                           // I/O operations begin.
                                                           // When a secondary address is to be sent to a device on the serial bus the address
                                                           // must first be ORed with $60.
/* ff93 */  _`second_ff93`;  JMP.abs ("second_edb9");      // send secondary address after LISTEN

// ------------------------------------------------------- // send secondary address after TALK
                                                           // this routine transmits a secondary address on the serial bus for a TALK device.
                                                           // This routine must be called with a number between 4 and 31 in the accumulator.
                                                           // The routine will send this number as a secondary address command over the serial
                                                           // bus. This routine can only be called after a call to the TALK routine. It will
                                                           // not work after a LISTEN.
/* ff96 */    _`tksa_ff96`;  JMP.abs ("tksa_edc7");        // send secondary address after TALK

// ------------------------------------------------------- // read/set the top of memory
                                                           // this routine is used to read and set the top of RAM. When this routine is called
                                                           // with the carry bit set the pointer to the top of RAM will be loaded into XY. When
                                                           // this routine is called with the carry bit clear XY will be saved as the top of
                                                           // memory pointer changing the top of memory.
/* ff99 */  _`memtop_ff99`;  JMP.abs ("memtop_fe25");      // read/set the top of memory

// ------------------------------------------------------- // read/set the bottom of memory
                                                           // this routine is used to read and set the bottom of RAM. When this routine is
                                                           // called with the carry bit set the pointer to the bottom of RAM will be loaded
                                                           // into XY. When this routine is called with the carry bit clear XY will be saved as
                                                           // the bottom of memory pointer changing the bottom of memory.
/* ff9c */  _`membot_ff9c`;  JMP.abs ("membot_fe34");      // read/set the bottom of memory

// ------------------------------------------------------- // scan the keyboard
                                                           // this routine will scan the keyboard and check for pressed keys. It is the same
                                                           // routine called by the interrupt handler. If a key is down, its ASCII value is
                                                           // placed in the keyboard queue.
/* ff9f */  _`scnkey_ff9f`;  JMP.abs ("scnkey_ea87");      // scan keyboard

// ------------------------------------------------------- // set timeout on serial bus
                                                           // this routine sets the timeout flag for the serial bus. When the timeout flag is
                                                           // set, the computer will wait for a device on the serial port for 64 milliseconds.
                                                           // If the device does not respond to the computer's DAV signal within that time the
                                                           // computer will recognize an error condition and leave the handshake sequence. When
                                                           // this routine is called and the accumulator contains a 0 in bit 7, timeouts are
                                                           // enabled. A 1 in bit 7 will disable the timeouts.
                                                           // NOTE: The the timeout feature is used to communicate that a disk file is not found
                                                           // on an attempt to OPEN a file.
/* ffa2 */  _`settmo_ffa2`;  JMP.abs ("settmo_fe21");      // set timeout on serial bus

// ------------------------------------------------------- // input byte from serial bus

                                                           // this routine reads a byte of data from the serial bus using full handshaking. the
                                                           // data is returned in the accumulator. before using this routine the TALK routine,
                                                           // $FFB4, must have been called first to command the device on the serial bus to
                                                           // send data on the bus. if the input device needs a secondary command it must be sent
                                                           // by using the TKSA routine, $FF96, before calling this routine.

                                                           // errors are returned in the status word which can be read by calling the READST
                                                           // routine, $FFB7.
/* ffa5 */   _`acptr_ffa5`;  JMP.abs ("acptr_ee13");       // input byte from serial bus

// ------------------------------------------------------- // output a byte to serial bus
                                                           // this routine is used to send information to devices on the serial bus. A call to
                                                           // this routine will put a data byte onto the serial bus using full handshaking.
                                                           // Before this routine is called the LISTEN routine, $FFB1, must be used to
                                                           // command a device on the serial bus to get ready to receive data.
                                                           // the accumulator is loaded with a byte to output as data on the serial bus. A
                                                           // device must be listening or the status word will return a timeout. This routine
                                                           // always buffers one character. So when a call to the UNLISTEN routine, $FFAE,
                                                           // is made to end the data transmission, the buffered character is sent with EOI
                                                           // set. Then the UNLISTEN command is sent to the device.
/* ffa8 */   _`ciout_ffa8`;  JMP.abs ("ciout_eddd");       // output byte to serial bus

// ------------------------------------------------------- // command serial bus to UNTALK
                                                           // this routine will transmit an UNTALK command on the serial bus. All devices
                                                           // previously set to TALK will stop sending data when this command is received.
/* ffab */   _`untlk_ffab`;  JMP.abs ("untlk_edef");       // command serial bus to UNTALK

// ------------------------------------------------------- // command serial bus to UNLISTEN
                                                           // this routine commands all devices on the serial bus to stop receiving data from
                                                           // the computer. Calling this routine results in an UNLISTEN command being transmitted
                                                           // on the serial bus. Only devices previously commanded to listen will be affected.
                                                           // This routine is normally used after the computer is finished sending data to
                                                           // external devices. Sending the UNLISTEN will command the listening devices to get
                                                           // off the serial bus so it can be used for other purposes.
/* ffae */   _`unlsn_ffae`;  JMP.abs ("unlsn_edfe");       // command serial bus to UNLISTEN

// ------------------------------------------------------- // command devices on the serial bus to LISTEN
                                                           // this routine will command a device on the serial bus to receive data. The
                                                           // accumulator must be loaded with a device number between 4 and 31 before calling
                                                           // this routine. LISTEN convert this to a listen address then transmit this data as
                                                           // a command on the serial bus. The specified device will then go into listen mode
                                                           // and be ready to accept information.
/* ffb1 */  _`listen_ffb1`;  JMP.abs ("listen_ed0c");      // command devices on the serial bus to LISTEN

// ------------------------------------------------------- // command serial bus device to TALK
                                                           // to use this routine the accumulator must first be loaded with a device number
                                                           // between 4 and 30. When called this routine converts this device number to a talk
                                                           // address. Then this data is transmitted as a command on the Serial bus.
/* ffb4 */    _`talk_ffb4`;  JMP.abs ("talk_ed09");        // command serial bus device to TALK

// ------------------------------------------------------- // read I/O status word
                                                           // this routine returns the current status of the I/O device in the accumulator. The
                                                           // routine is usually called after new communication to an I/O device. The routine
                                                           // will give information about device status, or errors that have occurred during the
                                                           // I/O operation.
/* ffb7 */  _`readst_ffb7`;  JMP.abs ("readst_fe07");      // read I/O status word

// ------------------------------------------------------- // set logical, first and second addresses
                                                           // this routine will set the logical file number, device address, and secondary
                                                           // address, command number, for other KERNAL routines.
                                                           // the logical file number is used by the system as a key to the file table created
                                                           // by the OPEN file routine. Device addresses can range from 0 to 30. The following
                                                           // codes are used by the computer to stand for the following CBM devices:
                                                           // ADDRESS DEVICE
                                                           // ======= ======
                                                           //  0      Keyboard
                                                           //  1      Cassette #1
                                                           //  2      RS-232C device
                                                           //  3      CRT display
                                                           //  4      Serial bus printer
                                                           //  8      CBM Serial bus disk drive
                                                           // device numbers of four or greater automatically refer to devices on the serial
                                                           // bus.
                                                           // a command to the device is sent as a secondary address on the serial bus after
                                                           // the device number is sent during the serial attention handshaking sequence. If
                                                           // no secondary address is to be sent Y should be set to $FF.
/* ffba */  _`setlfs_ffba`;  JMP.abs ("setlfs_fe00");      // set logical, first and second addresses

// ------------------------------------------------------- // set the filename
                                                           // this routine is used to set up the file name for the OPEN, SAVE, or LOAD routines.
                                                           // The accumulator must be loaded with the length of the file and XY with the pointer
                                                           // to file name, X being th low byte. The address can be any valid memory address in
                                                           // the system where a string of characters for the file name is stored. If no file
                                                           // name desired the accumulator must be set to 0, representing a zero file length,
                                                           // in that case  XY may be set to any memory address.
/* ffbd */  _`setnam_ffbd`;  JMP.abs ("setnam_fdf9");      // set the filename

// ------------------------------------------------------- // open a logical file
                                                           // this routine is used to open a logical file. Once the logical file is set up it
                                                           // can be used for input/output operations. Most of the I/O KERNAL routines call on
                                                           // this routine to create the logical files to operate on. No arguments need to be
                                                           // set up to use this routine, but both the SETLFS, $FFBA, and SETNAM, $FFBD,
                                                           // KERNAL routines must be called before using this routine.
/* ffc0 */    _`open_ffc0`;  JMP.ind ("iopen+0_031a");     // do open a logical file

// ------------------------------------------------------- // close a specified logical file
                                                           // this routine is used to close a logical file after all I/O operations have been
                                                           // completed on that file. This routine is called after the accumulator is loaded
                                                           // with the logical file number to be closed, the same number used when the file was
                                                           // opened using the OPEN routine.
/* ffc3 */   _`close_ffc3`;  JMP.ind ("iclose+0_031c");    // do close a specified logical file

// ------------------------------------------------------- // open channel for input
                                                           // any logical file that has already been opened by the OPEN routine, $FFC0, can be
                                                           // defined as an input channel by this routine. the device on the channel must be an
                                                           // input device or an error will occur and the routine will abort.

                                                           // if you are getting data from anywhere other than the keyboard, this routine must be
                                                           // called before using either the CHRIN routine, $FFCF, or the GETIN routine,
                                                           // $FFE4. if you are getting data from the keyboard and no other input channels are
                                                           // open then the calls to this routine and to the OPEN routine, $FFC0, are not needed.

                                                           // when used with a device on the serial bus this routine will automatically send the
                                                           // listen address specified by the OPEN routine, $FFC0, and any secondary address.

                                                           // possible errors are:

                                                           // 3 : file not open
                                                           // 5 : device not present
                                                           // 6 : file is not an input file
/* ffc6 */   _`chkin_ffc6`;  JMP.ind ("ichkin+0_031e");    // do open channel for input

// ------------------------------------------------------- // open channel for output
                                                           // any logical file that has already been opened by the OPEN routine, $FFC0, can be
                                                           // defined as an output channel by this routine the device on the channel must be an
                                                           // output device or an error will occur and the routine will abort.

                                                           // if you are sending data to anywhere other than the screen this routine must be
                                                           // called before using the CHROUT routine, $FFD2. if you are sending data to the
                                                           // screen and no other output channels are open then the calls to this routine and to
                                                           // the OPEN routine, $FFC0, are not needed.

                                                           // when used with a device on the serial bus this routine will automatically send the
                                                           // listen address specified by the OPEN routine, $FFC0, and any secondary address.

                                                           // possible errors are:

                                                           // 3 : file not open
                                                           // 5 : device not present
                                                           // 7 : file is not an output file
/* ffc9 */  _`chkout_ffc9`;  JMP.ind ("ickout+0_0320");    // do open channel for output

// ------------------------------------------------------- // close input and output channels
                                                           // this routine is called to clear all open channels and restore the I/O channels to
                                                           // their original default values. It is usually called after opening other I/O
                                                           // channels and using them for input/output operations. The default input device is
                                                           // 0, the keyboard. The default output device is 3, the screen.
                                                           // If one of the channels to be closed is to the serial port, an UNTALK signal is sent
                                                           // first to clear the input channel or an UNLISTEN is sent to clear the output channel.
                                                           // By not calling this routine and leaving listener(s) active on the serial bus,
                                                           // several devices can receive the same data from the VIC at the same time. One way to
                                                           // take advantage of this would be to command the printer to TALK and the disk to
                                                           // LISTEN. This would allow direct printing of a disk file.
/* ffcc */  _`clrchn_ffcc`;  JMP.ind ("iclrch+0_0322");    // do close input and output channels

// ------------------------------------------------------- // input character from channel
                                                           // this routine will get a byte of data from the channel already set up as the input
                                                           // channel by the CHKIN routine, $FFC6.

                                                           // If CHKIN, $FFC6, has not been used to define another input channel the data is
                                                           // expected to be from the keyboard. the data byte is returned in the accumulator. the
                                                           // channel remains open after the call.

                                                           // input from the keyboard is handled in a special way. first, the cursor is turned on
                                                           // and it will blink until a carriage return is typed on the keyboard. all characters
                                                           // on the logical line, up to 80 characters, will be stored in the BASIC input buffer.
                                                           // then the characters can be returned one at a time by calling this routine once for
                                                           // each character. when the carriage return is returned the entire line has been
                                                           // processed. the next time this routine is called the whole process begins again.
/* ffcf */   _`chrin_ffcf`;  JMP.ind ("ibasin+0_0324");    // do input character from channel

// ------------------------------------------------------- // output character to channel
                                                           // this routine will output a character to an already opened channel. Use the OPEN
                                                           // routine, $FFC0, and the CHKOUT routine, $FFC9, to set up the output channel
                                                           // before calling this routine. If these calls are omitted, data will be sent to the
                                                           // default output device, device 3, the screen. The data byte to be output is loaded
                                                           // into the accumulator, and this routine is called. The data is then sent to the
                                                           // specified output device. The channel is left open after the call.
                                                           // NOTE: Care must be taken when using routine to send data to a serial device since
                                                           // data will be sent to all open output channels on the bus. Unless this is desired,
                                                           // all open output channels on the serial bus other than the actually intended
                                                           // destination channel must be closed by a call to the KERNAL close channel routine.
/* ffd2 */  _`chrout_ffd2`;  JMP.ind ("ibsout+0_0326");    // do output character to channel

// ------------------------------------------------------- // load RAM from a device
                                                           // this routine will load data bytes from any input device directly into the memory
                                                           // of the computer. It can also be used for a verify operation comparing data from a
                                                           // device with the data already in memory, leaving the data stored in RAM unchanged.
                                                           // The accumulator must be set to 0 for a load operation or 1 for a verify. If the
                                                           // input device was OPENed with a secondary address of 0 the header information from
                                                           // device will be ignored. In this case XY must contain the starting address for the
                                                           // load. If the device was addressed with a secondary address of 1 or 2 the data will
                                                           // load into memory starting at the location specified by the header. This routine
                                                           // returns the address of the highest RAM location which was loaded.
                                                           // Before this routine can be called, the SETLFS, $FFBA, and SETNAM, $FFBD,
                                                           // routines must be called.
/* ffd5 */    _`load_ffd5`;  JMP.abs ("load_f49e");        // load RAM from a device

// ------------------------------------------------------- // save RAM to a device
                                                           // this routine saves a section of memory. Memory is saved from an indirect address
                                                           // on page 0 specified by A, to the address stored in XY, to a logical file. The
                                                           // SETLFS, $FFBA, and SETNAM, $FFBD, routines must be used before calling this
                                                           // routine. However, a file name is not required to SAVE to device 1, the cassette.
                                                           // Any attempt to save to other devices without using a file name results in an error.
                                                           // NOTE: device 0, the keyboard, and device 3, the screen, cannot be SAVEd to. If
                                                           // the attempt is made, an error will occur, and the SAVE stopped.
/* ffd8 */    _`save_ffd8`;  JMP.abs ("save_f5dd");        // save RAM to device

// ------------------------------------------------------- // set the real time clock
                                                           // the system clock is maintained by an interrupt routine that updates the clock
                                                           // every 1/60th of a second. The clock is three bytes long which gives the capability
                                                           // to count from zero up to 5,184,000 jiffies - 24 hours plus one jiffy. At that point
                                                           // the clock resets to zero. Before calling this routine to set the clock the new time,
                                                           // in jiffies, should be in YXA, the accumulator containing the most significant byte.
/* ffdb */  _`settim_ffdb`;  JMP.abs ("settim_f6e4");      // set real time clock

// ------------------------------------------------------- // read the real time clock
                                                           // this routine returns the time, in jiffies, in AXY. The accumulator contains the
                                                           // most significant byte.
/* ffde */   _`rdtim_ffde`;  JMP.abs ("rdtim_f6dd");       // read real time clock

// ------------------------------------------------------- // scan the stop key
                                                           // if the STOP key on the keyboard is pressed when this routine is called the Z flag
                                                           // will be set. All other flags remain unchanged. If the STOP key is not pressed then
                                                           // the accumulator will contain a byte representing the last row of the keyboard scan.
                                                           // The user can also check for certain other keys this way.
/* ffe1 */    _`stop_ffe1`;  JMP.ind ("istop+0_0328");     // do scan stop key

// ------------------------------------------------------- // get character from input device
                                                           // in practice this routine operates identically to the CHRIN routine, $FFCF,
                                                           // for all devices except for the keyboard. If the keyboard is the current input
                                                           // device this routine will get one character from the keyboard buffer. It depends
                                                           // on the IRQ routine to read the keyboard and put characters into the buffer.
                                                           // If the keyboard buffer is empty the value returned in the accumulator will be zero.
/* ffe4 */   _`getin_ffe4`;  JMP.ind ("igetin+0_032a");    // do get character from input device

// ------------------------------------------------------- // close all channels and files
                                                           // this routine closes all open files. When this routine is called, the pointers into
                                                           // the open file table are reset, closing all files. Also the routine automatically
                                                           // resets the I/O channels.
/* ffe7 */   _`clall_ffe7`;  JMP.ind ("iclall+0_032c");    // do close all channels and files

// ------------------------------------------------------- // increment real time clock
                                                           // this routine updates the system clock. Normally this routine is called by the
                                                           // normal KERNAL interrupt routine every 1/60th of a second. If the user program
                                                           // processes its own interrupts this routine must be called to update the time. Also,
                                                           // the STOP key routine must be called if the stop key is to remain functional.
/* ffea */   _`udtim_ffea`;  JMP.abs ("udtim_f69b");       // increment real time clock

// ------------------------------------------------------- // return X,Y organization of screen
                                                           // this routine returns the x,y organisation of the screen in X,Y
/* ffed */  _`screen_ffed`;  JMP.abs ("screen_e505");      // return X,Y organization of screen

// ------------------------------------------------------- // read/set X,Y cursor position
                                                           // this routine, when called with the carry flag set, loads the current position of
                                                           // the cursor on the screen into the X and Y registers. X is the column number of
                                                           // the cursor location and Y is the row number of the cursor. A call with the carry
                                                           // bit clear moves the cursor to the position determined by the X and Y registers.
/* fff0 */    _`plot_fff0`;  JMP.abs ("plot_e50a");        // read/set X,Y cursor position

// ------------------------------------------------------- // return the base address of the I/O devices
                                                           // this routine will set XY to the address of the memory section where the memory
                                                           // mapped I/O devices are located. This address can then be used with an offset to
                                                           // access the memory mapped I/O devices in the computer.
/* fff3 */  _`iobase_fff3`;  JMP.abs ("iobase_e500");      // return the base address of the I/O devices

// ------------------------------------------------------- //
                                                           // RRBY
/* fff6 */                   _.bytes(0x52, 0x52, 0x42, 0x59);

// ------------------------------------------------------- // hardware vectors
/* fffa */                   _.bytes(0x43, 0xfe);          // NMI Vektor
/* fffc */                   _.bytes(0xe2, 0xfc);          // RESET Vektor
/* fffe */                   _.bytes(0x48, 0xff);          // IRQ Vektor
  }
);
