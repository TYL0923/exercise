import { createPinia } from 'pinia'
const pinia = createPinia()

watch(
  pinia.state,
  (state) => {
    // 每当它发生变化时，将整个状态持久化到本地存储
    Object.entries(state).forEach(([key, value]) => {
      sessionStorage.setItem(key, JSON.stringify(value))
    })
  },
  { deep: true },
)
export default pinia
