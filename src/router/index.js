import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/users',
      name: 'users',
      component: () => import('../views/UsersView.vue'),
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/SettingsView.vue'),
    },
    {
      path: '//inventory/all',
      name: 'all-products',
      component: () => import('../views/AllProductsView.vue'),
    },
    {
      path: '/inventory/out',
      name: 'stock-out',
      component: () => import('../views/StockOutView.vue'),
    },
    {
      path: '/inventory/in',
      name: 'stock-in',
      component: () => import('../views/StockInView.vue'),
    },
  ],
})

export default router
