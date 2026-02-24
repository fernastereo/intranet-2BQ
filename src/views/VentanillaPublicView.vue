<template>
  <div style="min-height: 100vh; margin: 0; display: grid; grid-template-rows: auto 1fr auto;">
    <!-- Navbar -->
    <VentanillaNavbar />

    <!-- Contenido principal -->
    <section class="my-auto">
      <div class="container-fluid">
        <div class="row">
          <h1 class="titulo">Ventanilla Public 5.0</h1>
          <h2>La Venganza Final!</h2>
          <!-- <HomeView /> -->
        </div>
      </div>
    </section>

    <!-- Footer -->
    <VentanillaFooter />
  </div>
</template>

<script setup>
  import VentanillaNavbar from '@/components/ventanillaPublic/components/VentanillaNavbar.vue'
  import VentanillaFooter from '@/components/ventanillaPublic/components/VentanillaFooter.vue'
  // import HomeView from '@/components/ventanillaPublic/views/HomeView.vue'
</script>

<style scoped>
</style>