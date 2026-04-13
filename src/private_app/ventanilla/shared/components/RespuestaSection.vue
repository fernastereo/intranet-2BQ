<template>
  <div>
    <!-- Header -->
    <div class="flex items-center gap-3 mb-6">
      <div class="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
        <DocumentCheckIcon class="w-5 h-5 text-emerald-700" />
      </div>
      <div>
        <h2 class="text-lg font-bold text-gray-900">Respuesta Oficial</h2>
        <p class="text-sm text-gray-500">Registre la respuesta final a esta solicitud</p>
      </div>
    </div>

    <!-- Error -->
    <div v-if="apiError" class="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
      {{ apiError }}
    </div>

    <!-- Vista de lectura: respuesta ya registrada -->
    <template v-if="respuesta && !editando">
      <div class="rounded-xl border border-gray-200 overflow-hidden mb-4">

        <!-- Cabecera: resultado + meta -->
        <div class="px-5 py-4 bg-gray-50 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3">
          <div class="flex flex-wrap items-center gap-3">
            <span
              class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
              :class="resultadoActual?.badgeClass"
            >
              <span class="w-1.5 h-1.5 rounded-full" :class="resultadoActual?.dotClass" />
              {{ resultadoActual?.label }}
            </span>
            <span class="text-xs text-gray-500">
              Registrada por
              <span class="font-semibold text-gray-700">{{ respuesta.usuario?.name ?? 'Sistema' }}</span>
              el {{ formatDateTime(respuesta.created_at) }}
            </span>
          </div>
          <span
            class="inline-flex items-center gap-1.5 text-xs font-medium"
            :class="respuesta.visible_ciudadano ? 'text-emerald-700' : 'text-gray-400'"
          >
            <component :is="respuesta.visible_ciudadano ? EyeIcon : EyeSlashIcon" class="w-3.5 h-3.5" />
            {{ respuesta.visible_ciudadano ? 'Visible para el ciudadano' : 'No visible para el ciudadano' }}
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
          class="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-[#1A4972] border border-[#1A4972] hover:bg-[#1A4972] hover:text-white transition-colors duration-200"
        >
          <PencilSquareIcon class="w-4 h-4" />
          Editar respuesta
        </button>
      </div>
    </template>

    <!-- Formulario: nueva respuesta o edición -->
    <template v-else>
      <div class="flex flex-col gap-5">

        <!-- Resultado -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            Resultado de la solicitud <span class="text-red-500">*</span>
          </label>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <button
              v-for="r in RESULTADOS"
              :key="r.value"
              type="button"
              @click="form.resultado = r.value"
              class="flex items-center gap-2 px-3 py-2.5 rounded-lg border-2 text-sm font-medium transition-all duration-150 text-left"
              :class="form.resultado === r.value ? r.activeClass : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50'"
            >
              <span class="w-2 h-2 rounded-full flex-shrink-0" :class="r.dotClass" />
              {{ r.label }}
            </button>
          </div>
          <p v-if="formErrors.resultado" class="text-xs text-red-500 mt-1">{{ formErrors.resultado }}</p>
        </div>

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

        <!-- Canal + Fecha notificación -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label for="respCanal" class="block text-sm font-semibold text-gray-700 mb-1">Canal de notificación al ciudadano</label>
            <select
              id="respCanal"
              v-model="form.canal_notificacion"
              class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A4972] focus:border-transparent bg-white"
            >
              <option v-for="c in CANALES" :key="c.value" :value="c.value">{{ c.label }}</option>
            </select>
          </div>
          <div>
            <label for="respFecha" class="block text-sm font-semibold text-gray-700 mb-1">
              Fecha de notificación
              <span v-if="form.canal_notificacion === 'no_notificado'" class="font-normal text-gray-400">(no aplica)</span>
            </label>
            <input
              id="respFecha"
              type="date"
              v-model="form.fecha_notificacion"
              :disabled="form.canal_notificacion === 'no_notificado'"
              class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A4972] focus:border-transparent disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        <!-- Visible para ciudadano -->
        <div class="flex items-center justify-between rounded-xl bg-gray-50 border border-gray-200 px-4 py-3.5">
          <div>
            <p class="text-sm font-semibold text-gray-700">Visible para el ciudadano</p>
            <p class="text-xs text-gray-500 mt-0.5">El ciudadano podrá ver esta respuesta en el portal de consulta</p>
          </div>
          <button
            type="button"
            role="switch"
            :aria-checked="form.visible_ciudadano"
            @click="form.visible_ciudadano = !form.visible_ciudadano"
            class="relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1A4972] focus-visible:ring-offset-2"
            :class="form.visible_ciudadano ? 'bg-[#1A4972]' : 'bg-gray-300'"
          >
            <span
              aria-hidden="true"
              class="pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-md transform transition duration-200 ease-in-out"
              :class="form.visible_ciudadano ? 'translate-x-5' : 'translate-x-0'"
            />
          </button>
        </div>

        <!-- FileUpload -->
        <FileUpload v-model="form.archivos" label="Documentos de la respuesta" />

        <!-- Botones -->
        <div class="flex items-center justify-end gap-3 pt-1">
          <button
            v-if="editando"
            type="button"
            @click="cancelarEdicion"
            class="px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            @click="guardar"
            :disabled="respuestaLoading"
            class="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 transition-colors duration-200"
          >
            <svg v-if="respuestaLoading" class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" stroke-opacity="0.25" />
              <path d="M12 2a10 10 0 0 1 10 10" stroke-opacity="1" />
            </svg>
            <CheckIcon v-else class="w-4 h-4" />
            {{ respuesta ? 'Actualizar respuesta' : 'Guardar respuesta' }}
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
    EyeIcon,
    EyeSlashIcon,
    BellIcon,
    PaperClipIcon,
    PencilSquareIcon,
    ArrowDownTrayIcon,
    CheckIcon,
  } from '@heroicons/vue/24/outline'
  import FileUpload from '@/shared/components/common/FileUpload.vue'
  import { useSolicitudes } from '@/shared/composables/useSolicitudes'

  const props = defineProps({
    solicitudId: { type: [String, Number], required: true },
  })

  const respuesta = defineModel('respuesta', { default: null })

  const { crearRespuesta, respuestaLoading, apiError } = useSolicitudes()

  // ─── Constantes ────────────────────────────────────────────────────────────

  const RESULTADOS = [
    {
      value: 'aprobado',
      label: 'Aprobado',
      activeClass: 'border-emerald-500 bg-emerald-50 text-emerald-700',
      dotClass: 'bg-emerald-500',
      badgeClass: 'bg-emerald-100 text-emerald-800',
    },
    {
      value: 'negado',
      label: 'Negado',
      activeClass: 'border-red-500 bg-red-50 text-red-700',
      dotClass: 'bg-red-500',
      badgeClass: 'bg-red-100 text-red-800',
    },
    {
      value: 'parcial',
      label: 'Aprobado parcialmente',
      activeClass: 'border-amber-500 bg-amber-50 text-amber-700',
      dotClass: 'bg-amber-500',
      badgeClass: 'bg-amber-100 text-amber-800',
    },
    {
      value: 'en_tramite',
      label: 'En trámite',
      activeClass: 'border-blue-500 bg-blue-50 text-blue-700',
      dotClass: 'bg-blue-500',
      badgeClass: 'bg-blue-100 text-blue-800',
    },
    {
      value: 'archivado',
      label: 'Archivado',
      activeClass: 'border-gray-500 bg-gray-100 text-gray-700',
      dotClass: 'bg-gray-500',
      badgeClass: 'bg-gray-100 text-gray-700',
    },
  ]

  const CANALES = [
    { value: 'email',          label: 'Correo electrónico' },
    { value: 'presencial',     label: 'Presencial' },
    { value: 'correo_fisico',  label: 'Correo físico' },
    { value: 'telefono',       label: 'Teléfono' },
    { value: 'no_notificado',  label: 'No notificado' },
  ]

  // ─── Estado del formulario ─────────────────────────────────────────────────

  const editando = ref(false)
  const formErrors = ref({})

  const form = reactive({
    contenido: '',
    resultado: '',
    canal_notificacion: 'email',
    fecha_notificacion: new Date().toISOString().split('T')[0],
    visible_ciudadano: true,
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
    form.contenido          = respuesta.value.contenido ?? ''
    form.resultado          = respuesta.value.resultado ?? ''
    form.canal_notificacion = respuesta.value.canal_notificacion ?? 'email'
    form.fecha_notificacion = respuesta.value.fecha_notificacion ?? new Date().toISOString().split('T')[0]
    form.visible_ciudadano  = respuesta.value.visible_ciudadano ?? true
    form.archivos           = []
    formErrors.value        = {}
    editando.value          = true
  }

  function cancelarEdicion() {
    editando.value   = false
    formErrors.value = {}
  }

  function validar() {
    formErrors.value = {}
    if (!form.resultado)       formErrors.value.resultado = 'Seleccione un resultado'
    if (!form.contenido.trim()) formErrors.value.contenido = 'La descripción es requerida'
    return Object.keys(formErrors.value).length === 0
  }

  async function guardar() {
    if (!validar()) return

    const resultado = await crearRespuesta(props.solicitudId, {
      contenido:          form.contenido.trim(),
      resultado:          form.resultado,
      canal_notificacion: form.canal_notificacion,
      fecha_notificacion: form.canal_notificacion !== 'no_notificado' ? form.fecha_notificacion : null,
      visible_ciudadano:  form.visible_ciudadano,
      archivos:           form.archivos,
    })

    if (!resultado) {
      await Swal.fire({
        icon: 'error',
        title: 'No se pudo guardar',
        text: apiError.value,
        showConfirmButton: true,
      })
      return
    }

    respuesta.value = resultado
    editando.value  = false

    await Swal.fire({
      icon: 'success',
      title: 'Respuesta registrada',
      text: 'La respuesta oficial ha sido guardada correctamente.',
      timer: 2000,
      showConfirmButton: false,
    })
  }

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
