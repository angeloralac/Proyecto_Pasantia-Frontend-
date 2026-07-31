<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const nombreUsuario = ref('')
const emailUsuario = ref('')
const idUsuario = ref('')

onMounted(() => {

  const userString = localStorage.getItem('user')
  if (userString) {
    try {
      const userObj = JSON.parse(userString)
      nombreUsuario.value = userObj.nombre || userObj.name || 'Usuario'
      emailUsuario.value = userObj.email
      idUsuario.value = userObj.id 
    } catch (error) {
      console.error("Error al leer los datos del usuario:", error)
    }
  }
})

const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  
  alert('Saliendo del sistema...')
  router.push('/login')
}
</script>

<template>
  <v-navigation-drawer location="right" permanent class="pa-4" width="300">
    <div class="text-center mt-4">
      <v-avatar color="grey-lighten-2" size="70" class="mb-3">
        <v-icon icon="mdi-account" size="36" color="grey-darken-1"></v-icon>
      </v-avatar>
      
      <h3 class="text-h6 font-weight-bold text-capitalize">
        ¡Bienvenido, {{ nombreUsuario }}!
      </h3>
      
      <div class="my-3 bg-grey-lighten-4 rounded pa-2 mx-2">
        <p class="text-body-2 text-grey-darken-2 mb-1 d-flex align-center justify-center">
          <v-icon icon="mdi-email-outline" size="small" class="mr-2"></v-icon>
          {{ emailUsuario }}
        </p>
        <p class="text-caption text-grey-darken-1 d-flex align-center justify-center">
          <v-icon icon="mdi-identifier" size="small" class="mr-2"></v-icon>
          Usuario ID: {{ idUsuario }}
        </p>
      </div>

      <p class="text-caption text-grey">Sesión activa</p>
    </div>
    
    <v-divider class="my-4"></v-divider>
    
    <v-btn 
      color="error" 
      block 
      variant="tonal" 
      class="mt-4" 
      @click="handleLogout"
    >
      Cerrar Sesión
    </v-btn>
  </v-navigation-drawer>
</template>