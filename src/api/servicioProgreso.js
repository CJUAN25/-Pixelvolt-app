/**
 * servicioProgreso.js
 * Servicio de API real para obtener estadísticas de progreso (RF-013)
 * Conectado al backend de PixelVolt
 */

import { fetchConToken } from './apiCliente';

/**
 * Obtiene los datos de progreso para un docente y grupo específico
 * @param {string} idDocente - ID del docente (ignorado, el backend usa el token)
 * @param {string} idGrupo - ID del grupo o 'todos' para agregar todos los grupos
 * @returns {Promise<Object>} Datos de progreso
 */
export const obtenerDatosProgreso = async (idDocente, idGrupo = 'todos') => {
  const endpoint = idGrupo === 'todos' 
    ? '/progreso/docente' 
    : `/progreso/docente?id_grupo=${idGrupo}`;
  
  const datos = await fetchConToken(endpoint, {
    method: 'GET'
  });
  
  return datos;
};

// Exportación adicional para compatibilidad con nombre en inglés
export {
  obtenerDatosProgreso as fetchProgressData
};
