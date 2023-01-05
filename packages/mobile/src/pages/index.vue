<script setup lang="ts">
import type { QuestionSet } from '@exercise/type'
import { useJoinConfirm, useLoginState } from '../composables'
import { queryJoinableQuestionSet } from '../lib/api'

const tabActive = ref(0)
const tabItems = ref(['推荐题库'])
const loginState = useLoginState()
const recommendQuestionSetList = ref<QuestionSet[]>([])
const { joinConfirmCom, showJoin } = useJoinConfirm()

function gotoSearch() {
  uni.navigateTo({
    url: '/pages/search',
  })
}
async function initrecommendQuestionSetList() {
  const { err, data } = await queryJoinableQuestionSet({
    account: loginState.account,
  })
  if (!err && data)
    recommendQuestionSetList.value = data
}
watchEffect(initrecommendQuestionSetList)
</script>

<template>
  <div bg-gray-50 h-screen box-border>
    <div bg-white>
      <van-search text-xs shape="round" placeholder="点击搜索题库" disabled @click="gotoSearch" />
      <van-tabs v-model:active="tabActive" shrink>
        <van-tab v-for="item in tabItems" :key="item" :title="item" />
      </van-tabs>
    </div>
    <div px-2>
      <template v-if="tabActive === 0">
        <QuestionSetCardCom
          v-for="questionSet in recommendQuestionSetList"
          :key="questionSet" :data="questionSet"
          @click="showJoin(questionSet)"
        />
      </template>
    </div>
    <joinConfirmCom />
    <TabBarCom />
  </div>
</template>

<style>

</style>
