#include "mm.h"
#include <stdio.h>

int main() {
    init();
    unsigned char *p, *q, *r, *s, *t;
    
    printf("Test best, worst & first allocation strategy.\n");
    
    printf("Allocate p with 24 bytes.\n");
    p = my_malloc(24);
    printf("p = 0x%08x\n", p);
    
    printf("Allocate q with 24 bytes.\n");
    q = my_malloc(24);
    printf("q = 0x%08x\n", q);
    
    printf("Allocate r with 12 bytes.\n");
    r = my_malloc(12);
    printf("r = 0x%08x\n", r);
    
    printf("Allocate s with 24 bytes.\n");
    s = my_malloc(24);
    printf("s = 0x%08x\n", s);
    
    printf("Allocate t with 24 bytes.\n");
    t = my_malloc(24);
    printf("t = 0x%08x\n", t);
    
    printf("Free p, r & t.\n");
    my_free(p);
    my_free(r);
    my_free(t);
    
    printf("Reallocate p with 12 bytes using best_alloc().\n");
    p = best_alloc(12);
    printf("p = 0x%08x\n", p);
    printf("Free p.\n");
    my_free(p);
    
    printf("Reallocate p with 12 bytes using worst_alloc().\n");
    p = worst_alloc(12);
    printf("p = 0x%08x\n", p);
    printf("Free p.\n");
    my_free(p);
    
    printf("Reallocate p with 12 bytes using first_alloc().\n");
    p = first_alloc(12);
    printf("p = 0x%08x\n", p);
    printf("Free p.\n");
    my_free(p);
    
    return 0;
}