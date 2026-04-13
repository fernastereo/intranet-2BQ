<template>
  <div class="flex items-center gap-3 mb-6">
    <div class="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
      <AdjuntoIcon />
    </div>
    <div>
      <h2 class="text-lg font-bold text-text">Documentos Adjuntos</h2>
    </div>
  </div>

  <div>
    <p class="text-sm text-gray-600 mb-6 leading-relaxed">
      Adjunte todos los documentos requeridos para su solicitud. Los archivos deben estar en formato PDF, JPG o PNG con un tamaño máximo de 10 MB por archivo.
    </p>

    <FileUpload v-model="form.archivos" label="Seleccionar Archivos" />
    <div v-if="adjuntos && adjuntos.length > 0" class="flex flex-col gap-2 mt-3">
      <div
        v-for="(archivo, idx) in adjuntos"
        :key="idx"
        class="flex items-center justify-between rounded-lg bg-gray-100 px-4 py-3"
      >
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg flex items-center justify-center"
            :class="archivo.mime_type === 'application/pdf' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <div>
            <a :href="archivo.url" target="_blank" class="text-sm font-medium text-gray-900">{{ archivo.file_name }}</a>
            <p class="text-xs text-gray-500">{{ formatFileSize(archivo.size_bytes) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import AdjuntoIcon from '@/shared/components/common/icons/AdjuntoIcon.vue'
  import FileUpload from '@/shared/components/common/FileUpload.vue'

  const form = defineModel('form', { required: true })
  defineProps({
    adjuntos: {
      type: Object,
      required: true
    }
  })

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }
</script>