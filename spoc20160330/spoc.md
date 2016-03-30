* 在什么地方设置的定时器?
	
		// do_sleep - set current process state to sleep and add timer with "time"
	    //          - then call scheduler. if process run again, delete timer first.
	    int
	    do_sleep(unsigned int time) {
	        if (time == 0) {
	            return 0;
	        }
	        bool intr_flag;
	        local_intr_save(intr_flag);
	        timer_t __timer, *timer = timer_init(&__timer, current, time);
	        current->state = PROC_SLEEPING;
	        current->wait_state = WT_TIMER;
	        add_timer(timer);
	        local_intr_restore(intr_flag);
	
	        schedule();
	
	        del_timer(timer);
	        return 0;
	    }
	
	
	* `timer_t __timer, *timer = timer_init(&__timer, current, time);` 这句话是初始化`timer`
	* `add_timer(timer);`是设置定时器.
	
* 它对应的等待队列是哪个?

	`timer_list`

* 它的唤醒操作在什么地方?
	
	
		void
		run_timer_list(void) {
		    bool intr_flag;
		    local_intr_save(intr_flag);
		    {
		        list_entry_t *le = list_next(&timer_list);
		        if (le != &timer_list) {
		            timer_t *timer = le2timer(le, timer_link);
		            assert(timer->expires != 0);
		            timer->expires --;
		            while (timer->expires == 0) {
		                le = list_next(le);
		                struct proc_struct *proc = timer->proc;
		                if (proc->wait_state != 0) {
		                    assert(proc->wait_state & WT_INTERRUPTED);
		                }
		                else {
		                    warn("process %d's wait_state == 0.\n", proc->pid);
		                }
		                wakeup_proc(proc);
		                del_timer(timer);
		                if (le == &timer_list) {
		                    break;
		                }
		                timer = le2timer(le, timer_link);
		            }
		        }
		        sched_class_proc_tick(current);
		    }
		    local_intr_restore(intr_flag);
		}
		
	这个操作遍历`timer_list`, `timer->expires`记录当前`timer`是否到期, 若到期, 执行
	
		wakeup_proc(proc);
		del_timer(timer);
		
	唤醒`timer`对应的进程, `wakeup_proc`是将相应进程加入可运行的队列中.