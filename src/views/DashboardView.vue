<script setup>
import DashboardCrud from '../components/dashboardCrud.vue'
import DashboardContent from '../components/dashboardContent.vue'
import UserProfileDrawer from '../components/dashboardUserProfile.vue'
</script>

<template>
  <v-layout>
    
      <!-- 2. BARRA IZQUIERDA COMO componente -->
    <DashboardCrud />

    <!-- 2. BARRA DERECHA COMO componente -->
    <UserProfileDrawer />

    <!-- 3. ZONA CENTRAL COMO componente -->
    <DashboardContent/>
  </v-layout>
</template>