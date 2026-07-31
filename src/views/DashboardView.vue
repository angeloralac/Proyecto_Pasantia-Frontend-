<script setup>
import DashboardCrud from '../components/dashboardCrud.vue'
import UserProfileDrawer from '../components/dashboardUserProfile.vue'
// Eliminamos la importación de DashboardContent porque el contenido ahora será dinámico
</script>

<template>
  <v-layout>
    <DashboardCrud />

    <UserProfileDrawer />
   
    <v-main>
      <router-view></router-view> 
    </v-main>
  </v-layout>
</template>