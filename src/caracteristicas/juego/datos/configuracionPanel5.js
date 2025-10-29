// src/caracteristicas/juego/datos/configuracionPanel5.js

/**
 * Configuración de niveles para el Panel 5: Circuitos Complejos
 * Este panel presenta combinaciones avanzadas de componentes y conceptos de electrónica.
 */

const nivel1 = {
  id: 1,
  titulo: "Circuitos Avanzados",
  descripcion: "Combina múltiples componentes para crear circuitos más sofisticados. Aprende sobre capacitores, bobinas y sus interacciones.",
  objetivoTexto: "Construye un circuito complejo funcional",
  herramientas: ["bateria", "resistencia-fija", "capacitor", "bobina", "interruptor"],
  dialogoTutorInicial: [
    "¡Bienvenido a los circuitos avanzados! Aquí trabajarás con componentes más sofisticados.",
    "Los capacitores almacenan energía eléctrica temporalmente, mientras que las bobinas resisten cambios en la corriente.",
    "Tu desafío es crear un circuito funcional usando varios componentes. ¡Experimenta y observa cómo interactúan!"
  ],
  pistas: [
    "Los capacitores se cargan cuando conectas la batería y se descargan cuando la desconectas.",
    "Las bobinas (inductores) se oponen a cambios repentinos en la corriente, creando efectos interesantes.",
    "Combina resistencias, capacitores y bobinas para crear filtros y otros circuitos útiles."
  ],
  feedbackExito: "¡Extraordinario! Dominas los circuitos complejos. Estos principios se usan en radios, computadoras y mucho más.",
  feedbackFallo: "Placeholder: Los circuitos complejos requieren conexiones cuidadosas. Revisa que todos los componentes estén correctamente conectados.",
  puntosAlCompletar: 250,
  objetivoValidacion: {}
};

export const nivelesPanel5 = [nivel1];
