 import { ref, computed } from 'vue'
     import axios from 'axios'


export function useVenta () {

     const API_URL = 'http://localhost:3000'
     const busqueda = ref('')
     const articulosObtenidos = ref([])
     const carrito = ref([])
     const loading = ref(false)
     const procesando = ref(false)
     const busquedaRealizada = ref(false)
     const clienteSeleccionado = ref(1)
     
     const snackbar = ref({
         show: false,
         message: '',
         color: 'success'
     })
     
     // Función helper para formatear precios de manera segura
     const formatPrecio = (precio) => {
         if (precio === undefined || precio === null || precio === '') return '0.00'
         const num = Number(precio)
         return isNaN(num) ? '0.00' : num.toFixed(2)
     }
     
     const mostrarMensaje = (message, color = 'success') => {
         snackbar.value = { show: true, message, color }
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
                 // Asegurar que los campos numéricos sean realmente números
                 articulosObtenidos.value = response.data.map(item => ({
                     ...item,
                     id: item.id || item.codigo,
                     stock: parseInt(item.stock) || 0,
                     precioVenta: parseFloat(item.precioVenta) || 0,
                     precioCosto: parseFloat(item.precioCosto) || 0
                 }))
     
                 console.log('Artículos procesados:', articulosObtenidos.value)
     
                 if (articulosObtenidos.value.length === 0) {
                     mostrarMensaje('No se encontraron artículos', 'info')
                 }
             } else {
                 console.error('La respuesta no es un array:', response.data)
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
         const itemId = item.id || item.codigo
     
         // Asegurar que los valores numéricos sean números
         const precioVenta = parseFloat(item.precio_venta) || 0
         const precioCosto = parseFloat(item.precio_costo) || 0
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
                 total: precioVenta // Inicialmente 1 * precioVenta
             })
             mostrarMensaje(`${item.nombre} agregado al carrito`, 'success')
         }
     
         console.log('Carrito actual:', carrito.value)
     }
     
     const recalcularTotalFila = (prod) => {
         // Asegurar que cantidad sea un número válido
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
     
     const procesarVenta = async () => {
         if (carrito.value.length === 0) {
             mostrarMensaje('El carrito está vacío', 'warning')
             return
         }
     
         procesando.value = true
     
         try {
             const payload = {
                 productos: carrito.value.map(p => ({
                     cantidad: parseInt(p.cantidad) || 1,
                     precioCosto: parseFloat(p.precioCosto) || 0,
                     precioVenta: parseFloat(p.precioVenta) || 0,
                     descuento: parseFloat(p.descuento) || 0,
                     total: parseFloat(p.total) || 0,
                     articuloId: p.articuloId,
                     clienteId: clienteSeleccionado.value
                 }))
             }
     
             console.log('Enviando venta a:', `${API_URL}/ventas/store`)
             console.log('Payload:', JSON.stringify(payload, null, 2))
     
             // Prueba con /store si tu ruta es así
             const response = await axios.post(`${API_URL}/ventas/store`, payload)
             // O prueba con esta línea si tu ruta es diferente:
             // const response = await axios.post(`${API_URL}/ventas`, payload)
     
             mostrarMensaje(`¡Venta registrada exitosamente! Factura: ${response.data.factura}`, 'success')
     
             // Limpiar todo
             carrito.value = []
             busqueda.value = ''
             articulosObtenidos.value = []
             busquedaRealizada.value = false
     
         } catch (error) {
             console.error('Error procesando la venta:', error)
     
             if (error.response) {
                 // El servidor respondió con un error
                 console.error('Respuesta del servidor:', error.response.data)
                 mostrarMensaje(`Error: ${error.response.data.error || 'Error del servidor'}`, 'error')
             } else if (error.request) {
                 // No se recibió respuesta
                 console.error('No se recibió respuesta:', error.request)
                 mostrarMensaje('No se pudo conectar con el servidor', 'error')
             } else {
                 mostrarMensaje('Error al configurar la petición', 'error')
             }
         } finally {
             procesando.value = false
         }
     }



     return {
busqueda,
articulosObtenidos,
carrito,
loading,
procesando,
busquedaRealizada,
clienteSeleccionado,
snackbar,
formatPrecio,
mostrarMensaje,
buscarArticulos,
agregarAlCarrito,
recalcularTotalFila,
eliminarDelCarrito,
procesarVenta
     }

}