import { ref } from 'vue';
import apiClient from '@/api/axios';

export function useDashboard() {
  const cargando = ref(false);

  // Valores iniciales
  const metricasHoy = ref({ total: 0, cantidad: 0 });
  const metricasMes = ref({ totalMes: 0, esperado: 10000, porcentaje: 0 });
  const ventasRecientes = ref([]);

  // Asistente para agrupar facturas repetidas y contar los artículos
  const agruparFacturas = (datosRaw) => {
    const facturasAgrupadas = new Map();

    datosRaw.forEach(venta => {
      if (!facturasAgrupadas.has(venta.factura)) {
        facturasAgrupadas.set(venta.factura, { 
          ...venta, 
          total: parseFloat(venta.total || 0),
          cantidadArticulos: 1 
        });
      } else {
        const facturaExistente = facturasAgrupadas.get(venta.factura);
        facturaExistente.total += parseFloat(venta.total || 0);
        facturaExistente.cantidadArticulos += 1;
      }
    });

    return Array.from(facturasAgrupadas.values()).slice(0, 5);
  };

  const cargarMetricas = async () => {
    cargando.value = true;
    try {
      const respuesta = await apiClient.get('/ventas/metricas/dashboard');
      
      const datos = respuesta.data;

      // Repartimos el paquete JSON en nuestras variables reactivas
      metricasHoy.value = datos.hoy;
      metricasMes.value = datos.meta;
      ventasRecientes.value = agruparFacturas(datos.misVentasRaw);

    } catch (error) {
      console.error(error);
    } finally {
      cargando.value = false;
    }
  };

  // Formateador automático de moneda
  const formatearMoneda = (cantidad) => {
    return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: 'GTQ'
    }).format(cantidad || 0);
  };

  // Formateador de hora
  const formatearHora = (fechaISO) => {
    if (!fechaISO) return '';
    return new Date(fechaISO).toLocaleTimeString('es-GT', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return {
    cargando,
    metricasHoy,
    metricasMes,
    ventasRecientes,
    cargarMetricas,
    formatearMoneda,
    formatearHora
  };
}