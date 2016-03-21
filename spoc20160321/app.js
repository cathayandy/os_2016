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
};

run();






