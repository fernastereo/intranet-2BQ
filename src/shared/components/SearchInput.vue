<template>
  <div class="grid w-full max-w-lg grid-cols-1 lg:max-w-xs">
    <input 
      type="search" 
      name="search" 
      v-model="searchQuery"
      @input="handleInput"
      @keyup.enter="handleSearch"
      class="col-start-1 row-start-1 block w-full rounded-md bg-white py-1.5 pr-3 pl-10 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" 
      :placeholder="placeholder" 
    />
    <MagnifyingGlassIcon class="pointer-events-none col-start-1 row-start-1 ml-3 size-5 self-center text-gray-400" aria-hidden="true" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { MagnifyingGlassIcon } from '@heroicons/vue/20/solid'

const props = defineProps({
  placeholder: {
    type: String,
    default: 'Buscar...'
  },
  debounceTime: {
    type: Number,
    default: 300
  }
})

const emit = defineEmits(['search', 'input'])

const searchQuery = ref('')
let debounceTimer = null

const handleInput = () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    emit('input', searchQuery.value)
  }, props.debounceTime)
}

const handleSearch = () => {
  emit('search', searchQuery.value)
}
</script> 