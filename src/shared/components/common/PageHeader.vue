<template>
  <div class="bg-gray-900">
    <div class="mx-auto px-4 py-3 sm:px-6 lg:px-8 flex items-center justify-between">
      <div>
        <Breadcrumb v-if="resolvedBreadcrumbs.length > 1" :items="resolvedBreadcrumbs" class="mb-1" />
      </div>
      <button
        type="button"
        @click="refresh"
        class="rounded-lg p-2 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
        title="Actualizar datos"
      >
        <ArrowPathIcon class="h-5 w-5" :class="{ 'animate-spin': isLoading }" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ArrowPathIcon } from '@heroicons/vue/24/outline'
import Breadcrumb from '@/shared/components/common/Breadcrumb.vue'
import { useBreadcrumb } from '@/shared/composables/useBreadcrumb'

const props = defineProps({
  isLoading: {
    type: Boolean,
    default: false
  },
  // Override manual: si se pasa, tiene prioridad sobre la detección automática
  breadcrumbs: {
    type: Array,
    default: null
  }
})

const { breadcrumbs: autoBreadcrumbs } = useBreadcrumb()

// Usar prop manual si se pasa, si no usar detección automática por ruta
const resolvedBreadcrumbs = computed(() => props.breadcrumbs ?? autoBreadcrumbs.value)

// Emitir evento de refresh para ser ejecutado en el componente padre
const emit = defineEmits(['refresh'])
const refresh = () => {
  emit('refresh')
}
</script>
