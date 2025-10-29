// src/caracteristicas/juego/datos/configuracionPanel3.js

/**
 * Configuración de niveles para el Panel 3: Magnetismo
 * Este panel explora los campos magnéticos, imanes y sus interacciones con corrientes eléctricas.
 */

const nivel1 = {
  id: 1,
  titulo: "Explorando Campos Magnéticos",
  descripcion: "Descubre el fascinante mundo del magnetismo usando imanes de barra y brújulas. Observa cómo interactúan los campos magnéticos.",
  objetivoTexto: "Experimenta con imanes y brújula",
  herramientas: ["iman-barra", "brujula"],
  dialogoTutorInicial: [
    "¡Bienvenido al mundo del magnetismo! Los imanes tienen propiedades fascinantes que exploraremos juntos.",
    "Cada imán tiene dos polos: norte y sur. Estos polos interactúan de formas interesantes.",
    "Usa la brújula para visualizar el campo magnético. ¡Experimenta moviendo los imanes y observa qué sucede!"
  ],
  pistas: [
    "Coloca un imán de barra en el área de trabajo y observa cómo la brújula reacciona.",
    "Polos opuestos se atraen (norte con sur), mientras que polos iguales se repelen (norte con norte, sur con sur).",
    "El campo magnético es más fuerte cerca de los polos del imán y se debilita con la distancia."
  ],
  feedbackExito: "¡Fantástico! Has explorado los campos magnéticos básicos. El magnetismo es una fuerza fundamental de la naturaleza.",
  feedbackFallo: "Placeholder: Sigue experimentando con los imanes y la brújula para completar este nivel exploratorio.",
  puntosAlCompletar: 100,
  objetivoValidacion: {}
};

export const nivelesPanel3 = [nivel1];
