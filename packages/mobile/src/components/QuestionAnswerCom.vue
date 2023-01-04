<script setup lang="ts">
import type { Question, QuestionType } from '@exercise/type'
import { computed } from 'vue'
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
  <view>
    <!-- do -->
    <template v-if="status === 'do'">
      <template v-if="['select', 'judge'].includes(question.type)">
        <view
          v-for="option in options" :key="option[0]"
          h-80 px-4
          class="question-option"
          flex items-center hover="bg-sky-50 cursor-pointer"
          :class="{ selected: isSelected(option[1]) }"
          @click="emits('changeAnswer', option[1])"
        >
          <view flex-1>
            {{ `${option[0]}. ${option[1]}` }}
          </view>
        </view>
      </template>
    </template>

    <!-- edit -->
    <template v-else-if="status === 'edit'">
      <template v-if="['select', 'judge'].includes(question.type)">
        <view
          v-for="option in options"
          :key="option[0]" class="question-option"
          h-10 px-4
          flex items-center hover="bg-sky-50 cursor-pointer"
          :class="{ selected: isSelected(option[1]) }"
          @click="emits('changeCorrectAnswer', option[1])"
        >
          <view flex-1>
            {{ `${option[0]}. ${option[1]}` }}
          </view>
        </view>
      </template>
    </template>

    <!-- done -->
    <template v-else-if="status === 'done'">
      <template v-if="['select', 'judge'].includes(question.type)">
        <view
          v-for="option in options"
          :key="option[0]" class="question-option"
          h-80 px-4
          flex items-center hover="bg-sky-50 cursor-pointer"
          :class="isCorrectOrError(option[1])"
          @click="emits('changeCorrectAnswer', option[1])"
        >
          <view flex-1>
            {{ `${option[0]}. ${option[1]}` }}
          </view>
        </view>
        <view mt-2>
          <view text-xs font-semibold mr-2>
            正确答案:
          </view>
          <view font-semibold text-sm>
            {{ question.correctAnswer || '-' }}
          </view>
        </view>
      </template>
    </template>
  </view>
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
</style>
