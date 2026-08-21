<script setup>
import { ref, computed, onMounted } from 'vue';
import { useVentas } from '../composables/useReporte'; 
import { useRepoPDF } from '../composables/useRepoPDF';

const tab = ref('historial'); // Controla en qué pestaña estamos

const {
  ventas,
  topArticulos,
  ventasDetalladas,
  cargando,
  terminoFactura,
  terminoFacturaDetalle,
  fechaInicio,
  fechaFin,
  obtenerUltimasVentas,
  obtenerTodasLasVentas,
  obtenerVentasDetalladas,
  buscarPorFactura,
  buscarPorRango,
  limpiarFiltros,
  formatearFecha,
} = useVentas();

const { descargarReporteVentas, descargandoPDF } = useRepoPDF();

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
      <v-tab value="detallado">
        <v-icon start>mdi-format-list-bulleted</v-icon>
        Detallado de Venta
      </v-tab>
    </v-tabs>

    <!-- Panel de Filtros Global (Se oculta en la pestaña de Detallado) -->
    <v-card color="surface" elevation="0" class="border mb-6 pa-4" v-if="tab !== 'detallado'">
      <v-row align="center">
        <!-- Búsqueda por Factura -->
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

        <!-- Botones de Acción (Modificados para incluir PDF) -->
        <v-col cols="12" sm="12" :md="tab === 'historial' ? 4 : 4" class="d-flex gap-2 flex-wrap">
          <v-btn color="primary" height="40" class="flex-grow-1" @click="buscarPorRango" :disabled="!fechaInicio || !fechaFin" :loading="cargando">
            Filtrar
          </v-btn>
          
          <v-btn color="secondary" variant="tonal" height="40" @click="limpiarFiltros" :disabled="cargando">
            Limpiar
          </v-btn>

          <!-- Botón de Exportar a PDF (Solo visible en Historial) -->
          <v-btn
            v-if="tab === 'historial'"
            color="error"
            height="40"
            prepend-icon="mdi-file-pdf-box"
            :loading="descargandoPDF"
            @click="descargarReporteVentas(fechaInicio, fechaFin)"
            class="flex-grow-1"
          >
            PDF
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

      <!-- Pestaña 3: DETALLADO DE VENTA -->
      <v-window-item value="detallado">
        
        <!-- Buscador de Factura Exclusivo -->
        <v-card color="surface" elevation="0" class="border mb-4 pa-4">
          <v-row align="center">
            <v-col cols="12" md="8">
              <v-text-field
                v-model="terminoFacturaDetalle"
                label="Buscar detalle por No. Factura (Ej. FAC-123456)"
                variant="outlined"
                density="compact"
                hide-details
                clearable
                append-inner-icon="mdi-magnify"
                @keyup.enter="obtenerVentasDetalladas(terminoFacturaDetalle)"
                @click:append-inner="obtenerVentasDetalladas(terminoFacturaDetalle)"
                @click:clear="obtenerVentasDetalladas()"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-btn color="primary" block height="40" @click="obtenerVentasDetalladas(terminoFacturaDetalle)" :loading="cargando">
                Buscar Detalle
              </v-btn>
            </v-col>
          </v-row>
        </v-card>

        <v-progress-linear v-if="cargando" indeterminate color="primary"></v-progress-linear>

        <!-- Acordeón de Facturas -->
        <v-expansion-panels v-if="ventasDetalladas.length > 0 && !cargando" variant="accordion">
          <v-expansion-panel v-for="venta in ventasDetalladas" :key="venta.factura" class="border mb-2">
            
            <!-- Cabecera de la Factura -->
            <v-expansion-panel-title class="font-weight-bold py-3">
              <v-row no-gutters class="w-100 align-center">
                <!-- Factura -->
                <v-col cols="12" sm="2" class="text-primary">
                  <v-icon start color="primary">mdi-receipt-text-outline</v-icon>
                  {{ venta.factura }}
                </v-col>
                
                <!-- Cliente -->
                <v-col cols="12" sm="3" class="text-medium-emphasis text-body-2 text-truncate pr-2">
                  <v-icon start size="small">mdi-account</v-icon> 
                  C: {{ venta.cliente }}
                </v-col>
                
                <!-- Vendedor -->
                <v-col cols="12" sm="3" class="text-medium-emphasis text-body-2 text-truncate pr-2">
                  <v-icon start size="small">mdi-account-tie</v-icon> 
                  V: {{ venta.vendedor }}
                </v-col>
                
                <!-- Fecha -->
                <v-col cols="12" sm="2" class="text-medium-emphasis text-body-2">
                  <v-icon start size="small">mdi-calendar</v-icon>
                  {{ formatearFecha(venta.fecha) }}
                </v-col>
                
                <!-- Total -->
                <v-col cols="12" sm="2" class="text-right text-success font-weight-bold pr-4">
                  {{ formatearMoneda(venta.totalFactura) }}
                </v-col>
              </v-row>
            </v-expansion-panel-title>
            
            <!-- Desglose de Artículos -->
            <v-expansion-panel-text>
              <v-table density="compact" hover>
                <thead class="bg-grey-lighten-4">
                  <tr>
                    <th class="text-left font-weight-bold">ID Prod.</th>
                    <th class="text-left font-weight-bold">Producto</th>
                    <th class="text-center font-weight-bold">Cant.</th>
                    <th class="text-right font-weight-bold">Costo Inv.</th>
                    <th class="text-right font-weight-bold">Precio Unit.</th>
                    <th class="text-right font-weight-bold">Descuento</th>
                    <th class="text-right font-weight-bold">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in venta.articulos" :key="item.id">
                    <td class="text-medium-emphasis">{{ item.articuloId }}</td>
                    <td class="font-weight-medium">{{ item.articuloNombre }}</td>
                    <td class="text-center">{{ item.cantidad }}</td>
                    <td class="text-right text-medium-emphasis">{{ formatearMoneda(item.precioCosto) }}</td>
                    <td class="text-right">{{ formatearMoneda(item.precioVenta) }}</td>
                    <td class="text-right" :class="item.descuento > 0 ? 'text-error font-weight-bold' : 'text-medium-emphasis'">
                      {{ formatearMoneda(item.descuento) }}
                    </td>
                    <td class="text-right font-weight-bold">{{ formatearMoneda(item.total) }}</td>
                  </tr>
                </tbody>
              </v-table>
            </v-expansion-panel-text>

          </v-expansion-panel>
        </v-expansion-panels>

        <v-alert v-else-if="ventasDetalladas.length === 0 && !cargando" type="info" variant="tonal" class="mt-4">
          No se encontró el desglose para la factura ingresada.
        </v-alert>

      </v-window-item>

    </v-window>
  </v-container>
</template>

<style scoped>
.border {
  border: 1px solid #e5e7eb !important;
}
</style>