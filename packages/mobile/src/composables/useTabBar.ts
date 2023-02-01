const url = window.location.hash.slice(1)

const tabItems = ref([
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
const activeIdx = tabItems.value.findIndex(item => item.page === url)
const active = ref(activeIdx >= 0 ? activeIdx : 0)
export function useTabBar() {
  return {
    active,
    tabItems,
  }
}
