<template>
  <table class="min-w-full divide-y divide-gray-300">
    <thead>
      <tr>
        <th scope="col" class="py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-0">Fecha</th>
        <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Turno</th>
        <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Estado</th>
        <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Responsable</th>
        <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Teléfono</th>
        <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Dirección</th>
        <th scope="col" class="relative py-3.5 pr-4 pl-3 sm:pr-0">
          <span class="sr-only">Edit</span>
        </th>
      </tr>
    </thead>
    <tbody class="divide-y divide-gray-200">
      <tr v-for="expediente in expedientes" :key="expediente.id">
        <td class="px-3 py-3 text-sm whitespace-nowrap text-gray-700 sm:pl-0">
          {{ `${expediente.fecha} - ${expediente.hora}` }}
        </td>
        <td class="px-3 py-3 text-sm font-medium whitespace-nowrap text-gray-900">
          {{ `${expediente.numturno.toString().padStart(4, '0')}-${expediente.vigencia}` }}
        </td>
        <td class="px-3 py-3 text-sm whitespace-nowrap text-gray-500">
          <Badge :color="expediente.estado.class">{{ expediente.estado.nombre }}</Badge>
        </td>
        <td class="px-3 py-3 text-sm whitespace-nowrap text-gray-700">
          <div v-for="responsable in expediente.responsables" :key="responsable.id" class="flex items-center gap-2">
            <span class="text-xs font-semibold">{{ responsable.tiporesponsable.nombre }}:</span>
            <span class="text-sm text-gray-700">{{ responsable.nombre }}</span>            
          </div>
        </td>
        <td class="px-3 py-3 text-sm whitespace-nowrap text-gray-700">
          <div v-for="responsable in expediente.responsables" :key="responsable.id" class="flex items-center gap-2">
            <span class="text-sm text-gray-700">{{ responsable.telefono }}</span>
          </div>
        </td>
        <td class="px-3 py-3 text-sm whitespace-nowrap text-gray-700">
          {{ expediente.direccion }}
        </td>
        <td class="relative py-3 pr-4 pl-3 text-right text-sm font-medium whitespace-nowrap sm:pr-0">
          <RouterLink 
            :to="{ name: 'editar-turno', params: { id: expediente.id } }" 
            class="text-indigo-600 hover:text-indigo-900"
          >
            <PencilSquareIcon class="size-5" />
            <span class="sr-only">, {{ expediente.numturno }}</span>
          </RouterLink>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { PencilSquareIcon } from '@heroicons/vue/20/solid'
import Badge from '@/shared/components/Badge.vue'

defineProps({
  expedientes: {
    type: Array,
    required: true
  }
})
</script> 