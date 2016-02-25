//out(port, val)
00000000  0000080e  LL    0x8 (D 8)         // a = *(local_addr); local_addr = sp + 8 = &port
00000004  00001026  LBL   0x10 (D 16)       // b = *(local_addr); local_addr = sp + 16 = &val
00000008  0000009a  BOUT                    // a = write(a, &b, 1), which is the syscall write
0000000c  00000002  LEV   0x0 (D 0)         // pc = *sp, sp += 8

// ivec(void *isr)
00000010  0000080e  LL    0x8 (D 8)         // a = *(local_addr); local_addr = sp + 8 = &isr
00000014  000000a4  IVEC                    // ivec = a, set interrupt vector by a
00000018  00000002  LEV   0x0 (D 0)         // pc = *sp, sp += 8

// stmr(int val)
0000001c  0000080e  LL    0x8 (D 8)         // a = *(local_addr); local_addr = sp + 8 = &val
00000020  000000a7  TIME                    // timeout = a
00000024  00000002  LEV   0x0 (D 0)         // pc = *sp, sp += 8

// halt(val)
00000028  0000080e  LL    0x8 (D 8)         // a = *(local_addr); local_addr = sp + 8 = &val
0000002c  00000000  HALT                    // halt system
00000030  00000002  LEV   0x0 (D 0)         // pc = *sp, sp += 8

// alltraps()
00000034  0000009d  PSHA                    // sp -= 8, *sp = a
00000038  000000a0  PSHB                    // sp -= 8, *sp = b
0000003c  00000015  LG    0x0 (D 0)         // a = *(global_addr); global_addr = pc + 0 = &current
00000040  ffffff57  SUBI  0xffffffff (D -1) // a -= 1
00000044  00000045  SG    0x0 (D 0)         // *(global_addr) = a ; global_addr = pc + 0 = &current
00000048  000000a1  POPB                    // b = *sp, sp += 8
0000004c  000000a3  POPA                    // a = *sp, sp += 8
00000050  00000098  RTI                     // return from interrupt, set pc, sp, may switch user/kernel mode; if has pending interrupt, process the interrupt
00000054  00000002  LEV   0x0 (D 0)         // pc = *sp, sp += 8

// main()
00000058  00000023  LI    0x0 (D 0)         // a = 0
0000005c  00000045  SG    0x0 (D 0)         // *(global_addr) = a ; global_addr = pc + 0 = &current
00000060  0003e89e  PSHI  0x3e8 (D 1000)    // sp -= 8, *sp = 1000
00000064  ffffb405  JSR   0xffffffb4 (TO 0x1c) // call stmr, *sp = pc, sp -= 8, pc += -0x4c = 0x18 = &stmr - 4
00000068  00000801  ENT   0x8 (D 8)         // sp += 8
0000006c  ffffc408  LEAG  0xffffffc4 (D -60)// a = pc - 60
00000070  0000009d  PSHA                    // sp -= 8, *sp = a
00000074  ffff9805  JSR   0xffffff98 (TO 0x10) // call ivec, *sp = pc, sp -= 8, pc += -0x68 = 0x0c = &ivec - 4
00000078  00000801  ENT   0x8 (D 8)         // sp += 8
0000007c  00000097  STI                     // iena = 1, set interrupt flag
00000080  00000003  JMP   <fwd>             // sp += <fwd>
00000084  00000015  LG    0x0 (D 0)         // a = *(global_addr); global_addr = pc + 0 = &current
00000088  00000169  ANDI  0x1 (D 1)         // a &= 1
0000008c  00000084  BZ    <fwd>             // sp = <fwd> if a == 0
00000090  0000319e  PSHI  0x31 (D 49)       // sp -= 8, *sp = 49 = '1'
00000094  0000019e  PSHI  0x1 (D 1)         // sp -= 8, *sp = 1
00000098  ffff6405  JSR   0xffffff64 (TO 0x0) // call out
0000009c  00001001  ENT   0x10 (D 16)       // sp += 16
000000a0  00000003  JMP   <fwd>             // sp += <fwd>
000000a4  0000309e  PSHI  0x30 (D 48)       // sp -= 8, sp = 48 = '0'
000000a8  0000019e  PSHI  0x1 (D 1)         // sp -= 8, sp = 1;
000000ac  ffff5005  JSR   0xffffff50 (TO 0x0) // call out
000000b0  00001001  ENT   0x10 (D 16)       // sp += 16
000000b4  00000015  LG    0x0 (D 0)         // a = *(global_addr); global_addr = pc + 0 = &current
000000b8  00000a3b  LBI   0xa (D 10)        // b = 10
000000bc  0000008c  BLT   <fwd>             // branch to 0 if a < b
000000c0  0000009e  PSHI  0x0 (D 0)         // sp -= 8, *sp = 0
000000c4  ffff6005  JSR   0xffffff60 (TO 0x28) // call halt
000000c8  00000801  ENT   0x8 (D 8)         // sp += 8
000000cc  00000002  LEV   0x0 (D 0)         // pc = *sp, sp += 8
