<script setup lang="ts">
import type { Question } from '@exercise/type'
import { integration } from '@exercise/util'

const props = withDefaults(
  defineProps<{
    list: Question[]
    status: 'do' | 'done'
    mode: 'exercise' | 'test'
  }>(),
  {},
)
const answerKey = computed(() => {
  return integration(props.list, 'type')
})
const questionTypeMap: Record<string, string> = {
  select: '选择题',
  judge: '判断题',
}
const buttonType = computed(() => {
  return (question: Question) => props.status !== 'do'
    ? 'primary'
    : props.mode === 'test'
      ? question.testAnswer.length > 0 ? 'primary' : 'default'
      : question.exerciseAnswer.length > 0 ? 'primary' : 'default'
})
const doneClass = computed(() => {
  return (question: Question) => {
    return props.status === 'do'
      ? ''
      : props.mode === 'test'
        ? question.testAnswer !== question.correctAnswer || question.testAnswer === '' ? 'error' : 'success'
        : question.exerciseAnswer !== question.correctAnswer || question.exerciseAnswer === '' ? 'error' : 'success'
  }
})
const gotoAnchor = (id: string) => {
  const oQuestion = document.querySelector(`*[anchor='${id}']`)
  oQuestion?.classList.add('active')
  // setTimeout(() => {
  //   if (oQuestion?.classList.contains('active'))
  //     oQuestion?.classList.remove('active')
  // }, 2000)
  oQuestion?.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
  })
}
function handleClick(id: string) {
  gotoAnchor(id)
}
</script>

<template>
  <div>
    <div v-for="set, index in answerKey" :key="index" mb-6>
      <h5>{{ questionTypeMap[index] }}</h5>
      <div class="grid-container">
        <a-button
          v-for="item, idx in set" :key="item.id"
          size="small"
          :type="buttonType(item)"
          :class="doneClass(item)"
          @click="handleClick(item.id)"
        >
          {{ idx + 1 }}
        </a-button>
      </div>
    </div>
  </div>
</template>

<style lang="less">
.grid-container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-gap: 1rem;
}
.ant-btn {
  &.success {
    background-color: #22c55e;
    border-color: #22c55e;
    color: #fff;

  }
  &.error {

    background-color: #ef4444;
    border-color: #ef4444;
    color: #fff;
  }
}
</style>
