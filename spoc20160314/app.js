var PDE_BASE = 0x0;
var PDE_ACT = 0x300;

var search = function (va, pa) {
    
    if (!va.match(/^0x[0-9a-f]{8}$/)) {
        console.log('Illegal virtual addr format. Addr has to match /^0x[0-9a-f]{8}$/. (e.g. 0xc2265b1f)');
        return;
    }
    
    if (!pa.match(/^0x[0-9a-f]{8}$/)) {
        console.log('Illegal physical addr format. Addr has to match /^0x[0-9a-f]{8}$/. (e.g. 0xc2265b1f)');
        return;
    }
    
    va = parseInt(va);
    pa = parseInt(pa);
    var pde_index = (va >> 22) & 0x3ff;
    var pte_index = (va >> 10) & 0x3ff;
    
    var pde_ctx = ((pde_index - PDE_ACT + 1) << 12) | 0x3; // WRITABLE | VALID
    var pte_ctx = ((pa >> 12) << 12) | 0x3; // WRITABLE | VALID
    
    console.log('va 0x' + va.toString(16) + ', pa 0x' + pa.toString(16) + ', pde_idx 0x' + pde_index.toString(16) + ', pde_ctx  0x' + pde_ctx.toString(16) + ', pte_idx 0x' + pte_index.toString(16) + ', pte_ctx  0x' + pte_ctx.toString(16));
}

var fs = require('fs');
if (process.argv.length < 3) {
    console.log('Usage: node app.js');
    var file = 'input.txt';
}
if (file) {
    fs.readFile(file,'utf-8', function (err, data) {
        if (err) {
            console.log('ERROR: ' + err + '\n');
            return;
        } else {
            data = data.replace(/va /g, '');
            data = data.replace(/ pa /g, '');
            var arr = data.split('\n');
            
            for (var i = 0; i < arr.length; i ++) {
                var item = arr[i].split(',');
                var va = item[0];
                var pa = item[1];
                search(va, pa);
            }
        }
    });
}