import React from 'react';
import './PuntosHUD.css';
import { useAuth } from '../contexto/ContextoAutenticacion';

// Componente HUD para mostrar puntos acumulados del usuario desde el contexto
export default function PuntosHUD() {
  const { usuario } = useAuth();
  const puntos = usuario?.puntos || 0;

  return (
    <div className="puntos-hud" aria-live="polite" title="Puntos acumulados">
      <span className="icono" aria-hidden>⭐</span>
      <span>Puntos: {puntos}</span>
    </div>
  );
}
