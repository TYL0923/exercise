const active = ref(0)
const tabItems = ref([
  {
    label: '首页',
    page: 'index',
    icon: 'home-o',
  },
  {
    label: '题库',
    page: 'question-set',
    icon: 'orders-o',
  },
  {
    label: '我的',
    page: 'my',
    icon: 'user-o',
  },
])
export function useTabBar() {
  return {
    active,
    tabItems,
  }
}
