#include <iostream>
#include <cmath>

using namespace std;

double conARadianes(double grados) {
    return (grados * M_PI) / 180.0;
}

int main() {
    double angGrados;
    cout << "Ingrese el ángulo en grados ";
    cin >> angGrados;

    double anguloRadianes = conARadianes(angGrados);
    cout << "El ángulo convertido a radianes es " << anguloRadianes << endl;

    return 0;
}
	