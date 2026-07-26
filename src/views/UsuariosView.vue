<script setup>
import { onMounted, ref } from 'vue'
import { useCrud } from '../composables/useCrud'

const {
  items: usuarios,
  dialogVisible,
  modoEdicion,
  formulario,
  obtenerItems: obtenerUsuarios,
  abrirModalCrear,
  abrirModalEditar,
  guardarItem: guardarUsuario,
  eliminarItem: eliminarItemComposable
} = useCrud('/users')

// Obtenemos el ID del usuario logueado guardado en el navegador
const usuarioLogeadoId = ref(localStorage.getItem('userId') || null)

const headers = [
  { title: 'ID', key: 'id' },
  { title: 'Nombre', key: 'nombre' },
  { title: 'Email', key: 'email' },
  { title: 'Acciones', key: 'acciones', sortable: false }
]

// Función personalizada para validar antes de eliminar en el frontend
const eliminarUsuario = async (id) => {
  if (parseInt(id) === parseInt(usuarioLogeadoId.value)) {
    alert("¡Acción no permitida! No puedes eliminar tu propia cuenta.")
    return
  }
  await eliminarItemComposable(id)
}

onMounted(() => {
  obtenerUsuarios()
})
</script>

<template>
  <v-container>
    
    <!-- Botón Nuevo -->
    <v-btn color="primary" class="mb-4" prepend-icon="mdi-plus" @click="abrirModalCrear">
      Nuevo Usuario
    </v-btn>

    <!-- Tabla -->
    <v-data-table :headers="headers" :items="usuarios">
      <template v-slot:item.acciones="{ item }">
        <v-icon color="blue" class="mr-3" @click="abrirModalEditar(item)">mdi-pencil</v-icon>
        
        <!-- Si es tu propio usuario, mostramos un icono bloqueado; si no, el de eliminar -->
        <v-icon 
          v-if="item.id !== Number(usuarioLogeadoId)" 
          color="red" 
          @click="eliminarUsuario(item.id)"
        >
          mdi-delete
        </v-icon>
        <v-icon v-else color="grey" disabled title="No puedes eliminar tu propio usuario">
          mdi-cancel
        </v-icon>
      </template>
    </v-data-table>

    <!-- Modal para Crear / Editar -->
    <v-dialog v-model="dialogVisible" max-width="500px">
      <v-card>
        <v-card-title>{{ modoEdicion ? 'Editar Usuario' : 'Crear Usuario' }}</v-card-title>
        
        <v-card-text>
          <v-text-field v-model="formulario.nombre" label="Nombre" required></v-text-field>
          <v-text-field v-model="formulario.email" label="Correo Electrónico" type="email" required></v-text-field>
          <v-text-field 
            v-model="formulario.contrasena" 
            label="Contraseña" 
            type="password" 
            :required="!modoEdicion"
            :hint="modoEdicion ? 'Deja en blanco si no deseas cambiar la contraseña' : ''"
            persistent-hint
          ></v-text-field>
        </v-card-text>

        <v-card-actions>
          <v-btn color="error" @click="dialogVisible = false">Cancelar</v-btn>
          <v-btn color="success" @click="guardarUsuario">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>