<template>
  <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
    <div class="bg-white rounded-lg shadow-sm p-6 text-center py-12">
      <div class="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
        <svg class="w-8 h-8 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      </div>
      <h2 class="text-2xl font-bold text-gray-900 mb-2">Solicitud Enviada Exitosamente</h2>
      <p class="text-gray-600 max-w-md mx-auto mb-8">
        Su solicitud ha sido registrada. Guarde los siguientes datos, los necesitará para hacer seguimiento a su solicitud.
      </p>
      <div class="inline-flex flex-col gap-4 text-left">
        <div class="rounded-xl bg-gray-100 px-6 py-4 text-center">
          <span class="text-xs text-gray-500 font-medium uppercase tracking-wider">Número de Solicitud</span>
          <p class="text-lg font-bold font-mono text-[#1A4972] mt-1">{{ resultData.configuracion.prefijoVentanilla }}-{{ resultData.vigencia }}-{{ resultData.numerosolicitud?.toString().padStart(4, '0') }}</p>
        </div>
        <div class="rounded-xl bg-gray-100 px-6 py-4">
          <img :src="resultData.qr_image" alt="Código QR de la solicitud" class="w-full h-auto" />
        </div>
      </div>
      <div class="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
        <Sticker :data="resultData" />
        <button @click="emit('reset')" class="inline-flex items-center justify-center gap-2 rounded-lg bg-[#FFA800] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#143a5c] transition-colors duration-200">
          Crear Una Nueva Solicitud
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
  import Sticker from '@/shared/components/solicitud/Sticker.vue'

  defineProps({
    resultData: {
      type: Object,
      required: true
    }
  })

  const emit = defineEmits(['reset'])
</script>
