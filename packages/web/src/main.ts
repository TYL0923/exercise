import { createApp } from 'vue'
import pinia from './composables'
import './style.less'
import 'uno.css'
import App from './App.vue'
import router from './router'

createApp(App).use(router).use(pinia).mount('#app')
