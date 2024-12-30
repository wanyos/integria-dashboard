import { createRouter, createWebHistory } from 'vue-router'
import ReportView from '../views/ReportView.vue'
import { toast } from 'vue3-toastify'
import { useAuthenticationStore } from '@/stores/authentication'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Report',
      component: ReportView,
      meta: {
        requireLogin: false,
      },
    },
    {
      path: '/incidents',
      name: 'Incidents',
      component: () => import('@/views/IncidentsView.vue'),
      meta: {
        requireLogin: true,
      },
    },
    {
      path: '/inventory',
      name: 'Inventory',
      component: () => import('@/views/InventoryView.vue'),
      meta: {
        requireLogin: true,
      },
    },
    {
      path: '/users',
      name: 'Users',
      component: () => import('@/views/UsersView.vue'),
      meta: {
        requireLogin: true,
      },
    },
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthenticationStore()

  if (to.meta.requireLogin && !authStore.isAuthenticated) {
    toast.error('You need login to use this view...')
    next({ name: 'Report' })
  } else {
    next()
  }
})

export default router
