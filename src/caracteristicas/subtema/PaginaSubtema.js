import React, { useState } from 'react';
import { useAuth } from '../../contexto/ContextoAutenticacion';
import './PaginaSubtema.css';

function PaginaSubtema({ selectedPanel: panelSeleccionado, userName: nombreUsuario, onBackToLaboratory: alVolverLaboratorio, onStartLevel: alIniciarNivel }) {
  const [nivelSeleccionado, setNivelSeleccionado] = useState(null);
  const { usuario } = useAuth();

  const subtemasPorPanel = {
    1: {
      titulo: 'Chatarrería de Robots',
      subtitulo: '(Tutorial Narrativo)',
      icono: '🤖',
      niveles: [
        {
          id: 1,
          titulo: 'Reparación Básica',
          estado: 'desbloqueado',
          descripcion: 'Un desafío interactivo donde aprenderás a usar la interfaz reparando componentes básicos del robot-tutor.',
          objetivo: 'Familiarízate con los controles y mecánicas principales del juego.'
        }
      ]
    },
    2: {
      titulo: 'Electricidad Básica',
      subtitulo: '',
      icono: '💡',
      niveles: [
        { id: 1, titulo: 'Naturaleza de la Carga', estado: 'desbloqueado', descripcion: 'Un desafío interactivo donde explorarás las propiedades de las cargas positivas y negativas y cómo interactúan entre sí.', objetivo: 'Construye un modelo simple para demostrar la atracción y repulsión de partículas.' },
        { id: 2, titulo: 'Componentes Básicos', estado: 'bloqueado', descripcion: 'Aprende sobre resistencias, condensadores y otros componentes fundamentales de los circuitos eléctricos.', objetivo: 'Identifica y utiliza correctamente los componentes básicos en un circuito simple.' },
        { id: 3, titulo: 'Ley de Ohm', estado: 'bloqueado', descripcion: 'Descubre la relación fundamental entre voltaje, corriente y resistencia en los circuitos eléctricos.', objetivo: 'Aplica la Ley de Ohm para resolver problemas prácticos de circuitos.' },
        { id: 4, titulo: 'Circuitos en Serie y Paralelo', estado: 'bloqueado', descripcion: 'Explora las diferencias entre circuitos en serie y paralelo, y cómo afectan al flujo de corriente.', objetivo: 'Construye y analiza circuitos en diferentes configuraciones.' }
      ]
    },
    3: {
      titulo: 'Magnetismo',
      subtitulo: '',
      icono: '🧲',
      niveles: [
        { id: 1, titulo: 'Campos Magnéticos', estado: 'bloqueado', descripcion: 'Explora los campos magnéticos y su visualización a través de líneas de campo.', objetivo: 'Comprende cómo se comportan los campos magnéticos alrededor de diferentes objetos.' }
      ]
    }
  };

  const panelActual = subtemasPorPanel[panelSeleccionado?.id] || subtemasPorPanel[2];

  const nivelesActuales = usuario?.rol === 'Docente'
    ? panelActual.niveles.map(n => ({ ...n, estado: 'desbloqueado' }))
    : panelActual.niveles;

  const manejarClickNivel = (nivel) => {
    if (nivel.estado === 'desbloqueado') {
      setNivelSeleccionado(nivel);
    }
  };

  const manejarIniciarNivel = () => {
    if (nivelSeleccionado) {
      alIniciarNivel?.(panelSeleccionado, nivelSeleccionado);
    }
  };

  return (
    <div className="subtheme-page">
      <div className="subtheme-header">
        <div className="user-info">
          <span className="user-label">USUARIO:</span>
          <span className="user-name">{nombreUsuario}</span>
        </div>
        <div className="panel-title-section">
          <h1 className="panel-main-title">{panelActual.icono} {panelActual.titulo}</h1>
          {panelActual.subtitulo && (
            <h2 className="panel-subtitle-header">{panelActual.subtitulo}</h2>
          )}
        </div>
      </div>

      <div className="subtheme-content">
        <div className="learning-path">
          <h3 className="path-title">RUTA DE APRENDIZAJE</h3>
          <div className="levels-map">
            {nivelesActuales.map((nivel, index) => (
              <div key={nivel.id} className="level-node-container">
                <div 
                  className={`level-node ${nivel.estado} ${nivelSeleccionado?.id === nivel.id ? 'selected' : ''}`}
                  onClick={() => manejarClickNivel(nivel)}
                >
                  <div className="node-number">{nivel.id}</div>
                  <div className="node-content">
                    <h4 className="node-title">{nivel.titulo}</h4>
                    <div className="node-status-icon">
                      {nivel.estado === 'desbloqueado' ? '🔓' : '🔒'}
                    </div>
                  </div>
                </div>
                {index < nivelesActuales.length - 1 && (
                  <div className="connection-line"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="level-info-panel">
          {nivelSeleccionado ? (
            <div className="level-details">
              <h3 className="level-info-title">Nivel {nivelSeleccionado.id}: {nivelSeleccionado.titulo}</h3>
              <div className="level-description">
                <h4>Descripción del Nivel:</h4>
                <p>"{nivelSeleccionado.descripcion}"</p>
              </div>
              <div className="level-objective">
                <h4>Objetivo del Nivel:</h4>
                <p>"{nivelSeleccionado.objetivo}"</p>
              </div>
              <div className="level-actions">
                <button 
                  className="start-level-btn"
                  onClick={manejarIniciarNivel}
                  disabled={nivelSeleccionado.estado !== 'desbloqueado'}
                >
                  ¡EMPEZAR NIVEL!
                </button>
              </div>
            </div>
          ) : (
            <div className="no-level-selected">
              <div className="instruction-icon">👆</div>
              <h3>Selecciona un Nivel</h3>
              <p>Haz clic en uno de los nodos de la ruta de aprendizaje para ver su información detallada.</p>
            </div>
          )}
        </div>
      </div>

      <div className="subtheme-controls">
        <button className="back-to-lab-btn" onClick={alVolverLaboratorio}>
          ← VOLVER AL LABORATORIO
        </button>
      </div>

      <div className="subtheme-decorations">
        <div className="decoration circuit-lines"></div>
        <div className="decoration energy-particles"></div>
      </div>
    </div>
  );
}

export default PaginaSubtema;
