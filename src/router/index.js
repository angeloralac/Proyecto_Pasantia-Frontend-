import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import DashboardView from '../views/DashboardView.vue'

import ArticulosView from '../views/ArticulosView.vue'
import ClientesView from '@/views/ClientesView.vue'
import UsuariosView from '@/views/UsuariosView.vue'


const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/login' 
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView 
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView 
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      children: [
        {
          path: 'articulos', 
          name: 'articulos',
          component: ArticulosView
        },
        { path: 'clientes', 
          component: ClientesView 
        },
        { path: 'usuarios', 
          component: UsuariosView 
        }

      ]
    }
  ]
})

export default router