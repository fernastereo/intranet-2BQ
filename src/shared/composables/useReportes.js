import { ref } from 'vue'
import { useAuth } from './useAuth'

export const useReportes = () => {
  const BASE_API_URL = import.meta.env.VITE_BASE_API_URL
  const { token } = useAuth()

  const reporte = ref({ solicitudes: [], pagination: {}, resumen: {} })
  const loading = ref(false)
  const exportLoading = ref(false)
  const apiError = ref('')

  const buildParams = (filters = {}, page = 1, pageSize = 10) => {
    const params = new URLSearchParams()
    params.append('page', page)
    params.append('pageSize', pageSize)

    if (filters.fecha_desde) params.append('fecha_desde', filters.fecha_desde)
    if (filters.fecha_hasta) params.append('fecha_hasta', filters.fecha_hasta)
    filters.estado?.forEach(id => params.append('estado[]', id))
    if (filters.categoria) params.append('categoria_id', filters.categoria)
    if (filters.subcategoria) params.append('subcategoria_id', filters.subcategoria)
    filters.asignado?.forEach(id => params.append('asignado[]', id))
    if (filters.numero) params.append('numero', filters.numero)
    if (filters.solicitante) params.append('solicitante', filters.solicitante)
    if (filters.direccion) params.append('direccion', filters.direccion)
    if (filters.identificacion) params.append('identificacion', filters.identificacion)

    return params
  }

  const getReporteSolicitudesRecibidas = async (filters = {}, page = 1, pageSize = 10) => {
    apiError.value = null
    loading.value = true

    try {
      const params = buildParams(filters, page, pageSize)
      const response = await fetch(`${BASE_API_URL}/reportes/solicitudes-recibidas?${params}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.value}`,
        },
      })
      const data = await response.json()

      if (data.status === 'error') {
        apiError.value = data.message
        return null
      }

      const items = data.data ?? []
      const raw = data.pagination ?? {}

      reporte.value = {
        solicitudes: Array.isArray(items) ? items : [],
        resumen: data.resumen ?? {},
        pagination: {
          current_page: raw.page ?? 1,
          total_pages: raw.totalPages ?? 1,
          total_items: raw.total ?? 0,
          item_init: ((raw.page ?? 1) - 1) * (raw.pageSize ?? pageSize) + 1,
          item_end: Math.min((raw.page ?? 1) * (raw.pageSize ?? pageSize), raw.total ?? 0),
        },
      }

      return reporte.value
    } catch (error) {
      apiError.value = error.message
      return null
    } finally {
      loading.value = false
    }
  }

  const exportarReporteSolicitudesRecibidas = async (filters = {}, formato = 'excel') => {
    apiError.value = null
    exportLoading.value = true

    try {
      const params = buildParams(filters, 1, 0)
      params.set('format', formato)

      const response = await fetch(`${BASE_API_URL}/reportes/solicitudes-recibidas?${params}`, {
        headers: { Authorization: `Bearer ${token.value}` },
      })

      if (!response.ok) {
        apiError.value = `Error ${response.status} al exportar el reporte`
        return false
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      const extension = formato === 'pdf' ? 'pdf' : 'xlsx'

      link.href = url
      link.download = `reporte-solicitudes-recibidas.${extension}`
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)

      return true
    } catch (error) {
      apiError.value = error.message
      return false
    } finally {
      exportLoading.value = false
    }
  }

  return {
    reporte,
    loading,
    exportLoading,
    apiError,
    getReporteSolicitudesRecibidas,
    exportarReporteSolicitudesRecibidas,
  }
}
