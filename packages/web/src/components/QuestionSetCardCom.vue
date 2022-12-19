<script setup lang="ts">
import type { QuestionSet } from '@exercise/type'

const props = defineProps<{
  questionSet: QuestionSet
}>()
const isDo = computed(() => {
  return props.questionSet.questions.reduce((pre, cur) => { return pre + (cur.isDo === 1 ? 1 : 0) }, 0)
})
const isError = computed(() => {
  return props.questionSet.questions.reduce((pre, cur) => { return pre + (cur.isError === 1 ? 1 : 0) }, 0)
})
</script>

<template>
  <div
    flex flex-col justify-between
    rounded-2
    border border-gray-200 p-4
    transition-all duration-300
    hover="cursor-pointer shadow"
  >
    <div mb-4 flex items-center justify-between>
      <div>
        <h3>{{ questionSet.title }}</h3>
        <p mb-1>
          {{ `共 ${questionSet.num} 题` }}
        </p>
        <p mb-1>
          {{ `已做 ${isDo} 题` }}
        </p>
        <p mb-0>
          {{ `做错 ${isError} 题` }}
        </p>
      </div>
      <div flex flex-col items-center>
        <img w-16 h-16 rounded-full src="/using.jpeg" alt="">
        <p mt-2>
          {{ questionSet.author.name || '-' }}
        </p>
      </div>
    </div>
    <a-tooltip>
      <a-progress :show-info="false" :percent="100 * isDo / questionSet.num" :success="{ percent: 100 * isError / questionSet.num, strokeColor: '#ef4444' }" />
    </a-tooltip>
  </div>
</template>
