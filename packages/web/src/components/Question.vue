<script setup lang="ts">
import type { IQuestion, QuestionType } from '@exercise/type'
import { useDebounceFn } from '@vueuse/core'
const props = withDefaults(
  defineProps<{
    idx: number
    status?: 'do' | 'edit' | 'done'
    mode?: 'exercise' | 'test'
    question: IQuestion
  }>(), {
    status: 'do',
    mode: 'test',
  },
)
const emits = defineEmits<{
  (e: 'changeAnswer', id: string, answer: string, answerType: 'correct' | 'test' | 'exercise'): void
  (e: 'changeTitle', id: string, title: string): void
  (e: 'changeIsDo', id: string, isDo: 0 | 1): void
  (e: 'changeIsError', id: string, isError: 0 | 1): void
}>()

const handleChangeAnswer = useDebounceFn((answer: string) => {
  emits('changeAnswer', props.question.id, answer, props.mode)
}, 0)

const handleChangeCorrectAnswer = useDebounceFn((e: InputEvent) => {
  const answer = e.data || ''
  emits('changeAnswer', props.question.id, answer, 'correct')
}, 350)
const handleChangeTitle = useDebounceFn((e: InputEvent) => {
  const title = e.data || ''
  emits('changeTitle', props.question.id, title)
}, 350)
</script>

<template>
  <div mb-10>
    <!-- test -->
    <template v-if="status === 'do'">
      <pre text-base text-gray-900>{{ `${idx + 1}.${question.title}` }}</pre>
      <QuestionAnswer :question="question" :status="status" :mode="mode" @change-answer="handleChangeAnswer" />
    </template>

    <!-- done -->
    <template v-else-if="status === 'done'">
      <pre text-base text-gray-900>{{ `${idx + 1}.${question.title}` }}</pre>
      <QuestionAnswer :question="question" :status="status" :mode="mode" @change-answer="handleChangeAnswer" />
    </template>

    <!-- edit -->
    <template v-else>
      <a-textarea :rows="4" :value="question.title" @input="handleChangeTitle" />
      <div flex items-end mt-2>
        <span text-xs>{{ `正确答案: ` }}</span>
        <span v-if="['select', 'judge'].includes(question.type)" border-b-1 border-gray-300 ml-2>
          <a-input p-0 :bordered="false" @input="handleChangeCorrectAnswer($event)" />
        </span>
        <a-textarea v-else :rows="4" :value="question.title" @input="handleChangeCorrectAnswer($event)" />
      </div>
    </template>
  </div>
</template>
