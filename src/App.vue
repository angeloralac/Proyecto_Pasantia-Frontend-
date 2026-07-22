<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <v-app>
    <!-- Encabezado superior -->
    <header class="pa-4 bg-gray-lighten-3 text-center border-b">
      <span class="text-caption text-grey-darken-1">Sistema de Gestión</span>
      <h1 class="text-h5 font-weight-bold">Punto de Venta</h1>
    </header>

    <!-- La vista del Dashboard se renderiza a pantalla completa -->
    <RouterView />
  </v-app>
</template>