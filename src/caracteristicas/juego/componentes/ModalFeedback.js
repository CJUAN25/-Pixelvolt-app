import React, { useEffect } from 'react';
import './ModalFeedback.css';

/**
 * Modal de feedback para mostrar mensajes dentro del juego
 * Reemplaza los alert() nativos con una ventana temática cyberpunk
 * 
 * @param {boolean} visible - Controla si el modal está visible
 * @param {string} tipo - Tipo de mensaje: 'exito', 'error', 'pista', 'info'
 * @param {string} mensaje - Contenido del mensaje (soporta HTML)
 * @param {function} onCerrar - Callback cuando se cierra el modal
 */
function ModalFeedback({ visible, tipo = 'info', mensaje = '', onCerrar }) {
  // Cerrar con tecla ESC
  useEffect(() => {
    if (!visible) return;

    const manejarTecla = (e) => {
      if (e.key === 'Escape') {
        onCerrar?.();
      }
    };

    window.addEventListener('keydown', manejarTecla);
    return () => window.removeEventListener('keydown', manejarTecla);
  }, [visible, onCerrar]);

  if (!visible) return null;

  // Determinar estilo según tipo
  const obtenerClaseTipo = () => {
    switch (tipo) {
      case 'exito':
        return 'modal-exito';
      case 'error':
        return 'modal-error';
      case 'pista':
        return 'modal-pista';
      case 'info':
      default:
        return 'modal-info';
    }
  };

  // Determinar icono según tipo
  const obtenerIcono = () => {
    switch (tipo) {
      case 'exito':
        return '✓';
      case 'error':
        return '✗';
      case 'pista':
        return '💡';
      case 'info':
      default:
        return 'ℹ';
    }
  };

  // Determinar título según tipo
  const obtenerTitulo = () => {
    switch (tipo) {
      case 'exito':
        return 'NIVEL COMPLETADO';
      case 'error':
        return 'VALIDACIÓN FALLIDA';
      case 'pista':
        return 'PISTA';
      case 'info':
      default:
        return 'INFORMACIÓN';
    }
  };

  return (
    <div className="modal-feedback-overlay" onClick={onCerrar}>
      <div 
        className={`modal-feedback-contenedor ${obtenerClaseTipo()}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Borde pixelado animado */}
        <div className="modal-borde-superior" />
        <div className="modal-borde-inferior" />
        <div className="modal-borde-izquierdo" />
        <div className="modal-borde-derecho" />

        {/* Cabecera */}
        <div className="modal-cabecera">
          <span className="modal-icono">{obtenerIcono()}</span>
          <h3 className="modal-titulo">{obtenerTitulo()}</h3>
        </div>

        {/* Contenido del mensaje */}
        <div className="modal-contenido">
          <div 
            className="modal-mensaje"
            dangerouslySetInnerHTML={{ __html: mensaje }}
          />
        </div>

        {/* Pie con botón */}
        <div className="modal-pie">
          <button 
            className="modal-boton-cerrar boton-pixel"
            onClick={onCerrar}
            autoFocus
          >
            ACEPTAR
          </button>
          <p className="modal-hint">Presiona ESC para cerrar</p>
        </div>
      </div>
    </div>
  );
}

export default ModalFeedback;
