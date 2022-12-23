<script setup lang="ts">
import type { QuestionSet } from '@exercise/type'
import { computed } from 'vue'

const props = defineProps<{
  data: QuestionSet
}>()
const emits = defineEmits<{
  (e: 'click', questionSet: QuestionSet): void
}>()
const tagArr = computed(() => {
  return props.data.tags.length === 0 ? ['暂无标签'] : props.data.tags.split(',').slice(0, 3)
})
</script>

<template>
  <view p-4 bg-white flex flex-col gap-y-2 rounded-2 my-2 shadow @click="emits('click', data)">
    <view flex items-center justify-between>
      <view text-xl text-gray-900 font-medium>
        {{ data.title }}
      </view>
      <view text-sm text-gray-400>
        {{ `${data.num} 题` }}
      </view>
    </view>
    <view flex items-center gap-x-1>
      <uni-tag v-for="tag in tagArr" :key="tag" size="small" type="primary" :inverted="true" :text="tag" />
    </view>
    <view flex items-center justify-between mt-2>
      <view flex items-center>
        <image w-60 h-60 rounded-full src="../static/logo.png" />
        <view ml-2 text-sm text-gray-600>
          {{ data.author.name }}
        </view>
      </view>
    </view>
  </view>
</template>
