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
function showLogin(id: string) {
  const oLogin = document.querySelector(`*[anchor='${id}']`)
  oLogin?.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
  })
}
</script>

<template>
  <div w-screen h-screen overflow-x-hidden @scroll="handlePageScroll">
    <header class="header" :class="{ show: headerIsShow }" w-screen box-border h-20 px-10 flex items-center fixed>
      <h1 w-80>
        在线练习平台
      </h1>
      <div flex-1 text-sm flex justify-center gap-x-8>
        <span cursor-pointer to="home" @click="showLogin('index')">首页</span>
        <span cursor-pointer to="login" @click="showLogin('login')">登录</span>
        <span cursor-pointer to="about">关于</span>
      </div>
      <div w-80 flex items-center justify-center>
        <a href="https://github.com/TYL0923/exercise-web" target="_blank">
          <i text-gray-900 text-2xl class="fa-brands fa-github" />
        </a>
      </div>
    </header>
    <div pt-60 px-40 box-border h-screen flex flex-col items-center anchor="index">
      <div class="title" relative>
        <div class="mask w-105%" z-10 h-11 bg-white absolute top-14 left-0 />
        <p text-4xl tracking-widest mb-4>
          随时随地
        </p>
        <p text-4xl tracking-widest mb-0>
          创建你的在线题库
        </p>
      </div>
      <div w-80 mt-10 flex justify-between>
        <a-button w-30 size="large" type="primary">
          开始
        </a-button>
        <a-button w-30 size="large" type="primary" @click="showLogin('login')">
          登录
        </a-button>
      </div>
    </div>
    <div relative bg-gray-50 box-border w-screen h-screen anchor="login">
      <LoginCom :is-show="true" />
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
@keyframes typewriter {
  0% {
    left: 0;
    opacity: 1;
  }
  50% {
    left: 100%;
    opacity: 1;
  }
  55% {
    left: 100%;
    opacity: 0;
  }
  100% {
    left: 100%;
    opacity: 0;
  }
}
@keyframes disappear {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
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
.title {
  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    right: -5px;
    display: inline-block;
    height: 40%;
    width: 4px;
    background-color: #000;
    border-radius: 4px;

    animation-name: disappear;
    animation-duration: .8s;
    animation-timing-function: linear;
    animation-delay: 0;
    animation-iteration-count: infinite;
    animation-fill-mode: none;
    animation-direction: normal;
  }
  .mask {
    animation-name: typewriter;
    animation-duration: 6s;
    animation-timing-function: steps(8);
    animation-delay: 0;
    animation-iteration-count: infinite;
    animation-fill-mode: forwards;
    animation-direction: normal;
    &::after {
      content: "";
      position: absolute;
      top: 1px;
      left: 1px;
      display: inline-block;
      height: 90%;
      width: 4px;
      background-color: #000;
      border-radius: 4px;
    }
  }
}
</style>
