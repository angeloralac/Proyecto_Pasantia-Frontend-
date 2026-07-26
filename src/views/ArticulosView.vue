<script setup>
import { onMounted } from 'vue'
import { useCrud } from '../composables/useCrud'

// Invocamos el composable genérico pasándole la ruta de artículos
const {
  items: articulos,
  dialogVisible,
  modoEdicion,
  formulario,
  obtenerItems: obtenerArticulos,
  abrirModalCrear,
  abrirModalEditar,
  guardarItem: guardarArticulo,
  eliminarItem: eliminarArticulo
} = useCrud('/articulos')

const headers = [
  { title: 'ID', key: 'id' },
  { title: 'Cód. Barras', key: 'codigo_barras' },
  { title: 'Nombre', key: 'nombre' },
  { title: 'Descripción', key: 'descripcion' },
  { title: 'Stock', key: 'stock' },
  { title: 'Precio Venta', key: 'precio_venta' },
  { title: 'Precio Costo', key: 'precio_costo' },
  { title: 'Acciones', key: 'acciones', sortable: false }
]

onMounted(() => {
  obtenerArticulos()
})
</script>

<template>
  <v-container>
    
    <!-- Botón Nuevo -->
    <v-btn color="primary" class="mb-4" prepend-icon="mdi-plus" @click="abrirModalCrear">
      Nuevo Artículo
    </v-btn>

    <!-- Tabla -->
    <v-data-table :headers="headers" :items="articulos">
      <template v-slot:item.acciones="{ item }">
        <v-icon color="blue" class="mr-3" @click="abrirModalEditar(item)">mdi-pencil</v-icon>
        <v-icon color="red" @click="eliminarArticulo(item.id)">mdi-delete</v-icon>
      </template>
    </v-data-table>

    <!-- Modal Simple -->
    <v-dialog v-model="dialogVisible" max-width="500px">
      <v-card>
        <v-card-title>{{ modoEdicion ? 'Editar Artículo' : 'Crear Artículo' }}</v-card-title>
        
        <v-card-text>
          <v-text-field v-model="formulario.codigo_barras" label="Código de Barras" type="number"></v-text-field>
          <v-text-field v-model="formulario.nombre" label="Nombre"></v-text-field>
          <v-text-field v-model="formulario.descripcion" label="Descripción"></v-text-field>
          <v-text-field v-model="formulario.stock" label="Stock" type="number"></v-text-field>
          <v-text-field v-model="formulario.precio_venta" label="Precio de Venta" type="number"></v-text-field>
          <v-text-field v-model="formulario.precio_costo" label="Precio de Costo" type="number"></v-text-field>
        </v-card-text>

        <v-card-actions>
          <v-btn color="error" @click="dialogVisible = false">Cancelar</v-btn>
          <v-btn color="success" @click="guardarArticulo">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>