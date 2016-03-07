#ifndef MM_H
#define MM_H

int init();
int my_free(unsigned char *);
unsigned char *my_malloc(unsigned long);
unsigned char *best_alloc(unsigned long);
unsigned char *worst_malloc(unsigned long);
unsigned char *first_malloc(unsigned long);

#endif