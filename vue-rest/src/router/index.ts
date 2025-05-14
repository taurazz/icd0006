import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LocationPage from '@/views/LocationPage.vue'
import RegisterPage from '@/views/RegisterPage.vue'
import LoginPage from '@/views/LoginPage.vue'
import SessionPage from '@/views/SessionPage.vue'
import SessionCreate from '@/views/SessionCreate.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/location',
      name: 'location',
      component: LocationPage
    },
    {
      path: '/session',
      name: 'session',
      component: SessionPage
    },
    {
      path: '/sessioncreate',
      name: 'sessioncreate',
      component: SessionCreate
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterPage
    },
    {
      path: '/login',
      name: 'login',
      component: LoginPage
    },
  ]
})

export default router