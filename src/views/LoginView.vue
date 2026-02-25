<template>
  <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <img class="mx-auto h-50 w-auto" src="@/assets/logo.png" alt="Curaduria Urbana 2 Barranquilla" />
      <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Conectese a su cuenta</h2>
    </div>
    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form class="space-y-6" @submit.prevent="handleLogin">
        <div>
          <label for="username" class="block text-sm/6 font-medium text-gray-900">Usuario</label>
          <div class="mt-2">
            <input 
              v-model="username"
              type="text" 
              name="username" 
              id="username" 
              required
              class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              :class="{ 'outline-red-500': errors.username}" />
            <p v-if="errors.username" class="mt-1 text-xs text-red-600">{{ errors.username }}</p>
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between">
            <label for="password" class="block text-sm/6 font-medium text-gray-900">Password</label>
            <div class="text-sm">
              <a href="#" class="font-semibold text-indigo-600 hover:text-indigo-500">Olvidó su password?</a>
            </div>
          </div>
          <div class="mt-2">
            <input 
              v-model="password"
              type="password" 
              name="password" 
              id="password" 
              autocomplete="current-password" 
              required 
              class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              :class="{ 'outline-red-500': errors.password}" />
            <p v-if="errors.password" class="mt-1 text-xs text-red-600">{{ errors.password }}</p>
          </div>
        </div>

        <div v-if="loginError" class="p-3 bg-red-100 text-red-700 rounded-md text-xs">
          {{ auth.authError }}
        </div>

        <div>
          <button 
            type="submit" 
            class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            :disabled="isLoading"
          >
            <span v-if="isLoading">Cargando . . . </span>
            <span v-else>Inicio de Sesión</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
<script setup>
  import { ref, reactive } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuth } from '@/shared/composables/useAuth'

  const router = useRouter()
  const auth = useAuth()

  const username = ref('')
  const password = ref('')
  const errors = reactive({
    username: false,
    password: false
  })

  const loginError = ref('')
  const isLoading = ref(false)

  //validacion del formulario
  const validateForm = () => {
    let isValid = true
    errors.username = ''
    errors.password = ''

    //validacion del email
    if (!username.value) {
      errors.username = 'El uusario es requerido'
      isValid = false
    }

    //validacion del password
    if (!password.value) {
      errors.password = 'El password es requerido';
      isValid = false;
    } else if (password.value.length < 6) {
      errors.password = 'El password debe tener al menos 6 caracteres';
      isValid = false;
    }

    return isValid
  }

  const handleLogin = async () => {
    if (!validateForm()) return

    isLoading.value = true
    loginError.value = ''

    const credentials = {
      username: username.value,
      password: password.value
    }

    const success = await auth.login(credentials)

    if (success) {
      router.push({ name: 'home' })
      return
    }

    loginError.value = auth.authError
    isLoading.value = false
  }
</script>
<style scoped>
  
</style>