import { ref, onMounted } from 'vue'
import { useSolicitudes } from '@/shared/composables/useSolicitudes'
import { useTiposResponsable } from '@/shared/composables/useTiposResponsable'
import { useAuth } from '@/shared/composables/useAuth'
import Swal from 'sweetalert2'

export function useSolicitudEditForm(id) {
  const { user } = useAuth()
  const { tiposResponsable, getTiposResponsable } = useTiposResponsable()
  const {
    getSolicitud,
    actualizarSolicitud,
    agregarAdjuntos,
    loading,
    apiError,
  } = useSolicitudes()

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
    archivos: [],
    comentarios: [],
  })

  const errors = ref({})
  const requiereExpediente = ref(false)
  const loadingData = ref(true)
  const loadError = ref(false)
  const solicitudData = ref(null)

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
      archivos: [],
      comentarios: (s.comentarios ?? []).map(c => ({
        id: c.id,
        texto: c.contenido,
        autor: c.nombre,
        fecha: c.created_at,
      })),
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
      descripcion: form.value.descripcion,
    }
    if (solicitudData.value?.origen === 'oficina' && user.value?.id) {
      payload.usuario_receptor_id = user.value.id
    }
    return payload
  }

  const validate = () => {
    errors.value = {}

    if (!form.value.nombre?.trim()) errors.value.nombre = 'El nombre es requerido'
    if (!form.value.identificacion?.trim()) errors.value.identificacion = 'La identificación es requerida'
    if (!form.value.email?.trim()) errors.value.email = 'El correo electronico es requerido'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) errors.value.email = 'Ingrese un correo electronico valido'
    if (!form.value.telefono?.trim()) errors.value.telefono = 'El telefono es requerido'
    if (!form.value.direccion?.trim()) errors.value.direccion = 'La direccion es requerida'
    if (!form.value.tipoResponsable) errors.value.tipoResponsable = 'Seleccione un tipo de solicitante'
    if (form.value.tipoResponsable === 5 || form.value.tipoResponsable === 2) {
      if (!form.value.identificacionRepresentante?.trim()) errors.value.identificacionRepresentante = 'La identificación del representante/apoderado es requerida'
      if (!form.value.nombreRepresentante?.trim()) errors.value.nombreRepresentante = 'El nombre del representante/apoderado es requerido'
    }

    if (!form.value.categoria) errors.value.categoria = 'Seleccione una categoria'
    if (!form.value.subcategoria) errors.value.subcategoria = 'Seleccione una subcategoria'
    if (requiereExpediente.value && !form.value.expediente?.trim()) {
      errors.value.expediente = 'El número de expediente es requerido para esta subcategoría'
    }
    if (!form.value.descripcion?.trim()) errors.value.descripcion = 'La descripcion es requerida'
    else if (form.value.descripcion.length > 2000) errors.value.descripcion = 'La descripcion no puede exceder 2000 caracteres'

    if (Object.keys(errors.value).length > 0) {
      const firstErrorKey = Object.keys(errors.value)[0]
      const el = document.getElementById(firstErrorKey)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }

    return Object.keys(errors.value).length === 0
  }

  const handleUpdate = async () => {
    if (!validate()) return false

    try {
      const payload = buildUpdatePayload()
      const result = await actualizarSolicitud(id, payload)

      if (!result) {
        Swal.fire({
          icon: 'error',
          title: 'Error al guardar',
          text: apiError.value || 'Ocurrió un error al actualizar la solicitud. Intente nuevamente.',
          showConfirmButton: true,
        })
        return false
      }

      if (form.value.archivos?.length) {
        await agregarAdjuntos(id, form.value.archivos)
        form.value.archivos = []
      }

      const refreshed = await getSolicitud(id, false)
      if (refreshed) {
        solicitudData.value = refreshed
        populateForm(refreshed)
      }

      return true
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error al guardar',
        text: 'Ocurrió un error inesperado. Intente nuevamente. Error: ' + error.message,
        showConfirmButton: true,
      })
      return false
    }
  }

  onMounted(async () => {
    try {
      await getTiposResponsable('oficina')
      const result = await getSolicitud(id, false)

      if (!result) {
        loadError.value = true
        return
      }

      solicitudData.value = result
      populateForm(result)
    } catch {
      loadError.value = true
    } finally {
      loadingData.value = false
    }
  })

  return {
    form,
    errors,
    requiereExpediente,
    loadingData,
    loadError,
    loading,
    apiError,
    tiposResponsable,
    solicitudData,
    validate,
    handleUpdate,
  }
}
