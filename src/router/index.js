import { createRouter, createWebHistory } from 'vue-router'
import ReportView from '../views/ReportView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Report',
      component: ReportView,
    },
    {
      path: '/incidents',
      name: 'Incidents',
      component: () => import('@/views/IncidentsView.vue'),
    },
    {
      path: '/inventory',
      name: 'Inventory',
      component: () => import('@/views/InventoryView.vue'),
    },
    {
      path: '/users',
      name: 'Users',
      component: () => import('@/views/UsersView.vue'),
    },
  ],
})

export default router
