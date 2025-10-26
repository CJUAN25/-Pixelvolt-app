// src/caracteristicas/juego/datos/configuracionNiveles.js

/**
 * Configuración de herramientas disponibles por nivel.
 * Cada clave identifica un nivel único usando el formato: panel-<ID_PANEL>-nivel-<ID_NIVEL>
 * Cada valor es un array de IDs de herramientas definidas en definicionHerramientas.js
 */

export const CONFIGURACION_NIVELES = {
  // Panel 1: Chatarrería de Robots (Tutorial)
  'panel-1-nivel-1': ['cable', 'bateria'],

  // Panel 2: Electricidad Básica
  'panel-2-nivel-1': ['cable', 'bateria'],
  'panel-2-nivel-2': ['cable', 'bateria', 'resistencia-fija', 'bombilla', 'interruptor'],
  'panel-2-nivel-3': ['cable', 'bateria', 'resistencia-fija', 'bombilla', 'interruptor'],
  'panel-2-nivel-4': ['cable', 'bateria', 'resistencia-fija', 'bombilla', 'interruptor'],

  // Panel 3: Magnetismo (placeholders para futura implementación)
  'panel-3-nivel-1': ['iman-barra', 'brujula', 'cable'],

  // Panel 4: Ley de Faraday (placeholders)
  'panel-4-nivel-1': ['iman-barra', 'bobina', 'cable'],

  // Panel 5: Circuitos Complejos (placeholders)
  'panel-5-nivel-1': ['cable', 'bateria', 'resistencia-fija', 'capacitor', 'bobina', 'interruptor'],

  // Panel 6: Corriente Alterna (placeholders)
  'panel-6-nivel-1': ['cable', 'fuente-ca', 'transformador', 'motor', 'bombilla'],
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
  return CONFIGURACION_NIVELES[claveNivel] || [];
};
