// src/caracteristicas/juego/datos/configuracionNiveles.js

/**
 * Configuración de herramientas disponibles por nivel.
 * Cada clave identifica un nivel único usando el formato: panel-<ID_PANEL>-nivel-<ID_NIVEL>
 * Cada valor es un objeto con herramientas y objetivos de validación
 */

export const CONFIGURACION_NIVELES = {
  // Panel 1: Chatarrería de Robots (Tutorial)
  'panel-1-nivel-1': {
      herramientas: ['bateria'],
    objetivoTexto: 'Conecta la batería con un cable',
    puntosAlCompletar: 100,
    objetivoValidacion: {
      // Sin requisitos específicos por ahora (tutorial)
    }
  },

  // Panel 2: Electricidad Básica
  'panel-2-nivel-1': {
      herramientas: ['bateria', 'bombilla'],
    objetivoTexto: 'Enciende 1 bombilla conectándola correctamente a la batería',
    puntosAlCompletar: 100,
    objetivoValidacion: {
      bombillasEncendidasMin: 1
    }
  },
  'panel-2-nivel-2': {
      herramientas: ['bateria', 'resistencia-fija', 'bombilla', 'interruptor'],
    objetivoTexto: 'Enciende al menos 1 bombilla conectándola a la batería',
    puntosAlCompletar: 150,
    objetivoValidacion: {
      bombillasEncendidasMin: 1
    }
  },
  'panel-2-nivel-3': {
      herramientas: ['bateria', 'resistencia-fija', 'bombilla', 'interruptor'],
    objetivoTexto: 'Enciende 2 bombillas en serie usando el interruptor cerrado',
    puntosAlCompletar: 200,
    objetivoValidacion: {
      bombillasEncendidasMin: 2,
      interruptoresCerradosMin: 1
    }
  },
  'panel-2-nivel-4': {
      herramientas: ['bateria', 'resistencia-fija', 'bombilla', 'interruptor'],
    objetivoTexto: 'Crea un circuito serie con resistencia, interruptor y bombilla',
    puntosAlCompletar: 200,
    objetivoValidacion: {
      bombillasEncendidasMin: 1,
      interruptoresCerradosMin: 1
    }
  },

  // Panel 3: Magnetismo (placeholders para futura implementación)
  'panel-3-nivel-1': {
      herramientas: ['iman-barra', 'brujula'],
    objetivoTexto: 'Experimenta con imanes y brújula',
    puntosAlCompletar: 100,
    objetivoValidacion: {}
  },

  // Panel 4: Ley de Faraday (placeholders)
  'panel-4-nivel-1': {
      herramientas: ['iman-barra', 'bobina'],
    objetivoTexto: 'Genera corriente con inducción electromagnética',
    puntosAlCompletar: 150,
    objetivoValidacion: {}
  },

  // Panel 5: Circuitos Complejos (placeholders)
  'panel-5-nivel-1': {
      herramientas: ['bateria', 'resistencia-fija', 'capacitor', 'bobina', 'interruptor'],
    objetivoTexto: 'Construye un circuito complejo funcional',
    puntosAlCompletar: 250,
    objetivoValidacion: {}
  },

  // Panel 6: Corriente Alterna (placeholders)
  'panel-6-nivel-1': {
      herramientas: ['fuente-ca', 'transformador', 'motor', 'bombilla'],
    objetivoTexto: 'Experimenta con corriente alterna',
    puntosAlCompletar: 150,
    objetivoValidacion: {}
  },
};

/**
 * Función helper para obtener las herramientas disponibles de un nivel específico.
 * @param {string|number} panelId - ID del panel (ej: '2' o 'panel-2-electricidad')
 * @param {string|number} nivelId - ID del nivel (ej: '1' o 'nivel-1-carga')
 * @returns {string[]} Array de IDs de herramientas, o array vacío si no se encuentra el nivel
 */
export const obtenerHerramientasParaNivel = (panelId, nivelId) => {
  // Normalizar los IDs para manejar diferentes formatos
  const panelNormalizado = typeof panelId === 'string' && panelId.startsWith('panel-')
    ? panelId.split('-')[1]
    : panelId;
  
  const nivelNormalizado = typeof nivelId === 'string' && nivelId.startsWith('nivel-')
    ? nivelId.split('-')[1]
    : nivelId;

  const claveNivel = `panel-${panelNormalizado}-nivel-${nivelNormalizado}`;
  const config = CONFIGURACION_NIVELES[claveNivel];
  
  // Si es un objeto, devolver el array de herramientas; si es array (legacy), devolverlo
  return config?.herramientas || config || [];
};

/**
 * Función helper para obtener la configuración completa de un nivel específico.
 * @param {string|number} panelId - ID del panel
 * @param {string|number} nivelId - ID del nivel
 * @returns {Object} Configuración del nivel con herramientas, objetivos, etc.
 */
export const obtenerConfiguracionNivel = (panelId, nivelId) => {
  const panelNormalizado = typeof panelId === 'string' && panelId.startsWith('panel-')
    ? panelId.split('-')[1]
    : panelId;
  
  const nivelNormalizado = typeof nivelId === 'string' && nivelId.startsWith('nivel-')
    ? nivelId.split('-')[1]
    : nivelId;

  const claveNivel = `panel-${panelNormalizado}-nivel-${nivelNormalizado}`;
  const config = CONFIGURACION_NIVELES[claveNivel];
  
  // Si es un objeto, devolverlo; si es array (legacy), convertirlo
  if (Array.isArray(config)) {
    return {
      herramientas: config,
      objetivoTexto: 'Nivel sin descripción',
      objetivoValidacion: {},
      puntosAlCompletar: 0
    };
  }
  
  return config || {
    herramientas: [],
    objetivoTexto: 'Nivel no encontrado',
    objetivoValidacion: {},
    puntosAlCompletar: 0
  };
};
