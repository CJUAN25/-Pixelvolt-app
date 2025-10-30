// src/caracteristicas/juego/datos/configuracionPanel2.js

/**
 * Configuración de niveles para el Panel 2: Electricidad Básica
 * Este panel cubre los fundamentos de circuitos simples, componentes básicos y la ley de Ohm.
 */

const nivel1 = {
  id: 1, // Mantenemos el ID numérico
  titulo: "¡Primer Circuito!", // Nuevo título
  descripcion: "Descubre cómo hacer que la electricidad fluya desde una batería hasta una bombilla para encenderla.", // Nueva descripción
  objetivoTexto: "Conecta la batería y la bombilla para formar un circuito cerrado y hacer que la bombilla se encienda.", // Objetivo claro
  herramientas: ['bateria', 'bombilla'], // Herramientas específicas
  configuracionSimulacion: { // Configuración permisiva para nivel básico
    voltajeBateria: 5, // 5 Voltios
    corrienteOptimaBombilla: 0.05, // 50 mA - corriente óptima
    corrienteMaximaBombilla: 0.5, // 500 mA - corriente máxima MUY ALTA (no se quemará fácilmente)
    resistenciaBombilla: 100 // 100Ω de resistencia interna => I = 5V/100Ω = 0.05A (perfecto)
  },
  dialogoTutorInicial: [ // Diálogo inicial para este nivel
    "¡Hora de aplicar lo aprendido! Tenemos una **Batería**, nuestra fuente de energía.",
    "Y aquí una **Bombilla**. Necesita energía para brillar.",
    "Tu misión: conectar ambas de forma que la energía viaje desde la batería, pase por la bombilla y regrese a la batería. ¡Eso es un **circuito cerrado**!",
    "Arrastra ambos componentes al área de trabajo y conecta los terminales correctamente."
  ],
  pistas: [ // Pistas específicas para este nivel
    "Recuerda: arrastra la batería y la bombilla al lienzo.",
    "Necesitas *dos* cables: uno que vaya de un polo de la batería a un terminal de la bombilla...",
    "...y otro cable que vaya del *otro* terminal de la bombilla al *otro* polo de la batería.",
    "¡Asegúrate de que el camino para la electricidad sea completo, sin interrupciones!"
  ],
  feedbackExito: "¡Luz! Lo lograste. Creaste un circuito cerrado perfecto. La energía fluye desde la batería, a través de la bombilla, y de regreso. ¡Así funcionan los circuitos básicos!", // Feedback de éxito
  feedbackFallo: "Hmm, la bombilla sigue apagada. Revisa tus conexiones. ¿Hay un camino *completo* desde un polo de la batería, pasando por la bombilla, hasta el otro polo de la batería?", // Feedback de fallo
  puntosAlCompletar: 100, // Puntos definidos
  objetivoValidacion: { // Validación simple: al menos una bombilla encendida
    bombillasEncendidasMin: 1
  }
};

const nivel2 = {
  id: 2, // Mantenemos el ID numérico
  titulo: "Controlando el Flujo", // Título definido
  descripcion: "Añade un interruptor para encender y apagar el circuito, y una resistencia para proteger la bombilla.", // Descripción definida
  objetivoTexto: "Construye un circuito en serie con la batería, el interruptor, la resistencia y la bombilla. ¡Cierra el interruptor para encenderla!", // Objetivo claro
  herramientas: ['bateria', 'resistencia-fija', 'bombilla', 'interruptor'], // Herramientas específicas
  dialogoTutorInicial: [ // Diálogo inicial para este nivel
    "¡Buen trabajo con el primer circuito! Ahora vamos a añadir control.",
    "Este es un **Interruptor**. Permite abrir o cerrar el camino de la electricidad. ¡Como el interruptor de luz de tu casa!",
    "Y esta es una **Resistencia**. Limita cuánta energía fluye, protegiendo componentes como la bombilla.",
    "Tu objetivo: Conecta *en serie* (uno después del otro) la batería, el interruptor, la resistencia y la bombilla para que se encienda.",
    "**¡Importante!** Para activar el interruptor (cerrarlo), necesitarás hacer **clic derecho** sobre él."
  ],
  pistas: [ // Pistas específicas para este nivel
    "Arrastra todos los componentes al lienzo: batería, interruptor, resistencia y bombilla.",
    "Conecta los componentes en un solo bucle cerrado, uno tras otro (en serie).",
    "El orden exacto (Interruptor->Resistencia o Resistencia->Interruptor) no importa mientras estén en el mismo camino.",
    "¿Hiciste **clic derecho** en el interruptor? Debería cambiar visualmente (ponerse verde o cambiar de posición).",
    "Verifica que *todos* los componentes estén conectados formando un círculo completo de regreso a la batería."
  ],
  feedbackExito: "¡Excelente! El interruptor está cerrado y la bombilla brilla. Has construido y controlado tu primer circuito con múltiples componentes. ¡La resistencia también ayuda a que todo funcione sin problemas!", // Feedback de éxito
  feedbackFallo: "La bombilla no enciende. Revisa: ¿Están *todos* los componentes conectados en serie? ¿Hiciste **clic derecho** en el interruptor para cerrarlo? ¿El circuito forma un camino *completo*?", // Feedback de fallo
  puntosAlCompletar: 150, // Puntos definidos
  objetivoValidacion: { // Validación: bombilla encendida Y interruptor cerrado
    bombillasEncendidasMin: 1,
    interruptoresCerradosMin: 1
  }
};

const nivel3 = {
  id: 3,
  titulo: "Resistencia al Poder",
  descripcion: "Usa la Ley de Ohm (R = V / I) para elegir la resistencia correcta y encender la bombilla sin quemarla.",
  objetivoTexto: "Calcula la resistencia necesaria y selecciónala para completar el circuito.",
  herramientas: [
    'bateria', // Asumamos V=5V
    'bombilla', // Asumamos que necesita I=0.05A (50mA)
    'interruptor',
    'resistencia-68', // Opción que produce corriente alta sin quemar (muy brillante)
    'resistencia-10', // Opción incorrecta (muy baja)
    'resistencia-100', // Opción CORRECTA (R = 5V / 0.05A = 100Ω)
    'resistencia-1k' // Opción incorrecta (muy alta)
  ],
  // Valores para el cálculo: V=5, I_deseada=0.05A => R_correcta = 100 Ohms
  configuracionSimulacion: { // Nuevos datos para el simulador
     voltajeBateria: 5, // Voltios
     corrienteOptimaBombilla: 0.05, // Amperios
     corrienteMaximaBombilla: 0.1 // Amperios (por encima se quema)
  },
  dialogoTutorInicial: [
    "¡Avancemos! La Ley de Ohm relaciona Voltaje (V), Corriente (I) y Resistencia (R) con la fórmula: V = I * R.",
    "Tenemos una **Batería de 5 Voltios**.",
    "Esta **Bombilla especial** necesita exactamente **0.05 Amperios** de corriente para encenderse perfectamente.",
    "Si le llega mucho más, ¡se quemará! Si le llega muy poco, no encenderá.",
    "Calcula la **Resistencia (R = V / I)** necesaria, selecciónala de la caja de herramientas y construye el circuito (Batería - Interruptor - Resistencia - Bombilla). ¡No olvides cerrar el interruptor!"
  ],
  pistas: [
    "La fórmula es R = V / I. Conoces V (5V) e I (0.05A).",
    "Divide el Voltaje (5) entre la Corriente deseada (0.05). ¿Qué valor obtienes?",
    "Busca la resistencia con ese valor exacto (Ω) en la caja de herramientas.",
    "Construye el circuito en serie: Batería -> Interruptor -> Resistencia elegida -> Bombilla -> Batería.",
    "Recuerda hacer clic derecho en el interruptor para cerrarlo."
  ],
  feedbackExito: "¡Perfecto! Has elegido la resistencia de 100 Ω. La corriente es la justa (0.05A) y la bombilla brilla correctamente. ¡Dominas la Ley de Ohm!",
  feedbackFallo_MuyPocaCorriente: "Hmm, la bombilla no enciende (o apenas brilla). Parece que la resistencia que elegiste es *demasiado alta*, limitando mucho la corriente. Revisa tus cálculos (R = V / I).", // Corriente baja
  // Corriente alta pero sin quemarse (ej. 68 Ω): muy brillante
  feedbackFallo_MuyBrillante: "¡Demasiada corriente! Con 68 Ω la bombilla brilla *demasiado*. Revisa tus cálculos para un brillo correcto.",
  // Corriente excesiva al punto de dañar la bombilla (ej. 10 Ω o sin resistencia): quemada
  feedbackFallo_MuchaCorriente: "¡POP! ¡Demasiada corriente! La resistencia elegida es *demasiado baja* (o no usaste ninguna) y la bombilla se ha quemado. Calcula R = V / I de nuevo.",
  feedbackFallo_CircuitoIncorrecto: "Revisa el circuito. ¿Están todos los componentes conectados en serie? ¿Cerraste el interruptor?", // Nuevo feedback
  puntosAlCompletar: 200,
  objetivoValidacion: {
    estadoBombillaEsperado: 'encendida_correcta', // Nuevo criterio para el simulador
    interruptoresCerradosMin: 1
  }
};

const nivel4 = {
  id: 4,
  titulo: "El Único Camino (Serie)", // Título revisado
  descripcion: "Conecta varios componentes en fila (serie). Observa cómo afecta esto al flujo de energía y al brillo de las bombillas.", // Descripción revisada
  objetivoTexto: "Construye un circuito con la batería, interruptor y bombillas, TODO en SERIE. Observa cómo se reparte la corriente y logra una luz tenue.", // Objetivo revisado
  herramientas: ['bateria', 'bombilla', 'interruptor'], // Sin resistencia externa - la resistencia viene de las bombillas mismas
  configuracionSimulacion: {
     voltajeBateria: 5,
     corrienteOptimaBombilla: 0.05,
     corrienteMaximaBombilla: 0.1,
     resistenciaBombilla: 50 // Nueva propiedad: cada bombilla tiene 50Ω de resistencia
  },
  dialogoTutorInicial: [
    "Sigamos con las conexiones **en serie**. Recuerda, ¡es como una fila india!",
    "En un circuito serie, la corriente eléctrica solo tiene **un camino** para recorrer, pasando por *todos* los componentes uno tras otro.",
    "Tu desafío: Conecta la batería, el interruptor y **una bombilla**, todo en un solo bucle.",
    "**Primero prueba con una sola bombilla** para ver qué pasa... luego agrega la segunda y despues la tercera",
    "Cierra el interruptor... ¿Notas cómo cambia el brillo cuando agregas más 'obstáculos' (bombillas) en el camino?"
  ],
  pistas: [
    "Prueba primero con UNA bombilla para ver el efecto, luego agrega la segunda.",
    "Asegúrate de tener todos los componentes: batería, interruptor y DOS bombillas.",
    "Conecta la salida de un componente con la entrada del siguiente, formando una cadena cerrada.",
    "El orden exacto no importa, ¡mientras sea un solo camino!",
    "No olvides cerrar el interruptor (clic derecho).",
    "Si nada enciende, revisa CADA conexión. En serie, ¡una sola conexión rota detiene todo el flujo!"
  ],
  feedbackExito: "¡Muy bien! Observa cómo las bombillas encienden, pero bastante tenues (amarillo-naranja). Al poner 3 bombillas en serie, la resistencia total aumenta (50Ω + 50Ω + 50Ω = 150Ω) y la corriente disminuye a un tercio. ¡Esa es la clave de los circuitos en serie: los componentes comparten la corriente!", // Feedback revisado
  feedbackFallo: "Algo falta. Verifica que *todos* los componentes (batería, interruptor y bombillas) estén conectados uno tras otro en un único circuito cerrado. ¿Está el interruptor activado?", // Feedback revisado
  feedbackFallo_UnaBombilla: "¡Interesante! Solo hay UNA bombilla en el circuito y está brillando intensamente (amarillo brillante). Esto es porque con solo 50Ω de resistencia, pasa mucha corriente (0.1A). **Ahora agrega una SEGUNDA bombilla en serie** y observa cómo la resistencia total se duplica (100Ω), haciendo que la corriente baje a la mitad (0.05A) y las bombillas brillen tenuemente.", // Feedback específico y educativo
  puntosAlCompletar: 200, // Puntos ajustados
  objetivoValidacion: { // Validación revisada: requiere 2 bombillas tenues
    bombillasConEstadoMin: { estado: "encendida_tenue", cantidad: 3 },
    interruptoresCerradosMin: 1
  }
};

const nivel5 = {
  id: 5, // Nuevo ID para este nivel
  titulo: "Caminos Separados (Paralelo)", // Título Paralelo
  descripcion: "Conecta dos bombillas en caminos separados (paralelo) y observa cómo cada una recibe la energía completa de la batería.", // Descripción Paralelo
  objetivoTexto: "Construye un circuito con la batería, un interruptor y DOS bombillas conectadas en PARALELO. Ciérralo para encenderlas.", // Objetivo Paralelo
  herramientas: ['bateria', 'bombilla', 'interruptor'], // Herramientas: Sin resistencia
  configuracionSimulacion: { // Valores para asegurar brillo normal
     voltajeBateria: 5,
     corrienteOptimaBombilla: 0.05,
    corrienteMaximaBombilla: 0.1,
    resistenciaBombilla: 100 // Cada bombilla ~100Ω => I = 5V/100Ω = 0.05A (brillo normal)
     // Nota: Asumimos R interna baja para bombillas, V llega casi completo
  },
  dialogoTutorInicial: [
    "¡Ahora veamos la conexión **en paralelo**! Es diferente a la fila india.",
    "Imagina que la corriente sale de la batería y llega a una 'bifurcación'. Parte va por un camino (con una bombilla), otra parte va por otro (con la otra bombilla).",
    "Después de pasar por sus bombillas, los caminos se **vuelven a unir** antes de regresar a la batería.",
    "Construye un circuito así. Cierra el interruptor... ¿Cómo será el brillo comparado con el circuito en serie?"
  ],
  pistas: [ // Pistas adaptadas a conexión en terminales
    "Necesitarás una batería, un interruptor y DOS bombillas.",
    "Conecta la Batería(-) al Interruptor(in). Conecta Interruptor(out) al **terminal 1 de la Batería(+).**", // Nodo de inicio en un terminal
    "Ahora, conecta el **mismo terminal 1 de la Batería(+)** a la entrada de la Bombilla 1.",
    "También conecta el **mismo terminal 1 de la Batería(+)** a la entrada de la Bombilla 2. ¡Sí, dos cables al mismo punto!", // Nodo de división explícito en terminal
    "Conecta la salida de la Bombilla 1 al **terminal 2 de la Batería(-)**.",
    "Conecta la salida de la Bombilla 2 al **mismo terminal 2 de la Batería(-)**. ¡Otra vez dos cables al mismo punto!", // Nodo de unión explícito en terminal
    "¡No olvides cerrar el interruptor (clic derecho)!"
  ],
  feedbackExito: "¡Exacto! Ambas bombillas encienden con **brillo normal**. En paralelo, cada una tiene su propio camino directo a la batería (reciben el voltaje completo), por eso brillan más que en serie. ¡Bien hecho!", // Feedback Paralelo
  feedbackFallo: "Revisa la conexión. ¿Creaste una 'bifurcación' conectando dos cables a un mismo terminal de salida? ¿Cada bombilla está en su propio 'camino'? ¿Los caminos se vuelven a unir en otro terminal antes de regresar a la batería? ¿El interruptor está cerrado?", // Feedback Paralelo
  puntosAlCompletar: 220, // Puntos definidos
  objetivoValidacion: { // Validación: requiere 2 bombillas con brillo normal
    bombillasConEstadoMin: { estado: "encendida_correcta", cantidad: 2 },
    interruptoresCerradosMin: 1
  }
};

export const nivelesPanel2 = [nivel1, nivel2, nivel3, nivel4, nivel5]; // Añadir nivel5 al final
