<script setup lang="ts">
import type { Question, QuestionType } from '@exercise/type'
const props = withDefaults(
  defineProps<{
    status: 'do' | 'done' | 'edit'
    mode: 'test' | 'exercise'
    question: Question
  }>(),
  {},
)
const emits = defineEmits<{
  (e: 'changeAnswer', answer: string): void
  (e: 'changeCorrectAnswer', answer: string): void
}>()

const isSelected = computed(() => {
  let answer = ''
  switch (props.status) {
    case 'edit':
      answer = props.question.correctAnswer
      break
    default:
      answer = props.mode === 'exercise' ? props.question.exerciseAnswer : props.question.testAnswer
      break
  }
  return (curAnswer: string) => answer === curAnswer
})
const isCorrectOrError = computed(() => {
  return (value: string) => {
    if (props.status !== 'done')
      return ''
    const answer = props.mode === 'test' ? props.question.testAnswer : props.question.exerciseAnswer
    if (answer.length === 0)
      return ''
    if (value === answer)
      return answer !== props.question.correctAnswer ? 'error' : 'correct'
    return ''
  }
})

const options = computed(() => {
  let idx = 65
  return Array.isArray(props.question.options)
    ? props.question.options.reduce((pre, cur) => {
      const op = [String.fromCodePoint(idx), cur]
      idx++
      pre.push(op)
      return pre
    }, [] as string[][])
    : props.question.options!.split(',').reduce((pre, cur) => {
      const op = [String.fromCodePoint(idx), cur]
      idx++
      pre.push(op)
      return pre
    }, [] as string[][])
})
</script>

<template>
  <div>
    <!-- do -->
    <template v-if="status === 'do'">
      <template v-if="['select', 'judge'].includes(question.type)">
        <div
          v-for="option in options" :key="option[0]"
          h-10 px-4
          class="question-option"
          flex items-center hover="bg-sky-50 cursor-pointer"
          :class="isSelected(option[1]) ? 'selected' : ''"
          @click="emits('changeAnswer', option[1])"
        >
          <div flex-1>
            {{ `${option[0]}. ${option[1]}` }}
          </div>
        </div>
      </template>
    </template>

    <!-- edit -->
    <template v-else-if="status === 'edit'">
      <template v-if="['select', 'judge'].includes(question.type)">
        <div
          v-for="option in options"
          :key="option[0]" class="question-option"
          h-10 px-4
          flex items-center hover="bg-sky-50 cursor-pointer"
          :class="isSelected(option[1]) ? 'border-l-1' : ''"
          @click="emits('changeCorrectAnswer', option[1])"
        >
          <div flex-1>
            {{ `${option[0]}. ${option[1]}` }}
          </div>
        </div>
      </template>
    </template>

    <!-- done -->
    <template v-else-if="status === 'done'">
      <template v-if="['select', 'judge'].includes(question.type)">
        <div
          v-for="option in options"
          :key="option[0]" class="question-option"
          h-10 px-4
          flex items-center hover="bg-sky-50 cursor-pointer"
          :class="isCorrectOrError(option[1])"
          @click="emits('changeCorrectAnswer', option[1])"
        >
          <div flex-1>
            {{ `${option[0]}. ${option[1]}` }}
          </div>
        </div>
        <div mt-2>
          <span text-xs font-semibold mr-2>正确答案:</span>
          <span font-semibold text-sm>{{ question.correctAnswer || '-' }}</span>
        </div>
      </template>
    </template>
  </div>
</template>

<style lang="less">
.question-option {
  position: relative;
  &.selected {
    &::after {
      content: '';
      // transition: .3s;
      display: inline-block;
      position: absolute;
      width: 3px;
      height: 60%;
      left: 6px;
      background-color: #0ea5e9;
    }
  }
  &.correct {
    &::after {
      content: '';
      // transition: .3s;
      display: inline-block;
      position: absolute;
      width: 3px;
      height: 60%;
      left: 6px;
      background-color: #22c55e;
    }
  }
  &.error {
    &::after {
      content: '';
      // transition: .3s;
      display: inline-block;
      position: absolute;
      width: 3px;
      height: 60%;
      left: 6px;
      background-color: #ef4444;
    }
  }
}
// .error {
//   .ant-radio-inner {
//     border-color: #ef4444;
//     &::after {
//       background-color: #ef4444;
//     }
//   }
//   &.ant-radio-button-wrapper {
//     border-color: #ef4444 !important;
//     color: #ef4444;
//     &::before {
//       background-color: #ef4444;
//     }
//   }
// }
// .success {
//   .ant-radio-inner {
//     border-color: #22c55e;
//     &::after {
//       background-color: #22c55e;
//     }
//   }
//   &.ant-radio-button-wrapper {
//     border-color: #22c55e !important;
//     color: #22c55e;
//     &::before {
//       background-color: #22c55e;
//     }
//   }
// }
</style>
