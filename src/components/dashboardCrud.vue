<script setup>
const categorias = [
  { title: 'Usuarios', icon: 'mdi-account-group', value: 'usuarios', to: '/dashboard/usuarios' },
  { title: 'Artículos', icon: 'mdi-package-variant-closed', value: 'articulos', to: '/dashboard/articulos' },
  { title: 'Clientes', icon: 'mdi-account-box', value: 'clientes', to: '/dashboard/clientes' },
  { title: 'Ventas', icon: 'mdi-cash-register', value: 'ventas', to: '/dashboard/ventas' }
]
</script>

<template>
  <v-navigation-drawer location="left" permanent class="bg-grey-lighten-4 pa-2">
    <div class="text-subtitle-1 font-weight-bold pa-3">Menú Principal</div>
    <v-divider class="mb-2"></v-divider>

    <v-list density="comfortable" nav>
      <!-- Un solo botón directo por categoría -->
      <v-list-item 
        v-for="cat in categorias" 
        :key="cat.value"
        :prepend-icon="cat.icon" 
        :title="cat.title"
        :to="cat.to"
        color="primary"
      ></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>