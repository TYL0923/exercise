<script setup lang="ts">
const router = useRouter()
const loginState = useLogin()
const selectedKeys = ref<Array<string>>([])
const navOptions = [
  {
    key: '/home/question-set',
    label: '我的题库',
  },
  {
    key: '/home/note',
    label: '我的笔记',
  },
  {
    key: '/home/statistics',
    label: '数据统计',
  },
]
function handleClick(key: string) {
  router.push(key)
}
function handleLogout() {
  loginState.logout()
  router.replace('/')
}
</script>

<template>
  <div>
    <header class="header" w-screen box-border h-16 px-10 flex items-center fixed>
      <h1 w-80 mb-0>
        在线练习平台
      </h1>
      <div flex-1 flex flex-row-reverse>
        <a-menu v-model:selectedKeys="selectedKeys" mode="horizontal">
          <a-menu-item v-for="item in navOptions" :key="item.key" @click="handleClick(item.key)">
            {{ item.label }}
          </a-menu-item>
        </a-menu>
      </div>
      <div w-80 flex flex-row-reverse>
        <a-dropdown :trigger="['click']">
          <div cursor-pointer>
            <img w-10 h-10 rounded-full bg-cover bg-center src="/using.jpeg" alt="">
            <span mx-1>{{ loginState.name.value }}</span>
          </div>
          <template #overlay>
            <a-menu>
              <a-menu-item @click="handleLogout">
                <span>退出登录</span>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>
    </header>
    <div w-screen h-screen pt-24 pb-10 px-10 box-border overflow-x-hidden>
      <router-view />
    </div>
  </div>
</template>

<style scoped lang="less">
.header {
  box-sizing: border-box;
  background-color: #fff;
  color: #333;
  z-index: 100;
  animation: dropDown 0.3s ease-in-out forwards;
  box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.08);
  i {
    color: #333;
  }
}
</style>
