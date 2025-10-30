import { fetchAPI, fetchConToken } from './apiCliente';

/**
 * Registrar un nuevo usuario
 */
export async function registrarUsuario(nombreUsuario, contrasena, codigoInvitacion = '') {
  const datos = await fetchAPI('/auth/registrar', {
    method: 'POST',
    body: { nombreUsuario, contrasena, codigoInvitacion },
  });
  
  return datos; // { token, usuario }
}

/**
 * Iniciar sesión
 */
export async function loginUsuario(nombreUsuario, contrasena) {
  const datos = await fetchAPI('/auth/login', {
    method: 'POST',
    body: { nombreUsuario, contrasena },
  });
  
  return datos; // { token, usuario }
}

/**
 * Validar token actual y obtener datos del usuario
 */
export async function validarToken() {
  // El backend podría tener un endpoint /auth/validar o podemos usar /progreso/estudiante
  // Como no especificaste un endpoint de validación, usaremos una estrategia simple:
  // Intentar cualquier endpoint protegido ligero. Si funciona, el token es válido.
  
  try {
    // Intentamos obtener el progreso del estudiante como validación
    const datos = await fetchConToken('/progreso/estudiante');
    
    // Si llegamos aquí, el token es válido
    // Necesitamos reconstruir el objeto usuario desde el token
    const token = localStorage.getItem('pixelvolt_token');
    if (!token) throw new Error('Token no encontrado');
    
    // Decodificar el payload del JWT (parte central base64)
    const payload = JSON.parse(atob(token.split('.')[1]));
    
    return {
      usuario: {
        id_usuario: payload.id_usuario,
        rol: payload.rol,
        puntos: datos.puntos || 0,
        nivelesCompletados: datos.nivelesCompletados || 0,
      }
    };
  } catch (error) {
    throw new Error('Token inválido o expirado');
  }
}
