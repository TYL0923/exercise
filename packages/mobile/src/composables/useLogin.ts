import { defineStore } from 'pinia'

export const useLoginState = defineStore('login', {
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
  actions: {
    login(isLocal = false, option: {
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
      this.token = ''
      this.name = ''
      localStorage.removeItem('login')
    },
  },
  getters: {
    isLogin: state => !!(state.account && state.name && state.token),
  },
})

