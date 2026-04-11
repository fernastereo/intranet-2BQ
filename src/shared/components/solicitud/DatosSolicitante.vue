<template>
  <div class="flex items-center gap-3 mb-6">
    <div class="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
      <PersonIcon />
    </div>
    <div>
      <h2 class="text-lg font-bold text-text">Datos del Solicitante</h2>
      <p class="text-sm text-gray-400">Informacion personal del solicitante o representante</p>
    </div>
  </div>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
    <div class="md:col-span-2">
      <label for="nombre" class="block text-sm font-medium text-gray-700 mb-1.5">Nombre Completo / Razón Social <span class="text-red-500">*</span></label>
      <input id="nombre" v-model="form.nombre" type="text" class="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A4972] focus:border-transparent transition-all" required />
      <p v-if="errors.nombre" class="mt-1 text-xs text-red-500">{{ errors.nombre }}</p>
    </div>

    <div>
      <label for="identificacion" class="block text-sm font-medium text-gray-700 mb-1.5">Identificación<span class="text-red-500">*</span></label>
      <input id="identificacion" v-model="form.identificacion" type="text" class="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A4972] focus:border-transparent transition-all" placeholder="Número de identificación" required />
      <p v-if="errors.identificacion" class="mt-1 text-xs text-red-500">{{ errors.identificacion }}</p>
    </div>

    <div>
      <label for="email" class="block text-sm font-medium text-gray-700 mb-1.5">Correo Electrónico <span class="text-red-500">*</span></label>
      <input id="email" v-model="form.email" type="email" class="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A4972] focus:border-transparent transition-all" placeholder="correo@ejemplo.com" required />
      <p v-if="errors.email" class="mt-1 text-xs text-red-500">{{ errors.email }}</p>
    </div>

    <div>
      <label for="direccion" class="block text-sm font-medium text-gray-700 mb-1.5">Dirección<span class="text-red-500">*</span></label>
      <input id="direccion" v-model="form.direccion" type="text" class="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A4972] focus:border-transparent transition-all" placeholder="Calle, Número" required />
      <p v-if="errors.direccion" class="mt-1 text-xs text-red-500">{{ errors.direccion }}</p>
    </div>

    <div>
      <label for="telefono" class="block text-sm font-medium text-gray-700 mb-1.5">Teléfono <span class="text-red-500">*</span></label>
      <input id="telefono" v-model="form.telefono" type="tel" class="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A4972] focus:border-transparent transition-all" placeholder="555 123 4567" required />
      <p v-if="errors.telefono" class="mt-1 text-xs text-red-500">{{ errors.telefono }}</p>
    </div>

    <div class="grid col-span-2 md:grid-cols-3 gap-5">
      <div>
        <label for="tipoResponsable" class="block text-sm font-medium text-gray-700 mb-1.5">Tipo de Solicitante <span class="text-red-500">*</span></label>
        <select id="tipoResponsable" v-model="form.tipoResponsable" class="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A4972] focus:border-transparent transition-all" required>
          <option value="" disabled>Seleccione una opción</option>
          <option v-for="tipo in tiposResponsable" :key="tipo.id" :value="tipo.id">{{ tipo.nombre }}</option>
        </select>
        <p v-if="errors.tipoResponsable" class="mt-1 text-xs text-red-500">{{ errors.tipoResponsable }}</p>
      </div>
      
      <div v-if="form.tipoResponsable === 2 || form.tipoResponsable === 5">
          <label for="identificacionRepresentante" class="block text-sm font-medium text-gray-700 mb-1.5">
            Identificación del {{ form.tipoResponsable === 5 ? 'Representante' : 'Apoderado' }} <span class="text-red-500">*</span>
          </label>
          <input id="identificacionRepresentante" v-model="form.identificacionRepresentante" type="text" class="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A4972] focus:border-transparent transition-all" required />
          <p v-if="errors.identificacionRepresentante" class="mt-1 text-xs text-red-500">{{ errors.identificacionRepresentante }}</p>
      </div>
      <div v-if="form.tipoResponsable === 2 || form.tipoResponsable === 5">
          <label for="nombreRepresentante" class="block text-sm font-medium text-gray-700 mb-1.5">
            Nombre del {{ form.tipoResponsable === 5 ? 'Representante' : 'Apoderado' }} <span class="text-red-500">*</span>
          </label>
          <input id="nombreRepresentante" v-model="form.nombreRepresentante" type="text" class="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A4972] focus:border-transparent transition-all" required />
          <p v-if="errors.nombreRepresentante" class="mt-1 text-xs text-red-500">{{ errors.nombreRepresentante }}</p>
      </div>
    </div>
  </div>
</template>
<script setup>
  import PersonIcon from '@/shared/components/common/icons/PersonIcon.vue'
  const form = defineModel('form', { required: true })

  defineProps({
    errors: Object,
    tiposResponsable: Array
  })
</script>