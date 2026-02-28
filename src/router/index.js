import HomeView from '@/views/HomeView.vue';
import LoginView from '@/views/LoginView.vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import { useAuth } from '@/shared/composables/useAuth';
import VentanillaPublicView from '@/public_app/ventanilla/views/VentanillaPublicView.vue';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'ventanilla-public',
      component: VentanillaPublicView,
      meta: { requiresAuth: false },
      children: [
        {
          path: '',
          name: 'ventanilla-public-home',
          component: () => import('@/public_app/ventanilla/components/HomeView.vue'),
        },
        {
          path: '/nueva-solicitud',
          name: 'nueva-solicitud',
          component: () => import('@/views/MantenimientoView.vue')
        },
        {
          path: '/consultar',
          name: 'consultar',
          component: () => import('@/public_app/solicitud/views/ConsultarSolicitudView.vue')
        },
        {
          path: '/solicitud/:solicitud_id',
          name: 'detalle-solicitud',
          component: () => import('@/public_app/solicitud/views/DetalleSolicitudView.vue'),
          props: true
        },
      ],
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresAuth: false },
    },
    {
      path: '/home',
      component: HomeView,
      meta: { requiresAuth: true },
      children: [
        {
          path: '', // Esta será la ruta por defecto -> '/dashboard'
          name: 'home',
          component: () => import('@/views/DashboardView.vue'),
        },
        {
          path: 'dashboard',
          name: 'dashboard',
          redirect: { name: 'home' },
        },
        {
          path: 'turnos',
          component: () => import('@/views/TurnosView.vue'),
          children: [
            {
              path: '',
              name: 'turnos',
              component: () => import('@/components/turnos/TurnosList.vue'),
            },
            {
              path: 'nuevo',
              name: 'nuevo-turno',
              component: () => import('@/components/turnos/TurnosForm.vue'),
            },
            {
              path: 'editar/:id',
              name: 'editar-turno',
              component: () => import('@/components/turnos/TurnosForm.vue'),
            },
          ],
        },
        // {
        //   path: 'ventanilla',
        //   name: 'ventanilla',
        //   component: () => import('@/views/VentanillaView.vue'),
        // },
        {
          path: 'reportes',
          name: 'reportes',
          component: () => import('@/views/ReportesView.vue'),
        },
      ],
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      // component: () => import('../views/PqrView.vue'),
    },
    // {
    //   path: '/:pathMatch(.*)*',
    //   name: 'not-found',
    //   component: 'NotFoundView',
    // },
  ],
});

// Bandera para prevenir loops infinitos
let isCheckingAuth = false;

router.beforeEach(async (to, from, next) => {
  const { isAuthenticated, checkAuth } = useAuth();
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  // Si la ruta no requiere autenticación, dejar pasar
  if (!requiresAuth) {
    if (to.name === 'login' && isAuthenticated.value) {
      // Prevenir loop: si ya estamos intentando ir a home, no redirigir
      if (isCheckingAuth) {
        next();
        return;
      }
      next({ name: 'home' });
    } else {
      next();
    }
    return;
  }

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated.value) {
    next({
      name: 'login',
      query: { redirect: to.fullPath },
    });
    return;
  }

  // Prevenir verificaciones múltiples simultáneas
  if (isCheckingAuth) {
    next();
    return;
  }

  // Verificar el token solo una vez
  isCheckingAuth = true;
  try {
    const isValidToken = await checkAuth();
    if (!isValidToken) {
      next({
        name: 'login',
        query: { redirect: to.fullPath },
      });
      return;
    }
    next();
  } catch (error) {
    console.error('Error en verificación de autenticación:', error);
    next({
      name: 'login',
      query: { redirect: to.fullPath },
    });
  } finally {
    isCheckingAuth = false;
  }
});
export default router;
