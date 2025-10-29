// src/caracteristicas/juego/datos/configuracionPanel1.js

/**
 * Configuración de niveles para el Panel 1: Chatarrería de Robots (Tutorial)
 * Nivel 1 con contenido educativo final y lógica guiada por pasos.
 */

const nivel1 = {
  id: 1,
  titulo: "Bienvenido al Laboratorio",
  descripcion: "Aprende a usar todas las herramientas interactivas del simulador PixelVolt con la guía de Voltio.",
  objetivoTexto: "Sigue las instrucciones paso a paso de Voltio para dominar la interfaz.",
  herramientas: ['bateria'], // Solo la batería disponible
  dialogoTutorSecuencial: [ // Diálogos paso a paso
    /* 0 */ "¡Saludos, aprendiz! Soy Voltio. ¡Te enseñaré a usar este laboratorio!",
    /* 1 */ "Primero, selecciona la **Batería** en la 'Caja de Herramientas' a tu derecha haciendo clic sobre ella.",
    /* 2 */ "¡Perfecto! Ahora **arrástrala** al área de trabajo principal (la cuadrícula) manteniendo presionado el clic izquierdo y soltándola.",
    /* 3 */ "¡Muy bien! Los componentes se alinean solos. Ahora, a conectar. **Haz clic izquierdo** en uno de los puntos cian (terminales) de la batería.",
    /* 4 */ "¡Excelente! Estás dibujando un cable. Mueve el ratón a un espacio vacío y haz **clic izquierdo** para crear una esquina (codo). ¡Inténtalo!",
    /* 5 */ "¡Así se hacen los codos! Puedes añadir más. Para terminar el cable, **haz clic izquierdo** en el *otro* terminal cian de la batería.",
     /* 6 */ "¡BZZT! ¡Conexión lograda! Has creado un 'cortocircuito'. Para este tutorial, está bien. Presiona el botón **[VALIDAR]**.",
    /* 7 */ "¡Correcto! Ahora, aprende a eliminar. Haz **doble clic izquierdo rápido** sobre el **cuerpo** de la batería para quitarla.",
    /* 8 */ "¡Desapareció! Ahora, vuelve a añadir la batería y conéctala como antes." ,
    /* 9 */ "¡Bien! Ahora, para eliminar sólo el cable: haz **doble clic izquierdo rápido** sobre la **línea cian** del cable.",
    /* 10 */ "¡Cable eliminado! Explora los botones: **[PISTA]** da ayuda, **[REINICIAR]** limpia todo y reinicia el tutorial.",
    /* 11 */ "¡Has dominado los controles! Presiona **[SALIR]** para volver a la selección de niveles. ¡Te espero en el siguiente desafío!"
  ],
  pistasPorPaso: { // Pistas específicas para cada paso del diálogo
    '1': ["La 'Caja de Herramientas' está en la columna derecha.", "Busca el icono de la batería y haz clic."],
    '2': ["Mantén presionado el clic izquierdo sobre la batería en la lista.", "Mueve el cursor a la zona cuadriculada grande y suelta el botón."],
    '3': ["Los terminales son los pequeños círculos cian en los extremos.", "Solo un clic corto para iniciar el cable."],
    '4': ["Mueve el ratón a una celda vacía de la cuadrícula.", "Haz un clic izquierdo corto para fijar una esquina."],
    '5': ["Acerca el cursor al otro círculo cian hasta que se resalte.", "Haz clic izquierdo corto para completar la conexión."],
    '6': ["El botón [VALIDAR] está abajo a la derecha, es de color verde."],
    '7': ["Asegúrate de que sean dos clics rápidos sobre la imagen principal de la batería, no sobre los terminales."],
    '8': ["Repite los pasos 1, 2, 3 y 5. Esta vez no necesitas hacer codos."],
    '9': ["Apunta con el cursor directamente sobre la línea cian del cable.", "Haz doble clic izquierdo rápido."],
    '10': ["El botón [PISTA] es amarillo.", "El botón [REINICIAR] es azul."],
    '11': ["El botón [SALIR] es rojo y te devolverá al menú anterior."]
  },
  feedbackExito: "¡Conexión validada! Sigue las instrucciones de Voltio para aprender a eliminar.", // Mostrado tras validar en paso 6
  feedbackFallo: "¡Aún no! Asegúrate de que los dos terminales de la batería estén conectados por un cable.", // Mostrado si VALIDAR falla en paso 6
  puntosAlCompletar: 100, // Puntos por completar el tutorial
  objetivoValidacion: {
    requiereCortocircuitoBateria: true // Condición específica para validar en el paso 6
  }
};

// Asegúrate de que el array exportado contenga este objeto nivel1
export const nivelesPanel1 = [nivel1];
