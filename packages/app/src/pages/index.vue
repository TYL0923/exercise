<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { getRecommendQuestionSet } from '../lib/api'
import SkeletonCom from '../components/SkeletonCom.vue'
const current = ref(0)
const recommendQuestionSetList = ref<any>([])
const items = ref(['推荐', '软考'])
function handleClickItem(item: any) {
  current.value = item.currentIndex
}
function handleGotoSearch() {
  uni.navigateTo({
    url: '/pages/search',
  })
}
async function initRecommendQuestionList() {
  const { err, data } = await getRecommendQuestionSet()
  if (!err && data)
    recommendQuestionSetList.value = data
}
watchEffect(initRecommendQuestionList)
</script>

<template>
  <view bg-gray-100 h-screen box-border>
    <view>
      <!-- <SkeletonCom /> -->
      <view bg-white @click="handleGotoSearch">
        <uni-search-bar readonly placeholder="搜索题库" bg-color="#EEEEEE" />
      </view>
      <view py-1 rounded-2 bg-white>
        <uni-segmented-control
          :current="current"
          :values="items"
          style-type="text"
          active-color="#007aff"
          @click-item="handleClickItem"
        />
      </view>
    </view>
  </view>
</template>

<style>

</style>
