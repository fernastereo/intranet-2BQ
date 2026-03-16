<template >
  <!-- Page Header -->
  <div class="bg-gray-900">
    <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-5">
      <h1 class="text-2xl md:text-2xl font-bold text-white tracking-tight">Nueva Solicitud</h1>
    </div>
  </div>
  <NuevaSolicitud origen="oficina" />
</template>
<script setup>
  import NuevaSolicitud from '@/shared/components/solicitud/NuevaSolicitud.vue'
</script>