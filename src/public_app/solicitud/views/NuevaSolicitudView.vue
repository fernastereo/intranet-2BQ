<template>
  <div class="bg-gray-50 min-h-screen">
    <!-- Page Header -->
    <div class="bg-gray-600">
      <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
        <router-link to="/" class="inline-flex items-center gap-1.5 text-sm text-blue-200 hover:text-white transition-colors mb-4">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Volver al inicio
        </router-link>
        <h1 class="text-3xl md:text-4xl font-bold text-white tracking-tight">Nueva Solicitud</h1>
        <p class="mt-2 text-blue-200">Complete todos los campos requeridos para iniciar su tramite.</p>
      </div>
    </div>

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
            <span class="text-xs text-gray-500 font-medium uppercase tracking-wider">Numero de Solicitud</span>
            <p class="text-lg font-bold font-mono text-[#1A4972] mt-1">{{ resultData.numerosolicitud.toString().padStart(4, '0') }}</p>
          </div>
          <div class="rounded-xl bg-gray-100 px-6 py-4 text-center">
            <span class="text-xs text-gray-500 font-medium uppercase tracking-wider">Vigencia</span>
            <p class="text-lg font-bold font-mono text-gray-900 mt-1">{{ resultData.vigencia }}</p>
          </div>
          <!-- Código QR de la solicitud -->
          <div class="rounded-xl bg-gray-100 px-6 py-4">
            <img :src="resultData.qr_image" alt="Código QR de la solicitud" class="w-full h-auto" />
          </div>
        </div>
        <div class="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <div id="componente-sticker"><!-- extraer todo este div como un componente aparte y se manda por props los datos -->
            <div id="pdf-content" class="w-[430px] text-sm border-1 rounded-lg p-2 mt-2 hidden">
              <!-- contenido a convertir en PDF -->
              <h1 class="text-center text-md uppercase font-bold mb-2">Comprobante de Recepción de Documentos</h1>
              <div class="inline-flex px-1">
                <div class="w-60 shrink-0">
                  <p class="font-semibold uppercase text-sm">Solicitud: {{ resultData.numerosolicitud.toString().padStart(4, '0') }}-{{ resultData.vigencia }}</p>
                </div>
                <div class="w-40 shrink-0 flex flex-col">
                  <p class="font-semibold uppercase text-sm">Fecha: {{ resultData.fecha }}</p>
                  <p class="font-semibold uppercase text-sm">Hora: {{ resultData.hora }}</p>
                </div>
              </div>
              <div class="inline-flex px-1">
                <div class="w-60 shrink-0 flex flex-col">
                  <p class="font-semibold uppercase text-sm">Solicitante:</p> 
                  <p>{{ resultData.solicitante_nombre }}</p>
                </div>
                <div class="w-40 shrink-0 flex flex-col">
                  <p class="font-semibold uppercase text-sm">Identificacion:</p> 
                  <p>{{ resultData.solicitante_identificacion }}</p>
                </div>
              </div>
              <div class="inline-flex px-1">
                <div class="w-60 shrink-0 flex flex-col">
                  <div class="flex flex-col mb-2">
                    <p class="font-semibold uppercase text-sm">Correo Electronico:</p> 
                    <p>{{ resultData.solicitante_email }}</p>
                  </div>
                  <div class="flex flex-col">
                    <p class="font-semibold uppercase text-sm">{{ resultData.origen === 'web' ? 'Origen:' : 'Recibió:' }}</p>
                    <p>{{ resultData.origen === 'web' ? resultData.origen : resultData.usuario_receptor }}</p>
                  </div>
                </div>
                <div class="w-40 shrink-0 flex flex-col">
                  <img :src="resultData.qr_image" alt="Código QR de la solicitud" class="w-[150px]" />
                </div>
              </div>
            </div>
            <button @click="printForm" class="inline-flex items-center justify-center gap-2 rounded-lg bg-[#FFA800] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#143a5c] transition-colors duration-200">
              Imprimir Comprobante
            </button>
          </div>
          <button @click="resetForm" class="inline-flex items-center justify-center gap-2 rounded-lg bg-[#FFA800] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#143a5c] transition-colors duration-200">
            Crear Otra Solicitud
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
              <label for="email" class="block text-sm font-medium text-gray-700 mb-1.5">Correo Electronico <span class="text-red-500">*</span></label>
              <input id="email" v-model="form.email" type="email" class="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A4972] focus:border-transparent transition-all" placeholder="correo@ejemplo.com" required />
              <p v-if="errors.email" class="mt-1 text-xs text-red-500">{{ errors.email }}</p>
            </div>

            <div>
              <label for="direccion" class="block text-sm font-medium text-gray-700 mb-1.5">Direccion<span class="text-red-500">*</span></label>
              <input id="direccion" v-model="form.direccion" type="text" class="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A4972] focus:border-transparent transition-all" placeholder="Calle, Numero" required />
              <p v-if="errors.direccion" class="mt-1 text-xs text-red-500">{{ errors.direccion }}</p>
            </div>

            <div>
              <label for="telefono" class="block text-sm font-medium text-gray-700 mb-1.5">Telefono <span class="text-red-500">*</span></label>
              <input id="telefono" v-model="form.telefono" type="tel" class="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A4972] focus:border-transparent transition-all" placeholder="555 123 4567" required />
              <p v-if="errors.telefono" class="mt-1 text-xs text-red-500">{{ errors.telefono }}</p>
            </div>

            <div>
              <label for="tipoSolicitante" class="block text-sm font-medium text-gray-700 mb-1.5">Tipo de Solicitante <span class="text-red-500">*</span></label>
              <select id="tipoSolicitante" v-model="form.tipoSolicitante" class="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A4972] focus:border-transparent transition-all" required>
                <option value="" disabled>Seleccione una opcion</option>
                <option value="titular">Titular</option>
                <option value="representante">Representante Legal</option>
                <option value="apoderado">Apoderado</option>
              </select>
              <p v-if="errors.tipoSolicitante" class="mt-1 text-xs text-red-500">{{ errors.tipoSolicitante }}</p>
            </div>

            <div v-if="form.tipoSolicitante === 'representante' || form.tipoSolicitante === 'apoderado'">
              <label for="nombreRepresentante" class="block text-sm font-medium text-gray-700 mb-1.5">
                Nombre del {{ form.tipoSolicitante === 'representante' ? 'Representante' : 'Apoderado' }} <span class="text-red-500">*</span>
              </label>
              <input id="nombreRepresentante" v-model="form.nombreRepresentante" type="text" class="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A4972] focus:border-transparent transition-all" :placeholder="'Nombre completo del ' + (form.tipoSolicitante === 'representante' ? 'representante' : 'apoderado')" required />
              <p v-if="errors.nombreRepresentante" class="mt-1 text-xs text-red-500">{{ errors.nombreRepresentante }}</p>
            </div>
          </div>
        </section>

        <!-- Section 2: Datos del Proyecto -->
        <section class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <span class="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-sm font-bold text-[#1A4972]">2</span>
            Datos de la Solicitud
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label for="categoria" class="block text-sm font-medium text-gray-700 mb-1.5">Categoria <span class="text-red-500">*</span></label>
              <select id="categoria" v-model="form.categoria" class="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A4972] focus:border-transparent transition-all" required @change="form.subcategoria = ''">
                <option value="" disabled>Seleccione una categoria</option>
                <option v-for="cat in categoriasDocumentos" :key="cat.id" :value="cat.id">{{ cat.nombre }}</option>
              </select>
              <p v-if="errors.categoria" class="mt-1 text-xs text-red-500">{{ errors.categoria }}</p>
            </div>

            <div>
              <label for="subcategoria" class="block text-sm font-medium text-gray-700 mb-1.5">Subcategoria <span class="text-red-500">*</span></label>
              <select id="subcategoria" v-model="form.subcategoria" class="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A4972] focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed" :disabled="!form.categoria" required>
                <option value="" disabled>{{ form.categoria ? 'Seleccione una subcategoria' : 'Seleccione primero una categoria' }}</option>
                <option v-for="sub in subcategorias" :key="sub.id" :value="sub.id">{{ sub.nombre }}</option>
              </select>
              <p v-if="errors.subcategoria" class="mt-1 text-xs text-red-500">{{ errors.subcategoria }}</p>
            </div>

            <div class="md:col-span-2">
              <label for="expediente" class="block text-sm font-medium text-gray-700 mb-1.5">Numero de Expediente Asociado</label>
              <input id="expediente" v-model="form.expediente" type="text" class="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A4972] focus:border-transparent transition-all" placeholder="08001-2-25-XXXX (si aplica)" />
              <p class="mt-1 text-xs text-gray-500">Ingrese el numero de expediente si ya tiene uno asignado.</p>
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
            Adjunte todos los documentos requeridos para su solicitud. Los archivos deben estar en formato PDF, JPG o PNG con un tamano maximo de 10 MB por archivo.
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import FileUpload from '@/shared/components/FileUpload.vue'
import { useCategoriaDocumentos } from '@/shared/composables/useCategoriaDocumentos'
import { useSolicitudes } from '@/shared/composables/useSolicitudes'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

const submitted = ref(false)
const resultData = ref({ 
  // fecha: '2026-01-01', 
  // hora: '10:00', 
  // numerosolicitud: '65', 
  // vigencia: '2026', 
  // qr_image: 'data:image/png;base64,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', 
  // origen: 'web', 
  // solicitante_nombre: 'Juan Perez', 
  // solicitante_email: 'juan.perez@example.com', 
  // solicitante_identificacion: '1234567890', 
  // usuario_receptor: 'Juan Perez Martinez' 
  fecha: '', 
  hora: '', 
  numerosolicitud: '', 
  vigencia: '', 
  qr_image: '', 
  origen: '', 
  solicitante_nombre: '', 
  solicitante_email: '', 
  solicitante_identificacion: '', 
  usuario_receptor: '' 
})

const { 
  categoriasDocumentos, 
  getCategoriaDocumentos, 
  getSubCategoriasDocumentos, 
  loading: loadingCategorias, 
  apiError: errorCategorias 
} = useCategoriaDocumentos()

const {
  crearSolicitud,
  loading,
  apiError
} = useSolicitudes()

onMounted(async () => {
  await getCategoriaDocumentos()
})

const subcategorias = computed(() => {
  if (!form.value.categoria) return []
  return getSubCategoriasDocumentos(form.value.categoria) || []
})

const form = ref({
  nombre: '',
  identificacion: '',
  email: '',
  telefono: '',
  direccion: '',
  tipoSolicitante: '' as '' | 'titular' | 'representante' | 'apoderado',
  nombreRepresentante: '',
  categoria: '',
  subcategoria: '',
  expediente: '',
  descripcion: '',
  archivos: [] as File[]
})

const errors = ref<Record<string, string>>({})

function validate(): boolean {
  errors.value = {}

  if (!form.value.nombre.trim()) errors.value.nombre = 'El nombre es requerido'
  if (!form.value.identificacion.trim()) errors.value.identificacion = 'La identificación es requerida'
  if (!form.value.email.trim()) errors.value.email = 'El correo electronico es requerido'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) errors.value.email = 'Ingrese un correo electronico valido'
  if (!form.value.telefono.trim()) errors.value.telefono = 'El telefono es requerido'
  if (!form.value.direccion.trim()) errors.value.direccion = 'La direccion es requerida'
  if (!form.value.tipoSolicitante) errors.value.tipoSolicitante = 'Seleccione un tipo de solicitante'
  if ((form.value.tipoSolicitante === 'representante' || form.value.tipoSolicitante === 'apoderado') && !form.value.nombreRepresentante.trim()) {
    errors.value.nombreRepresentante = 'El nombre del representante/apoderado es requerido'
  }

  if (!form.value.categoria) errors.value.categoria = 'Seleccione una categoria'
  if (!form.value.subcategoria) errors.value.subcategoria = 'Seleccione una subcategoria'
  if (!form.value.descripcion.trim()) errors.value.descripcion = 'La descripcion es requerida'
  else if (form.value.descripcion.length > 2000) errors.value.descripcion = 'La descripcion no puede exceder 2000 caracteres'

  if (Object.keys(errors.value).length > 0) {
    const firstErrorKey = Object.keys(errors.value)[0]
    const el = document.getElementById(firstErrorKey)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return Object.keys(errors.value).length === 0
}

async function handleSubmit() {
  if (!validate()) return

  try {
    const formData = new FormData()
    formData.append('solicitante_nombre', form.value.nombre)
    formData.append('solicitante_email', form.value.email)
    formData.append('solicitante_identificacion', form.value.identificacion)
    formData.append('representante_nombre', form.value.nombreRepresentante)
    formData.append('representante_tipo', form.value.tipoSolicitante)
    formData.append('telefono', form.value.telefono)
    formData.append('direccion', form.value.direccion)
    formData.append('categoria_id', form.value.categoria)
    formData.append('subcategoria_id', form.value.subcategoria)
    formData.append('expediente', form.value.expediente)
    formData.append('descripcion', form.value.descripcion)

    if (form.value.archivos?.length) {
      form.value.archivos.forEach(file => formData.append('files[]', file));
    }

    const result = await crearSolicitud(formData)

    if (!result) {
      alert(apiError.value || 'Ocurrió un error al enviar la solicitud. Intente nuevamente.')
      return
    }

    resultData.value = { 
      fecha: result.fecha,
      hora: result.hora,
      numerosolicitud: result.numerosolicitud, 
      vigencia: result.vigencia, 
      qr_image: result.qr_image,
      origen: result.origen,
      solicitante_nombre: result.solicitante_nombre,
      solicitante_email: result.solicitante_email,
      solicitante_identificacion: result.solicitante_identificacion,
      usuario_receptor: result.usuario_receptor
    }
    submitted.value = true
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } catch (error) {
    alert('Ocurrió un error al enviar la solicitud. Intente nuevamente. Error: ' + error.message)
  }
}

function resetForm() {
  form.value = {
    nombre: '',
    identificacion: '',
    email: '',
    telefono: '',
    direccion: '',
    tipoSolicitante: '',
    nombreRepresentante: '',
    categoria: '',
    subcategoria: '',
    expediente: '',
    descripcion: '',
    archivos: [] as File[]
  }
  errors.value = {}
  submitted.value = false
  // resultData.value = { numerosolicitud: '', vigencia: '', qr_image: '' }
}

const printForm = async () => {
  const element = document.getElementById('pdf-content')
  const canvas = await html2canvas(element, {
    useCORS: true,
    scale: 2,
  })
  const imgData = canvas.toDataURL('image/png')

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'letter'
  })

  const pageWidth = pdf.internal.pageSize.getWidth()   // 215.9mm
  const pageHeight = pdf.internal.pageSize.getHeight() // 279.4mm

  // Convierte a mm y aplica 70%
  const pxToMm = 0.264583
  const imgWidth = element.offsetWidth * pxToMm * 0.7
  const imgHeight = element.offsetHeight * pxToMm * 0.7

  // Esquina superior derecha con pequeño margen
  const margin = 10
  const x = pageWidth - imgWidth - margin
  const y = margin

  pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight)
  pdf.save(`${resultData.value.numerosolicitud}-${resultData.value.vigencia}.pdf`)
}
</script>
