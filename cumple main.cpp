#include "fecha_nacimiento.h"
#include <iostream>
#include <string>

using namespace std;

int main() {
    int anio, mes, dia;
    cout << "Ingrese su fecha de nacimiento (anio mes dia): ";
    cin >> anio >> mes >> dia;

    FechaNacimiento fecha_nacimiento(anio, mes, dia);
    if (fecha_nacimiento.haCelebradoCumpleanios()) {
        cout << "Ya has celebrado tu cumpleaños este año." << endl;
    } else {
        cout << "Aún no has celebrado tu cumpleaños este año." << endl;
    }

    return 0;
}
