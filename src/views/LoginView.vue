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
  <div>
    <h2>Iniciar Sesión</h2>
    
    <p v-if="errorMsg" style="color: red; font-weight: bold;">{{ errorMsg }}</p>

    <form @submit.prevent="handleLogin">
      <div>
        <label>Correo:</label>
        <input v-model="email" type="email" required :disabled="isLoading" />
      </div>

      <div>
        <label>Contraseña:</label>
        <input v-model="contrasena" type="password" required :disabled="isLoading" />
      </div>

      <button type="submit" :disabled="isLoading">
        {{ isLoading ? 'Ingresando...' : 'Ingresar' }}
      </button>
    </form>

    <p>
      ¿No tienes cuenta? 
      <router-link to="/register">Regístrate aquí</router-link>
    </p>
  </div>
</template>
