# README

## Requirements

* [Node.js](http://nodejs.org)

## How to run

* Run answer
    
        ./run.sh
        
* Run other addrs

        node app.js addr [addr2 ...]

## Result

    Virtual Address 6653:
    --> pde index:0x19  pde contents:(valid 0, pfn 0x7f)
        --> Fault (page directory entry not valid)
    Virtual Address 1c13:
    --> pde index:0x7  pde contents:(valid 1, pfn 0x3d)
        --> pte index: Physical 0x0  pte contents:(valid 1, pfn 0x76)
        --> Translates to Physical Address 0xed3 --> Value: 12
    Virtual Address 6890:
    --> pde index:0x1a  pde contents:(valid 0, pfn 0x7f)
        --> Fault (page directory entry not valid)
    Virtual Address 0af6:
    --> pde index:0x2  pde contents:(valid 1, pfn 0x21)
        --> pte index: Physical 0x17  pte contents:(valid 0, pfn 0x7f)
        --> Fault (page table entry not valid)
    Virtual Address 1e6f:
    --> pde index:0x7  pde contents:(valid 1, pfn 0x3d)
        --> pte index: Physical 0x13  pte contents:(valid 0, pfn 0x16)
        --> Translates to Disk Address 0x2cf --> Value: 1c