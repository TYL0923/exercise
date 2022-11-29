import type { Ref } from 'vue'
import { useStorage } from '@vueuse/core'

interface LoginState {
  account: string
  token: string
}
const loginState: Ref<LoginState> = useStorage('login', {
  account: '',
  token: '',
})
const useLogin = () => {
  const login = (account: string, token: string) => {
    loginState.value.account = account
    loginState.value.token = token
  }
  const logout = () => {
    loginState.value.account = ''
    loginState.value.token = ''
  }
  return {
    ...toRefs(loginState.value),
    login,
    logout,
  }
}

export default useLogin

