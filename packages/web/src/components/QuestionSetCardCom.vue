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
const tagArr = computed(() => {
  return props.questionSet.tags.length === 0 ? ['暂无标签'] : props.questionSet.tags.split(',').slice(0, 3)
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
    <div flex justify-between>
      <div>
        <h3>{{ questionSet.title }}</h3>
        <div>
          <a-tag v-for="tag in tagArr" :key="tag" color="blue" my-1>
            {{ tag }}
          </a-tag>
        </div>
      </div>
      <div flex flex-col items-center>
        <img w-10 h-10 rounded-full src="/using.jpeg" alt="">
        <p mt-2>
          {{ questionSet.author.name || '-' }}
        </p>
      </div>
    </div>
    <div>
      <div flex items-center gap-x-3 text-xs>
        <span>
          {{ ` 共 ${questionSet.num} 题 ` }}
        </span>
        <span>
          {{ ` 已做 ${isDo} 题 ` }}
        </span>
        <span>
          {{ ` 做错 ${isError} 题 ` }}
        </span>
      </div>
      <a-tooltip>
        <a-progress :show-info="false" :percent="100 * isDo / questionSet.num" :success="{ percent: 100 * isError / questionSet.num, strokeColor: '#ef4444' }" />
      </a-tooltip>
    </div>
  </div>
</template>
