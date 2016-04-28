#include <thread>
#include <mutex>
#include <condition_variable>
#include <cstdio>
#include <cstring>

const int EMPTY = 0;
const int WATER = 1;
const int SUGAR = 2;
const int ORANGE = 3;

int buf = EMPTY, count;

std::mutex m;
std::condition_variable notFull, notEmpty;

class Producer {
  public:
    Producer(const char* name="default", int cur=1) {
        strcpy(this->name, name);
        this->cur = cur;
    }
    void putBuf() {
        std::unique_lock<std::mutex> lk(m);
        while (count == 1)
            notFull.wait(lk);
        if (buf == EMPTY) {
            buf = cur;
            cur ++;
        }
        count ++;
        lk.unlock();
        notEmpty.notify_one();
    }
    void run() {
        while(cur < 4) {
            this->putBuf();
            printf("%s, buf=%d\n", name, buf);
        }
    }
  private:
    char name[10];
    int cur;
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
        std::unique_lock<std::mutex> lk(m);
        while (count == 0)
            notEmpty.wait(lk);
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
        count --;
        lk.unlock();
        notFull.notify_one();
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
    A = new Consumer("A", true, true, false);
    B = new Consumer("B", true, false, true);
    C = new Consumer("C", false, true, true);
    X = new Producer("X");
    
    std::thread tA(testA), tB(testB), tC(testC), tX(testX);
    tA.join();
    tB.join();
    tC.join();
    tX.join();
    
    delete A;
    delete B;
    delete C;
    delete X;
    
    return 0;
}