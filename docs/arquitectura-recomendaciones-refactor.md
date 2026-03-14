# Recomendaciones de Refactor Arquitectural

**Fecha:** 2026-03-12
**Proyecto:** intranet-2bq
**Generado por:** Agente Architect

---

## Diagnóstico

### Problema central: la intranet no tiene dominio propio

La sub-app pública vive limpiamente en `src/public_app/`. La intranet está dispersa en 3 lugares sin raíz clara:

```
src/views/        ← layouts, vistas y stubs mezclados
src/components/   ← componentes de intranet con nombre genérico
src/shared/       ← correcto
src/public_app/   ← correcto
```

### 6 problemas específicos

#### 1. `src/views/` mezcla 4 roles diferentes
`HomeView.vue` es un *layout* (equivalente a `VentanillaPublicView`), pero convive con vistas de contenido y shells de subruta como si fueran lo mismo.

| Archivo | Rol real |
|---|---|
| `HomeView.vue` | Layout raíz de la intranet (sidebar + RouterView) |
| `LoginView.vue` | Vista de autenticación |
| `TurnosView.vue` | Shell de subruta (solo contiene `<RouterView />`) |
| `DashboardView.vue` | Vista-contenido (placeholder) |
| `ReportesView.vue` | Vista-contenido (placeholder) |
| `VentanillaView.vue` | Vista-contenido (placeholder, ruta comentada) |
| `MantenimientoView.vue` | Vista global independiente, sin ruta activa |

#### 2. `TurnosList.vue` y `TurnosForm.vue` están en `components/` pero son vistas enrutadas
El router los importa directamente como componentes de ruta — deberían estar en `views/`.

#### 3. `HomeView.vue` tiene nombre ambiguo
Existe otro `HomeView.vue` en `public_app/ventanilla/components/`. Son dos cosas completamente distintas con el mismo nombre.

#### 4. `src/components/` es un nombre de scaffold genérico
No comunica que esos componentes pertenecen exclusivamente a la intranet.

#### 5. Asimetría entre sub-apps
`src/public_app/shared/` tiene sus propios componentes (`DataField`, `TimelineItem`) pero no existe el equivalente `intranet_app/shared/` para los componentes específicos de la intranet.

#### 6. Archivos muertos
- `src/components/__tests__/HelloWorld.spec.js` — residuo del scaffold de Vite; el componente que importa no existe en el proyecto.
- `src/components/turnos/components/TempFormulario1.vue` — prototipo con datos hardcodeados, no importado por ningún componente activo.

---

## Estructura objetivo

```
src/
  assets/
  router/
  shared/                           ← sin cambios
    components/
    composables/
    types/
  public_app/                       ← sin cambios internos
    ventanilla/
    solicitud/
    shared/
  intranet_app/                     ← NUEVO (simetría con public_app)
    layout/
      IntranetLayout.vue            ← renombrado desde HomeView.vue
    views/
      DashboardView.vue
      ReportesView.vue
      VentanillaView.vue
      TurnosView.vue
      LoginView.vue
      turnos/
        TurnosList.vue              ← movido desde components/turnos/
        TurnosForm.vue              ← movido desde components/turnos/
    components/
      menubar/
        MenuItems.vue
        ActiveUser.vue
      turnos/
        tabs/
        components/                 ← sin TempFormulario1.vue
  views/                            ← solo vistas de nivel raíz (sin sub-app)
    MantenimientoView.vue
  App.vue
  main.js
```

---

## Movimientos concretos

| Origen | Destino | Tipo |
|---|---|---|
| `src/views/HomeView.vue` | `src/intranet_app/layout/IntranetLayout.vue` | Mover + renombrar |
| `src/views/LoginView.vue` | `src/intranet_app/views/LoginView.vue` | Mover |
| `src/views/DashboardView.vue` | `src/intranet_app/views/DashboardView.vue` | Mover |
| `src/views/ReportesView.vue` | `src/intranet_app/views/ReportesView.vue` | Mover |
| `src/views/VentanillaView.vue` | `src/intranet_app/views/VentanillaView.vue` | Mover |
| `src/views/TurnosView.vue` | `src/intranet_app/views/TurnosView.vue` | Mover |
| `src/components/turnos/TurnosList.vue` | `src/intranet_app/views/turnos/TurnosList.vue` | Mover |
| `src/components/turnos/TurnosForm.vue` | `src/intranet_app/views/turnos/TurnosForm.vue` | Mover |
| `src/components/turnos/tabs/` | `src/intranet_app/components/turnos/tabs/` | Mover carpeta |
| `src/components/turnos/components/` | `src/intranet_app/components/turnos/components/` | Mover carpeta |
| `src/components/menubar/` | `src/intranet_app/components/menubar/` | Mover carpeta |
| `src/components/__tests__/HelloWorld.spec.js` | — | **ELIMINAR** |
| `src/components/turnos/components/TempFormulario1.vue` | — | **ELIMINAR** |

---

## Impacto en el router

Tras los movimientos, `src/router/index.js` requiere actualizar los imports:

| Import actual | Import nuevo |
|---|---|
| `@/views/HomeView.vue` | `@/intranet_app/layout/IntranetLayout.vue` |
| `@/views/LoginView.vue` | `@/intranet_app/views/LoginView.vue` |
| `@/views/DashboardView.vue` | `@/intranet_app/views/DashboardView.vue` |
| `@/views/TurnosView.vue` | `@/intranet_app/views/TurnosView.vue` |
| `@/views/ReportesView.vue` | `@/intranet_app/views/ReportesView.vue` |
| `@/components/turnos/TurnosList.vue` | `@/intranet_app/views/turnos/TurnosList.vue` |
| `@/components/turnos/TurnosForm.vue` | `@/intranet_app/views/turnos/TurnosForm.vue` |

Los imports internos dentro de `TurnosForm.vue` y `TurnosList.vue` hacia sus tabs y sub-componentes también deberán actualizarse con las nuevas rutas relativas.

---

## Orden de ejecución recomendado

| Paso | Cambios | Riesgo |
|---|---|---|
| 1 | Eliminar `HelloWorld.spec.js` y `TempFormulario1.vue` | Ninguno |
| 2 | Crear `intranet_app/` y mover placeholders (`Dashboard`, `Reportes`, `Ventanilla`) | Bajo |
| 3 | Mover `TurnosList` + `TurnosForm` → actualizar router y sus imports internos | Medio |
| 4 | Renombrar `HomeView` → `IntranetLayout` + mover toda `components/` → actualizar todos los imports | Alto |
