<script setup>
const accionesCrud = [
  { title: 'Crear', icon: 'mdi-plus', value: 'create' },
  { title: 'Consultar', icon: 'mdi-magnify', value: 'read' },
  { title: 'Modificar', icon: 'mdi-pencil', value: 'update' },
  { title: 'Eliminar', icon: 'mdi-delete', value: 'delete' }
]

const categorias = [
  { title: 'Usuarios', icon: 'mdi-account-group', value: 'usuarios' },
  { title: 'Artículos', icon: 'mdi-package-variant-closed', value: 'articulos' },
  { title: 'Clientes', icon: 'mdi-account-box', value: 'clientes' },
  { title: 'Ventas', icon: 'mdi-cash-register', value: 'ventas' }
]
</script>

<template>
  <v-navigation-drawer location="left" permanent class="bg-grey-lighten-4 pa-2">
    <div class="text-subtitle-1 font-weight-bold pa-3">Menú Principal</div>
    
    <v-divider class="mb-2"></v-divider>

    <v-list density="comfortable" nav>
      <v-list-group v-for="cat in categorias" :key="cat.value" :value="cat.value">
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props" :prepend-icon="cat.icon" :title="cat.title"></v-list-item>
        </template>
        
        <v-list-item 
          v-for="accion in accionesCrud" 
          :key="accion.value"
          :title="accion.title" 
          :value="`${cat.value}-${accion.value}`" 
          :prepend-icon="accion.icon"
        ></v-list-item>
      </v-list-group>
    </v-list>
  </v-navigation-drawer>
</template>