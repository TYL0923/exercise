<script setup lang="ts">
import type { Question, QuestionSet } from '@exercise/type'
import { computed, ref, watchEffect } from 'vue'
import { useLoginState } from '../composables'
import { getQuestionSetDetail, updateQuestionAnswer } from '../lib/api'
import QuestionCom from '../components/QuestionCom.vue'
const loginState = useLoginState()
const questionSet = ref<QuestionSet>()
const currentIdx = ref<number>(0)
const currentQuestion = computed(() => {
  return questionSet.value?.questions[currentIdx.value]
})
const questionStatus = computed(() => {
  return (question: Question) => question.exerciseAnswer.length > 0 ? 'done' : 'do'
})
function handleChangeAnswer(id: string, answer: string) {
  questionSet.value?.questions.forEach(async (question) => {
    if (question.id === id) {
      question.exerciseAnswer = answer
      // 已做
      question.isDo = 1
      // 判断是否做错
      if (question.exerciseAnswer !== question.correctAnswer)
        question.isError = 1

      // isSave.value = true
      await updateQuestionAnswer({ id, exerciseAnswer: answer })
      // isSave.value = false
    }
  })
}
async function initQuestionSet() {
  const { err, data } = await getQuestionSetDetail('2fe3b6fe-f0c1-45f9-a360-f8dba4378272', loginState.account)
  if (!err && data)
    questionSet.value = data
}
watchEffect(initQuestionSet)
</script>

<template>
  <view p-4 h-screen bg-gray-100>
    <view>
      <QuestionCom
        v-if="currentQuestion"
        :question="currentQuestion"
        :idx="currentIdx"
        mode="exercise"
        :status="questionStatus(currentQuestion)"
        @change-answer="handleChangeAnswer"
      />
    </view>
    <view
      v-if="questionSet"
      fixed h-100 w-full px-4 box-border
      bg-white left-0 bottom-0
      flex items-center justify-between
    >
      <view
        :class="currentIdx > 0 ? 'text-sky-500' : 'text-gray-300'"
        @click="currentIdx > 0 && currentIdx--"
      >
        上一题
      </view>
      <view
        :class="currentIdx < questionSet!.questions.length - 1 ? 'text-sky-500' : 'text-gray-300'"
        @click="currentIdx < questionSet!.questions.length - 1 && currentIdx++"
      >
        下一题
      </view>
    </view>
  </view>
</template>
