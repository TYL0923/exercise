<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app'
import type { QuestionSet } from '@exercise/type'
import { useLoginState, useTabBar } from '../composables'
import { getCreatedQuestionSet, getJoinedQuestionSet } from '../lib/api'

const tabActive = ref(0)
const tabItems = ref(['创建的题库', '加入的题库'])
const loginState = useLoginState()
const isLogin = computed(() => !!loginState.account)
const createdQuestionSetList = ref<QuestionSet[]>([])
const joinedQuestionSetList = ref<QuestionSet[]>([])
const isLoading = ref<{
  created: boolean
  joined: boolean
}>({
  created: false,
  joined: false,
})
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
watch(tabActive, (value) => {
  switch (value) {
    case 0:
      initCreatedQuestionSetList()
      break
    case 1:
      initJoinedQuestionSetList()
      break
    default:
      break
  }
})
onShow(() => {
  initCreatedQuestionSetList()
  initJoinedQuestionSetList()
})
watchEffect(initCreatedQuestionSetList)
watchEffect(initJoinedQuestionSetList)
</script>

<template>
  <view h-screen bg-gray-50 overflow-y-auto>
    <view flex flex-col-reverse h-160px bg-white>
      <view bg-transparent pb-1>
        <van-tabs v-model:active="tabActive" background="transparent" shrink>
          <van-tab v-for="item in tabItems" :key="item" :title="item" />
        </van-tabs>
      </view>
    </view>
    <view px-3 pt-1 pb-100px>
      <template v-if="tabActive === 0">
        <template v-if="isLoading.created">
          <SkeletonCom type="questionSetCard" />
        </template>
        <template v-else>
          <QuestionSetCardCom
            v-for="questionSet in createdQuestionSetList"
            :key="questionSet.id"
            :data="questionSet"
          />
        </template>
      </template>
      <template v-else-if="tabActive === 1">
        <template v-if="isLoading.joined">
          <SkeletonCom type="questionSetCard" />
        </template>
        <template v-else>
          <QuestionSetCardCom
            v-for="questionSet in joinedQuestionSetList"
            :key="questionSet.id"
            :data="questionSet"
          />
        </template>
      </template>
    </view>
    <TabBarCom />
  </view>
</template>
