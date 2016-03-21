var addr_list = {};
var time = 0, last_t = 0, T = 2;
var hit = 0, miss = 0;

var fault_rate = function (page_id) {
    if (!addr_list[page_id]) {
        if (time - last_t <= T) {
            addr_list[page_id] = time;
        } else {
            for (var i in addr_list) {
                if (addr_list[i] < last_t)
                    addr_list[i] = null;
            }
        }
        last_t = time;
        miss += 1;
    } else {
        addr_list[page_id] = time;
        hit += 1;
    }
    console.log('Page' + page_id + ': Hit ' + hit + ', miss ' + miss);
    time += 1;
}
    
var run = function() {
    if (process.argv.length < 3) {
        console.log('Usage: node app.js page [page2 ...]');
        return;
    }
    
    var query = fault_rate;
        
    for (var i = 2; i < process.argv.length; i ++) {
        query (process.argv[i]);
    }
};

run();






