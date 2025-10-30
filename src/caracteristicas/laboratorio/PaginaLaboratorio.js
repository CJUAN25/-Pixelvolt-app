import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexto/ContextoAutenticacion';
import { fetchConToken } from '../../api/apiCliente';
import TarjetaPanel from '../../componentes/TarjetaPanel';
import PuntosHUD from '../../componentes/PuntosHUD';
import './PaginaLaboratorio.css';

// PaginaLaboratorio: versión en español del laboratorio
// Acepta props con los nombres antiguos para compatibilidad
function PaginaLaboratorio({ userName: nombreUsuario = 'ExploradorEstelar', onBackToAuth: alVolverAutenticacion, onSelectPanel: alSeleccionarPanel }) {
  const { usuario } = useAuth();
  const [progresoUsuario, setProgresoUsuario] = useState({ nivelesCompletados: {}, puntos: 0 });
  const [estaCargando, setEstaCargando] = useState(true);

  // Cargar progreso del usuario para desbloquear paneles
  useEffect(() => {
    async function cargarProgreso() {
      if (!usuario || usuario.rol === 'Docente') {
        setEstaCargando(false);
        return;
      }

      try {
        const data = await fetchConToken('/progreso/estudiante');
        if (data) {
          setProgresoUsuario(data);
        }
      } catch (e) {
        console.error('Error al cargar progreso:', e);
      } finally {
        setEstaCargando(false);
      }
    }

    cargarProgreso();
  }, [usuario]);

  // Datos de los paneles temáticos con cantidad de niveles por panel
  const panelesBase = [
    {
      id: 1,
      titulo: 'Chatarrería de Robots',
      subtitulo: '(Tutorial Narrativo)',
      icono: '🤖',
      estado: 'desbloqueado',
      descripcion: 'Aprende las mecánicas básicas de la interfaz mientras reparas a tu robot-tutor',
      cantidadNiveles: 1
    },
    {
      id: 2,
      titulo: 'Electricidad Básica',
      icono: '💡',
      estado: 'bloqueado',
      descripcion: 'Domina los fundamentos de la carga, la Ley de Ohm y los circuitos en serie y paralelo',
      cantidadNiveles: 5
    },
    {
      id: 3,
      titulo: 'Magnetismo',
      icono: '🧲',
      estado: 'bloqueado',
      descripcion: 'Explora los imanes, las líneas de campo magnético y el funcionamiento de la brújula',
      cantidadNiveles: 4
    },
    {
      id: 4,
      titulo: 'Inducción de Faraday',
      icono: '⚡',
      estado: 'bloqueado',
      descripcion: 'Descubre la relación entre magnetismo y electricidad, la Ley de Lenz y los generadores',
      cantidadNiveles: 4
    },
    {
      id: 5,
      titulo: 'Circuitos Complejos',
      subtitulo: '(RC, RL, RLC)',
      icono: '🔌',
      estado: 'bloqueado',
      descripcion: 'Analiza la carga y descarga de capacitores e inductores en circuitos avanzados',
      cantidadNiveles: 3
    },
    {
      id: 6,
      titulo: 'Corriente Alterna',
      subtitulo: '(CA) y Aplicaciones',
      icono: '∿',
      estado: 'bloqueado',
      descripcion: 'Aprende sobre la señal de CA y el principio de los transformadores y motores',
      cantidadNiveles: 5
    }
  ];

  // Función para verificar si un panel está completado
  const verificarPanelCompletado = (panelId) => {
    const panel = panelesBase.find(p => p.id === panelId);
    if (!panel) return false;

    const panelKey = String(panelId);
    const nivelesDelPanel = progresoUsuario.nivelesCompletados?.[panelKey];
    
    if (!nivelesDelPanel) return false;

    // Contar cuántos niveles están completados
    const nivelesCompletadosCount = Object.keys(nivelesDelPanel).length;
    return nivelesCompletadosCount >= panel.cantidadNiveles;
  };

  // Calcular estados de paneles basándose en el progreso
  const calcularEstadoPaneles = () => {
    if (usuario?.rol === 'Docente') {
      // Docentes: todos desbloqueados (modo sandbox)
      return panelesBase.map((p) => ({ ...p, estado: 'desbloqueado' }));
    }

    // Estudiantes: lógica de desbloqueo progresivo
    return panelesBase.map((panel, index) => {
      // Panel 1: siempre desbloqueado (tutorial)
      if (panel.id === 1) {
        const completado = verificarPanelCompletado(1);
        return { ...panel, estado: completado ? 'completado' : 'desbloqueado' };
      }

      // Panel 2: siempre desbloqueado (electricidad básica)
      if (panel.id === 2) {
        const completado = verificarPanelCompletado(2);
        return { ...panel, estado: completado ? 'completado' : 'desbloqueado' };
      }

      // Resto de paneles: se desbloquean al completar el anterior
      const panelAnteriorCompletado = verificarPanelCompletado(panel.id - 1);
      const esteCompletado = verificarPanelCompletado(panel.id);

      if (esteCompletado) {
        return { ...panel, estado: 'completado' };
      } else if (panelAnteriorCompletado) {
        return { ...panel, estado: 'desbloqueado' };
      } else {
        return { ...panel, estado: 'bloqueado' };
      }
    });
  };

  const paneles = calcularEstadoPaneles();

  const manejarClicPanel = (panel) => {
    console.log('🎯 Click en panel:', panel.titulo, '| Estado:', panel.estado);
    if (panel.estado === 'desbloqueado' || panel.estado === 'completado') {
      console.log('✅ Panel desbloqueado, llamando a alSeleccionarPanel');
      alSeleccionarPanel?.(panel);
    } else {
      console.log('❌ Panel bloqueado, no se puede seleccionar');
    }
  };

  return (
    <div className="laboratory-page">
      <PuntosHUD />
      {/* Header */}
      <div className="lab-header">
        <div className="user-info">
          <span className="user-label">USUARIO:</span>
          <span className="user-name">{nombreUsuario}</span>
        </div>
        <div className="lab-title">
          <h1>PIXELVOLT LABORATORY</h1>
          <button className="close-button" onClick={alVolverAutenticacion}>✖</button>
        </div>
      </div>

      {/* Layout principal */}
      <div className="lab-main-layout">
        {/* Columna Izquierda */}
        <div className="left-column">
          <div className="robot-section">
            <div className="robot-container">
              <img 
                src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI1MCIgdmlld0JveD0iMCAwIDIwMCAyNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjUwIiBmaWxsPSJ0cmFuc3BhcmVudCIvPgo8IS0tIENhYmV6YSBkZWwgcm9ib3QgLS0+CjxyZWN0IHg9IjUwIiB5PSIyMCIgd2lkdGg9IjEwMCIgaGVpZ2h0PSI4MCIgZmlsbD0iIzg4Y2NmZiIgc3Ryb2tlPSIjMDBmZmZmIiBzdHJva2Utd2lkdGg9IjIiLz4KPCEtLSBPam9zIC0tPgo8cmVjdCB4PSI2NSIgeT0iNDAiIHdpZHRoPSIxNSIgaGVpZ2h0PSIxNSIgZmlsbD0iIzAwZmZmZiIvPgo8cmVjdCB4PSIxMjAiIHk9IjQwIiB3aWR0aD0iMTUiIGhlaWdodD0iMTUiIGZpbGw9IiMwMGZmZmYiLz4KPCEtLSBCb2NhIC0tPgo8cmVjdCB4PSI4NSIgeT0iNzAiIHdpZHRoPSIzMCIgaGVpZ2h0PSI4IiBmaWxsPSIjMDBmZmZmIi8+CjwhLS0gQ3VlcnBvIC0tPgo8cmVjdCB4PSI0MCIgeT0iMTAwIiB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzg4Y2NmZiIgc3Ryb2tlPSIjMDBmZmZmIiBzdHJva2Utd2lkdGg9IjIiLz4KPCEtLSBQYW5lbCBkZWwgcGVjaG8gLS0+CjxyZWN0IHg9IjgwIiB5PSIxMjAiIHdpZHRoPSI0MCIgaGVpZ2h0PSIzMCIgZmlsbD0iIzAwNjZhYSIgc3Ryb2tlPSIjMDBmZmZmIiBzdHJva2Utd2lkdGg9IjEiLz4KPGNpcmNsZSBjeD0iMTAwIiBjeT0iMTM1IiByPSI1IiBmaWxsPSIjMDBmZmZmIi8+CjwhLS0gQnJhem9zIC0tPgo8cmVjdCB4PSIxMCIgeT0iMTEwIiB3aWR0aD0iMzAiIGhlaWdodD0iNjAiIGZpbGw9IiM4OGNjZmYiIHN0cm9rZT0iIzAwZmZmZiIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxyZWN0IHg9IjE2MCIgeT0iMTEwIiB3aWR0aD0iMzAiIGhlaWdodD0iNjAiIGZpbGw9IiM4OGNjZmYiIHN0cm9rZT0iIzAwZmZmZiIgc3Ryb2tlLXdpZHRoPSIyIi8+CjwhLS0gTWFub3MgLS0+CjxjaXJjbGUgY3g9IjI1IiBjeT0iMTgwIiByPSIxMiIgZmlsbD0iIzg4Y2NmZiIgc3Ryb2tlPSIjMDBmZmZmIiBzdHJva2Utd2lkdGg9IjIiLz4KPGNpcmNsZSBjeD0iMTc1IiBjeT0iMTgwIiByPSIxMiIgZmlsbD0iIzg4Y2NmZiIgc3Ryb2tlPSIjMDBmZmZmIiBzdHJva2Utd2lkdGg9IjIiLz4KPCEtLSBQaWVybmFzIC0tPgo8cmVjdCB4PSI2NSIgeT0iMjAwIiB3aWR0aD0iMjUiIGhlaWdodD0iNDAiIGZpbGw9IiM4OGNjZmYiIHN0cm9rZT0iIzAwZmZmZiIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxyZWN0IHg9IjExMCIgeT0iMjAwIiB3aWR0aD0iMjUiIGhlaWdodD0iNDAiIGZpbGw9IiM4OGNjZmYiIHN0cm9rZT0iIzAwZmZmZiIgc3Ryb2tlLXdpZHRoPSIyIi8+CjwhLS0gUGllcyAtLT4KPHJlY3QgeD0iNjAiIHk9IjI0MCIgd2lkdGg9IjM1IiBoZWlnaHQ9IjEwIiBmaWxsPSIjMDA2NmFhIiBzdHJva2U9IiMwMGZmZmYiIHN0cm9rZS13aWR0aD0iMSIvPgo8cmVjdCB4PSIxMDUiIHk9IjI0MCIgd2lkdGg9IjM1IiBoZWlnaHQ9IjEwIiBmaWxsPSIjMDA2NmFhIiBzdHJva2U9IiMwMGZmZmYiIHN0cm9rZS13aWR0aD0iMSIvPgo8L3N2Zz4K" 
                alt="Robot PixelVolt" 
                className="robot-image"
              />
            </div>
          </div>
        </div>

        {/* Columna Derecha */}
        <div className="right-column">
          <div className="panels-section">
            <div className="panels-grid">
              {paneles.map((panel) => (
                <TarjetaPanel
                  key={panel.id}
                  titulo={panel.titulo}
                  subtitulo={panel.subtitulo}
                  icono={panel.icono}
                  estado={panel.estado}
                  descripcion={panel.descripcion}
                  alHacerClic={() => manejarClicPanel(panel)}
                />
              ))}
            </div>
          </div>

          {/* Controles inferiores */}
          <div className="controls-section">
            <div className="lab-controls">
              {/* Botón de Panel de Control - Solo visible para Docentes */}
              {usuario?.rol === 'Docente' && (
                <Link to="/dashboard" className="control-button dashboard-button" style={{ textDecoration: 'none' }}>
                  <span className="button-text">PANEL DE CONTROL</span>
                </Link>
              )}
              
              <button className="control-button logout-button" onClick={alVolverAutenticacion}>
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

export default PaginaLaboratorio;
