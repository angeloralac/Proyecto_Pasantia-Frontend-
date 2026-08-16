import { ref } from 'vue';

export function useVentas() {
  // Estados reactivos
  const ventas = ref([]);
  const topArticulos = ref([]); 
  const cargando = ref(false);
  
  // Variables para las búsquedas y filtros
  const terminoFactura = ref('');
  const fechaInicio = ref('');
  const fechaFin = ref('');

  // Ruta principal de tu API
  const baseUrl = 'http://localhost:3000/ventas';

  // Función para agrupar facturas repetidas y sumar sus totales
  const agruparFacturas = (datosRaw) => {
    const facturasAgrupadas = new Map();
    datosRaw.forEach(venta => {
      if (!facturasAgrupadas.has(venta.factura)) {
        facturasAgrupadas.set(venta.factura, { 
          ...venta, 
          total: parseFloat(venta.total || 0) 
        });
      } else {
        const facturaExistente = facturasAgrupadas.get(venta.factura);
        facturaExistente.total += parseFloat(venta.total || 0);
      }
    });

    return Array.from(facturasAgrupadas.values());
  };

  // NUEVA FUNCIÓN: Obtener Top de Artículos
  const obtenerTopArticulos = async (inicio = null, fin = null) => {
    try {
      let url = `${baseUrl}/top-articulos`;
      if (inicio && fin) {
        url += `?fechaInicio=${inicio}&fechaFin=${fin}`;
      }
      const respuesta = await fetch(url);
      if (respuesta.ok) topArticulos.value = await respuesta.json();
    } catch (error) {
      console.error('Error al obtener top:', error);
    }
  };


  // Ejecuta: router.get('/ultimasventas', getUltimasVentas);
  const obtenerUltimasVentas = async () => {
    cargando.value = true;
    try {
      const respuesta = await fetch(`${baseUrl}/ultimasventas`); 
      if (!respuesta.ok) throw new Error('Error al obtener últimas ventas');
      ventas.value = agruparFacturas(await respuesta.json()); 
      
      // Llamamos al top para que se cargue al entrar a la pantalla
      await obtenerTopArticulos(); 
    } catch (error) {
      console.error(error);
    } finally {
      cargando.value = false;
    }
  };

  // Trae TODO el historial ignorando los filtros
  const obtenerTodasLasVentas = async () => {
    cargando.value = true;
    try {
      const respuesta = await fetch(baseUrl);
      if (!respuesta.ok) throw new Error('Error al obtener el historial completo');
      ventas.value = agruparFacturas(await respuesta.json()); 
      
      // Actualizamos el top general
      await obtenerTopArticulos(); 
    } catch (error) {
      console.error(error);
    } finally {
      cargando.value = false;
    }
  };

  // Ejecuta: router.get('/factura/:factura', getVentaByFactura);
  const buscarPorFactura = async () => {
    if (!terminoFactura.value) return; 
    cargando.value = true;
    try {
      const respuesta = await fetch(`${baseUrl}/factura/${terminoFactura.value}`); 
      if (!respuesta.ok) {
        ventas.value = [];
        throw new Error('Factura no encontrada');
      }
      ventas.value = agruparFacturas(await respuesta.json()); 
    } catch (error) {
      console.error(error);
    } finally {
      cargando.value = false;
    }
  };

  // NUEVA FUNCIÓN: Busca por el rango de fechas (Desde - Hasta)
  const buscarPorRango = async () => {
    if (!fechaInicio.value || !fechaFin.value) return;

    cargando.value = true;
    try {
      // Aseguramos que abarque desde las 00:00 del primer día hasta las 23:59 del último
      const inicio = `${fechaInicio.value}T00:00:00`;
      const fin = `${fechaFin.value}T23:59:59`;

      const respuesta = await fetch(`${baseUrl}?fechaInicio=${inicio}&fechaFin=${fin}`); 
      if (!respuesta.ok) {
        ventas.value = [];
        throw new Error('No se encontraron ventas en este rango de fechas');
      }
      ventas.value = agruparFacturas(await respuesta.json()); 
      
      // Filtramos también el top con las mismas fechas
      await obtenerTopArticulos(inicio, fin);
    } catch (error) {
      console.error(error);
    } finally {
      cargando.value = false;
    }
  };

  const limpiarFiltros = () => {
    terminoFactura.value = '';
    fechaInicio.value = '';
    fechaFin.value = '';
    obtenerUltimasVentas(); 
  };

  const formatearFecha = (fechaISO) => {
    if (!fechaISO) return 'Sin fecha';
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString('es-GT', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit'
    }); 
  };

  return {
    ventas,
    topArticulos, 
    cargando,
    terminoFactura,
    fechaInicio,
    fechaFin,
    obtenerUltimasVentas,
    obtenerTodasLasVentas,
    buscarPorFactura,
    buscarPorRango,
    limpiarFiltros,
    formatearFecha,
  };
}