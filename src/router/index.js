/* eslint-disable no-undef */
import { createRouter, createWebHistory } from 'vue-router'
import ReportView from '../views/ReportView.vue'

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
  const token = $cookies.get('token')

  if (to.meta.requireLogin && !token) {
    next({ name: 'Report' })
  } else {
    next()
  }
})

export default router
