import { ref } from 'vue'
import { useAuth } from './useAuth';

export const useSolicitudes = () => {
  const BASE_API_URL = import.meta.env.VITE_BASE_API_URL

  const { token } = useAuth();
  const solicitud = ref(null)
  const solicitudes = ref({ solicitudes: [], pagination: {} })

  const loading = ref(false)
  const apiError = ref('')

  const crearSolicitud = async (formData, origen = '') => {
    apiError.value = null
    loading.value = true

    try {
      const url = origen ? `/${origen}` : ''
      const headers = origen === 'oficina' ? { Authorization: `Bearer ${token.value}` } : {}

      const response = await fetch(`${BASE_API_URL}/solicitudes${url}`, {
        method: 'POST',
        headers,
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

  const actualizarSolicitud = async (id, payload) => {
    apiError.value = null
    loading.value = true

    try {
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token.value}`
      }

      const response = await fetch(`${BASE_API_URL}/solicitudes/${id}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
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

  const solicitarOTP = async (emailData) => {
    apiError.value = null
    loading.value = true

    try {
      const response = await fetch(`${BASE_API_URL}/solicitudes/otp/request`, {
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
      const response = await fetch(`${BASE_API_URL}/solicitudes/otp/verify`, {
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

  const getSolicitud = async (id, usePublicToken = false) => {
    apiError.value = null
    loading.value = true

    try {
      let authToken = null
      let headers = null
      if (usePublicToken){
        authToken = sessionStorage.getItem('solicitud_token')
        headers = {
          'Content-Type': 'application/json',
          'X-Solicitud-Token': authToken,
        }
      } else {
        authToken = localStorage.getItem('token')
        headers = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        }
      }

      const response = await fetch(`${BASE_API_URL}/solicitudes/${id}`, {
        method: 'GET',
        headers: headers || {
          'Content-Type': 'application/json',
        }
      })

      const data = await response.json()

      if (data.status === 'error') {
        apiError.value = data.message
        solicitud.value = null
        // Si el token expiró, limpiar
        if (usePublicToken && data.message.includes('expirado')) {
          sessionStorage.removeItem('solicitud_token')
          sessionStorage.removeItem('solicitud_expires_at')
        }
        return null
      }

      solicitud.value = data.data || data
      return solicitud.value
    } catch (error) {
      apiError.value = error.message
      solicitud.value = null
      return null
    } finally {
      loading.value = false
    }
  }

  const asignacionesLoading = ref(false)

  const getUsuarios = async () => {
    apiError.value = null
    asignacionesLoading.value = true

    try {
      const response = await fetch(`${BASE_API_URL}/users`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.value}`,
        },
      })
      const data = await response.json()

      if (data.status === 'error') {
        apiError.value = data.message
        return []
      }

      const raw = data.data ?? data
      return Array.isArray(raw) ? raw : []
    } catch (error) {
      apiError.value = error.message
      return []
    } finally {
      asignacionesLoading.value = false
    }
  }

  /** POST /solicitudes/:id/asignaciones — un solo `user_id` por petición (flujo Agregar en UI). */
  const asignarUsuario = async (solicitudId, userId) => {
    if (userId == null || userId === '') return null

    apiError.value = null
    asignacionesLoading.value = true

    try {
      const response = await fetch(`${BASE_API_URL}/solicitudes/${solicitudId}/asignaciones`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.value}`,
        },
        body: JSON.stringify({ user_id: Number(userId) }),
      })
      const data = await response.json()

      if (data.status === 'error') {
        apiError.value = data.message
        return null
      }

      return data.data ?? data ?? true
    } catch (error) {
      apiError.value = error.message
      return null
    } finally {
      asignacionesLoading.value = false
    }
  }

  const desasignarUsuario = async (solicitudId, userId) => {
    apiError.value = null
    asignacionesLoading.value = true

    try {
      const response = await fetch(`${BASE_API_URL}/solicitudes/${solicitudId}/asignaciones/${userId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      })
      const text = await response.text()
      let data = {}
      if (text) {
        try {
          data = JSON.parse(text)
        } catch {
          apiError.value = 'Respuesta no valida del servidor'
          return false
        }
      }

      if (!response.ok) {
        apiError.value = data.message || `Error ${response.status}`
        return false
      }
      if (data.status === 'error') {
        apiError.value = data.message
        return false
      }

      return true
    } catch (error) {
      apiError.value = error.message
      return false
    } finally {
      asignacionesLoading.value = false
    }
  }

  const uploadAdjuntosLoading = ref(false)

  const agregarAdjuntos = async (id, files) => {
    if (!files?.length) return null

    apiError.value = null
    uploadAdjuntosLoading.value = true
    const fd = new FormData()
    files.forEach(file => fd.append('files[]', file))

    try {
      const response = await fetch(`${BASE_API_URL}/solicitudes/${id}/adjuntos`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token.value}` },
        body: fd
      })
      const data = await response.json()

      if (data.status === 'error') {
        apiError.value = data.message
        return null
      }

      apiError.value = null
      return data.data || data
    } catch (error) {
      apiError.value = error.message
      return null
    } finally {
      uploadAdjuntosLoading.value = false
    }
  }

  const editarComentario = async (solicitudId, comentarioId, contenido) => {
    apiError.value = null
    loading.value = true

    try {
      const response = await fetch(`${BASE_API_URL}/solicitudes/${solicitudId}/comentarios/${comentarioId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.value}`,
        },
        body: JSON.stringify({ contenido }),
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

  const eliminarComentario = async (solicitudId, comentarioId) => {
    apiError.value = null
    loading.value = true

    try {
      const response = await fetch(`${BASE_API_URL}/solicitudes/${solicitudId}/comentarios/${comentarioId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      })
      const data = await response.json()

      if (data.status === 'error') {
        apiError.value = data.message
        return false
      }

      return true
    } catch (error) {
      apiError.value = error.message
      return false
    } finally {
      loading.value = false
    }
  }

  const crearComentario = async (id, contenido) => {
    apiError.value = null
    loading.value = true

    try {
      const response = await fetch(`${BASE_API_URL}/solicitudes/${id}/comentarios`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.value}`,
        },
        body: JSON.stringify({ contenido }),
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

  const getSolicitudes = async (page = 1, pageSize = 10, search = '') => {
    apiError.value = null;
    loading.value = true;

    try {
      const url = new URL(`${BASE_API_URL}/solicitudes`);
      url.searchParams.append('page', page);
      url.searchParams.append('pageSize', pageSize);
      if (search) url.searchParams.append('search', search);

      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.value}`,
        },
      });

      const data = await response.json();

      if (data.status === 'error') {
        apiError.value = data.message
        return null
      }

      const items = data.data ?? []
      const raw = data.pagination ?? {}

      solicitudes.value = {
        solicitudes: Array.isArray(items) ? items : [],
        pagination: {
          current_page: raw.page ?? 1,
          total_pages: raw.totalPages ?? 1,
          total_items: raw.total ?? 0,
          item_init: ((raw.page ?? 1) - 1) * (raw.pageSize ?? 10) + 1,
          item_end: Math.min((raw.page ?? 1) * (raw.pageSize ?? 10), raw.total ?? 0),
        },
      }

      return solicitudes.value
    } catch (error) {
      apiError.value = error.message;
      return null;
    } finally {
      loading.value = false;
    }
  };

  return {
    solicitud,
    solicitudes,
    loading,
    apiError,
    asignacionesLoading,
    uploadAdjuntosLoading,
    crearSolicitud,
    actualizarSolicitud,
    agregarAdjuntos,
    crearComentario,
    editarComentario,
    eliminarComentario,
    solicitarOTP,
    verificarOTP,
    getSolicitud,
    getSolicitudes,
    getUsuarios,
    asignarUsuario,
    desasignarUsuario,
  }
}
