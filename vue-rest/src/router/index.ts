import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
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
{
  path: '/session/edit/:id',
  name: 'sessionedit',
  component: () => import('@/views/SessionEdit.vue'),
},

  ]
})

export default router
