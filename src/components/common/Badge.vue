<template>
  <span :class="['inline-flex items-center gap-x-1.5 rounded-full px-2 py-1 text-xs font-medium', colorClass[color].background, colorClass[color].text]">
    <svg class="size-1.5" :class="colorClass[color].fill" viewBox="0 0 6 6" aria-hidden="true">
      <circle cx="3" cy="3" r="3" />
    </svg>
    <slot />
  </span>
</template>
<script setup>
  const { color } = defineProps(['color'])

  const colorClass = {
    gray: {
      background: 'bg-gray-100',
      text: 'text-gray-600',
      fill: 'fill-gray-400'
    },
    green: {
      background: 'bg-green-100',
      text: 'text-green-700',
      fill: 'fill-green-500'
    },
    red: {
      background: 'bg-red-100',
      text: 'text-red-700',
      fill: 'fill-red-500'
    },
    blue: {
      background: 'bg-blue-100',
      text: 'text-blue-700',
      fill: 'fill-blue-500'
    },
    yellow: {
      background: 'bg-yellow-100',
      text: 'text-yellow-800',
      fill: 'fill-yellow-500'
    },
    indigo: {
      background: 'bg-indigo-100',
      text: 'text-indigo-700',
      fill: 'fill-indigo-500'
    },
  }
</script>