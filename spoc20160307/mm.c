#include "mm.h"
#define MEMSIZE 10000
#define HEADER_SIZE 8
#define SIZE_SIZE 4
#define UMAX 0x7fffffff
#define UMIN 0x0
static unsigned char mem[MEMSIZE]; // stimulation of memory
typedef unsigned long SIZE_T;

#include <stdio.h>

union Header {
    struct Info {
        SIZE_T size;
        union Header *next_pos;
    } info;
    unsigned char align[HEADER_SIZE];
};

typedef union Header Header;

Header *tail = NULL;

int init() {
    Header *base = (Header *)mem;
    (base->info).next_pos = tail;
    (base->info).size = MEMSIZE - HEADER_SIZE;
    printf("!");
    return 0;
}

unsigned char *_alloc(Header *target, Header *pre, SIZE_T size) {
    if (target == tail)
        return (unsigned char *)tail;
    if ((target->info).size < HEADER_SIZE + size) {
        (target->info).size = HEADER_SIZE + size;
        return ((unsigned char *)target + HEADER_SIZE);
    }
    Header* next = (Header *)((unsigned char *)target + HEADER_SIZE + size);
    (next->info).next_pos = (target->info).next_pos;
    (next->info).size = ((target->info).size - HEADER_SIZE - size);
    (pre->info).next_pos = next;
    (target->info).size = size;
    return ((unsigned char *)target + HEADER_SIZE);
}

unsigned char *best_alloc(unsigned long size) {
    Header *base = (Header *)mem, *tmp = base, *target = tail, *pre_tmp = tail, *pre_target = tail;
    SIZE_T min_size = UMAX;
    for (; tmp != tail; pre_tmp = tmp, tmp = (tmp->info).next_pos) {
        if ((tmp->info).size >= size &&
            (tmp->info).size < min_size) {
            target = tmp;
            pre_target = pre_tmp;
            min_size = (tmp->info).size;
        }
    }
    return _alloc(target, pre_target, size);
}

unsigned char *worst_alloc(unsigned long size) {
    Header *base = (Header *)mem, *tmp = base, *target = tail, *pre_tmp = tail, *pre_target = tail;
    SIZE_T max_size = UMIN;
    for (; tmp != tail; pre_tmp = tmp, tmp = (tmp->info).next_pos) {
        if ((tmp->info).size >= size &&
            (tmp->info).size > max_size) {
            target = tmp;
            pre_target = pre_tmp;
            max_size = (tmp->info).size;
        }
    }
    return _alloc(target, pre_target, size);
}

unsigned char *first_alloc(unsigned long size) {
    Header *base = (Header *)mem, *tmp = base, *target = tail, *pre_tmp = tail, *pre_target = tail;
    for (; tmp != tail; pre_tmp = tmp, tmp = (tmp->info).next_pos) {
        if ((tmp->info).size >= size) {
            target = tmp;
            pre_target = pre_tmp;
            break;
        }
    }
    return _alloc(target, pre_target, size);
}

unsigned char *my_malloc(unsigned long size) {
    return best_alloc(size);
}

int merge_block(Header *target) {
    Header *base = (Header *)mem, *next = (target->info).next_pos;
    if ((unsigned char *)target + HEADER_SIZE + (target->info).size == (unsigned char *)next) {
        (target->info).size += (next->info).size + HEADER_SIZE;
        (target->info).next_pos = (next->info).next_pos;
    }
    return 0;
}

int my_free(unsigned char *p) {
    Header *base = (Header *)mem, *target = (Header *)(p - HEADER_SIZE), *tmp = base, *pre = tail;
    for (; tmp != tail ; pre = tmp, tmp = (tmp->info).next_pos) {
        if (tmp > target && pre < target) {
            (pre->info).next_pos = target;
            (target->info).next_pos = tmp;
            break;
        }
    }
    merge_block(target);
    merge_block(pre);
    return 0;
}