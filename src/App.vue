<script setup>
  import { RouterView } from 'vue-router'
  import { onMounted } from 'vue'
  import { useAppSettings } from '@/shared/composables/useAppSettings'

  const { fetchSettings } = useAppSettings()

  // Inicializar la configuración al arrancar la aplicación
  onMounted(() => {
    fetchSettings()
  })
</script>

<template>
  <RouterView />
</template>

<style scoped>

</style>
