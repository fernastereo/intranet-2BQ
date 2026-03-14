<template>
  <div class="flex items-start gap-3" :class="isLast ? '' : 'pb-6'">
    <div class="relative flex flex-col items-center">
      <div
        class="w-3 h-3 rounded-full border-2 flex-shrink-0"
        :class="active ? 'bg-[#1A4972] border-[#1A4972]' : 'bg-white border-gray-300'"
      ></div>
      <div v-if="!isLast" class="w-0.5 flex-1 mt-1" :class="active ? 'bg-blue-200' : 'bg-gray-300'"></div>
    </div>
    <div class="-mt-0.5">
      <p class="text-sm font-medium" :class="active ? 'text-gray-900' : 'text-gray-500'">{{ label }}</p>
      <p v-if="formattedDate" class="text-xs text-gray-500 mt-0.5">{{ formattedDate }}</p>
      <p v-else class="text-xs text-gray-500 mt-0.5 italic">Pendiente</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  label: string
  date?: string
  active?: boolean
  isLast?: boolean
}>(), {
  active: false,
  isLast: false
})

const formattedDate = computed(() => {
  if (!props.date) return ''
  const d = new Date(props.date + 'T00:00:00')
  return d.toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: 'numeric' })
})
</script>
