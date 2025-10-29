import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexto/ContextoAutenticacion';
import './PaginaAutenticacion.css';

function PaginaAutenticacion() {
  const [vistaActual, setVistaActual] = useState('login');
  const { iniciarSesion } = useAuth();
  const navegar = useNavigate();

  const alternarVista = () => {
    setVistaActual(vistaActual === 'login' ? 'registro' : 'login');
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    const datosFormulario = new FormData(e.target);
    
    // Extraer valores del formulario
    const nombreUsuario = datosFormulario.get('username');
    const contrasena = datosFormulario.get('password');
    
    if (vistaActual === 'login') {
      // Simulación de login - En producción, esto llamaría a la API
      try {
        // Buscar usuario guardado en localStorage
        const usuariosGuardados = JSON.parse(localStorage.getItem('pixelvolt_usuarios') || '{}');
        const usuarioGuardado = usuariosGuardados[nombreUsuario];
        
        // Si el usuario existe, usar su rol guardado; si no, asignar Estudiante por defecto
        const rol = usuarioGuardado?.rol || 'Estudiante';
        
        const datosUsuario = {
          id: usuarioGuardado?.id || Date.now().toString(),
          nombreUsuario: nombreUsuario,
          rol: rol
        };
        
        console.log('🔐 Login exitoso:', datosUsuario);
        iniciarSesion(datosUsuario);
        navegar('/laboratorio');
      } catch (error) {
        console.error('Error en login:', error);
        alert('Error al iniciar sesión. Por favor, intenta de nuevo.');
      }
    } else {
      // Lógica de registro con código de invitación
      const confirmarContrasena = datosFormulario.get('confirmPassword');
      const codigoInvitacion = datosFormulario.get('codigoInvitacion');
      
      // Validar que las contraseñas coincidan
      if (contrasena !== confirmarContrasena) {
        alert('Las contraseñas no coinciden');
        return;
      }
      
      try {
        // Simulación de registro - Determinar rol según código de invitación
        let rol = 'Estudiante'; // Rol por defecto
        
        // RF-010: Código de invitación para docentes
        if (codigoInvitacion === 'PROFESOR2025') {
          rol = 'Docente';
        }
        
        const datosUsuario = {
          id: Date.now().toString(),
          nombreUsuario: nombreUsuario,
          rol: rol
        };
        
        // Guardar usuario en localStorage para recordar el rol
        const usuariosGuardados = JSON.parse(localStorage.getItem('pixelvolt_usuarios') || '{}');
        usuariosGuardados[nombreUsuario] = {
          id: datosUsuario.id,
          rol: rol
        };
        localStorage.setItem('pixelvolt_usuarios', JSON.stringify(usuariosGuardados));
        
        console.log('📝 Registro exitoso:', datosUsuario);
        iniciarSesion(datosUsuario);
        navegar('/laboratorio');
      } catch (error) {
        console.error('Error en registro:', error);
        alert('Error al registrarse. Por favor, intenta de nuevo.');
      }
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
          {vistaActual === 'login' ? (
            <>
              <div className="grupo-entrada">
                <input
                  type="text"
                  name="username"
                  placeholder="Nombre de Usuario"
                  className="entrada-pixel"
                  required
                />
              </div>
              <div className="grupo-entrada">
                <input
                  type="password"
                  name="password"
                  placeholder="Contraseña"
                  className="entrada-pixel"
                  required
                />
              </div>
              <button type="submit" className="boton-pixel primario">
                [ Iniciar Sesión ]
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
                  required
                />
              </div>
              <div className="grupo-entrada">
                <input
                  type="password"
                  name="password"
                  placeholder="Contraseña"
                  className="entrada-pixel"
                  required
                />
              </div>
              <div className="grupo-entrada">
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirmar Contraseña"
                  className="entrada-pixel"
                  required
                />
              </div>
              <div className="grupo-entrada">
                <input
                  type="text"
                  name="codigoInvitacion"
                  placeholder="Código de Invitación (Opcional)"
                  className="entrada-pixel"
                />
                <small style={{ color: 'var(--texto-secundario)', fontSize: '8px', marginTop: '5px', display: 'block' }}>
                  Usa "PROFESOR2025" para registrarte como Docente
                </small>
              </div>
              <button type="submit" className="boton-pixel primario">
                [ Crear Cuenta ]
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
