<script setup lang="ts">
import type { QuestionSet } from '@exercise/type'
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    data: QuestionSet
    isShadow?: boolean
  }>(),
  {
    isShadow: true,
  },
)
const emits = defineEmits<{
  (e: 'click', questionSet: QuestionSet): void
}>()
const isDo = computed(() => {
  return props.data.questions ? props.data.questions.reduce((pre, cur) => { return pre + (cur.isDo === 1 ? 1 : 0) }, 0) : 0
})
const isError = computed(() => {
  return props.data.questions ? props.data.questions.reduce((pre, cur) => { return pre + (cur.isError === 1 ? 1 : 0) }, 0) : 0
})
const tagArr = computed(() => {
  return props.data.tags.length === 0 ? ['暂无标签'] : props.data.tags.split(',').slice(0, 3)
})
</script>

<template>
  <view
    :class="{
      'shadow': isShadow,
      'border-1 border-gray-100': !isShadow,
    }"
    p-4 bg-white my-2 rounded-1
    flex flex-col
    @click="emits('click', data)"
  >
    <view flex justify-between>
      <view>
        <view font-medium mb-2>
          {{ data.title }}
        </view>
        <view>
          <uni-tag
            v-for="tag in tagArr" :key="tag"
            mr-2 size="small" type="primary"
            inverted :text="tag"
          />
        </view>
      </view>
      <view flex flex-col items-center>
        <image w-70 h-70 rounded-full src="../static/logo.png" />
        <view text-xs text-gray-600 mt-2>
          {{ data.author.name }}
        </view>
      </view>
    </view>
    <view v-if="data.questions" mt-4>
      <view flex items-center gap-x-3 text-xs text-gray-500>
        <view>
          {{ ` 共 ${data.num} 题 ` }}
        </view>
        <view>
          {{ ` 已做 ${isDo} 题 ` }}
        </view>
        <view>
          {{ ` 做错 ${isError} 题 ` }}
        </view>
      </view>
      <view mt-1>
        <progress :percent="100 * isDo / data.num" border-radius="4" activeColor="#007aff" />
      </view>
    </view>
  </view>
</template>
