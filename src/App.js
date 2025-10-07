import React, { useState } from 'react';
import './styles/global.css';
import AuthPage from './pages/AuthPage';
import LaboratoryPage from './pages/LaboratoryPage';
import SubthemePage from './pages/SubthemePage';

function App() {
  // Estado para controlar qué página mostrar
  const [currentPage, setCurrentPage] = useState('auth'); // 'auth' | 'laboratory' | 'subtheme'
  const [userData, setUserData] = useState(null);
  const [selectedPanel, setSelectedPanel] = useState(null);

  // Función para manejar login exitoso
  const handleLogin = (formData) => {
    console.log('Login exitoso:', formData);
    setUserData({
      username: formData.get('username') || 'ExploradorEstelar',
      loginTime: new Date()
    });
    setCurrentPage('laboratory');
  };

  // Función para manejar registro exitoso
  const handleRegister = (formData) => {
    console.log('Registro exitoso:', formData);
    setUserData({
      username: formData.get('username') || 'ExploradorEstelar',
      loginTime: new Date()
    });
    setCurrentPage('laboratory');
  };

  // Función para volver a la pantalla de autenticación
  const handleBackToAuth = () => {
    setCurrentPage('auth');
    setUserData(null);
    setSelectedPanel(null);
  };

  // Función para seleccionar un panel
  const handleSelectPanel = (panel) => {
    console.log('Panel seleccionado:', panel);
    if (panel.status === 'unlocked') {
      setSelectedPanel(panel);
      setCurrentPage('subtheme');
    }
  };

  // Función para volver al laboratorio desde subtemas
  const handleBackToLaboratory = () => {
    setCurrentPage('laboratory');
    setSelectedPanel(null);
  };

  // Función para iniciar un nivel específico
  const handleStartLevel = (panel, level) => {
    console.log('Iniciando nivel:', { panel, level });
    // TODO: Navegar a la página del nivel específico
    alert(`¡Próximamente! Nivel "${level.title}" del panel "${panel.title}"`);
  };

  return (
    <div className="App">
      {currentPage === 'auth' && (
        <AuthPage 
          onLogin={handleLogin}
          onRegister={handleRegister}
        />
      )}
      
      {currentPage === 'laboratory' && (
        <LaboratoryPage 
          userName={userData?.username}
          onBackToAuth={handleBackToAuth}
          onSelectPanel={handleSelectPanel}
        />
      )}

      {currentPage === 'subtheme' && (
        <SubthemePage 
          selectedPanel={selectedPanel}
          userName={userData?.username}
          onBackToLaboratory={handleBackToLaboratory}
          onStartLevel={handleStartLevel}
        />
      )}
    </div>
  );
}

export default App;
