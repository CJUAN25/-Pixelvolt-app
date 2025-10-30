/**
 * servicioGrupos.js
 * Servicio de API real para la gestión de grupos
 * Conectado al backend de PixelVolt
 */

import { fetchConToken } from './apiCliente';

/**
 * Obtiene todos los grupos de un docente
 * @returns {Promise<Array>} Lista de grupos
 */
export const obtenerGruposPorDocente = async () => {
  const datos = await fetchConToken('/grupos', {
    method: 'GET'
  });
  
  return datos.grupos || [];
};

/**
 * Crea un nuevo grupo
 * @param {Object} datosGrupo - Datos del grupo { nombre_grupo }
 * @returns {Promise<Object>} Grupo creado
 */
export const crearGrupo = async (datosGrupo) => {
  const datos = await fetchConToken('/grupos', {
    method: 'POST',
    body: { nombre_grupo: datosGrupo.nombre_grupo }
  });
  
  return datos.grupo;
};

/**
 * Actualiza un grupo existente
 * @param {string} idGrupo - ID del grupo a actualizar
 * @param {Object} datosActualizados - Datos actualizados { nombre_grupo }
 * @returns {Promise<Object>} Resultado de la actualización
 */
export const actualizarGrupo = async (idGrupo, datosActualizados) => {
  const datos = await fetchConToken(`/grupos/${idGrupo}`, {
    method: 'PUT',
    body: { nombre_grupo: datosActualizados.nombre_grupo }
  });
  
  return datos;
};

/**
 * Elimina un grupo
 * @param {string} idGrupo - ID del grupo a eliminar
 * @returns {Promise<Object>} Resultado de la eliminación
 */
export const eliminarGrupo = async (idGrupo) => {
  const datos = await fetchConToken(`/grupos/${idGrupo}`, {
    method: 'DELETE'
  });
  
  return datos;
};

// Exportaciones adicionales para compatibilidad con nombres en inglés
export {
  obtenerGruposPorDocente as fetchGroupsByTeacherId,
  crearGrupo as createGroup,
  actualizarGrupo as updateGroup,
  eliminarGrupo as deleteGroup
};
