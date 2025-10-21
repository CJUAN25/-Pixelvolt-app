import React, { createContext, useContext, useState } from 'react';

// Crear el contexto de autenticación
const ContextoAutenticacion = createContext(null);

// Proveedor del contexto de autenticación
export const ProveedorAutenticacion = ({ children }) => {
  // Estado del usuario: { id, nombreUsuario, rol }
  const [usuario, setUsuario] = useState(null);

  // Función para iniciar sesión
  const iniciarSesion = (datosUsuario) => {
    setUsuario(datosUsuario);
  };

  // Función para cerrar sesión
  const cerrarSesion = () => {
    setUsuario(null);
  };

  // Valor del contexto que se compartirá
  const valor = {
    usuario,
    iniciarSesion,
    cerrarSesion
  };

  return (
    <ContextoAutenticacion.Provider value={valor}>
      {children}
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
