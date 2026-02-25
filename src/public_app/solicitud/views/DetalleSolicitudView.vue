<template>
  <div class="bg-gray-50 min-h-screen">
    <!-- Page Header -->
    <div class="bg-gray-600">
      <div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
        <router-link to="/consultar" class="inline-flex items-center gap-1.5 text-sm text-blue-200 hover:text-white transition-colors mb-4">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Nueva Consulta
        </router-link>
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 class="text-3xl md:text-4xl font-bold text-white tracking-tight">Detalle de Solicitud</h1>
            <p v-if="solicitud" class="mt-1 text-blue-200 font-mono text-sm">{{ solicitud.numerosolicitud.toString().padStart(4, '0') }}-{{ solicitud.vigencia }}</p>
          </div>
          <span
            v-if="solicitud"
            class="inline-flex items-center self-start sm:self-auto px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider"
            :class="getEstadoColor(solicitud.estado)"
          >
            {{ getEstadoLabel(solicitud.estado) }}
          </span>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="!solicitud && !error" class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 text-center">
      <div class="w-12 h-12 rounded-full border-4 border-blue-200 border-t-[#1A4972] animate-spin mx-auto mb-4"></div>
      <p class="text-gray-600">Cargando datos de la solicitud...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 text-center">
      <div class="bg-white rounded-lg shadow-sm p-6 max-w-md mx-auto py-12">
        <div class="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        </div>
        <h2 class="text-lg font-bold text-gray-900 mb-2">Acceso no autorizado</h2>
        <p class="text-sm text-gray-600 mb-6">Debe verificar su identidad para acceder a esta solicitud.</p>
        <router-link to="/consultar" class="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1A4972] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#143a5c] transition-colors duration-200">
          Ir a Consultar
        </router-link>
      </div>
    </div>

    <!-- Solicitud Detail -->
    <div v-else class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 -mt-4">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Content -->
        <div class="lg:col-span-2 flex flex-col gap-6">
          <!-- Datos del Solicitante -->
          <section class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
              <svg class="w-5 h-5 text-[#1A4972]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Datos del Solicitante
            </h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DataField label="Nombre Completo" :value="solicitud.solicitante_nombre" />
              <DataField label="Identificacion" :value="solicitud.solicitante_identificacion" />
              <DataField label="Correo Electronico" :value="solicitud.solicitante_email" />
              <DataField label="Telefono" :value="solicitud.telefono" />
              <DataField label="Tipo de Solicitante" :value="formatTipoSolicitante(solicitud.representante_tipo)" />
              <DataField v-if="solicitud.representante_nombre" label="Representante / Apoderado" :value="solicitud.representante_nombre" class="sm:col-span-2" />
              <DataField label="Direccion del Inmueble" :value="solicitud.direccion" class="sm:col-span-2" />
            </div>
          </section>

          <!-- Datos del Proyecto -->
          <section class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
              <svg class="w-5 h-5 text-[#1A4972]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
              Datos del Proyecto
            </h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DataField label="Categoria ID" :value="String(solicitud.categoria.nombre)" />
              <DataField label="Subcategoria ID" :value="String(solicitud.subcategoria.nombre)" />
              <div class="sm:col-span-2">
                <p class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Descripcion</p>
                <p class="text-sm text-gray-900 leading-relaxed bg-gray-100 rounded-lg p-4">{{ solicitud.descripcion }}</p>
              </div>
            </div>
          </section>

          <!-- Archivos Adjuntos -->
          <section class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
              <svg class="w-5 h-5 text-[#1A4972]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
              </svg>
              Archivos Adjuntos
            </h2>
            <div v-if="solicitud.adjuntos && solicitud.adjuntos.length > 0" class="flex flex-col gap-2">
              <div
                v-for="(archivo, idx) in solicitud.adjuntos"
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
            <div v-else class="text-center py-8">
              <p class="text-sm text-gray-500">No se adjuntaron archivos con esta solicitud.</p>
            </div>
          </section>

          <!-- Comentarios -->
          <section class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
              <svg class="w-5 h-5 text-[#1A4972]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              Comentarios y Seguimiento
              <span class="text-xs font-normal text-gray-500">({{ solicitud.comentarios?.length || 0 }})</span>
            </h2>
            <div v-if="solicitud.comentarios && solicitud.comentarios.length > 0" class="flex flex-col gap-4">
              <div
                v-for="comentario in solicitud.comentarios"
                :key="comentario.id"
                class="relative pl-6 border-l-2 border-blue-200"
              >
                <div class="absolute left-0 top-0 w-3 h-3 rounded-full bg-[#1A4972] -translate-x-[7px]"></div>
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-sm font-semibold text-gray-900">{{ comentario.autor }}</span>
                  <span class="text-xs text-gray-500">{{ formatDate(comentario.fecha) }}</span>
                </div>
                <p class="text-sm text-gray-600 leading-relaxed">{{ comentario.texto }}</p>
              </div>
            </div>
            <div v-else class="text-center py-8">
              <p class="text-sm text-gray-500">Aun no hay comentarios para esta solicitud.</p>
            </div>
          </section>

          <!-- Respuesta Final -->
          <section v-if="solicitud.respuestaFinal" class="bg-white rounded-lg shadow-sm p-6 border-2"
            :class="solicitud.respuestaFinal.estado === 'aprobada' ? 'border-green-300 bg-green-50/50'
              : solicitud.respuestaFinal.estado === 'rechazada' ? 'border-red-300 bg-red-50/50'
              : 'border-orange-300 bg-orange-50/50'">
            <h2 class="text-lg font-bold mb-5 flex items-center gap-2"
              :class="solicitud.respuestaFinal.estado === 'aprobada' ? 'text-green-800'
                : solicitud.respuestaFinal.estado === 'rechazada' ? 'text-red-800'
                : 'text-orange-800'">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              Respuesta Final
            </h2>
            <div class="flex flex-col gap-3">
              <p class="text-sm leading-relaxed"
                :class="solicitud.respuestaFinal.estado === 'aprobada' ? 'text-green-800'
                  : solicitud.respuestaFinal.estado === 'rechazada' ? 'text-red-800'
                  : 'text-orange-800'">
                {{ solicitud.respuestaFinal.mensaje }}
              </p>
              <div class="flex flex-col sm:flex-row sm:items-center gap-2 pt-3 border-t"
                :class="solicitud.respuestaFinal.estado === 'aprobada' ? 'border-green-200'
                  : solicitud.respuestaFinal.estado === 'rechazada' ? 'border-red-200'
                  : 'border-orange-200'">
                <span class="text-xs font-semibold"
                  :class="solicitud.respuestaFinal.estado === 'aprobada' ? 'text-green-700'
                    : solicitud.respuestaFinal.estado === 'rechazada' ? 'text-red-700'
                    : 'text-orange-700'">
                  {{ solicitud.respuestaFinal.funcionario }}
                </span>
                <span class="text-xs text-gray-500">{{ formatDate(solicitud.respuestaFinal.fecha) }}</span>
              </div>
            </div>
          </section>
        </div>

        <!-- Sidebar -->
        <div class="flex flex-col gap-6">
          <!-- Status Card -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h3 class="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Informacion General</h3>
            <div class="flex flex-col gap-4">
              <div>
                <p class="text-xs text-gray-500 mb-1">No. de Solicitud</p>
                <p class="text-sm font-bold font-mono text-[#1A4972]">{{ solicitud.numerosolicitud.toString().padStart(4, '0') }}-{{ solicitud.vigencia }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500 mb-1">Estado</p>
                <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold" :class="getEstadoColor(solicitud.estado)">
                  {{ getEstadoLabel(solicitud.estado) }}
                </span>
              </div>
              <div>
                <p class="text-xs text-gray-500 mb-1">Fecha de Creacion</p>
                <p class="text-sm text-gray-900">{{ formatDateTime(solicitud.created_at) }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500 mb-1">Vigencia (Año)</p>
                <p class="text-sm text-gray-900">{{ solicitud.vigencia }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500 mb-1">Origen</p>
                <p class="text-sm text-gray-900 capitalize">{{ solicitud.origen }}</p>
              </div>
            </div>
          </div>

          <!-- Timeline -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h3 class="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Linea de Tiempo</h3>
            <div class="flex flex-col gap-0">
              <TimelineItem
                label="Solicitud Recibida"
                :date="formatDateOnly(solicitud.created_at)"
                :active="true"
              />
              <TimelineItem
                label="En Revision"
                :date="solicitud.estado !== 'recibido' ? formatDateOnly(solicitud.updated_at) : undefined"
                :active="solicitud.estado !== 'recibido'"
              />
              <TimelineItem
                label="Resolucion"
                :date="solicitud.respuestaFinal?.fecha"
                :active="!!solicitud.respuestaFinal"
                :isLast="true"
              />
            </div>
          </div>

          <!-- Actions -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <router-link to="/consultar" class="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50 transition-colors duration-200 border border-gray-300 w-full text-center">
              Consultar Otra Solicitud
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { ESTADOS_LABEL, ESTADOS_COLOR } from '@/shared/types'
  import { useSolicitudes } from '@/shared/composables/useSolicitudes'
  import { useRoute } from 'vue-router'
  import { useRouter } from 'vue-router'
  import DataField from '@/public_app/shared/components/DataField.vue'
  import TimelineItem from '@/public_app/shared/components/TimelineItem.vue'

  const router = useRouter()
  const route = useRoute()
  const {
    getSolicitud,
    loading,
    apiError
  } = useSolicitudes()

  const solicitud = ref(null)
  const error = ref(false)

  onMounted(async() => {
    const hasPublicToken = sessionStorage.getItem('solicitud_token')

    const result = await getSolicitud(route.params.solicitud_id, !!hasPublicToken)
    
    if (!result) {
      if (apiError.value && apiError.value.includes('expirado')) {
        sessionStorage.removeItem('solicitud_token')
        sessionStorage.removeItem('solicitud_expires_at')
        router.push({ name: 'consultar', query: { expired: 'true' } })
      } else {
        error.value = true
      }
      return
    }

    solicitud.value = result
  })

  function getEstadoLabel(estado: string): string {
    return ESTADOS_LABEL[estado] || estado
  }

  function getEstadoColor(estado: string): string {
    return ESTADOS_COLOR[estado] || 'bg-gray-100 text-gray-800'
  }

  function formatTipoSolicitante(tipo: string): string {
    const labels: Record<string, string> = {
      titular: 'Titular',
      representante: 'Representante Legal',
      apoderado: 'Apoderado'
    }
    return labels[tipo] || tipo
  }

  function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  function formatDate(dateStr?: string): string {
    if (!dateStr) return '-'
    const date = new Date(dateStr)
    return date.toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  function formatDateTime(dateTimeStr?: string): string {
    if (!dateTimeStr) return '-'
    const date = new Date(dateTimeStr)
    return date.toLocaleString('es-CO', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  function formatDateOnly(dateTimeStr?: string): string {
    if (!dateTimeStr) return ''
    const date = new Date(dateTimeStr)
    return date.toISOString().split('T')[0]
  }
</script>