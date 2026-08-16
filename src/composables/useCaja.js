import { ref } from 'vue';

export function useCaja() {
  const cajaActiva = ref(null);
  const estaAbierta = ref(false);
  const historialCajas = ref([]);
  const cargando = ref(false);

  const baseUrl = 'http://localhost:3000/caja';

  // 1. Verificar si hay una caja abierta al cargar la vista
  const verificarCajaAbierta = async () => {
    cargando.value = true;
    try {
      const respuesta = await fetch(`${baseUrl}/activa`);
      if (respuesta.ok) {
        const data = await respuesta.json();
        estaAbierta.value = data.cajaActiva;
        cajaActiva.value = data.cajaActiva ? data.caja : null;
      }
    } catch (error) {
      console.error('Error al verificar el estado de la caja:', error);
    } finally {
      cargando.value = false;
    }
  };

  // 2. Abrir Caja
  const abrirCaja = async (montoInicial, usuarioId) => {
    try {
      const respuesta = await fetch(`${baseUrl}/abrir`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ monto_inicial: montoInicial, usuarioId: usuarioId })
      });

      const data = await respuesta.json();
      if (!respuesta.ok) throw new Error(data.error || 'Error al abrir la caja');

      await verificarCajaAbierta();
      return { success: true, message: data.message };
    } catch (error) {
      console.error(error);
      return { success: false, message: error.message };
    }
  };

  // 3. Cerrar Caja (Corte)
  const cerrarCaja = async (cajaId, montoReal) => {
    try {
      const respuesta = await fetch(`${baseUrl}/cerrar/${cajaId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ monto_real: montoReal })
      });

      const data = await respuesta.json();
      if (!respuesta.ok) throw new Error(data.error || 'Error al cerrar la caja');

      await verificarCajaAbierta();
      return { success: true, corte: data.corte, message: data.message };
    } catch (error) {
      console.error(error);
      return { success: false, message: error.message };
    }
  };

  // 4. Obtener Historial de Cortes
  const obtenerHistorial = async () => {
    cargando.value = true;
    try {
      const respuesta = await fetch(`${baseUrl}/historial`);
      if (respuesta.ok) {
        historialCajas.value = await respuesta.json();
      }
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