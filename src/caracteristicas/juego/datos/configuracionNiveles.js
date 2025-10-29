// src/caracteristicas/juego/datos/configuracionNiveles.js

// Importaciones por panel (mantiene API síncrona para los consumidores actuales)
// Nota: Elegimos importaciones estáticas para no romper llamadas existentes que esperan sincronía.
// Si en el futuro se migra a carga realmente dinámica (code-splitting), habrá que adaptar los consumidores a async.
import { nivelesPanel1 } from './configuracionPanel1';
import { nivelesPanel2 } from './configuracionPanel2';
import { nivelesPanel3 } from './configuracionPanel3';
import { nivelesPanel4 } from './configuracionPanel4';
import { nivelesPanel5 } from './configuracionPanel5';
import { nivelesPanel6 } from './configuracionPanel6';

// Helper: normaliza posibles formatos 'panel-2-electricidad' -> '2', 'nivel-1-carga' -> '1'
const normalizarPanel = (panelId) => (
  typeof panelId === 'string' && panelId.startsWith('panel-')
    ? panelId.split('-')[1]
    : panelId
);

const normalizarNivel = (nivelId) => (
  typeof nivelId === 'string' && nivelId.startsWith('nivel-')
    ? nivelId.split('-')[1]
    : nivelId
);

// Devuelve el arreglo de niveles según el panel solicitado
const obtenerNivelesDePanel = (panelNormalizado) => {
  switch (String(panelNormalizado)) {
    case '1': return nivelesPanel1;
    case '2': return nivelesPanel2;
    case '3': return nivelesPanel3;
    case '4': return nivelesPanel4;
    case '5': return nivelesPanel5;
    case '6': return nivelesPanel6;
    default: return null;
  }
};

/**
 * Función helper para obtener la configuración completa de un nivel específico.
 * @param {string|number} panelId - ID del panel (ej: '2' o 'panel-2-electricidad')
 * @param {string|number} nivelId - ID del nivel (ej: '1' o 'nivel-1-carga')
 * @returns {Object} Configuración del nivel con herramientas, objetivos, etc.
 */
export const obtenerConfiguracionNivel = (panelId, nivelId) => {
  const panelNormalizado = normalizarPanel(panelId);
  const nivelNormalizado = normalizarNivel(nivelId);

  const niveles = obtenerNivelesDePanel(panelNormalizado);
  if (!niveles || !Array.isArray(niveles)) {
    return {
      herramientas: [],
      objetivoTexto: 'Nivel no encontrado',
      objetivoValidacion: {},
      puntosAlCompletar: 0
    };
  }

  const idBuscado = Number(nivelNormalizado);
  const nivel = niveles.find((n) => Number(n.id) === idBuscado);

  return nivel || {
    herramientas: [],
    objetivoTexto: 'Nivel no encontrado',
    objetivoValidacion: {},
    puntosAlCompletar: 0
  };
};

/**
 * Función helper para obtener las herramientas disponibles de un nivel específico.
 * @param {string|number} panelId - ID del panel (ej: '2' o 'panel-2-electricidad')
 * @param {string|number} nivelId - ID del nivel (ej: '1' o 'nivel-1-carga')
 * @returns {string[]} Array de IDs de herramientas, o array vacío si no se encuentra el nivel
 */
export const obtenerHerramientasParaNivel = (panelId, nivelId) => {
  const config = obtenerConfiguracionNivel(panelId, nivelId);
  return Array.isArray(config?.herramientas) ? config.herramientas : [];
};
