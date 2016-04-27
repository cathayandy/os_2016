#include <thread>
#include <semaphore.h>
#include <cstdio>
#include <cstring>

const int EMPTY = 0;
const int WATER = 1;
const int SUGAR = 2;
const int ORANGE = 3;

int buf = EMPTY;

class Semaphore {
  public:
    Semaphore(unsigned int sem=0, const char* name="default") {
        this->sem = sem_open(name, O_CREAT, 0, 0);
        sem_init(this->sem, 0, sem);
    }
    ~Semaphore() {
        sem_close(this->sem);
        sem_destroy(this->sem);
    }
    void P() {
        sem_wait(this->sem);
    }
    void V() {
        sem_post(this->sem);
    }
  private:
    sem_t* sem;
};

Semaphore *empty, *full, *mutex;

class Producer {
  public:
    Producer(const char* name="default", int cur=1, int turn=20) {
        strcpy(this->name, name);
        this->cur = cur;
        this->turn = turn;
    }
    void putBuf() {
        empty->P();
        mutex->P();
    
        if (buf == EMPTY) {
            buf = cur;
            cur ++;
            if (cur == 4)
                cur = 1;
        }
    
        mutex->V();
        full->V(); 
    }
    void run() {
        while(turn --) {
            this->putBuf();
            printf("%s, buf=%d\n", name, buf);
        }
    }
  private:
    char name[10];
    int cur, turn;
};

class Consumer {
  public:
    Consumer(const char* name="default", bool water=false, bool sugar=false, bool orange=false) {
        strcpy(this->name, name);
        this->water = water;
        this->sugar = sugar;
        this->orange = orange;
    }
    void getBuf() {
        full->P();
        mutex->P();
    
        if (this->water == false && buf == WATER) {
            buf = EMPTY;
            this->water = true;
        }
        if (this->sugar == false && buf == SUGAR) {
            buf = EMPTY;
            this->sugar = true;
        }
        if (this->orange == false && buf == ORANGE) {
            buf = EMPTY;
            this->orange = true;
        }
    
        mutex->V();
        empty->V();
    }
    void run() {
        while(this->water == false || this->sugar == false || this->orange == false) {
            this->getBuf();
            printf("%s %d %d %d, buf=%d\n", name, water, sugar, orange, buf);
        }
    }
  private:
    char name[10];
    bool water, sugar, orange;
};

Consumer *A, *B, *C;
Producer *X;

void testA() {
    A->run();
}

void testB() {
    B->run();
}

void testC() {
    C->run();
}

void testX() {
    X->run();
}

int main () {
    mutex = new Semaphore(1);
    empty = new Semaphore(1);
    full = new Semaphore(0);
    
    A = new Consumer("A", true, true, false);
    B = new Consumer("B", true, false, true);
    C = new Consumer("C", false, true, true);
    X = new Producer("X");
    
    std::thread tA(testA), tB(testB), tC(testC), tX(testX);
    tA.join();
    tB.join();
    tC.join();
    tX.join();
    
    delete mutex;
    delete empty;
    delete full;
    
    delete A;
    delete B;
    delete C;
    delete X;
    
    return 0;
}