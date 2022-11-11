<script setup lang="ts">
const headerIsShow = ref<boolean>(false)
const oHeader = ref<HTMLElement | null>(null)
function handlePageScroll(e: Event) {
  const scrollTop = (e.target as HTMLDivElement).scrollTop
  const headerHeight = oHeader.value?.clientHeight || 0
  if (scrollTop - headerHeight > 100)
    headerIsShow.value = true
  else
    headerIsShow.value = false
}
</script>

<template>
  <div w-screen h-screen overflow-x-hidden @scroll="handlePageScroll">
    <header class="header" :class="{ show: headerIsShow }" w-screen box-border h-20 px-10 flex items-center fixed>
      <h1 w-80>
        在线练习平台
      </h1>
      <div flex-1 text-sm flex justify-center gap-x-8>
        <span to="home">首页</span>
        <span to="login">登录</span>
        <span to="about">关于</span>
      </div>
      <div w-80>
        <a href="https://github.com/TYL0923/exercise-web" target="_blank">
          <i class="fa-brands fa-github" />
        </a>
      </div>
    </header>
    <div pt-60 px-40 box-border h-screen flex flex-col items-center>
      <div>
        <p text-4xl tracking-widest mb-4>
          随时随地
        </p>
        <p text-4xl tracking-widest>
          创建你的在线题库
        </p>
      </div>
      <div w-80 flex justify-between>
        <a-button w-30 size="large" type="primary">
          开始
        </a-button>
        <a-button w-30 size="large" type="primary">
          登录
        </a-button>
      </div>
    </div>
    <div relative bg-gray-50 box-border w-screen h-screen>
      <Login :is-show="true" />
    </div>
    <div h-200px />
  </div>
</template>

<style scoped lang="less">
@keyframes dropDown {
  from {
    transform: translateY(-100px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
.login-enter-active {
  transition: 0.8s;
}
.login-leave-active {
  transition: 0.3s;
}
.login-enter-from,
.login-leave-to {
  opacity: 0;
  transform: translateY(200px);
}
.login-enter-to,
.login-leave-from {
  opacity: 1s;
  transform: translateY(0);
}
.header {
  &.show {
    box-sizing: border-box;
    background-color: #fff;
    color: #333;
    z-index: 100;
    animation: dropDown 0.3s ease-in-out forwards;
    box-shadow: 0 2px 10px 2px rgba(0, 0, 0, 0.1);
    i {
      color: #333;
    }
  }
}
</style>
