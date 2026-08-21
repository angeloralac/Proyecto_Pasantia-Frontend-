import { ref } from 'vue';
import apiClient from '@/api/axios'; 

export function useCaja() {
  const cajaActiva = ref(null);
  const estaAbierta = ref(false);
  const historialCajas = ref([]);
  const cargando = ref(false);

  // 1. Verificar si hay una caja abierta al cargar la vista
  const verificarCajaAbierta = async () => {
    cargando.value = true;
    try {
      const token = localStorage.getItem('token');
      const respuesta = await apiClient.get('/caja/activa', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = respuesta.data;
      estaAbierta.value = data.cajaActiva;
      cajaActiva.value = data.cajaActiva ? data.caja : null;
    } catch (error) {
      console.error('Error al verificar el estado de la caja:', error);
    } finally {
      cargando.value = false;
    }
  };

  // 2. Abrir Caja
  const abrirCaja = async (montoInicial, usuarioId) => {
    try {
      const token = localStorage.getItem('token');
      const respuesta = await apiClient.post('/caja/abrir', 
        { monto_inicial: montoInicial, usuarioId: usuarioId },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      const data = respuesta.data;
      await verificarCajaAbierta();
      return { success: true, message: data.message };
    } catch (error) {
      console.error(error);
      return { 
        success: false, 
        message: error.response?.data?.error || 'Error al abrir la caja' 
      };
    }
  };

  // 3. Cerrar Caja (Corte)
  const cerrarCaja = async (cajaId, montoReal) => {
    try {
      const token = localStorage.getItem('token');
      const respuesta = await apiClient.put(`/caja/cerrar/${cajaId}`, 
        { monto_real: montoReal },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      const data = respuesta.data;
      await verificarCajaAbierta();
      return { success: true, corte: data.corte, message: data.message };
    } catch (error) {
      console.error(error);
      return { 
        success: false, 
        message: error.response?.data?.error || 'Error al cerrar la caja' 
      };
    }
  };

  // 4. Obtener Historial de Cortes
  const obtenerHistorial = async () => {
    cargando.value = true;
    try {
      const token = localStorage.getItem('token');
      const respuesta = await apiClient.get('/caja/historial', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      historialCajas.value = respuesta.data;
    } catch (error) {
      console.error('Error al obtener historial:', error);
    } finally {
      cargando.value = false;
    }
  };

  return {
    cajaActiva,
    estaAbierta,
    historialCajas,
    cargando,
    verificarCajaAbierta,
    abrirCaja,
    cerrarCaja,
    obtenerHistorial
  };
}