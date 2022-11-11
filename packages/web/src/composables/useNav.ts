import type { Ref } from 'vue'
import { useStorage } from '@vueuse/core'

interface NavState {
  activeMenuItem: []
}
const navState: Ref<NavState> = useStorage('nav', {
  activeMenuItem: [],
})
const useNav = () => {
  return {
    ...toRefs(navState.value),
  }
}

export default useNav

