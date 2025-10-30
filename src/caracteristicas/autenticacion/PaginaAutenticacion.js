import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexto/ContextoAutenticacion';
import { loginUsuario, registrarUsuario } from '../../api/servicioAutenticacion';
import './PaginaAutenticacion.css';

function PaginaAutenticacion() {
  const [vistaActual, setVistaActual] = useState('login');
  const [estaCargando, setEstaCargando] = useState(false);
  const [errorApi, setErrorApi] = useState(null);
  const { iniciarSesion } = useAuth();
  const navegar = useNavigate();

  const alternarVista = () => {
    setVistaActual(vistaActual === 'login' ? 'registro' : 'login');
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setEstaCargando(true);
    setErrorApi(null);

    const datosFormulario = new FormData(e.target);
    const nombreUsuario = datosFormulario.get('username');
    const contrasena = datosFormulario.get('password');
    
    try {
      if (vistaActual === 'login') {
        // Login real con API
        const respuesta = await loginUsuario(nombreUsuario, contrasena);
        console.log('🔐 Login exitoso:', respuesta.usuario);
        iniciarSesion(respuesta);
        navegar('/laboratorio');
      } else {
        // Registro real con API
        const confirmarContrasena = datosFormulario.get('confirmPassword');
        const codigoInvitacion = datosFormulario.get('codigoInvitacion') || '';
        
        // Validar que las contraseñas coincidan
        if (contrasena !== confirmarContrasena) {
          setErrorApi('Las contraseñas no coinciden');
          return;
        }
        
        const respuesta = await registrarUsuario(nombreUsuario, contrasena, codigoInvitacion);
        console.log('📝 Registro exitoso:', respuesta.usuario);
        iniciarSesion(respuesta);
        navegar('/laboratorio');
      }
    } catch (error) {
      console.error('Error en autenticación:', error);
      setErrorApi(error.message || 'Error al procesar la solicitud');
    } finally {
      setEstaCargando(false);
    }
  };

  return (
    <div className="pagina-autenticacion">
      <div className="contenedor-autenticacion">
        <div className="encabezado-autenticacion">
          <h1 className="titulo-juego">PixelVolt</h1>
          <div className="pestanas-autenticacion">
            <button 
              className={`boton-pestana ${vistaActual === 'login' ? 'activo' : ''}`}
              onClick={() => setVistaActual('login')}
            >
              Iniciar Sesión
            </button>
            <button 
              className={`boton-pestana ${vistaActual === 'registro' ? 'activo' : ''}`}
              onClick={() => setVistaActual('registro')}
            >
              Registrarse
            </button>
          </div>
        </div>

        <form className="formulario-autenticacion" onSubmit={manejarEnvio}>
          {errorApi && (
            <div style={{ 
              color: '#ff6b6b', 
              backgroundColor: 'rgba(255, 107, 107, 0.1)', 
              padding: '10px', 
              marginBottom: '15px',
              border: '1px solid #ff6b6b',
              borderRadius: '4px',
              fontSize: '12px'
            }}>
              {errorApi}
            </div>
          )}
          
          {vistaActual === 'login' ? (
            <>
              <div className="grupo-entrada">
                <input
                  type="text"
                  name="username"
                  placeholder="Nombre de Usuario"
                  className="entrada-pixel"
                  disabled={estaCargando}
                  required
                />
              </div>
              <div className="grupo-entrada">
                <input
                  type="password"
                  name="password"
                  placeholder="Contraseña"
                  className="entrada-pixel"
                  disabled={estaCargando}
                  required
                />
              </div>
              <button type="submit" className="boton-pixel primario" disabled={estaCargando}>
                {estaCargando ? '[ Cargando... ]' : '[ Iniciar Sesión ]'}
              </button>
            </>
          ) : (
            <>
              <div className="grupo-entrada">
                <input
                  type="text"
                  name="username"
                  placeholder="Nombre de Usuario"
                  className="entrada-pixel"
                  disabled={estaCargando}
                  required
                />
              </div>
              <div className="grupo-entrada">
                <input
                  type="password"
                  name="password"
                  placeholder="Contraseña"
                  className="entrada-pixel"
                  disabled={estaCargando}
                  required
                />
              </div>
              <div className="grupo-entrada">
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirmar Contraseña"
                  className="entrada-pixel"
                  disabled={estaCargando}
                  required
                />
              </div>
              <div className="grupo-entrada">
                <input
                  type="text"
                  name="codigoInvitacion"
                  placeholder="Código de Invitación (Opcional)"
                  className="entrada-pixel"
                  disabled={estaCargando}
                />
                <small style={{ color: 'var(--texto-secundario)', fontSize: '8px', marginTop: '5px', display: 'block' }}>
                  Usa "PROFESOR2025" para registrarte como Docente
                </small>
              </div>
              <button type="submit" className="boton-pixel primario" disabled={estaCargando}>
                {estaCargando ? '[ Cargando... ]' : '[ Crear Cuenta ]'}
              </button>
            </>
          )}
        </form>

        <div className="pie-autenticacion">
          {vistaActual === 'login' ? (
            <p className="texto-alternar">
              ¿No tienes una cuenta? 
              <button className="boton-enlace" onClick={alternarVista}>
                ¡Regístrate!
              </button>
            </p>
          ) : (
            <p className="texto-alternar">
              ¿Ya tienes cuenta? 
              <button className="boton-enlace" onClick={alternarVista}>
                Inicia Sesión
              </button>
            </p>
          )}
        </div>
      </div>

      {/* Elemento decorativo pixel */}
      <div className="decoracion-pixel"></div>
    </div>
  );
}

export default PaginaAutenticacion;
