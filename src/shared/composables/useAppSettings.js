import { ref, readonly } from 'vue'

// Estado global compartido
const settings = ref(null)
const loading = ref(false)
const error = ref(null)
const isInitialized = ref(false)

export const useAppSettings = () => {
  const BASE_API_URL = import.meta.env.VITE_BASE_API_URL

  /**
   * Obtiene la configuración de la aplicación desde el API
   * Solo se ejecuta una vez, las llamadas subsecuentes retornan los datos en caché
   */
  const fetchSettings = async (force = false) => {
    // Si ya está inicializado y no es forzado, retornar datos existentes
    if (isInitialized.value && !force) {
      return settings.value
    }

    // Si ya se está cargando, esperar
    if (loading.value) {
      return new Promise((resolve) => {
        const checkLoading = setInterval(() => {
          if (!loading.value) {
            clearInterval(checkLoading)
            resolve(settings.value)
          }
        }, 100)
      })
    }

    loading.value = true
    error.value = null

    try {
      const response = await fetch(`${BASE_API_URL}/settings`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      const data = await response.json()

      if (data.status === 'error') {
        error.value = data.message || 'Error al obtener la configuración'
        return null
      }
      // El API devuelve un array, tomamos el primer elemento
      if (data.data && data.data.length > 0) {
        settings.value = data.data[0]
        isInitialized.value = true
        
        // Guardar en sessionStorage como backup
        sessionStorage.setItem('app_settings', JSON.stringify(settings.value))
      } else {
        error.value = 'No se encontró configuración'
        return null
      }

      return settings.value
    } catch (err) {
      error.value = err.message || 'Error de conexión'
      
      // Intentar cargar desde sessionStorage como fallback
      const cached = sessionStorage.getItem('app_settings')
      if (cached) {
        try {
          settings.value = JSON.parse(cached)
          isInitialized.value = true
          return settings.value
        } catch (e) {
          // Si falla el parse, continuar con error
        }
      }
      
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * Limpia la configuración del estado y sessionStorage
   */
  const clearSettings = () => {
    settings.value = null
    isInitialized.value = false
    error.value = null
    sessionStorage.removeItem('app_settings')
  }

  /**
   * Recarga la configuración desde el API
   */
  const reloadSettings = async () => {
    clearSettings()
    return await fetchSettings()
  }

  return {
    // Estado (readonly para evitar mutaciones directas)
    settings: readonly(settings),
    loading: readonly(loading),
    error: readonly(error),
    isInitialized: readonly(isInitialized),

    // Métodos
    fetchSettings,
    clearSettings,
    reloadSettings,
  }
}
