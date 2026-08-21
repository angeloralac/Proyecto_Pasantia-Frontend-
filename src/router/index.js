import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import DashboardView from '../views/DashboardView.vue'

import ArticulosView from '../views/ArticulosView.vue'
import ClientesView from '@/views/ClientesView.vue'
import UsuariosView from '@/views/UsuariosView.vue'
import VentasView from '@/views/VentasView.vue' 
import ReportesView from '@/views/ReportesView.vue'
import InicioView from '@/views/InicioView.vue'
import InventarioView from '@/views/InventariosView.vue'
import CajaView from '@/views/CajasView.vue'
import HistorialCajaView from '@/views/HistorialCajasView.vue'

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
      meta: { requiresAuth: true },
      children: [
        {
          path: '', 
          name: 'inicio',
          component: InicioView
        },
        {
          path: 'articulos', 
          name: 'articulos',
          component: ArticulosView
        },
        { 
          path: 'clientes', 
          name: 'clientes',
          component: ClientesView 
        },
        { 
          path: 'usuarios', 
          name: 'usuarios',
          component: UsuariosView 
        },
        { 
          path: 'ventas', 
          name: 'ventas',
          component: VentasView 
        },
        {
          path: 'reportes',
          name: 'reportes',
          component: ReportesView
        },
        {
          path: 'inventario',
          name: 'inventario',
          component: InventarioView
        },
        {
          path: 'caja', // 
          name: 'caja',
          component: CajaView 
        },
        {
          path: 'caja/historial',
          name: 'historial-caja',
          component: HistorialCajaView
        }

      ]
    }
  ]
})

router.beforeEach((to, from, next) => {

  const isAuthenticated = !!localStorage.getItem('token')

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login') 
  } else if (to.name === 'login' && isAuthenticated) {
    next({ name: 'dashboard' })
  } else {
    next()
  }
})

export default router