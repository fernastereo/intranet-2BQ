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
      <h2 class="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
        <span class="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-sm font-bold text-[#1A4972]">1</span>
        Datos del Solicitante
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div class="md:col-span-2">
          <label for="nombre" class="block text-sm font-medium text-gray-700 mb-1.5">Nombre Completo / Razón Social <span class="text-red-500">*</span></label>
          <input id="nombre" v-model="form.nombre" type="text" class="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A4972] focus:border-transparent transition-all" required />
          <p v-if="errors.nombre" class="mt-1 text-xs text-red-500">{{ errors.nombre }}</p>
        </div>

        <div>
          <label for="identificacion" class="block text-sm font-medium text-gray-700 mb-1.5">Identificación<span class="text-red-500">*</span></label>
          <input id="identificacion" v-model="form.identificacion" type="text" class="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A4972] focus:border-transparent transition-all" placeholder="Número de identificación" required />
          <p v-if="errors.identificacion" class="mt-1 text-xs text-red-500">{{ errors.identificacion }}</p>
        </div>

        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-1.5">Correo Electrónico <span class="text-red-500">*</span></label>
          <input id="email" v-model="form.email" type="email" class="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A4972] focus:border-transparent transition-all" placeholder="correo@ejemplo.com" required />
          <p v-if="errors.email" class="mt-1 text-xs text-red-500">{{ errors.email }}</p>
        </div>

        <div>
          <label for="direccion" class="block text-sm font-medium text-gray-700 mb-1.5">Dirección<span class="text-red-500">*</span></label>
          <input id="direccion" v-model="form.direccion" type="text" class="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A4972] focus:border-transparent transition-all" placeholder="Calle, Número" required />
          <p v-if="errors.direccion" class="mt-1 text-xs text-red-500">{{ errors.direccion }}</p>
        </div>

        <div>
          <label for="telefono" class="block text-sm font-medium text-gray-700 mb-1.5">Teléfono <span class="text-red-500">*</span></label>
          <input id="telefono" v-model="form.telefono" type="tel" class="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A4972] focus:border-transparent transition-all" placeholder="555 123 4567" required />
          <p v-if="errors.telefono" class="mt-1 text-xs text-red-500">{{ errors.telefono }}</p>
        </div>

        <div class="grid col-span-2 md:grid-cols-3 gap-5">
          <div>
            <label for="tipoResponsable" class="block text-sm font-medium text-gray-700 mb-1.5">Tipo de Solicitante <span class="text-red-500">*</span></label>
            <select id="tipoResponsable" v-model="form.tipoResponsable" class="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A4972] focus:border-transparent transition-all" required>
              <option value="" disabled>Seleccione una opción</option>
              <option v-for="tipo in tiposResponsable" :key="tipo.id" :value="tipo.id">{{ tipo.nombre }}</option>
            </select>
            <p v-if="errors.tipoResponsable" class="mt-1 text-xs text-red-500">{{ errors.tipoResponsable }}</p>
          </div>
          
          <div v-if="form.tipoResponsable === 2 || form.tipoResponsable === 5">
              <label for="identificacionRepresentante" class="block text-sm font-medium text-gray-700 mb-1.5">
                Identificación del {{ form.tipoResponsable === 5 ? 'Representante' : 'Apoderado' }} <span class="text-red-500">*</span>
              </label>
              <input id="identificacionRepresentante" v-model="form.identificacionRepresentante" type="text" class="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A4972] focus:border-transparent transition-all" required />
              <p v-if="errors.identificacionRepresentante" class="mt-1 text-xs text-red-500">{{ errors.identificacionRepresentante }}</p>
          </div>
          <div v-if="form.tipoResponsable === 2 || form.tipoResponsable === 5">
              <label for="nombreRepresentante" class="block text-sm font-medium text-gray-700 mb-1.5">
                Nombre del {{ form.tipoResponsable === 5 ? 'Representante' : 'Apoderado' }} <span class="text-red-500">*</span>
              </label>
              <input id="nombreRepresentante" v-model="form.nombreRepresentante" type="text" class="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A4972] focus:border-transparent transition-all" required />
              <p v-if="errors.nombreRepresentante" class="mt-1 text-xs text-red-500">{{ errors.nombreRepresentante }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Section 2: Datos de la Solicitud -->
    <section class="bg-white rounded-lg shadow-sm p-6">
      <h2 class="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
        <span class="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-sm font-bold text-[#1A4972]">2</span>
        Datos de la Solicitud
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label for="categoria" class="block text-sm font-medium text-gray-700 mb-1.5">Categoría <span class="text-red-500">*</span></label>
          <select id="categoria" v-model="form.categoria" class="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A4972] focus:border-transparent transition-all" required @change="form.subcategoria = ''">
            <option value="" disabled>Seleccione una categoría</option>
            <option v-for="cat in categoriasDocumentos" :key="cat.id" :value="cat.id">{{ cat.nombre }}</option>
          </select>
          <p v-if="errors.categoria" class="mt-1 text-xs text-red-500">{{ errors.categoria }}</p>
        </div>

        <div>
          <label for="subcategoria" class="block text-sm font-medium text-gray-700 mb-1.5">Subcategoría <span class="text-red-500">*</span></label>
          <select id="subcategoria" v-model="form.subcategoria" class="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A4972] focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed" :disabled="!form.categoria" required>
            <option value="" disabled>{{ form.categoria ? 'Seleccione una subcategoría' : 'Seleccione primero una categoría' }}</option>
            <option v-for="sub in subcategorias" :key="sub.id" :value="sub.id">{{ sub.nombre }}</option>
          </select>
          <p v-if="errors.subcategoria" class="mt-1 text-xs text-red-500">{{ errors.subcategoria }}</p>
        </div>

        <div class="grid grid-cols-2 gap-5">
          <div>
            <label for="folios" class="block text-sm font-medium text-gray-700 mb-1.5">Número de Folios</label>
            <input id="folios" v-model="form.folios" type="number" class="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A4972] focus:border-transparent transition-all" placeholder="0" />
            <p class="mt-1 text-xs text-gray-500">Ingrese el número de folios.</p>
          </div>
          <div>
            <label for="anexos" class="block text-sm font-medium text-gray-700 mb-1.5">Número de Anexos</label>
            <input id="anexos" v-model="form.anexos" type="number" class="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A4972] focus:border-transparent transition-all" placeholder="0" />
            <p class="mt-1 text-xs text-gray-500">Ingrese el número de anexos.</p>
          </div>
        </div>
        <div v-if="subcategoriaSeleccionada?.incorporaexpediente">
          <label for="expediente" class="block text-sm font-medium text-gray-700 mb-1.5">Número de Expediente Asociado <span class="text-red-500">*</span></label>
          <input id="expediente" v-model="form.expediente" type="text" class="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A4972] focus:border-transparent transition-all" placeholder="08001-2-25-XXXX" :required="subcategoriaSeleccionada?.incorporaexpediente" />
          <div class="flex items-center justify-between mt-1">
            <p v-if="errors.expediente" class="text-xs text-red-500">{{ errors.expediente }}</p>
            <p v-else class="mt-1 text-xs text-gray-500">Ingrese el numero de expediente si ya tiene uno asignado.</p>
          </div>
        </div>

        <div class="md:col-span-2">
          <label for="descripcion" class="block text-sm font-medium text-gray-700 mb-1.5">Descripcion de la Solicitud <span class="text-red-500">*</span></label>
          <textarea
            id="descripcion"
            v-model="form.descripcion"
            class="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A4972] focus:border-transparent transition-all resize-y"
            rows="5"
            placeholder="Describa detalladamente su solicitud, incluyendo cualquier informacion adicional relevante..."
            required
          ></textarea>
          <div class="flex items-center justify-between mt-1">
            <p v-if="errors.descripcion" class="text-xs text-red-500">{{ errors.descripcion }}</p>
            <p class="text-xs text-gray-500 ml-auto">{{ form.descripcion.length }} / 2000</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Section 3: Documentos Adjuntos -->
    <section class="bg-white rounded-lg shadow-sm p-6">
      <h2 class="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
        <span class="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-sm font-bold text-[#1A4972]">3</span>
        Documentos Adjuntos
      </h2>

      <p class="text-sm text-gray-600 mb-6 leading-relaxed">
        Adjunte todos los documentos requeridos para su solicitud. Los archivos deben estar en formato PDF, JPG o PNG con un tamaño máximo de 10 MB por archivo.
      </p>

      <FileUpload v-model="form.archivos" label="Seleccionar Archivos" />
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
    categoriasDocumentos, 
    getCategoriaDocumentos, 
    getSubCategoriasDocumentos, 
  } = useCategoriaDocumentos()
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

  const subcategorias = computed(() => {
    if (!form.value.categoria) return []
    const subcategorias = getSubCategoriasDocumentos(form.value.categoria) || []
    return subcategorias
  })

  const subcategoriaSeleccionada = computed(() => {
    if (!form.value.subcategoria || !subcategorias.value.length) return null
    return subcategorias.value.find(sub => sub.id === form.value.subcategoria)
  })

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
    if (subcategoriaSeleccionada.value?.incorporaexpediente && !form.value.expediente?.trim()) {
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
    await getCategoriaDocumentos(props.origen)
    await getTiposResponsable(props.origen)
  })
</script>