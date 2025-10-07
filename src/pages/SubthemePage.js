import React, { useState } from 'react';
import './SubthemePage.css';

function SubthemePage({ selectedPanel, userName, onBackToLaboratory, onStartLevel }) {
  const [selectedLevel, setSelectedLevel] = useState(null);

  // Definición de subtemas/niveles para cada panel
  const panelSubthemes = {
    1: { // Chatarrería de Robots
      title: "Chatarrería de Robots",
      subtitle: "(Tutorial Narrativo)",
      icon: "🤖",
      levels: [
        {
          id: 1,
          title: "Reparación Básica",
          status: "unlocked",
          description: "Un desafío interactivo donde aprenderás a usar la interfaz reparando componentes básicos del robot-tutor.",
          objective: "Familiarízate con los controles y mecánicas principales del juego."
        }
      ]
    },
    2: { // Electricidad Básica
      title: "Electricidad Básica",
      subtitle: "",
      icon: "💡",
      levels: [
        {
          id: 1,
          title: "Naturaleza de la Carga",
          status: "unlocked",
          description: "Un desafío interactivo donde explorarás las propiedades de las cargas positivas y negativas y cómo interactúan entre sí.",
          objective: "Construye un modelo simple para demostrar la atracción y repulsión de partículas."
        },
        {
          id: 2,
          title: "Componentes Básicos",
          status: "locked",
          description: "Aprende sobre resistencias, condensadores y otros componentes fundamentales de los circuitos eléctricos.",
          objective: "Identifica y utiliza correctamente los componentes básicos en un circuito simple."
        },
        {
          id: 3,
          title: "Ley de Ohm",
          status: "locked",
          description: "Descubre la relación fundamental entre voltaje, corriente y resistencia en los circuitos eléctricos.",
          objective: "Aplica la Ley de Ohm para resolver problemas prácticos de circuitos."
        },
        {
          id: 4,
          title: "Circuitos en Serie y Paralelo",
          status: "locked",
          description: "Explora las diferencias entre circuitos en serie y paralelo, y cómo afectan al flujo de corriente.",
          objective: "Construye y analiza circuitos en diferentes configuraciones."
        }
      ]
    },
    3: { // Magnetismo
      title: "Magnetismo",
      subtitle: "",
      icon: "🧲",
      levels: [
        {
          id: 1,
          title: "Campos Magnéticos",
          status: "locked",
          description: "Explora los campos magnéticos y su visualización a través de líneas de campo.",
          objective: "Comprende cómo se comportan los campos magnéticos alrededor de diferentes objetos."
        }
      ]
    }
    // Agregar más paneles según sea necesario
  };

  const currentPanel = panelSubthemes[selectedPanel?.id] || panelSubthemes[2]; // Default a Electricidad Básica
  const currentLevels = currentPanel.levels;

  const handleLevelClick = (level) => {
    if (level.status === 'unlocked') {
      setSelectedLevel(level);
    }
  };

  const handleStartLevel = () => {
    if (selectedLevel) {
      onStartLevel?.(selectedPanel, selectedLevel);
    }
  };

  return (
    <div className="subtheme-page">
      {/* Header */}
      <div className="subtheme-header">
        <div className="user-info">
          <span className="user-label">USUARIO:</span>
          <span className="user-name">{userName}</span>
        </div>
        <div className="panel-title-section">
          <h1 className="panel-main-title">
            {currentPanel.icon} {currentPanel.title}
          </h1>
          {currentPanel.subtitle && (
            <h2 className="panel-subtitle-header">{currentPanel.subtitle}</h2>
          )}
        </div>
      </div>

      <div className="subtheme-content">
        {/* Ruta de Aprendizaje (Mapa de Niveles) */}
        <div className="learning-path">
          <h3 className="path-title">RUTA DE APRENDIZAJE</h3>
          <div className="levels-map">
            {currentLevels.map((level, index) => (
              <div key={level.id} className="level-node-container">
                <div 
                  className={`level-node ${level.status} ${selectedLevel?.id === level.id ? 'selected' : ''}`}
                  onClick={() => handleLevelClick(level)}
                >
                  <div className="node-number">{level.id}</div>
                  <div className="node-content">
                    <h4 className="node-title">{level.title}</h4>
                    <div className="node-status-icon">
                      {level.status === 'unlocked' ? '🔓' : '🔒'}
                    </div>
                  </div>
                </div>
                
                {/* Línea conectora (excepto en el último nodo) */}
                {index < currentLevels.length - 1 && (
                  <div className="connection-line"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Panel de Información del Nivel */}
        <div className="level-info-panel">
          {selectedLevel ? (
            <div className="level-details">
              <h3 className="level-info-title">
                Nivel {selectedLevel.id}: {selectedLevel.title}
              </h3>
              
              <div className="level-description">
                <h4>Descripción del Nivel:</h4>
                <p>"{selectedLevel.description}"</p>
              </div>
              
              <div className="level-objective">
                <h4>Objetivo del Nivel:</h4>
                <p>"{selectedLevel.objective}"</p>
              </div>
              
              <div className="level-actions">
                <button 
                  className="start-level-btn"
                  onClick={handleStartLevel}
                  disabled={selectedLevel.status !== 'unlocked'}
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

      {/* Botón de regreso */}
      <div className="subtheme-controls">
        <button className="back-to-lab-btn" onClick={onBackToLaboratory}>
          ← VOLVER AL LABORATORIO
        </button>
      </div>

      {/* Decoraciones */}
      <div className="subtheme-decorations">
        <div className="decoration circuit-lines"></div>
        <div className="decoration energy-particles"></div>
      </div>
    </div>
  );
}

export default SubthemePage;