import React from 'react';
import './PanelCard.css';

function PanelCard({ title, subtitle, status, icon, description, onClick }) {
  const getStatusIcon = () => {
    switch (status) {
      case 'unlocked':
        return '🔓';
      case 'locked':
        return '🔒';
      case 'completed':
        return '✓';
      default:
        return '🔒';
    }
  };

  const handleClick = () => {
    if (status === 'unlocked' || status === 'completed') {
      onClick?.();
    }
  };

  return (
    <div 
      className={`panel-card ${status}`}
      onClick={handleClick}
    >
      <div className="panel-glass">
        <div className="panel-content">
          {/* Icono principal del panel */}
          <div className="panel-icon">
            {icon || '⚡'}
          </div>
          
          {/* Título del panel */}
          <div className="panel-title">
            {title}
            {subtitle && (
              <div className="panel-subtitle">
                {subtitle}
              </div>
            )}
          </div>
          
          {/* Descripción opcional */}
          {description && (
            <div className="panel-description">
              {description}
            </div>
          )}
        </div>
        
        {/* Estado del panel */}
        <div className="panel-status">
          <span className="status-icon">
            {getStatusIcon()}
          </span>
        </div>
        
        {/* Overlay para paneles bloqueados */}
        {status === 'locked' && (
          <div className="panel-overlay">
            <div className="lock-icon">🔒</div>
          </div>
        )}
        
        {/* Efecto de energía para paneles desbloqueados */}
        {status === 'unlocked' && (
          <div className="energy-effect"></div>
        )}
      </div>
      
      {/* Base del panel */}
      <div className="panel-base"></div>
    </div>
  );
}

export default PanelCard;