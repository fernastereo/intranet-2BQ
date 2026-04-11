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
  </div>
</template>

<script setup>
  import AdjuntoIcon from '@/shared/components/common/icons/AdjuntoIcon.vue'
  import FileUpload from '@/shared/components/common/FileUpload.vue'

  const form = defineModel('form', { required: true })
</script>