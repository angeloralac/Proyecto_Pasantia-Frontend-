<script setup>
import { onMounted, computed } from 'vue'
import { useVenta } from '@/composables/useVenta'

const {
  ventasRealizadas,
  cargandoVentas,
  obtenerVentas,
  formatPrecio
} = useVenta()

onMounted(() => {
  obtenerVentas()
})

// Esta función obliga a Vue a extraer solo 1 registro por Factura, ignorando los artículos.
const facturasUnicas = computed(() => {
  if (!ventasRealizadas.value) return []
  
  const facturas = []
  const facturasVistas = new Set()

  for (const venta of ventasRealizadas.value) {
    // Tomamos el ID de la venta o el No. de Factura como identificador
    const identificador = venta.factura || venta.id
    
    // Si esta factura no la hemos agregado a la tabla, la agregamos
    if (!facturasVistas.has(identificador)) {
      facturasVistas.add(identificador)
      facturas.push(venta)
    }
  }
  
  return facturas
})

// Función para mostrar la fecha de forma legible
const formatearFecha = (fechaString) => {
  if (!fechaString) return 'N/A'
  const fecha = new Date(fechaString)
  return fecha.toLocaleDateString() + ' ' + fecha.toLocaleTimeString()
}
</script>

<template>
  <v-card class="pa-4 mt-4" flat border>
    <div class="d-flex justify-space-between align-center mb-3">
      <div class="text-h6 font-weight-bold">Historial de Facturas</div>
      <v-btn
        icon="mdi-refresh"
        variant="text"
        size="small"
        :loading="cargandoVentas"
        @click="obtenerVentas"
      />
    </div>

    <v-table density="compact" hover>
      <thead>
        <tr>
          <!-- Aquí están exactamente las 5 columnas que solicitaste -->
          <th class="text-left font-weight-bold">No. Factura</th>
          <th class="text-left font-weight-bold">Fecha</th>
          <th class="text-left font-weight-bold">Cliente</th>
          <th class="text-left font-weight-bold">Vendedor / Usuario</th>
          <th class="text-right font-weight-bold">Total</th>
        </tr>
      </thead>
      
      <tbody>
        <tr v-if="cargandoVentas && facturasUnicas.length === 0">
          <td colspan="5" class="text-center text-medium-emphasis py-4">
            Cargando facturas...
          </td>
        </tr>
        
        <tr v-else-if="facturasUnicas.length === 0">
          <td colspan="5" class="text-center text-medium-emphasis py-4">
            No hay facturas registradas aún.
          </td>
        </tr>
        
        <!-- Iteramos sobre las facturas únicas, ya filtradas -->
        <tr v-for="venta in facturasUnicas" :key="venta.id">
          
          <!-- 1. No. Factura -->
          <td>{{ venta.factura || venta.id }}</td>
          
          <!-- 2. Fecha -->
          <td>{{ formatearFecha(venta.createdAt || venta.fecha) }}</td>
          
          <!-- 3. Cliente (Busca en las posibles variables que mande Sequelize) -->
          <td>{{ venta.Cliente?.nombre || 'Consumidor Final' }}</td>
          
          <!-- 4. Usuario/Vendedor logeado -->
          <td>{{ venta.nombreUsuario?.nombre || 'Usuario desconocido' }}</td>
          
          <!-- 5. Total de la factura -->
          <td class="text-right text-success font-weight-bold">
            Q{{ formatPrecio(venta.total) }}
          </td>
          
        </tr>
      </tbody>
    </v-table>
  </v-card>
</template>