//out(port, val)
00000000  0000080e  LL    0x8 (D 8)         // a = *(local_addr); local_addr = sp + 8 = &port
00000004  00001026  LBL   0x10 (D 16)       // b = *(local_addr); local_addr = sp + 16 = &val
00000008  0000009a  BOUT                    // a = write(a, &b, 1), which is the syscall write
0000000c  00000002  LEV   0x0 (D 0)         // pc = *sp, sp += 8

//int write(int f, char *s, int n)
00000010  fffff801  ENT   0xfffffff8 (D -8) // sp -= 8
00000014  00000123  LI    0x1 (D 1)         // a = 1
00000018  00000045  SG    0x0 (D 0)         // *(global_addr) = a; global_addr = pc + 0 = &ret !operand to be filled
0000001c  0000200e  LL    0x20 (D 32)       // a = *(local_addr); local_addr = sp + 32 = &n
00000020  00000440  SL    0x4 (D 4)         // *(local_addr) = a; local_addr = sp + 4 = &i
00000024  00000003  JMP   <fwd>             // pc += <fwd>;
00000028  0000180e  LL    0x18 (D 24)       // a = *(local_addr); local_addr = sp + 24 = &s
0000002c  ffffff57  SUBI  0xffffffff (D -1) // a += 1
00000030  00001840  SL    0x18 (D 24)       // *(local_addr) = a; local_addr = sp + 24 = &s
00000034  ffffff1f  LXC   0xffffffff (D -1) // a = *(virt_addr); virt_addr = a-1 = s !em.c line 448
00000038  0000009d  PSHA                    // sp -= 8, *sp = a
0000003c  0000180e  LL    0x18 (D 24)       // a = *(local_addr); local_addr = sp + 24 = &f !because sp -= 8 before
00000040  0000009d  PSHA                    // sp -= 8, *sp = a
00000044  ffffb805  JSR   0xffffffb8 (TO 0x0) // call out, sp -= 8, *sp = pc, pc += -48 = -4 = &out - 4
00000048  00001001  ENT   0x10 (D 16)       // sp += 16
0000004c  0000040e  LL    0x4 (D 4)         // a = *(local_addr); local_addr = sp + 4 = &i
00000050  00000157  SUBI  0x1 (D 1)         // a -= 1
00000054  00000440  SL    0x4 (D 4)         // *(local_addr) = a; local_addr = sp + 4 = &i
00000058  00000154  ADDI  0x1 (D 1)         // a += 1
0000005c  00000086  BNZ   <fwd>             // sp = <fwd> if a != 0
00000060  0000040e  LL    0x4 (D 4)         // a = *(local_addr); local_addr = sp + 4 = &i
00000064  00000802  LEV   0x8 (D 8)         // pc = *(sp + 8), sp += 16
//main()
00000068  00000802  LEV   0x8 (D 8)         // pc = *(sp + 8), sp += 16, !maybe NOP
0000006c  00000c9e  PSHI  0xc (D 22)        // sp -= 8, *sp = 22
00000070  00000008  LEAG  0x0 (D 0)         // a = pc + 0 = &"2012011355 2012011379" !operand to be filled
00000074  0000009d  PSHA                    // sp -= 8, *sp = a
00000078  0000019e  PSHI  0x1 (D 1)         // sp -= 8, *sp = 1
0000007c  ffff9005  JSR   0xffffff90 (TO 0x10) // call write, sp -= 8, *sp = pc, pc += -0x70 = 0xc = &write - 4
00000080  00001801  ENT   0x18 (D 24)       // sp += 24
00000084  00000045  SG    0x0 (D 0)         // *(global_addr) = a; global_addr = pc + 0 = &ret !operand to be filled
00000088  00000000  HALT                    // halt system
0000008c  00000002  LEV   0x0 (D 0)         // pc = *sp, sp += 8