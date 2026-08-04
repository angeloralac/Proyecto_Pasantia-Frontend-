<script setup>
import { useVenta } from '@/composables/useVenta'

const { snackbar } = useVenta()
</script>

<template>
  <v-snackbar
    v-model="snackbar.show"
    :color="snackbar.color"
    timeout="3000"
    location="top right"
  >
    {{ snackbar.message }}
  </v-snackbar>
</template>