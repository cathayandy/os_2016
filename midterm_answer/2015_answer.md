# OS 2015 Midterm Answer
> cathayandy, wzm_andy@126.com

1. 一条`80386`指令: 长 8 字节, 从一个 32 位地址读取一个 32 位数据并装入寄存器. 指令和数据可不按 4 字节对齐, 那么这个过程最多可能引起几次中断?

	4 次. 假设该指令分别在两页, 并且前一条指令是一条跳转指令, 则在执行该指令时, 要访问这两页, 并且对这两页的访问均有可能引发缺页中断. 假设数据分别在两页, 则对这两页的访问也均有可能引发缺页中断.
	
2. `uCore`启动.

	1. 加电后第一条指令的物理地址: (1)`0xfffffff0`.
	
	2. 执行第一条`ljmp`后, `cs`为`0xf000`, `eip`为`0xe05b`, 则此时待执行指令物理地址为 (2)`0xfe05b`.
	
	3. 进入 32 位保护模式时, `cs`应设为 (3.1)`0x8`, `ds/es/fs/gs/ss`应设为 (3.2)`0x10`. 若`eip`为`0x7c6d`, 则实际被执行指令的物理地址为 (3.3)`0x87c6d`. `GDT`如下:
		    
		    SEG_NULLASM                                     # null seg
		    SEG_ASM(STA_X|STA_R, 0x0, 0xffffffff)           # code seg for bootloader and kernel
		    SEG_ASM(STA_W, 0x0, 0xffffffff)                 # data seg for bootloader and kernel
		    
		则当`bootloader`将其加载到内存时, 使用的逻辑地址是 (3.4) `0x0`, 对应的线性地址是(3.5) `0x0`, 对应的物理地址是(3.6) `0x0`.
		
	4. fd
	
	5. fd

3. 页面置换算法.

	1. 请描述`clock`和`FIFO`的工作原理.

		* `clock`置换算法需要维护 3 个关键数据: 内存中页面的访问标记, 内存中所有页面所组成的环形链表和一个指针. 每次访问一个内存中的页面时, 把相应页的访问标记置为`1`. 当缺页时, 检查指针所指页的访问标记, 若为`1`, 则置为`0`, 把指针指向链表中的下一页, 重复该操作; 若为`0`, 则替换该页, 并把指针指向链表中下一页.

		* `FIFO`置换算法需要维护一个队列. 当缺页时, 将队列头的页换出, 并把换入的页加入到队列尾.

	2. 给定如下访问序列: `a, b, c, d, a, b, e, a, b, c, d, e`, 计算`clock`和`FIFO`分配 3 个物理页帧和 4 个物理页帧时的缺页次数.

		* `clock`
			
			a | b | c | d | a | b | e | a | b | c | d | e 
			--- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ---
			a | a | a*| d | a | b | e | a | b | c | d | e
			\*| b | b | d | a | b | e | a | b | c | d | e
			  | \*| c | d | a | b | e | a | b | c | d | e
			  

4. 进程切换.

	1. `switch_to`函数的返回地址是放在哪个进程的堆栈中的?
		
		切换后的进程.
	2. 在`switch.S`中执行时, 切换前和切换后的进程的上下文的首地址在哪?
		
		分别存在刚刚进入`switch_to`函数时, `4(%esp)`和`8(%esp)`中. 因为执行了`popl 0(%eax)`, `%esp`自增了`4`, 所以实际在取切换后进程的上下文首地址时, 也用的是`4(%esp)`.

	3. 进程切换代码中, 完成页表切换的代码行是什么?
			
			lcr3(next->cr3);
			
	4. 进程切换代码中, 完成内核堆栈切换的代码行是什么?

			load_esp0(next->kstack + KSTACKSIZE);

5. 二级页表机制.

	1. 结合`x86-lite`, 描述二级页表机制的基本运行机理.

	2. 给定`vaddr`和`pdbr`, 请用`c`语言表达式表示:

		1. `vaddr`对应的`PDE`的`index`: `pde_index = (vaddr >> 9) & 0xf`.
		2. `vaddr`对应的`PTE`的`index`: `pte_index = (vaddr >> 5) & 0xf`.
		3. `vaddr`对应的`paddr`: `paddr = (*((*(pdbr + pde_index) & 0x7f) + pte_index) & 0x7f) + (vaddr & 0x1f)`.
		4. 对如下`vaddr`, 请给出: 是否有合法的物理内存, `PDE index`, `PDE contents`, `PTE index`, `PTE contents`, `paddr/saddr`, `contents of paddr/saddr`.

			* `0x137d`

					vaddr 0x137d:
					  --> pde index: 0x9, pde contents: (valid 0, pfn 0x7f)
					    --> Fault (page directory entry not valid)
			
			* `0x01bb`
			
					vaddr 0x01bb:
					  --> pde index: 0x0, pde contents: (valid 1, pfn 0xf9)
					    --> pte index: 0xd, pte contents: (valid , pfn )
					    
6. `fork`.

		Parent process: 21
		 Global variable: 
		 Stack variable: 19
		Child process:
		 Global variable: 22
		 Stack variable: 18
	