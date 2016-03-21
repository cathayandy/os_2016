// fault rate
var fault_rate = {
    list: {},
    last_t: 0,
    T: 2,
    time: 0,
    hit: 0,
    miss: 0,
    run: function (page_id) {
        if (!this.list[page_id]) {
            if (this.time - this.last_t <= this.T) {
                this.list[page_id] = this.time;
            } else {
                for (var i in this.list) {
                    if (this.list[i] < this.last_t)
                        this.list[i] = null;
                }
            }
            this.last_t = this.time;
            this.miss += 1;
        } else {
            this.list[page_id] = this.time;
            this.hit += 1;
        }
        console.log('Page' + page_id + ': Hit ' + this.hit + ', miss ' + this.miss);
        this.time += 1;
    }
};

// work_set
var work_set = {
    list: [],
    T: 4,
    flag: 0,
    time: 0,
    hit: 0,
    miss: 0,
    run: function (page_id) {
        this.list[this.flag] = -1;
        var find = false;
        this.list.forEach(function (e) {
            if (e === page_id)
                find = true;
        });
        if (find === false) {
            this.miss += 1;
        } else {
            this.hit += 1;
        }
        this.list[this.flag] = page_id;
        this.flag ++;
        if (this.flag === this.T) {
            this.flag = 0;
        }
        console.log('Page' + page_id + ': Hit ' + this.hit + ', miss ' + this.miss);
        this.time += 1;
    }
};

// improved_clock
var improved_clock = {
    list: [],
    page: [],
    N: 4,
    flag: 0,
    hit: 0,
    miss: 0,
    run: function (page_id, type) {
        if (!type) {
            var alphabet = ['read', 'write'];
            type = alphabet[Math.floor(Math.random() + 0.5)];
        }
        if (this.page[page_id]) {
            this.page[page_id].v = 1;
            this.hit += 1;
            if (type === 'write')
                this.page[page_id].w = 1;
        } else {
            this.page[page_id] = 1;
            this.miss += 1;
            if (this.list.length > 4) {
                for (; this.flag += 1; this.flag ++) {
                    if (this.page[this.list[this.flag]].v === 0) {
                        this.page[this.list[this.flag]] = null;
                        this.list[this.flag] = page_id;
                    } else {
                        if (this.page[this.list[this.flag]].w === 1)
                            this.page[this.list[this.flag]].w = 0;
                        else if (this.page[this.list[this.flag]].v === 1)
                            this.page[this.list[this.flag]].v = 1;
                    }
                }
            } else {
                this.list[this.flag] = page_id;
                this.flag += 1;
                if (this.flag >= this.N)
                    this.flag = 0;
            }
        }
        console.log('Page' + page_id + ' ' + type + ': Hit ' + this.hit + ', miss ' + this.miss);
    }
};

/*var least_recent_used = {
    page: [],
    N: 4,
    head: {},
    hit: 0,
    miss: 0,
    run: function (page_id) {
        if (this.page[page_id] && this.page[page_id].e === true) {
            this.hit += 1;
            this.page[page_id].p.n = this.page[page_id].n;
            this.page[page_id].n.p = this.page[page_id].p;
            this.page[page_id].p = this.head;
            this.page[page_id].n = this.head.n;
            this.head.n.p = this.page[page_id];
            this.head.n = this.page[page_id];
        } else {
            this.head.p.e = false;
            this.head.p = this.head.p.p;
            this.head.p.n = this.head;
            this.page[page_id] = {
                e: true,
                p: this.head,
                n: this.head.n
            };
            this.head.n.p = this.page[page_id];
            this.head.n = this.page[page_id];
            this.miss += 1;
        }
        console.log('Page' + page_id + ': Hit ' + this.hit + ', miss ' + this.miss);
    }
};
least_recent_used.head.n = least_recent_used.head;
least_recent_used.head.p = least_recent_used.head;
least_recent_used.head.e = false;*/
    
var run = function() {
    if (process.argv.length < 3) {
        console.log('Usage: node app.js page [page2 ...]');
        return;
    }
    
    console.log("Fault rate:");
    for (var i = 2; i < process.argv.length; i ++) {
        fault_rate.run(process.argv[i]);
    }
    
    console.log("Work set:");
    for (var i = 2; i < process.argv.length; i ++) {
        work_set.run(process.argv[i]);
    }
    
    console.log("Improved clock:");
    for (var i = 2; i < process.argv.length; i ++) {
        improved_clock.run(process.argv[i]);
    }
    
    /*console.log("Least recent used:");
    for (var i = 2; i < process.argv.length; i ++) {
        least_recent_used.run(process.argv[i]);
    }*/
};

run();






