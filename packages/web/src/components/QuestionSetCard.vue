<script setup lang="ts">
import type { BaseReturnQuestionSet } from '@exercise/type'

const props = defineProps<{
  questionSet: BaseReturnQuestionSet
}>()
const total = computed(() => {
  return props.questionSet.questions.length
})
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
    w-80 h-48 rounded-2
    border border-gray-200 p-4
    transition-all duration-300
    hover="cursor-pointer shadow"
  >
    <div mb-4 flex items-center justify-between>
      <div>
        <h3>{{ questionSet.title }}</h3>
        <p mb-1>
          共{{ total }}题
        </p>
        <p mb-1>
          已做{{ isDo }}题
        </p>
        <p mb-0>
          做错{{ isError }}题
        </p>
      </div>
      <div flex flex-col items-center>
        <img w-20 h-20 rounded-full src="/using.jpeg" alt="">
        <p mt-2>
          TYL0923
        </p>
      </div>
    </div>
    <a-tooltip>
      <a-progress :show-info="false" :percent="isDo / total" :success="{ percent: isError / total, strokeColor: '#ef4444' }" />
    </a-tooltip>
  </div>
</template>
