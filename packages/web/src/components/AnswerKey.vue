<script setup lang="ts">
import type { IQuestion } from '@exercise/type'
import { integration } from '@exercise/util'

const props = withDefaults(
  defineProps<{
    list: IQuestion[]
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
  if (props.status === 'do') {
    if (props.mode === 'test')
      return (question: IQuestion) => question.testAnswer.length > 0 ? 'primary' : 'default'
    else
      return (question: IQuestion) => question.exerciseAnswer.length > 0 ? 'primary' : 'default'
  }
  else {
    if (props.mode === 'test')
      return (question: IQuestion) => question.correctAnswer === question.testAnswer ? 'success' : 'error'
    else
      return (question: IQuestion) => question.correctAnswer === question.exerciseAnswer ? 'success' : 'error'
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
.ant-btn-success {
  background-color: #22c55e;
  border-color: #22c55e;
  color: #fff;
}
.ant-btn-error {
  background-color: #ef4444;
  border-color: #ef4444;
  color: #fff;
}
</style>
