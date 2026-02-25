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
          Su solicitud ha sido registrada. Guarde los siguientes datos para dar seguimiento.
        </p>
        <div class="inline-flex flex-col gap-4 text-left">
          <div class="rounded-xl bg-gray-100 px-6 py-4">
            <span class="text-xs text-gray-500 font-medium uppercase tracking-wider">Numero de Solicitud</span>
            <p class="text-lg font-bold font-mono text-[#1A4972] mt-1">{{ resultData.numero }}</p>
          </div>
          <div class="rounded-xl bg-gray-100 px-6 py-4">
            <span class="text-xs text-gray-500 font-medium uppercase tracking-wider">Vigencia</span>
            <p class="text-lg font-bold font-mono text-gray-900 mt-1">{{ resultData.vigencia }}</p>
          </div>
        </div>
        <div class="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <router-link to="/consultar" class="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1A4972] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#143a5c] transition-colors duration-200">
            Consultar Solicitud
          </router-link>
          <button @click="resetForm" class="inline-flex items-center justify-center gap-2 rounded-lg bg-white border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50 transition-colors duration-200">
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
              <label for="nombre" class="block text-sm font-medium text-gray-700 mb-1.5">Nombre Completo <span class="text-red-500">*</span></label>
              <input id="nombre" v-model="form.nombre" type="text" class="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A4972] focus:border-transparent transition-all" placeholder="Nombre(s) y Apellido(s)" required />
              <p v-if="errors.nombre" class="mt-1 text-xs text-red-500">{{ errors.nombre }}</p>
            </div>

            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-1.5">Correo Electronico <span class="text-red-500">*</span></label>
              <input id="email" v-model="form.email" type="email" class="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A4972] focus:border-transparent transition-all" placeholder="correo@ejemplo.com" required />
              <p v-if="errors.email" class="mt-1 text-xs text-red-500">{{ errors.email }}</p>
            </div>

            <div>
              <label for="telefono" class="block text-sm font-medium text-gray-700 mb-1.5">Telefono <span class="text-red-500">*</span></label>
              <input id="telefono" v-model="form.telefono" type="tel" class="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A4972] focus:border-transparent transition-all" placeholder="+52 555 123 4567" required />
              <p v-if="errors.telefono" class="mt-1 text-xs text-red-500">{{ errors.telefono }}</p>
            </div>

            <div class="md:col-span-2">
              <label for="direccion" class="block text-sm font-medium text-gray-700 mb-1.5">Direccion del Inmueble <span class="text-red-500">*</span></label>
              <input id="direccion" v-model="form.direccion" type="text" class="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A4972] focus:border-transparent transition-all" placeholder="Calle, Numero, Colonia, Ciudad, Estado, CP" required />
              <p v-if="errors.direccion" class="mt-1 text-xs text-red-500">{{ errors.direccion }}</p>
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
            Datos del Proyecto
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label for="categoria" class="block text-sm font-medium text-gray-700 mb-1.5">Categoria <span class="text-red-500">*</span></label>
              <select id="categoria" v-model="form.categoria" class="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A4972] focus:border-transparent transition-all" required @change="form.subcategoria = ''">
                <option value="" disabled>Seleccione una categoria</option>
                <!-- <option v-for="cat in Object.keys(CATEGORIAS)" :key="cat" :value="cat">{{ cat }}</option> -->
              </select>
              <p v-if="errors.categoria" class="mt-1 text-xs text-red-500">{{ errors.categoria }}</p>
            </div>

            <div>
              <label for="subcategoria" class="block text-sm font-medium text-gray-700 mb-1.5">Subcategoria <span class="text-red-500">*</span></label>
              <select id="subcategoria" v-model="form.subcategoria" class="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A4972] focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed" :disabled="!form.categoria" required>
                <option value="" disabled>{{ form.categoria ? 'Seleccione una subcategoria' : 'Seleccione primero una categoria' }}</option>
                <option v-for="sub in subcategorias" :key="sub" :value="sub">{{ sub }}</option>
              </select>
              <p v-if="errors.subcategoria" class="mt-1 text-xs text-red-500">{{ errors.subcategoria }}</p>
            </div>

            <div class="md:col-span-2">
              <label for="expediente" class="block text-sm font-medium text-gray-700 mb-1.5">Numero de Expediente Asociado</label>
              <input id="expediente" v-model="form.expediente" type="text" class="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A4972] focus:border-transparent transition-all" placeholder="EXP-2025-XXXXX (si aplica)" />
              <p class="mt-1 text-xs text-gray-500">Ingrese el numero de expediente si ya tiene uno asignado.</p>
            </div>

            <div class="md:col-span-2">
              <label for="descripcion" class="block text-sm font-medium text-gray-700 mb-1.5">Descripcion de la Solicitud <span class="text-red-500">*</span></label>
              <textarea
                id="descripcion"
                v-model="form.descripcion"
                class="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A4972] focus:border-transparent transition-all resize-y"
                rows="5"
                placeholder="Describa detalladamente el proyecto de construccion, incluyendo dimensiones, materiales a utilizar, superficie, numero de niveles, y cualquier otra informacion relevante..."
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
import { ref, computed } from 'vue'
// import { CATEGORIAS } from '@/types'
// import { crearSolicitud } from '@/services/api'
import FileUpload from '@/shared/components/FileUpload.vue'

const loading = ref(false)
const submitted = ref(false)
const resultData = ref({ numero: '', vigencia: '' })

const form = ref({
  nombre: '',
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

const subcategorias = computed(() => {
  // return form.value.categoria ? CATEGORIAS[form.value.categoria] || [] : []
})

function validate(): boolean {
  errors.value = {}

  if (!form.value.nombre.trim()) errors.value.nombre = 'El nombre es requerido'
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

  loading.value = true

  try {
    const archivosData = form.value.archivos.map(f => ({
      nombre: f.name,
      tamano: f.size,
      tipo: f.type
    }))

    const result = { numero: '1234567890', vigencia: '2026-01-01' }
    // const result = await crearSolicitud({
    //   nombre: form.value.nombre,
    //   email: form.value.email,
    //   telefono: form.value.telefono,
    //   direccion: form.value.direccion,
    //   categoria: form.value.categoria,
    //   subcategoria: form.value.subcategoria,
    //   expediente: form.value.expediente,
    //   tipoSolicitante: form.value.tipoSolicitante as 'titular' | 'representante' | 'apoderado',
    //   nombreRepresentante: form.value.nombreRepresentante || undefined,
    //   descripcion: form.value.descripcion,
    //   archivos: archivosData
    // })

    resultData.value = { numero: result.numero, vigencia: result.vigencia }
    submitted.value = true
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } catch {
    alert('Ocurrio un error al enviar la solicitud. Intente nuevamente.')
  } finally {
    loading.value = false
  }
}

function resetForm() {
  form.value = {
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    tipoSolicitante: '',
    nombreRepresentante: '',
    categoria: '',
    subcategoria: '',
    expediente: '',
    descripcion: '',
    archivos: []
  }
  errors.value = {}
  submitted.value = false
  resultData.value = { numero: '', vigencia: '' }
}
</script>
