import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from './stores/auth.js'

// Visu maršruta komponentu slēptā ielāde koda sadalīšanai
const Home = () => import('./components/Home.vue')
const Login = () => import('./components/Login.vue')
const Register = () => import('./components/Register.vue')
const Products = () => import('./components/Products.vue')
const Cart = () => import('./components/Cart.vue')
const Footprint = () => import('./components/Footprint.vue')
const Forum = () => import('./components/Forum.vue')
const Education = () => import('./components/Education.vue')
const Profile = () => import('./components/Profile.vue')
const Admin = () => import('./components/Admin.vue')
const Challenges = () => import('./components/Challenges.vue')
const NotFound = () => import('./components/NotFound.vue')

const routes = [
  { path: '/', redirect: () => {
      // Neautentificētos apmeklētājus sūtīt uz pieteikšanās lapu, autentificētos — uz produktiem
      const token = localStorage.getItem('token')
      return token ? '/products' : '/login'
    }
  },
  { path: '/home', component: Home, meta: { requiresAuth: true } },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/products', component: Products },
  { path: '/cart', component: Cart, meta: { requiresAuth: true } },
  { path: '/footprint', component: Footprint, meta: { requiresAuth: true } },
  { path: '/challenges', component: Challenges, meta: { requiresAuth: true } },
  { path: '/forum', component: Forum },
  { path: '/education', component: Education },
  { path: '/profile', component: Profile, meta: { requiresAuth: true } },
  { path: '/admin', component: Admin, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/:pathMatch(.*)*', component: NotFound }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const publicPaths = ['/login', '/register']
  const isPublicRoute = publicPaths.includes(to.path)
  const requiresAuth = !isPublicRoute
  const requiresAdmin = to.meta.requiresAdmin

  // Inicializēt autentifikācijas stāvokli, ja tā vēl nav izdarīts
  if (!authStore.user && localStorage.getItem('token')) {
    authStore.initializeAuth()
  }

  if (requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (isPublicRoute && authStore.isAuthenticated) {
    next('/products')
  } else if (requiresAdmin && (!authStore.isAuthenticated || authStore.user.role !== 'admin')) {
    next('/products')
  } else {
    next()
  }
})

export default router