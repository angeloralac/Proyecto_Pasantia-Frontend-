<script setup>
import DashboardCrud from '../components/dashboardCrud.vue'
import DashboardContent from '../components/dashboardContent.vue'
import UserProfileDrawer from '../components/dashboardUserProfile.vue'
</script>

<template>
  <v-layout>
    <DashboardCrud />

    <UserProfileDrawer />
   
    <DashboardContent/>
  </v-layout>
</template>