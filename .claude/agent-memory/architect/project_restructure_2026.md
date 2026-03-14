---
name: Reestructuración de private_app (2026-03-14)
description: El proyecto completó una reestructuración de carpetas de la sub-app intranet. private_app ahora tiene módulos por dominio (auth, layout, dashboard, reportes, turnos, ventanilla), cada uno con subcarpetas wrapper/views/components.
type: project
---

El proyecto completó una reestructuración de carpetas de `src/private_app/` hacia un patrón por dominio, reemplazando la estructura plana anterior (`src/views/` + `src/components/`).

**Why:** Mejor organización modular — cada dominio (turnos, ventanilla, etc.) agrupa sus propias vistas, componentes y wrappers de subruta.

**How to apply:** Al crear nuevos módulos en private_app, seguir el patrón `private_app/<dominio>/wrapper/<DominioView>.vue` (shell RouterView) + `views/` (vistas enrutadas) + `components/` (componentes del dominio). Los componentes auxiliares compartidos dentro del módulo van en `<dominio>/shared/components/`.

## Estructura post-reestructuración

```
src/private_app/
  auth/LoginView.vue
  layout/wrapper/PrivateLayout.vue
  layout/components/MenuItems.vue + ActiveUser.vue
  dashboard/wrapper/DashboardView.vue
  reportes/wrapper/ReportesView.vue
  turnos/wrapper/TurnosView.vue
  turnos/views/TurnosList.vue + TurnosForm.vue
  turnos/components/  ← tabs del formulario
  turnos/shared/components/  ← PersonRegistration, ActionButtons, tab navigation, TurnoTitle
  ventanilla/wrapper/VentanillaView.vue
  ventanilla/views/VentanillaList.vue + VentanillaForm.vue
```

## Bugs de imports detectados tras la reestructuración

`TurnosForm.vue` tiene imports rotos (pendientes de corrección):
- `MobileTabSelector` y `DesktopTabNavigation` importados desde `turnos/components/` pero están en `turnos/shared/components/`
- Todos los tabs importados desde la ruta inexistente `turnos/views/tabs/` — la ruta correcta es `turnos/components/`
- `VentanillaForm.vue` (tab) importa `TurnoTitle` desde `turnos/components/TurnoTitle.vue` pero está en `turnos/shared/components/TurnoTitle.vue`
