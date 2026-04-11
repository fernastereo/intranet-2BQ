<template >
  <PageHeader :isLoading="isLoading" @refresh="fetchData" />
  <NuevaSolicitud origen="oficina" />
</template>
<script setup>
  import NuevaSolicitud from '@/shared/components/solicitud/NuevaSolicitud.vue'
  import PageHeader from '@/shared/components/common/PageHeader.vue'
</script>