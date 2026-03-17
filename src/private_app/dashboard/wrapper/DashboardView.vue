<template>
  <!-- Page Header -->
  <div class="bg-gray-900">
    <div class="mx-auto px-4 py-3 sm:px-6 lg:px-8 flex items-center justify-between">
      <div>
        <h1 class="text-xl font-bold text-white tracking-tight">Dashboard</h1>
      </div>
      <button
        type="button"
        @click="fetchData"
        class="rounded-lg p-2 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
        title="Actualizar datos"
      >
        <ArrowPathIcon class="h-5 w-5" :class="{ 'animate-spin': isLoading }" />
      </button>
    </div>
  </div>

  <div class="mx-4 my-6 px-4 sm:px-6 lg:px-8">
    <LoadingSpinner v-if="isLoading" class="flex pt-16 justify-center items-center" />
    <div v-else class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <!-- Total Solicitudes -->
      <div class="overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-gray-200">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0 rounded-lg bg-[#1A4972]/10 p-3">
              <DocumentTextIcon class="h-6 w-6 text-[#1A4972]" aria-hidden="true" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Total Solicitudes</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.total }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Recibido -->
      <div class="overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-gray-200">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0 rounded-lg bg-blue-100 p-3">
              <InboxIcon class="h-6 w-6 text-blue-600" aria-hidden="true" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Recibido</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.recibido }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- En tramite -->
      <div class="overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-gray-200">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0 rounded-lg bg-amber-100 p-3">
              <ClockIcon class="h-6 w-6 text-[#FFA800]" aria-hidden="true" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">En trámite</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.enTramite }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Respuesta Generada -->
      <div class="overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-gray-200">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0 rounded-lg bg-green-100 p-3">
              <DocumentCheckIcon class="h-6 w-6 text-green-600" aria-hidden="true" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Respuesta Generada</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.respuestaGenerada }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Gráficos -->
    <div class="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
      <!-- Gráfico de barras: Por estado -->
      <div class="overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-gray-200 p-6">
        <h3 class="text-base font-semibold text-gray-900 mb-4">Solicitudes por estado</h3>
        <div v-if="stats.estadoBars.length" class="space-y-3">
          <div
            v-for="bar in stats.estadoBars"
            :key="bar.nombre"
            class="flex items-center gap-3"
          >
            <span class="w-40 text-sm text-gray-600 truncate" :title="bar.nombre">{{ bar.nombre }}</span>
            <div class="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
              <div
                class="h-full rounded-full bg-[#1A4972] transition-all duration-500"
                :style="{ width: `${stats.estadoBars.length ? Math.min(100, (bar.count / Math.max(...stats.estadoBars.map(b => b.count), 1)) * 100) : 0}%` }"
              />
            </div>
            <span class="w-8 text-sm font-semibold text-gray-900 text-right">{{ bar.count }}</span>
          </div>
        </div>
        <p v-else class="text-sm text-gray-500 py-4">No hay datos para mostrar</p>
      </div>

      <!-- Gráfico circular: Por origen -->
      <div class="overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-gray-200 p-6">
        <h3 class="text-base font-semibold text-gray-900 mb-4">Solicitudes por origen</h3>
        <div class="flex flex-col sm:flex-row items-center gap-6">
          <div class="relative w-36 h-36 flex-shrink-0">
            <svg viewBox="0 0 36 36" class="w-full h-full -rotate-90">
              <circle
                cx="18" cy="18" r="15.9"
                fill="none"
                stroke="#e5e7eb"
                stroke-width="3"
              />
              <circle
                cx="18" cy="18" r="15.9"
                fill="none"
                stroke="#3b82f6"
                stroke-width="3"
                :stroke-dasharray="`${stats.pctWeb} 100`"
                stroke-linecap="round"
                class="transition-all duration-700"
              />
              <circle
                cx="18" cy="18" r="15.9"
                fill="none"
                stroke="#1A4972"
                stroke-width="3"
                :stroke-dasharray="`${stats.pctOficina} 100`"
                :stroke-dashoffset="`-${stats.pctWeb}`"
                stroke-linecap="round"
                class="transition-all duration-700"
              />
            </svg>
          </div>
          <div class="flex-1 space-y-3">
            <div class="flex items-center gap-2">
              <span class="w-3 h-3 rounded-full bg-blue-500"></span>
              <span class="text-sm text-gray-600">Web</span>
              <span class="ml-auto text-sm font-semibold text-gray-900">{{ stats.origenWeb }} ({{ stats.pctWeb }}%)</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="w-3 h-3 rounded-full bg-[#1A4972]"></span>
              <span class="text-sm text-gray-600">Oficina</span>
              <span class="ml-auto text-sm font-semibold text-gray-900">{{ stats.origenOficina }} ({{ stats.pctOficina }}%)</span>
            </div>
          </div>
        </div>
        <p v-if="stats.totalOrigen === 0" class="text-sm text-gray-500 mt-4">No hay datos para mostrar</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { DocumentTextIcon, DocumentCheckIcon, InboxIcon, ClockIcon, ArrowPathIcon } from '@heroicons/vue/24/outline'
import { useSolicitudes } from '@/shared/composables/useSolicitudes'
import LoadingSpinner from '@/shared/components/common/LoadingSpinner.vue'

const { getSolicitudes, solicitudes } = useSolicitudes()
const isLoading = ref(false)

const ESTADOS_VALIDOS = [
  'Recibido',
  'Area Jurídica',
  'Area Técnica',
  'Area Administrativa',
  'Proyectando Respuesta',
  'Respuesta Generada'
]

const stats = computed(() => {
  const items = solicitudes.value.solicitudes ?? []
  const pag = solicitudes.value.pagination ?? {}

  const esRecibido = (s) => {
    const n = (s.estado?.nombre ?? '').toLowerCase()
    return n.includes('recibido') && !n.includes('respuesta generada')
  }
  const esRespuestaGenerada = (s) => {
    const n = (s.estado?.nombre ?? '').toLowerCase()
    return n.includes('respuesta generada')
  }
  const esEnTramite = (s) => {
    const n = (s.estado?.nombre ?? '').toLowerCase()
    return (
      n.includes('area') ||
      n.includes('jurídica') || n.includes('juridica') ||
      n.includes('técnica') || n.includes('tecnica') ||
      n.includes('administrativa') ||
      n.includes('proyectando') ||
      n.includes('revision') || n.includes('revisión') ||
      n.includes('pendiente')
    ) && !esRespuestaGenerada(s)
  }

  const recibido = items.filter(esRecibido).length
  const enTramite = items.filter(esEnTramite).length
  const respuestaGenerada = items.filter(esRespuestaGenerada).length

  const normalizar = (str) => (str ?? '').trim().toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '')

  // Por estado (gráfico de barras) - agrupar case-insensitive, mostrar todos
  const porEstado = {}
  items.forEach(s => {
    const raw = s.estado?.nombre ?? 'Sin estado'
    const key = normalizar(raw)
    const displayName = ESTADOS_VALIDOS.find(e => normalizar(e) === key) ?? raw
    porEstado[displayName] = (porEstado[displayName] ?? 0) + 1
  })
  const estadoBars = [
    ...ESTADOS_VALIDOS.filter(n => (porEstado[n] ?? 0) > 0).map(nombre => ({ nombre, count: porEstado[nombre] })),
    ...Object.entries(porEstado)
      .filter(([n]) => !ESTADOS_VALIDOS.includes(n))
      .map(([nombre, count]) => ({ nombre, count }))
  ]

  // Por origen (para gráfico circular)
  const web = items.filter(s => s.origen === 'web').length
  const oficina = items.filter(s => s.origen === 'oficina' || (s.origen && s.origen !== 'web')).length
  const totalOrigen = web + oficina

  return {
    total: pag.total_items ?? pag.total ?? 0,
    recibido,
    enTramite,
    respuestaGenerada,
    estadoBars,
    origenWeb: web,
    origenOficina: oficina,
    totalOrigen: totalOrigen || 1,
    pctWeb: totalOrigen ? Math.round((web / totalOrigen) * 100) : 0,
    pctOficina: totalOrigen ? Math.round((oficina / totalOrigen) * 100) : 0
  }
})

const fetchData = async () => {
  isLoading.value = true
  try {
    await getSolicitudes(1, 500)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => fetchData())
</script>