<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { getRecommendQuestionSet } from '../lib/api'
const tabActive = ref('recommend')
const tabOptions = ref([
  {
    name: 'recommend',
    title: '推荐',
  },
  {
    name: 'test',
    title: '软考',
  },
])
const recommendQuestionSetList = ref<any>([])
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
      <van-search placeholder="搜索题库" />
      <van-tabs :active="tabActive" color="#0ea5e9">
        <van-tab v-for="tab in tabOptions" :key="tab.name" :title="tab.title" :name="tab.name">
          <view p-2>
            <template v-if="tabActive === 'recommend'">
              <view v-for="questionSet, index in recommendQuestionSetList" :key="index" p-2>
                <view flex items-end>
                  <h3>{{ questionSet.title }}</h3>
                  <h4>{{ questionSet.questions.length }}</h4>
                </view>
                <view />
                <view />
              </view>
            </template>
          </view>
        </van-tab>
      </van-tabs>
    </view>
  </view>
</template>

<style>

</style>
