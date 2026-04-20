<template>
  <table class="min-w-full divide-y divide-gray-300">
    <thead>
      <tr>
        <th scope="col" class="py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-0">Solicitud</th>
        <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Fecha / Hora</th>
        <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Origen</th>
        <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Categoría</th>
        <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Titular</th>
        <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Teléfono</th>
        <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Email</th>
        <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Estado</th>
        <th scope="col" class="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
          <span class="sr-only">Indicadores</span>
        </th>
        <th scope="col" class="relative py-3.5 pr-4 pl-3 sm:pr-0">
          <span class="sr-only">Acciones</span>
        </th>
      </tr>
    </thead>
    <tbody class="divide-y divide-gray-200">
      <tr v-for="solicitud in solicitudes" :key="solicitud.id" class="hover:bg-gray-50">

        <!-- Solicitud: vigencia + numerosolicitud -->
        <td class="py-3 pr-3 pl-4 text-sm font-semibold whitespace-nowrap text-gray-900 sm:pl-0">
          {{ solicitud.numerosolicitud.toString().padStart(4, '0') }}-{{ solicitud.vigencia }}
        </td>

        <!-- Fecha / Hora -->
        <td class="px-3 py-3 text-sm whitespace-nowrap text-gray-700">
          <div>{{ solicitud.fecha }}</div>
          <div class="text-xs text-gray-400">{{ solicitud.hora }}</div>
        </td>

        <!-- Origen -->
        <td class="px-3 py-3 text-sm whitespace-nowrap">
          <span class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium"
            :class="solicitud.origen === 'web' ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-600'">
            <GlobeAltIcon v-if="solicitud.origen === 'web'" class="size-3" />
            <BuildingOfficeIcon v-else class="size-3" />
            {{ solicitud.origen }}
          </span>
        </td>

        <!-- Subcategoría -->
        <td class="px-3 py-3 text-sm text-gray-700 max-w-[180px]">
          <div class="truncate" :title="solicitud.subcategoria?.nombre">
            {{ solicitud.subcategoria?.nombre ?? '—' }}
          </div>
          <div class="text-xs text-gray-400 truncate" :title="solicitud.categoria?.nombre">
            {{ solicitud.categoria?.nombre ?? '' }}
          </div>
        </td>

        <!-- Titular -->
        <td class="px-3 py-3 text-sm whitespace-nowrap text-gray-700 uppercase">
          {{ titular(solicitud.responsables) }}
        </td>

        <!-- Teléfono -->
        <td class="px-3 py-3 text-sm whitespace-nowrap text-gray-700">
          {{ solicitud.telefono || '—' }}
        </td>

        <!-- Email -->
        <td class="px-3 py-3 text-sm whitespace-nowrap text-gray-700 max-w-[160px]">
          <span class="truncate block" :title="solicitud.email">{{ solicitud.email || '—' }}</span>
        </td>

        <!-- Estado -->
        <td class="px-3 py-3 text-sm whitespace-nowrap">
          <Badge :color="solicitud.estado?.class">{{ solicitud.estado?.nombre }}</Badge>
        </td>

        <!-- Indicadores: adjuntos / comentarios/ historial / respuesta -->
        <td class="px-3 py-3 text-sm whitespace-nowrap">
          <div class="flex items-center gap-2">
            <span :class="solicitud.adjuntos?.length ? 'text-[#1A4972]' : 'text-gray-300'"
              :title="solicitud.adjuntos?.length ? `${solicitud.adjuntos.length} adjunto(s)` : 'Sin adjuntos'">
              <PaperClipIcon class="size-4" />
            </span>
            <span :class="solicitud.comentarios?.length ? 'text-orange-400' : 'text-gray-300'"
              :title="solicitud.comentarios?.length ? `${solicitud.comentarios.length} comentario(s)` : 'Sin comentarios'">
              <ChatBubbleBottomCenterTextIcon class="size-4" />
            </span>
            <span :class="solicitud.historial_estados?.length > 1 ? 'text-amber-500' : 'text-gray-300'"
              :title="solicitud.historial_estados?.length > 1 ? `${solicitud.historial_estados.length} estados` : 'Sin historial'">
              <ClockIcon class="size-4" />
            </span>
            <span :class="solicitud.respuesta ? 'text-green-500' : 'text-gray-300'"
              :title="solicitud.respuesta ? 'Tiene respuesta' : 'Sin respuesta'">
              <CheckCircleIcon class="size-4" />
            </span>
          </div>
        </td>

        <!-- Acción editar -->
        <td class="relative py-3 pr-4 pl-3 text-right text-sm font-medium whitespace-nowrap sm:pr-0">
          <RouterLink
            :to="{ name: 'editar-ventanilla', params: { id: solicitud.id } }"
            class="text-[#1A4972] hover:text-[#14485c]"
          >
            <PencilSquareIcon class="size-5" />
            <span class="sr-only">Editar {{ solicitud.numerosolicitud }}</span>
          </RouterLink>
        </td>

      </tr>

      <!-- Estado vacío -->
      <tr v-if="!solicitudes.length">
        <td colspan="10" class="py-12 text-center text-sm text-gray-400">
          No se encontraron solicitudes.
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import {
  PencilSquareIcon,
  PaperClipIcon,
  CheckCircleIcon,
  ClockIcon,
  GlobeAltIcon,
  BuildingOfficeIcon,
  ChatBubbleBottomCenterTextIcon,
} from '@heroicons/vue/20/solid'
import Badge from '@/shared/components/common/Badge.vue'

defineProps({
  solicitudes: {
    type: Array,
    required: true,
  },
})

const titular = (responsables = []) => {
  const t = responsables.find(r => r.tiporesponsable_id === 1)
  return t?.nombre ?? responsables[0]?.nombre ?? '—'
}
</script>
