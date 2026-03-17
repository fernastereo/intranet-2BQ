<template >
  <!-- Page Header -->
  <div class="bg-gray-900">
    <div class="mx-auto px-4 py-3">
      <h1 class="text-xl font-bold text-white tracking-tight">Nueva Solicitud</h1>
    </div>
  </div>
  <NuevaSolicitud origen="oficina" />
</template>
<script setup>
  import NuevaSolicitud from '@/shared/components/solicitud/NuevaSolicitud.vue'
</script>