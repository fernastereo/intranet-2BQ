// Estados válidos de solicitudes (orden del flujo)
export const ESTADOS_SOLICITUD = [
  'Recibido',
  'Area Jurídica',
  'Area Técnica',
  'Area Administrativa',
  'Proyectando Respuesta',
  'Respuesta Generada'
]

export const ESTADOS_LABEL = {
  recibido: 'Recibido',
  area_juridica: 'Area Jurídica',
  area_tecnica: 'Area Técnica',
  area_administrativa: 'Area Administrativa',
  proyectando_respuesta: 'Proyectando Respuesta',
  respuesta_generada: 'Respuesta Generada'
}

export const ESTADOS_COLOR = {
  recibido: 'bg-blue-100 text-blue-800',
  area_juridica: 'bg-indigo-100 text-indigo-800',
  area_tecnica: 'bg-cyan-100 text-cyan-800',
  area_administrativa: 'bg-amber-100 text-amber-800',
  proyectando_respuesta: 'bg-orange-100 text-orange-800',
  respuesta_generada: 'bg-green-100 text-green-800'
}
