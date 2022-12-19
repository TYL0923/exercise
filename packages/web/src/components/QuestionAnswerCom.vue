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
const answer = computed({
  get: () => {
    if (props.status === 'edit')
      return props.question.correctAnswer
    if (props.mode === 'exercise')
      return props.question.exerciseAnswer
    if (props.mode === 'test')
      return props.question.testAnswer
    return ''
  },
  set: (value) => {
    if (props.status === 'edit')
      emits('changeCorrectAnswer', value)
    else
      emits('changeAnswer', value)
  },
})
const answerOption = reactive({
  select: [
    {
      label: 'A',
      value: 'A',
    },
    {
      label: 'B',
      value: 'B',
    },
    {
      label: 'C',
      value: 'C',
    },
    {
      label: 'D',
      value: 'D',
    },
  ],
  judge: [
    {
      label: '正确',
      value: 'Y',
    },
    {
      label: '错误',
      value: 'N',
    },
  ],
})

const doneIsSelected = computed(() => {
  return (value: string) => answer.value === value
})

const doneClass = computed(() => {
  return (value: string) => {
    const isRelated
      = [props.question.correctAnswer, answer.value]
        .includes(value)
    if (!isRelated)
      return ''
    if (props.question.correctAnswer === answer.value)
      return 'success'
    return value === props.question.correctAnswer ? '' : 'error'
  }
})

const correctAnswer = computed(() => {
  const handle: Record<QuestionType, string> = {
    select: props.question.correctAnswer || '-',
    judge: {
      Y: '正确',
      N: '错误',
    }[props.question.correctAnswer] || '-',
  }
  return ` ${handle[props.question.type]}`
})
</script>

<template>
  <div>
    <!-- do -->
    <template v-if="status === 'do'">
      <template v-if="question.type === 'select'">
        <a-radio-group v-model:value="answer">
          <a-radio
            v-for="item in answerOption.select"
            :key="item.value"
            :value="item.value"
          >
            {{ item.label }}
          </a-radio>
        </a-radio-group>
        <!-- <a-radio-group v-model:value="selected" :options="answerOption[type]" /> -->
      </template>
      <template v-else-if="question.type === 'judge'">
        <a-radio-group
          v-model:value="answer" option-type="button"
          :options="answerOption.judge"
        />
      </template>
    </template>

    <!-- edit -->
    <template v-else-if="status === 'edit'">
      <template v-if="question.type === 'select'">
        <a-radio-group v-model:value="answer">
          <a-radio
            v-for="item in answerOption.select"
            :key="item.value"
            :value="item.value"
          >
            {{ item.label }}
          </a-radio>
        </a-radio-group>
      </template>
      <template v-else-if="question.type === 'judge'">
        <a-radio-group
          v-model:value="answer"
          option-type="button"
          :options="answerOption.judge"
        />
      </template>
    </template>

    <!-- done -->
    <template v-else-if="status === 'done'">
      <template v-if="question.type === 'select'">
        <div>
          <a-radio
            v-for="item in answerOption.select" :key="item.value"
            :checked="doneIsSelected(item.value)"
            :class="doneClass(item.value)"
          >
            {{ item.label }}
          </a-radio>
          <div mt-2>
            <span>正确答案:</span>
            <span>{{ correctAnswer }}</span>
          </div>
        </div>
      </template>
      <template v-else-if="question.type === 'judge'">
        <div>
          <a-radio-button
            v-for="item in answerOption.judge" :key="item.value"
            :checked="doneIsSelected(item.value)"
            :class="doneClass(item.value)"
          >
            {{ item.label }}
          </a-radio-button>
          <div mt-4>
            <span>正确答案:</span>
            <span>{{ correctAnswer }}</span>
          </div>
        </div>
      </template>
    </template>
  </div>
</template>

<style lang="less">
.error {
  .ant-radio-inner {
    border-color: #ef4444;
    &::after {
      background-color: #ef4444;
    }
  }
  &.ant-radio-button-wrapper {
    border-color: #ef4444 !important;
    color: #ef4444;
    &::before {
      background-color: #ef4444;
    }
  }
}
.success {
  .ant-radio-inner {
    border-color: #22c55e;
    &::after {
      background-color: #22c55e;
    }
  }
  &.ant-radio-button-wrapper {
    border-color: #22c55e !important;
    color: #22c55e;
    &::before {
      background-color: #22c55e;
    }
  }
}
</style>
