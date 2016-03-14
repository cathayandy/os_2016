var PDE_BASE = 0x0;
var PDE_ACT = 0x300;

Number.prototype.toHex = function () {
    var tmp = this.toString(16);
    return '00000000'.substring(0, 8 - tmp.length) + tmp;
};

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
    var pte_ctx = (pa & ~0xfff) | 0x3; // WRITABLE | VALID
    
    console.log('va 0x' + va.toHex() + ', pa 0x' + pa.toHex() + ', pde_idx 0x' + pde_index.toHex() + ', pde_ctx 0x' + pde_ctx.toHex() + ', pte_idx 0x' + pte_index.toHex() + ', pte_ctx 0x' + pte_ctx.toHex());
};

var printUsage = function () {
    console.log('Usage: node app.js');
    console.log('       node app.js file=filename');
    console.log('       node app.js va=vaddr pa=paddr');
};

var fs = require('fs');
if (process.argv.length < 3) {
    var file = 'input.txt';
} else if (process.argv.length == 3) {
    if (process.argv[2].match(/^file=/)) {
        var file = process.argv[2].replace(/^file=/, '');
    } else {
        printUsage();
    }
} else if (process.argv.length == 4) {
    if (process.argv[2].match(/^pa=/) && process.argv[3].match(/^va=/)) {
        var pa = process.argv[2].replace(/^pa=/, '');
        var va = process.argv[3].replace(/^va=/, '');
    } else if (process.argv[3].match(/^pa=/) && process.argv[2].match(/^va=/)) {
        var pa = process.argv[3].replace(/^pa=/, '');
        var va = process.argv[2].replace(/^va=/, '');
    } else {
        printUsage();
    }
} else {
    printUsage();
}
if (file) {
    fs.readFile(file,'utf-8', function (err, data) {
        if (err) {
            console.log('ERROR: ' + err + '\n');
            return;
        } else {
            data = data.replace(/va /g, '');
            data = data.replace(/ pa /g, '');
            var arr = data.split('\n')
            
            for (var i = 0; i < arr.length; i ++) {
                if (arr[i] === '') {
                    continue;
                } else if (arr[i].match(/^0x[0-9a-f]{8},0x[0-9a-f]{8}$/)) {
                    var item = arr[i].split(',');
                    search(item[0], item[1]);
                } else {
                    console.log('Line ' + i + ': Illegal line format. Line has to match /^va 0x[0-9a-f]{8}, pa 0x[0-9a-f]{8}$/');
                }
            }
        }
    });
} else if (va && pa) {
    search(va, pa);
}