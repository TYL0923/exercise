<script setup lang="ts">
import type { Question, QuestionType } from '@exercise/type'
import { useDebounceFn } from '../lib/utils'
import QuestionAnswerCom from './QuestionAnswerCom.vue'
const props = withDefaults(
  defineProps<{
    idx: number
    status?: 'do' | 'edit' | 'done'
    mode?: 'exercise' | 'test'
    question: Question
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

const handleChangeCorrectAnswer = useDebounceFn((answer: string) => {
  emits('changeAnswer', props.question.id, answer, 'correct')
}, 0)
const handleChangeTitle = useDebounceFn((e: Event) => {
  const title = (e as InputEvent).data || ''
  emits('changeTitle', props.question.id, title)
}, 350)
</script>

<template>
  <view mb-10>
    <!-- test -->
    <template v-if="status === 'do'">
      <text text-base text-gray-900>
        {{ `${idx + 1}.${question.title}` }}
      </text>
      <QuestionAnswerCom :question="question" :status="status" :mode="mode" @change-answer="handleChangeAnswer" />
    </template>

    <!-- done -->
    <template v-else-if="status === 'done'">
      <text text-base text-gray-900>
        {{ `${idx + 1}.${question.title}` }}
      </text>
      <QuestionAnswerCom :question="question" :status="status" :mode="mode" @change-answer="handleChangeAnswer" />
    </template>

    <!-- edit -->
    <template v-else>
      <textarea :rows="4" :value="question.title" @input="handleChangeTitle" />
      <!-- <div text-xs mt-2>
        {{ `正确答案: ` }}
      </div> -->
      <view mt-20>
        <QuestionAnswerCom
          :question="question" :status="status" :mode="mode"
          @change-correct-answer="handleChangeCorrectAnswer"
        />
      </view>
    </template>
  </view>
</template>
