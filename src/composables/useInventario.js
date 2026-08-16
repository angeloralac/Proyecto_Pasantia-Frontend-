import { ref, computed } from 'vue';

export function useInventario() {
  const articulos = ref([]);
  const cargando = ref(false);
  
  // NUEVA VARIABLE: Guarda lo que el usuario escribe en el buscador
  const terminoBusqueda = ref('');
  
  const baseUrl = 'http://localhost:3000/articulos';

  const obtenerInventario = async () => {
    cargando.value = true;
    try {
      const respuesta = await fetch(baseUrl);
      if (!respuesta.ok) throw new Error('Error al obtener el inventario');
      articulos.value = await respuesta.json();
    } catch (error) {
      console.error(error);
    } finally {
      cargando.value = false;
    }
  };

  // --- FILTROS PARA LAS TARJETAS (KPIs) ---
  const articulosAgotados = computed(() => {
    return articulos.value.filter(item => item.stock === 0);
  });

  const articulosEnRiesgo = computed(() => {
    return articulos.value.filter(item => item.stock > 0 && item.stock <= 5);
  });

  const articulosSanos = computed(() => {
    return articulos.value.filter(item => item.stock > 5);
  });

  // --- MAGIA CORREGIDA: Filtro de búsqueda en tiempo real ---
  const articulosFiltrados = computed(() => {
    if (!terminoBusqueda.value) return articulos.value;
    
    const termino = String(terminoBusqueda.value).toLowerCase();
    
    return articulos.value.filter(item => {
      // String() salva el día convirtiendo números a texto
      const nombreStr = item.nombre ? String(item.nombre).toLowerCase() : '';
      const codigoBarrasStr = item.codigo_barras ? String(item.codigo_barras).toLowerCase() : '';
      const idStr = item.codigo ? String(item.codigo).toLowerCase() : '';
      
      return nombreStr.includes(termino) || 
             codigoBarrasStr.includes(termino) || 
             idStr.includes(termino);
    });
  });

  const formatearMoneda = (cantidad) => {
    return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: 'GTQ'
    }).format(cantidad || 0);
  };

  return {
    articulos,
    cargando,
    terminoBusqueda, 
    articulosFiltrados, 
    articulosAgotados,
    articulosEnRiesgo,
    articulosSanos,
    obtenerInventario,
    formatearMoneda
  };
}