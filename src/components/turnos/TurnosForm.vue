<template>
  <div class="space-y-6">
    <LoadingSpinner v-if="loading" />
    <template v-else>
      <!-- Selector de pestañas para móvil -->
      <MobileTabSelector 
        :tabs="tabs" 
        v-model="currentTab" 
      />

      <!-- Navegación de pestañas para escritorio -->
      <DesktopTabNavigation 
        :tabs="tabs" 
        v-model="currentTab" 
      />

      <!-- Contenido de las pestañas -->
      <div class="mt-6">
        <component 
          :is="getCurrentTabComponent" 
          v-if="getCurrentTabComponent"
        />
      </div>

      <!-- Botones de acción -->
      <ActionButtons 
        @cancel="handleCancel"
        @submit="handleSubmit"
      />
    </template>
  </div>
</template>

<script setup>
import { ref, computed, provide, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ComputerDesktopIcon, WindowIcon, ClipboardDocumentCheckIcon, DocumentPlusIcon, CurrencyDollarIcon, DocumentMagnifyingGlassIcon, DocumentCheckIcon } from '@heroicons/vue/20/solid'
import MobileTabSelector from './components/MobileTabSelector.vue'
import DesktopTabNavigation from './components/DesktopTabNavigation.vue'
import ActionButtons from './components/ActionButtons.vue'
import LoadingSpinner from '@/shared/components/LoadingSpinner.vue'
import VentanillaForm from './tabs/VentanillaForm.vue'
import FormularioForm from './tabs/FormularioForm.vue'
import DocumentacionForm from './tabs/DocumentacionForm.vue'
import NotasForm from './tabs/NotasForm.vue'
import PreliquidacionForm from './tabs/PreliquidacionForm.vue'
import SupervisionForm from './tabs/SupervisionForm.vue'
import PreradicacionForm from './tabs/PreradicacionForm.vue'
import { useTurnos } from '@/shared/composables/useTurnos'
import Swal from 'sweetalert2'

const router = useRouter()
const route = useRoute()
const currentTab = ref('Ventanilla')
const { getTurnoById, loading, apiError } = useTurnos()

// Estado para los datos del turno
const turnoData = ref(null)
const isEdit = computed(() => route.name === 'editar-turno')
const turnoId = computed(() => route.params.id)

// Estado para manejar submit handlers de cada tab
const submitHandlers = ref(new Map())

// Provide función para que los tabs se registren
provide('registerSubmit', (tabName, submitHandler) => {
  submitHandlers.value.set(tabName, submitHandler)
})

// Provide los datos del turno y función para actualizarlos
provide('turnoData', turnoData)
provide('updateTurnoData', updateTurnoData)

// Configuración de las pestañas
const tabs = [
  { 
    name: 'Ventanilla', 
    component: VentanillaForm,
    icon: ComputerDesktopIcon
  },
  { 
    name: 'Formulario', 
    component: FormularioForm,
    icon: WindowIcon
  },
  { 
    name: 'Documentación', 
    component: DocumentacionForm,
    icon: ClipboardDocumentCheckIcon
  },
  { 
    name: 'Preliquidación', 
    component: PreliquidacionForm,
    icon: CurrencyDollarIcon
  },
  { 
    name: 'Supervisión', 
    component: SupervisionForm,
    icon: DocumentMagnifyingGlassIcon
  },
  { 
    name: 'Preradicación', 
    component: PreradicacionForm,
    icon: DocumentCheckIcon
  }
]

// Computed para obtener el componente actual
const getCurrentTabComponent = computed(() => {
  const tab = tabs.find(t => t.name === currentTab.value)
  return tab?.component
})

// Función para actualizar los datos del turno
function updateTurnoData(newData) {
  turnoData.value = { ...turnoData.value, ...newData }
}

// Cargar datos del turno
async function loadTurnoData() {
  if (isEdit.value) {
    try {
      const result = await getTurnoById(turnoId.value)
      if (result.expediente) {
        turnoData.value = result.expediente
      } else {
        throw new Error(apiError.value || 'No se pudo cargar la información del turno')
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error al cargar el turno',
        text: error.message,
        showConfirmButton: true
      }).then(() => {
        router.push({ name: 'turnos' })
      })
    }
  } else {
    // Inicializar datos para nuevo turno
    const now = new Date()
    turnoData.value = {
      fecha: now.toISOString().split('T')[0],
      hora: now.toTimeString().split(' ')[0],
      direccion: '',
      responsables: [],
      estado: {
        class: 'gray',
        nombre: ''
      }
    }
  }
}

// Manejadores de eventos
const handleCancel = () => {
  router.push({ name: 'turnos' })
}

const handleSubmit = async () => {
  try {
    // Obtener el handler del tab actual
    const currentSubmitHandler = submitHandlers.value.get(currentTab.value)
    
    if (currentSubmitHandler) {
      // Ejecutar la lógica de submit del tab activo
      await currentSubmitHandler()
    } else {
      console.warn(`No submit handler registered for tab: ${currentTab.value}`)
    }
  } catch (error) {
    console.error('Error al guardar:', error)
  }
}

onMounted(() => {
  loadTurnoData()
})
</script>