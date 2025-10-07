import React from 'react';
import PanelCard from '../components/PanelCard';
import './LaboratoryPage.css';

function LaboratoryPage({ userName = "ExploradorEstelar", onBackToAuth, onSelectPanel }) {
  // Datos de los paneles temáticos
  const panels = [
    {
      id: 1,
      title: "Chatarrería de Robots",
      subtitle: "(Tutorial Narrativo)",
      icon: "🤖",
      status: "unlocked",
      description: "Aprende las mecánicas básicas de la interfaz mientras reparas a tu robot-tutor"
    },
    {
      id: 2,
      title: "Electricidad Básica",
      icon: "💡",
      status: "locked",
      description: "Domina los fundamentos de la carga, la Ley de Ohm y los circuitos en serie y paralelo"
    },
    {
      id: 3,
      title: "Magnetismo",
      icon: "🧲",
      status: "locked",
      description: "Explora los imanes, las líneas de campo magnético y el funcionamiento de la brújula"
    },
    {
      id: 4,
      title: "Inducción de Faraday",
      icon: "⚡",
      status: "locked",
      description: "Descubre la relación entre magnetismo y electricidad, la Ley de Lenz y los generadores"
    },
    {
      id: 5,
      title: "Circuitos Complejos",
      subtitle: "(RC, RL, RLC)",
      icon: "🔌",
      status: "locked",
      description: "Analiza la carga y descarga de capacitores e inductores en circuitos avanzados"
    },
    {
      id: 6,
      title: "Corriente Alterna",
      subtitle: "(CA) y Aplicaciones",
      icon: "∿",
      status: "locked",
      description: "Aprende sobre la señal de CA y el principio de los transformadores y motores"
    }
  ];

  const handlePanelClick = (panel) => {
    if (panel.status === 'unlocked' || panel.status === 'completed') {
      console.log(`Seleccionado panel: ${panel.title}`);
      onSelectPanel?.(panel);
    }
  };

  return (
    <div className="laboratory-page">
      {/* Header con información del usuario y título - abarca ambas columnas */}
      <div className="lab-header">
        <div className="user-info">
          <span className="user-label">USUARIO:</span>
          <span className="user-name">{userName}</span>
        </div>
        <div className="lab-title">
          <h1>PIXELVOLT LABORATORY</h1>
          <button className="close-button" onClick={onBackToAuth}>✖</button>
        </div>
      </div>

      {/* Layout principal de dos columnas */}
      <div className="lab-main-layout">
        {/* Columna Izquierda (40%) - Robot y Tienda */}
        <div className="left-column">
          <div className="robot-section">
            <div className="robot-container">
              <img 
                src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI1MCIgdmlld0JveD0iMCAwIDIwMCAyNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjUwIiBmaWxsPSJ0cmFuc3BhcmVudCIvPgo8IS0tIENhYmV6YSBkZWwgcm9ib3QgLS0+CjxyZWN0IHg9IjUwIiB5PSIyMCIgd2lkdGg9IjEwMCIgaGVpZ2h0PSI4MCIgZmlsbD0iIzg4Y2NmZiIgc3Ryb2tlPSIjMDBmZmZmIiBzdHJva2Utd2lkdGg9IjIiLz4KPCEtLSBPam9zIC0tPgo8cmVjdCB4PSI2NSIgeT0iNDAiIHdpZHRoPSIxNSIgaGVpZ2h0PSIxNSIgZmlsbD0iIzAwZmZmZiIvPgo8cmVjdCB4PSIxMjAiIHk9IjQwIiB3aWR0aD0iMTUiIGhlaWdodD0iMTUiIGZpbGw9IiMwMGZmZmYiLz4KPCEtLSBCb2NhIC0tPgo8cmVjdCB4PSI4NSIgeT0iNzAiIHdpZHRoPSIzMCIgaGVpZ2h0PSI4IiBmaWxsPSIjMDBmZmZmIi8+CjwhLS0gQ3VlcnBvIC0tPgo8cmVjdCB4PSI0MCIgeT0iMTAwIiB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzg4Y2NmZiIgc3Ryb2tlPSIjMDBmZmZmIiBzdHJva2Utd2lkdGg9IjIiLz4KPCEtLSBQYW5lbCBkZWwgcGVjaG8gLS0+CjxyZWN0IHg9IjgwIiB5PSIxMjAiIHdpZHRoPSI0MCIgaGVpZ2h0PSIzMCIgZmlsbD0iIzAwNjZhYSIgc3Ryb2tlPSIjMDBmZmZmIiBzdHJva2Utd2lkdGg9IjEiLz4KPGNpcmNsZSBjeD0iMTAwIiBjeT0iMTM1IiByPSI1IiBmaWxsPSIjMDBmZmZmIi8+CjwhLS0gQnJhem9zIC0tPgo8cmVjdCB4PSIxMCIgeT0iMTEwIiB3aWR0aD0iMzAiIGhlaWdodD0iNjAiIGZpbGw9IiM4OGNjZmYiIHN0cm9rZT0iIzAwZmZmZiIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxyZWN0IHg9IjE2MCIgeT0iMTEwIiB3aWR0aD0iMzAiIGhlaWdodD0iNjAiIGZpbGw9IiM4OGNjZmYiIHN0cm9rZT0iIzAwZmZmZiIgc3Ryb2tlLXdpZHRoPSIyIi8+CjwhLS0gTWFub3MgLS0+CjxjaXJjbGUgY3g9IjI1IiBjeT0iMTgwIiByPSIxMiIgZmlsbD0iIzg4Y2NmZiIgc3Ryb2tlPSIjMDBmZmZmIiBzdHJva2Utd2lkdGg9IjIiLz4KPGNpcmNsZSBjeD0iMTc1IiBjeT0iMTgwIiByPSIxMiIgZmlsbD0iIzg4Y2NmZiIgc3Ryb2tlPSIjMDBmZmZmIiBzdHJva2Utd2lkdGg9IjIiLz4KPCEtLSBQaWVybmFzIC0tPgo8cmVjdCB4PSI2NSIgeT0iMjAwIiB3aWR0aD0iMjUiIGhlaWdodD0iNDAiIGZpbGw9IiM4OGNjZmYiIHN0cm9rZT0iIzAwZmZmZiIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxyZWN0IHg9IjExMCIgeT0iMjAwIiB3aWR0aD0iMjUiIGhlaWdodD0iNDAiIGZpbGw9IiM4OGNjZmYiIHN0cm9rZT0iIzAwZmZmZiIgc3Ryb2tlLXdpZHRoPSIyIi8+CjwhLS0gUGllcyAtLT4KPHJlY3QgeD0iNjAiIHk9IjI0MCIgd2lkdGg9IjM1IiBoZWlnaHQ9IjEwIiBmaWxsPSIjMDA2NmFhIiBzdHJva2U9IiMwMGZmZmYiIHN0cm9rZS13aWR0aD0iMSIvPgo8cmVjdCB4PSIxMDUiIHk9IjI0MCIgd2lkdGg9IjM1IiBoZWlnaHQ9IjEwIiBmaWxsPSIjMDA2NmFhIiBzdHJva2U9IiMwMGZmZmYiIHN0cm9rZS13aWR0aD0iMSIvPgo8L3N2Zz4K" 
                alt="Robot PixelVolt" 
                className="robot-image"
              />
            </div>
            <div className="robot-mode-indicator">
              <span>MODO: RESUELVE Y APLICA</span>
            </div>
          </div>
          
          <div className="shop-section">
            <button className="shop-button">
              <span className="shop-text">TIENDA</span>
            </button>
          </div>
        </div>

        {/* Columna Derecha (60%) - Paneles y Controles */}
        <div className="right-column">
          {/* Grid de paneles temáticos */}
          <div className="panels-section">
            <div className="panels-grid">
              {panels.map((panel) => (
                <PanelCard
                  key={panel.id}
                  title={panel.title}
                  subtitle={panel.subtitle}
                  icon={panel.icon}
                  status={panel.status}
                  description={panel.description}
                  onClick={() => handlePanelClick(panel)}
                />
              ))}
            </div>
          </div>

          {/* Controles inferiores */}
          <div className="controls-section">
            <div className="lab-controls">
              <button className="control-button mode-button">
                <span className="button-text">MODO: RESUELVE Y APLICA</span>
              </button>
              <button className="control-button logout-button" onClick={onBackToAuth}>
                <span className="button-text">CERRAR SESIÓN</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Elementos decorativos del laboratorio */}
      <div className="lab-decorations">
        <div className="decoration cyber-grid"></div>
        <div className="decoration energy-flow"></div>
      </div>
    </div>
  );
}

export default LaboratoryPage;