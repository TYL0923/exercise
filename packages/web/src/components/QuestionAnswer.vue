<script setup lang="ts">
import type { IQuestion } from '@exercise/type'

const props = withDefaults(
  defineProps<{
    status: 'do' | 'done'
    mode: 'test' | 'exercise'
    question: IQuestion
  }>(),
  {

  },
)
const emits = defineEmits<{
  (e: 'changeAnswer', answer: string): void
}>()
const answer = computed({
  get: () => {
    switch (props.mode) {
      case 'exercise':
        return props.question.exerciseAnswer
      case 'test':
        return props.question.testAnswer
      default:
        return ''
    }
  },
  set: (value) => {
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
      value: 'yes',
    },
    {
      label: '错误',
      value: 'no',
    },
  ],
})
const isError = computed(() => {
  const handle: Record<'test' | 'exercise', Record<'select' | 'judge', (value: string) => boolean>> = {
    test: {
      select: (value: string) => {
        return props.question.correctAnswer.toLocaleUpperCase().trim() !== value.toLocaleUpperCase().trim()
      },
      judge: (value: string) => {
        return props.question.correctAnswer === value
      },
    },
    exercise: {
      select: (value: string) => {
        return props.question.correctAnswer.toLocaleUpperCase().trim() !== value.toLocaleUpperCase().trim()
      },
      judge: (value: string) => {
        return props.question.correctAnswer === value
      },
    },
  }
  return (value: string) => handle[props.mode][props.question.type](value)
})
</script>

<template>
  <div>
    <!-- do -->
    <template v-if="status === 'do'">
      <template v-if="question.type === 'select'">
        <a-radio-group v-model:value="answer">
          <a-radio
            v-for="item in answerOption[question.type]"
            :key="item.value"
            :value="item.value"
          >
            {{ item.label }}
          </a-radio>
        </a-radio-group>
        <!-- <a-radio-group v-model:value="selected" :options="answerOption[type]" /> -->
      </template>
      <template v-else-if="question.type === 'judge'">
        <a-radio-group v-model:value="answer" option-type="button" :options="answerOption[question.type]" />
      </template>
    </template>

    <!-- done -->
    <template v-else-if="status === 'done'">
      <template v-if="question.type === 'select'">
        <!-- todo -->
        <!-- <a-radio-group :value="answer">
          <a-radio
            v-for="item in answerOption[question.type]"
            :key="item.value"
            :value="item.value"
            :class="isError(item.value) ? 'error' : ''"
          >
            {{ item.label }}
          </a-radio>
        </a-radio-group> -->
      </template>
      <template v-else-if="question.type === 'judge'" />
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
}
.success {
  .ant-radio-inner {
    border-color: #22c55e;
    &::after {
      background-color: #22c55e;
    }
  }
}
</style>
