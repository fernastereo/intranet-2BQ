<template>
  <div class="mt-6 flex justify-end gap-x-3">
    <button
      type="button"
      @click="$emit('cancel')"
      class="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 cursor-pointer"
    >
      Cancelar
    </button>
    <button
      type="button"
      @click="$emit('submit')"
      class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer"
    >
      Guardar
    </button>
  </div>
</template>

<script setup>
  defineEmits(['cancel', 'submit'])
</script> 