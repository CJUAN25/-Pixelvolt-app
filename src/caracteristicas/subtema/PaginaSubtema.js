import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexto/ContextoAutenticacion';
import { fetchConToken } from '../../api/apiCliente';
import { useNavigate } from 'react-router-dom';
import './PaginaSubtema.css';
import PuntosHUD from '../../componentes/PuntosHUD';

function PaginaSubtema({ selectedPanel: panelSeleccionado, userName: nombreUsuario, onBackToLaboratory: alVolverLaboratorio }) {
  const [nivelSeleccionado, setNivelSeleccionado] = useState(null);
  const { usuario } = useAuth();
  const navegar = useNavigate();
  const userId = usuario?.id_usuario || usuario?.id || 'anonimo';
  const [progresoUsuario, setProgresoUsuario] = useState({ nivelesCompletados: {}, puntos: 0 });
  const [estaCargandoProgreso, setEstaCargandoProgreso] = useState(false);

  useEffect(() => {
    async function cargarProgreso() {
      setEstaCargandoProgreso(true);
      try {
        const data = await fetchConToken('/progreso/estudiante');
        // data esperado: { nivelesCompletados, puntos }
        if (data) setProgresoUsuario(data);
      } catch (e) {
        console.error('Error al cargar progreso desde API:', e);
      } finally {
        setEstaCargandoProgreso(false);
      }
    }
    if (userId && userId !== 'anonimo') {
      cargarProgreso();
    }
  }, [userId]);

  const subtemasPorPanel = {
    // Panel 1: Chatarrería (Tutorial)
    1: {
      titulo: 'Chatarrería de Robots',
      subtitulo: '(Tutorial Narrativo)',
      icono: '🤖',
      niveles: [
        {
          id: 1, // ID secuencial dentro del panel
          titulo: 'Reparación Inicial',
          estado: 'desbloqueado', // Primer nivel desbloqueado
          descripcion: 'Aprende a usar la interfaz arrastrando y conectando componentes básicos para reparar al robot.',
          objetivo: 'Familiarizarse con las mecánicas de arrastrar, soltar y conectar.'
        }
        // Se pueden añadir más pasos del tutorial en el futuro
      ]
    },

    // Panel 2: Electricidad Básica
    2: {
      titulo: 'Electricidad Básica',
      subtitulo: '',
      icono: '💡',
      niveles: [
        { id: 1, titulo: 'Naturaleza de la Carga', estado: 'desbloqueado', descripcion: 'Explora cómo interactúan las cargas positivas y negativas.', objetivo: 'Demostrar atracción y repulsión.' },
        { id: 2, titulo: 'Componentes Básicos', estado: 'bloqueado', descripcion: 'Identifica y usa resistencias y bombillas en un circuito simple.', objetivo: 'Conectar correctamente componentes básicos.' },
        { id: 3, titulo: 'Ley de Ohm', estado: 'bloqueado', descripcion: 'Descubre la relación entre Voltaje, Corriente y Resistencia.', objetivo: 'Calcular un valor usando la Ley de Ohm.' },
        { id: 4, titulo: 'Circuito en Serie', estado: 'bloqueado', descripcion: 'Conecta bombillas una después de la otra y observa cómo comparten energía. Lograr luz tenue', objetivo: 'Construir y analizar un circuito en serie.' },
        { id: 5, titulo: 'Circuito en Paralelo', estado: 'bloqueado', descripcion: 'Conecta dos bombillas en caminos separados (paralelo) y observa cómo cada una recibe la energía completa.', objetivo: 'Construir y analizar un circuito en paralelo.' }
      ]
    },

    // Panel 3: Magnetismo
    3: {
      titulo: 'Magnetismo',
      subtitulo: '',
      icono: '🧲',
      niveles: [
        { id: 1, titulo: 'Imanes y Polos', estado: 'bloqueado', descripcion: 'Observa la interacción entre polos magnéticos.', objetivo: 'Identificar polos N/S y su atracción/repulsión.' },
        { id: 2, titulo: 'Líneas de Campo Magnético', estado: 'bloqueado', descripcion: 'Visualiza cómo se distribuyen las líneas de campo alrededor de un imán.', objetivo: 'Mapear las líneas de campo.' },
        { id: 3, titulo: 'Funcionamiento de la Brújula', estado: 'bloqueado', descripcion: 'Entiende cómo una brújula se alinea con un campo magnético.', objetivo: 'Orientar una brújula virtual.' },
        { id: 4, titulo: 'Fuerza Magnética por Corriente', estado: 'bloqueado', descripcion: 'Observa el efecto magnético generado por una corriente eléctrica.', objetivo: 'Detectar el campo magnético de un cable con corriente.' }
      ]
    },

    // Panel 4: Inducción de Faraday
    4: {
      titulo: 'Inducción de Faraday',
      subtitulo: '',
      icono: '⚡',
      niveles: [
        { id: 1, titulo: 'Flujo Magnético', estado: 'bloqueado', descripcion: 'Comprende qué es el flujo magnético y cómo varía.', objetivo: 'Calcular o visualizar el cambio de flujo.' },
        { id: 2, titulo: 'FEM Inducida (Experimento)', estado: 'bloqueado', descripcion: 'Realiza el experimento virtual de Faraday para generar corriente.', objetivo: 'Inducir corriente moviendo un imán cerca de una bobina.' },
        { id: 3, titulo: 'Ley de Lenz', estado: 'bloqueado', descripcion: 'Observa la dirección de la corriente inducida y su oposición al cambio.', objetivo: 'Predecir la dirección de la corriente inducida.' },
        { id: 4, titulo: 'Generadores Simples', estado: 'bloqueado', descripcion: 'Construye un generador simple y observa cómo produce electricidad.', objetivo: 'Generar electricidad mediante rotación en un campo magnético.' }
      ]
    },

    // Panel 5: Circuitos Complejos
    5: {
      titulo: 'Circuitos Complejos',
      subtitulo: '(RC, RL, RLC)',
      icono: '🔌',
      niveles: [
        { id: 1, titulo: 'Circuitos RC (Carga/Descarga)', estado: 'bloqueado', descripcion: 'Analiza cómo se carga y descarga un capacitor a través de una resistencia.', objetivo: 'Observar la curva de carga/descarga.' },
        { id: 2, titulo: 'Circuitos RL', estado: 'bloqueado', descripcion: 'Estudia la respuesta de un inductor en un circuito con resistencia.', objetivo: 'Observar el comportamiento del inductor ante cambios de corriente.' },
        { id: 3, titulo: 'Circuitos RLC (Introducción)', estado: 'bloqueado', descripcion: 'Introduce el concepto de resonancia en circuitos con R, L y C.', objetivo: 'Identificar la frecuencia de resonancia (conceptual).' }
      ]
    },

    // Panel 6: Corriente Alterna (CA)
    6: {
      titulo: 'Corriente Alterna',
      subtitulo: '(CA) y Aplicaciones',
      icono: '∿',
      niveles: [
        { id: 1, titulo: 'Conceptos CA vs CC', estado: 'bloqueado', descripcion: 'Compara las diferencias fundamentales entre corriente alterna y continua.', objetivo: 'Identificar señales CA y CC.' },
        { id: 2, titulo: 'Parámetros de Señal CA', estado: 'bloqueado', descripcion: 'Aprende sobre amplitud, frecuencia y fase en señales de CA.', objetivo: 'Medir parámetros básicos de una señal CA.' },
        { id: 3, titulo: 'Circuitos Básicos en CA', estado: 'bloqueado', descripcion: 'Observa cómo se comportan R, L y C con corriente alterna.', objetivo: 'Analizar circuitos simples en CA.' },
        { id: 4, titulo: 'Transformadores', estado: 'bloqueado', descripcion: 'Entiende el principio de funcionamiento de un transformador.', objetivo: 'Simular la transformación de voltaje.' },
        { id: 5, titulo: 'Motores Simples (Principio)', estado: 'bloqueado', descripcion: 'Visualiza cómo la CA puede generar movimiento en un motor.', objetivo: 'Observar el principio básico de un motor de CA.' }
      ]
    },
  };

  const panelActual = subtemasPorPanel[panelSeleccionado?.id] || subtemasPorPanel[2];

  // Calcular estados en base al progreso del usuario
  const nivelesCalculados = panelActual.niveles.map((nivel, index) => {
    const panelIdString = String(panelSeleccionado?.id || 2);
    const nivelIdString = String(nivel.id);
    const estaCompletado = !!progresoUsuario.nivelesCompletados?.[panelIdString]?.[nivelIdString];

    let estadoDeterminado = 'bloqueado';
    if (estaCompletado) {
      estadoDeterminado = 'completado';
    } else if (index === 0) {
      estadoDeterminado = 'desbloqueado';
    } else {
      const nivelAnteriorIdString = String(panelActual.niveles[index - 1].id);
      const anteriorCompletado = !!progresoUsuario.nivelesCompletados?.[panelIdString]?.[nivelAnteriorIdString];
      if (anteriorCompletado) estadoDeterminado = 'desbloqueado';
    }

    return { ...nivel, estado: estadoDeterminado };
  });

  const nivelesActuales = usuario?.rol === 'Docente'
    ? nivelesCalculados.map(n => ({ ...n, estado: 'desbloqueado' }))
    : nivelesCalculados;

  const manejarClickNivel = (nivel) => {
    if (nivel.estado === 'desbloqueado') {
      setNivelSeleccionado(nivel);
    }
  };

  // Nota: función no usada eliminada para evitar warnings de ESLint.

  // Reemplaza el alert "¡Próximamente!" por esta función
  const manejarEmpezarNivel = () => {
    // Derivar los IDs desde el panel seleccionado y el nivel elegido
    const panelId = String(panelSeleccionado?.id || nivelSeleccionado?.panelId || 2);
    const nivelId = String(nivelSeleccionado?.id || nivelSeleccionado?.nivelId || 1);

    if (!panelId || !nivelId) {
      console.error('Faltan ids de panel o nivel', { panelId, nivelId, nivelSeleccionado, panelSeleccionado });
      return;
    }
    // Navegar usando IDs simples para compatibilidad con la carga por panel
    navegar(`/juego/${panelId}/${nivelId}`);
  };

  return (
    <div className="subtheme-page">
      <PuntosHUD />
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
                      {nivel.estado === 'completado' ? '✔️' : (nivel.estado === 'desbloqueado' ? '🔓' : '🔒')}
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
                  onClick={manejarEmpezarNivel}
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
