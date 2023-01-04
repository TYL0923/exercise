<!-- <script setup lang="ts">
import type { Question, QuestionSet } from '@exercise/type'
import { computed, ref, watchEffect } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useLoginState } from '../composables'
import { getQuestionSetDetail, updateQuestionAnswer, updateQuestions } from '../lib/api'
import QuestionCom from '../components/QuestionCom.vue'

const exerciseState = ref<{
  id: string
  part: 'all' | 'error' | 'not'
}>({
  id: '',
  part: 'all',
})
onLoad((option) => {
  exerciseState.value.id = option?.id || ''
  exerciseState.value.part = option?.part || 'all'
})
const loginState = useLoginState()
const questionSet = ref<QuestionSet>()
const currentIdx = ref<number>(0)
const exitPopupRef = ref<any>(null)
const answerKeyPopupRef = ref<any>(null)
const currentQuestion = computed(() => {
  return questionSet.value?.questions[currentIdx.value]
})
const questionStatus = computed(() => {
  return (question: Question) => question.exerciseAnswer.length > 0 ? 'done' : 'do'
})
const doneClass = computed(() => {
  return (question: Question) => {
    return question.exerciseAnswer.length <= 0
      ? ''
      : question.exerciseAnswer !== question.correctAnswer || question.exerciseAnswer === ''
        ? 'bg-red-500 text-white'
        : 'bg-green-500 text-white'
  }
})
function openAnswerKey() {
  answerKeyPopupRef.value.open('bottom')
}
function gotoQuestion(idx: number) {
  if (idx < 0 || idx >= questionSet.value!.questions.length)
    return
  currentIdx.value = idx
}
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
async function exitExercise() {
  uni.showLoading({
    title: '保存中',
  })
  await updateQuestions(questionSet.value!.questions)
  uni.hideLoading()
  uni.switchTab({
    url: '/pages/my',
  })
}
async function initQuestionSet() {
  if (exerciseState.value.id === '')
    return
  const { err, data } = await getQuestionSetDetail(exerciseState.value.id, loginState.account)
  if (!err && data) {
    if (exerciseState.value.part === 'error') {
      data.questions = (data.questions as Question[]).filter(question => question.isError)
      data.questions.forEach((question: Question) => {
        // todo
        question.isError = 0
        question.isDo = 0
        question.exerciseAnswer = ''
      })
    }
    else if (exerciseState.value.part === 'not') {
      data.questions = (data.questions as Question[]).filter(question => !question.isDo)
    }
  }
  questionSet.value = data
}
watchEffect(initQuestionSet)
</script>

<template>
  <view h-screen bg-gray-100 flex flex-col>
    <view
      h-130 pt-6 pb-2 pr-10 box-border px-2 bg-white
      flex items-center justify-between
    >
      <uni-icons type="left" size="25" @click="exitPopupRef.open()" />
      <view>{{ questionSet?.title }}</view>
      <view />
    </view>
    <view p-4 flex-1 overflow-y-auto>
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
      h-100 w-full px-4 box-border bg-white
      grid grid-cols-5 justify-items-center content-center
    >
      <view
        col-start-1 col-end-2
        :class="currentIdx > 0 ? 'text-sky-500' : 'text-gray-300'"
        @click="currentIdx > 0 && currentIdx--"
      >
        上一题
      </view>
      <view />
      <view col-start-3 col-end-4 @click="openAnswerKey">
        {{ `${currentIdx + 1}/${questionSet.questions.length}` }}
      </view>
      <view />
      <view
        col-start-5 col-end-6
        :class="currentIdx < questionSet!.questions.length - 1 ? 'text-sky-500' : 'text-gray-300'"
        @click="currentIdx < questionSet!.questions.length - 1 && currentIdx++"
      >
        下一题
      </view>
    </view>
    <uni-popup ref="exitPopupRef" type="dialog">
      <uni-popup-dialog
        type="error"
        cancel-text="取消"
        confirm-text="确定"
        title="是否退出答题"
        @confirm="exitExercise"
      />
    </uni-popup>
    <uni-popup ref="answerKeyPopupRef" background-color="#fff">
      <view p-4 grid grid-cols-5 gap-x-2 gap-y-4>
        <button
          v-for="item, index in questionSet?.questions" :key="item.id"
          size="mini"
          :class="doneClass(item)"
          @click="gotoQuestion(index)"
        >
          {{ index + 1 }}
        </button>
      </view>
    </uni-popup>
  </view>
</template> -->
