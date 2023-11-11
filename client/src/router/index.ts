import { createRouter, createWebHistory } from 'vue-router'
import Dash from '../views/MainDashboard.vue'
import Auth from '../views/UserAuth.vue'

import { useState } from '../stores/state'
import { useSocket } from '../stores/socket'

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

router.beforeEach(async (to, from) => {
  const { getReports } = useState()
  const { connect } = useSocket()
  await getReports()
  await connect()
})

export default router
