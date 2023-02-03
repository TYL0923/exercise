import { createRouter, createWebHistory } from 'vue-router'
import routes from '~pages'
const router = createRouter({
  history: createWebHistory(),
  routes,
})
const routerWhite = [
  '/',
  '/ctrate',
  '/login',
  '/my',
  '/question-set',
  '/search',
]
router.beforeEach((to, from, next) => {
  const loginState = useLogin()
  if (routerWhite.includes(to.path))
    return next()
  if (loginState.isLogin)
    return next()
  next('/login')
})
export default router
