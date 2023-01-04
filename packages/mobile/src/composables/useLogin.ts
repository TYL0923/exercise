import { defineStore } from 'pinia'

const useLoginState = defineStore('loginState', {
  state: () => {
    return {
      account: 'admin1',
      name: 'admin1',
      token: '1',
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

