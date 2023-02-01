import { defineStore } from 'pinia'
const useNav = defineStore('nav', {
  // other options...
  state: () => {
    const data: {
      activeItem: string[]
    } = JSON.parse(sessionStorage.getItem('nav') || 'null') || {
      activeItem: [],
    }
    return data
  },
  actions: {
    change(activeItem: string[]) {
      this.activeItem = activeItem
    },
  },
})

export default useNav

