<template>
  <SolicitudExitosa v-if="submitted" :resultData="resultData" @reset="resetForm" />

  <div v-else :class="[isOficina ? 'max-w-6xl' : 'max-w-4xl mx-auto', 'px-4 sm:px-6 lg:px-8 py-8 -mt-4']">
    <form @submit.prevent="handleSubmit" novalidate class="flex flex-col gap-6">

      <!-- Section 1: Datos del Solicitante -->
      <section class="bg-white rounded-lg shadow-sm p-6">
        <DatosSolicitante v-model:form="form" :errors="errors" :tiposResponsable="tiposResponsable" />
      </section>

      <!-- Section 2: Datos de la Solicitud -->
      <section class="bg-white rounded-lg shadow-sm p-6">
        <DatosSolicitud v-model:form="form" :errors="errors" :origen="origen" @update:requiereExpediente="requiereExpediente = $event" />
      </section>

      <!-- Section 3: Documentos Adjuntos -->
      <section class="bg-white rounded-lg shadow-sm p-6">
        <DatosAdjuntos v-model:form="form" />
      </section>

      <!-- Submit Button -->
      <div class="flex items-center justify-end gap-4 pb-8">
        <router-link :to="isOficina ? { name: 'ventanilla' } : '/'" class="inline-flex items-center justify-center gap-2 rounded-lg bg-white border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50 transition-colors duration-200">Cancelar</router-link>
        <button
          type="submit"
          class="inline-flex items-center justify-center gap-2 rounded-lg bg-[#FFA800] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#E69500] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="loading"
        >
          <svg v-if="loading" class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" stroke-opacity="0.25" />
            <path d="M12 2a10 10 0 0 1 10 10" stroke-opacity="1" />
          </svg>
          <svg v-else class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
          {{ loading ? 'Enviando...' : 'Enviar Solicitud' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
  import SolicitudExitosa from '@/shared/components/solicitud/SolicitudExitosa.vue'
  import DatosSolicitante from '@/shared/components/solicitud/DatosSolicitante.vue'
  import DatosSolicitud from '@/shared/components/solicitud/DatosSolicitud.vue'
  import DatosAdjuntos from '@/shared/components/solicitud/DatosAdjuntos.vue'
  import { computed } from 'vue'
  import { useSolicitudForm } from '@/shared/composables/useSolicitudForm'

  const props = defineProps({
    origen: { type: String, required: true },
  })

  const isOficina = computed(() => props.origen === 'oficina')

  const {
    form,
    errors,
    submitted,
    resultData,
    requiereExpediente,
    tiposResponsable,
    loading,
    handleSubmit,
    resetForm,
  } = useSolicitudForm(props.origen)
</script>
