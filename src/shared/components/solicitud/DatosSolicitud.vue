<template>
  <div class="flex items-center gap-3 mb-6">
    <div class="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
      <MaletaIcon />
    </div>
    <div>
      <h2 class="text-lg font-bold text-text">Datos de la Solicitud</h2>
      <p class="text-sm text-gray-400">Información sobre el tipo de tramite que desea realizar</p>
    </div>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
    <div>
      <label for="categoria" class="block text-sm font-medium text-gray-700 mb-1.5">Categoría <span class="text-red-500">*</span></label>
      <select id="categoria" v-model="form.categoria" class="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A4972] focus:border-transparent transition-all" required @change="form.subcategoria = ''">
        <option value="" disabled>Seleccione una categoría</option>
        <option v-for="cat in categoriasDocumentos" :key="cat.id" :value="cat.id">{{ cat.nombre }}</option>
      </select>
      <p v-if="errors.categoria" class="mt-1 text-xs text-red-500">{{ errors.categoria }}</p>
    </div>

    <div>
      <label for="subcategoria" class="block text-sm font-medium text-gray-700 mb-1.5">Subcategoría <span class="text-red-500">*</span></label>
      <select id="subcategoria" v-model="form.subcategoria" class="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A4972] focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed" :disabled="!form.categoria" required>
        <option value="" disabled>{{ form.categoria ? 'Seleccione una subcategoría' : 'Seleccione primero una categoría' }}</option>
        <option v-for="sub in subcategorias" :key="sub.id" :value="sub.id">{{ sub.nombre }}</option>
      </select>
      <p v-if="errors.subcategoria" class="mt-1 text-xs text-red-500">{{ errors.subcategoria }}</p>
    </div>

    <div class="grid grid-cols-2 gap-5">
      <div>
        <label for="folios" class="block text-sm font-medium text-gray-700 mb-1.5">Número de Folios <span class="text-red-500">*</span></label>
        <input id="folios" v-model="form.folios" type="number" class="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A4972] focus:border-transparent transition-all" placeholder="0" />
        <p class="mt-1 text-xs text-gray-500">Ingrese el número de folios.</p>
        <p v-if="errors.folios" class="mt-1 text-xs text-red-500">{{ errors.folios }}</p>
      </div>
      <div>
        <label for="anexos" class="block text-sm font-medium text-gray-700 mb-1.5">Número de Anexos</label>
        <input id="anexos" v-model="form.anexos" type="number" class="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A4972] focus:border-transparent transition-all" placeholder="0" />
        <p class="mt-1 text-xs text-gray-500">Ingrese el número de anexos.</p>
      </div>
    </div>
    <div v-if="subcategoriaSeleccionada?.incorporaexpediente">
      <label for="expediente" class="block text-sm font-medium text-gray-700 mb-1.5">Número de Expediente Asociado <span class="text-red-500">*</span></label>
      <input id="expediente" v-model="form.expediente" type="text" class="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A4972] focus:border-transparent transition-all" placeholder="08001-2-25-XXXX" :required="subcategoriaSeleccionada?.incorporaexpediente" />
      <div class="flex items-center justify-between mt-1">
        <p v-if="errors.expediente" class="text-xs text-red-500">{{ errors.expediente }}</p>
        <p v-else class="mt-1 text-xs text-gray-500">Ingrese el numero de expediente si ya tiene uno asignado.</p>
      </div>
    </div>

    <div class="md:col-span-2">
      <label for="descripcion" class="block text-sm font-medium text-gray-700 mb-1.5">Descripcion de la Solicitud <span class="text-red-500">*</span></label>
      <textarea
        id="descripcion"
        v-model="form.descripcion"
        class="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A4972] focus:border-transparent transition-all resize-y"
        rows="5"
        placeholder="Describa detalladamente su solicitud, incluyendo cualquier informacion adicional relevante..."
        required
      ></textarea>
      <div class="flex items-center justify-between mt-1">
        <p v-if="errors.descripcion" class="text-xs text-red-500">{{ errors.descripcion }}</p>
        <p class="text-xs text-gray-500 ml-auto">{{ form.descripcion.length }} / 2000</p>
      </div>
    </div>
  </div>
</template>
<script setup>
  import { computed, watch, onMounted } from 'vue'
  import MaletaIcon from '@/shared/components/common/icons/MaletaIcon.vue'
  import { useCategoriaDocumentos } from '@/shared/composables/useCategoriaDocumentos'

  const  props = defineProps({
    errors: Object,
    origen: String
  })

  const emit = defineEmits(['update:requiereExpediente'])

  const form = defineModel('form', { required: true })

  const { categoriasDocumentos, getCategoriaDocumentos, getSubCategoriasDocumentos } = useCategoriaDocumentos()

  const subcategorias = computed(() => {
    if(!form.value.categoria) return []
    return getSubCategoriasDocumentos(form.value.categoria) || []
  })

  const subcategoriaSeleccionada = computed(() => {
    if(!form.value.subcategoria || !subcategorias.value.length) return null
    return subcategorias.value.find(sub => sub.id === form.value.subcategoria)
  })

  watch(subcategoriaSeleccionada, (sub) => {
    const requiere = sub?.incorporaexpediente ?? false
    if (!requiere) form.value.expediente = ''
    emit('update:requiereExpediente', requiere)
  })
  onMounted(() => getCategoriaDocumentos(props.origen))
</script>