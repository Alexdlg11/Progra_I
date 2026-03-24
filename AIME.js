/* ============================================================================
  1) Referencias de la interfaz (DOM)
============================================================================ */

const entradaArchivoTxt = document.getElementById("archivoTxt");
const entradaTexto = document.getElementById("textoEntrada");
const entradaDesplazamiento = document.getElementById("desplazamiento");

const botonEncriptar = document.getElementById("botonEncriptar");
const botonDesencriptar = document.getElementById("botonDesencriptar");
const botonLimpiar = document.getElementById("botonLimpiar");
const botonCopiar = document.getElementById("botonCopiar");
const botonDescargar = document.getElementById("botonDescargar");

const contenedorSalida = document.getElementById("textoSalida");
const contenedorEstado = document.getElementById("estado");

/* ============================================================================
  2) Estado interno mínimo
============================================================================ */

let resultadoActual = "";

/* ============================================================================
  3) Utilidades
============================================================================ */

function mostrarEstado(mensaje, tipo = "info") {
  // Por ahora solo imprimimos texto;
  contenedorEstado.textContent = mensaje;
}

function obtenerDireccionSeleccionada() {
  const seleccionado = document.querySelector('input[name="direccion"]:checked');
  return seleccionado ? seleccionado.value : "derecha";
}

function obtenerDesplazamientoBase() {
  const valor = Number(entradaDesplazamiento.value);

  // Si el usuario mete algo raro, nosotros caemos a 3 (clásico).
  if (Number.isNaN(valor)) return 3;

  // Normalizamos al rango 0..25.
  const mod = ((valor % 26) + 26) % 26;
  return mod;
}

/**
 * Nosotros calculamos el “desplazamiento efectivo” que realmente usaremos para ENCRIPTAR
 * según la dirección:
 * - Derecha (+): efectivo = N
 * - Izquierda (−): efectivo = (26 - N) % 26
 *
 * Importante:
 * - Esto nos permite reutilizar la misma función de cifrado, siempre “hacia adelante”
 *   en módulo 26.
 *
 * @returns {{desplazamientoEfectivo: number, direccion: "derecha"|"izquierda", desplazamientoBase: number}}
 */
function obtenerDesplazamientoEfectivo() {
  const direccion = obtenerDireccionSeleccionada();
  const desplazamientoBase = obtenerDesplazamientoBase();

  // Si es izquierda, nosotros lo convertimos a “derecha equivalente”.
  const desplazamientoEfectivo = direccion === "izquierda"
    ? (26 - desplazamientoBase) % 26
    : desplazamientoBase;

  return { desplazamientoEfectivo, direccion, desplazamientoBase };
}

/* ============================================================================
  4) Cifrar / descifrar (corazón)
============================================================================ */

function cifrarCesar(texto, desplazamientoEfectivo) {
  const A = "A".charCodeAt(0);
  const Z = "Z".charCodeAt(0);
  const a = "a".charCodeAt(0);
  const z = "z".charCodeAt(0);

  let resultado = "";

  for (const caracter of texto) {
    const codigo = caracter.charCodeAt(0);

    // Mayúsculas
    if (codigo >= A && codigo <= Z) {
      const indice = codigo - A;
      const nuevoIndice = (indice + desplazamientoEfectivo) % 26;
      resultado += String.fromCharCode(A + nuevoIndice);
      continue;
    }

    // Minúsculas
    if (codigo >= a && codigo <= z) {
      const indice = codigo - a;
      const nuevoIndice = (indice + desplazamientoEfectivo) % 26;
      resultado += String.fromCharCode(a + nuevoIndice);
      continue;
    }

    // Otros caracteres se quedan igual
    resultado += caracter;
  }

  return resultado;
}

function descifrarCesar(texto, desplazamientoEfectivo) {
  // El inverso es: 26 - desplazamientoEfectivo
  const inverso = (26 - (desplazamientoEfectivo % 26)) % 26;
  return cifrarCesar(texto, inverso);
}

/* ============================================================================
  5) Salida + copiar + descargar
============================================================================ */

function colocarSalida(textoSalida) {
  resultadoActual = textoSalida;

  contenedorSalida.textContent = textoSalida || "(Resultado vacío)";

  const hayAlgo = textoSalida.length > 0;
  botonCopiar.disabled = !hayAlgo;
  botonDescargar.disabled = !hayAlgo;
}

async function copiarResultado() {
  try {
    await navigator.clipboard.writeText(resultadoActual);
    mostrarEstado("Copiado ✅", "ok");
  } catch {
    mostrarEstado("No se pudo copiar (permiso del navegador).", "mal");
  }
}

function descargarResultadoTxt() {
  const blob = new Blob([resultadoActual], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const enlace = document.createElement("a");
  enlace.href = url;
  enlace.download = "resultado_cifrado_cesar.txt";

  document.body.appendChild(enlace);
  enlace.click();
  enlace.remove();
  URL.revokeObjectURL(url);

  mostrarEstado("Descarga lista 📄", "ok");
}

/* ============================================================================
  6) Cargar TXT en textarea
============================================================================ */

async function cargarTxtEnEntrada(archivo) {
  const nombre = (archivo?.name || "").toLowerCase();

  if (!nombre.endsWith(".txt")) {
    mostrarEstado("Ese archivo no parece .txt. Probemos con un TXT 🙂", "mal");
    return;
  }

  const limiteBytes = 2 * 1024 * 1024;
  if (archivo.size > limiteBytes) {
    mostrarEstado("El archivo es muy grande (>2MB). Usemos uno más ligero 🙏", "mal");
    return;
  }

  const texto = await archivo.text();
  entradaTexto.value = texto;

  mostrarEstado("TXT cargado ✅ Ya podemos cifrar/descifrar.", "ok");
}

/* ============================================================================
  7) Botones principales
============================================================================ */

function encriptar() {
  const texto = entradaTexto.value;

  if (!texto.trim()) {
    mostrarEstado("Primero escribamos o carguemos un texto 🙂", "mal");
    colocarSalida("");
    return;
  }

  // Aquí nosotros tomamos (clave + dirección) y lo convertimos a un desplazamiento efectivo.
  const { desplazamientoEfectivo, direccion, desplazamientoBase } = obtenerDesplazamientoEfectivo();

  const cifrado = cifrarCesar(texto, desplazamientoEfectivo);
  colocarSalida(cifrado);

  mostrarEstado(`Encriptado ✅ (clave=${desplazamientoBase}, dirección=${direccion})`, "ok");
}

function desencriptar() {
  const texto = entradaTexto.value;

  if (!texto.trim()) {
    mostrarEstado("Primero escribamos o carguemos un texto 🙂", "mal");
    colocarSalida("");
    return;
  }

  const { desplazamientoEfectivo, direccion, desplazamientoBase } = obtenerDesplazamientoEfectivo();

  const descifrado = descifrarCesar(texto, desplazamientoEfectivo);
  colocarSalida(descifrado);

  mostrarEstado(`Desencriptado ✅ (clave=${desplazamientoBase}, dirección=${direccion})`, "ok");
}

function limpiar() {
  entradaTexto.value = "";
  entradaArchivoTxt.value = "";
  entradaDesplazamiento.value = "3";

  // Volvemos a dejar la dirección en “derecha”
  const opcionDerecha = document.querySelector('input[name="direccion"][value="derecha"]');
  if (opcionDerecha) opcionDerecha.checked = true;

  colocarSalida("");
  contenedorSalida.textContent = "(Aún no generamos salida)";
  mostrarEstado("Listo, reiniciamos todo 🙂", "info");
}

/* ============================================================================
  8) Eventos
============================================================================ */

botonEncriptar.addEventListener("click", encriptar);
botonDesencriptar.addEventListener("click", desencriptar);
botonLimpiar.addEventListener("click", limpiar);

botonCopiar.addEventListener("click", copiarResultado);
botonDescargar.addEventListener("click", descargarResultadoTxt);

entradaArchivoTxt.addEventListener("change", async () => {
  const archivo = entradaArchivoTxt.files?.[0];
  if (!archivo) return;
  await cargarTxtEnEntrada(archivo);
});
