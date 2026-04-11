<template>
  <!-- Success State -->
  <div v-if="submitted" class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
  <div class="bg-white rounded-lg shadow-sm p-6 text-center py-12">
    <div class="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
      <svg class="w-8 h-8 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    </div>
    <h2 class="text-2xl font-bold text-gray-900 mb-2">Solicitud Enviada Exitosamente</h2>
    <p class="text-gray-600 max-w-md mx-auto mb-8">
      Su solicitud ha sido registrada. Guarde los siguientes datos, los necesitará para hacer seguimiento a su solicitud.
    </p>
    <div class="inline-flex flex-col gap-4 text-left">
      <div class="rounded-xl bg-gray-100 px-6 py-4 text-center">
        <span class="text-xs text-gray-500 font-medium uppercase tracking-wider">Número de Solicitud</span>
        <p class="text-lg font-bold font-mono text-[#1A4972] mt-1">{{ resultData.configuracion.prefijoVentanilla }}-{{ resultData.vigencia }}-{{ resultData.numerosolicitud?.toString().padStart(4, '0') }}</p>
      </div>
      <div class="rounded-xl bg-gray-100 px-6 py-4 text-center hidden">
        <span class="text-xs text-gray-500 font-medium uppercase tracking-wider">Vigencia</span>
        <p class="text-lg font-bold font-mono text-gray-900 mt-1">{{ resultData.vigencia }}</p>
      </div>
      <!-- Código QR de la solicitud -->
      <div class="rounded-xl bg-gray-100 px-6 py-4">
        <img :src="resultData.qr_image" alt="Código QR de la solicitud" class="w-full h-auto" />
      </div>
    </div>
    <div class="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
      <Sticker :data="resultData" />
      <button @click="resetForm" class="inline-flex items-center justify-center gap-2 rounded-lg bg-[#FFA800] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#143a5c] transition-colors duration-200">
        Crear Una Nueva Solicitud
      </button>
    </div>
  </div>
  
</div>

<!-- Single-page Form -->
<div v-else class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 -mt-4">
  <form @submit.prevent="handleSubmit" novalidate class="flex flex-col gap-6">

    <!-- Section 1: Datos del Solicitante -->
    <section class="bg-white rounded-lg shadow-sm p-6">
      <DatosSolicitante v-model:form="form" :errors="errors" :tiposResponsable="tiposResponsable" />
    </section>

    <!-- Section 2: Datos de la Solicitud -->
    <section class="bg-white rounded-lg shadow-sm p-6">
      <DatosSolicitud v-model:form="form" :errors="errors" :origen="props.origen" @update:requiereExpediente="requiereExpediente = $event" />
    </section>

    <!-- Section 3: Documentos Adjuntos -->
    <section class="bg-white rounded-lg shadow-sm p-6">
      <h2 class="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
        <span class="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-sm font-bold text-[#1A4972]">3</span>
        Documentos Adjuntos
      </h2>

      <div>
        <p class="text-sm text-gray-600 mb-6 leading-relaxed">
          Adjunte todos los documentos requeridos para su solicitud. Los archivos deben estar en formato PDF, JPG o PNG con un tamaño máximo de 10 MB por archivo.
        </p>

        <FileUpload v-model="form.archivos" label="Seleccionar Archivos" />
      </div>
    </section>

    <!-- Submit Button -->
    <div class="flex items-center justify-end gap-4 pb-8">
      <router-link to="/" class="inline-flex items-center justify-center gap-2 rounded-lg bg-white border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50 transition-colors duration-200">Cancelar</router-link>
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
  // 1. Imports
  import { ref, computed, onMounted } from 'vue'
  import FileUpload from '@/shared/components/common/FileUpload.vue'
  import Sticker from '@/shared/components/solicitud/Sticker.vue'
  import { useCategoriaDocumentos } from '@/shared/composables/useCategoriaDocumentos'
  import { useSolicitudes } from '@/shared/composables/useSolicitudes'
  import { useAppSettings } from '@/shared/composables/useAppSettings'
  import { useTiposResponsable } from '@/shared/composables/useTiposResponsable'
  import Swal from 'sweetalert2'
  import { useAuth } from '@/shared/composables/useAuth'
  import DatosSolicitante from '@/shared/components/solicitud/DatosSolicitante.vue'
  import DatosSolicitud from '@/shared/components/solicitud/DatosSolicitud.vue'

  const props = defineProps({
    origen: {
      type: String,
      required: true
    }
  })
  const { user } = useAuth()
  // 2. Composables
  const { settings } = useAppSettings()
  const { tiposResponsable, getTiposResponsable } = useTiposResponsable()

  const {
    crearSolicitud,
    loading,
    apiError
  } = useSolicitudes()

  // 3. Estado Reactivo
  const form = ref({
    nombre: '',
    identificacion: '',
    email: '',
    telefono: '',
    direccion: '',
    tipoResponsable: '',
    identificacionRepresentante: '',
    nombreRepresentante: '',
    categoria: '',
    subcategoria: '',
    expediente: '',
    descripcion: '',
    folios: '',
    anexos: '',
    archivos: []
  })
  const errors = ref({})
  const submitted = ref(false)
  const resultData = ref({ 
    fecha: '', 
    hora: '', 
    numerosolicitud: '', 
    vigencia: '', 
    qr_image: '', 
    origen: '', 
    solicitante_nombre: '', 
    solicitante_email: '', 
    solicitante_identificacion: '', 
    usuario_receptor: '',
    configuracion: {
      representante: '',
      nombreCuraduria: '',
      prefijoVentanilla: '',
      logoUrl: ''
    }
  })

  const configuracion = computed(() => {
    const encargadoProvisional = settings.value?.encargado === 1 ? '(E)' : settings.value?.provisional === 1 ? '(P)' : ''
    return {
      representante: settings.value?.representante || '',
      nombreCuraduria: `${settings.value?.nombre} ${encargadoProvisional}` || '',
      prefijoVentanilla: settings.value?.prefijo_ventanilla || '',
      logoUrl: `/src/assets/${settings.value?.logo}`
    }
  })

  const requiereExpediente = ref(false)

  // 4. Funciones
  const buildFormData = (formData) => {
    const fd = new FormData()
    fd.append('solicitante_nombre', formData.nombre)
    fd.append('solicitante_email', formData.email)
    fd.append('solicitante_identificacion', formData.identificacion)
    fd.append('representante_identificacion', formData.identificacionRepresentante)
    fd.append('representante_nombre', formData.nombreRepresentante)
    fd.append('representante_tipo', formData.tipoResponsable)
    fd.append('telefono', formData.telefono)
    fd.append('direccion', formData.direccion)
    fd.append('categoria_id', formData.categoria)
    fd.append('subcategoria_id', formData.subcategoria)
    fd.append('expediente', formData.expediente)
    fd.append('folios', formData.folios)
    fd.append('anexos', formData.anexos)
    fd.append('descripcion', formData.descripcion)
    if (props.origen === 'oficina') {
      fd.append('usuario_receptor_id', user.value)
    }

    if (formData.archivos?.length) {
      formData.archivos.forEach(file => fd.append('files[]', file))
    }

    return fd
  }

  const validate = () => {
    errors.value = {}

    if (!form.value.nombre.trim()) errors.value.nombre = 'El nombre es requerido'
    if (!form.value.identificacion.trim()) errors.value.identificacion = 'La identificación es requerida'
    if (!form.value.email.trim()) errors.value.email = 'El correo electronico es requerido'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) errors.value.email = 'Ingrese un correo electronico valido'
    if (!form.value.telefono.trim()) errors.value.telefono = 'El telefono es requerido'
    if (!form.value.direccion.trim()) errors.value.direccion = 'La direccion es requerida'
    if (!form.value.tipoResponsable) errors.value.tipoResponsable = 'Seleccione un tipo de solicitante'
    if (form.value.tipoResponsable === 5 || form.value.tipoResponsable === 2) {
      if (!form.value.identificacionRepresentante.trim()) errors.value.identificacionRepresentante = 'La identificación del representante/apoderado es requerida'
      if (!form.value.nombreRepresentante.trim()) errors.value.nombreRepresentante = 'El nombre del representante/apoderado es requerido'
    }

    if (!form.value.categoria) errors.value.categoria = 'Seleccione una categoria'
    if (!form.value.subcategoria) errors.value.subcategoria = 'Seleccione una subcategoria'
    if (requiereExpediente.value && !form.value.expediente?.trim()) {
      errors.value.expediente = 'El número de expediente es requerido para esta subcategoría'
    }
    if (!form.value.descripcion.trim()) errors.value.descripcion = 'La descripcion es requerida'
    else if (form.value.descripcion.length > 2000) errors.value.descripcion = 'La descripcion no puede exceder 2000 caracteres'

    if (Object.keys(errors.value).length > 0) {
      const firstErrorKey = Object.keys(errors.value)[0]
      const el = document.getElementById(firstErrorKey)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }

    return Object.keys(errors.value).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return

    try {
      const formData = buildFormData(form.value)
      const result = await crearSolicitud(formData, props.origen)

      if (!result) {
        Swal.fire({
          icon: 'error',
          title: 'Error al enviar la solicitud 1',
          text: apiError.value || 'Ocurrió un error al enviar la solicitud. Intente nuevamente.',
          showConfirmButton: true
        })
        return
      }

      const datosConfiguracion = configuracion.value;

      resultData.value = { 
        numerosolicitud: result.numerosolicitud, 
        vigencia: result.vigencia, 
        fecha: result.fecha,
        hora: result.hora,
        solicitante_nombre: result.solicitante_nombre,
        solicitante_identificacion: result.solicitante_identificacion,
        solicitante_email: result.solicitante_email,
        folios: result.folios,
        anexos: result.anexos,
        origen: result.origen,
        usuario_receptor: result.usuario_receptor,
        qr_image: result.qr_image,
        configuracion: datosConfiguracion
      }

      submitted.value = true
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error al enviar la solicitud 2',
        text: 'Ocurrió un error al enviar la solicitud. Intente nuevamente. Error: ' + error.message,
        showConfirmButton: true
      })
    }
  }

  const resetForm = () => {
    form.value = {
      nombre: '',
      identificacion: '',
      email: '',
      telefono: '',
      direccion: '',
      tipoResponsable: '',
      identificacionRepresentante: '',
      nombreRepresentante: '',
      categoria: '',
      subcategoria: '',
      expediente: '',
      descripcion: '',
      folios: '',
      anexos: '',
      archivos: []
    }
    errors.value = {}
    submitted.value = false
  }

  // 5. Lifecycle Hooks
  onMounted(async () => {
    await getTiposResponsable(props.origen)
  })
</script>