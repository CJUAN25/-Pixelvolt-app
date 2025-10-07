import React, { useState } from 'react';
import './AuthPage.css';

function AuthPage({ onLogin, onRegister }) {
  const [currentView, setCurrentView] = useState('login');

  const toggleView = () => {
    setCurrentView(currentView === 'login' ? 'register' : 'login');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    if (currentView === 'login') {
      onLogin?.(formData);
    } else {
      onRegister?.(formData);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1 className="game-title">PixelVolt</h1>
          <div className="auth-tabs">
            <button 
              className={`tab-button ${currentView === 'login' ? 'active' : ''}`}
              onClick={() => setCurrentView('login')}
            >
              Iniciar Sesión
            </button>
            <button 
              className={`tab-button ${currentView === 'register' ? 'active' : ''}`}
              onClick={() => setCurrentView('register')}
            >
              Registrarse
            </button>
          </div>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {currentView === 'login' ? (
            <>
              <div className="input-group">
                <input
                  type="text"
                  name="username"
                  placeholder="Nombre de Usuario"
                  className="pixel-input"
                  required
                />
              </div>
              <div className="input-group">
                <input
                  type="password"
                  name="password"
                  placeholder="Contraseña"
                  className="pixel-input"
                  required
                />
              </div>
              <button type="submit" className="pixel-button primary">
                [ Iniciar Sesión ]
              </button>
            </>
          ) : (
            <>
              <div className="input-group">
                <input
                  type="text"
                  name="username"
                  placeholder="Nombre de Usuario"
                  className="pixel-input"
                  required
                />
              </div>
              <div className="input-group">
                <input
                  type="password"
                  name="password"
                  placeholder="Contraseña"
                  className="pixel-input"
                  required
                />
              </div>
              <div className="input-group">
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirmar Contraseña"
                  className="pixel-input"
                  required
                />
              </div>
              <button type="submit" className="pixel-button primary">
                [ Crear Cuenta ]
              </button>
            </>
          )}
        </form>

        <div className="auth-footer">
          {currentView === 'login' ? (
            <p className="toggle-text">
              ¿No tienes una cuenta? 
              <button className="link-button" onClick={toggleView}>
                ¡Regístrate!
              </button>
            </p>
          ) : (
            <p className="toggle-text">
              ¿Ya tienes cuenta? 
              <button className="link-button" onClick={toggleView}>
                Inicia Sesión
              </button>
            </p>
          )}
        </div>
      </div>

      {/* Elemento decorativo pixel */}
      <div className="pixel-decoration"></div>
    </div>
  );
}

export default AuthPage;