import { defineStore } from 'pinia'

// const url = window.location.hash.slice(1)

const tabItems = shallowRef([
  {
    label: '首页',
    page: '/',
    icon: 'home-o',
  },
  {
    label: '题库',
    page: '/question-set',
    icon: 'orders-o',
  },
  {
    label: '我的',
    page: '/my',
    icon: 'user-o',
  },
])
export const useTabBar = defineStore('tabBar', {
  state: () => {
    const data: {
      activeIdx: number
    } = JSON.parse(sessionStorage.getItem('tabBar') || localStorage.getItem('tabBar') || 'null') || {
      activeIdx: 0,
    }
    return {
      ...data,
      tabItems,
    }
  },
  getters: {
    activeItem: (state) => {
      const item = state.tabItems[state.activeIdx]
      return item || state.tabItems[0]
    },
  },
})

