// src/caracteristicas/juego/datos/configuracionPanel4.js

/**
 * Configuración de niveles para el Panel 4: Ley de Faraday (Inducción Electromagnética)
 * Este panel enseña cómo el magnetismo puede generar electricidad y viceversa.
 */

const nivel1 = {
  id: 1,
  titulo: "Inducción Electromagnética",
  descripcion: "Descubre uno de los principios más importantes de la física: cómo el movimiento de un imán puede generar corriente eléctrica.",
  objetivoTexto: "Genera corriente con inducción electromagnética",
  herramientas: ["iman-barra", "bobina"],
  dialogoTutorInicial: [
    "¡Prepárate para algo sorprendente! Vamos a generar electricidad usando solo imanes y bobinas.",
    "Michael Faraday descubrió que un campo magnético cambiante puede inducir corriente en un conductor.",
    "Mueve el imán cerca de la bobina y observa cómo se genera corriente. ¡Este principio alimenta generadores eléctricos en todo el mundo!"
  ],
  pistas: [
    "Coloca una bobina (enrollado de alambre) en el área de trabajo.",
    "Acerca y aleja el imán de la bobina. El movimiento es clave para generar corriente.",
    "Cuanto más rápido muevas el imán o más cerca esté de la bobina, mayor será la corriente inducida."
  ],
  feedbackExito: "¡Increíble! Has generado electricidad a partir del magnetismo. Este es el principio detrás de generadores y transformadores.",
  feedbackFallo: "Placeholder: Intenta mover el imán más cerca de la bobina o más rápidamente para inducir corriente.",
  puntosAlCompletar: 150,
  objetivoValidacion: {}
};

export const nivelesPanel4 = [nivel1];
