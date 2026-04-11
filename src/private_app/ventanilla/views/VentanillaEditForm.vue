<template>
  <PageHeader :isLoading="loading" />

  <!-- Error de carga -->
  <div v-if="loadError" class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 text-center">
    <div class="bg-white rounded-lg shadow-sm p-6 max-w-md mx-auto py-12">
      <div class="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      </div>
      <h2 class="text-lg font-bold text-gray-900 mb-2">Error al cargar</h2>
      <p class="text-sm text-gray-600 mb-6">No se pudo cargar la solicitud.</p>
      <router-link :to="{ name: 'ventanilla' }" class="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1A4972] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#143a5c] transition-colors duration-200">
        Volver a Ventanilla
      </router-link>
    </div>
  </div>

  <!-- Spinner de carga inicial -->
  <div v-else-if="loadingData" class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 text-center">
    <div class="w-12 h-12 rounded-full border-4 border-blue-200 border-t-[#1A4972] animate-spin mx-auto mb-4"></div>
    <p class="text-gray-600">Cargando datos de la solicitud...</p>
  </div>

  <!-- Formulario de edición -->
  <div v-else class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
    <form @submit.prevent="onSubmit" novalidate>
      <div class="bg-white rounded-lg shadow-sm p-6">

        <!-- Navegación pills -->
        <div class="flex flex-wrap items-center gap-2 -mx-6 -mt-6 px-6 py-4 bg-gray-50 border-b border-gray-200 rounded-t-lg mb-6">
          <button
            v-for="(tab, index) in tabs"
            :key="tab.id"
            type="button"
            @click="activeTab = tab.id"
            class="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1A4972] focus-visible:ring-offset-2"
            :class="[
              activeTab === tab.id
                ? 'bg-[#1A4972] text-white shadow-md shadow-[#1A4972]/25'
                : tabHasErrors(tab.id)
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-white text-gray-500 hover:bg-gray-100 shadow-sm'
            ]"
          >
            <span
              class="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold transition-colors"
              :class="[
                activeTab === tab.id
                  ? 'bg-white/20 text-white'
                  : tabHasErrors(tab.id)
                    ? 'bg-red-200 text-red-700'
                    : 'bg-gray-100 text-gray-500'
              ]"
            >
              <svg
                v-if="tabHasErrors(tab.id) && activeTab !== tab.id"
                class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                stroke-linecap="round" stroke-linejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span v-else>{{ index + 1 }}</span>
            </span>
            {{ tab.label }}
          </button>
        </div>

        <!-- Tab: Solicitante -->
        <div v-show="activeTab === 'solicitante'" class="animate-fadeIn">
          <DatosSolicitante
            v-model:form="form"
            :errors="errors"
            :tiposResponsable="tiposResponsable"
          />
        </div>

        <!-- Tab: Solicitud -->
        <div v-show="activeTab === 'solicitud'" class="animate-fadeIn">
          <DatosSolicitud
            v-model:form="form"
            :errors="errors"
            origen="oficina"
            @update:requiereExpediente="requiereExpediente = $event"
          />
        </div>

        <!-- Tab: Adjuntos -->
        <div v-show="activeTab === 'adjuntos'" class="animate-fadeIn">
          <DatosAdjuntos v-model:form="form" />
        </div>

        <!-- Tab Extra 1 (placeholder) -->
        <div v-show="activeTab === 'extra1'" class="animate-fadeIn py-12 text-center text-gray-400 text-sm">
          En construcción
        </div>

        <!-- Tab Extra 2 (placeholder) -->
        <div v-show="activeTab === 'extra2'" class="animate-fadeIn py-12 text-center text-gray-400 text-sm">
          En construcción
        </div>

      </div>

      <div class="flex items-center justify-end gap-4 mt-6 pb-8">
        <router-link
          :to="{ name: 'ventanilla' }"
          class="inline-flex items-center justify-center gap-2 rounded-lg bg-white border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50 transition-colors duration-200"
        >
          Cancelar
        </router-link>
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
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v14a2 2 0 0 1-2 2z" />
            <polyline points="17 21 17 13 7 13 7 21" />
            <polyline points="7 3 7 8 15 8" />
          </svg>
          {{ loading ? 'Guardando...' : 'Guardar Cambios' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import Swal from 'sweetalert2'
  import PageHeader from '@/shared/components/common/PageHeader.vue'
  import DatosSolicitante from '@/shared/components/solicitud/DatosSolicitante.vue'
  import DatosSolicitud from '@/shared/components/solicitud/DatosSolicitud.vue'
  import DatosAdjuntos from '@/shared/components/solicitud/DatosAdjuntos.vue'
  import { useSolicitudEditForm } from '@/shared/composables/useSolicitudEditForm'

  const props = defineProps({
    id: { type: String, required: true }
  })

  const router = useRouter()

  const tabs = [
    { id: 'solicitante', label: 'Solicitante' },
    { id: 'solicitud',   label: 'Solicitud' },
    { id: 'adjuntos',    label: 'Adjuntos' },
    { id: 'extra1',      label: 'Extra 1' },
    { id: 'extra2',      label: 'Extra 2' },
  ]

  const activeTab = ref('solicitante')

  const tabFields = {
    solicitante: ['nombre', 'identificacion', 'email', 'telefono', 'direccion', 'tipoResponsable', 'identificacionRepresentante', 'nombreRepresentante'],
    solicitud:   ['categoria', 'subcategoria', 'expediente', 'descripcion'],
    adjuntos:    [],
    extra1:      [],
    extra2:      [],
  }

  const {
    form,
    errors,
    requiereExpediente,
    loadingData,
    loadError,
    loading,
    tiposResponsable,
    handleUpdate,
  } = useSolicitudEditForm(props.id)

  const tabHasErrors = (tabId) =>
    tabFields[tabId]?.some(field => !!errors.value[field]) ?? false

  async function onSubmit() {
    const success = await handleUpdate()

    if (success) {
      await Swal.fire({
        icon: 'success',
        title: 'Solicitud actualizada',
        text: 'Los cambios se han guardado correctamente.',
        timer: 2000,
        showConfirmButton: false,
      })
      router.push({ name: 'ventanilla' })
      return
    }

    for (const tab of tabs) {
      if (tabHasErrors(tab.id)) {
        activeTab.value = tab.id
        break
      }
    }
  }
</script>

<style scoped>
.animate-fadeIn {
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
