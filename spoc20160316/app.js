var PDE_BASE = 0xd80;

var trans2 = function (frame_base, frame_index, mem, name) {
    var phys_addr = (frame_base << 5) + frame_index;
    var ret = mem[phys_addr];
    
    console.log('      --> Translates to ' + name + ' Address 0x' + phys_addr.toString(16) + ' --> Value: ' + ret);
    return ret;
}

var translation = function (pte_base, pte_index, frame_index, mem, name) {
    var pte_v = parseInt(mem[(pte_base << 5) + pte_index], 16);
    var frame_base = pte_v & 0x7f;
    var frame_valid = (pte_v & 0x80) >> 7;
    
    console.log('    --> pte index: ' + name + ' 0x' + pte_index.toString(16) + '  pte contents:(valid ' + frame_valid + ', pfn 0x' + frame_base.toString(16) + ')');
            
    if (!frame_valid) {
        if (frame_base === 0x7f) {
            console.log('      --> Fault (page table entry not valid)');
        } else {
            trans2(frame_base, frame_index, disk, 'Disk');
        }
    } else {
        trans2(frame_base, frame_index, mem, 'Physical');
    }
};

var search = function (input, mem, disk) {
    
    if (!input.match(/^[0-9a-f]{4}$/)) {
        console.log('Illegal addr format. Addr has to match /^[0-9a-f]{4}$/. (e.g. 89ab)');
        return;
    }
    
    var num = parseInt(input, 16);
    var pde_index = num >> 10;
    var pte_index = (num >> 5) & 0x1f;
    var frame_index = num & 0x1f;
    
    var pde_v = parseInt(mem[PDE_BASE + pde_index], 16);
    var pte_base = pde_v & 0x7f;
    var pte_valid = (pde_v & 0x80) >> 7;
    
    console.log('Virtual Address ' + input + ':');
    console.log('  --> pde index:0x' + pde_index.toString(16)+ '  pde contents:(valid ' + pte_valid + ', pfn 0x' + pte_base.toString(16) + ')');

    if (!pte_valid) {
        if (pte_base === 0x7f)
            console.log('    --> Fault (page directory entry not valid)');
        else {
            translation(pte_base, pte_index, frame_index, disk, 'Disk');
        }
    } else {
        translation(pte_base, pte_index, frame_index, mem, 'Physical');
    }
}

var mem = [], disk = [];

var run = function() {
    if (process.argv.length < 3) {
        console.log('Usage: node app.js addr [addr2 ...]');
        return;
    }
        
    for (var i = 2; i < process.argv.length; i ++) {
        search (process.argv[i], mem, disk);
    }
};

var fs = require('fs');
fs.readFile('memory.txt', 'utf-8', function (err, data) {
    if (err) {
        console.log('ERROR: ' + err + '\n');
        return;
    } else {
        data = data.replace(/page \w\w: /g, '');
        data = data.replace(/\n/g, '');
        mem = data.split(' ');
        
        fs.readFile('disk.txt', 'utf-8', function (err, data) {
            if (err) {
                console.log('ERROR: ' + err + '\n');
                return;
            } else {
                data = data.replace(/disk \w\w: /g, '');
                data = data.replace(/\n/g, '');
                disk = data.split(' ');
                
                run();
            }
        });
    }
});