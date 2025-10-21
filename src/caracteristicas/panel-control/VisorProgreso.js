import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexto/ContextoAutenticacion';
import { fetchGroupsByTeacherId } from '../../api/servicioGrupos';
import { fetchProgressData } from '../../api/servicioProgreso';
import './VisorProgreso.css';

/**
 * Componente para visualizar el progreso de los grupos (RF-013)
 * Permite filtrar por grupo y muestra métricas clave y desempeño por panel
 */
function VisorProgreso() {
  const { usuario } = useAuth();
  const idDocente = usuario?.id || 'default-teacher';

  const [grupos, setGrupos] = useState([]);
  const [grupoSeleccionado, setGrupoSeleccionado] = useState('todos');
  const [datosProgreso, setDatosProgreso] = useState(null);
  const [estaCargando, setEstaCargando] = useState(true);
  const [estaCargandoGrupos, setEstaCargandoGrupos] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let montado = true;

    const cargarGrupos = async () => {
      try {
        setEstaCargandoGrupos(true);
        const datos = await fetchGroupsByTeacherId(idDocente);
        if (montado) {
          setGrupos(datos);
        }
      } catch (err) {
        console.error('Error cargando grupos:', err);
      } finally {
        if (montado) {
          setEstaCargandoGrupos(false);
        }
      }
    };

    cargarGrupos();

    return () => {
      montado = false;
    };
  }, [idDocente]);

  useEffect(() => {
    let montado = true;

    const cargarProgreso = async () => {
      try {
        setEstaCargando(true);
        setError(null);
        const datos = await fetchProgressData(idDocente, grupoSeleccionado);
        if (montado) {
          setDatosProgreso(datos);
        }
      } catch (err) {
        console.error('Error obteniendo datos de progreso:', err);
        if (montado) {
          setError('No se pudieron cargar las estadísticas. Intenta nuevamente.');
          setDatosProgreso(null);
        }
      } finally {
        if (montado) {
          setEstaCargando(false);
        }
      }
    };

    cargarProgreso();

    return () => {
      montado = false;
    };
  }, [idDocente, grupoSeleccionado]);

  const manejarCambioGrupo = (evento) => {
    setGrupoSeleccionado(evento.target.value);
  };

  const formatearPorcentaje = (valor) => {
    if (valor === null || valor === undefined) return '0%';
    return `${Math.round(valor)}%`;
  };

  const formatearIntentos = (valor) => {
    if (valor === null || valor === undefined) return '0';
    return Number.parseFloat(valor).toFixed(1);
  };

  return (
    <div className="visor-progreso">
      <header className="visor-progreso__encabezado">
        <div>
          <h2>PROGRESO DE ESTUDIANTES</h2>
          <p>
            Supervisa el avance de tus grupos y detecta oportunidades de refuerzo
            pedagógico.
          </p>
        </div>
      </header>

      <section className="visor-progreso__filtros">
        <label htmlFor="filtroGrupo">Ver estadísticas de:</label>
        <select
          id="filtroGrupo"
          value={grupoSeleccionado}
          onChange={manejarCambioGrupo}
          disabled={estaCargandoGrupos}
        >
          <option value="todos">Todos mis estudiantes</option>
          {grupos.map((grupo) => (
            <option key={grupo.id_grupo} value={grupo.id_grupo}>
              {grupo.nombre_grupo}
            </option>
          ))}
        </select>
      </section>

      {error && (
        <div className="visor-progreso__mensaje visor-progreso__mensaje--error">
          ⚠️ {error}
        </div>
      )}

      {estaCargando ? (
        <div className="visor-progreso__carga">
          <div className="cargador-pixel" aria-hidden="true" />
          <p>Cargando estadísticas...</p>
        </div>
      ) : !datosProgreso ? (
        <div className="visor-progreso__vacio">
          <p>No hay datos disponibles para este grupo todavía.</p>
        </div>
      ) : (
        <>
          <section className="resumen-progreso">
            <div className="cuadricula-estadisticas">
              <article className="tarjeta-estadistica destacada">
                <span className="etiqueta-estadistica">Total de Estudiantes</span>
                <span className="valor-estadistica">{datosProgreso.totalEstudiantes}</span>
                <small className="ayuda-estadistica">
                  {grupoSeleccionado === 'todos'
                    ? 'Distribuidos en todos tus grupos activos'
                    : datosProgreso.etiqueta}
                </small>
              </article>

              <article className="tarjeta-estadistica">
                <span className="etiqueta-estadistica">Progreso Promedio del Curso</span>
                <span className="valor-estadistica">
                  {formatearPorcentaje(datosProgreso.progresoPromedio)}
                </span>
                <div className="barra-estadistica">
                  <div
                    className="relleno-barra-estadistica"
                    style={{ width: `${datosProgreso.progresoPromedio || 0}%` }}
                  />
                </div>
                <small className="ayuda-estadistica">
                  Promedio global de desafíos completados
                </small>
              </article>

              <article className="tarjeta-estadistica">
                <span className="etiqueta-estadistica">Tasa de Completado Global</span>
                <span className="valor-estadistica">
                  {formatearPorcentaje(datosProgreso.tasaCompletadoGlobal)}
                </span>
                <div className="barra-estadistica barra-estadistica--secundaria">
                  <div
                    className="relleno-barra-estadistica"
                    style={{ width: `${datosProgreso.tasaCompletadoGlobal || 0}%` }}
                  />
                </div>
                <small className="ayuda-estadistica">
                  Estudiantes que completaron todos los paneles asignados
                </small>
              </article>

              <article className="tarjeta-estadistica">
                <span className="etiqueta-estadistica">Intentos Promedio</span>
                <span className="valor-estadistica">
                  {formatearIntentos(datosProgreso.promedioIntentosGlobal)}
                </span>
                <small className="ayuda-estadistica">
                  Intentos promedio por desafío en este conjunto de estudiantes
                </small>
              </article>
            </div>
          </section>

          <section className="desempeno-paneles">
            <div className="desempeno-paneles__encabezado">
              <h3>Desempeño por Panel</h3>
              <p>
                Analiza qué paneles requieren refuerzo según los intentos y el
                porcentaje de completado.
              </p>
            </div>

            <div className="cuadricula-resumen-paneles">
              {datosProgreso.desempenoPaneles?.map((panel) => (
                <article className="tarjeta-resumen-panel" key={panel.id_panel}>
                  <header className="tarjeta-resumen-panel__encabezado">
                    <div className="tarjeta-resumen-panel__titulo">
                      <span className="tarjeta-resumen-panel__nombre">{panel.nombrePanel}</span>
                      <span className="tarjeta-resumen-panel__etiqueta">Panel temático</span>
                    </div>
                    <div className="tarjeta-resumen-panel__completado">
                      <span className="tarjeta-resumen-panel__porcentaje">
                        {formatearPorcentaje(panel.tasaCompletado)}
                      </span>
                      <small>Completado</small>
                    </div>
                  </header>

                  <div className="tarjeta-resumen-panel__barra" role="presentation" aria-hidden="true">
                    <div
                      className="tarjeta-resumen-panel__barra-relleno"
                      style={{ width: `${panel.tasaCompletado || 0}%` }}
                    />
                  </div>

                  <footer className="tarjeta-resumen-panel__pie">
                    <div className="metrica-resumen-panel">
                      <span className="metrica-resumen-panel__etiqueta">Estudiantes activos</span>
                      <span className="metrica-resumen-panel__valor">
                        {panel.estudiantesActivos ?? '—'}
                      </span>
                    </div>
                    <div className="metrica-resumen-panel">
                      <span className="metrica-resumen-panel__etiqueta">Intentos promedio</span>
                      <span className="metrica-resumen-panel__valor">
                        {formatearIntentos(panel.promedioIntentos)}
                      </span>
                    </div>
                  </footer>
                </article>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

export default VisorProgreso;
