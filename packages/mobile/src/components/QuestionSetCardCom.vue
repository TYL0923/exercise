<script setup lang="ts">
import type { QuestionSet } from '@exercise/type'

const props = withDefaults(
  defineProps<{
    data: QuestionSet
    isShadow?: boolean
  }>(),
  {
    isShadow: false,
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
  <div
    :class="{
      'shadow': isShadow,
      'border-1 border-gray-100': !isShadow,
    }"
    p-4 bg-white my-2 rounded-2
    flex flex-col
    @click="emits('click', data)"
  >
    <div flex justify-between>
      <div>
        <div font-medium mb-2>
          {{ data.title }}
        </div>
        <div>
          <van-tag
            v-for="tag in tagArr" :key="tag"
            mr-2 size="medium"
            color="#e0f2fe" text-color="#0ea5e9"
          >
            {{ tag }}
          </van-tag>
        </div>
      </div>
      <div flex flex-col items-center>
        <img w-10 h-10 rounded-full src="/user.png">
        <div text-xs text-gray-600 mt-2>
          {{ data.author.name }}
        </div>
      </div>
    </div>
    <div v-if="data.questions" mt-4>
      <div flex items-center gap-x-3 text-xs text-gray-500>
        <div>
          {{ ` 共 ${data.num} 题 ` }}
        </div>
        <div>
          {{ ` 已做 ${isDo} 题 ` }}
        </div>
        <div>
          {{ ` 做错 ${isError} 题 ` }}
        </div>
      </div>
      <div mt-1>
        <van-progress :percentage="100 * isDo / data.num" :show-pivot="false" />
      </div>
    </div>
  </div>
</template>
