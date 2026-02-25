<template>
  <div class="flex items-center justify-between border-t border-gray-200 bg-white py-3">
    <div class="flex flex-1 justify-between sm:hidden">
      <a 
        href="#" 
        @click.prevent="onPageChange(pagination.current_page - 1)"
        :class="[
          'relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium',
          pagination.current_page <= 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'
        ]"
        :aria-disabled="pagination.current_page <= 1"
      >
        Previous
      </a>
      <a 
        href="#" 
        @click.prevent="onPageChange(pagination.current_page + 1)"
        :class="[
          'relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium',
          pagination.current_page >= pagination.total_pages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'
        ]"
        :aria-disabled="pagination.current_page >= pagination.total_pages"
      >
        Next
      </a>
    </div>
    <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
      <div>
        <p class="text-sm text-gray-700">
          Mostrando
          {{ ' ' }}
          <span class="font-medium">{{ pagination.item_init }}</span>
          {{ ' ' }}
          a
          {{ ' ' }}
          <span class="font-medium">{{ pagination.item_end}}</span>
          {{ ' ' }}
          de
          {{ ' ' }}
          <span class="font-medium">{{ pagination.total_items }}</span>
          {{ ' ' }}
          resultados
        </p>
      </div>
      <div>
        <nav class="isolate inline-flex -space-x-px rounded-md shadow-xs" aria-label="Pagination">
          <!-- Botón Anterior -->
          <a 
            href="#" 
            @click.prevent="onPageChange(pagination.current_page - 1)"
            :class="[
              'relative inline-flex items-center rounded-l-md px-2 py-2 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0',
              pagination.current_page <= 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-400'
            ]"
            :aria-disabled="pagination.current_page <= 1"
          >
            <span class="sr-only">Previous</span>
            <ChevronLeftIcon class="size-5" aria-hidden="true" />
          </a>
          
          <!-- Generación dinámica de páginas -->
          <template v-for="(page, index) in paginationItems" :key="index">
            <!-- Número de página -->
            <a 
              v-if="typeof page === 'number'" 
              href="#" 
              @click.prevent="onPageChange(page)"
              :aria-current="page === pagination.current_page ? 'page' : undefined"
              :class="[
                'relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-gray-300 ring-inset focus:z-20 focus:outline-offset-0',
                page === pagination.current_page 
                  ? 'z-10 bg-indigo-600 text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600' 
                  : 'text-gray-900 hover:bg-gray-50'
              ]"
            >
              {{ page }}
            </a>
            
            <!-- Elipsis (...) -->
            <span 
              v-else 
              class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-gray-300 ring-inset focus:outline-offset-0"
            >
              ...
            </span>
          </template>
          
          <!-- Botón Siguiente -->
          <a 
            href="#" 
            @click.prevent="onPageChange(pagination.current_page + 1)"
            :class="[
              'relative inline-flex items-center rounded-r-md px-2 py-2 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0',
              pagination.current_page >= pagination.total_pages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-400'
            ]"
            :aria-disabled="pagination.current_page >= pagination.total_pages"
          >
            <span class="sr-only">Next</span>
            <ChevronRightIcon class="size-5" aria-hidden="true" />
          </a>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { computed } from 'vue';
  import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/20/solid'

  const { pagination } = defineProps(['pagination'])
  const emit = defineEmits(['page-change']);
    
  // Función para cambiar de página
  const onPageChange = (page) => {
    // No hacer nada si se intenta ir más allá de los límites
    if (page < 1 || page > pagination.total_pages) {
      return;
    }
    
    emit('page-change', page);
  };

  // Cálculo de los elementos de paginación a mostrar
  const paginationItems = computed(() => {
    const currentPage = pagination.current_page;
    const totalPages = pagination.total_pages;
    
    // Si hay menos de 8 páginas, mostrar todas
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    // Algoritmo para mostrar páginas con elipsis
    const items = [];
    
    // Siempre mostrar la primera página
    items.push(1);
    
    // Lógica para páginas en medio y elipsis
    if (currentPage <= 3) {
      // Cerca del inicio: 1 2 3 4 5 ... {último}
      items.push(2, 3, 4, 5, '...', totalPages);
    } else if (currentPage >= totalPages - 2) {
      // Cerca del final: 1 ... {totalPages-4} {totalPages-3} {totalPages-2} {totalPages-1} {totalPages}
      items.push('...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      // En medio: 1 ... {currentPage-1} {currentPage} {currentPage+1} ... {totalPages}
      items.push('...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
    }
    
    return items;
  });
</script>