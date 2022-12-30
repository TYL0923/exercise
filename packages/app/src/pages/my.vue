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

const isLoading = ref<{
  created: boolean
  joined: boolean
}>({
  created: false,
  joined: false,
})
const createdQuestionSetList = ref<QuestionSet[]>([])
const joinedQuestionSetList = ref<QuestionSet[]>([])
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
function handleClickItem(item: { currentIndex: number }) {
  current.value = item.currentIndex
  switch (current.value) {
    case 0:
      initCreatedQuestionSetList()
      break
    case 1:
      initJoinedQuestionSetList()
      break
    default:
      break
  }
}
function handleOpenQuestionSet(questionSet: QuestionSet) {
  openQuestionSet.value = questionSet
  openQuestionSetPopupRef.value.open('bottom')
}
async function handleStart() {
  if (!openQuestionSet.value?.id)
    return
  if (filter.mode === 'test') {
    // router.push({
    //   path: '/paper',
    //   query: {
    //     id: prepareOpenQuestionSet.value.id,
    //     status: 'do',
    //   },
    // })
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
async function initCreatedQuestionSetList() {
  if (!isLogin.value) {
    createdQuestionSetList.value = []
    return
  }
  isLoading.value.created = true
  const { err, data } = await getCreatedQuestionSet(loginState.account)
  if (!err && data)
    createdQuestionSetList.value = data
  isLoading.value.created = false
}
async function initJoinedQuestionSetList() {
  if (!isLogin.value) {
    joinedQuestionSetList.value = []
    return
  }
  isLoading.value.joined = true
  const { err, data } = await getJoinedQuestionSet(loginState.account)
  if (!err && data)
    joinedQuestionSetList.value = data
  isLoading.value.joined = false
}
onShow(() => {
  initCreatedQuestionSetList()
  initJoinedQuestionSetList()
})
watchEffect(initCreatedQuestionSetList)
watchEffect(initJoinedQuestionSetList)
</script>

<template>
  <view bg-gray-100 h-screen overflow-y-auto>
    <view bg-white p-4 sticky top-0 z-10 shadow>
      <view flex items-center>
        <image w-100 h-100 rounded-full src="../static/logo.png" alt="" />
        <view ml-4>
          <view v-if="isLogin" @click="handleOpenPopup">
            <view mb-1>
              {{ loginState.name }}
              <!-- tyl0923 -->
            </view>
            <view text-xs text-gray-400>
              点击查看更多
            </view>
          </view>
          <view v-else @click="handleGotoLogin">
            点击注册/登录
          </view>
        </view>
      </view>
    </view>
    <view>
      <view v-if="isLogin" mt-4 py-1 rounded-2 bg-white>
        <uni-segmented-control
          :current="current"
          :values="items"
          style-type="text"
          active-color="#007aff"
          @click-item="handleClickItem"
        />
      </view>
      <view px-2>
        <view v-if="current === 0">
          <template v-if="isLoading.created">
            <SkeletonCom v-for="i in 3" :key="i" type="questionSetCard" />
          </template>
          <template v-else>
            <QuestionSetCardCom
              v-for="questionSet in createdQuestionSetList"
              :key="questionSet.id"
              :data="questionSet"
              @click="handleOpenQuestionSet"
            />
          </template>
        </view>
        <view v-else-if="current === 1">
          <template v-if="isLoading.joined">
            <SkeletonCom v-for="i in 3" :key="i" type="questionSetCard" />
          </template>
          <template v-else>
            <QuestionSetCardCom
              v-for="questionSet in joinedQuestionSetList"
              :key="questionSet.id"
              :data="questionSet"
              @click="handleOpenQuestionSet"
            />
          </template>
        </view>
      </view>
    </view>
    <uni-popup ref="moreOperationPopupRef" background-color="#fff">
      <view p-4 flex flex-col items-center gap-y-4>
        <view>编辑资料</view>
        <view text-red-500 my-4 @click="logoutPopupRef.open()">
          退出登录
        </view>
      </view>
    </uni-popup>
    <uni-popup ref="openQuestionSetPopupRef" background-color="#fff">
      <view p-4>
        <view flex items-center justify-between gap-x-4 pb-4 border-b-1 border-gray-200>
          <button size="mini" @click="openQuestionSetPopupRef.close()">
            取消
          </button>
          <button bg-sky-500 text-white size="mini" @click="handleStart">
            开始
          </button>
        </view>
        <view h-300>
          <FilterCom :filter="filter" :options="filterOptions" />
        </view>
        <QuestionSetCardCom v-if="openQuestionSet" :data="openQuestionSet" />
      </view>
    </uni-popup>
    <uni-popup ref="logoutPopupRef" type="dialog">
      <uni-popup-dialog
        type="error"
        cancel-text="取消"
        confirm-text="确定"
        title="退出登录"
        @confirm="handleLogout"
      />
    </uni-popup>
  </view>
</template>
