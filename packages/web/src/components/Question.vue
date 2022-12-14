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

const handleChangeCorrectAnswer = useDebounceFn((answer: string) => {
  emits('changeAnswer', props.question.id, answer, 'correct')
}, 0)
const handleChangeTitle = useDebounceFn((e: Event) => {
  const title = (e as InputEvent).data || ''
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

    <!--  -->
    <template v-else>
      <a-textarea :rows="4" :value="question.title" @input="handleChangeTitle" />
      <div flex items-center mt-2>
        <span text-xs mr-2>{{ `正确答案: ` }}</span>
        <div>
          <QuestionAnswer
            :question="question" :status="status" :mode="mode"
            @change-correct-answer="handleChangeCorrectAnswer"
          />
        </div>
      </div>
    </template>
  </div>
</template>
