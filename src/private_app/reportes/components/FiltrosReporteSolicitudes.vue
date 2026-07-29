<template>
  <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
    <div class="flex items-center justify-between">
      <h2 class="text-sm font-bold tracking-wide text-gray-500 uppercase">Filtros</h2>
      <button
        type="button"
        @click="toggleExpanded"
        class="text-xs font-medium text-[#1A4972] hover:underline"
      >
        {{ expanded ? 'Ocultar' : 'Mostrar' }}
      </button>
    </div>

    <div v-show="expanded" class="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
      <!-- Rango de fechas -->
      <div>
        <label for="fecha_desde" class="mb-1.5 block text-sm font-medium text-gray-700">Fecha desde</label>
        <input
          id="fecha_desde"
          v-model="filtros.fecha_desde"
          type="date"
          class="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm transition-all focus:border-transparent focus:ring-2 focus:ring-[#1A4972]"
        />
      </div>
      <div>
        <label for="fecha_hasta" class="mb-1.5 block text-sm font-medium text-gray-700">Fecha hasta</label>
        <input
          id="fecha_hasta"
          v-model="filtros.fecha_hasta"
          type="date"
          class="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm transition-all focus:border-transparent focus:ring-2 focus:ring-[#1A4972]"
        />
      </div>

      <!-- Estado -->
      <div>
        <label class="mb-1.5 block text-sm font-medium text-gray-700">Estado</label>
        <MultiSelectDropdown v-model="filtros.estado" :options="opcionesEstado" placeholder="Todos los estados" />
      </div>

      <!-- Asignado -->
      <div>
        <label class="mb-1.5 block text-sm font-medium text-gray-700">Asignado</label>
        <MultiSelectDropdown
          v-model="filtros.asignado"
          :options="usuarios"
          :placeholder="loadingUsuarios ? 'Cargando...' : 'Todos los funcionarios'"
        />
      </div>

      <!-- Categoría -->
      <div>
        <label for="categoria" class="mb-1.5 block text-sm font-medium text-gray-700">Categoría</label>
        <select
          id="categoria"
          v-model="filtros.categoria"
          @change="filtros.subcategoria = ''"
          class="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm transition-all focus:border-transparent focus:ring-2 focus:ring-[#1A4972]"
        >
          <option value="">Todas las categorías</option>
          <option v-for="cat in categoriasDocumentos" :key="cat.id" :value="cat.id">{{ cat.nombre }}</option>
        </select>
      </div>

      <!-- Subcategoría -->
      <div>
        <label for="subcategoria" class="mb-1.5 block text-sm font-medium text-gray-700">Subcategoría</label>
        <select
          id="subcategoria"
          v-model="filtros.subcategoria"
          :disabled="!filtros.categoria"
          class="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm transition-all focus:border-transparent focus:ring-2 focus:ring-[#1A4972] disabled:cursor-not-allowed disabled:bg-gray-100"
        >
          <option value="">{{ filtros.categoria ? 'Todas las subcategorías' : 'Seleccione primero una categoría' }}</option>
          <option v-for="sub in subcategorias" :key="sub.id" :value="sub.id">{{ sub.nombre }}</option>
        </select>
      </div>

      <!-- Número de solicitud -->
      <div>
        <label for="numero" class="mb-1.5 block text-sm font-medium text-gray-700">Número de solicitud</label>
        <input
          id="numero"
          v-model="filtros.numero"
          type="text"
          placeholder="0001-2026"
          class="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm transition-all focus:border-transparent focus:ring-2 focus:ring-[#1A4972]"
        />
      </div>

      <!-- Identificación del solicitante -->
      <div>
        <label for="identificacion" class="mb-1.5 block text-sm font-medium text-gray-700">Identificación del solicitante</label>
        <input
          id="identificacion"
          v-model="filtros.identificacion"
          type="text"
          placeholder="Número de identificación"
          class="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm transition-all focus:border-transparent focus:ring-2 focus:ring-[#1A4972]"
        />
      </div>

      <!-- Solicitante -->
      <div class="md:col-span-2">
        <label for="solicitante" class="mb-1.5 block text-sm font-medium text-gray-700">Solicitante</label>
        <input
          id="solicitante"
          v-model="filtros.solicitante"
          type="text"
          placeholder="Nombre o razón social"
          class="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm transition-all focus:border-transparent focus:ring-2 focus:ring-[#1A4972]"
        />
      </div>

      <!-- Dirección -->
      <div class="md:col-span-2">
        <label for="direccion" class="mb-1.5 block text-sm font-medium text-gray-700">Dirección</label>
        <input
          id="direccion"
          v-model="filtros.direccion"
          type="text"
          placeholder="Calle, número"
          class="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm transition-all focus:border-transparent focus:ring-2 focus:ring-[#1A4972]"
        />
      </div>
    </div>

    <div v-show="expanded" class="mt-6 flex flex-wrap justify-end gap-3">
      <button
        type="button"
        @click="limpiar"
        class="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
      >
        Limpiar filtros
      </button>
      <button
        type="button"
        @click="emit('buscar')"
        class="inline-flex items-center gap-2 rounded-lg bg-[#1A4972] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#14485c]"
      >
        <MagnifyingGlassIcon class="size-4" />
        Buscar
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { MagnifyingGlassIcon } from '@heroicons/vue/20/solid'
import MultiSelectDropdown from '@/shared/components/common/MultiSelectDropdown.vue'
import { useCategoriaDocumentos } from '@/shared/composables/useCategoriaDocumentos'
import { useSolicitudes } from '@/shared/composables/useSolicitudes'
import { ESTADOS_LABEL } from '@/shared/types'

const filtros = defineModel({ required: true })
const emit = defineEmits(['buscar', 'limpiar'])

const expanded = ref(true)
const toggleExpanded = () => { expanded.value = !expanded.value }

const { categoriasDocumentos, getCategoriaDocumentos, getSubCategoriasDocumentos } = useCategoriaDocumentos()
const { getUsuarios } = useSolicitudes()

const opcionesEstado = Object.entries(ESTADOS_LABEL).map(([id, nombre]) => ({ id, nombre }))

const subcategorias = computed(() => {
  if (!filtros.value.categoria) return []
  return getSubCategoriasDocumentos(filtros.value.categoria) || []
})

const usuarios = ref([])
const loadingUsuarios = ref(false)

const limpiar = () => {
  emit('limpiar')
}

onMounted(async () => {
  getCategoriaDocumentos('oficina')

  loadingUsuarios.value = true
  const data = await getUsuarios()
  usuarios.value = data.map(u => ({ id: u.id, nombre: u.name }))
  loadingUsuarios.value = false
})
</script>
