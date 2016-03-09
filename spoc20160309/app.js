var PDE_BASE = 0x220;
var search = function (input, arr) {
    
    if (!input.match(/^[0-9a-f]{4}$/)) {
        console.log('Illegal addr format. Addr has to match /^[0-9a-f]{4}$/. (e.g. 89ab)');
        return;
    }
    
    var num = parseInt(input, 16);
    var pde_index = num >> 10;
    var pte_index = (num >> 5) & 0x1f;
    var frame_index = num & 0x1f;
    
    var pde_v = parseInt(arr[PDE_BASE + pde_index], 16);
    var pte_base = pde_v & 0x7f;
    var pte_valid = (pde_v & 0x80) >> 7;
    
    console.log('Virtual Address ' + input + ':');
    console.log('  --> pde index:0x' + pde_index.toString(16)+ '  pde contents:(valid ' + pte_valid + ', pfn 0x' + pte_base.toString(16) + ')');

    if (!pte_valid) {
        console.log('    --> Fault (page directory entry not valid)');
    } else {
        var pte_v = parseInt(arr[(pte_base << 5) + pte_index], 16);
        var frame_base = pte_v & 0x7f;
        var frame_valid = (pte_v & 0x80) >> 7;
        
        console.log('    --> pte index:0x' + pte_index.toString(16) + '  pte contents:(valid ' + frame_valid + ', pfn 0x' + frame_base.toString(16) + ')');
                
        if (!frame_valid) {
            console.log('      --> Fault (page table entry not valid)');
        } else {
            var phys_addr = (frame_base << 5) + frame_index;
            var ret = arr[phys_addr];
            
            console.log('      --> Translates to Physical Address 0x' + phys_addr.toString(16) + ' --> Value: ' + ret);
            return ret;
        }
    }
}

var fs = require('fs');
fs.readFile('phys.txt','utf-8', function (err, data){
    if (err) {
        console.log('ERROR: ' + err + '\n');
        return;
    } else {
        data = data.replace(/page \w\w: /g, '');
        data = data.replace(/\n/g, '');
        var mem = data.split(' ');
        
        if (process.argv.length < 3) {
            console.log('Usage: node app.js addr [addr2 ...]');
            return;
        }
            
       	for (i = 2; i < process.argv.length; i ++) {
            search (process.argv[i], mem);
        }
    }
});