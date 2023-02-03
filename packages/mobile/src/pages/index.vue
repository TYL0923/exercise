<script setup lang="ts">
import type { QuestionSet } from '@exercise/type'

const { queryJoinableQuestionSet } = useApi()
const router = useRouter()
const tabActive = ref(0)
const tabItems = ref(['推荐题库'])
const isLoading = ref<boolean>(false)
const loginState = useLogin()
const recommendQuestionSetList = ref<QuestionSet[]>([])
const { joinConfirmCom, showJoin } = useJoin()
function gotoSearch() {
  router.push('/search')
}
async function initrecommendQuestionSetList() {
  isLoading.value = true
  const { err, data } = await queryJoinableQuestionSet({
    account: loginState.account,
  })
  if (!err && data)
    recommendQuestionSetList.value = data
  isLoading.value = false
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
        <template v-if="isLoading">
          <SkeletonCom type="questionSetCard" />
        </template>
        <template v-else>
          <template v-if="recommendQuestionSetList.length === 0 ">
            <van-empty
              image="../static/empty.png"
              image-size="80"
              description="暂无推荐"
            />
          </template>
          <template v-else>
            <QuestionSetCardCom
              v-for="questionSet in recommendQuestionSetList"
              :key="questionSet.id" :data="questionSet"
              @click="showJoin(questionSet)"
            />
          </template>
        </template>
      </template>
    </div>
    <joinConfirmCom />
    <TabBarCom />
  </div>
</template>

<style>

</style>
