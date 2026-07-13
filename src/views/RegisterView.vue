<script setup>
import {ref} from 'vue'

const name = ref('')
const email = ref('')
const password = ref('')

const handleRegister = () => {
    console.log('Datos listos para sequelize:', 
    { name: name.value, 
        email: email.value, 
        password: 
        password.value })
}
</script>

<template>
  <div>
    <h2>Registro de Usuario</h2>
    
    <form @submit.prevent="handleRegister">
      <div>
        <label>Nombre:</label>
        <input v-model="nombre" type="text" required />
      </div>
      
      <div>
        <label>Correo:</label>
        <input v-model="email" type="email" required />
      </div>

      <div>
        <label>Contraseña:</label>
        <input v-model="contrasena" type="password" required />
      </div>

      <button type="submit">Registrarme</button>
    </form>
    
    <p>
      ¿Ya tienes cuenta? 
      <router-link to="/login">Inicia sesión aquí</router-link>
    </p>
  </div>
</template>