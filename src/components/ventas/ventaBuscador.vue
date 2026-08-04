<script setup>
import { useVenta } from '@/composables/useVenta'

const {
  busqueda,
  articulosObtenidos,
  loading,
  busquedaRealizada,
  formatPrecio,
  buscarArticulos,
  agregarAlCarrito
} = useVenta()
</script>

<template>
  <v-card class="pa-4" flat border>
    <div class="d-flex align-center mb-3">
      <v-text-field
        v-model="busqueda"
        label="Buscar artículo por nombre o código"
        density="comfortable"
        hide-details
        @keyup.enter="buscarArticulos"
      />
      <v-btn
        color="primary"
        class="ml-3"
        :loading="loading"
        @click="buscarArticulos"
      >
        Buscar
      </v-btn>
    </div>

    <v-alert
      v-if="busquedaRealizada && articulosObtenidos.length === 0"
      type="info"
      variant="tonal"
      density="compact"
    >
      No se encontraron artículos.
    </v-alert>

    <v-list v-if="articulosObtenidos.length" lines="two" density="compact">
      <v-list-item
        v-for="item in articulosObtenidos"
        :key="item.id"
        class="mb-2 rounded border"
      >
        <v-list-item-title class="font-weight-bold">{{ item.nombre }}</v-list-item-title>
        <v-list-item-subtitle>
          Stock: {{ item.stock }} • Precio: Q{{ formatPrecio(item.precioVenta) }}
        </v-list-item-subtitle>

        <template #append>
          <v-btn
            color="success"
            size="small"
            @click.prevent="agregarAlCarrito(item)"
          >
            Agregar
          </v-btn>
        </template>
      </v-list-item>
    </v-list>
  </v-card>
</template>