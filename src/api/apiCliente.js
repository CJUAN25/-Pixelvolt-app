const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

/**
 * Cliente HTTP genérico para hacer peticiones a la API de PixelVolt
 */
export async function fetchAPI(endpoint, opciones = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const configuracion = {
    method: opciones.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...opciones.headers,
    },
  };

  if (opciones.body) {
    configuracion.body = JSON.stringify(opciones.body);
  }

  try {
    const respuesta = await fetch(url, configuracion);
    
    // Intentar parsear JSON incluso en errores
    let datos;
    try {
      datos = await respuesta.json();
    } catch {
      datos = { error: 'Respuesta inválida del servidor' };
    }

    if (!respuesta.ok) {
      throw new Error(datos.error || `Error ${respuesta.status}`);
    }

    return datos;
  } catch (error) {
    console.error('Error en fetchAPI:', error);
    throw error;
  }
}

/**
 * Cliente HTTP con autenticación (Bearer token)
 */
export async function fetchConToken(endpoint, opciones = {}) {
  const token = localStorage.getItem('pixelvolt_token');
  
  if (!token) {
    throw new Error('No hay sesión activa');
  }

  const opcionesConAuth = {
    ...opciones,
    headers: {
      ...opciones.headers,
      'Authorization': `Bearer ${token}`,
    },
  };

  return fetchAPI(endpoint, opcionesConAuth);
}
