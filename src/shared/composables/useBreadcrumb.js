import { computed } from 'vue'
import { useRoute } from 'vue-router'

export function useBreadcrumb() {
  const route = useRoute()

  const breadcrumbs = computed(() => {
    const matched = route.matched.filter(r => r.meta?.breadcrumb)

    return matched.map((r, index) => {
      const isLast = index === matched.length - 1

      // Para el ítem actual (último) no hay link de navegación
      if (isLast) {
        return { label: r.meta.breadcrumb }
      }

      // Usar breadcrumbTo explícito si está definido (útil para rutas sin nombre)
      const to = r.meta.breadcrumbTo ?? (r.name ? { name: r.name, params: route.params } : null)

      return { label: r.meta.breadcrumb, to }
    })
  })

  return { breadcrumbs }
}
