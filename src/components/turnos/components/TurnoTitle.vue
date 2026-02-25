<template>
  <div class="flex items-center gap-2">
    <h1 class="text-xl font-semibold leading-6 text-gray-900">{{ isEdit ? 'Turno ' + formattedTurnoNumber : 'Nuevo Turno' }}</h1>
    <Badge v-if="isEdit && turnoData?.estado?.nombre" :color="turnoData.estado.class">{{ turnoData.estado.nombre }}</Badge>
  </div>
</template>

<script setup>
import { computed, toRefs } from 'vue';
import Badge from '@/shared/components/Badge.vue';

const props = defineProps({
  isEdit: {
    type: Boolean,
    default: false
  },
  turnoData: {
    type: Object,
    required: true
  }
})

// Desestructurar las props manteniendo la reactividad
const { isEdit, turnoData } = toRefs(props)
console.log("🚀 ~ isEdit:", isEdit.value)
console.log("🚀 ~ turnoData:", turnoData.value.estado)

const formattedTurnoNumber = computed(() => {
  if (!turnoData.value?.numturno) return ''
  return `${turnoData.value.numturno.toString().padStart(4, '0')}-${turnoData.value.vigencia}`
})
</script>

<style scoped>
</style>