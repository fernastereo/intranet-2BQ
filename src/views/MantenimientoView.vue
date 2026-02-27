<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Contenido principal -->
    <main class="flex-1 flex items-center justify-center px-4 py-16">
      <div class="max-w-lg w-full text-center">
        <!-- Icono animado -->
        <div class="mx-auto mb-8 w-24 h-24 rounded-2xl bg-[#FFA800]/10 flex items-center justify-center">
          <svg class="w-12 h-12 text-[#FFA800] animate-pulse-slow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
          </svg>
        </div>

        <h1 class="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight text-balance mb-4">
          Sitio en mantenimiento
        </h1>

        <p class="text-lg text-gray-600 leading-relaxed text-pretty mb-8">
          Estamos realizando mejoras en el sistema para brindarle un mejor servicio. El portal estara disponible nuevamente en breve.
        </p>

        <!-- Tarjeta de informacion -->
        <div class="bg-white rounded-lg shadow-sm p-6 text-left mb-8">
          <div class="flex items-start gap-4">
            <div class="w-10 h-10 rounded-lg bg-blue-50 flex-shrink-0 flex items-center justify-center mt-0.5">
              <svg class="w-5 h-5 text-[#1A4972]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
            </div>
            <div>
              <h2 class="text-sm font-bold text-gray-900 mb-1">Tiempo estimado de inactividad</h2>
              <p class="text-sm text-gray-600 leading-relaxed">
                Se espera que el mantenimiento finalice el
                <strong class="text-gray-900">{{ fechaEstimada }}</strong>.
                Le pedimos disculpas por los inconvenientes.
              </p>
            </div>
          </div>
        </div>

        <!-- Barra de progreso decorativa -->
        <div class="mb-10">
          <div class="flex items-center justify-between text-xs text-gray-500 mb-2">
            <span>Progreso del mantenimiento</span>
            <span>{{ progreso }}%</span>
          </div>
          <div class="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
            <div
              class="h-full rounded-full bg-[#1A4972] transition-all duration-1000 ease-out"
              :style="{ width: progreso + '%' }"
            />
          </div>
        </div>

        <!-- Contacto alternativo -->
        <div class="rounded-xl border border-gray-300 bg-gray-100 p-5">
          <p class="text-sm text-gray-600 mb-4">
            Si necesita asistencia urgente, puede contactarnos a traves de:
          </p>
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="tel:+5551234567" class="inline-flex items-center gap-2 text-sm font-semibold text-[#1A4972] hover:text-blue-700 transition-colors">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              (605) 3566182
            </a>
            <span class="hidden sm:inline text-gray-300">|</span>
            <a href="mailto:soporte@permisos.gob" class="inline-flex items-center gap-2 text-sm font-semibold text-[#1A4972] hover:text-blue-700 transition-colors">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              info@curaduria2barranquilla.com
            </a>
          </div>
        </div>
      </div>
    </main>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const fechaEstimada = ref('02 de marzo de 2026, 14:00 hrs')
const progreso = ref(0)

let interval: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  // Animacion de la barra de progreso al montar
  setTimeout(() => {
    progreso.value = 65
  }, 300)

  // Simulacion sutil de progreso
  interval = setInterval(() => {
    if (progreso.value < 85) {
      progreso.value += 1
    }
  }, 8000)
})

onUnmounted(() => {
  if (interval) clearInterval(interval)
})
</script>

<style scoped>
@keyframes pulse-slow {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.animate-pulse-slow {
  animation: pulse-slow 3s ease-in-out infinite;
}
</style>
