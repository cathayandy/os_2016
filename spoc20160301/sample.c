#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

int main() {
    int pid = 0;
    if (!!(pid = fork())) {
        printf("I am parent\n");
        exit(0);
    }

    asm volatile ("lgdt (%0)" :: "r" (0));
    printf("I am a child\n");
    return 0;
}