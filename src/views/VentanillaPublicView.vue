<template>
  <div style="min-height: 100vh; margin: 0; display: grid; grid-template-rows: auto 1fr auto;">
    <!-- Navbar -->
    <VentanillaNavbar />

    <!-- Contenido principal -->
    <div class="flex-grow">
      <HomeView />
    </div>


    <!-- Footer -->
    <VentanillaFooter />
  </div>
</template>

<script setup>
  import VentanillaNavbar from '@/components/ventanillaPublic/components/VentanillaNavbar.vue'
  import VentanillaFooter from '@/components/ventanillaPublic/components/VentanillaFooter.vue'
  import HomeView from '@/components/ventanillaPublic/views/HomeView.vue'
</script>

<style scoped>
</style>