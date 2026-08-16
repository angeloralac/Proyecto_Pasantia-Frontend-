<script setup>
import { onMounted } from 'vue';
import { useDashboard } from '../composables/UseDashboard';

// Importamos todas las herramientas y variables de nuestro gerente de dashboard
const { 
  cargando, 
  metricasHoy, 
  metricasMes, 
  ventasRecientes, 
  cargarMetricas, 
  formatearMoneda, 
  formatearHora 
} = useDashboard();

// Cuando la pantalla termine de cargar, le pedimos al gerente que vaya por los datos
onMounted(() => {
  cargarMetricas();
});
</script>

<template>
  <v-container fluid class="pa-6">
    <!-- Título de la sección -->
    <div class="mb-6">
      <h2 class="text-h5 font-weight-bold">Resumen Operativo</h2>
      <p class="text-medium-emphasis">Monitoreo de actividad de la sesión actual</p>
    </div>

    <!-- Barra de carga principal: Solo se muestra mientras el backend responde -->
    <v-progress-linear 
      v-if="cargando" 
      indeterminate 
      color="primary" 
      class="mb-4 rounded"
    ></v-progress-linear>

    <!-- Fila Superior: Tarjetas de Indicadores (KPIs) -->
    <v-row>
      <!-- 1. Tarjeta: Ventas del Día -->
      <v-col cols="12" md="6">
        <v-card elevation="0" class="border rounded-lg pa-4 h-100">
          <div class="d-flex justify-space-between align-center">
            <div>
              <div class="text-subtitle-1 text-medium-emphasis mb-1">Ventas de Hoy</div>
              <!-- Inyectamos el total formateado dinámicamente -->
              <div class="text-h3 font-weight-bold text-primary">
                {{ formatearMoneda(metricasHoy.total) }}
              </div>
            </div>
            <v-avatar color="primary-lighten-4" size="64">
              <v-icon color="primary" size="32">mdi-cash-register</v-icon>
            </v-avatar>
          </div>
          <v-divider class="my-4"></v-divider>
          <div class="text-body-2 text-medium-emphasis d-flex align-center">
            <v-icon size="18" color="success" class="mr-1">mdi-trending-up</v-icon>
            <!-- Inyectamos la cantidad de facturas dinámicamente -->
            <span><strong>{{ metricasHoy.cantidad }}</strong> transacciones completadas en total</span>
          </div>
        </v-card>
      </v-col>
  
      
<!-- 2. Tarjeta: Acumulado del Mes -->

      <v-col cols="12" md="6">
        <v-card elevation="0" class="border rounded-lg pa-4 h-100">
          <div class="d-flex justify-space-between align-center">
            <div>
              <div class="text-subtitle-1 text-medium-emphasis mb-1">Total Ventas del Mes</div>
              <!-- Pintamos directamente el total del mes en lugar del porcentaje -->
              <div class="text-h3 font-weight-bold text-success">
                {{ formatearMoneda(metricasMes.totalMes) }}
              </div>
            </div>
            <!-- Cambié el ícono a un calendario verde para diferenciarlo del de "Hoy" -->
            <v-avatar color="success-lighten-4" size="64">
              <v-icon color="success" size="32">mdi-calendar-month</v-icon>
            </v-avatar>
          </div>
          <v-divider class="my-4"></v-divider>
          <div class="text-body-2 text-medium-emphasis d-flex align-center">
            <v-icon size="18" color="success" class="mr-1">mdi-check-circle</v-icon>
            <span>Total acumulado en el mes actual</span>
          </div>
        </v-card>
      </v-col>
        </v-row>

      

    <!-- Fila Inferior: Tabla de Mis Ventas -->
    <v-row class="mt-6">
      <v-col cols="12">
        <v-card elevation="0" class="border rounded-lg">
          <v-card-title class="px-6 py-4 d-flex align-center justify-space-between">
            <span class="font-weight-bold">Mis Ventas Recientes</span>
            <v-btn variant="tonal" size="small" color="primary" prepend-icon="mdi-history" to="/dashboard/ventas">
              Ir a Ventas
            </v-btn>
          </v-card-title>
          <v-divider></v-divider>
          
          <v-table>
            <thead class="bg-grey-lighten-4">
              <tr>
                <th class="text-left font-weight-bold">Factura</th>
                <th class="text-left font-weight-bold">Hora</th>
                <th class="text-center font-weight-bold">Artículos Dif.</th>
                <th class="text-right font-weight-bold px-6">Total</th>
              </tr>
            </thead>
            <tbody>
              <!-- Si no hay ventas todavía -->
              <tr v-if="ventasRecientes.length === 0">
                <td colspan="4" class="text-center text-medium-emphasis py-4">
                  No hay transacciones recientes para mostrar.
                </td>
              </tr>
              
              <!-- El ciclo v-for para pintar las ventas reales -->
              <tr v-else v-for="venta in ventasRecientes" :key="venta.factura">
                <td class="font-weight-medium">{{ venta.factura }}</td>
                <td class="text-medium-emphasis">{{ formatearHora(venta.createdAt) }}</td>
                <td class="text-center">{{ venta.cantidadArticulos }}</td>
                <td class="text-right text-success font-weight-bold px-6">
                  {{ formatearMoneda(venta.total) }}
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.border {
  border: 1px solid #e0e0e0 !important;
}
</style>