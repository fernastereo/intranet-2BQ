import { onMounted, onUnmounted } from 'vue'
import Swal from 'sweetalert2'
import { useAuth } from './useAuth'

const INACTIVITY_LIMIT_MS = 45 * 60 * 1000   // 45 minutos
const WARNING_BEFORE_MS   =  2 * 60 * 1000   // aviso 2 minutos antes
const TOKEN_REFRESH_MS    = 55 * 60 * 1000   // renovar token cada 55 minutos

export const useSessionTimeout = ({ onTimeout }) => {
  const { refreshToken } = useAuth()

  let inactivityTimer  = null
  let warningTimer     = null
  let heartbeatTimer   = null
  let warningDisplayed = false

  // ─── Reinicia ambos timers ────────────────────────────────────────────────
  const resetTimers = () => {
    // Si el aviso ya está en pantalla, ignorar actividad del mouse/teclado
    // para no cerrarlo por un movimiento accidental mientras el usuario lee
    if (warningDisplayed) return

    clearTimeout(inactivityTimer)
    clearTimeout(warningTimer)

    // Timer 1: a los 43 min → mostrar aviso
    warningTimer = setTimeout(showWarning, INACTIVITY_LIMIT_MS - WARNING_BEFORE_MS)

    // Timer 2: a los 45 min → cerrar sesión (fallback si el usuario ignora el aviso)
    inactivityTimer = setTimeout(forceLogout, INACTIVITY_LIMIT_MS)
  }

  // ─── Muestra aviso con cuenta regresiva ──────────────────────────────────
  const showWarning = () => {
    warningDisplayed = true

    let secondsLeft = WARNING_BEFORE_MS / 1000  // 120 segundos

    Swal.fire({
      title: 'Sesión a punto de expirar',
      html: `Tu sesión se cerrará por inactividad en <strong>${secondsLeft}</strong> segundos.`,
      icon: 'warning',
      confirmButtonText: 'Continuar sesión',
      confirmButtonColor: '#1A4972',
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        // Actualizar el contador cada segundo dentro del modal
        const interval = setInterval(() => {
          secondsLeft--
          const html = Swal.getHtmlContainer()
          if (html) {
            html.querySelector('strong').textContent = secondsLeft
          }
          if (secondsLeft <= 0) clearInterval(interval)
        }, 1000)

        // Guardar referencia para limpiar si el usuario confirma
        Swal._sessionInterval = interval
      },
      willClose: () => {
        clearInterval(Swal._sessionInterval)
      }
    }).then((result) => {
      warningDisplayed = false
      if (result.isConfirmed) {
        // Usuario eligió continuar — reiniciar timers desde cero
        resetTimers()
      }
      // Si no confirmó (el timer de 45 min ya habrá llamado forceLogout)
    })
  }

  // ─── Cierre de sesión por inactividad ────────────────────────────────────
  const forceLogout = () => {
    Swal.close()
    warningDisplayed = false
    clearInterval(heartbeatTimer)
    onTimeout()
  }

  // ─── Heartbeat: renueva el token cada 55 min independientemente ──────────
  const startHeartbeat = () => {
    clearInterval(heartbeatTimer)
    heartbeatTimer = setInterval(async () => {
      const ok = await refreshToken()
      if (!ok) {
        clearInterval(heartbeatTimer)
        forceLogout()
      }
    }, TOKEN_REFRESH_MS)
  }

  // ─── Eventos que se consideran actividad del usuario ─────────────────────
  const ACTIVITY_EVENTS = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart']

  const handleActivity = () => resetTimers()

  // ─── Lifecycle ───────────────────────────────────────────────────────────
  onMounted(() => {
    ACTIVITY_EVENTS.forEach(event =>
      window.addEventListener(event, handleActivity, { passive: true })
    )
    resetTimers()
    startHeartbeat()
  })

  onUnmounted(() => {
    ACTIVITY_EVENTS.forEach(event =>
      window.removeEventListener(event, handleActivity)
    )
    clearTimeout(inactivityTimer)
    clearTimeout(warningTimer)
    clearInterval(heartbeatTimer)
    Swal.close()
  })
}
