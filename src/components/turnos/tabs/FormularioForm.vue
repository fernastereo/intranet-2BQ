<template>
  <div class="min-h-screen bg-gray-50">
    <div class="mx-auto">
      <div class="bg-white">
        <div class="flex items-center gap-2 mb-6">
          <h1 class="text-2xl font-bold text-gray-900">Solicitud de Licencia</h1>
          <Badge v-if="turnoData?.estado?.nombre" :color="turnoData.estado.class">{{ turnoData.estado.nombre }}</Badge>
        </div>
        
        <!-- Objeto de Trámite -->
        <div class="mb-8">
          <label class="block text-sm font-medium text-gray-700 mb-3">
            Objeto de Trámite *
          </label>
          <div v-if="loadingTiposLicencia" class="text-center py-4">
            <p class="text-gray-500">Cargando Objetos de licencias...</p>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <label 
              v-for="tramite in objetosLicencia" 
              :key="tramite.id"
              class="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
              :class="localFormData.objeto_id === tramite.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'"
            >
              <input 
                type="radio" 
                :value="tramite.id" 
                v-model="localFormData.objeto_id"
                class="mr-3 text-blue-600"
              >
              <div>
                <div class="font-medium text-sm">{{ tramite.nombre }}</div>
              </div>
            </label>
          </div>
        </div>

        <!-- Tipos de Licencia y Modalidades -->
        <div class="mb-8">
          <div class="flex items-center justify-between">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">
                Seleccione las modalidades requeridas *
              </label>
            
              <p class="text-sm text-gray-600 mb-4">
                Puede seleccionar múltiples modalidades del mismo tipo de licencia o de diferentes tipos. 
              </p>
            </div>
            <button 
              @click="resetForm"
              class="px-4 py-2 border-0 hover:bg-gray-100 cursor-pointer"
            >
              <TrashIcon class="w-5 h-5 text-red-500" />
            </button>
          </div>
          <!-- Indicador de carga -->
          <div v-if="loadingTiposLicencia" class="text-center py-4">
            <p class="text-gray-500">Cargando tipos de licencias...</p>
          </div>
          
          <div v-else class="space-y-6">
            <div 
              v-for="licencia in tiposLicencia" 
              :key="licencia.id"
              class="border border-gray-200 rounded-lg p-4"
            >
              <h3 class="font-semibold text-gray-900 mb-3 flex items-center">
                {{ licencia.nombre }}
                <span 
                  v-if="getSelectedModalidadesCount(licencia.id) > 0"
                  class="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                >
                  {{ getSelectedModalidadesCount(licencia.id) }} seleccionada{{ getSelectedModalidadesCount(licencia.id) > 1 ? 's' : '' }}
                </span>
              </h3>
              
              <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
                <label 
                  v-for="modalidad in licencia.modalidades" 
                  :key="modalidad.id"
                  class="flex items-start p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                  :class="localFormData.modalidades.includes(modalidad.id) ? 'border-green-500 bg-green-50' : 'border-gray-200'"
                >
                  <input 
                    type="checkbox" 
                    :value="modalidad.id"
                    v-model="localFormData.modalidades"
                    class="mt-1 mr-3 text-green-600"
                  >
                  <div class="flex-1">
                    <div class="font-medium text-sm text-gray-900">{{ modalidad.nombre }}</div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Resumen Simple -->
        <div v-if="localFormData.modalidades.length > 0" class="mb-8 p-4 bg-gray-50 rounded-lg">
          <h3 class="font-medium text-gray-900 mb-3">Resumen de su solicitud:</h3>
          <div class="space-y-2">
            <div>
              <span class="text-sm font-medium text-gray-700">Trámite:</span>
              <span class="text-sm text-gray-900 ml-2">{{ getSelectedTramiteNombre() }}</span>
            </div>
            <div>
              <span class="text-sm font-medium text-gray-700">Modalidades ({{ localFormData.modalidades.length }}):</span>
              <div class="mt-1 flex flex-wrap gap-2">
                <span 
                  v-for="modalidad in getSelectedModalidadesDetails()" 
                  :key="modalidad.id"
                  class="inline-flex items-center px-2 py-1 bg-white border border-gray-200 rounded text-xs"
                >
                  {{ modalidad.licencia }} - {{ modalidad.nombre }}
                  <button
                    @click="removeModalidad(modalidad.id)"
                    class="ml-2 text-gray-400 hover:text-red-500"
                  >
                    <TrashIcon class="w-3 h-3" />
                  </button>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, inject, watch } from 'vue'
import { useRoute } from 'vue-router'
import { TrashIcon } from '@heroicons/vue/24/outline'
import { useTiposLicencia } from '@/shared/composables/useTiposLicencia'
import { useObjetosLicencia } from '@/shared/composables/useObjetosLicencia'
import { useTurnos } from '@/shared/composables/useTurnos'
import Badge from '@/shared/components/Badge.vue'
import Swal from 'sweetalert2'

// Composable
const { updateTurnoFormulario, loading: loadingTurnoFormulario, apiError } = useTurnos()
const { tiposLicencia, loading: loadingTiposLicencia, getTiposLicencia } = useTiposLicencia()
const { objetosLicencia, loading: loadingObjetosLicencia, getObjetosLicencia } = useObjetosLicencia()

const route = useRoute()

// Inject para registrar submit handler y datos del turno
const registerSubmit = inject('registerSubmit')
const turnoData = inject('turnoData')
const updateTurnoData = inject('updateTurnoData')

// Estado local del formulario
const localFormData = ref({
  objeto_id: turnoData.value?.objeto.id || '',
  modalidades: turnoData.value?.modalidades?.map(modalidad => modalidad.id) || []
})

// Watch para sincronizar datos del padre
watch(turnoData, (newValue) => {
  if (newValue) {
    localFormData.value = {
      objeto_id: newValue.objeto.id || '',
      modalidades: newValue.modalidades?.map(modalidad => modalidad.id) || []
    }
  }
}, { immediate: true })

// Métodos
const getSelectedModalidadesCount = (licenciaId) => {
  const licencia = tiposLicencia.value.find(l => l.id === licenciaId)
  if (!licencia) return 0
  
  return licencia.modalidades.filter(m => localFormData.value.modalidades.includes(m.id)).length
}

const getSelectedTramiteNombre = () => {
  const tramite = objetosLicencia.value.find(t => t.id === localFormData.value.objeto_id)
  return tramite ? tramite.nombre : 'No seleccionado'
}

const getSelectedModalidadesDetails = () => {
  const details = []

  tiposLicencia.value.forEach(licencia => {
    licencia.modalidades.forEach(modalidad => {
      if (localFormData.value.modalidades.includes(modalidad.id)) {
        details.push({
          id: modalidad.id,
          nombre: modalidad.nombre,
          licencia: licencia.nombre
        })
      }
    })
  })
  
  return details
}

const removeModalidad = (modalidadId) => {
  const index = localFormData.value.modalidades.indexOf(modalidadId)
  if (index > -1) {
    localFormData.value.modalidades.splice(index, 1)
  }
}

const resetForm = () => {
  localFormData.value = {
    objeto_id: '',
    modalidades: []
  }
}

// Computed
const isFormValid = computed(() => {
  return localFormData.value.objeto_id && localFormData.value.modalidades.length > 0
})

const handleSubmit = async () => {
  try {
    if (isFormValid.value) {
      const result = await updateTurnoFormulario(route.params.id, localFormData.value)

      if (result) {
        // Actualizar los datos en el padre
        updateTurnoData(result.expediente)
        
        Swal.fire({
          icon: 'success',
          title: 'Turno actualizado exitosamente',
          showConfirmButton: true,
          confirmButtonText: 'Cerrar',
          confirmButtonColor: '#4f39f6'
        })
      } else {
        const errorMessage = apiError.value || 'Error desconocido'
        Swal.fire({
          icon: 'error',
          title: 'Error al actualizar el turno',
          text: errorMessage,
          showConfirmButton: true
        })
      }
    }
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error al guardar el turno',
      text: error.message,
      showConfirmButton: true
    })
  }
}

onMounted(() => {
  getObjetosLicencia()
  getTiposLicencia()

  if (registerSubmit) {
    registerSubmit('Formulario', handleSubmit)
  }

})
</script>