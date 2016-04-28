# Report

### Usage

	make test
	
### Result

	./monitor
	X, buf=1
	B 1 0 1, buf=1
	X, buf=1
	B 1 0 1, buf=1
	X, buf=1
	C 1 1 1, buf=0
	X, buf=2
	A 1 1 0, buf=2
	X, buf=2
	B 1 1 1, buf=0
	X, buf=3
	A 1 1 1, buf=0
	./semaphore
	A 1 1 0, buf=0
	X, buf=1
	B 1 0 1, buf=0
	C 1 1 1, buf=0
	A 1 1 0, buf=0
	X, buf=2
	B 1 1 1, buf=0
	A 1 1 0, buf=0
	X, buf=3
	A 1 1 1, buf=0