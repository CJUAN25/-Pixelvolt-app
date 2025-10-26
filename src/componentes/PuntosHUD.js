import React, { useEffect, useMemo, useState } from 'react';
import './PuntosHUD.css';
import { useAuth } from '../contexto/ContextoAutenticacion';

// Componente HUD para mostrar puntos acumulados del usuario
// Lee desde localStorage la clave pixelvolt_progreso_<userId>
// Se actualiza cuando se dispara el evento window 'pixelvolt_progreso_update'
export default function PuntosHUD() {
  const { usuario } = useAuth();
  const userId = usuario?.id || 'anonimo';
  const [puntos, setPuntos] = useState(0);

  const claveProgreso = useMemo(() => `pixelvolt_progreso_${userId}`, [userId]);

  const cargar = () => {
    try {
      const guardado = localStorage.getItem(claveProgreso);
      if (guardado) {
        const data = JSON.parse(guardado);
        setPuntos(Number(data?.puntos || 0));
      } else {
        setPuntos(0);
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('PuntosHUD: error leyendo progreso:', e);
      setPuntos(0);
    }
  };

  useEffect(() => {
    cargar();
    const handler = () => cargar();
    window.addEventListener('pixelvolt_progreso_update', handler);
    return () => {
      window.removeEventListener('pixelvolt_progreso_update', handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [claveProgreso]);

  return (
    <div className="puntos-hud" aria-live="polite" title="Puntos acumulados">
      <span className="icono" aria-hidden>⭐</span>
      <span>Puntos: {puntos}</span>
    </div>
  );
}
