import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { validarToken } from '../api/servicioAutenticacion';

// Crear el contexto de autenticación
const ContextoAutenticacion = createContext(null);

// Proveedor del contexto de autenticación
export const ProveedorAutenticacion = ({ children }) => {
  // Estado del usuario: { id_usuario, nombre_usuario, rol, puntos, nivelesCompletados }
  const [usuario, setUsuario] = useState(null);
  const [estaCargando, setEstaCargando] = useState(true);

  // Función para iniciar sesión - ahora acepta { usuario, token }
  const iniciarSesion = ({ usuario, token }) => {
    localStorage.setItem('pixelvolt_token', token);
    setUsuario(usuario);
  };

  // Función para cerrar sesión
  const cerrarSesion = () => {
    localStorage.removeItem('pixelvolt_token');
    setUsuario(null);
  };

  // Efecto para cargar y validar el token al iniciar
  useEffect(() => {
    async function cargarUsuario() {
      try {
        const token = localStorage.getItem('pixelvolt_token');
        
        if (!token) {
          setEstaCargando(false);
          return;
        }

        // Validar el token y obtener datos del usuario
        const { usuario } = await validarToken();
        setUsuario(usuario);
      } catch (error) {
        console.error('Error al validar token:', error);
        // Token inválido o expirado, cerrar sesión
        cerrarSesion();
      } finally {
        setEstaCargando(false);
      }
    }

    cargarUsuario();
  }, []);

  // Valor del contexto que se compartirá
  const valor = useMemo(() => ({
    usuario,
    estaCargando,
    iniciarSesion,
    cerrarSesion,
    setUsuario
  }), [usuario, estaCargando]);

  return (
    <ContextoAutenticacion.Provider value={valor}>
      {!estaCargando && children}
    </ContextoAutenticacion.Provider>
  );
};

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => {
  const contexto = useContext(ContextoAutenticacion);
  if (!contexto) {
    throw new Error('useAuth debe ser usado dentro de un ProveedorAutenticacion');
  }
  return contexto;
};

export default ContextoAutenticacion;
