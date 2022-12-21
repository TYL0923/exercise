import { defineStore } from 'pinia'

const useLoginState = defineStore('loginState', {
  state: () => {
    return {
      account: '',
      name: '',
      token: '',
    }
  },
  actions: {
    login(account: string, name: string, token: string) {
      this.account = account
      this.name = name
      this.token = token
    },
    logout() {
      this.account = ''
      this.token = ''
      this.name = ''
    },
  },
})
export {
  useLoginState,
}
// interface LoginState {
//   account: string
//   name: string
//   token: string
// }
// const loginState: Ref<LoginState> = useStorage('login', {
//   account: '',
//   name: '',
//   token: '',
// })
// const useLogin = () => {
//   const login = (account: string, name: string, token: string) => {
//     loginState.value.account = account
//     loginState.value.name = name
//     loginState.value.token = token
//   }
//   const logout = () => {
//     loginState.value.account = ''
//     loginState.value.token = ''
//     loginState.value.name = ''
//   }
//   return {
//     ...toRefs(loginState.value),
//     login,
//     logout,
//   }
// }

// export default useLogin

