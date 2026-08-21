import { ref } from 'vue';
import apiClient from '@/api/axios';


export function useVentas() {
  // Estados reactivos
  const ventas = ref([]);
  const topArticulos = ref([]); 
  const ventasDetalladas = ref([]); // NUEVO: Almacena el desglose por factura
  const cargando = ref(false);
  
  // Variables para las búsquedas y filtros
  const terminoFactura = ref('');
  const terminoFacturaDetalle = ref(''); // NUEVO: Buscador exclusivo para la pestaña de detalles
  const fechaInicio = ref('');
  const fechaFin = ref('');

  // Ruta principal de tu API
  const baseUrl = 'http://localhost:3000/ventas';

  // Función para agrupar facturas repetidas y sumar sus totales (Historial General)
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

  // NUEVA FUNCIÓN: Obtener detalles de ventas (las últimas 3 o una específica)
  const obtenerVentasDetalladas = async (factura = null) => {
    cargando.value = true;
    try {
      const url = `${baseUrl}/detalles/ultimas`;
      if (factura) url += `?factura=${factura}`;
      
      const respuesta = await apiClient.get(url);
      
      ventasDetalladas.value = agruparDetalles(respuesta.data);
    } catch (error) {
      console.error(error);
      ventasDetalladas.value = [];
    } finally {
      cargando.value = false;
    }
  };

  // Función: Obtener Top de Artículos
  const obtenerTopArticulos = async (inicio = null, fin = null) => {
    try {
      const url = `${baseUrl}/top-articulos`;
      if (inicio && fin) {
        url += `?fechaInicio=${inicio}&fechaFin=${fin}`;
      }
      const respuesta = await apiClient.get(url);
      topArticulos.value = respuesta.data;
    } catch (error) {
      console.error('Error al obtener top:', error);
    }
  };

  // Ejecuta: router.get('/ultimasventas', getUltimasVentas);
  const obtenerUltimasVentas = async () => {
    cargando.value = true;
    try {
      const respuesta = await apiClient.get('/ventas/ultimasventas');
      ventas.value = agruparFacturas(respuesta.data);
      
      // Llamamos al top y a los detalles para que se carguen al entrar a la pantalla
      await obtenerTopArticulos(); 
      await obtenerVentasDetalladas(); // NUEVO: Carga las últimas 3 facturas detalladas por defecto
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
      const respuesta = await apiClient.get('/ventas');
      ventas.value = agruparFacturas(respuesta.data);
      
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
      const respuesta = await apiClient.get(`/ventas/factura/${terminoFactura.value}`);
      ventas.value = agruparFacturas(respuesta.data);
    } catch (error) {
      console.error(error);
    } finally {
      cargando.value = false;
    }
  };

  // Función: Busca por el rango de fechas (Desde - Hasta)
  const buscarPorRango = async () => {
    if (!fechaInicio.value || !fechaFin.value) return;

    cargando.value = true;
    try {
      // Aseguramos que abarque desde las 00:00 del primer día hasta las 23:59 del último
      const inicio = `${fechaInicio.value}T00:00:00`;
      const fin = `${fechaFin.value}T23:59:59`;

      const respuesta = await apiClient.get('/ventas', {
        params: { fechaInicio: inicio, fechaFin: fin }
      });
      ventas.value = agruparFacturas(respuesta.data);
      
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
    terminoFacturaDetalle.value = ''; // NUEVO: Limpia el buscador de detalles
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

  // Función para ordenar y agrupar los artículos en su respectiva factura (Detallado)
  const agruparDetalles = (datosRaw) => {
    const grupos = {};
    datosRaw.forEach(item => {
      if (!grupos[item.factura]) {
        grupos[item.factura] = {
          factura: item.factura,
          fecha: item.createdAt,
          vendedor: item.vendedor,
          cliente: item.cliente, // <-- NUEVO: Guardamos el cliente
          totalFactura: 0,
          articulos: []
        };
      }
      grupos[item.factura].articulos.push(item);
      grupos[item.factura].totalFactura += parseFloat(item.total);
    });
    return Object.values(grupos);
  };

  return {
    ventas,
    topArticulos,
    ventasDetalladas, // NUEVO: Exportado a la vista
    cargando,
    terminoFactura,
    terminoFacturaDetalle, // NUEVO: Exportado a la vista
    fechaInicio,
    fechaFin,
    obtenerUltimasVentas,
    obtenerTodasLasVentas,
    obtenerVentasDetalladas, // NUEVO: Exportado a la vista
    buscarPorFactura,
    buscarPorRango,
    limpiarFiltros,
    formatearFecha,
    agruparDetalles, // NUEVO: Exportado a la vista
  };
}