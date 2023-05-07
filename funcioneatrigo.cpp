#include <iostream>
#include <cmath>

using namespace std;

void FuncionesTrigonometricas(double angulo) {
    double seno = sin(angulo);
    double coseno = cos(angulo);
    double tangente = tan(angulo);
    double cotangente = 1 / tangente;
    double secante = 1 / coseno;
    double cosecante = 1 / seno;

    cout << "Seno: " << seno << endl;
    cout << "Coseno: " << coseno << endl;
    cout << "Tangente: " << tangente << endl;
    cout << "Cotangente: " << cotangente << endl;
    cout << "Secante: " << secante << endl;
    cout << "Cosecante: " << cosecante << endl;
}

int main() {
    double angulo;
    cout << "Ingrese el valor del ángulo en radianes ";
    cin >> angulo;

    FuncionesTrigonometricas(angulo);

    return 0;
}
