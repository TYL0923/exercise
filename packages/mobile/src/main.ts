import { createApp } from 'vue'
import App from './App.vue'
import pinia from './composables'
import router from './router'

import './style.css'
import 'uno.css'
import 'vant/lib/index.css'
// import { useInterceptor } from './lib/interceptor'
createApp(App).use(router).use(pinia).mount('#app')

