<script setup>
import { useVenta } from '@/composables/useVenta'

const {
  clienteIdBusqueda,
  clienteSeleccionado,
  buscandoCliente,
  buscarCliente,
  limpiarCliente
} = useVenta()

// Función helper para capturar el Enter sin usar modificadores en la plantilla
const handleEnter = (event) => {
  if (event.key === 'Enter') {
    buscarCliente()
  }
}
</script>

<template>
  <v-card class="pa-4 mb-4" flat border>
    <div class="text-subtitle-1 font-weight-bold mb-3">
      Información del Cliente
    </div>
    
    <v-row density="compact">
      <!-- Campo de Búsqueda por ID -->
      <v-col cols="12" sm="4" md="3">
        <div class="d-flex align-center">
          <!-- Usamos @keydown normal sin .enter -->
          <v-text-field
            v-model="clienteIdBusqueda"
            label="ID Cliente"
            type="number"
            density="compact"
            hide-details
            @keydown="handleEnter"
          />
          <v-btn
            color="primary"
            class="ml-2"
            :loading="buscandoCliente"
            @click="buscarCliente"
          >
            Buscar
          </v-btn>
        </div>
      </v-col>

      <!-- Botón de Limpiar / Restaurar Cliente -->
      <v-col cols="12" sm="2" md="1" class="d-flex align-center">
        <v-btn
          v-if="clienteSeleccionado"
          color="warning"
          variant="outlined"
          size="small"
          block
          @click="limpiarCliente"
        >
          Limpiar
        </v-btn>
      </v-col>

      <!-- Campos Autocompletados (Solo Lectura) -->
      <v-col cols="12" sm="6" md="4">
        <v-text-field
          :model-value="clienteSeleccionado?.nombre || ''"
          label="Nombre completo"
          density="compact"
          readonly
          hide-details
          placeholder="Público General"
        />
      </v-col>

      <v-col cols="12" sm="4" md="2">
        <v-text-field
          :model-value="clienteSeleccionado?.nit || clienteSeleccionado?.dpi || ''"
          label="NIT / DPI"
          density="compact"
          readonly
          hide-details
          placeholder="C/F"
        />
      </v-col>

      <v-col cols="12" sm="4" md="2">
        <v-text-field
          :model-value="clienteSeleccionado?.telefono || ''"
          label="Teléfono"
          density="compact"
          readonly
          hide-details
          placeholder="N/A"
        />
      </v-col>

      <v-col cols="12" sm="8" md="12" class="mt-2">
        <v-text-field
          :model-value="clienteSeleccionado?.direccion || ''"
          label="Dirección"
          density="compact"
          readonly
          hide-details
          placeholder="Ciudad"
        />
      </v-col>
    </v-row>
  </v-card>
</template>