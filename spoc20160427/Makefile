all: monitor semaphore

.PHONY: all test
monitor: finda-monitor.cc
	g++ finda-monitor.cc -o monitor -std=c++11
    
semaphore: finda-semaphore.cc
	g++ finda-semaphore.cc -o semaphore -std=c++11
    
test: monitor semaphore
	make
	./monitor
	./semaphore