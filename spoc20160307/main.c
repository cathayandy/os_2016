#include "mm.h"
#include <stdio.h>

int main() {
    init();
    unsigned char *p, *q, *r, *s, *t;
    
    printf("Test best, worst & first allocation strategy.\n");
    
    printf("Allocate p with 20 bytes.\n");
    p = my_malloc(20);
    printf("p = 0x%08x\n", p);
    
    printf("Allocate q with 20 bytes.\n");
    q = my_malloc(20);
    printf("q = 0x%08x\n", q);
    
    printf("Allocate r with 10 bytes.\n");
    r = my_malloc(10);
    printf("r = 0x%08x\n", r);
    
    printf("Allocate s with 20 bytes.\n");
    s = my_malloc(20);
    printf("s = 0x%08x\n", s);
    
    printf("Allocate t with 20 bytes.\n");
    t = my_malloc(20);
    printf("t = 0x%08x\n", t);
    
    printf("Free p, r & t.\n");
    my_free(p);
    my_free(r);
    my_free(t);
    
    printf("Reallocate p with 10 bytes using best_alloc().\n");
    p = best_alloc(10);
    printf("p = 0x%08x\n", p);
    printf("Free p.\n");
    my_free(p);
    
    printf("Reallocate p with 10 bytes using worst_alloc().\n");
    p = worst_alloc(10);
    printf("p = 0x%08x\n", p);
    printf("Free p.\n");
    my_free(p);
    
    printf("Reallocate p with 10 bytes using first_alloc().\n");
    p = first_alloc(10);
    printf("p = 0x%08x\n", p);
    printf("Free p.\n");
    my_free(p);
    
    return 0;
}