# README

## Requirements

* [Node.js](http://nodejs.org)

## How to run

* Run answer
    
        ./run.sh
        
* Run other pages

        node app.js page [page2 ...]

## Result

Fault rate:
Page4: Hit 0, miss 1
Page3: Hit 0, miss 2
Page0: Hit 0, miss 3
Page2: Hit 0, miss 4
Page2: Hit 1, miss 4
Page3: Hit 2, miss 4
Page1: Hit 2, miss 5
Page2: Hit 3, miss 5
Page4: Hit 3, miss 6
Page2: Hit 4, miss 6
Page4: Hit 5, miss 6
Page0: Hit 5, miss 7
Page3: Hit 5, miss 8
Work set:
Page4: Hit 0, miss 1
Page3: Hit 0, miss 2
Page0: Hit 0, miss 3
Page2: Hit 0, miss 4
Page2: Hit 1, miss 4
Page3: Hit 1, miss 5
Page1: Hit 1, miss 6
Page2: Hit 2, miss 6
Page4: Hit 2, miss 7
Page2: Hit 3, miss 7
Page4: Hit 4, miss 7
Page0: Hit 4, miss 8
Page3: Hit 4, miss 9
Improved clock:
Page4 write: Hit 0, miss 1
Page3 read: Hit 0, miss 2
Page0 write: Hit 0, miss 3
Page2 write: Hit 0, miss 4
Page2 read: Hit 1, miss 4
Page3 read: Hit 2, miss 4
Page1 write: Hit 2, miss 5
Page2 read: Hit 3, miss 5
Page4 write: Hit 4, miss 5
Page2 read: Hit 5, miss 5
Page4 write: Hit 6, miss 5
Page0 read: Hit 7, miss 5
Page3 read: Hit 8, miss 5