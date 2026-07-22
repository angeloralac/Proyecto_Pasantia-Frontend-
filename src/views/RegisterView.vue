<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import apiClient from '../api/axios' 

const router = useRouter()

const nombre = ref('')
const email = ref('')
const contrasena = ref('')

const errorMsg = ref('')
const isLoading = ref(false)

const handleRegister = async () => {
  errorMsg.value = ''
  isLoading.value = true

  try {

    await apiClient.post('/users', {
      nombre: nombre.value,
      email: email.value,
      contrasena: contrasena.value
    })
    alert('¡Usuario registrado con éxito! Ahora puedes iniciar sesión.')
    router.push('/login') 
    
  } catch (error) {
    console.error(error)
    errorMsg.value = error.response?.data?.mensaje || 'Error al registrar el usuario'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <!-- Contenedor simple, centrado automáticamente con mx-auto y margen arriba/abajo -->
  <v-container class="bg-grey-lighten-4 pa-6 rounded-lg mx-auto" style="max-width: 450px; margin-top: 50px; margin-bottom: 50px;">
    
    <h2>Registro de Usuario</h2>
    
    <!-- Alerta roja de error que se cierra correctamente al dar clic en la X -->
    <v-alert 
      v-if="errorMsg" 
      type="error" 
      class="my-4"
      closable
      @click:close="errorMsg = ''"
    >
      {{ errorMsg }}
    </v-alert>

    <!-- Tu formulario conectado a tu función handleRegister -->
    <v-form @submit.prevent="handleRegister">
      
      <!-- Campo de Nombre -->
      <v-text-field
        v-model="nombre"
        label="Nombre:"
        type="text"
        variant="outlined"
        :disabled="isLoading"
        required
      ></v-text-field>
      
      <!-- Campo de Correo -->
      <v-text-field
        v-model="email"
        label="Correo:"
        type="email"
        variant="outlined"
        :disabled="isLoading"
        required
      ></v-text-field>

      <!-- Campo de Contraseña -->
      <v-text-field
        v-model="contrasena"
        label="Contraseña:"
        type="password"
        variant="outlined"
        :disabled="isLoading"
        required
      ></v-text-field>

      <!-- Botón de Vuetify con animación de carga integrada -->
      <v-btn 
        type="submit" 
        color="primary" 
        block 
        :loading="isLoading"
        :disabled="isLoading"
      >
        Registrarme
      </v-btn>
    </v-form>
    
    <!-- Enlace inferior para regresar al Login -->
    <p class="mt-4 text-center">
      ¿Ya tienes cuenta? 
      <router-link to="/login">Inicia sesión aquí</router-link>
    </p>

  </v-container>
</template>