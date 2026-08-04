<script setup>
import { useVenta } from '@/composables/useVenta'

const {
  carrito,
  totalVenta,
  procesando,
  formatPrecio,
  recalcularTotalFila,
  eliminarDelCarrito,
  procesarVenta
} = useVenta()
</script>

<template>
  <v-card class="pa-4" flat border>
    <div class="text-h6 mb-3">Carrito de Compras</div>

    <div v-if="!carrito.length" class="text-medium-emphasis py-4 text-center">
      Aún no hay productos en el carrito.
    </div>

    <template v-else>
      <v-list density="compact">
        <v-list-item
          v-for="(prod, index) in carrito"
          :key="prod.articuloId + '-' + index"
          class="mb-2 rounded border"
        >
          <v-list-item-title class="font-weight-bold">{{ prod.nombre }}</v-list-item-title>
          
          <div class="d-flex align-center mt-1">
            <v-text-field
              v-model.number="prod.cantidad"
              type="number"
              label="Cant."
              density="compact"
              hide-details
              style="max-width: 80px"
              @change="recalcularTotalFila(prod)"
            />
            <span class="ml-3 text-caption">Total: Q{{ formatPrecio(prod.total) }}</span>
          </div>

          <template #append>
            <v-icon color="error" class="cursor-pointer ml-2" @click="eliminarDelCarrito(index)">
              mdi-delete
            </v-icon>
          </template>
        </v-list-item>
      </v-list>

      <v-divider class="my-3" />

      <div class="d-flex justify-space-between align-center text-h6">
        <span>Total a pagar:</span>
        <span class="font-weight-bold text-primary">Q{{ formatPrecio(totalVenta) }}</span>
      </div>

      <v-btn
        color="success"
        block
        size="large"
        class="mt-4"
        :loading="procesando"
        @click="procesarVenta"
      >
        Procesar Venta
      </v-btn>
    </template>
  </v-card>
</template>
