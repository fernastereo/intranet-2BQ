<template>
  <div>
    <p class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">{{ label }}</p>
    <p class="text-sm text-gray-900 font-medium">{{ value || '-' }}</p>
  </div>
</template>

<script setup lang="ts">
  defineProps<{
    label: string
    value?: string
  }>()
</script>
