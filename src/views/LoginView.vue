<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import apiClient from '../api/axios'

const router = useRouter()

const email = ref('')
const contrasena = ref('')


const errorMsg = ref('')
const isLoading = ref(false)

const handleLogin = async () => {
  errorMsg.value = ''
  isLoading.value = true
  
  try {
    const response = await apiClient.post('/users/login', {
      email: email.value,
      contrasena: contrasena.value
    
    })
    const token = response.data.user.token
    localStorage.setItem('token', token)
    localStorage.setItem('email', response.data.user.email)
    localStorage.setItem('nombre', response.data.user.name)
    localStorage.setItem('id', response.data.user.id)
    alert('¡Bienvenido al sistema!')
    router.push('/dashboard') 

  } catch (error) {
    console.error(error)
    errorMsg.value = error.response?.data?.mensaje || 'Error al iniciar sesión'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <!-- Un contenedor simple con un fondo gris bajito -->
  <v-container class="bg-grey-lighten-4 pa-6 rounded-lg" style="max-width: 500px; margin: 50px auto !important;">
    
    <h2>Iniciar Sesión</h2>
    
    <!-- Alerta roja de error sencilla (solo sale si hay un errorMsg) -->
    <!-- Alerta roja de error con botón de cerrar que limpia el mensaje -->
<v-alert 
  v-if="errorMsg" 
  type="error" 
  class="my-4"
  closable
  @click:close="errorMsg = ''"
>
  {{ errorMsg }}
</v-alert>

    <!-- Tu formulario conectado a tu función handleLogin -->
    <v-form @submit.prevent="handleLogin">
      


      <!-- Campo de correo simple -->
      <v-text-field
        v-model="email"
        label="Correo:"
        type="email"
        variant="outlined"
        :disabled="isLoading"
        required
      ></v-text-field>

      <!-- Campo de contraseña simple -->
      <v-text-field
        v-model="contrasena"
        label="Contraseña:"
        type="password"
        variant="outlined"
        :disabled="isLoading"
        required
      ></v-text-field>

      <!-- Botón de Vuetify con tu animación de carga -->
      <v-btn 
        type="submit" 
        color="primary" 
        block 
        :loading="isLoading"
        :disabled="isLoading"
      >
        Ingresar
      </v-btn>
    </v-form>

  
    <p class="mt-4 text-center">
      ¿No tienes cuenta? 
      <router-link to="/register">Regístrate aquí</router-link>
    </p>

  </v-container>
</template>