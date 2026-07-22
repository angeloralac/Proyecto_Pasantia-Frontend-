<script setup>
const props = defineProps({
  title: {
    type: String,
    default: 'Dashboard (Punto de Venta)'
  },
  subtitle: {
    type: String,
    default: '¡Bienvenido al sistema! Has iniciado sesión con éxito.'
  }
})
</script>

<template>
  <v-main>
    <v-container fluid class="pa-6">
      <h2 class="text-h5 mb-4 font-weight-bold">{{ title }}</h2>
      <p class="mb-6 text-grey-darken-1">{{ subtitle }}</p>

      <v-card class="pa-6 rounded-lg elevation-1">
        <slot>
          <div class="text-body-1 text-grey-darken-2">
            Selecciona una opción del menú izquierdo para gestionar tus datos. Aquí adentro se mostrarán tus tablas y formularios del CRUD.
          </div>
        </slot>
      </v-card>
    </v-container>
  </v-main>
</template>
