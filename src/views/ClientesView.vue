<script setup>
import { onMounted } from 'vue'
import { useCrud } from '../composables/useCrud'

// Usamos el composable genérico con la ruta de clientes
const {
  items: clientes,
  dialogVisible,
  modoEdicion,
  formulario,
  obtenerItems: obtenerClientes,
  abrirModalCrear,
  abrirModalEditar,
  guardarItem: guardarCliente,
  eliminarItem: eliminarCliente
} = useCrud('/clientes')

const headers = [
  { title: 'ID', key: 'id' },
  { title: 'Nombre', key: 'nombre' },
  { title: 'NIT', key: 'nit' },
  { title: 'Teléfono', key: 'telefono' },
  { title: 'Dirección', key: 'direccion' },
  { title: 'Acciones', key: 'acciones', sortable: false }
]

onMounted(() => {
  obtenerClientes()
})
</script>

<template>
  <v-container>
    
    <!-- Botón Nuevo -->
    <v-btn color="primary" class="mb-4" prepend-icon="mdi-plus" @click="abrirModalCrear">
      Nuevo Cliente
    </v-btn>

    <!-- Tabla -->
    <v-data-table :headers="headers" :items="clientes">
      <template v-slot:item.acciones="{ item }">
        <v-icon color="blue" class="mr-3" @click="abrirModalEditar(item)">mdi-pencil</v-icon>
        <v-icon color="red" @click="eliminarCliente(item.id)">mdi-delete</v-icon>
      </template>
    </v-data-table>

    <!-- Modal para Crear / Editar -->
    <v-dialog v-model="dialogVisible" max-width="500px">
      <v-card>
        <v-card-title>{{ modoEdicion ? 'Editar Cliente' : 'Crear Cliente' }}</v-card-title>
        
        <v-card-text>
          <v-text-field v-model="formulario.nombre" label="Nombre" required></v-text-field>
          <v-text-field v-model="formulario.nit" label="NIT" required></v-text-field>
          <v-text-field v-model="formulario.telefono" label="Teléfono"></v-text-field>
          <v-text-field v-model="formulario.direccion" label="Dirección"></v-text-field>
        </v-card-text>

        <v-card-actions>
          <v-btn color="error" @click="dialogVisible = false">Cancelar</v-btn>
          <v-btn color="success" @click="guardarCliente">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>