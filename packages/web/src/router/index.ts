import { createRouter, createWebHistory } from 'vue-router'
import routes from '~pages'
const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const loginState = useLogin()
  if (to.path === '/') {
    if (!loginState.isLogin)
      return next()
    else return next('/home/question-set')
  }
  else {
    if (!loginState.isLogin)
      next('/')
    else next()
  }
})
export default router
