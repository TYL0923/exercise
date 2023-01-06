<script setup lang="ts">
import type { QuestionSet } from '@exercise/type'
import { queryJoinableQuestionSet } from '../lib/api'
import { useDebounceFn } from '../lib/utils'
import { useJoin, useLoginState } from '../composables'
const loginState = useLoginState()
const { joinConfirmCom, showJoin } = useJoin()
const searchKeyWord = ref<string>('')

const isLoading = ref<boolean>(false)

const joinableQuestionSetList = ref<QuestionSet[]>([])
function leftCilck() {
  uni.navigateTo({
    url: '/pages/index',
  })
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
  <div bg-gray-100 h-screen overflow-y-auto>
    <div flex items-center bg-white px-2 justify-around>
      <van-icon name="arrow-left" size="24" @click="leftCilck" />
      <van-search v-model="searchKeyWord" class="w-80%" shape="round" placeholder="输入关键字搜索" />
      <div>搜索</div>
    </div>
    <div px-2>
      <template v-if="isLoading">
        <SkeletonCom type="questionSetCard" />
      </template>
      <template v-else>
        <template v-if="joinableQuestionSetList.length === 0 ">
          <van-empty
            image="../static/empty.png"
            image-size="80"
            description="无结果"
          />
        </template>
        <template v-else>
          <QuestionSetCardCom
            v-for="questionSet in joinableQuestionSetList"
            :key="questionSet.id"
            :data="questionSet"
            @click="showJoin(questionSet)"
          />
        </template>
      </template>
    </div>
    <joinConfirmCom />
  </div>
</template>
