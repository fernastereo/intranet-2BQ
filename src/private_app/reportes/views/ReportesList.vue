<template>
  <PageHeader :isLoading="false" />

  <div class="mx-4 my-4 px-4 sm:px-6 lg:px-8">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-2xl font-semibold text-gray-900">Reportes</h1>
        <p class="mt-1 text-sm text-gray-500">Seleccione un informe para consultarlo con filtros y exportarlo.</p>
      </div>
    </div>

    <div class="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <RouterLink
        v-for="informe in informesDisponibles"
        :key="informe.name"
        :to="informe.to"
        class="group flex flex-col rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-colors hover:border-[#1A4972]/40 hover:shadow-md"
      >
        <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1A4972]/10">
          <component :is="informe.icon" class="h-6 w-6 text-[#1A4972]" />
        </div>
        <h2 class="mt-4 text-base font-semibold text-gray-900">{{ informe.titulo }}</h2>
        <p class="mt-1 text-sm text-gray-500">{{ informe.descripcion }}</p>
        <span class="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[#1A4972] group-hover:underline">
          Ver informe
          <ArrowRightIcon class="size-4" />
        </span>
      </RouterLink>

      <div class="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50/50 p-6 text-center">
        <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
          <PlusIcon class="h-6 w-6 text-gray-400" />
        </div>
        <p class="mt-4 text-sm font-medium text-gray-500">Más informes próximamente</p>
        <span class="mt-3 inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
          <span class="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500"></span>
          En desarrollo
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { PlusIcon, ArrowRightIcon, DocumentChartBarIcon } from '@heroicons/vue/24/outline'
import PageHeader from '@/shared/components/common/PageHeader.vue'

const informesDisponibles = [
  {
    name: 'solicitudes-recibidas',
    titulo: 'Solicitudes Recibidas',
    descripcion: 'Solicitudes ingresadas por ventanilla, filtrables por fecha, estado, categoría y asignado.',
    icon: DocumentChartBarIcon,
    to: { name: 'reporte-solicitudes-recibidas' },
  },
]
</script>
