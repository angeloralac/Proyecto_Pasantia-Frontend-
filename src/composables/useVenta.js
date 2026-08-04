import { ref, computed } from 'vue'
import axios from 'axios'


  const API_URL = 'http://localhost:3000'
  const busqueda = ref('')
  const articulosObtenidos = ref([])
  const carrito = ref([])
  const loading = ref(false)
  const procesando = ref(false)
  const busquedaRealizada = ref(false)

  const clienteIdBusqueda = ref('')  
  const clienteSeleccionado = ref(null)
  const buscandoCliente = ref(false)

const ventasRealizadas = ref([])
const cargandoVentas = ref(false)
  
  const snackbar = ref({
    show: false,
    message: '',
    color: 'success'
  })

  export function useVenta() {
  
  // Función helper para formatear precios
  const formatPrecio = (precio) => {
    if (precio === undefined || precio === null || precio === '') return '0.00'
    const num = Number(precio)
    return isNaN(num) ? '0.00' : num.toFixed(2)
  }
  
  const mostrarMensaje = (message, color = 'success') => {
    snackbar.value = { show: true, message, color }
  }

  // 1. CORREGIDO: Búsqueda y mapeo seguro del cliente
  const buscarCliente = async () => {
    if (!clienteIdBusqueda.value) {
      clienteSeleccionado.value = null
      mostrarMensaje('Ingresa un ID de cliente válido', 'warning')
      return
    }
    buscandoCliente.value = true
    try {
      const response = await axios.get(`${API_URL}/clientes/${clienteIdBusqueda.value}`)
      console.log('Respuesta servidor cliente:', response.data)

      // Soporta si el backend devuelve un objeto directo, un array o respuesta envuelta
      const clienteData = Array.isArray(response.data) 
        ? response.data[0] 
        : (response.data.data || response.data)

      if (clienteData) {
        clienteSeleccionado.value = clienteData
        mostrarMensaje(`Cliente seleccionado: ${clienteData.nombre || clienteData.nombreCliente || 'Encontrado'}`, 'success')
      } else {
        clienteSeleccionado.value = null
        mostrarMensaje('No se encontró ningún cliente con ese ID', 'error')
      }
    } catch (error) {
      console.error("Error al buscar cliente:", error)
      clienteSeleccionado.value = null
      mostrarMensaje('No se encontró ningún cliente con ese ID', 'error')
    } finally {
      buscandoCliente.value = false
    }
  }

  const limpiarCliente = () => {
    clienteIdBusqueda.value = ''
    clienteSeleccionado.value = null
  }

  const buscarArticulos = async () => {
    if (!busqueda.value.trim()) {
      mostrarMensaje('Ingresa un término de búsqueda', 'warning')
      return
    }

    loading.value = true
    busquedaRealizada.value = true

    try {
      const response = await axios.get(`${API_URL}/articulos/search`, {
        params: { q: busqueda.value }
      })

      console.log('Respuesta del backend:', response.data)

      if (Array.isArray(response.data)) {
        articulosObtenidos.value = response.data.map(item => ({
          ...item,
          id: item.id || item.codigo,
          stock: parseInt(item.stock) || 0,
          precioVenta: parseFloat(item.precioVenta || item.precio_venta) || 0,
          precioCosto: parseFloat(item.precioCosto || item.precio_costo) || 0
        }))

        if (articulosObtenidos.value.length === 0) {
          mostrarMensaje('No se encontraron artículos', 'info')
        }
      } else {
        articulosObtenidos.value = []
        mostrarMensaje('Formato de respuesta inesperado', 'error')
      }
    } catch (error) {
      console.error("Error al buscar artículos:", error)
      mostrarMensaje('Error al buscar artículos', 'error')
      articulosObtenidos.value = []
    } finally {
      loading.value = false
    }
  }

  const agregarAlCarrito = (item) => {
    console.log('¡El botón funciona y me envió este ítem!', item)
    alert('Clic recibido')
    const itemId = item.id || item.codigo

    const precioVenta = parseFloat(item.precioVenta || item.precio_venta) || 0
    const precioCosto = parseFloat(item.precioCosto || item.precio_costo) || 0
    const stock = parseInt(item.stock) || 0

    const productoExistente = carrito.value.find(p => p.articuloId === itemId)

    if (productoExistente) {
      if (productoExistente.cantidad < stock) {
        productoExistente.cantidad++
        recalcularTotalFila(productoExistente)
        mostrarMensaje(`Se agregó otra unidad de ${item.nombre}`, 'success')
      } else {
        mostrarMensaje(`Stock máximo alcanzado para ${item.nombre}`, 'warning')
      }
    } else {
      carrito.value.push({
        articuloId: itemId,
        nombre: item.nombre || 'Sin nombre',
        stock: stock,
        cantidad: 1,
        precioCosto: precioCosto,
        precioVenta: precioVenta,
        descuento: 0,
        total: precioVenta
      })
      mostrarMensaje(`${item.nombre} agregado al carrito`, 'success')
    }
  }

  const recalcularTotalFila = (prod) => {
    prod.cantidad = parseInt(prod.cantidad) || 1
    if (prod.cantidad > prod.stock) prod.cantidad = prod.stock
    if (prod.cantidad < 1) prod.cantidad = 1

    prod.total = (prod.cantidad * parseFloat(prod.precioVenta)) - parseFloat(prod.descuento || 0)
  }

  const eliminarDelCarrito = (index) => {
    const producto = carrito.value[index]
    carrito.value.splice(index, 1)
    mostrarMensaje(`${producto.nombre || 'Producto'} eliminado del carrito`, 'info')
  }

  const totalVenta = computed(() => {
    return carrito.value.reduce((total, prod) => {
      return total + (parseFloat(prod.total) || 0)
    }, 0)
  })

  // 2. CORREGIDO: Envío únicamente del ID del cliente (no del objeto completo)
  const procesarVenta = async () => {
    if (carrito.value.length === 0) {
      mostrarMensaje('El carrito está vacío', 'warning')
      return
    }

    procesando.value = true

    try {
      const payload = {
        
        clienteId: clienteSeleccionado.value ? clienteSeleccionado.value.id : null,
        usuarioId: 1, // PONEMOS EL ID 1 DE FORMA FIJA PARA PROBAR
        
        productos: carrito.value.map(p => ({
          cantidad: parseInt(p.cantidad) || 1,
          precioCosto: parseFloat(p.precioCosto) || 0,
          precioVenta: parseFloat(p.precioVenta) || 0,
          descuento: parseFloat(p.descuento) || 0,
          total: parseFloat(p.total) || 0,
          articuloId: p.articuloId
        }))

      }

      console.log('Payload enviado:', JSON.stringify(payload, null, 2))

      const response = await axios.post(`${API_URL}/ventas/store`, payload)

      mostrarMensaje(`¡Venta registrada exitosamente! Factura: ${response.data.factura || 'Generada'}`, 'success')

      // Limpiar todo
      carrito.value = []
      busqueda.value = ''
      articulosObtenidos.value = []
      busquedaRealizada.value = false
      limpiarCliente()
      obtenerVentas()

    } catch (error) {
      console.error('Error procesando la venta:', error)

      if (error.response) {
        mostrarMensaje(`Error: ${error.response.data.error || error.response.data.mensaje || 'Error del servidor'}`, 'error')
      } else if (error.request) {
        mostrarMensaje('No se pudo conectar con el servidor', 'error')
      } else {
        mostrarMensaje('Error al configurar la petición', 'error')
      }
    } finally {
      procesando.value = false
    }
  }

  const obtenerVentas = async () => {
    cargandoVentas.value = true
    try {
      const response = await axios.get(`${API_URL}/ventas`)
      ventasRealizadas.value = response.data
    } catch (error) {
      console.error('Error al cargar el historial de ventas:', error)
      mostrarMensaje('No se pudo cargar el historial de ventas', 'error')
    } finally {
      cargandoVentas.value = false
    }
  }

  return {
    busqueda,
    articulosObtenidos,
    carrito,
    loading,
    procesando,
    busquedaRealizada,
    clienteIdBusqueda,
    clienteSeleccionado,
    buscandoCliente,
    snackbar,
    totalVenta,
    ventasRealizadas,
    cargandoVentas,
    formatPrecio,
    mostrarMensaje,
    buscarCliente,
    limpiarCliente,
    buscarArticulos,
    agregarAlCarrito,
    recalcularTotalFila,
    eliminarDelCarrito,
    procesarVenta,
    obtenerVentas,
  }
}