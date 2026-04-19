<template>
  <div>
    <!-- Header -->
    <div class="flex items-center gap-3 mb-6">
      <div class="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
        <DocumentCheckIcon class="w-5 h-5" />
      </div>
      <div>
        <h2 class="text-lg font-bold text-text">Respuesta Oficial</h2>
        <p class="text-sm text-gray-500">Registre la respuesta final a esta solicitud</p>
      </div>
    </div>

    <!-- Error API -->
    <div v-if="apiError" class="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
      {{ apiError }}
    </div>

    <!-- Vista de lectura: respuesta ya registrada -->
    <template v-if="respuesta && !editando">
      <div class="rounded-xl border border-gray-200 overflow-hidden mb-4">

        <!-- Cabecera: resultado + meta -->
        <div class="px-5 py-4 bg-gray-50 border-b border-gray-200 flex flex-wrap items-center gap-3">
          <span
            class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
            :class="resultadoActual?.badgeClass"
          >
            <span class="w-1.5 h-1.5 rounded-full" :class="resultadoActual?.dotClass" />
            {{ resultadoActual?.label }}
          </span>
          <span class="text-xs text-gray-500">
            Registrada por
            <span class="font-semibold text-gray-700">{{ respuesta.usuario_nombre ?? respuesta.usuario_name ?? 'Sistema' }}</span>
            el {{ formatDateTime(respuesta.created_at) }}
          </span>
        </div>

        <!-- Contenido -->
        <div class="px-5 py-4">
          <p class="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">{{ respuesta.contenido }}</p>
        </div>

        <!-- Notificación -->
        <div
          v-if="respuesta.canal_notificacion && respuesta.canal_notificacion !== 'no_notificado'"
          class="px-5 py-3 bg-blue-50 border-t border-blue-100 flex items-center gap-2"
        >
          <BellIcon class="w-4 h-4 text-blue-500 flex-shrink-0" />
          <span class="text-xs text-blue-700">
            Ciudadano notificado por
            <span class="font-semibold">{{ canalActual?.label }}</span>
            <template v-if="respuesta.fecha_notificacion">
              el <span class="font-semibold">{{ formatDateOnly(respuesta.fecha_notificacion) }}</span>
            </template>
          </span>
        </div>
      </div>

      <!-- Adjuntos de la respuesta -->
      <div v-if="respuesta.adjuntos?.length" class="mb-5">
        <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Archivos adjuntos</p>
        <div class="flex flex-col gap-2">
          <a
            v-for="archivo in respuesta.adjuntos"
            :key="archivo.id"
            :href="archivo.url"
            target="_blank"
            class="flex items-center gap-3 rounded-lg bg-gray-50 px-4 py-3 hover:bg-gray-100 transition-colors group"
          >
            <div
              class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              :class="archivo.mime_type === 'application/pdf' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'"
            >
              <PaperClipIcon class="w-4 h-4" />
            </div>
            <div class="min-w-0 flex-1">
              <p class="text-sm font-medium text-gray-900 truncate group-hover:text-[#1A4972]">{{ archivo.file_name }}</p>
              <p class="text-xs text-gray-500">{{ formatFileSize(archivo.size_bytes) }}</p>
            </div>
            <ArrowDownTrayIcon class="w-4 h-4 text-gray-400 group-hover:text-[#1A4972] flex-shrink-0" />
          </a>
        </div>
      </div>

      <div class="flex justify-end">
        <button
          type="button"
          @click="iniciarEdicion"
          :disabled="respuestaLoading"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-[#1A4972] border border-[#1A4972] hover:bg-[#1A4972] hover:text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <PencilSquareIcon class="w-4 h-4" />
          Editar respuesta
        </button>
      </div>
    </template>

    <!-- Formulario: nueva respuesta o edición -->
    <template v-else>
      <div class="flex flex-col gap-5">

        <!-- Descripción -->
        <div>
          <label for="respContenido" class="block text-sm font-semibold text-gray-700 mb-1">
            Descripción de la respuesta <span class="text-red-500">*</span>
          </label>
          <textarea
            id="respContenido"
            v-model="form.contenido"
            rows="6"
            maxlength="3000"
            placeholder="Redacte la respuesta oficial a esta solicitud..."
            class="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-[#1A4972] focus:border-transparent resize-none transition-colors"
            :class="formErrors.contenido ? 'border-red-400 bg-red-50' : 'border-gray-300'"
          />
          <div class="flex items-start justify-between mt-1 gap-2">
            <p v-if="formErrors.contenido" class="text-xs text-red-500">{{ formErrors.contenido }}</p>
            <p class="text-xs text-gray-400 ml-auto tabular-nums">{{ form.contenido.length }}&thinsp;/&thinsp;3000</p>
          </div>
        </div>

        <!-- Adjuntos existentes (solo en edición) -->
        <div v-if="editando && respuesta?.adjuntos?.length" class="flex flex-col gap-2">
          <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Archivos adjuntos actuales</p>
          <a
            v-for="archivo in respuesta.adjuntos"
            :key="archivo.id"
            :href="archivo.url"
            target="_blank"
            class="flex items-center gap-3 rounded-lg bg-gray-50 px-4 py-3 hover:bg-gray-100 transition-colors group"
          >
            <div
              class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              :class="archivo.mime_type === 'application/pdf' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'"
            >
              <PaperClipIcon class="w-4 h-4" />
            </div>
            <div class="min-w-0 flex-1">
              <p class="text-sm font-medium text-gray-900 truncate group-hover:text-[#1A4972]">{{ archivo.file_name }}</p>
              <p class="text-xs text-gray-500">{{ formatFileSize(archivo.size_bytes) }}</p>
            </div>
            <ArrowDownTrayIcon class="w-4 h-4 text-gray-400 group-hover:text-[#1A4972] flex-shrink-0" />
          </a>
        </div>

        <!-- FileUpload -->
        <FileUpload v-model="form.archivos" label="Agregar nuevos documentos" />

        <!-- Botón cancelar edición (solo al editar) -->
        <div v-if="editando" class="flex justify-start">
          <button
            type="button"
            @click="cancelarEdicion"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-gray-600 border border-gray-300 hover:bg-gray-50 transition-colors duration-200"
          >
            Cancelar
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
  import { reactive, ref, computed } from 'vue'
  import Swal from 'sweetalert2'
  import {
    DocumentCheckIcon,
    BellIcon,
    PaperClipIcon,
    PencilSquareIcon,
    ArrowDownTrayIcon,
  } from '@heroicons/vue/24/outline'
  import FileUpload from '@/shared/components/common/FileUpload.vue'
  import { useSolicitudes } from '@/shared/composables/useSolicitudes'

  const props = defineProps({
    solicitudId: { type: [String, Number], required: true },
  })

  const respuesta = defineModel('respuesta', { default: null })

  const { crearRespuesta, editarRespuesta, respuestaLoading, apiError } = useSolicitudes()

  // ─── Constantes (solo para vista de lectura) ────────────────────────────────

  const RESULTADOS = [
    { value: 'aprobado',   label: 'Aprobado',               dotClass: 'bg-emerald-500', badgeClass: 'bg-emerald-100 text-emerald-800' },
    { value: 'negado',     label: 'Negado',                 dotClass: 'bg-red-500',     badgeClass: 'bg-red-100 text-red-800' },
    { value: 'parcial',    label: 'Aprobado parcialmente',  dotClass: 'bg-amber-500',   badgeClass: 'bg-amber-100 text-amber-800' },
    { value: 'en_tramite', label: 'En trámite',             dotClass: 'bg-blue-500',    badgeClass: 'bg-blue-100 text-blue-800' },
    { value: 'archivado',  label: 'Archivado',              dotClass: 'bg-gray-500',    badgeClass: 'bg-gray-100 text-gray-700' },
  ]

  const CANALES = [
    { value: 'email',         label: 'Correo electrónico' },
    { value: 'presencial',    label: 'Presencial' },
    { value: 'correo_fisico', label: 'Correo físico' },
    { value: 'telefono',      label: 'Teléfono' },
    { value: 'no_notificado', label: 'No notificado' },
  ]

  // ─── Estado del formulario ─────────────────────────────────────────────────

  const editando = ref(false)
  const formErrors = ref({})

  const form = reactive({
    contenido: '',
    archivos: [],
  })

  // ─── Computados ─────────────────────────────────────────────────────────────

  const resultadoActual = computed(() =>
    RESULTADOS.find((r) => r.value === respuesta.value?.resultado)
  )

  const canalActual = computed(() =>
    CANALES.find((c) => c.value === respuesta.value?.canal_notificacion)
  )

  // ─── Acciones ───────────────────────────────────────────────────────────────

  function iniciarEdicion() {
    form.contenido   = respuesta.value.contenido ?? ''
    form.archivos    = []
    formErrors.value = {}
    editando.value   = true
  }

  function cancelarEdicion() {
    editando.value   = false
    formErrors.value = {}
  }

  function validar() {
    formErrors.value = {}
    if (!form.contenido.trim()) formErrors.value.contenido = 'La descripción es requerida'
    return Object.keys(formErrors.value).length === 0
  }

  async function guardar() {
    if (respuesta.value && !editando.value) return true

    if (!validar()) return false

    const eraEdicion = editando.value && !!respuesta.value?.id

    const payload = {
      contenido: form.contenido.trim(),
      archivos:  form.archivos,
    }

    let resultado
    if (eraEdicion) {
      resultado = await editarRespuesta(props.solicitudId, respuesta.value.id, payload)
    } else {
      resultado = await crearRespuesta(props.solicitudId, payload)
    }

    if (!resultado) {
      await Swal.fire({
        icon: 'error',
        title: 'No se pudo guardar',
        text: apiError.value || 'Ocurrió un error al guardar la respuesta.',
        showConfirmButton: true,
      })
      return false
    }

    respuesta.value = resultado
    editando.value  = false

    await Swal.fire({
      icon: 'success',
      title: eraEdicion ? 'Respuesta actualizada' : 'Respuesta registrada',
      text: 'La respuesta oficial ha sido guardada correctamente.',
      timer: 2000,
      showConfirmButton: false,
    })

    return true
  }

  // ─── Exposición al padre ─────────────────────────────────────────────────────

  defineExpose({ save: guardar, loading: respuestaLoading })

  // ─── Utilidades ─────────────────────────────────────────────────────────────

  function formatDateTime(str) {
    if (!str) return '-'
    return new Date(str).toLocaleString('es-CO', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  }

  function formatDateOnly(str) {
    if (!str) return '-'
    return new Date(str).toLocaleDateString('es-CO', {
      year: 'numeric', month: 'long', day: 'numeric',
    })
  }

  function formatFileSize(bytes) {
    if (!bytes) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }
</script>
