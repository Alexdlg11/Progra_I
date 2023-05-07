#include "fecha_nacimiento.h"
#include <chrono>
#include <ctime>

using namespace std;
using namespace std::chrono;

FechaNacimiento::FechaNacimiento(int anio, int mes, int dia)
    : anio_(anio), mes_(mes), dia_(dia)
{
}

bool FechaNacimiento::haCelebradoCumpleanios() const
{
    auto ahora = system_clock::now();
    time_t tiempo = system_clock::to_time_t(ahora);
    tm* ahora_tm = localtime(&tiempo);

    if (ahora_tm->tm_mon + 1 < mes_) {
        return false;
    } else if (ahora_tm->tm_mon + 1 > mes_) {
        return true;
    } else {
        return ahora_tm->tm_mday >= dia_;
    }
}
