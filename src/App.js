import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import './estilos/global.css';
// Importar páginas - usando mix de versiones antiguas y nuevas durante la transición
import PaginaAutenticacion from './caracteristicas/autenticacion/PaginaAutenticacion';
import PaginaLaboratorio from './caracteristicas/laboratorio/PaginaLaboratorio';
import PaginaSubtema from './caracteristicas/subtema/PaginaSubtema';
import DashboardPage from './paginas/DashboardPage';
import RutaProtegida from './componentes/RutaProtegida';
import { useAuth } from './contexto/ContextoAutenticacion';

function App() {
  const navegar = useNavigate();
  const { cerrarSesion, usuario } = useAuth();
  const [panelSeleccionado, setPanelSeleccionado] = useState(null);

  // Función para volver a la pantalla de autenticación (logout)
  const manejarVolverAutenticacion = () => {
    cerrarSesion();
    navegar('/');
  };

  // Función para seleccionar un panel
  const manejarSeleccionarPanel = (panel) => {
    console.log('📍 App.js - Panel seleccionado:', panel);
    // Aceptar tanto 'estado' (español) como 'status' (inglés) para compatibilidad
    const estado = panel.estado || panel.status;
    console.log('📍 App.js - Estado del panel:', estado);
    if (estado === 'desbloqueado' || estado === 'unlocked' || estado === 'completado' || estado === 'completed') {
      console.log('📍 App.js - Navegando a /subtemas');
      setPanelSeleccionado(panel);
      navegar('/subtemas');
    } else {
      console.log('📍 App.js - Panel bloqueado, no se navega');
    }
  };

  // Función para volver al laboratorio desde subtemas
  const manejarVolverLaboratorio = () => {
    setPanelSeleccionado(null);
    navegar('/laboratorio');
  };

  // Función para iniciar un nivel específico
  const manejarIniciarNivel = (panel, level) => {
    console.log('Iniciando nivel:', { panel, level });
    // TODO: Navegar a la página del nivel específico
    alert(`¡Próximamente! Nivel "${level.title}" del panel "${panel.title}"`);
  };

  return (
    <div className="App">
      <Routes>
        {/* Ruta pública - Login/Registro */}
        <Route 
          path="/" 
          element={<PaginaAutenticacion />} 
        />
        
        {/* Rutas protegidas - Requieren autenticación */}
        <Route 
          path="/laboratorio" 
          element={
            <RutaProtegida>
              <PaginaLaboratorio 
                userName={usuario?.nombreUsuario}
                onBackToAuth={manejarVolverAutenticacion}
                onSelectPanel={manejarSeleccionarPanel}
              />
            </RutaProtegida>
          } 
        />
        
        <Route 
          path="/subtemas" 
          element={
            <RutaProtegida>
              <PaginaSubtema 
                selectedPanel={panelSeleccionado}
                userName={usuario?.nombreUsuario}
                onBackToLaboratory={manejarVolverLaboratorio}
                onStartLevel={manejarIniciarNivel}
              />
            </RutaProtegida>
          } 
        />
        
        {/* Ruta del Dashboard - Solo para docentes */}
        <Route 
          path="/dashboard" 
          element={
            <RutaProtegida>
              <DashboardPage />
            </RutaProtegida>
          } 
        />
      </Routes>
    </div>
  );
}

export default App;
