import { ref } from 'vue';

export function useDashboard() {
  const cargando = ref(false);

  // Valores iniciales (en 0) para que tu vista no marque error mientras espera al servidor
  const metricasHoy = ref({ total: 0, cantidad: 0 });
  const metricasMes = ref({ totalMes: 0, esperado: 10000, porcentaje: 0 });
  const ventasRecientes = ref([]);

  // La nueva ruta que creamos en tu backend
  const baseUrl = 'http://localhost:3000/ventas';

  // Asistente para agrupar facturas repetidas y contar los artículos
  const agruparFacturas = (datosRaw) => {
    const facturasAgrupadas = new Map();

    datosRaw.forEach(venta => {
      if (!facturasAgrupadas.has(venta.factura)) {
        facturasAgrupadas.set(venta.factura, { 
          ...venta, 
          total: parseFloat(venta.total || 0),
          // Iniciamos el contador de líneas de artículos
          cantidadArticulos: 1 
        });
      } else {
        const facturaExistente = facturasAgrupadas.get(venta.factura);
        facturaExistente.total += parseFloat(venta.total || 0);
        facturaExistente.cantidadArticulos += 1;
      }
    });

    // Devolvemos el arreglo, pero cortamos (slice) solo los primeros 5 registros para no saturar tu dashboard
    return Array.from(facturasAgrupadas.values()).slice(0, 5);
  };

  const cargarMetricas = async () => {
    cargando.value = true;
    try {
      const respuesta = await fetch(`${baseUrl}/metricas/dashboard`); 
      if (!respuesta.ok) throw new Error('Error al obtener datos del dashboard');
      
      const datos = await respuesta.json();

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

  // Formateador automático para que el dinero salga como "Q 1,250.00"
  const formatearMoneda = (cantidad) => {
    return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: 'GTQ'
    }).format(cantidad || 0);
  };

  // Formateador para sacar solo la hora ("10:15 AM") del createdAt de la base de datos
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