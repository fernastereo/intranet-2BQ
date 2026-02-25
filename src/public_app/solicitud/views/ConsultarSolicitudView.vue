<template>
  <div class="bg-gray-50 min-h-screen">
    <!-- Page Header -->
    <div class="bg-gray-600">
      <div class="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-10">
        <router-link to="/" class="inline-flex items-center gap-1.5 text-sm text-blue-200 hover:text-white transition-colors mb-4">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Volver al inicio
        </router-link>
        <h1 class="text-3xl md:text-4xl font-bold text-white tracking-tight">Consultar Solicitud</h1>
        <p class="mt-2 text-blue-200">Ingrese los datos de su solicitud para verificar su estado.</p>
      </div>
    </div>

    <div class="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-8 -mt-4">
      <!-- Step 1: Lookup Form -->
      <div v-if="step === 'form'" class="bg-white rounded-lg shadow-sm p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-2">Datos de la Solicitud</h2>
        <p class="text-sm text-gray-600 mb-6">Ingrese los datos exactamente como fueron proporcionados al crear la solicitud.</p>

        <form @submit.prevent="handleSendOtp" novalidate class="flex flex-col gap-5">
          <!-- <form novalidate class="flex flex-col gap-5"> -->
          <div>
            <label for="numero" class="block text-sm font-medium text-gray-700 mb-1.5">Numero de Solicitud <span class="text-red-500">*</span></label>
            <input
              id="numero"
              v-model="consultaForm.numero"
              type="text"
              class="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A4972] focus:border-transparent transition-all font-mono"
              placeholder="SOL-XXXXXXX-XXXX"
              required
            />
            <p v-if="errors.numero" class="mt-1 text-xs text-red-500">{{ errors.numero }}</p>
          </div>

          <div>
            <label for="vigencia" class="block text-sm font-medium text-gray-700 mb-1.5">Vigencia <span class="text-red-500">*</span></label>
            <input
              id="vigencia"
              v-model="consultaForm.vigencia"
              type="date"
              class="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A4972] focus:border-transparent transition-all"
              required
            />
            <p v-if="errors.vigencia" class="mt-1 text-xs text-red-500">{{ errors.vigencia }}</p>
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1.5">Correo Electronico Registrado <span class="text-red-500">*</span></label>
            <input
              id="email"
              v-model="consultaForm.email"
              type="email"
              class="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A4972] focus:border-transparent transition-all"
              placeholder="correo@ejemplo.com"
              required
            />
            <p v-if="errors.email" class="mt-1 text-xs text-red-500">{{ errors.email }}</p>
          </div>

          <div v-if="errorMessage" class="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {{ errorMessage }}
          </div>

          <button type="submit" class="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1A4972] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#143a5c] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed w-full" :disabled="loading">
            <svg v-if="loading" class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" stroke-opacity="0.25" />
              <path d="M12 2a10 10 0 0 1 10 10" stroke-opacity="1" />
            </svg>
            <svg v-else class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            {{ loading ? 'Verificando...' : 'Enviar Codigo de Verificacion' }}
          </button>
        </form>

        <!-- Demo hint -->
        <div class="mt-6 rounded-xl bg-blue-50 border border-blue-200 p-4">
          <p class="text-xs font-semibold text-[#1A4972] mb-2">Datos de prueba (Demo):</p>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            <div>
              <span class="text-gray-500">Solicitud:</span>
              <button @click="fillDemo" class="font-mono text-[#1A4972] hover:underline ml-1">SOL-DEMO01-ABCD</button>
            </div>
            <div>
              <span class="text-gray-500">Vigencia:</span>
              <span class="font-mono text-gray-900 ml-1">2026-12-15</span>
            </div>
            <div>
              <span class="text-gray-500">Correo:</span>
              <span class="font-mono text-gray-900 ml-1">demo@ejemplo.com</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 2: OTP Verification -->
      <div v-else-if="step === 'otp'" class="bg-white rounded-lg shadow-sm p-6 text-center">
        <div class="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-6">
          <svg class="w-8 h-8 text-[#1A4972]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
        </div>

        <h2 class="text-xl font-bold text-gray-900 mb-2">Verificacion por Correo</h2>
        <p class="text-sm text-gray-600 mb-2">
          Se ha enviado un codigo de 6 digitos a <strong class="text-gray-900">{{ maskedEmail }}</strong>
        </p>
        <p class="text-xs text-[#FFA800] font-medium mb-8">
          (Demo: Revise la consola del navegador con F12 para ver el codigo)
        </p>

        <!-- <form @submit.prevent="handleVerifyOtp" class="max-w-sm mx-auto"> -->
          <form class="max-w-sm mx-auto">
          <div class="flex justify-center gap-2 mb-6">
            <!-- :ref="el => { if (el) otpInputRefs[index] = el as HTMLInputElement }" -->
            <input
              v-for="(_, index) in 6"
              :key="index"
              type="text"
              maxlength="1"
              inputmode="numeric"
              class="w-12 h-14 text-center text-xl font-bold rounded-lg border-2 transition-colors duration-200 focus:outline-none"
              :class="otpError ? 'border-red-300 bg-red-50 text-red-700' : 'border-gray-300 bg-white text-gray-900 focus:border-[#1A4972] focus:ring-2 focus:ring-[#1A4972]/20'"
              @input="handleOtpInput(index, $event)"
              @keydown="handleOtpKeydown(index, $event)"
              @paste="handleOtpPaste"
            />
          </div>

          <p v-if="otpError" class="text-sm text-red-500 mb-4">{{ otpError }}</p>

          <button type="submit" class="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1A4972] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#143a5c] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed w-full" :disabled="loading || otpCode.length < 6">
            <svg v-if="loading" class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" stroke-opacity="0.25" />
              <path d="M12 2a10 10 0 0 1 10 10" stroke-opacity="1" />
            </svg>
            {{ loading ? 'Verificando...' : 'Verificar Codigo' }}
          </button>

          <button type="button" @click="step = 'form'" class="mt-4 text-sm text-[#1A4972] hover:underline">
            Volver al formulario
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
// import { enviarOtp, verificarOtp } from '@/services/api'
// import type { Solicitud } from '@/types'

const router = useRouter()

const step = ref<'form' | 'otp'>('form')
const loading = ref(false)
const errorMessage = ref('')
const otpError = ref('')

const consultaForm = ref({
  numero: '',
  vigencia: '',
  email: ''
})

const errors = ref<Record<string, string>>({})
const otpInputRefs = ref<HTMLInputElement[]>([])
const otpDigits = ref<string[]>(['', '', '', '', '', ''])

const otpCode = computed(() => otpDigits.value.join(''))

const maskedEmail = computed(() => {
  const email = consultaForm.value.email
  const [user, domain] = email.split('@')
  if (!domain) return email
  const masked = user.substring(0, 2) + '***'
  return masked + '@' + domain
})

function fillDemo() {
  consultaForm.value = {
    numero: 'SOL-DEMO01-ABCD',
    vigencia: '2026-12-15',
    email: 'demo@ejemplo.com'
  }
}

function validateForm(): boolean {
  errors.value = {}
  if (!consultaForm.value.numero.trim()) errors.value.numero = 'El numero de solicitud es requerido'
  if (!consultaForm.value.vigencia) errors.value.vigencia = 'La vigencia es requerida'
  if (!consultaForm.value.email.trim()) errors.value.email = 'El correo electronico es requerido'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(consultaForm.value.email)) errors.value.email = 'Ingrese un correo valido'
  return Object.keys(errors.value).length === 0
}

async function handleSendOtp() {
  if (!validateForm()) return

  loading.value = true
  errorMessage.value = ''

  try {
    const result = { success: true, message: '' }
    // const result = await enviarOtp(consultaForm.value)

    if (result.success) {
      step.value = 'otp'
      otpDigits.value = ['', '', '', '', '', '']
      setTimeout(() => {
        otpInputRefs.value[0]?.focus()
      }, 100)
    } else {
      errorMessage.value = result.message
    }
  } catch {
    errorMessage.value = 'Ocurrio un error. Intente nuevamente.'
  } finally {
    loading.value = false
  }
}

function handleOtpInput(index: number, event: Event) {
  const input = event.target as HTMLInputElement
  const value = input.value.replace(/\D/g, '')
  otpDigits.value[index] = value
  input.value = value

  if (value && index < 5) {
    otpInputRefs.value[index + 1]?.focus()
  }
  otpError.value = ''
}

function handleOtpKeydown(index: number, event: KeyboardEvent) {
  if (event.key === 'Backspace' && !otpDigits.value[index] && index > 0) {
    otpInputRefs.value[index - 1]?.focus()
  }
}

function handleOtpPaste(event: ClipboardEvent) {
  event.preventDefault()
  const pasted = event.clipboardData?.getData('text')?.replace(/\D/g, '') || ''
  for (let i = 0; i < 6 && i < pasted.length; i++) {
    otpDigits.value[i] = pasted[i]
    if (otpInputRefs.value[i]) {
      otpInputRefs.value[i].value = pasted[i]
    }
  }
  const nextIdx = Math.min(pasted.length, 5)
  otpInputRefs.value[nextIdx]?.focus()
}

// We store the verified solicitud to pass via router state
// const verifiedSolicitud = ref<Solicitud | null>(null)

// async function handleVerifyOtp() {
//   if (otpCode.value.length < 6) return

//   loading.value = true
//   otpError.value = ''

//   try {
//     const result = await verificarOtp({
//       otp: otpCode.value,
//       email: consultaForm.value.email,
//       numero: consultaForm.value.numero
//     })

//     if (result.success && result.solicitud) {
//       verifiedSolicitud.value = result.solicitud
//       // Store in sessionStorage for the detail view
//       sessionStorage.setItem('solicitud_' + result.solicitud.numero, JSON.stringify(result.solicitud))
//       router.push({ name: 'detalle-solicitud', params: { numero: result.solicitud.numero } })
//     } else {
//       otpError.value = result.message || 'Codigo incorrecto. Intente nuevamente.'
//       otpDigits.value = ['', '', '', '', '', '']
//       otpInputRefs.value[0]?.focus()
//     }
//   } catch {
//     otpError.value = 'Ocurrio un error. Intente nuevamente.'
//   } finally {
//     loading.value = false
//   }
// }
</script>
