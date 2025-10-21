/**
 * servicioGrupos.js
 * Servicio de API simulado para la gestión de grupos
 * Estructura basada en el Diagrama MER: { id_grupo, nombre_grupo, codigo_union }
 */

// Base de datos simulada en memoria
let gruposSimulados = [
  {
    id_grupo: 'grupo-001',
    nombre_grupo: 'Grupo A - Mañana',
    codigo_union: 'GRP-2025-A1'
  },
  {
    id_grupo: 'grupo-002',
    nombre_grupo: 'Grupo B - Tarde',
    codigo_union: 'GRP-2025-B2'
  },
  {
    id_grupo: 'grupo-003',
    nombre_grupo: 'Grupo C - Avanzado',
    codigo_union: 'GRP-2025-C3'
  }
];

/**
 * Genera un ID único para un nuevo grupo
 * @returns {string} ID único en formato 'grupo-XXX'
 */
const generarIdGrupo = () => {
  const marcaTiempo = Date.now();
  const aleatorio = Math.floor(Math.random() * 1000);
  return `grupo-${marcaTiempo}-${aleatorio}`;
};

/**
 * Genera un código de unión único para un grupo
 * @returns {string} Código en formato 'GRP-YYYY-XXX'
 */
const generarCodigoUnion = () => {
  const anio = new Date().getFullYear();
  const aleatorio = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `GRP-${anio}-${aleatorio}`;
};

/**
 * Simula un delay de red para hacer las llamadas más realistas
 * @param {number} ms - Milisegundos de espera
 */
const simularRetardoRed = (ms = 500) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Obtiene todos los grupos de un docente
 * @param {string} idDocente - ID del docente
 * @returns {Promise<Array>} Lista de grupos
 */
export const obtenerGruposPorDocente = async (idDocente) => {
  await simularRetardoRed(800);
  
  // En una implementación real, filtrarías por idDocente
  // Por ahora, devolvemos todos los grupos simulados
  console.log(`📚 Cargando grupos del docente: ${idDocente}`);
  
  return [...gruposSimulados]; // Devolvemos una copia para evitar mutaciones
};

/**
 * Crea un nuevo grupo
 * @param {Object} datosGrupo - Datos del grupo { nombre_grupo }
 * @returns {Promise<Object>} Grupo creado con id_grupo y codigo_union generados
 */
export const crearGrupo = async (datosGrupo) => {
  await simularRetardoRed(600);
  
  const nuevoGrupo = {
    id_grupo: generarIdGrupo(),
    nombre_grupo: datosGrupo.nombre_grupo,
    codigo_union: generarCodigoUnion()
  };
  
  gruposSimulados.push(nuevoGrupo);
  console.log('✅ Grupo creado:', nuevoGrupo);
  
  return nuevoGrupo;
};

/**
 * Actualiza un grupo existente
 * @param {string} idGrupo - ID del grupo a actualizar
 * @param {Object} datosActualizados - Datos actualizados { nombre_grupo }
 * @returns {Promise<Object>} Grupo actualizado
 */
export const actualizarGrupo = async (idGrupo, datosActualizados) => {
  await simularRetardoRed(500);
  
  const indiceGrupo = gruposSimulados.findIndex(g => g.id_grupo === idGrupo);
  
  if (indiceGrupo === -1) {
    throw new Error(`Grupo con ID ${idGrupo} no encontrado`);
  }
  
  gruposSimulados[indiceGrupo] = {
    ...gruposSimulados[indiceGrupo],
    nombre_grupo: datosActualizados.nombre_grupo
  };
  
  console.log('✏️ Grupo actualizado:', gruposSimulados[indiceGrupo]);
  
  return gruposSimulados[indiceGrupo];
};

/**
 * Elimina un grupo
 * @param {string} idGrupo - ID del grupo a eliminar
 * @returns {Promise<boolean>} true si se eliminó correctamente
 */
export const eliminarGrupo = async (idGrupo) => {
  await simularRetardoRed(400);
  
  const indiceGrupo = gruposSimulados.findIndex(g => g.id_grupo === idGrupo);
  
  if (indiceGrupo === -1) {
    throw new Error(`Grupo con ID ${idGrupo} no encontrado`);
  }
  
  const grupoEliminado = gruposSimulados[indiceGrupo];
  gruposSimulados.splice(indiceGrupo, 1);
  
  console.log('🗑️ Grupo eliminado:', grupoEliminado);
  
  return true;
};

/**
 * Obtiene un grupo por su ID
 * @param {string} idGrupo - ID del grupo
 * @returns {Promise<Object|null>} Grupo encontrado o null
 */
export const obtenerGrupoPorId = async (idGrupo) => {
  await simularRetardoRed(300);
  
  const grupo = gruposSimulados.find(g => g.id_grupo === idGrupo);
  return grupo || null;
};

/**
 * Verifica si un código de unión existe
 * @param {string} codigoUnion - Código de unión a verificar
 * @returns {Promise<Object|null>} Grupo encontrado o null
 */
export const obtenerGrupoPorCodigoUnion = async (codigoUnion) => {
  await simularRetardoRed(300);
  
  const grupo = gruposSimulados.find(g => g.codigo_union === codigoUnion);
  return grupo || null;
};

// Exportaciones adicionales para compatibilidad con nombres en inglés
export {
  obtenerGruposPorDocente as fetchGroupsByTeacherId,
  crearGrupo as createGroup,
  actualizarGrupo as updateGroup,
  eliminarGrupo as deleteGroup,
  obtenerGrupoPorId as getGroupById,
  obtenerGrupoPorCodigoUnion as getGroupByJoinCode
};
