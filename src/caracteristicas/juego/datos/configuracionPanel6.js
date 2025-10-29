// src/caracteristicas/juego/datos/configuracionPanel6.js

/**
 * Configuración de niveles para el Panel 6: Corriente Alterna
 * Este panel introduce la corriente alterna (AC), transformadores y aplicaciones de potencia.
 */

const nivel1 = {
  id: 1,
  titulo: "Introducción a la Corriente Alterna",
  descripcion: "Descubre la diferencia entre corriente continua (DC) y corriente alterna (AC). Aprende por qué AC es esencial para la distribución de energía.",
  objetivoTexto: "Experimenta con corriente alterna",
  herramientas: ["fuente-ca", "transformador", "motor", "bombilla"],
  dialogoTutorInicial: [
    "¡Hasta ahora has trabajado con corriente continua (DC), que fluye en una sola dirección!",
    "La corriente alterna (AC) cambia de dirección periódicamente. Es la que alimenta hogares e industrias en todo el mundo.",
    "Usa la fuente de AC y experimenta con transformadores que pueden aumentar o reducir voltajes. ¡Conecta motores y bombillas!"
  ],
  pistas: [
    "Las fuentes de AC generan corriente que oscila, cambiando de dirección muchas veces por segundo.",
    "Los transformadores solo funcionan con corriente alterna. Pueden aumentar (elevar) o reducir (disminuir) voltajes.",
    "Los motores eléctricos convierten energía eléctrica en movimiento mecánico, impulsados por campos electromagnéticos."
  ],
  feedbackExito: "¡Magnífico! Comprendes la corriente alterna, el corazón de los sistemas eléctricos modernos. ¡Has completado tu viaje en PixelVolt!",
  feedbackFallo: "Placeholder: Experimenta conectando la fuente de AC a diferentes componentes para observar sus efectos.",
  puntosAlCompletar: 150,
  objetivoValidacion: {}
};

export const nivelesPanel6 = [nivel1];
