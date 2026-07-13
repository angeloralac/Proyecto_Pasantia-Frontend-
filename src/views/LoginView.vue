<script setup>
import { ref } from 'vue'

const email = ref('')
const contrasena = ref('')

const handleLogin = () => {
  console.log('Datos listos para autenticar:', {
    email: email.value,
    contrasena: contrasena.value
  })
}
</script>

<template>
  <div>
    <h2>Iniciar Sesión</h2>
    
    <form @submit.prevent="handleLogin">
      <div>
        <label>Correo:</label>
        <input v-model="email" type="email" required />
      </div>

      <div>
        <label>Contraseña:</label>
        <input v-model="contrasena" type="password" required />
      </div>

      <button type="submit">Ingresar</button>
    </form>

    <p>
      ¿No tienes cuenta? 
      <router-link to="/register">Regístrate aquí</router-link>
    </p>
  </div>
</template>