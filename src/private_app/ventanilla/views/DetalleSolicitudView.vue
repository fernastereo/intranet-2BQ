<template>
  <PageHeader :isLoading="isLoading" @refresh="fetchData" />
  <div class="bg-gray-50 min-h-screen">
    <!-- Page Header -->
    <div class="">
      <div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 v-if="solicitud" class="mt-1 text-2xl text-gray-500 font-mono">{{ settings.prefijo_ventanilla }}-{{ solicitud.vigencia }}-{{ solicitud.numerosolicitud.toString().padStart(4, '0') }}</h1>
          </div>
          <span
            v-if="solicitud"
            class="inline-flex items-center self-start sm:self-auto px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider"
            :class="`bg-${solicitud.estado.class}-100 text-${solicitud.estado.class}-800`"
          >
            {{ solicitud.estado.nombre }}
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
        <h2 class="text-lg font-bold text-gray-900 mb-2">Error al cargar</h2>
        <p class="text-sm text-gray-600 mb-6">{{ apiError || 'No se pudo cargar la solicitud.' }}</p>
        <router-link to="/home/ventanilla" class="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1A4972] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#143a5c] transition-colors duration-200">
          Volver a Ventanilla
        </router-link>
      </div>
    </div>

    <!-- Solicitud Detail (Edit Form) -->
    <form v-else @submit.prevent="handleSubmit" class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 -mt-4">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Content -->
        <div class="lg:col-span-2 flex flex-col gap-6">
          <!-- Datos del Solicitante (editable) -->
          <section class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
              <svg class="w-5 h-5 text-[#1A4972]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Datos del Solicitante
            </h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="sm:col-span-2">
                <label for="nombre" class="block text-sm font-medium text-gray-700 mb-1.5">Nombre Completo / Razón Social <span class="text-red-500">*</span></label>
                <input id="nombre" v-model="form.nombre" type="text" class="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A4972] focus:border-transparent uppercase" required />
                <p v-if="errors.nombre" class="mt-1 text-xs text-red-500">{{ errors.nombre }}</p>
              </div>
              <div>
                <label for="identificacion" class="block text-sm font-medium text-gray-700 mb-1.5">Identificación <span class="text-red-500">*</span></label>
                <input id="identificacion" v-model="form.identificacion" type="text" class="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A4972] focus:border-transparent" required />
                <p v-if="errors.identificacion" class="mt-1 text-xs text-red-500">{{ errors.identificacion }}</p>
              </div>
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-1.5">Correo Electrónico <span class="text-red-500">*</span></label>
                <input id="email" v-model="form.email" type="email" class="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A4972] focus:border-transparent" required />
                <p v-if="errors.email" class="mt-1 text-xs text-red-500">{{ errors.email }}</p>
              </div>
              <div>
                <label for="telefono" class="block text-sm font-medium text-gray-700 mb-1.5">Teléfono <span class="text-red-500">*</span></label>
                <input id="telefono" v-model="form.telefono" type="tel" class="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A4972] focus:border-transparent" required />
                <p v-if="errors.telefono" class="mt-1 text-xs text-red-500">{{ errors.telefono }}</p>
              </div>
              <div class="sm:col-span-2">
                <label for="direccion" class="block text-sm font-medium text-gray-700 mb-1.5">Dirección del Inmueble <span class="text-red-500">*</span></label>
                <input id="direccion" v-model="form.direccion" type="text" class="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A4972] focus:border-transparent" required />
                <p v-if="errors.direccion" class="mt-1 text-xs text-red-500">{{ errors.direccion }}</p>
              </div>
              <div>
                <label for="tipoResponsable" class="block text-sm font-medium text-gray-700 mb-1.5">Tipo de Solicitante <span class="text-red-500">*</span></label>
                <select id="tipoResponsable" v-model="form.tipoResponsable" class="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A4972] focus:border-transparent" required>
                  <option value="" disabled>Seleccione una opción</option>
                  <option v-for="tipo in tiposResponsable" :key="tipo.id" :value="tipo.id">{{ tipo.nombre }}</option>
                </select>
                <p v-if="errors.tipoResponsable" class="mt-1 text-xs text-red-500">{{ errors.tipoResponsable }}</p>
              </div>
              <template v-if="form.tipoResponsable === 2 || form.tipoResponsable === 5">
                <div>
                  <label for="identificacionRepresentante" class="block text-sm font-medium text-gray-700 mb-1.5">
                    Identificación del {{ form.tipoResponsable === 5 ? 'Representante' : 'Apoderado' }} <span class="text-red-500">*</span>
                  </label>
                  <input id="identificacionRepresentante" v-model="form.identificacionRepresentante" type="text" class="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A4972] focus:border-transparent" :required="form.tipoResponsable === 2 || form.tipoResponsable === 5" />
                  <p v-if="errors.identificacionRepresentante" class="mt-1 text-xs text-red-500">{{ errors.identificacionRepresentante }}</p>
                </div>
                <div>
                  <label for="nombreRepresentante" class="block text-sm font-medium text-gray-700 mb-1.5">
                    Nombre del {{ form.tipoResponsable === 5 ? 'Representante' : 'Apoderado' }} <span class="text-red-500">*</span>
                  </label>
                  <input id="nombreRepresentante" v-model="form.nombreRepresentante" type="text" class="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A4972] focus:border-transparent uppercase" :required="form.tipoResponsable === 2 || form.tipoResponsable === 5" />
                  <p v-if="errors.nombreRepresentante" class="mt-1 text-xs text-red-500">{{ errors.nombreRepresentante }}</p>
                </div>
              </template>
            </div>
          </section>

          <!-- Datos de la Solicitud (editable) -->
          <section class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
              <svg class="w-5 h-5 text-[#1A4972]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
              Datos de la Solicitud
            </h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label for="categoria" class="block text-sm font-medium text-gray-700 mb-1.5">Categoría <span class="text-red-500">*</span></label>
                <select id="categoria" v-model="form.categoria" class="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A4972] focus:border-transparent" required @change="form.subcategoria = ''">
                  <option value="" disabled>Seleccione una categoría</option>
                  <option v-for="cat in categoriasDocumentos" :key="cat.id" :value="cat.id">{{ cat.nombre }}</option>
                </select>
                <p v-if="errors.categoria" class="mt-1 text-xs text-red-500">{{ errors.categoria }}</p>
              </div>
              <div>
                <label for="subcategoria" class="block text-sm font-medium text-gray-700 mb-1.5">Subcategoría <span class="text-red-500">*</span></label>
                <select id="subcategoria" v-model="form.subcategoria" class="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A4972] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed" :disabled="!form.categoria" required>
                  <option value="" disabled>{{ form.categoria ? 'Seleccione una subcategoría' : 'Seleccione primero una categoría' }}</option>
                  <option v-for="sub in subcategorias" :key="sub.id" :value="sub.id">{{ sub.nombre }}</option>
                </select>
                <p v-if="errors.subcategoria" class="mt-1 text-xs text-red-500">{{ errors.subcategoria }}</p>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-3 sm:col-span-2 gap-4">
                <div>
                  <label for="folios" class="block text-sm font-medium text-gray-700 mb-1.5">Número de Folios</label>
                  <input id="folios" v-model="form.folios" type="number" class="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A4972] focus:border-transparent" placeholder="0" min="0" />
                </div>
                <div>
                  <label for="anexos" class="block text-sm font-medium text-gray-700 mb-1.5">Número de Anexos</label>
                  <input id="anexos" v-model="form.anexos" type="number" class="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A4972] focus:border-transparent" placeholder="0" min="0" />
                </div>
                <div v-if="subcategoriaSeleccionada?.incorporaexpediente" class="">
                  <label for="expediente" class="block text-sm font-medium text-gray-700 mb-1.5">Expediente Asociado <span class="text-red-500">*</span></label>
                  <input id="expediente" v-model="form.expediente" type="text" class="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A4972] focus:border-transparent" :required="subcategoriaSeleccionada?.incorporaexpediente" />
                  <p v-if="errors.expediente" class="mt-1 text-xs text-red-500">{{ errors.expediente }}</p>
                </div>
              </div>
              <div class="sm:col-span-2">
                <label for="descripcion" class="block text-sm font-medium text-gray-700 mb-1.5">Descripción de la Solicitud <span class="text-red-500">*</span></label>
                <textarea id="descripcion" v-model="form.descripcion" class="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A4972] focus:border-transparent resize-y" rows="5" required maxlength="2000"></textarea>
                <div class="flex justify-between mt-1">
                  <p v-if="errors.descripcion" class="text-xs text-red-500">{{ errors.descripcion }}</p>
                  <p class="text-xs text-gray-500 ml-auto">{{ form.descripcion?.length || 0 }} / 2000</p>
                </div>
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
            <div v-if="solicitud.adjuntos && solicitud.adjuntos.length > 0" class="flex flex-col gap-2 mb-6">
              <div
                v-for="(archivo, idx) in solicitud.adjuntos"
                :key="archivo.id || idx"
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
            <div v-else class="mb-6">
              <p class="text-sm text-gray-500">No se adjuntaron archivos con esta solicitud.</p>
            </div>

            <!-- Agregar más archivos -->
            <div class="border-t border-gray-200 pt-6">
              <p class="text-sm font-medium text-gray-700 mb-3">Agregar más archivos</p>
              <FileUpload
                :modelValue="archivosParaSubir"
                @update:modelValue="onArchivosUpdate"
                label="Seleccionar archivos"
              />
              <div class="mt-3 flex items-center gap-3">
                <button
                  type="button"
                  @click="handleAgregarAdjuntos"
                  :disabled="!(archivosParaSubir?.length) || uploadAdjuntosLoading"
                  class="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1A4972] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#143a5c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg v-if="uploadAdjuntosLoading" class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10" stroke-opacity="0.25" />
                    <path d="M12 2a10 10 0 0 1 10 10" stroke-opacity="1" />
                  </svg>
                  <svg v-else class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  {{ uploadAdjuntosLoading ? 'Subiendo...' : 'Subir archivos' }}
                </button>
                <p v-if="apiError" class="text-xs text-red-500">{{ apiError }}</p>
              </div>
            </div>
          </section>

          <!-- Comentarios (solo lectura) -->
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
                  <span class="text-sm font-semibold text-gray-900">{{ comentario.nombre }}</span>
                  <span class="text-xs text-gray-500">{{ formatDate(comentario.created_at) }}</span>
                </div>
                <p class="text-sm text-gray-600 leading-relaxed">{{ comentario.contenido }}</p>
              </div>
            </div>
            <div v-else class="text-center py-8">
              <p class="text-sm text-gray-500">Aún no hay comentarios para esta solicitud.</p>
            </div>
          </section>

          <!-- Respuesta Final (solo lectura) -->
          <section v-if="solicitud.respuesta" class="rounded-lg shadow-sm p-6 border-2 border-[#1A4972]/20 bg-[#1A4972]/5">
            <h2 class="text-lg font-bold text-[#1A4972] mb-5 flex items-center gap-2">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              Respuesta Final
            </h2>
            <div class="flex flex-col gap-4">
              <p class="text-sm leading-relaxed text-gray-900">{{ solicitud.respuesta.contenido }}</p>
              <div class="flex items-center gap-2 pt-3 border-t border-gray-200">
                <span class="text-xs text-gray-500">{{ formatDateTime(solicitud.respuesta.created_at) }}</span>
              </div>
              <div v-if="solicitud.respuesta.adjuntos && solicitud.respuesta.adjuntos.length > 0" class="flex flex-col gap-2 pt-3 border-t border-gray-200">
                <p class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Archivos adjuntos a la respuesta</p>
                <div
                  v-for="(archivo, idx) in solicitud.respuesta.adjuntos"
                  :key="archivo.id || idx"
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
                      <a :href="archivo.url" target="_blank" rel="noopener noreferrer" class="text-sm font-medium text-gray-900 hover:text-[#1A4972]">{{ archivo.file_name }}</a>
                      <p class="text-xs text-gray-500">{{ formatFileSize(archivo.size_bytes) }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <!-- Sidebar -->
        <div class="flex flex-col gap-6">
          <!-- Status Card -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h3 class="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Información General</h3>
            <div class="flex flex-col gap-4">
              <div>
                <p class="text-xs text-gray-500 mb-1">No. de Solicitud</p>
                <p class="text-sm font-bold font-mono text-[#1A4972]">{{ settings.prefijo_ventanilla }}-{{ solicitud.vigencia }}-{{ solicitud.numerosolicitud.toString().padStart(4, '0') }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500 mb-1">Estado</p>
                <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold" :class="`bg-${solicitud.estado.class}-100 text-${solicitud.estado.class}-800`">
                  {{ solicitud.estado.nombre }}
                </span>
              </div>
              <div>
                <p class="text-xs text-gray-500 mb-1">Fecha de Creación</p>
                <p class="text-sm text-gray-900">{{ formatDateTime(solicitud.created_at) }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500 mb-1">Vigencia (Año)</p>
                <p class="text-sm text-gray-900">{{ solicitud.vigencia }}</p>
              </div>
              <div>
                <div v-if="solicitud.origen === 'web'">
                  <p class="text-xs text-gray-500 mb-1">Origen</p>
                  <p class="text-sm text-gray-900 capitalize">{{ solicitud.origen }}</p>
                </div>
                <div v-else>
                  <p class="text-xs text-gray-500 mb-1">Recibido por</p>
                  <p class="text-sm text-gray-900 capitalize">{{ solicitud.usuario_receptor?.nombre }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Timeline -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h3 class="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Línea de Tiempo</h3>
            <div class="flex flex-col gap-0">
              <TimelineItem v-for="historial in solicitud.historial_estados" :key="historial.id"
                :label="historial.estado_nombre"
                :date="formatDateOnly(historial.fecha)"
                :active="historial.estado_id === solicitud.estado.id"
                :isLast="historial.id === solicitud.historial_estados[solicitud.historial_estados.length - 1]?.id"
              />
            </div>
          </div>

          <!-- Actions -->
          <div class="bg-white rounded-lg shadow-sm p-6 flex flex-col gap-3">
            <button
              type="submit"
              class="inline-flex items-center justify-center gap-2 rounded-lg bg-[#FFA800] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#E69500] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="loading"
            >
              <svg v-if="loading" class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" stroke-opacity="0.25" />
                <path d="M12 2a10 10 0 0 1 10 10" stroke-opacity="1" />
              </svg>
              <svg v-else class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
              {{ loading ? 'Guardando...' : 'Guardar Cambios' }}
            </button>
            <router-link to="/home/ventanilla" class="inline-flex items-center justify-center gap-2 rounded-lg bg-white border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50 transition-colors duration-200 text-center">
              Volver a Ventanilla
            </router-link>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useSolicitudes } from '@/shared/composables/useSolicitudes'
import { useCategoriaDocumentos } from '@/shared/composables/useCategoriaDocumentos'
import { useTiposResponsable } from '@/shared/composables/useTiposResponsable'
import { useAuth } from '@/shared/composables/useAuth'
import { useRoute } from 'vue-router'
import TimelineItem from '@/shared/components/common/TimelineItem.vue'
import FileUpload from '@/shared/components/common/FileUpload.vue'
import { useAppSettings } from '@/shared/composables/useAppSettings'
import Swal from 'sweetalert2'
import PageHeader from '@/shared/components/common/PageHeader.vue'

const route = useRoute()
const { settings } = useAppSettings()
const { user } = useAuth()
const {
  getSolicitud,
  actualizarSolicitud,
  agregarAdjuntos,
  loading,
  apiError,
  uploadAdjuntosLoading
} = useSolicitudes()
const { tiposResponsable, getTiposResponsable } = useTiposResponsable()
const {
  categoriasDocumentos,
  getCategoriaDocumentos,
  getSubCategoriasDocumentos,
} = useCategoriaDocumentos()

const solicitud = ref(null)
const error = ref(false)
const form = ref({
  nombre: '',
  identificacion: '',
  email: '',
  telefono: '',
  direccion: '',
  tipoResponsable: '',
  identificacionRepresentante: '',
  nombreRepresentante: '',
  categoria: '',
  subcategoria: '',
  expediente: '',
  descripcion: '',
  folios: '',
  anexos: '',
})
const errors = ref({})
const archivosParaSubir = ref([])

const subcategorias = computed(() => {
  if (!form.value.categoria) return []
  return getSubCategoriasDocumentos(form.value.categoria) || []
})

const subcategoriaSeleccionada = computed(() => {
  if (!form.value.subcategoria || !subcategorias.value.length) return null
  return subcategorias.value.find(sub => sub.id === form.value.subcategoria)
})

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })
}

function formatDateTime(dateTimeStr) {
  if (!dateTimeStr) return '-'
  return new Date(dateTimeStr).toLocaleString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function formatDateOnly(dateTimeStr) {
  if (!dateTimeStr) return ''
  return new Date(dateTimeStr).toISOString().split('T')[0]
}

function populateForm(s) {
  const titular = s.responsables?.find(r => r.tiporesponsable_id === 1)
  const representante = s.responsables?.find(r => r.tiporesponsable_id === 5)
  const apoderado = s.responsables?.find(r => r.tiporesponsable_id === 2)
  const repOapo = representante || apoderado

  form.value = {
    nombre: titular?.nombre ?? s.responsables?.[0]?.nombre ?? '',
    identificacion: titular?.documento ?? s.responsables?.[0]?.documento ?? '',
    email: s.email ?? '',
    telefono: s.telefono ?? '',
    direccion: s.direccion ?? '',
    tipoResponsable: repOapo ? (representante ? 5 : 2) : 1,
    identificacionRepresentante: repOapo?.documento ?? '',
    nombreRepresentante: repOapo?.nombre ?? '',
    categoria: s.categoria?.id ?? s.categoria_id ?? '',
    subcategoria: s.subcategoria?.id ?? s.subcategoria_id ?? '',
    expediente: s.expediente ?? '',
    descripcion: s.descripcion ?? '',
    folios: s.folios ?? '',
    anexos: s.anexos ?? '',
  }
}

function buildUpdatePayload() {
  const payload = {
    solicitante_nombre: form.value.nombre,
    solicitante_email: form.value.email,
    solicitante_identificacion: form.value.identificacion,
    representante_identificacion: form.value.identificacionRepresentante,
    representante_nombre: form.value.nombreRepresentante,
    representante_tipo: form.value.tipoResponsable,
    telefono: form.value.telefono,
    direccion: form.value.direccion,
    categoria_id: form.value.categoria,
    subcategoria_id: form.value.subcategoria,
    expediente: form.value.expediente,
    folios: form.value.folios,
    anexos: form.value.anexos,
    descripcion: form.value.descripcion
  }
  if (solicitud.value?.origen === 'oficina' && user.value?.id) {
    payload.usuario_receptor_id = user.value.id
  }
  return payload
}

function validate() {
  errors.value = {}
  if (!form.value.nombre?.trim()) errors.value.nombre = 'El nombre es requerido'
  if (!form.value.identificacion?.trim()) errors.value.identificacion = 'La identificación es requerida'
  if (!form.value.email?.trim()) errors.value.email = 'El correo electrónico es requerido'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) errors.value.email = 'Ingrese un correo electrónico válido'
  if (!form.value.telefono?.trim()) errors.value.telefono = 'El teléfono es requerido'
  if (!form.value.direccion?.trim()) errors.value.direccion = 'La dirección es requerida'
  if (!form.value.tipoResponsable) errors.value.tipoResponsable = 'Seleccione un tipo de solicitante'
  if (form.value.tipoResponsable === 5 || form.value.tipoResponsable === 2) {
    if (!form.value.identificacionRepresentante?.trim()) errors.value.identificacionRepresentante = 'La identificación del representante/apoderado es requerida'
    if (!form.value.nombreRepresentante?.trim()) errors.value.nombreRepresentante = 'El nombre del representante/apoderado es requerido'
  }
  if (!form.value.categoria) errors.value.categoria = 'Seleccione una categoría'
  if (!form.value.subcategoria) errors.value.subcategoria = 'Seleccione una subcategoría'
  if (subcategoriaSeleccionada.value?.incorporaexpediente && !form.value.expediente?.trim()) {
    errors.value.expediente = 'El número de expediente es requerido para esta subcategoría'
  }
  if (!form.value.descripcion?.trim()) errors.value.descripcion = 'La descripción es requerida'
  else if (form.value.descripcion.length > 2000) errors.value.descripcion = 'La descripción no puede exceder 2000 caracteres'

  if (Object.keys(errors.value).length > 0) {
    const firstErrorKey = Object.keys(errors.value)[0]
    const el = document.getElementById(firstErrorKey)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
  return Object.keys(errors.value).length === 0
}

function onArchivosUpdate(val) {
  archivosParaSubir.value = Array.isArray(val) ? val : []
}

function normalizarAdjuntosRespuesta(data) {
  if (!data) return []
  if (Array.isArray(data)) return data
  if (data.adjuntos && Array.isArray(data.adjuntos)) return data.adjuntos
  if (data.url || data.file_name) return [data]
  return []
}

async function handleAgregarAdjuntos() {
  if (!archivosParaSubir.value?.length) return

  const result = await agregarAdjuntos(route.params.id, archivosParaSubir.value)

  if (!result) {
    Swal.fire({
      icon: 'error',
      title: 'Error al subir archivos',
      text: apiError.value || 'No se pudieron subir los archivos. Intente nuevamente.',
      showConfirmButton: true
    })
    return
  }

  if (result.adjuntos && Array.isArray(result.adjuntos)) {
    solicitud.value = { ...solicitud.value, adjuntos: result.adjuntos }
  } else {
    const nuevos = normalizarAdjuntosRespuesta(result)
    if (nuevos.length) {
      solicitud.value.adjuntos = [...(solicitud.value.adjuntos || []), ...nuevos]
    }
  }
  archivosParaSubir.value = []
  Swal.fire({
    icon: 'success',
    title: 'Archivos subidos',
    text: 'Los archivos se han agregado correctamente.',
    showConfirmButton: true
  })
}

async function handleSubmit() {
  if (!validate()) return

  const payload = buildUpdatePayload()
  const result = await actualizarSolicitud(route.params.id, payload)

  if (!result) {
    Swal.fire({
      icon: 'error',
      title: 'Error al guardar',
      text: apiError.value || 'Ocurrió un error al actualizar la solicitud. Intente nuevamente.',
      showConfirmButton: true
    })
    return
  }

  const refreshed = await getSolicitud(route.params.id, false)
  if (refreshed) {
    solicitud.value = refreshed
    populateForm(refreshed)
  }
  Swal.fire({
    icon: 'success',
    title: 'Solicitud actualizada',
    text: 'Los cambios se han guardado correctamente.',
    showConfirmButton: true
  })
}

onMounted(async () => {
  const id = route.params.id
  if (!id) {
    error.value = true
    return
  }

  await Promise.all([
    getCategoriaDocumentos('oficina'),
    getTiposResponsable('oficina')
  ])

  const result = await getSolicitud(id, false)

  if (!result) {
    error.value = true
    return
  }

  solicitud.value = result
  populateForm(result)
})

watch(() => route.params.id, async (newId) => {
  if (!newId) return
  const result = await getSolicitud(newId, false)
  if (result) {
    solicitud.value = result
    populateForm(result)
    error.value = false
  } else {
    error.value = true
  }
})
</script>
