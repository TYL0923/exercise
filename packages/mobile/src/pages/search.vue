<script setup lang="ts">
import type { QuestionSet } from '@exercise/type'
import { showConfirmDialog, showNotify } from 'vant'
import { joinQuestionSetById, queryJoinableQuestionSet } from '../lib/api'
import { useDebounceFn } from '../lib/utils'
import { useLoginState } from '../composables'
const loginState = useLoginState()

const searchKeyWord = ref<string>('')

const isLoading = ref<boolean>(false)
const isJoinShow = ref<boolean>(false)

const joinableQuestionSetList = ref<QuestionSet[]>([])
const joinQuestionSet = ref<QuestionSet>()
function leftCilck() {
  uni.navigateTo({
    url: '/pages/index',
  })
}
function showJoin(questionSet: QuestionSet) {
  joinQuestionSet.value = questionSet
  isJoinShow.value = true
}
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

// function handleOpenJoinQuestionSet(questionSet: QuestionSet) {
//   joinQuestionSet.value = questionSet
//   popupRef.value.open('bottom')
// }

async function handleJoinQuestionSet() {
  if (!joinQuestionSet.value)
    return
  showConfirmDialog({
    title: '确认',
    message: '确认加入题库',
  })
    .then(async () => {
    // on confirm
      isJoinShow.value = false
      uni.showLoading({
        title: '加入中',
      })
      const { err, data } = await joinQuestionSetById(joinQuestionSet.value!.id, loginState.account)
      if (!err && data) {
        showNotify({
          type: 'success',
          message: '加入成功',
          duration: 350,
        })
      }
      else {
        showNotify({
          type: 'danger',
          message: '加入失败',
          duration: 350,
        })
      }
      initjoinableQuestionSetList('')
      uni.hideLoading()
    })
    .catch(() => {
    // on cancel
    })
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
    <view flex items-center bg-white px-2 justify-around>
      <van-icon name="arrow-left" size="24" @click="leftCilck" />
      <van-search v-model="searchKeyWord" class="w-80%" shape="round" placeholder="输入关键字搜索" />
      <view>搜索</view>
    </view>
    <view px-2>
      <template v-if="isLoading">
        <SkeletonCom type="questionSetCard" />
      </template>
      <template v-else>
        <QuestionSetCardCom
          v-for="questionSet in joinableQuestionSetList"
          :key="questionSet.id"
          :data="questionSet"
          @click="showJoin(questionSet)"
        />
      </template>
    </view>
    <van-action-sheet v-model:show="isJoinShow">
      <view p-4>
        <view flex items-center justify-around mt-2 mb-4>
          <van-button>
            取消
          </van-button>
          <van-button type="primary" @click="handleJoinQuestionSet">
            加入
          </van-button>
        </view>
        <QuestionSetCardCom
          v-if="joinQuestionSet"
          :data="joinQuestionSet"
          :is-shadow="false"
        />
      </view>
    </van-action-sheet>
  </view>
</template>
