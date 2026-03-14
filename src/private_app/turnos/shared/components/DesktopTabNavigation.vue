<template>
  <div class="hidden sm:block">
    <div class="border-b border-gray-200">
      <nav class="-mb-px flex space-x-8" aria-label="Tabs">
        <a 
          v-for="tab in tabs" 
          :key="tab.name" 
          href="#" 
          @click.prevent="$emit('update:modelValue', tab.name)"
          :class="[
            modelValue === tab.name 
              ? 'border-indigo-500 text-indigo-600' 
              : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700', 
            'group inline-flex items-center border-b-2 px-1 py-4 text-sm font-medium'
          ]" 
          :aria-current="modelValue === tab.name ? 'page' : undefined"
        >
          <component 
            :is="tab.icon" 
            :class="[
              modelValue === tab.name 
                ? 'text-indigo-500' 
                : 'text-gray-400 group-hover:text-gray-500', 
              'mr-2 -ml-0.5 size-5'
            ]" 
            aria-hidden="true" 
          />
          <span>{{ tab.name }}</span>
        </a>
      </nav>
    </div>
  </div>
</template>

<script setup>
  defineProps({
    tabs: {
      type: Array,
      required: true
    },
    modelValue: {
      type: String,
      required: true
    }
  })

  defineEmits(['update:modelValue'])
</script> 