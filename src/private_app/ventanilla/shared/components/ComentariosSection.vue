<template>
  <div class="flex items-center gap-3 mb-6">
    <div class="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
      <ComentarioIcon />
    </div>
    <div>
      <h2 class="text-lg font-bold text-text">Comentarios y Seguimiento</h2>
      <p class="text-sm text-gray-400">Agregue comentarios para dar seguimiento a la solicitud</p>
    </div>
  </div>
  <div>
    <!-- Formulario para agregar comentario -->
    <div class="mb-6">
      <label for="nuevoComentario" class="block text-sm font-medium text-gray-700 mb-1.5">Agregar Comentario</label>
      <div class="flex flex-col gap-3">
        <textarea
          id="nuevoComentario"
          v-model="nuevoComentario"
          class="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A4972] focus:border-transparent resize-none"
          rows="3"
          placeholder="Escriba su comentario aquí..."
        ></textarea>
        <p v-if="apiError" class="text-xs text-red-500">{{ apiError }}</p>
        <button
          type="button"
          @click="agregarComentario"
          :disabled="!nuevoComentario.trim() || loading"
          class="self-end inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1A4972] focus-visible:ring-offset-2"
          :class="nuevoComentario.trim() && !loading
            ? 'bg-[#1A4972] text-white hover:bg-[#143a5c]'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'"
        >
          <svg v-if="loading" class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" stroke-opacity="0.25" />
            <path d="M12 2a10 10 0 0 1 10 10" stroke-opacity="1" />
          </svg>
          <svg v-else class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
          {{ loading ? 'Enviando...' : 'Agregar Comentario' }}
        </button>
      </div>
    </div>

    <!-- Lista de comentarios con estilo timeline -->
    <div>
      <h4 class="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
        Comentarios
        <span class="ml-1 text-xs font-normal">({{ comentarios.length }})</span>
      </h4>

      <div v-if="comentarios.length === 0" class="text-center py-10 rounded-xl bg-gray-50">
        <div class="w-12 h-12 rounded-full bg-white flex items-center justify-center mx-auto mb-3">
          <svg class="w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </div>
        <p class="text-sm text-gray-500">Aún no hay comentarios registrados.</p>
        <p class="text-xs text-gray-400 mt-1">Agregue el primer comentario usando el formulario de arriba.</p>
      </div>

      <div v-else class="flex flex-col gap-0">
        <div
          v-for="(comentario, index) in comentarios"
          :key="comentario.id"
          class="relative flex gap-4"
          :class="index !== comentarios.length - 1 ? 'pb-2' : ''"
        >
          <!-- Línea y punto del timeline -->
          <div class="flex flex-col items-center">
            <div class="w-3 h-3 rounded-full bg-[#1A4972] border-2 border-[#1A4972] flex-shrink-0"></div>
            <div
              v-if="index !== comentarios.length - 1"
              class="w-0.5 flex-1 mt-1 bg-blue-200"
            ></div>
          </div>

          <!-- Contenido del comentario -->
          <div class="flex-1 -mt-0.5 pb-0">
            <div class="rounded-xl bg-gray-50 p-2">
              <div class="flex items-center justify-between gap-2 mb-2">
                <span class="text-xs font-semibold text-gray-900">{{ comentario.autor }}</span>
                <span class="text-xs text-gray-500">{{ formatFechaHora(comentario.fecha) }}</span>
              </div>
              <p class="text-xs text-gray-600 leading-relaxed">{{ comentario.texto }}</p>
            </div>
            <!-- Botón eliminar -->
            <button
              type="button"
              @click="eliminarComentario(comentario.id)"
              class="mt-2 inline-flex items-center gap-1 text-xs text-gray-400 hover:text-red-600 transition-colors"
            >
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import { useSolicitudes } from '@/shared/composables/useSolicitudes'
  import ComentarioIcon from '@/shared/components/common/icons/ComentarioIcon.vue'

  const props = defineProps({
    solicitudId: { type: [String, Number], required: true },
    modelValue: { type: Array, default: () => [] },
  })

  const emit = defineEmits(['update:modelValue'])

  const { crearComentario, loading, apiError } = useSolicitudes()

  const comentarios = ref([...props.modelValue])
  const nuevoComentario = ref('')

  async function agregarComentario() {
    if (!nuevoComentario.value.trim()) return

    const resultado = await crearComentario(props.solicitudId, nuevoComentario.value.trim())

    if (!resultado) return

    comentarios.value = [{
      id: resultado.id,
      texto: resultado.contenido,
      autor: resultado.autor ?? 'Funcionario',
      fecha: resultado.created_at,
    }, ...comentarios.value]
    emit('update:modelValue', comentarios.value)
    nuevoComentario.value = ''
  }

  function eliminarComentario(id) {
    comentarios.value = comentarios.value.filter(c => c.id !== id)
    emit('update:modelValue', comentarios.value)
  }

  function formatFechaHora(fechaISO) {
    return new Date(fechaISO).toLocaleString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }
</script>
