import { createPinia } from 'pinia'
const pinia = createPinia()
watch(
  pinia.state,
  (state) => {
    Object.entries(state).forEach(([key, value]) => {
      sessionStorage.setItem(key, JSON.stringify(value))
    })
  },
  {
    deep: true,
  },
)
export default pinia
