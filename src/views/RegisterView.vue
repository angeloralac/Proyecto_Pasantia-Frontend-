<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUser } from '../composables/useUser' 

const router = useRouter()

const { createUser, isLoading, errorResponse } = useUser()

const payload = ref({
  nombre: '',
  email: '',
  contrasena: ''
})

const handleRegister = async () => {
  await createUser(payload.value)
  if (!errorResponse.value) {
    alert('¡Usuario registrado con éxito! Ahora puedes iniciar sesión.')
    router.push('/login') 
  }

}
</script>

<template>
  <v-container class="bg-grey-lighten-4 pa-6 rounded-lg mx-auto" style="max-width: 450px; margin-top: 50px; margin-bottom: 50px;">
    
    <h2>Registro de Usuario</h2>
    
  
    <v-alert 
      v-if="errorResponse" 
      type="error" 
      class="my-4"
      closable
      @click:close="errorResponse = null"
    >
      {{ errorResponse }}
    </v-alert>

    <v-form @submit.prevent="handleRegister">
      
      <v-text-field
        v-model="payload.nombre"
        label="Nombre:"
        type="text"
        variant="outlined"
        :disabled="isLoading"
        required
      ></v-text-field>
      
      <v-text-field
        v-model="payload.email"
        label="Correo:"
        type="email"
        variant="outlined"
        :disabled="isLoading"
        required
      ></v-text-field>

      <v-text-field
        v-model="payload.contrasena"
        label="Contraseña:"
        type="password"
        variant="outlined"
        :disabled="isLoading"
        required
      ></v-text-field>

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
    
    <p class="mt-4 text-center">
      ¿Ya tienes cuenta? 
      <router-link to="/login">Inicia sesión aquí</router-link>
    </p>

  </v-container>
</template>