import { defineStore } from 'pinia'

// useStore 可以是 useUser、useCart 之类的任何东西
// 第一个参数是应用程序中 store 的唯一 id
export const useLogin = defineStore('login', {
  // other options...
  state: () => {
    const data: {
      account: string
      name: string
      token: string
    } = JSON.parse(sessionStorage.getItem('login') || localStorage.getItem('login') || 'null') || {
      account: '',
      name: '',
      token: '',
    }
    return data
  },
  getters: {
    isLogin(): boolean {
      return !!(this.account && this.name && this.token)
    },
  },
  actions: {
    login(isLocal: boolean, option: {
      account: string
      name: string
      token: string
    }) {
      this.account = option.account
      this.name = option.name
      this.token = option.token
      if (isLocal)
        localStorage.setItem('login', JSON.stringify(this.$state))
    },
    logout() {
      this.account = ''
      this.name = ''
      this.token = ''
      localStorage.removeItem('login')
    },
  },
})

export default useLogin

