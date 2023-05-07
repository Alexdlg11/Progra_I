#pragma once

#include <string>

class FechaNacimiento {
public:
    FechaNacimiento(int anio, int mes, int dia);

    bool haCelebradoCumpleanios() const;

private:
    int anio_;
    int mes_;
    int dia_;
};
