#include "mm.h"
#include <stdio.h>

int main() {
    printf("!");
    init();
    unsigned char *p = my_malloc(10), *q;
    printf("%0x08x\n", p);
    my_free(p);
    q = my_malloc(20);
    printf("%0x08x\n", q);
    my_free(q);
    return 0;
}