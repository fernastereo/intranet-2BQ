# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev                # dev server
npm run build              # build default
npm run build:staging      # copia .htaccess.staging y build con --mode staging
npm run build:prod         # copia .htaccess.production y build con --mode production
npm run test:unit          # vitest (todos los tests)
npx vitest run <file>      # un solo archivo de test
```

## Variables de entorno

Tres archivos: `.env`, `.env.staging`, `.env.production`.

| Variable | Descripción |
|---|---|
| `VITE_BASE_API_URL` | Endpoint del backend PHP (`ventanilla.php`) |
| `VITE_BASE_URL` | Base path de Vite (ej. `/`, `/ventanilla/`) |
| `VITE_AWS_URL` | URL S3 para assets estáticos |
| `VITE_DEPLOY_SERVER` | Identificador del servidor destino |

## Arquitectura general

SPA Vue 3 + Vite con **dos sub-aplicaciones** que comparten router, composables y componentes:

| Sub-app | Ruta base | Auth | Código |
|---|---|---|---|
| Portal público (ciudadanos) | `/` | No requerida | `src/public_app/` |
| Intranet administrativa | `/home` | Requerida | `src/private_app/` |

El router usa `createWebHashHistory`. Las rutas protegidas llevan `meta: { requiresAuth: true }`. El guard en `src/router/index.js` llama `checkAuth()` y usa una flag `isCheckingAuth` para prevenir loops de redirección.

---

## Sub-app Pública (`src/public_app/`)

Layout raíz: `VentanillaPublicView` → Navbar + `<RouterView>` + Footer.

### Rutas y componentes

| Ruta | Componente | Descripción |
|---|---|---|
| `/` | `ventanilla/views/VentanillaPublicView.vue` (layout) + `ventanilla/components/VentanillaBody.vue` | Landing con hero y 3 pasos |
| `/nueva-solicitud` | `solicitud/views/NuevaSolicitudView.vue` | Formulario de nueva solicitud |
| `/consultar` | `solicitud/views/ConsultarSolicitudView.vue` | Búsqueda por OTP |
| `/solicitud/:solicitud_id` | `solicitud/views/DetalleSolicitudView.vue` | Detalle con token público |

### Flujo ciudadano — Nueva Solicitud

1. Formulario en 3 secciones: Solicitante / Solicitud / Documentos (`FileUpload`)
2. Submit → `useSolicitudes.crearSolicitud()` → POST `/solicitudes` (multipart FormData)
3. Respuesta: `numerosolicitud`, `vigencia`, `qr_image`
4. Pantalla de éxito con `Sticker.vue` → genera PDF comprobante con `html2canvas` + `jsPDF`

### Flujo ciudadano — Consultar Solicitud (OTP)

1. Paso 1: número + vigencia + email → `useSolicitudes.solicitarOTP()` → POST `/solicitudes/otp/request`
2. Paso 2: código 6 dígitos (auto-foco, paste) → `useSolicitudes.verificarOTP()` → POST `/solicitudes/otp/verify`
3. Backend retorna `solicitud_token` → se guarda en `sessionStorage['solicitud_token']`
4. Redirect a `/solicitud/:id`

### Flujo ciudadano — Detalle Solicitud

- Lee token de `sessionStorage` y lo envía como header `X-Solicitud-Token`
- Renderiza con `DataField.vue` (label-valor), `TimelineItem.vue` (comentarios), `Badge` (estado coloreado)
- Si el token expiró, limpia sessionStorage

---

## Sub-app Intranet (`src/private_app/`)

Layout raíz: `private_app/layout/wrapper/PrivateLayout.vue` → sidebar colapsable (HeadlessUI) + `<RouterView>`.

### Estructura de carpetas

```
src/private_app/
  auth/
    LoginView.vue                        ← ruta /login
  layout/
    wrapper/
      PrivateLayout.vue                  ← layout con sidebar (MenuItems + RouterView)
    components/
      MenuItems.vue
      ActiveUser.vue
  dashboard/
    wrapper/
      DashboardView.vue                  [placeholder]
  reportes/
    wrapper/
      ReportesView.vue                   [placeholder]
  turnos/
    wrapper/
      TurnosView.vue                     ← shell de subruta (<RouterView />)
    views/
      TurnosList.vue                     ← lista paginada con búsqueda
      TurnosForm.vue                     ← crear/editar turno (multi-tab, provide/inject)
    components/
      TurnosTable.vue                    ← tabla de expedientes
      VentanillaForm.vue                 ← tab: info básica + PersonRegistration
      FormularioForm.vue                 ← tab: tipo licencia + modalidades
      DocumentacionForm.vue              [placeholder]
      NotasForm.vue                      [placeholder]
      PreliquidacionForm.vue             [placeholder]
      SupervisionForm.vue                [placeholder]
      PreradicacionForm.vue              [placeholder]
    shared/components/
      TurnoTitle.vue                     ← título con badge de estado
      PersonRegistration.vue             ← sub-formulario v-model sobre array de responsables
      ActionButtons.vue                  ← botones Cancelar / Guardar
      MobileTabSelector.vue              ← selector de tab en móvil (select)
      DesktopTabNavigation.vue           ← navegación de tabs en escritorio
  ventanilla/
    wrapper/
      VentanillaView.vue                 ← shell de subruta (<RouterView />)
    views/
      VentanillaList.vue                 [placeholder]
      VentanillaForm.vue                 [placeholder]
```

### Rutas y componentes

| Ruta | Componente | Estado |
|---|---|---|
| `/login` | `auth/LoginView.vue` | Funcional |
| `/home` | `dashboard/wrapper/DashboardView.vue` | Placeholder |
| `/home/dashboard` | redirect → `home` | — |
| `/home/turnos` | `turnos/wrapper/TurnosView.vue` + `turnos/views/TurnosList.vue` | Funcional |
| `/home/turnos/nuevo` | `turnos/views/TurnosForm.vue` | Funcional |
| `/home/turnos/editar/:id` | `turnos/views/TurnosForm.vue` | Funcional |
| `/home/ventanilla` | `ventanilla/wrapper/VentanillaView.vue` + `ventanilla/views/VentanillaList.vue` | Placeholder |
| `/home/ventanilla/nuevo` | `ventanilla/views/VentanillaForm.vue` | Placeholder |
| `/home/ventanilla/editar/:id` | `ventanilla/views/VentanillaForm.vue` | Placeholder |
| `/home/reportes` | `reportes/wrapper/ReportesView.vue` | Placeholder |

### TurnosForm — patrón provide/inject

`TurnosForm.vue` es el formulario central con múltiples tabs. Usa `provide` para compartir estado entre tabs hijos:

```
TurnosForm (provide)
  ├── turnoData          ← estado central de todo el formulario
  ├── updateTurnoData()  ← función para que cada tab actualice su porción
  └── registerSubmit()   ← cada tab registra su función de submit

Tabs (inject) — ubicados en turnos/components/:
  ├── VentanillaForm     → info básica (fecha, número, dirección) + PersonRegistration
  ├── FormularioForm     → tipo licencia + modalidades (useTiposLicencia, useObjetosLicencia)
  ├── DocumentacionForm  [placeholder]
  ├── NotasForm          [placeholder]
  ├── PreliquidacionForm [placeholder]
  ├── SupervisionForm    [placeholder]
  └── PreradicacionForm  [placeholder]
```

`PersonRegistration.vue` es un sub-componente complejo (v-model sobre array) que gestiona responsables. Está en `turnos/shared/components/`. Usa `useTiposDocumento` y `useTiposResponsable` para los dropdowns, y mapea IDs a labels para mostrar.

---

## Capa de autenticación

`useAuth.js` tiene **estado singleton a nivel de módulo** (los `ref` están fuera de la función, se comparten entre todos los componentes que llamen al composable):

```js
// Estado compartido globalmente:
const token = ref(localStorage.getItem('token') || null)
const user  = ref(JSON.parse(localStorage.getItem('user')) || null)
```

| Método | Endpoint | Notas |
|---|---|---|
| `login(credentials)` | POST `/login` | Guarda token + user en localStorage |
| `logout()` | POST `/logout` | Limpia localStorage |
| `checkAuth()` | GET `/verify-token` | Solo limpia local si falla, NO llama logout (evita loops) |
| `getUser()` | GET `/user` | Usado por `ActiveUser.vue` |

---

## Composables (`src/shared/composables/`)

Todos siguen el mismo patrón: `loading`, `apiError`, función async con fetch, respuesta `{ status, data, message }`.

| Composable | Endpoints | Auth |
|---|---|---|
| `useAppSettings` | GET `/settings` | Sin auth. Singleton: caché en `sessionStorage`. Inicializado en `App.vue` `onMounted`. |
| `useAuth` | `/login`, `/logout`, `/verify-token`, `/user` | — |
| `useTurnos` | CRUD `/expedientes`, POST `/expediente-formulario/:id` | Bearer token |
| `useSolicitudes` | POST `/solicitudes`, GET `/solicitudes/:id`, OTP endpoints | Dual: Bearer ó `X-Solicitud-Token` |
| `useTiposDocumento` | GET `/tipos-documento` | Bearer token |
| `useTiposLicencia` | GET `/tipos-licencia` | Bearer token |
| `useTiposResponsable` | GET `/tipos-responsable` | Bearer token |
| `useObjetosLicencia` | GET `/objetos-licencia` | Bearer token |
| `useCategoriaDocumentos` | GET `/categorias-documentos` | Bearer token. Subcategorías resueltas localmente. |

**Importante:** `useAppSettings` y `useAuth` son singletons (estado a nivel módulo). El resto instancia estado nuevo en cada componente que los invoca.

### Dual-token en useSolicitudes

```js
getSolicitud(id, usePublicToken = false)
// usePublicToken = false  →  Authorization: Bearer <localStorage token>
// usePublicToken = true   →  X-Solicitud-Token: <sessionStorage solicitud_token>
```

---

## Componentes compartidos (`src/shared/components/`)

Los componentes compartidos están organizados en dos subcarpetas:

- `common/` — componentes de UI genéricos
- `solicitud/` — componentes específicos del flujo de solicitud pública

| Componente | Ruta | Props clave | Eventos |
|---|---|---|---|
| `Badge.vue` | `common/` | `color` (gray, green, red, blue, yellow, indigo, orange) | — |
| `LoadingSpinner.vue` | `common/` | `size`, `message`, `showMessage` | — |
| `Pagination.vue` | `common/` | `pagination` (objeto con `current_page`, `total_pages`, etc.) | `page-change` |
| `SearchInput.vue` | `common/` | `placeholder`, `debounceTime` | `input`, `search` |
| `FileUpload.vue` | `common/` | `label`, `accept`, `modelValue` | `update:modelValue` |
| `DataField.vue` | `common/` | `label`, `value` | — |
| `TimelineItem.vue` | `common/` | `label`, `date`, `active`, `isLast` | — |
| `Sticker.vue` | `solicitud/` | `data` (objeto con numerosolicitud, vigencia, etc.) | — |

---

## Tipos y constantes (`src/shared/types/index.js`)

```js
ESTADOS_LABEL  // recibido → 'Recibido', en_revision → 'En Revision', etc.
ESTADOS_COLOR  // recibido → 'bg-blue-100 text-blue-800', aprobada → 'bg-green-100 ...', etc.
// Valores: recibido | pendiente | en_revision | aprobada | rechazada | requiere_informacion
```

---

## Stack y librerías

- **Vue 3** Composition API (`<script setup>`)
- **Vite 6** + `@vitejs/plugin-vue`
- **Tailwind CSS v4** via `@tailwindcss/vite` (sin `tailwind.config.js`, configuración inline)
- **HeadlessUI** para Dialog, Transition (sidebar móvil)
- **Heroicons** `@heroicons/vue/24/outline`
- **SweetAlert2** para alertas y confirmaciones
- **html2canvas + jsPDF** para generación de PDF (`Sticker.vue`)
- **sass-embedded** disponible
- **Vitest + @vue/test-utils + jsdom** para tests

---

## Convenciones del proyecto

- Español en nombres de variables de dominio (`solicitud`, `turno`, `expediente`, `responsable`)
- Sin Pinia ni Vuex — gestión de estado solo con composables y `ref`/`computed`
- Sin Vee-Validate — validación manual con objetos de error por campo
- Formularios complejos usan `provide/inject` para estado compartido entre tabs
- Alertas al usuario siempre con SweetAlert2 (`Swal.fire(...)`)
- Imports con alias `@` → `src/`

---

## Partes sin implementar (placeholders)

- `private_app/dashboard/wrapper/DashboardView.vue` — solo muestra el título
- `private_app/reportes/wrapper/ReportesView.vue` — solo muestra el título
- `src/customviews/MantenimientoView.vue` — existe pero no tiene ruta activa en el router
- Tabs de `TurnosForm` en `private_app/turnos/components/`: `DocumentacionForm`, `NotasForm`, `PreliquidacionForm`, `SupervisionForm`, `PreradicacionForm`
- Módulo ventanilla intranet: `VentanillaList.vue` y `VentanillaForm.vue` son placeholders, pero la ruta `/home/ventanilla` YA ESTÁ ACTIVA en el router

