#include <iostream>
#include <string>

class Shape{
public:
    double len;
    double S;
public:
    Shape(double len, double S){
        this->len = len;
        this->S = S;
    }
};

class Triangle : public Shape{
    public:
    Triangle(double len, double S) : Shape(len, S){
        this->len = len;
        this->S = S;
    }
};

class Circle : public Shape{
    public:
    Circle(double len, double S) : Shape(len, S){
        this->len = len;
        this->S = S;
    }
};

class Rectangle : public Shape{
    public:
    Rectangle(double len, double S) : Shape(len, S){
        this->len = len;
        this->S = S;
    }
};


class Agent{
    Agent *left_child = nullptr;
    Agent *right_child = nullptr;
    int value;
public:
    Agent(int value) : value(value){
        left_child = nullptr;
        right_child = nullptr;
    }

    Agent* search(int value){
        if(value == this->value){
            return this;
        }
        if(value < this->value){
            return left_child->search(value);
        }
        return right_child->search(value);
    }

    void insert(int value){
        if(value < this->value){
            if(left_child == nullptr){
                left_child = new Agent(value);
            }
            left_child->insert(value);
        }
    }
}

constexpr static int global_array[5] = {1,2,3,4,5};

int add(int a, int b){
    return a + b;
}

int main(){
    Shape s(10, 30);
    Shape s2(20, 40);
    Triangle t(10, 30);
    Circle c(20, 40);
    Rectangle r(30, 50);

    std::string name;
    std::cout << "who are you?" << std::endl;
    std::cin >> name;
    // std::cout << p << std::endl;
    std::cout << &s << std::endl;
    std::cout << &s2 << std::endl;
    std::cout << &t << std::endl;
    std::cout << &c << std::endl;
    std::cout << &r << std::endl;
    std::cout << p << std::endl;

    int *a = new int(3);
    std::cout << a[0] << std::endl;
    std::cout << a[1] << std::endl;
    std::cout << a[2] << std::endl;

    a[100000] = 9;
    std::cout << a[100000] << std::endl;
    
    std::cout << "good morning, " << name << std::endl;
    return 0;
}