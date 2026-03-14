<template>
  <div>
    <label class="form-label">{{ label }}</label>
    <div
      class="relative rounded-xl border-2 border-dashed transition-colors duration-200 cursor-pointer"
      :class="isDragging ? 'border-primary bg-primary-50' : 'border-surface-border bg-surface hover:border-primary-300 hover:bg-primary-50/50'"
      @dragenter.prevent="isDragging = true"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
      @click="triggerFileInput"
      role="button"
      :aria-label="label"
    >
      <input
        ref="fileInput"
        type="file"
        multiple
        :accept="accept"
        class="sr-only"
        @change="handleFileSelect"
      />
      <div class="flex flex-col items-center justify-center py-8 px-4">
        <div class="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center mb-3">
          <svg class="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </div>
        <p class="text-sm font-medium text-text">
          Arrastre archivos aqui o <span class="text-primary underline">haga clic para seleccionar</span>
        </p>
        <p class="text-xs text-text-muted mt-1">PDF, JPG, PNG hasta 10 MB por archivo</p>
      </div>
    </div>

    <div v-if="files.length > 0" class="mt-3 flex flex-col gap-2">
      <div
        v-for="(file, index) in files"
        :key="index"
        class="flex items-center justify-between rounded-lg bg-surface-muted px-4 py-3"
      >
        <div class="flex items-center gap-3 min-w-0">
          <div class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            :class="getFileIconClass(file.type)">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <div class="min-w-0">
            <p class="text-sm font-medium text-text truncate">{{ file.name }}</p>
            <p class="text-xs text-text-muted">{{ formatFileSize(file.size) }}</p>
          </div>
        </div>
        <button
          type="button"
          @click.stop="removeFile(index)"
          class="p-1.5 rounded-lg text-text-muted hover:text-red-600 hover:bg-red-50 transition-colors flex-shrink-0"
          :aria-label="'Eliminar archivo ' + file.name"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'

  const props = withDefaults(defineProps<{
    label?: string
    accept?: string
    modelValue?: File[]
  }>(), {
    label: 'Archivos Adjuntos',
    accept: '.pdf,.jpg,.jpeg,.png',
    modelValue: () => []
  })

  const emit = defineEmits<{
    'update:modelValue': [files: File[]]
  }>()

  const fileInput = ref<HTMLInputElement | null>(null)
  const isDragging = ref(false)
  const files = ref<File[]>([...props.modelValue])

  function triggerFileInput() {
    fileInput.value?.click()
  }

  function handleFileSelect(event: Event) {
    const input = event.target as HTMLInputElement
    if (input.files) {
      addFiles(Array.from(input.files))
    }
    input.value = ''
  }

  function handleDrop(event: DragEvent) {
    isDragging.value = false
    if (event.dataTransfer?.files) {
      addFiles(Array.from(event.dataTransfer.files))
    }
  }

  function addFiles(newFiles: File[]) {
    files.value = [...files.value, ...newFiles]
    emit('update:modelValue', files.value)
  }

  function removeFile(index: number) {
    files.value.splice(index, 1)
    files.value = [...files.value]
    emit('update:modelValue', files.value)
  }

  function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  function getFileIconClass(type: string): string {
    if (type === 'application/pdf') return 'bg-red-100 text-red-600'
    if (type.startsWith('image/')) return 'bg-blue-100 text-blue-600'
    return 'bg-gray-100 text-gray-600'
  }
</script>
