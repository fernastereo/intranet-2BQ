<template>
  <nav aria-label="Breadcrumb" class="mt-1">
    <ol class="flex items-center gap-x-1 text-sm">
      <li v-for="(item, index) in items" :key="index" class="flex items-center gap-x-1">
        <ChevronRightIcon
          v-if="index > 0"
          class="h-4 w-4 flex-shrink-0 text-gray-400"
          aria-hidden="true"
        />
        <RouterLink
          v-if="item.to && index < items.length - 1"
          :to="item.to"
          class="text-gray-400 hover:text-white transition-colors"
        >
          {{ item.label }}
        </RouterLink>
        <span v-else class="text-gray-300 font-medium">
          {{ item.label }}
        </span>
      </li>
    </ol>
  </nav>
</template>

<script setup>
import { ChevronRightIcon } from '@heroicons/vue/20/solid'

defineProps({
  items: {
    type: Array,
    required: true,
    validator: (value) => value.every(item => item.label)
  }
})
</script>
