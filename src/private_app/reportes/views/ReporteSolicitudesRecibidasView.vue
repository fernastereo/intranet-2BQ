<template>
  <PageHeader :isLoading="loading" @refresh="buscar" />

  <div class="mx-4 my-4 flex flex-col gap-6 px-4 sm:px-6 lg:px-8">
    <div class="sm:flex sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">Solicitudes Recibidas</h1>
        <p class="mt-1 text-sm text-gray-500">Consulte las solicitudes ingresadas por ventanilla dentro de un rango de fechas.</p>
      </div>
    </div>

    <FiltrosReporteSolicitudes v-model="filtros" @buscar="buscar" @limpiar="limpiarFiltros" />

    <div class="rounded-lg border border-gray-200 bg-white shadow-sm">
      <div class="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-6 py-4">
        <p class="text-sm text-gray-600">
          <span class="font-semibold text-gray-900">{{ reporte.pagination.total_items ?? 0 }}</span>
          solicitud(es) encontrada(s)
        </p>
        <div class="flex gap-2">
          <button
            type="button"
            :disabled="exportLoading || !reporte.solicitudes.length"
            @click="exportar('excel')"
            class="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ArrowDownTrayIcon class="size-4" />
            Excel
          </button>
          <button
            type="button"
            :disabled="exportLoading || !reporte.solicitudes.length"
            @click="exportar('pdf')"
            class="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ArrowDownTrayIcon class="size-4" />
            PDF
          </button>
        </div>
      </div>

      <div class="px-2 pb-2 sm:px-4">
        <div class="overflow-x-auto">
          <div class="inline-block min-w-full py-2 align-middle">
            <LoadingSpinner v-if="loading" class="flex items-center justify-center pt-16 pb-16" />
            <p v-else-if="apiError" class="py-12 text-center text-sm text-red-500">{{ apiError }}</p>
            <template v-else>
              <ReporteSolicitudesTable :solicitudes="reporte.solicitudes" />
              <Pagination :pagination="reporte.pagination" @page-change="changePage" />
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Swal from 'sweetalert2'
import { ArrowDownTrayIcon } from '@heroicons/vue/24/outline'
import { useReportes } from '@/shared/composables/useReportes'
import PageHeader from '@/shared/components/common/PageHeader.vue'
import LoadingSpinner from '@/shared/components/common/LoadingSpinner.vue'
import Pagination from '@/shared/components/common/Pagination.vue'
import FiltrosReporteSolicitudes from '@/private_app/reportes/components/FiltrosReporteSolicitudes.vue'
import ReporteSolicitudesTable from '@/private_app/reportes/components/ReporteSolicitudesTable.vue'

const PAGE_SIZE = 10

const { reporte, loading, exportLoading, apiError, getReporteSolicitudesRecibidas, exportarReporteSolicitudesRecibidas } = useReportes()

const filtrosIniciales = () => ({
  fecha_desde: '',
  fecha_hasta: '',
  estado: [],
  asignado: [],
  categoria: '',
  subcategoria: '',
  numero: '',
  solicitante: '',
  direccion: '',
  identificacion: '',
})

const filtros = ref(filtrosIniciales())

const fetchData = async (page = 1) => {
  await getReporteSolicitudesRecibidas(filtros.value, page, PAGE_SIZE)
}

const buscar = () => fetchData(1)

const limpiarFiltros = () => {
  filtros.value = filtrosIniciales()
  reporte.value = {
    solicitudes: [],
    resumen: {},
    pagination: { current_page: 1, total_pages: 1, total_items: 0, item_init: 0, item_end: 0 },
  }
}

const changePage = (page) => fetchData(page)

const exportar = async (formato) => {
  const ok = await exportarReporteSolicitudesRecibidas(filtros.value, formato)
  if (!ok) {
    await Swal.fire({
      icon: 'error',
      title: 'No se pudo exportar el reporte',
      text: apiError.value,
      showConfirmButton: true,
    })
  }
}

onMounted(() => fetchData())
</script>
