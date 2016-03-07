main: main.o mm.o
	gcc main.o mm.o -o main
mm.o: mm.c mm.h
	gcc -c mm.c -o mm.o
main.o: main.c mm.h
	gcc -c main.c -o main.o