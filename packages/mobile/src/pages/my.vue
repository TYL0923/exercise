<script setup lang="ts">
import { computed, reactive, ref, watchEffect } from 'vue'
import type { QuestionSet } from '@exercise/type'
import { onShow } from '@dcloudio/uni-app'
import { useLoginState } from '../composables'
import { getCreatedQuestionSet, getJoinedQuestionSet, resetQuestion } from '../lib/api'
import QuestionSetCardCom from '../components/QuestionSetCardCom.vue'
import SkeletonCom from '../components/SkeletonCom.vue'
import FilterCom from '../components/FilterCom.vue'

const loginState = useLoginState()
const moreOperationPopupRef = ref<any>(null)
const openQuestionSetPopupRef = ref<any>(null)
const logoutPopupRef = ref<any>(null)
const isLogin = computed(() => !!loginState.account)
const current = ref<number>(0)
const items = reactive(['创建的题库', '加入的题库'])

const openQuestionSet = ref<QuestionSet>()
const filter = reactive<{
  mode: 'exercise' | 'test'
  start: 'continue' | 'restart'
  part: 'all' | 'error' | 'not'
}>({
  mode: 'test',
  start: 'continue',
  part: 'all',
})
const filterOptions = reactive({
  mode: [
    {
      label: '刷题模式',
      key: 'exercise',
    },
    {
      label: '考试模式',
      key: 'test',
    },
  ],
  start: [
    {
      label: '继续刷题',
      key: 'continue',
    },
    {
      label: '重新开始',
      key: 'restart',
    },
  ],
  part: [
    {
      label: '全部',
      key: 'all',
    },
    {
      label: '错题',
      key: 'error',
    },
    {
      label: '未做',
      key: 'not',
    },
  ],
})

function handleGotoLogin() {
  uni.navigateTo({
    url: '/pages/login',
  })
}

function handleOpenQuestionSet(questionSet: QuestionSet) {
  openQuestionSet.value = questionSet
  openQuestionSetPopupRef.value.open('bottom')
}
async function handleStart() {
  if (!openQuestionSet.value?.id)
    return
  if (filter.mode === 'test') {
    uni.showLoading({
      title: '生成试卷中',
    })
    await resetQuestion(openQuestionSet.value.id, loginState.account, 'test')
    uni.hideLoading()
    uni.navigateTo({
      url: `/pages/test?id=${openQuestionSet.value.id}`,
    })
  }
  else {
    if (filter.start === 'restart') {
      uni.showLoading({
        title: '加载中',
      })
      const res = await resetQuestion(openQuestionSet.value.id, loginState.account, 'exercise')
      uni.hideLoading()
    }
    uni.navigateTo({
      url: `/pages/exercise?id=${openQuestionSet.value.id}&part=${filter.part}`,
    })
  }
  openQuestionSetPopupRef.value.close()
}
function handleOpenPopup() {
  moreOperationPopupRef.value!.open('bottom')
}
function handleLogout() {
  loginState.logout()
  moreOperationPopupRef.value!.close()
}
</script>

<template>
  <view h-screen>
    <view relative bg-stone-900 h-240px flex items-center justify-center>
      <view>
        <view v-if="isLogin">
          <image w-100 h-100 rounded-full src="../static/logo.png" />
          <view text-white pt-2 text-center>
            {{ loginState.name }}
          </view>
        </view>
        <view v-else @click="handleGotoLogin">
          <van-icon name="user-circle-o" size="60" text-gray-200 />
          <view text-white pt-2 text-center>
            {{ '点击登录' }}
          </view>
        </view>
      </view>
      <view
        flex items-center justify-around
        absolute bottom-0
        class="w-84% left-50% -translate-x-50% translate-y-50%"
        rounded-1 bg-white shadow-md p-4
      >
        <view>
          <view>题库</view>
          <view mt-1 text-xs text-gray-400>
            创建题库 10个
          </view>
        </view>
        <view>
          <view>笔记</view>
          <view mt-1 text-xs text-gray-400>
            分享笔记 10篇
          </view>
        </view>
      </view>
    </view>
    <view mt-50px p-4>
      <view font-semibold mb-6>
        历史记录
      </view>
      <view />
    </view>
    <view p-4>
      <view font-semibold mb-6>
        常用功能
      </view>
      <view grid grid-cols-4 gap-8>
        <view v-for="i in 4" :key="i" flex flex-col items-center gap-2>
          <van-icon name="star-o" size="26" />
          <view text-xs>
            我的收藏
          </view>
        </view>
      </view>
    </view>
    <TabBarCom />
  </view>
</template>
