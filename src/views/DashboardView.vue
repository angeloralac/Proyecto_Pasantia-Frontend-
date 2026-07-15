<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router';

const router = useRouter()

const handleLogout = () => {
  localStorage.removeItem ('token')
  alert('Saliendo del sistema...')
  router.push('/login')

}
</script>

<template>
  <div>
    <h2>Dashboard (Punto de Venta)</h2>
    <p>¡Bienvenido al sistema! Has iniciado sesión con éxito.</p>
    <button 
    @click="handleLogout">Cerrar Sesion
  </button>
  
  </div>
</template>