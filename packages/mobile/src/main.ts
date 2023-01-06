import { createSSRApp } from 'vue'
import App from './App.vue'
import pinia from './composables'
import 'uno.css'
import 'vant/lib/index.css'
import { useInterceptor } from './lib/interceptor'
export function createApp() {
  const app = createSSRApp(App)
  app.use(pinia)
  useInterceptor()
  return {
    app,
  }
}
