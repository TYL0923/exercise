<script setup lang="ts">
import type { IQuestion } from '@exercise/type'
import { useDebounceFn } from '@vueuse/core'
const props = withDefaults(
  defineProps<{
    idx: number
    status?: 'test' | 'edit' | 'done'
    mode?: 'exercise' | 'test'
    question: IQuestion
  }>(),
  {
    status: 'test',
    mode: 'exercise',
  },
)
const emits = defineEmits<{
  (e: 'changeAnswer', id: string, answer: string, answerType: 'correct' | 'test' | 'exercise'): void
  (e: 'changeTitle', id: string, title: string): void
  (e: 'changeIsDo', id: string, isDo: 0 | 1): void
  (e: 'changeIsError', id: string, isError: 0 | 1): void
}>()
const answer = computed({
  get: () => {
    switch (props.mode) {
      case 'exercise':
        return props.question.exerciseAnswer
      case 'test':
        return props.question.testAnswer
      default:
        return props.question.exerciseAnswer
    }
  },
  set: (value) => {
    emits('changeAnswer', props.question.id, value, props.mode)
  },
})

const handleChangeAnswer = useDebounceFn((e: InputEvent, answerType: 'correct' | 'test' | 'exercise') => {
  const answer = e.data || ''
  emits('changeAnswer', props.question.id, answer, answerType)
}, 350)
const handleChangeTitle = useDebounceFn((e: InputEvent) => {
  const title = e.data || ''
  emits('changeTitle', props.question.id, title)
}, 350)
</script>

<template>
  <div mb-10>
    <template v-if="status !== 'edit'">
      <pre text-base text-gray-900>{{ `${idx + 1}.${question.title}` }}</pre>
      <QuestionAnswer v-model:value="answer" :type="question.type" />
    </template>

    <!-- edit -->
    <template v-else>
      <a-textarea :rows="4" :value="question.title" @input="handleChangeTitle" />
      <div flex items-end mt-2>
        <span text-xs>{{ `正确答案: ` }}</span>
        <span v-if="['select', 'judge'].includes(question.type)" border-b-1 border-gray-300 ml-2>
          <a-input p-0 :bordered="false" @input="handleChangeAnswer($event, 'correct')" />
        </span>
        <a-textarea v-else :rows="4" :value="question.title" @input="handleChangeAnswer($event, 'correct')" />
      </div>
    </template>
  </div>
</template>
