<script setup>
import { useUser } from '../composables/useUser'
const { loginUser, isLoading, errorResponse, handleLogin, payload } = useUser()
</script>

<template>
  <v-container class="bg-grey-lighten-4 pa-6 rounded-lg" style="max-width: 500px; margin: 50px auto !important;">

    <h2>Iniciar Sesión</h2>

    <v-alert v-if="errorResponse" type="error" class="my-4" closable @click:close="errorResponse = null">
      {{ errorResponse }}
    </v-alert>

    <v-form @submit.prevent="handleLogin">


      <v-text-field v-model="payload.email" label="Correo:" type="email" variant="outlined" :disabled="isLoading"
        required></v-text-field>

      <v-text-field v-model="payload.contrasena" label="Contraseña:" type="password" variant="outlined"
        :disabled="isLoading" required></v-text-field>

      <v-btn type="submit" color="primary" block :loading="isLoading" :disabled="isLoading">
        Ingresar
      </v-btn>
    </v-form>

    <p class="mt-4 text-center">
      ¿No tienes cuenta?
      <router-link to="/register">Regístrate aquí</router-link>
    </p>

  </v-container>
</template>