<template>
  <div>
    <div id="pdf-content" class="w-[430px] text-sm border-1 rounded-lg p-2 mt-2 absolute top-0 left-[-1500px]">
      <!-- Encabezado -->
      <div class="inline-flex items-center gap-1 w-full mx-2">
        <img :src="data.configuracion.logoUrl" alt="Logo V.U." class="w-25 h-14 self-start shrink-0" />
        <div class="flex flex-col items-center justify-center">
          <p class="text-center text-xs uppercase font-bold">{{ data.configuracion.representante }}</p>
          <p class="text-center text-xs uppercase">{{ data.configuracion.nombreCuraduria }}</p>
          <p class="text-center text-xs uppercase font-bold">VENTANILLA UNICA V.U.</p>
          <p class="text-center text-xs uppercase font-bold">SELLO DE RADICACION DE DOCUMENTOS</p>
        </div>
      </div>

      <div class="px-8 mt-1">
        <!-- Separador -->
        <div class="w-full mt-2">
          <div class="w-full border-b-black border-b-1"></div>
        </div>

        <!-- Número de radicado -->
        <div class="inline-flex py-1 flex-col w-full gap-1">
          <div class="shrink-0 text-justify">
            <p class="text-xs">
              N° de Radicado: 
              <span class="font-semibold">
                {{ data.configuracion.prefijoVentanilla }}-{{ data.vigencia }}-{{ data.numerosolicitud?.toString().padStart(4, '0') }}
              </span>
            </p>
          </div>
          <div class="shrink-0 flex justify-between">
            <p class="text-xs">Fecha: <span class="font-semibold">{{ data.fecha }}</span></p>
            <p class="text-xs mr-8">Hora: <span class="font-semibold">{{ data.hora }}</span></p>
          </div>
        </div>

        <!-- Separador -->
        <div class="w-full mt-2">
          <div class="w-full border-b-black border-b-1"></div>
        </div>

        <!-- Datos del solicitante -->
        <div class="inline-flex py-1 flex-col w-full gap-1">
          <div class="shrink-0 text-justify">
            <p class="text-xs">Solicitante: <span class="font-semibold">{{ data.solicitante_nombre }}</span></p>
          </div>
          <div class="shrink-0 text-justify">
            <p class="text-xs">Identificacion: <span class="font-semibold">{{ data.solicitante_identificacion }}</span></p>
          </div>
        </div>

        <!-- Separador -->
        <div class="w-full mt-2">
          <div class="w-full border-b-black border-b-1"></div>
        </div>

        <!-- Folios, anexos y QR -->
        <div class="inline-flex justify-between py-1 w-full">
          <div class="shrink-0 text-justify flex flex-col gap-1">
            <p class="text-xs">Folios: <span class="font-semibold">{{ data.folios || '-' }}</span></p>
            <p class="text-xs">Anexos: <span class="font-semibold">{{ data.anexos || '-' }}</span></p>
            <p class="text-xs mt-10">
              {{ data.origen === 'web' ? 'Origen: ' : 'Recibido por: ' }}
              <span class="font-semibold">{{ data.origen === 'web' ? 'Vetanilla Web' : data.usuario_receptor }}</span>
            </p>
          </div>
          <div class="shrink-0 flex flex-col">
            <img v-if="data.qr_image" :src="data.qr_image" alt="Código QR de la solicitud" class="w-[100px]" />
          </div>
        </div>
      </div>
    </div>

    <!-- Botón de impresión -->
    <button 
      @click="handlePrint" 
      class="inline-flex items-center justify-center gap-2 rounded-lg bg-[#FFA800] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#e69700] transition-colors duration-200"
    >
      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="6 9 6 2 18 2 18 9" />
        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
        <rect x="6" y="14" width="12" height="8" />
      </svg>
      Imprimir Comprobante
    </button>
  </div>
</template>

<script setup>
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'


const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: () => ({
      numerosolicitud: '',
      vigencia: '',
      fecha: '',
      hora: '',
      solicitante_nombre: '',
      solicitante_identificacion: '',
      solicitante_email: '',
      folios: '',
      anexos: '',
      origen: '',
      usuario_receptor: '',
      qr_image: '',
      configuracion: {
        representante: '',
        nombreCuraduria: '',
        prefijoVentanilla: '',
        logoUrl: ''
      }
    })
  }
})

const handlePrint = async () => {
  const element = document.getElementById('pdf-content')
  if (!element) return

  const canvas = await html2canvas(element, {
    useCORS: true,
    scale: 2,
  })

  const imgData = canvas.toDataURL('image/png')

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'letter'
  })

  const fileName = `${props.data.configuracion.prefijoVentanilla }-${props.data.vigencia }-${props.data.numerosolicitud?.toString().padStart(4, '0') }.pdf`
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()

  // Convertir px a mm y aplicar escala del 70%
  const pxToMm = 0.264583
  const imgWidth = element.offsetWidth * pxToMm * 0.7
  const imgHeight = element.offsetHeight * pxToMm * 0.7

  // Posicionar en la esquina superior derecha con margen
  const margin = 10
  const x = pageWidth - imgWidth - margin
  const y = margin

  pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight)

  pdf.save(fileName)
}
</script>
