<template >
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto flex items-center gap-x-1.5">
        <h1 class="text-2xl font-semibold text-gray-900">Turnos</h1>
        <button type="button" @click="fetchTurnos" class="inline-flex pt-1 items-center gap-x-1.5 rounded-md text-center text-sm font-semibold">
          <ArrowPathIcon class="size-6" :class="{ 'animate-spin': isLoading || isBackgroundLoading }"/>
          <span v-if="isBackgroundLoading" class="text-xs text-gray-500 ml-1">Cargando...</span>
        </button>
      </div>
      <div class="mt-4 sm:mt-0 sm:block md:flex justify-between md:w-md">
        <div class="flex flex-1 items-center justify-center mb-4 md:mb-0 md:mx-6 md:justify-end">
          <SearchInput 
            @input="handleLocalSearch"
            @search="handleApiSearch"
            placeholder="Buscar..."
          />
        </div>
        <button type="button" @click="navigateTo({ name: 'nuevo-turno' })" class="inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer">
          <PlusIcon class="-ml-0.5 size-5" aria-hidden="true" />
          Nuevo Turno
        </button>
      </div>
    </div>
    <div class="mt-8 flow-root">
      <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <LoadingSpinner v-if="isLoading" class="flex pt-32 justify-center items-center"/>
          <template v-else>
            <TurnosTable :expedientes="filteredExpedientes" />
            <Pagination :pagination="turnos.pagination" @page-change="changePage" />
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import TurnosTable from '@/components/turnos/components/TurnosTable.vue'
  import Pagination from '@/shared/components/Pagination.vue'
  import LoadingSpinner from '@/shared/components/LoadingSpinner.vue'
  import SearchInput from '@/shared/components/SearchInput.vue'
  import { PlusIcon, ArrowPathIcon } from '@heroicons/vue/20/solid'
  import { useTurnos } from '@/shared/composables/useTurnos'

  const router = useRouter()
  const isLoading = ref(false)
  const isBackgroundLoading = ref(false)
  const { getTurnos, turnos, apiError } = useTurnos()
  const searchTerm = ref('')
  const currentPage = ref(1)
  const postsPerPage = ref(10)

  const filteredExpedientes = computed(() => {
    const start = (currentPage.value - 1) * postsPerPage.value
    const end = start + postsPerPage.value
    if (!searchTerm.value) return turnos.value.expedientes.slice(start, end) || []

    const term = searchTerm.value.toLowerCase()
    const filtered = (turnos.value.expedientes || []).filter(expediente => {
      return (
        expediente.numturno.toString().includes(term) ||
        expediente.direccion.toLowerCase().includes(term) ||
        expediente.responsables[0].nombre.toLowerCase().includes(term)
      )
    })

    return filtered.slice(start, end)
  })

  const fetchTurnos = async (page = 1, search = '', limit = 10) => {
    isLoading.value = true
    try {
      await getTurnos(page, limit, search)
    } finally {
      isLoading.value = false
    }
  }

  const fetchAdditionalTurnos = async () => {
    if (isBackgroundLoading.value) return

    isBackgroundLoading.value = true
    try {
      const existingIds = new Set(turnos.value.expedientes.map(exp => exp.id))
      
      const currentTotal = turnos.value.expedientes.length
      const nextPage = Math.ceil(currentTotal / 10) + 1
      
      const response = await fetch(`${import.meta.env.VITE_BASE_API_URL}/expedientes?page=${nextPage}&per_page=100&offset=10`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      
      const data = await response.json()
      
      if (data.status !== 'error' && data.expedientes) {
        const newExpedientes = data.expedientes.filter(exp => !existingIds.has(exp.id))
        
        if (newExpedientes.length > 0) {
          turnos.value.expedientes = [...turnos.value.expedientes, ...newExpedientes]
        }
      }
      
    } catch (error) {
      console.error('Error cargando turnos adicionales:', error)
    } finally {
      isBackgroundLoading.value = false
    }
  }

  const handleLocalSearch = (value) => {
    searchTerm.value = value
  }

  const handleApiSearch = (value) => {
    searchTerm.value = value
    
    fetchTurnos(1, value)
  }

  const changePage = async (page) => {
    currentPage.value = page
    turnos.value.pagination.current_page = page
  }

  onMounted(async () => {
    // Carga inicial rápida (10 turnos)
    await fetchTurnos()
    
    // Carga adicional en segundo plano después de un pequeño delay
    setTimeout(() => {
      fetchAdditionalTurnos()
    }, 500) // 500ms de delay para no interferir con la carga inicial
  })

  const navigateTo = (route) => {
    router.push(route)
  }
</script>


