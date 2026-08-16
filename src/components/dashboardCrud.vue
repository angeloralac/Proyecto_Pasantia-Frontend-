<script setup>
// Ya no necesitamos declarar el arreglo categorias aquí porque 
// estamos usando los v-list-item directamente abajo de forma limpia.
</script>

<template>
  <v-navigation-drawer app permanent>
    <!-- Título o logo de la aplicación -->
    <div class="pa-4">
      <h3 class="text-h6 font-weight-bold text-primary">Punto de Venta</h3>
      <p class="text-caption text-medium-emphasis">Panel de Control</p>
    </div>

    <v-divider></v-divider>
    
    <v-list density="compact" nav class="pa-2">
      
      <!-- Inicio / Dashboard -->
      <v-list-item 
        title="Inicio" 
        prepend-icon="mdi-view-dashboard" 
        to="/dashboard" 
        value="inicio"
        exact
      />

      <!-- SECCIÓN 1: Operación Diaria -->
      <v-list-item title="Usuarios" prepend-icon="mdi-account-group" to="/dashboard/usuarios" value="usuarios" />
      <v-list-item title="Artículos" prepend-icon="mdi-package-variant-closed" to="/dashboard/articulos" value="articulos" />
      <v-list-item title="Clientes" prepend-icon="mdi-account-box" to="/dashboard/clientes" value="clientes" />
      <v-list-item title="Ventas" prepend-icon="mdi-cash-register" to="/dashboard/ventas" value="ventas" />

      <!-- LÍNEA DIVISORIA -->
      <v-divider class="my-3"></v-divider>

      <!-- SECCIÓN 2: Reportes y Análisis -->
      <v-list-subheader class="text-uppercase font-weight-bold text-primary px-2 mb-1">
        Análisis y Reportes
      </v-list-subheader>

      <!-- Sub-opción: Inventario y Alertas -->
      <v-list-item 
        title="Inventario y Alertas" 
        prepend-icon="mdi-alert-box-outline" 
        to="/dashboard/inventario" 
        value="inventario" 
        class="mb-1"
      />

      <!-- Sub-opción: Reporte de Ventas -->
      <v-list-item 
        title="Reporte de Ventas" 
        prepend-icon="mdi-chart-bar" 
        to="/dashboard/reportes" 
        value="reportes" 
      />

      <!-- LÍNEA DIVISORIA -->
      <v-divider class="my-3"></v-divider>

      <!-- SECCIÓN: Control de caja -->
<v-list-subheader class="text-uppercase font-weight-bold text-primary px-2 mb-1">
  Control de caja
</v-list-subheader>

<!-- Opción 1: Caja (Apertura y Cierre) -->
<v-list-item 
  title="Caja" 
  prepend-icon="mdi-safe" 
  to="/dashboard/caja" 
  value="caja" 
  class="mb-1"
/>

<!-- Opción 2: Historial de Turnos -->
<v-list-item 
  title="Historial de Turnos" 
  prepend-icon="mdi-history" 
  to="/dashboard/caja/historial" 
  value="historial-caja" 
/>

    </v-list>
  </v-navigation-drawer>
</template>
