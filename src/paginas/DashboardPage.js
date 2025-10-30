import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexto/ContextoAutenticacion';
import GestorGrupos from '../caracteristicas/panel-control/GestorGrupos';
import VisorProgreso from '../caracteristicas/panel-control/VisorProgreso';
import './DashboardPage.css';

/**
 * Panel de Control del Docente
 * Dashboard principal para que los docentes gestionen grupos y vean progreso
 */
function DashboardPage() {
  const { usuario } = useAuth();
  const [activeTab, setActiveTab] = useState('groups'); // 'groups' | 'progress'

  // Si no es docente, no debería ver esta página (aunque ProtectedRoute ya lo maneja)
  if (usuario?.rol !== 'Docente') {
    return (
      <div className="dashboard-page">
        <div className="access-denied">
          <h1>⚠️ Acceso Denegado</h1>
          <p>Esta página es exclusiva para docentes.</p>
          <Link to="/laboratorio" className="back-link">← Volver al Laboratorio</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      {/* Header del Dashboard */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">Panel de Control del Docente</h1>
          <div className="user-badge">
            <span className="badge-label">DOCENTE:</span>
            <span className="badge-name">{usuario.nombreUsuario}</span>
          </div>
        </div>
        <Link to="/laboratorio" className="back-to-lab">
          ← Volver al Laboratorio
        </Link>
      </div>

      {/* Navegación por pestañas */}
      <div className="dashboard-nav">
        <button 
          className={`nav-tab ${activeTab === 'groups' ? 'active' : ''}`}
          onClick={() => setActiveTab('groups')}
        >
          <span className="tab-icon">👥</span>
          <span className="tab-text">Gestionar Grupos</span>
        </button>
        <button 
          className={`nav-tab ${activeTab === 'progress' ? 'active' : ''}`}
          onClick={() => setActiveTab('progress')}
        >
          <span className="tab-icon">📊</span>
          <span className="tab-text">Ver Progreso</span>
        </button>
      </div>

      {/* Contenido del Dashboard según la pestaña activa */}
      <div className="dashboard-content">
        {activeTab === 'groups' && <GestorGrupos />}
        {activeTab === 'progress' && <VisorProgreso />}
      </div>

      {/* Footer informativo */}
      <div className="dashboard-footer">
        <p className="footer-text">
          💡 Usa el Modo Sandbox para explorar todos los paneles y niveles desbloqueados
        </p>
      </div>
    </div>
  );
}

export default DashboardPage;
