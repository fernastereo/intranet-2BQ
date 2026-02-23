import HomeView from '@/views/HomeView.vue';
import LoginView from '@/views/LoginView.vue';
import { createRouter, createWebHistory } from 'vue-router';
import { useAuth } from '@/composables/useAuth';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
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
        {
          path: 'pqr',
          name: 'pqr',
          component: () => import('@/views/PqrView.vue'),
        },
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

router.beforeEach(async (to, from, next) => {
  const { isAuthenticated, checkAuth } = useAuth();
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  if (!requiresAuth) {
    if (to.name === 'login' && isAuthenticated.value) {
      next({ name: 'home' });
    } else {
      next();
    }
    return;
  }

  if (!isAuthenticated.value) {
    next({
      name: 'login',
      query: { redirect: to.fullPath },
    });
    return;
  }

  const isValidToken = await checkAuth();
  if (!isValidToken) {
    next({
      name: 'login',
      query: { redirect: to.fullPath },
    });
    return;
  }

  next();
});
export default router;
