import { createRouter, createWebHistory } from 'vue-router'
import Dash from '../views/MainDashboard.vue'
import Auth from '../views/UserAuth.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Dash
    },
    {
      path: '/auth',
      name: 'auth',
      component: Auth
    }
  ]
})

export default router
