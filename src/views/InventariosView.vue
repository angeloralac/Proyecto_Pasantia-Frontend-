<script setup>
import { onMounted } from 'vue';
import { useInventario } from '../composables/useInventario';

const {
  cargando,
  terminoBusqueda,
  articulosFiltrados,
  articulosAgotados,
  articulosEnRiesgo,
  articulos, // Aún lo necesitamos para contar el total general en las tarjetas
  obtenerInventario,
  formatearMoneda
} = useInventario();

onMounted(() => {
  obtenerInventario();
});

const obtenerEstadoStock = (stock) => {
  if (stock === 0) return { color: 'error', texto: 'Agotado', icon: 'mdi-close-circle' };
  if (stock > 0 && stock <= 5) return { color: 'warning', texto: 'Bajo', icon: 'mdi-alert' };
  return { color: 'success', texto: 'Sano', icon: 'mdi-check-circle' };
};
</script>

<template>
  <v-container fluid class="bg-background pa-6 h-100">
    
    <div class="mb-6">
      <h2 class="text-h5 font-weight-bold">Estado del Inventario</h2>
      <p class="text-medium-emphasis">Monitorea tus existencias físicas y alertas de reabastecimiento</p>
    </div>

    <!-- Panel Superior de Alertas -->
    <v-row class="mb-6">
      <v-col cols="12" md="4">
        <v-card elevation="0" class="border rounded-lg pa-4 h-100">
          <div class="d-flex justify-space-between align-center">
            <div>
              <div class="text-subtitle-2 text-medium-emphasis">Total de Artículos en Catálogo</div>
              <div class="text-h4 font-weight-bold">{{ articulos.length }}</div>
            </div>
            <v-avatar color="primary-lighten-4" size="56">
              <v-icon color="primary" size="28">mdi-package-variant-closed</v-icon>
            </v-avatar>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card elevation="0" class="border rounded-lg pa-4 h-100" style="border-left: 4px solid #FF9800 !important;">
          <div class="d-flex justify-space-between align-center">
            <div>
              <div class="text-subtitle-2 text-warning font-weight-bold">Por Agotarse (1 - 5 uds)</div>
              <div class="text-h4 font-weight-bold">{{ articulosEnRiesgo.length }}</div>
            </div>
            <v-avatar color="warning-lighten-4" size="56">
              <v-icon color="warning" size="28">mdi-alert-outline</v-icon>
            </v-avatar>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card elevation="0" class="border rounded-lg pa-4 h-100" style="border-left: 4px solid #F44336 !important;">
          <div class="d-flex justify-space-between align-center">
            <div>
              <div class="text-subtitle-2 text-error font-weight-bold">Agotados (0 uds)</div>
              <div class="text-h4 font-weight-bold">{{ articulosAgotados.length }}</div>
            </div>
            <v-avatar color="error-lighten-4" size="56">
              <v-icon color="error" size="28">mdi-close-octagon-outline</v-icon>
            </v-avatar>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Tabla Completa de Inventario -->
    <v-card color="surface" elevation="0" class="border">
      
      <!-- Título de la tabla y Buscador Integrado -->
      <v-card-title class="px-4 py-3 d-flex align-center flex-wrap gap-4">
        <div class="d-flex align-center mr-auto">
          <v-icon color="primary" class="mr-2">mdi-clipboard-list-outline</v-icon>
          Nivel de Existencias
        </div>
        
        <!-- NUEVO: Campo de Búsqueda -->
        <v-text-field
          v-model="terminoBusqueda"
          label="Buscar por código o nombre..."
          variant="outlined"
          density="compact"
          hide-details
          prepend-inner-icon="mdi-magnify"
          clearable
          style="max-width: 350px; width: 100%;"
        ></v-text-field>
      </v-card-title>
      
      <v-divider></v-divider>

      <v-progress-linear v-if="cargando" indeterminate color="primary"></v-progress-linear>
      
      <v-table hover>
        <thead class="bg-grey-lighten-4">
          <tr>
            <th class="text-left font-weight-bold">Código</th>
            <th class="text-left font-weight-bold">Producto</th>
            <th class="text-left font-weight-bold">Costo Inv.</th>
            <th class="text-center font-weight-bold">Existencias</th>
            <th class="text-center font-weight-bold">Estado</th>
          </tr>
        </thead>
        <tbody>
          <!-- Mensaje si no hay registros en absoluto o si la búsqueda no arroja resultados -->
          <tr v-if="articulosFiltrados.length === 0 && !cargando">
            <td colspan="5" class="text-center text-medium-emphasis py-10 font-italic">
              {{ terminoBusqueda ? 'No se encontraron artículos que coincidan con tu búsqueda.' : 'No hay artículos registrados en el catálogo.' }}
            </td>
          </tr>
          
          <!-- Iteramos sobre la lista FILTRADA, no la general -->
          <tr v-for="item in articulosFiltrados" :key="item.codigo">
            <td class="font-weight-medium text-medium-emphasis">{{ item.codigo_barras || item.codigo }}</td>
            <td class="font-weight-medium">{{ item.nombre }}</td>
            <td>{{ formatearMoneda(item.precioCosto) }}</td>
            
            <td class="text-center font-weight-bold text-h6" :class="item.stock === 0 ? 'text-error' : ''">
              {{ item.stock }}
            </td>
            
            <td class="text-center">
              <v-chip 
                size="small" 
                :color="obtenerEstadoStock(item.stock).color"
                :prepend-icon="obtenerEstadoStock(item.stock).icon"
                variant="flat"
                class="text-caption font-weight-bold px-3"
              >
                {{ obtenerEstadoStock(item.stock).texto }}
              </v-chip>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>

  </v-container>
</template>

<style scoped>
.border {
  border: 1px solid #e5e7eb !important;
}
.gap-4 {
  gap: 16px;
}
</style>