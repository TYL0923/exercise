<script setup lang="ts">
import type { QuestionSet } from '@exercise/type'
import { ref, watch } from 'vue'
import { joinQuestionSetById, queryJoinableQuestionSet } from '../lib/api'
import { useDebounceFn } from '../lib/utils'
import QuestionSetCardCom from '../components/QuestionSetCardCom.vue'
import { useLoginState } from '../composables'
const loginState = useLoginState()
const searchKeyWord = ref<string>('')
const popupRef = ref<any>(null)
const joinPopupRef = ref<any>(null)
const messageRef = ref<any>(null)
const isLoading = ref<boolean>(false)
const isJoinSuccess = ref<boolean>(true)
const joinableQuestionSetList = ref<QuestionSet[]>([])
const joinQuestionSet = ref<QuestionSet>()
const initjoinableQuestionSetList = useDebounceFn(async (key: string) => {
  const byIdPro = queryJoinableQuestionSet({
    id: key,
    account: loginState.account,
  })
  const byAuthorPro = queryJoinableQuestionSet({
    author: key,
    account: loginState.account,
  })
  const byKeyWordPro = queryJoinableQuestionSet({
    keyWord: key,
    account: loginState.account,
  })
  isLoading.value = true
  Promise.all([byIdPro, byAuthorPro, byKeyWordPro])
    .then(([byIdRes, byAuthorRes, byKeyWordRes]) => {
      let data: QuestionSet[] = []
      !byIdRes.err && byIdRes.data && data.push(...byIdRes.data)
      !byAuthorRes.err && byAuthorRes.data && data.push(...byAuthorRes.data)
      !byKeyWordRes.err && byKeyWordRes.data && data.push(...byKeyWordRes.data)
      const set = new Set()
      data = data.filter(item => !set.has(item.id) && set.add(item.id))
      joinableQuestionSetList.value = data
    })
    .catch(() => {})
    .finally(() => isLoading.value = false)
}, 350)

function handleOpenJoinQuestionSet(questionSet: QuestionSet) {
  joinQuestionSet.value = questionSet
  popupRef.value.open('bottom')
}

async function handleJoinQuestionSet() {
  if (!joinQuestionSet.value)
    return
  uni.showLoading({
    title: '加入中',
  })
  popupRef.value.close()
  const { err, data } = await joinQuestionSetById(joinQuestionSet.value.id, loginState.account)
  if (!err && data)
    isJoinSuccess.value = true
  else
    isJoinSuccess.value = false
  initjoinableQuestionSetList('')
  messageRef.value.open()
  uni.hideLoading()
}
watch(
  searchKeyWord,
  (newKey) => {
    initjoinableQuestionSetList(newKey)
  },
  {
    immediate: true,
  },
)
</script>

<template>
  <view bg-gray-100 h-screen overflow-y-auto>
    <view bg-white shadow sticky top-0>
      <uni-search-bar v-model="searchKeyWord" flex-1 placeholder="搜索题库" bg-color="#EEEEEE" />
    </view>
    <view px-2>
      <view v-if="isLoading" h-500 flex flex-col items-center justify-center>
        <uni-load-more status="loading" />
      </view>
      <template v-else>
        <QuestionSetCardCom
          v-for="questionSet in joinableQuestionSetList"
          :key="questionSet.id"
          :data="questionSet"
          @click="handleOpenJoinQuestionSet"
        />
      </template>
    </view>
    <uni-popup ref="popupRef" background-color="#fff">
      <view p-4>
        <view flex items-center justify-between gap-x-4 mb-4>
          <button size="mini" @click="popupRef.close()">
            取消
          </button>
          <button bg-sky-500 text-white size="mini" @click="joinPopupRef.open()">
            加入
          </button>
        </view>
        <QuestionSetCardCom v-if="joinQuestionSet" :data="joinQuestionSet" />
      </view>
    </uni-popup>
    <uni-popup ref="joinPopupRef" type="dialog">
      <uni-popup-dialog
        type="info"
        cancel-text="取消"
        confirm-text="确定"
        title="加入题库"
        @confirm="handleJoinQuestionSet"
      />
    </uni-popup>
    <uni-popup ref="messageRef" type="message">
      <uni-popup-message
        :type="isJoinSuccess ? 'success' : 'error'"
        :message="isJoinSuccess ? '加入成功' : '加入失败'"
        :duration="350"
      />
    </uni-popup>
  </view>
</template>
