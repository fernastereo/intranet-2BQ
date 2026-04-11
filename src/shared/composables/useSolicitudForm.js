import { ref, computed, onMounted } from 'vue'
import { useSolicitudes } from '@/shared/composables/useSolicitudes'
import { useAppSettings } from '@/shared/composables/useAppSettings'
import { useTiposResponsable } from '@/shared/composables/useTiposResponsable'
import { useAuth } from '@/shared/composables/useAuth'
import Swal from 'sweetalert2'

export function useSolicitudForm(origen) {
  const { user } = useAuth()
  const { settings } = useAppSettings()
  const { tiposResponsable, getTiposResponsable } = useTiposResponsable()
  const { crearSolicitud, loading, apiError } = useSolicitudes()

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
    archivos: []
  })

  const errors = ref({})
  const submitted = ref(false)
  const requiereExpediente = ref(false)

  const resultData = ref({
    fecha: '',
    hora: '',
    numerosolicitud: '',
    vigencia: '',
    qr_image: '',
    origen: '',
    solicitante_nombre: '',
    solicitante_email: '',
    solicitante_identificacion: '',
    usuario_receptor: '',
    configuracion: {
      representante: '',
      nombreCuraduria: '',
      prefijoVentanilla: '',
      logoUrl: ''
    }
  })

  const configuracion = computed(() => {
    const encargadoProvisional = settings.value?.encargado === 1 ? '(E)' : settings.value?.provisional === 1 ? '(P)' : ''
    return {
      representante: settings.value?.representante || '',
      nombreCuraduria: `${settings.value?.nombre} ${encargadoProvisional}` || '',
      prefijoVentanilla: settings.value?.prefijo_ventanilla || '',
      logoUrl: `/src/assets/${settings.value?.logo}`
    }
  })

  const buildFormData = (formData) => {
    const fd = new FormData()
    fd.append('solicitante_nombre', formData.nombre)
    fd.append('solicitante_email', formData.email)
    fd.append('solicitante_identificacion', formData.identificacion)
    fd.append('representante_identificacion', formData.identificacionRepresentante)
    fd.append('representante_nombre', formData.nombreRepresentante)
    fd.append('representante_tipo', formData.tipoResponsable)
    fd.append('telefono', formData.telefono)
    fd.append('direccion', formData.direccion)
    fd.append('categoria_id', formData.categoria)
    fd.append('subcategoria_id', formData.subcategoria)
    fd.append('expediente', formData.expediente)
    fd.append('folios', formData.folios)
    fd.append('anexos', formData.anexos)
    fd.append('descripcion', formData.descripcion)
    if (origen === 'oficina') {
      fd.append('usuario_receptor_id', user.value)
    }
    if (formData.archivos?.length) {
      formData.archivos.forEach(file => fd.append('files[]', file))
    }
    return fd
  }

  const validate = () => {
    errors.value = {}

    if (!form.value.nombre.trim()) errors.value.nombre = 'El nombre es requerido'
    if (!form.value.identificacion.trim()) errors.value.identificacion = 'La identificación es requerida'
    if (!form.value.email.trim()) errors.value.email = 'El correo electronico es requerido'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) errors.value.email = 'Ingrese un correo electronico valido'
    if (!form.value.telefono.trim()) errors.value.telefono = 'El telefono es requerido'
    if (!form.value.direccion.trim()) errors.value.direccion = 'La direccion es requerida'
    if (!form.value.tipoResponsable) errors.value.tipoResponsable = 'Seleccione un tipo de solicitante'
    if (form.value.tipoResponsable === 5 || form.value.tipoResponsable === 2) {
      if (!form.value.identificacionRepresentante.trim()) errors.value.identificacionRepresentante = 'La identificación del representante/apoderado es requerida'
      if (!form.value.nombreRepresentante.trim()) errors.value.nombreRepresentante = 'El nombre del representante/apoderado es requerido'
    }

    if (!form.value.categoria) errors.value.categoria = 'Seleccione una categoria'
    if (!form.value.subcategoria) errors.value.subcategoria = 'Seleccione una subcategoria'
    if (requiereExpediente.value && !form.value.expediente?.trim()) {
      errors.value.expediente = 'El número de expediente es requerido para esta subcategoría'
    }
    if (!form.value.descripcion.trim()) errors.value.descripcion = 'La descripcion es requerida'
    else if (form.value.descripcion.length > 2000) errors.value.descripcion = 'La descripcion no puede exceder 2000 caracteres'

    if (Object.keys(errors.value).length > 0) {
      const firstErrorKey = Object.keys(errors.value)[0]
      const el = document.getElementById(firstErrorKey)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }

    return Object.keys(errors.value).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return

    try {
      const formData = buildFormData(form.value)
      const result = await crearSolicitud(formData, origen)

      if (!result) {
        Swal.fire({
          icon: 'error',
          title: 'Error al enviar la solicitud',
          text: apiError.value || 'Ocurrió un error al enviar la solicitud. Intente nuevamente.',
          showConfirmButton: true
        })
        return
      }

      resultData.value = {
        numerosolicitud: result.numerosolicitud,
        vigencia: result.vigencia,
        fecha: result.fecha,
        hora: result.hora,
        solicitante_nombre: result.solicitante_nombre,
        solicitante_identificacion: result.solicitante_identificacion,
        solicitante_email: result.solicitante_email,
        folios: result.folios,
        anexos: result.anexos,
        origen: result.origen,
        usuario_receptor: result.usuario_receptor,
        qr_image: result.qr_image,
        configuracion: configuracion.value
      }

      submitted.value = true
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error al enviar la solicitud',
        text: 'Ocurrió un error al enviar la solicitud. Intente nuevamente. Error: ' + error.message,
        showConfirmButton: true
      })
    }
  }

  const resetForm = () => {
    form.value = {
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
      archivos: []
    }
    errors.value = {}
    submitted.value = false
  }

  onMounted(async () => {
    await getTiposResponsable(origen)
  })

  return {
    form,
    errors,
    submitted,
    resultData,
    requiereExpediente,
    configuracion,
    tiposResponsable,
    loading,
    apiError,
    validate,
    handleSubmit,
    buildFormData,
    resetForm,
  }
}
