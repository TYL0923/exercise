<script setup lang="ts">
import type { IQuestion } from '@exercise/type'
import { integration } from '@exercise/util'
const props = withDefaults(
  defineProps<{
    list: IQuestion[]
  }>(),
  {},
)
const questionSet = computed(() => {
  return integration(props.list, 'type')
})
const questionTypeMap: Record<string, string> = {
  select: '选择题',
  judge: '判断题',
}
</script>

<template>
  <div>
    <div v-for="set, index in questionSet" :key="index">
      <h5>{{ questionTypeMap[index] }}</h5>
      <Question v-for="question, idx in set" v-bind="$attrs" :key="question.id" :idx="idx" :question="question" />
    </div>
  </div>
</template>
