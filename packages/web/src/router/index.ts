import { createRouter, createWebHistory } from "vue-router";
import routes from "~pages";
const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const loginState = useLogin();
  next()
});
export default router;
