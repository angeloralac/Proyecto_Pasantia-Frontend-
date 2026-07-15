<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import apiClient from '../api/axios' 

const router = useRouter()


const nombre = ref('')
const email = ref('')
const contrasena = ref('')

// Estados de control para la petición
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
  <div>
    <h2>Registro de Usuario</h2>
    
    <p v-if="errorMsg" style="color: red; font-weight: bold;">{{ errorMsg }}</p>

    <form @submit.prevent="handleRegister">
      <div>
        <label>Nombre:</label>
        <input v-model="nombre" type="text" required :disabled="isLoading" />
      </div>
      
      <div>
        <label>Correo:</label>
        <input v-model="email" type="email" required :disabled="isLoading" />
      </div>

      <div>
        <label>Contraseña:</label>
        <input v-model="contrasena" type="password" required :disabled="isLoading" />
      </div>

      <button type="submit" :disabled="isLoading">
        {{ isLoading ? 'Registrando...' : 'Registrarme' }}
      </button>
    </form>
    
    <p>
      ¿Ya tienes cuenta? 
      <router-link to="/login">Inicia sesión aquí</router-link>
    </p>
  </div>
</template>