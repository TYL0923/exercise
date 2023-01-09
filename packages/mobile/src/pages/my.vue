<script setup lang="ts">
import type { ActionSheetAction } from 'vant'
import { showConfirmDialog, showNotify } from 'vant'

import { useLoginState } from '../composables'

const loginState = useLoginState()
const settingIsShow = ref<boolean>(false)
const isLogin = computed(() => !!loginState.account)
const settingOperation = ref<ActionSheetAction[]>([
  {
    name: '退出登录',
    color: '#ee0a24',
  },
])
const commonOperation = ref<Record<'label' | 'pagePath' | 'icon', string>[]>([
  {
    label: '我的题库',
    pagePath: '/pages/question-set',
    icon: 'newspaper-o',
  },
  {
    label: '加入题库',
    pagePath: '/pages/question-set',
    icon: 'add-o',
  },
  {
    label: '搜索题库',
    pagePath: '/pages/search',
    icon: 'search',
  },
  {
    label: '设置',
    pagePath: '',
    icon: 'setting-o',
  },
])
function handleGotoLogin() {
  uni.navigateTo({
    url: '/pages/login',
  })
}
function commom(item: Record<'label' | 'pagePath' | 'icon', string>) {
  if (item.pagePath !== '') {
    return uni.navigateTo({
      url: item.pagePath,
    })
  }
  switch (item.label) {
    case '设置':
      settingIsShow.value = true
      break
    default:
      break
  }
}
function settingSelected(action: ActionSheetAction) {
  switch (action.name) {
    case '退出登录':
      logout()
      break
    default:
      break
  }
}
function logout() {
  showConfirmDialog({
    title: '是否退出登录?',
  })
    .then(async () => {
      loginState.logout()
      showNotify({
        type: 'success',
        message: '已退出登录',
        duration: 500,
      })
    })
}
</script>

<template>
  <div h-screen>
    <div relative class="bg" h-240px flex items-center justify-center>
      <div>
        <div v-if="isLogin">
          <img w-100 h-100 rounded-full src="../static/user.png">
          <div text-white pt-2 text-center>
            {{ loginState.name }}
          </div>
        </div>
        <div v-else @click="handleGotoLogin">
          <van-icon name="user-circle-o" size="60" text-gray-200 />
          <div text-white pt-2 text-center>
            {{ '点击登录' }}
          </div>
        </div>
      </div>
      <div
        flex items-center justify-around
        absolute bottom-0
        class="w-84% left-50% -translate-x-50% translate-y-50%"
        rounded-1 bg-white shadow-md p-4
      >
        <div>
          <div>题库</div>
          <div mt-1 text-xs text-gray-400>
            创建题库 - 个
          </div>
        </div>
        <div>
          <div>笔记</div>
          <div mt-1 text-xs text-gray-400>
            分享笔记 - 篇
          </div>
        </div>
      </div>
    </div>
    <div mt-50px p-4>
      <div font-semibold mb-6>
        历史记录
      </div>
      <div />
    </div>
    <div p-4>
      <div font-semibold mb-6>
        常用功能
      </div>
      <div grid grid-cols-4 gap-8>
        <div
          v-for="item in commonOperation" :key="item.label"
          flex flex-col items-center gap-2
          @click="commom(item)"
        >
          <van-icon :name="item.icon" size="26" />
          <div text-xs>
            {{ item.label }}
          </div>
        </div>
      </div>
    </div>
    <van-action-sheet
      v-model:show="settingIsShow"
      :actions="settingOperation"
      cancel-text="取消"
      close-on-click-action
      @select="settingSelected"
    />
    <TabBarCom />
  </div>
</template>

<style lang="less" scoped>
.bg {
  background: linear-gradient(to right, #667db6, #0082c8, #0082c8, #667db6); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}
</style>
