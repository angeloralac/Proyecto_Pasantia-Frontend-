<script setup>
import ClienteSelector from '@/components/ventas/clienteSelector.vue'
import VentaBuscador from '@/components/ventas/ventaBuscador.vue'
import VentaCarrito from '@/components/ventas/ventaCarrito.vue'
import VentaSnackbar from '@/components/ventas/ventaSnackBar.vue'
</script>

<template>
  <v-container fluid class="pa-4">
    <h2 class="text-h5 mb-4 font-weight-bold">Punto de Venta</h2>
    
    <!-- 1. Formulario superior: Buscador y datos de cliente (Ancho Completo) -->
    <v-row dense>
      <v-col cols="12">
        <ClienteSelector />
      </v-col>
    </v-row>

    <!-- 2. Fila inferior: Buscador de Artículo (Izq) y Carrito (Der) -->
    <v-row dense>
      <!-- Buscador de artículos -->
      <v-col cols="12" md="7" lg="8">
        <VentaBuscador />
      </v-col>

      <!-- Resumen del Carrito -->
      <v-col cols="12" md="5" lg="4">
        <VentaCarrito />
      </v-col>
    </v-row>

    <!-- Notificaciones flotantes -->
    <VentaSnackbar />
  </v-container>
</template>