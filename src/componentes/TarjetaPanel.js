import React from 'react';
import './TarjetaPanel.css';

function TarjetaPanel({ 
  titulo, 
  subtitulo, 
  estado, 
  icono, 
  descripcion, 
  alHacerClic,
  // Props en inglés para compatibilidad
  title,
  subtitle,
  status,
  icon,
  description,
  onClick
}) {
  // Usar props en español si están disponibles, sino usar inglés
  const tituloFinal = titulo || title;
  const subtituloFinal = subtitulo || subtitle;
  const iconoFinal = icono || icon;
  const descripcionFinal = descripcion || description;
  const clickHandler = alHacerClic || onClick;
  
  // Mapear estados de inglés a español
  let estadoFinal = estado || status;
  if (estadoFinal === 'unlocked') estadoFinal = 'desbloqueado';
  if (estadoFinal === 'locked') estadoFinal = 'bloqueado';
  if (estadoFinal === 'completed') estadoFinal = 'completado';

  const obtenerIconoEstado = () => {
    switch (estadoFinal) {
      case 'desbloqueado':
        return '🔓';
      case 'bloqueado':
        return '🔒';
      case 'completado':
        return '✓';
      default:
        return '🔒';
    }
  };

  const manejarClic = () => {
    console.log('🔵 TarjetaPanel - Click en tarjeta:', tituloFinal, '| Estado:', estadoFinal);
    if (estadoFinal === 'desbloqueado' || estadoFinal === 'completado') {
      console.log('🔵 TarjetaPanel - Llamando clickHandler');
      clickHandler?.();
    } else {
      console.log('🔵 TarjetaPanel - Panel bloqueado, no se ejecuta clickHandler');
    }
  };

  return (
    <div 
      className={`tarjeta-panel ${estadoFinal}`}
      onClick={manejarClic}
    >
      <div className="panel-vidrio">
        <div className="contenido-panel">
          {/* Icono principal del panel */}
          <div className="icono-panel">
            {iconoFinal || '⚡'}
          </div>
          
          {/* Título del panel */}
          <div className="titulo-panel">
            {tituloFinal}
            {subtituloFinal && (
              <div className="subtitulo-panel">
                {subtituloFinal}
              </div>
            )}
          </div>
          
          {/* Descripción opcional */}
          {descripcionFinal && (
            <div className="descripcion-panel">
              {descripcionFinal}
            </div>
          )}
        </div>
        
        {/* Estado del panel */}
        <div className="estado-panel">
          <span className="icono-estado">
            {obtenerIconoEstado()}
          </span>
        </div>
        
        {/* Overlay para paneles bloqueados */}
        {estadoFinal === 'bloqueado' && (
          <div className="overlay-panel">
            <div className="icono-candado">🔒</div>
          </div>
        )}
        
        {/* Efecto de energía para paneles desbloqueados */}
        {estadoFinal === 'desbloqueado' && (
          <div className="efecto-energia"></div>
        )}
      </div>
      
      {/* Base del panel */}
      <div className="base-panel"></div>
    </div>
  );
}

export default TarjetaPanel;
