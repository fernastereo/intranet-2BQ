<template>
  <div style="min-height: 100vh; margin: 0; display: grid; grid-template-rows: auto 1fr auto;">
    <VentanillaNavbar />
    <RouterView />
    <VentanillaFooter />
  </div>
</template>

<script setup>
  import { RouterView } from 'vue-router'
  import VentanillaNavbar from '@/public_app/ventanilla/components/VentanillaNavbar.vue'
  import VentanillaFooter from '@/public_app/ventanilla/components/VentanillaFooter.vue'
</script>

<style scoped>
</style>