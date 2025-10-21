/**
 * servicioProgreso.js
 * Servicio de API simulado para obtener estadísticas de progreso (RF-013)
 */

const simularRetardoRed = (ms = 700) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Datos de progreso simulados por docente y grupo
 * Las claves de primer nivel representan el ID del docente
 * Cada docente tiene una clave "todos" con datos agregados y claves por grupo
 */
const datosProgresoSimulados = {
  'default-teacher': {
    todos: {
      etiqueta: 'Todos mis estudiantes',
      totalEstudiantes: 68,
      progresoPromedio: 76,
      promedioIntentosGlobal: 3.1,
      tasaCompletadoGlobal: 72,
      desempenoPaneles: [
        {
          id_panel: 'panel-energia',
          nombrePanel: 'Laboratorio de Energía',
          tasaCompletado: 82,
          promedioIntentos: 2.4,
          estudiantesActivos: 42
        },
        {
          id_panel: 'panel-seguridad',
          nombrePanel: 'Circuitos Seguros',
          tasaCompletado: 65,
          promedioIntentos: 3.8,
          estudiantesActivos: 35
        },
        {
          id_panel: 'panel-automatizacion',
          nombrePanel: 'Automatización Industrial',
          tasaCompletado: 58,
          promedioIntentos: 4.1,
          estudiantesActivos: 31
        },
        {
          id_panel: 'panel-electronica',
          nombrePanel: 'Fundamentos de Electrónica',
          tasaCompletado: 91,
          promedioIntentos: 1.9,
          estudiantesActivos: 50
        }
      ]
    },
    'grupo-001': {
      etiqueta: 'Grupo A - Mañana',
      totalEstudiantes: 24,
      progresoPromedio: 82,
      promedioIntentosGlobal: 2.7,
      tasaCompletadoGlobal: 79,
      desempenoPaneles: [
        {
          id_panel: 'panel-energia',
          nombrePanel: 'Laboratorio de Energía',
          tasaCompletado: 88,
          promedioIntentos: 2.1,
          estudiantesActivos: 20
        },
        {
          id_panel: 'panel-seguridad',
          nombrePanel: 'Circuitos Seguros',
          tasaCompletado: 72,
          promedioIntentos: 3.4,
          estudiantesActivos: 18
        },
        {
          id_panel: 'panel-automatizacion',
          nombrePanel: 'Automatización Industrial',
          tasaCompletado: 61,
          promedioIntentos: 3.6,
          estudiantesActivos: 16
        },
        {
          id_panel: 'panel-electronica',
          nombrePanel: 'Fundamentos de Electrónica',
          tasaCompletado: 95,
          promedioIntentos: 1.8,
          estudiantesActivos: 23
        }
      ]
    },
    'grupo-002': {
      etiqueta: 'Grupo B - Tarde',
      totalEstudiantes: 22,
      progresoPromedio: 71,
      promedioIntentosGlobal: 3.5,
      tasaCompletadoGlobal: 66,
      desempenoPaneles: [
        {
          id_panel: 'panel-energia',
          nombrePanel: 'Laboratorio de Energía',
          tasaCompletado: 75,
          promedioIntentos: 2.9,
          estudiantesActivos: 18
        },
        {
          id_panel: 'panel-seguridad',
          nombrePanel: 'Circuitos Seguros',
          tasaCompletado: 58,
          promedioIntentos: 4.2,
          estudiantesActivos: 15
        },
        {
          id_panel: 'panel-automatizacion',
          nombrePanel: 'Automatización Industrial',
          tasaCompletado: 54,
          promedioIntentos: 4.5,
          estudiantesActivos: 14
        },
        {
          id_panel: 'panel-electronica',
          nombrePanel: 'Fundamentos de Electrónica',
          tasaCompletado: 86,
          promedioIntentos: 2.2,
          estudiantesActivos: 19
        }
      ]
    },
    'grupo-003': {
      etiqueta: 'Grupo C - Avanzado',
      totalEstudiantes: 22,
      progresoPromedio: 74,
      promedioIntentosGlobal: 3.4,
      tasaCompletadoGlobal: 71,
      desempenoPaneles: [
        {
          id_panel: 'panel-energia',
          nombrePanel: 'Laboratorio de Energía',
          tasaCompletado: 81,
          promedioIntentos: 2.6,
          estudiantesActivos: 17
        },
        {
          id_panel: 'panel-seguridad',
          nombrePanel: 'Circuitos Seguros',
          tasaCompletado: 65,
          promedioIntentos: 3.9,
          estudiantesActivos: 16
        },
        {
          id_panel: 'panel-automatizacion',
          nombrePanel: 'Automatización Industrial',
          tasaCompletado: 59,
          promedioIntentos: 4.2,
          estudiantesActivos: 15
        },
        {
          id_panel: 'panel-electronica',
          nombrePanel: 'Fundamentos de Electrónica',
          tasaCompletado: 89,
          promedioIntentos: 2.1,
          estudiantesActivos: 21
        }
      ]
    }
  }
};

/**
 * Obtiene los datos de progreso para un docente y grupo específico
 * @param {string} idDocente - ID del docente
 * @param {string} idGrupo - ID del grupo o 'todos'
 * @returns {Promise<Object>} Datos de progreso
 */
export const obtenerDatosProgreso = async (idDocente, idGrupo = 'todos') => {
  await simularRetardoRed();

  const claveDocente = idDocente || 'default-teacher';
  const datosDocente = datosProgresoSimulados[claveDocente] || datosProgresoSimulados['default-teacher'];

  if (!datosDocente) {
    throw new Error(`No se encontraron datos de progreso para el docente ${claveDocente}`);
  }

  const datos = datosDocente[idGrupo] || datosDocente.todos;

  return {
    ...datos,
    desempenoPaneles: datos.desempenoPaneles ? [...datos.desempenoPaneles] : []
  };
};

// Exportación adicional para compatibilidad con nombre en inglés
export {
  obtenerDatosProgreso as fetchProgressData
};
