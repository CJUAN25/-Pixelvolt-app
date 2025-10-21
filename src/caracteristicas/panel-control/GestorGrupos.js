import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexto/ContextoAutenticacion';
import {
  fetchGroupsByTeacherId,
  createGroup,
  updateGroup,
  deleteGroup
} from '../../api/servicioGrupos';
import './GestorGrupos.css';

/**
 * Componente para gestionar grupos de estudiantes (RF-012)
 * Permite a los docentes crear, editar y eliminar grupos
 */
function GestorGrupos() {
  const { usuario } = useAuth();
  
  // Estados del componente
  const [grupos, setGrupos] = useState([]);
  const [estaCargando, setEstaCargando] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [grupoEditando, setGrupoEditando] = useState(null);
  const [datosFormulario, setDatosFormulario] = useState({ nombre_grupo: '' });
  const [error, setError] = useState(null);
  const [mensajeExito, setMensajeExito] = useState(null);

  // Cargar grupos al montar el componente
  useEffect(() => {
    let montado = true;

    const cargarGrupos = async () => {
      try {
        setEstaCargando(true);
        setError(null);
        const datos = await fetchGroupsByTeacherId(usuario?.id || 'default-teacher');
        if (montado) {
          setGrupos(datos);
        }
      } catch (err) {
        if (montado) {
          setError('Error al cargar los grupos. Por favor, intenta de nuevo.');
        }
        console.error('Error cargando grupos:', err);
      } finally {
        if (montado) {
          setEstaCargando(false);
        }
      }
    };

    cargarGrupos();

    return () => {
      montado = false;
    };
  }, [usuario?.id]);

  /**
   * Abre el modal para crear un nuevo grupo
   */
  const manejarAbrirModalCrear = () => {
    setGrupoEditando(null);
    setDatosFormulario({ nombre_grupo: '' });
    setModalAbierto(true);
    setError(null);
  };

  /**
   * Abre el modal para editar un grupo existente
   */
  const manejarAbrirModalEditar = (grupo) => {
    setGrupoEditando(grupo);
    setDatosFormulario({ nombre_grupo: grupo.nombre_grupo });
    setModalAbierto(true);
    setError(null);
  };

  /**
   * Cierra el modal y resetea el formulario
   */
  const manejarCerrarModal = () => {
    setModalAbierto(false);
    setGrupoEditando(null);
    setDatosFormulario({ nombre_grupo: '' });
    setError(null);
  };

  /**
   * Maneja los cambios en el input del formulario
   */
  const manejarCambioInput = (e) => {
    setDatosFormulario({
      ...datosFormulario,
      [e.target.name]: e.target.value
    });
  };

  /**
   * Maneja el envío del formulario (crear o editar)
   */
  const manejarEnvio = async (e) => {
    e.preventDefault();
    
    // Validación
    if (!datosFormulario.nombre_grupo.trim()) {
      setError('El nombre del grupo no puede estar vacío');
      return;
    }

    try {
      setError(null);
      
      if (grupoEditando) {
        // Editar grupo existente
        const grupoActualizado = await updateGroup(grupoEditando.id_grupo, datosFormulario);
        setGrupos(grupos.map(g => 
          g.id_grupo === grupoActualizado.id_grupo ? grupoActualizado : g
        ));
        mostrarMensajeExito('Grupo actualizado correctamente');
      } else {
        // Crear nuevo grupo
        const nuevoGrupo = await createGroup(datosFormulario);
        setGrupos([...grupos, nuevoGrupo]);
        mostrarMensajeExito('Grupo creado correctamente');
      }
      
      manejarCerrarModal();
    } catch (err) {
      setError('Error al guardar el grupo. Por favor, intenta de nuevo.');
      console.error('Error guardando grupo:', err);
    }
  };

  /**
   * Maneja la eliminación de un grupo
   */
  const manejarEliminar = async (grupo) => {
    const confirmarEliminacion = window.confirm(
      `¿Estás seguro de que deseas eliminar el grupo "${grupo.nombre_grupo}"?\n\nEsta acción no se puede deshacer.`
    );

    if (!confirmarEliminacion) return;

    try {
      await deleteGroup(grupo.id_grupo);
      setGrupos(grupos.filter(g => g.id_grupo !== grupo.id_grupo));
      mostrarMensajeExito('Grupo eliminado correctamente');
    } catch (err) {
      setError('Error al eliminar el grupo. Por favor, intenta de nuevo.');
      console.error('Error eliminando grupo:', err);
    }
  };

  /**
   * Muestra un mensaje de éxito temporal
   */
  const mostrarMensajeExito = (mensaje) => {
    setMensajeExito(mensaje);
    setTimeout(() => setMensajeExito(null), 3000);
  };

  /**
   * Copia el código de unión al portapapeles
   */
  const manejarCopiarCodigo = (codigo) => {
    navigator.clipboard.writeText(codigo);
    mostrarMensajeExito('Código copiado al portapapeles');
  };

  return (
    <div className="gestor-grupos">
      <div className="gestor-grupos__encabezado">
        <h2>GESTIONAR MIS GRUPOS</h2>
        <button 
          className="boton-pixel boton-crear"
          onClick={manejarAbrirModalCrear}
        >
          + CREAR NUEVO GRUPO
        </button>
      </div>

      {/* Mensajes de feedback */}
      {error && (
        <div className="mensaje mensaje-error">
          ⚠️ {error}
        </div>
      )}

      {mensajeExito && (
        <div className="mensaje mensaje-exito">
          ✅ {mensajeExito}
        </div>
      )}

      {/* Estado de carga */}
      {estaCargando ? (
        <div className="contenedor-carga">
          <div className="cargador-pixel"></div>
          <p>Cargando grupos...</p>
        </div>
      ) : grupos.length === 0 ? (
        <div className="estado-vacio">
          <p>📚 No tienes grupos creados aún.</p>
          <p>¡Crea tu primer grupo para empezar a organizar a tus estudiantes!</p>
        </div>
      ) : (
        <div className="contenedor-tabla-grupos">
          <table className="tabla-grupos">
            <thead>
              <tr>
                <th>NOMBRE DEL GRUPO</th>
                <th>CÓDIGO DE UNIÓN</th>
                <th>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {grupos.map((grupo) => (
                <tr key={grupo.id_grupo}>
                  <td className="nombre-grupo">{grupo.nombre_grupo}</td>
                  <td className="codigo-grupo">
                    <span className="insignia-codigo">{grupo.codigo_union}</span>
                    <button
                      className="boton-copiar"
                      onClick={() => manejarCopiarCodigo(grupo.codigo_union)}
                      title="Copiar código"
                    >
                      📋
                    </button>
                  </td>
                  <td className="acciones-grupo">
                    <button
                      className="boton-pixel boton-editar"
                      onClick={() => manejarAbrirModalEditar(grupo)}
                    >
                      ✏️ EDITAR
                    </button>
                    <button
                      className="boton-pixel boton-eliminar"
                      onClick={() => manejarEliminar(grupo)}
                    >
                      🗑️ ELIMINAR
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de creación/edición */}
      {modalAbierto && (
        <div className="superposicion-modal" onClick={manejarCerrarModal}>
          <div className="contenido-modal" onClick={(e) => e.stopPropagation()}>
            <div className="encabezado-modal">
              <h3>
                {grupoEditando ? '✏️ EDITAR GRUPO' : '➕ CREAR NUEVO GRUPO'}
              </h3>
              <button 
                className="boton-cerrar"
                onClick={manejarCerrarModal}
              >
                ✕
              </button>
            </div>

            <form onSubmit={manejarEnvio} className="formulario-modal">
              <div className="grupo-formulario">
                <label htmlFor="nombre_grupo">
                  Nombre del Grupo *
                </label>
                <input
                  type="text"
                  id="nombre_grupo"
                  name="nombre_grupo"
                  value={datosFormulario.nombre_grupo}
                  onChange={manejarCambioInput}
                  placeholder="Ej: Grupo A - Mañana"
                  maxLength={50}
                  autoFocus
                />
                <small className="pista-formulario">
                  Elige un nombre descriptivo para identificar fácilmente el grupo
                </small>
              </div>

              {grupoEditando && (
                <div className="caja-informacion">
                  <strong>Código de Unión:</strong> {grupoEditando.codigo_union}
                  <br />
                  <small>El código de unión no puede ser modificado</small>
                </div>
              )}

              <div className="acciones-modal">
                <button
                  type="button"
                  className="boton-pixel boton-cancelar"
                  onClick={manejarCerrarModal}
                >
                  CANCELAR
                </button>
                <button
                  type="submit"
                  className="boton-pixel boton-enviar"
                >
                  {grupoEditando ? 'GUARDAR CAMBIOS' : 'CREAR GRUPO'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default GestorGrupos;
