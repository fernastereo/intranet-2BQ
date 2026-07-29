<template>
  <Popover class="relative">
    <PopoverButton
      class="flex w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-left text-sm transition-all focus:border-transparent focus:ring-2 focus:ring-[#1A4972] focus:outline-none"
    >
      <span class="truncate" :class="selectedLabel ? 'text-gray-900' : 'text-gray-400'">
        {{ selectedLabel || placeholder }}
      </span>
      <ChevronDownIcon class="ml-2 size-4 shrink-0 text-gray-400" />
    </PopoverButton>

    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <PopoverPanel class="absolute z-10 mt-1 w-full min-w-max rounded-lg border border-gray-200 bg-white shadow-lg">
        <div class="max-h-64 overflow-auto p-2">
          <label
            v-for="opt in options"
            :key="opt.id"
            class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
          >
            <input
              type="checkbox"
              :value="opt.id"
              v-model="modelValue"
              class="rounded border-gray-300 text-[#1A4972] focus:ring-[#1A4972]"
            />
            {{ opt.nombre }}
          </label>
          <p v-if="!options.length" class="px-2 py-1.5 text-xs text-gray-400">Sin opciones disponibles</p>
        </div>
        <div v-if="modelValue.length" class="border-t border-gray-100 p-2">
          <button type="button" @click="modelValue = []" class="text-xs font-medium text-red-600 hover:text-red-800">
            Limpiar selección
          </button>
        </div>
      </PopoverPanel>
    </transition>
  </Popover>
</template>

<script setup>
import { computed } from 'vue'
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'
import { ChevronDownIcon } from '@heroicons/vue/20/solid'

const props = defineProps({
  options: { type: Array, default: () => [] }, // [{ id, nombre }]
  placeholder: { type: String, default: 'Seleccionar...' },
})

const modelValue = defineModel({ type: Array, default: () => [] })

const selectedLabel = computed(() => {
  if (!modelValue.value.length) return ''
  if (modelValue.value.length === 1) {
    return props.options.find(o => o.id === modelValue.value[0])?.nombre ?? ''
  }
  return `${modelValue.value.length} seleccionados`
})
</script>
