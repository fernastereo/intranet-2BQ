<template>
  <PageHeader :isLoading="isLoading" @refresh="fetchData" />

  <div class="mx-4 my-4 px-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="sm:flex sm:items-center sm:justify-end">
      <div class="mt-4 sm:mt-0 sm:block md:flex justify-between md:w-md">
        <div class="flex flex-1 items-center justify-center mb-4 md:mb-0 md:mx-6 md:justify-end">
          <SearchInput
            @input="handleLocalSearch"
            @search="handleApiSearch"
            placeholder="Buscar solicitud..."
          />
        </div>
        <button
          type="button"
          @click="router.push({ name: 'nuevo-ventanilla' })"
          class="inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer"
        >
          <PlusIcon class="-ml-0.5 size-5" aria-hidden="true" />
          Nueva Solicitud
        </button>
      </div>
    </div>

    <!-- Tabla -->
    <div class="mt-8 flow-root">
      <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <LoadingSpinner v-if="isLoading" class="flex pt-32 justify-center items-center" />
          <template v-else>
            <SolicitudesTable :solicitudes="filteredSolicitudes" />
            <Pagination :pagination="solicitudes.pagination" @page-change="changePage" />
          </template>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { PlusIcon } from '@heroicons/vue/20/solid'
import { useSolicitudes } from '@/shared/composables/useSolicitudes'
import SolicitudesTable from '@/private_app/ventanilla/components/SolicitudesTable.vue'
import Pagination from '@/shared/components/common/Pagination.vue'
import LoadingSpinner from '@/shared/components/common/LoadingSpinner.vue'
import SearchInput from '@/shared/components/common/SearchInput.vue'
import PageHeader from '@/shared/components/common/PageHeader.vue'

const router = useRouter()
const { getSolicitudes, solicitudes } = useSolicitudes()

const isLoading = ref(false)
const searchTerm = ref('')
const currentPage = ref(1)
const PAGE_SIZE = 10

const apiSearchTerm = ref('')

const filteredSolicitudes = computed(() => {
  const items = solicitudes.value.solicitudes ?? []
  if (!searchTerm.value || apiSearchTerm.value === searchTerm.value) return items

  const term = searchTerm.value.toLowerCase()
  return items.filter(s =>
    s.numerosolicitud?.toString().includes(term) ||
    s.subcategoria?.nombre?.toLowerCase().includes(term) ||
    s.responsables?.some(r => r.nombre?.toLowerCase().includes(term)) ||
    s.email?.toLowerCase().includes(term) ||
    s.telefono?.includes(term)
  )
})

const fetchData = async (page = 1) => {
  isLoading.value = true
  try {
    await getSolicitudes(page, PAGE_SIZE, apiSearchTerm.value)
    currentPage.value = page
  } finally {
    isLoading.value = false
  }
}

const handleLocalSearch = (value) => {
  searchTerm.value = value
  if (!value) {
    apiSearchTerm.value = ''
    fetchData(1)
  }
}

const handleApiSearch = (value) => {
  searchTerm.value = value
  apiSearchTerm.value = value
  fetchData(1)
}

const changePage = (page) => {
  fetchData(page)
}

onMounted(() => fetchData())
</script>
