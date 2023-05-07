#include <iostream>
#include <cmath>

using namespace std;

void Ecuacion2Grado(double a, double b, double c) {
    double discriminante = b*b - 4*a*c;

    if (discriminante >= 0) {
        double solucion1 = (-b + sqrt(discriminante)) / (2*a);
        double solucion2 = (-b - sqrt(discriminante)) / (2*a);
        cout << "Las soluciones son: " << solucion1 << " y " << solucion2 << endl;
    } else {
        cout << "La ecuación no tiene soluciones reales." << endl;
    }
}

int main() {
    double a, b, c;
    cout << "Ingrese los coeficientes a, b, c de la ecuación de segundo grado: ";
    cin >> a >> b >> c;

   Ecuacion2Grado(a, b, c);

    return 0;
}