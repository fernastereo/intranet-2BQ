<template>
  <div class="bg-white rounded-lg shadow-sm p-6">
    <div class="flex items-center gap-3 mb-4">
      <div class="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
        <UserGroupIcon class="w-5 h-5 text-indigo-700" />
      </div>
      <div>
        <h3 class="text-sm font-bold text-gray-500 uppercase tracking-wide">Asignados</h3>
        <p class="text-xs text-gray-400">Gestione quién da seguimiento a esta solicitud</p>
      </div>
    </div>

    <div v-if="errorCarga" class="text-xs text-red-500 mb-3">{{ errorCarga }}</div>

    <div v-if="asignados.length" class="flex flex-col gap-2 mb-4">
      <div
        v-for="item in asignados"
        :key="item.id"
        class="flex items-center justify-between gap-2 rounded-lg bg-gray-50 px-3 py-2"
      >
        <span class="text-sm text-gray-900 capitalize truncate">{{ item.name }}</span>
        <button
          type="button"
          class="shrink-0 text-xs font-semibold text-red-600 hover:text-red-800 disabled:opacity-50"
          :disabled="asignacionesLoading"
          @click="quitar(item.id)"
        >
          Quitar
        </button>
      </div>
    </div>
    <p v-else class="text-xs text-gray-500 mb-4">Ningún usuario asignado.</p>

    <div class="flex flex-col gap-3">
      <div>
        <label for="asignarUsuario" class="block text-xs font-medium text-gray-700 mb-1">Agregar funcionario</label>
        <select
          id="asignarUsuario"
          v-model="usuarioSeleccionado"
          class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A4972] focus:border-transparent bg-white"
          :disabled="loadingUsuarios || asignacionesLoading || !usuariosDisponibles.length"
        >
          <option :value="null">
            {{ loadingUsuarios ? 'Cargando usuarios...' : 'Seleccione un usuario' }}
          </option>
          <option v-for="u in usuariosDisponibles" :key="u.id" :value="u.id">
            {{ u.name }}
          </option>
        </select>
      </div>
      <div class="flex flex-wrap gap-2 justify-end">
        <button
          type="button"
          class="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-white bg-[#1A4972] hover:bg-[#143a5c] disabled:opacity-50"
          :disabled="asignacionesLoading || !usuarioSeleccionado"
          @click="agregar"
        >
          <svg v-if="asignacionesLoading" class="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" stroke-opacity="0.25" />
            <path d="M12 2a10 10 0 0 1 10 10" stroke-opacity="1" />
          </svg>
          Agregar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed, onMounted } from 'vue'
  import Swal from 'sweetalert2'
  import { UserGroupIcon } from '@heroicons/vue/24/outline'
  import { useSolicitudes } from '@/shared/composables/useSolicitudes'

  const props = defineProps({
    solicitudId: { type: [String, Number], required: true },
  })

  const asignados = defineModel('asignados', { type: Array, default: () => [] })

  const { getUsuarios, asignarUsuario, desasignarUsuario, asignacionesLoading, apiError } = useSolicitudes()

  const usuarios = ref([])
  const usuarioSeleccionado = ref(null)
  const loadingUsuarios = ref(false)
  const errorCarga = ref('')

  const idsAsignados = computed(() => new Set(asignados.value.map((a) => a.id)))

  const usuariosDisponibles = computed(() =>
    usuarios.value.filter((u) => !idsAsignados.value.has(u.id))
  )

  onMounted(async () => {
    loadingUsuarios.value = true
    const result = await getUsuarios()
    if (!result.length && apiError.value) {
      errorCarga.value = apiError.value
    }
    usuarios.value = result
    loadingUsuarios.value = false
  })

  const agregar = async () => {
    if (!usuarioSeleccionado.value) return

    const resultado = await asignarUsuario(props.solicitudId, usuarioSeleccionado.value)
    if (!resultado) {
      await Swal.fire({
        icon: 'error',
        title: 'No se pudo completar',
        text: apiError.value,
        showConfirmButton: true,
      })
      return
    }

    asignados.value = [...asignados.value, resultado]
    usuarioSeleccionado.value = null
  }

  const quitar = async (userId) => {
    if (!(await desasignarUsuario(props.solicitudId, userId))) {
      await Swal.fire({
        icon: 'error',
        title: 'No se pudo completar',
        text: apiError.value,
        showConfirmButton: true,
      })
      return
    }

    asignados.value = asignados.value.filter((a) => a.id !== userId)
  }
</script>
