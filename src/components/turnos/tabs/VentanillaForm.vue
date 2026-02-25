<template>
  <div class="sm:px-6 md:px-0">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">AQUI
        <TurnoTitle :isEdit="isEdit.value" :turnoEstado="turnoData.value.estado" />
        <p class="mt-2 text-sm text-gray-700">
          {{ isEdit ? 'Modifique los datos del turno.' : 'Complete el formulario para crear un nuevo turno.' }}
        </p>
      </div>
    </div>
    <div class="mt-4 flow-root">
      <div class="overflow-x-auto">
        <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-2">
          <div class="overflow-hidden">
            <form class="space-y-6 p-2 md:p-0">
              <div class="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 md:grid-cols-4">
                <!-- Fecha y Hora -->
                <div>
                  <label for="fecha" class="block text-sm font-medium leading-6 text-gray-900">Fecha</label>
                  <div class="mt-2">
                    <input
                      type="datetime-local" id="fecha" v-model="localFormData.fecha" disabled
                      class="block w-full rounded-md bg-gray-200 px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                  </div>
                </div>
                <div>
                  <label for="turno" class="block text-sm font-medium leading-6 text-gray-900">Turno</label>
                  <div class="mt-2">
                    <input
                      type="text" id="turno" v-model="formattedTurnoNumber" disabled
                      class="block w-full rounded-md bg-gray-200 text-left px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                  </div>
                </div>
                <!-- Dirección -->
                <div class="sm:col-span-2">
                  <label for="direccion" class="block text-sm font-medium leading-6 text-gray-900">Dirección</label>
                  <div class="mt-2">
                    <input 
                      type="text" id="direccion" v-model="localFormData.direccion" 
                      autocomplete="family-name" class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                  </div>
                </div>
              </div>
              <!-- Responsables -->
              <PersonRegistration v-model="localFormData.responsables" />
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useTurnos } from '@/shared/composables/useTurnos'
import PersonRegistration from '../components/PersonRegistration.vue'
import Swal from 'sweetalert2'
import TurnoTitle from '@/components/turnos/components/TurnoTitle.vue'

const router = useRouter()
const route = useRoute()
const { createTurno, updateTurno, apiError } = useTurnos()

// Inject para registrar submit handler y datos del turno
const registerSubmit = inject('registerSubmit')
const turnoData = inject('turnoData')

const updateTurnoData = inject('updateTurnoData')

const isEdit = computed(() => route.name === 'editar-turno')

// Estado local del formulario
const localFormData = ref({
  fecha: '',
  direccion: '',
  responsables: []
})

// Computed para el número de turno formateado
const formattedTurnoNumber = computed(() => {
  if (!turnoData.value?.numturno) return ''
  return `${turnoData.value.numturno.toString().padStart(4, '0')}-${turnoData.value.vigencia}`
})

// Watch para sincronizar datos del padre
watch(turnoData, (newValue) => {
  if (newValue) {
    localFormData.value = {
      fecha: `${newValue.fecha}T${newValue.hora}`,
      direccion: newValue.direccion || '',
      responsables: newValue.responsables?.map(resp => ({
        name: resp.nombre,
        identification: resp.documento,
        identificationType: resp.tipodocumento.id,
        identificationTypeName: resp.tipodocumento.nombre,
        personType: resp.tiporesponsable.id,
        personTypeName: resp.tiporesponsable.nombre,
        email: resp.email,
        phone: resp.telefono
      })) || []
    }
  }
}, { immediate: true })

const handleSubmit = async () => {
  try {
    if (localFormData.value.responsables.length === 0) {
      alert('Debe agregar al menos una persona responsable')
      return
    }

    if (isEdit.value) {
      // Transformar los datos al formato esperado por el endpoint
      const turnoData = {
        direccion: localFormData.value.direccion,
        responsables: localFormData.value.responsables.map(persona => ({
          nombre: persona.name,
          tiporesponsable_id: parseInt(persona.personType),
          documento: persona.identification,
          telefono: persona.phone,
          email: persona.email,
          tipodocumento_id: parseInt(persona.identificationType)
        }))
      }

      const result = await updateTurno(route.params.id, turnoData)
      
      if (result) {
        Swal.fire({
          icon: 'success',
          title: 'Turno actualizado exitosamente',
          text: `Número de turno: ${formattedTurnoNumber.value}`,
          showConfirmButton: true,
          confirmButtonText: 'Ir a Home',
          confirmButtonColor: '#4f39f6'
        }).then((result) => {
          if (result.isConfirmed) {
            router.push({ name: 'turnos' })
          }
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
    } else {
      // Separar fecha y hora del campo datetime-local
      const fechaHora = new Date(localFormData.value.fecha)
      const fecha = fechaHora.toISOString().split('T')[0] // YYYY-MM-DD
      const hora = fechaHora.toTimeString().split(' ')[0] // HH:MM:SS

      // Transformar los datos al formato esperado por el endpoint
      const turnoData = {
        fecha: fecha,
        hora: hora,
        direccion: localFormData.value.direccion,
        responsables: localFormData.value.responsables.map(persona => ({
          nombre: persona.name,
          tiporesponsable_id: parseInt(persona.personType),
          documento: persona.identification,
          telefono: persona.phone,
          email: persona.email,
          tipodocumento_id: parseInt(persona.identificationType)
        }))
      }

      const result = await createTurno(turnoData)
      
      if (result) {
        // Actualizar los datos del turno en el padre
        updateTurnoData({
          numturno: result.numturno,
          vigencia: result.vigencia
        })
        
        const swalResult = await Swal.fire({
          icon: 'success',
          title: 'Turno creado exitosamente',
          text: `Número de turno: ${formattedTurnoNumber.value}`,
          showConfirmButton: true,
          showCancelButton: true,
          confirmButtonText: 'Ir a Home',
          cancelButtonText: 'Crear otro turno',
          confirmButtonColor: '#4f39f6',
          cancelButtonColor: '#6c757d'
        })
        
        // Si el usuario hace click en "Ir a Home"
        if (swalResult.isConfirmed) {
          router.push({ name: 'turnos' })
        }
      } else {
        const errorMessage = apiError.value || 'Error desconocido'
        Swal.fire({
          icon: 'error',
          title: 'Error al crear el turno',
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
  // Si es un nuevo turno, establecer fecha y hora actual
  console.log("🚀 ~ onMounted ~ isEdit:", isEdit.value)
  console.log("🚀 ~ onMounted ~ turnoData:", turnoData.value.estado)
  if (!isEdit.value) {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    
    localFormData.value.fecha = `${year}-${month}-${day}T${hours}:${minutes}`
  }
  
  // Registrar submit handler con el componente padre
  if (registerSubmit) {
    registerSubmit('Ventanilla', handleSubmit)
  }
})
</script> 