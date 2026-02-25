<template>
  <div>
    <!-- Hero Section -->
    <section class="relative bg-gray-600 overflow-hidden">
      <div class="absolute inset-0 opacity-10">
        <div class="absolute inset-0"></div>
      </div>
      <div class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div class="max-w-3xl">
          <div class="inline-flex items-center gap-2 rounded-full bg-[#FFA800]/20 px-4 py-1.5 text-sm font-medium text-[#FFC04D] mb-6">
            <span class="w-2 h-2 rounded-full bg-[#FFA800] animate-pulse"></span>
            Portal de Trámites en Línea
          </div>
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight">
            Ventanilla Unica de Radicación y Servicios
          </h1>
          <p class="mt-6 text-lg md:text-xl text-blue-200 leading-relaxed max-w-2xl">
            Realice sus tramites de radicación y solicitud de servicios de forma rápida y segura a través de nuestro portal digital. Presente su solicitud y haga seguimiento en linea.
          </p>
          <div class="mt-10 flex flex-col sm:flex-row gap-4">
            <router-link to="/nueva-solicitud" class="inline-flex items-center justify-center gap-2 rounded-lg bg-[#FFA800] px-8 py-4 text-base font-semibold text-white transition-all duration-200 hover:bg-[#E69500] shadow-lg">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="12" y1="18" x2="12" y2="12" />
                <line x1="9" y1="15" x2="15" y2="15" />
              </svg>
              Nueva Solicitud
            </router-link>
            <router-link to="/consultar" class="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-blue-300 bg-transparent px-8 py-4 text-base font-semibold text-white transition-all duration-200 hover:bg-[#1A4972]/50">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              Consultar Solicitud
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-16 md:py-24 bg-gray-50">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            Un proceso simple y transparente
          </h2>
          <p class="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Nuestro portal digital facilita cada paso del proceso de radicaciones y solicitudes de servicios.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="bg-white rounded-lg p-6 shadow-sm group hover:shadow-md transition-shadow duration-300">
            <div class="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-5 group-hover:bg-blue-100 transition-colors">
              <svg class="w-6 h-6 text-[#1A4972]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">1. Presente su Solicitud</h3>
            <p class="text-gray-600 text-sm leading-relaxed">
              Complete el formulario en linea con sus datos personales, información de su solicitud y anexe documentos.
            </p>
          </div>

          <div class="bg-white rounded-lg p-6 shadow-sm group hover:shadow-md transition-shadow duration-300">
            <div class="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-5 group-hover:bg-blue-100 transition-colors">
              <svg class="w-6 h-6 text-[#1A4972]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">2. Revisión Jurídica / Técnica</h3>
            <p class="text-gray-600 text-sm leading-relaxed">
              Nuestro equipo de profesionales revisará su solicitud y la documentación adjunta.
            </p>
          </div>

          <div class="bg-white rounded-lg p-6 shadow-sm group hover:shadow-md transition-shadow duration-300">
            <div class="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-5 group-hover:bg-blue-100 transition-colors">
              <svg class="w-6 h-6 text-[#1A4972]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">3. Obtenga su Respuesta</h3>
            <p class="text-gray-600 text-sm leading-relaxed">
              Reciba la respuesta a su solicitud y descargue su documento de respuesta.
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>

</script>
