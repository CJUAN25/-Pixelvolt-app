import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexto/ContextoAutenticacion';

/**
 * Componente para proteger rutas que requieren autenticación
 * Redirige a la página de login si el usuario no está autenticado
 */
const RutaProtegida = ({ children }) => {
  const { usuario } = useAuth();

  // Si no hay usuario autenticado, redirigir al login
  if (!usuario) {
    return <Navigate to="/" replace />;
  }

  // Si hay usuario autenticado, renderizar los componentes hijos
  return children;
};

export default RutaProtegida;
