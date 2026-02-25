import { ref } from 'vue'

export const useSolicitudes = () => {
  const BASE_API_URL = import.meta.env.VITE_BASE_API_URL

  const solicitud = ref(null)
  const loading = ref(false)
  const apiError = ref('')

  const crearSolicitud = async (formData) => {
    apiError.value = null
    loading.value = true

    try {
      const response = await fetch(`${BASE_API_URL}/solicitudes`, {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (data.status === 'error') {
        apiError.value = data.message
        return null
      }

      return data.data || data
    } catch (error) {
      apiError.value = error.message
      return null
    } finally {
      loading.value = false
    }
  }

  const solicitarOTP = async (emailData) => {
    apiError.value = null
    loading.value = true

    try {
      const response = await fetch(`${BASE_API_URL}/ventanilla.php/solicitudes/otp/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData)
      })

      const data = await response.json()

      if (data.status === 'error') {
        apiError.value = data.message
        return null
      }

      return data.data || data
    } catch (error) {
      apiError.value = error.message
      return null
    } finally {
      loading.value = false
    }
  }

  const verificarOTP = async (otpData) => {
    apiError.value = null
    loading.value = true

    try {
      const response = await fetch(`${BASE_API_URL}/ventanilla.php/solicitudes/otp/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(otpData)
      })

      const data = await response.json()

      if (data.status === 'error') {
        apiError.value = data.message
        return null
      }

      return data.data || data
    } catch (error) {
      apiError.value = error.message
      return null
    } finally {
      loading.value = false
    }
  }

  const getSolicitud = async (id) => {
    apiError.value = null
    loading.value = true

    try {
      const response = await fetch(`${BASE_API_URL}/ventanilla.php/solicitudes/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      const data = await response.json()

      if (data.status === 'error') {
        apiError.value = data.message
        return null
      }

      solicitud.value = data.data || data
      return solicitud.value
    } catch (error) {
      apiError.value = error.message
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    solicitud,
    loading,
    apiError,
    crearSolicitud,
    solicitarOTP,
    verificarOTP,
    getSolicitud,
  }
}
