import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth';
import { useOnboardingStore } from '@/stores/onboarding';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'welcome',
      component: () => import('@/views/BodyView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../components/forms/LoginForm.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../components/forms/RegisterForm.vue')
    },
    {
      path: '/email',
      name: 'email',
      component: () => import('../components/forms/EmailForm.vue')
    },
    {
      path: '/verify-otp',
      name: 'verify-otp',
      component: () => import('../components/forms/OtpForm.vue')
    },
    {
      path: '/set-password',
      name: 'set-password',
      component: () => import('../components/forms/SetAndResetPwdForm.vue')
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      meta: { requiresAuth: true }
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
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: () => import("../views/404View.vue"),
    },
  ],
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore();
  const onboarding = useOnboardingStore();

  // 1. Prevent logged-in users from visiting auth pages
  const authPages = ['login', 'register', 'email', 'verify-otp', 'set-password'];
  if (authPages.includes(to.name) && auth.isLoggedIn) {
    return next({ name: 'home' });
  }

  // 2. Protect Onboarding Sequence (The "Wizard" Logic)
  
  // Guard: Cannot visit OTP page if we don't have an email in memory
  if (to.name === 'verify-otp' && !onboarding.email) {
    // Redirect back to start based on intent, or default to login
    return next({ name: 'login' }); 
  }

  // Guard: Cannot visit Set Password if OTP is not verified
  if (to.name === 'set-password' && !onboarding.isOtpVerified) {
    return next({ name: 'verify-otp' });
  }

  // 3. Global Auth Guard
  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return next({ name: 'login' });
  }

  if (to.name === 'set-password' && !onboarding.email) {
    return next({ name: 'login' });
  }
  next();
});

export default router
