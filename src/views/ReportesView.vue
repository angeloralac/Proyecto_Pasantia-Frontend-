<script setup>
import { ref, computed, onMounted } from 'vue';
import { useVentas } from '../composables/useReporte'; 

const tab = ref('historial'); // Controla en qué pestaña estamos

const {
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
  formatearFecha
} = useVentas();

onMounted(() => {
  obtenerUltimasVentas();
});

const totalDelPeriodo = computed(() => {
  return ventas.value.reduce((suma, venta) => suma + parseFloat(venta.total || 0), 0);
});

const formatearMoneda = (cantidad) => {
  return new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' }).format(cantidad || 0);
};
</script>

<template>
  <v-container fluid class="bg-background pa-6 h-100">
    
    <div class="d-flex justify-space-between align-center mb-6">
      <h2 class="text-h5 font-weight-bold">Análisis y Reportes de Ventas</h2>
      <v-btn color="primary" variant="text" @click="obtenerTodasLasVentas">
        Ver Todo el Historial
      </v-btn>
    </div>

    <!-- Pestañas de Navegación -->
    <v-tabs v-model="tab" color="primary" class="mb-4">
      <v-tab value="historial">
        <v-icon start>mdi-receipt-text-outline</v-icon>
        Historial de Facturas
      </v-tab>
      <v-tab value="top">
        <v-icon start>mdi-trending-up</v-icon>
        Top Artículos Vendidos
      </v-tab>
    </v-tabs>

    <!-- Panel de Filtros Global (Funciona para ambas pestañas) -->
    <v-card color="surface" elevation="0" class="border mb-6 pa-4">
      <v-row align="center">
        <!-- Búsqueda por Factura (Solo se muestra en la pestaña Historial) -->
        <v-col cols="12" sm="12" md="4" v-if="tab === 'historial'">
          <v-text-field
            v-model="terminoFactura"
            label="Buscar por No. Factura"
            placeholder="Ej. FAC-123456"
            variant="outlined"
            density="compact"
            hide-details
            clearable
            @keyup.enter="buscarPorFactura"
            append-inner-icon="mdi-magnify"
            @click:append-inner="buscarPorFactura"
          ></v-text-field>
        </v-col>

        <!-- Rango de Fechas -->
        <v-col cols="12" sm="6" :md="tab === 'historial' ? 2 : 4">
          <v-text-field v-model="fechaInicio" label="Desde" type="date" variant="outlined" density="compact" hide-details></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" :md="tab === 'historial' ? 2 : 4">
          <v-text-field v-model="fechaFin" label="Hasta" type="date" variant="outlined" density="compact" hide-details></v-text-field>
        </v-col>

        <!-- Botones de Acción -->
        <v-col cols="12" sm="12" :md="tab === 'historial' ? 4 : 4" class="d-flex gap-2">
          <v-btn color="primary" height="40" class="flex-grow-1 mr-2" @click="buscarPorRango" :disabled="!fechaInicio || !fechaFin" :loading="cargando">
            Filtrar Rango
          </v-btn>
          <v-btn color="secondary" variant="tonal" height="40" @click="limpiarFiltros" :disabled="cargando">
            Limpiar
          </v-btn>
        </v-col>
      </v-row>
    </v-card>

    <!-- Ventanas del Contenido -->
    <v-window v-model="tab">
      
      <!-- Pestaña 1: HISTORIAL DE FACTURAS -->
      <v-window-item value="historial">
        <!-- Tarjetas de Resumen -->
        <v-row class="mb-4" v-if="ventas.length > 0">
          <v-col cols="12" md="6">
            <v-card elevation="0" class="border rounded-lg pa-4" style="border-left: 4px solid #1976D2 !important;">
              <div class="text-subtitle-2 text-medium-emphasis">Total del periodo filtrado</div>
              <div class="text-h5 font-weight-bold text-primary">{{ formatearMoneda(totalDelPeriodo) }}</div>
            </v-card>
          </v-col>
          <v-col cols="12" md="6">
            <v-card elevation="0" class="border rounded-lg pa-4" style="border-left: 4px solid #4CAF50 !important;">
              <div class="text-subtitle-2 text-medium-emphasis">Facturas emitidas</div>
              <div class="text-h5 font-weight-bold">{{ ventas.length }}</div>
            </v-card>
          </v-col>
        </v-row>

        <v-card color="surface" elevation="0" class="border">
          <v-progress-linear v-if="cargando" indeterminate color="primary"></v-progress-linear>
          <v-table>
            <thead class="bg-grey-lighten-4">
              <tr>
                <th class="text-left font-weight-bold">Factura</th>
                <th class="text-left font-weight-bold">Fecha</th>
                <th class="text-left font-weight-bold">ID Cliente</th>
                <th class="text-left font-weight-bold">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="ventas.length === 0 && !cargando">
                <td colspan="4" class="text-center text-medium-emphasis py-10 font-italic">No se encontraron facturas con estos filtros.</td>
              </tr>
              <tr v-for="venta in ventas" :key="venta.id">
                <td class="font-weight-medium">{{ venta.factura }}</td>
                <td>{{ formatearFecha(venta.createdAt) }}</td>
                <td>{{ venta.clienteId }}</td>
                <td class="text-success font-weight-bold">{{ formatearMoneda(venta.total) }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </v-window-item>

      <!-- Pestaña 2: TOP ARTÍCULOS -->
      <v-window-item value="top">
        <v-card color="surface" elevation="0" class="border">
          <v-progress-linear v-if="cargando" indeterminate color="primary"></v-progress-linear>
          
          <v-table hover>
            <thead class="bg-grey-lighten-4">
              <tr>
                <th class="text-center font-weight-bold" style="width: 80px;">Rango</th>
                <th class="text-left font-weight-bold">Nombre del Producto</th>
                <th class="text-center font-weight-bold">Unidades Vendidas</th>
                <th class="text-right font-weight-bold">Total Generado</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="topArticulos.length === 0 && !cargando">
                <td colspan="4" class="text-center text-medium-emphasis py-10 font-italic">No hay datos de ventas para mostrar en este periodo.</td>
              </tr>
              <tr v-for="(item, index) in topArticulos" :key="item.id">
                <td class="text-center">
                  <!-- Medallas para los primeros 3 lugares -->
                  <v-icon v-if="index === 0" color="warning" size="x-large">mdi-trophy</v-icon>
                  <v-icon v-else-if="index === 1" color="grey-darken-1" size="large">mdi-medal</v-icon>
                  <v-icon v-else-if="index === 2" color="brown-darken-1" size="large">mdi-medal</v-icon>
                  <span v-else class="font-weight-bold text-medium-emphasis">{{ index + 1 }}</span>
                </td>
                <td class="font-weight-bold text-primary">{{ item.nombre }}</td>
                <td class="text-center text-h6 font-weight-medium">{{ item.unidades }}</td>
                <td class="text-right text-success font-weight-bold">{{ formatearMoneda(item.generado) }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </v-window-item>

    </v-window>
  </v-container>
</template>

<style scoped>
.border {
  border: 1px solid #e5e7eb !important;
}
</style>