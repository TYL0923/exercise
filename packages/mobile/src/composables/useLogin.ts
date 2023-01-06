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
  getters: {
    isLogin: state => state.account && state.name && state.token,
  },
})
export {
  useLoginState,
}

