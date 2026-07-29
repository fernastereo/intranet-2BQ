<template>
  <table class="min-w-full divide-y divide-gray-300">
    <thead>
      <tr>
        <th scope="col" class="py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-0">Solicitud</th>
        <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Fecha / Hora</th>
        <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Categoría</th>
        <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Solicitante</th>
        <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Identificación</th>
        <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Dirección</th>
        <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Estado</th>
        <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Asignados</th>
        <th scope="col" class="relative py-3.5 pr-4 pl-3 sm:pr-0">
          <span class="sr-only">Ver</span>
        </th>
      </tr>
    </thead>
    <tbody class="divide-y divide-gray-200">
      <tr v-for="solicitud in solicitudes" :key="solicitud.id" class="hover:bg-gray-50">

        <!-- Solicitud: vigencia + numerosolicitud -->
        <td class="py-3 pr-3 pl-4 text-sm font-semibold whitespace-nowrap text-gray-900 sm:pl-0">
          {{ solicitud.numerosolicitud?.toString().padStart(4, '0') }}-{{ solicitud.vigencia }}
        </td>

        <!-- Fecha / Hora -->
        <td class="px-3 py-3 text-sm whitespace-nowrap text-gray-700">
          <div>{{ solicitud.fecha }}</div>
          <div class="text-xs text-gray-400">{{ solicitud.hora }}</div>
        </td>

        <!-- Categoría / Subcategoría -->
        <td class="px-3 py-3 text-sm text-gray-700 max-w-[180px]">
          <div class="truncate" :title="solicitud.subcategoria?.nombre">{{ solicitud.subcategoria?.nombre ?? '—' }}</div>
          <div class="truncate text-xs text-gray-400" :title="solicitud.categoria?.nombre">{{ solicitud.categoria?.nombre ?? '' }}</div>
        </td>

        <!-- Solicitante -->
        <td class="px-3 py-3 text-sm whitespace-nowrap text-gray-700 uppercase">
          {{ titular(solicitud.responsables)?.nombre ?? '—' }}
        </td>

        <!-- Identificación -->
        <td class="px-3 py-3 text-sm whitespace-nowrap text-gray-700">
          {{ titular(solicitud.responsables)?.identificacion ?? '—' }}
        </td>

        <!-- Dirección -->
        <td class="px-3 py-3 text-sm text-gray-700 max-w-[180px]">
          <span class="block truncate" :title="titular(solicitud.responsables)?.direccion">
            {{ titular(solicitud.responsables)?.direccion ?? '—' }}
          </span>
        </td>

        <!-- Estado -->
        <td class="px-3 py-3 text-sm whitespace-nowrap">
          <Badge :color="solicitud.estado?.class">{{ solicitud.estado?.nombre }}</Badge>
        </td>

        <!-- Asignados -->
        <td class="px-3 py-3 text-sm text-gray-700 max-w-[160px]">
          <span v-if="solicitud.asignados?.length" class="truncate block" :title="solicitud.asignados.map(a => a.name).join(', ')">
            {{ solicitud.asignados.map(a => a.name).join(', ') }}
          </span>
          <span v-else class="text-gray-300">—</span>
        </td>

        <!-- Acción ver detalle -->
        <td class="relative py-3 pr-4 pl-3 text-right text-sm font-medium whitespace-nowrap sm:pr-0">
          <RouterLink
            :to="{ name: 'editar-ventanilla', params: { id: solicitud.id } }"
            class="text-[#1A4972] hover:text-[#14485c]"
          >
            <EyeIcon class="size-5" />
            <span class="sr-only">Ver {{ solicitud.numerosolicitud }}</span>
          </RouterLink>
        </td>

      </tr>

      <!-- Estado vacío -->
      <tr v-if="!solicitudes.length">
        <td colspan="9" class="py-12 text-center text-sm text-gray-400">
          No se encontraron solicitudes para los filtros seleccionados.
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { EyeIcon } from '@heroicons/vue/20/solid'
import Badge from '@/shared/components/common/Badge.vue'

defineProps({
  solicitudes: {
    type: Array,
    required: true,
  },
})

const titular = (responsables = []) => {
  return responsables.find(r => r.tiporesponsable_id === 1) ?? responsables[0] ?? null
}
</script>
