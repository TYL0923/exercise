import { createSSRApp } from 'vue'
import App from './App.vue'
import pinia from './composables'
import 'uno.css'
import 'vant/lib/index.css'
export function createApp() {
  const app = createSSRApp(App)
  app.use(pinia)
  return {
    app,
  }
}
