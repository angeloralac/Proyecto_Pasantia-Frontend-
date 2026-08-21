import axios from 'axios'

let renovacionEnCurso = null; // Variable para controlar la renovación del token

const apiClient = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 10000, 
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// 1. Interceptor de Peticiones (Sale la petición)
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 2. Interceptor de Respuestas (Regresa la petición)
apiClient.interceptors.response.use(
  (response) => response, 
  async (error) => {
    // Guardamos la petición original que acaba de fallar
    const originalRequest = error.config;

    // Si el error es 401 (Token vencido) y no hemos intentado reintentar todavía
    if (
      error.response &&
      error.response.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true; // Marcamos la petición para evitar bucles infinitos

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        
        // Si por alguna razón no hay refresh token, no podemos hacer nada, vamos al login
        if (!refreshToken) {
          throw new Error('No hay refresh token disponible');
        }

        // Hacemos la petición de rescate (Nota: usamos axios nativo, no apiClient)
        // IMPORTANTE: Asegúrate de que esta URL apunte a tu ruta de refresh en el backend.
        // Si tus rutas de usuario tienen un prefijo como /usuarios, cámbialo a '/usuarios/refresh-token'
        if (!renovacionEnCurso) {
          renovacionEnCurso = axios.post('http://localhost:3000/users/refresh-token', {
            refreshToken: refreshToken
          }).then(({ data }) => data.token).finally(() => {
            renovacionEnCurso = null
          })
        }

        const nuevoToken = await renovacionEnCurso

        // ¡Rescate exitoso! Guardamos el token nuevecito (el de 15 minutos)
        localStorage.setItem('token', nuevoToken);

        // Le ponemos la nueva pulsera (token) a la petición que había fallado originalmente
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${nuevoToken}`;

        // Volvemos a lanzar la petición original sin que el usuario se dé cuenta
        return apiClient(originalRequest);

      } catch (refreshError) {
        // Si falló el rescate (ej. pasaron los 7 días y el Refresh Token también expiró)
        console.error('Sesión caducada por completo. Redirigiendo al login...');
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Si es otro error (ej. 404, 500) o ya intentamos el retry y falló, dejamos que siga su curso
    return Promise.reject(error);
  }
)

export default apiClient