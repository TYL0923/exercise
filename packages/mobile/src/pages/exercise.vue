<script setup lang="ts">
import type { Question, QuestionSet } from '@exercise/type'
import { onLoad } from '@dcloudio/uni-app'
import { closeToast, showConfirmDialog, showLoadingToast } from 'vant'
import { useLoginState, useSlide } from '../composables'
import { getQuestionSetDetail, updateQuestionAnswer, updateQuestions } from '../lib/api'

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

const touchRef = ref<HTMLElement | null>()
const loginState = useLoginState()
const questionSet = ref<QuestionSet>()
const currentIdx = ref<number>(0)
const answerKeyIsShow = ref<boolean>(false)
const currentQuestion = computed(() => {
  return questionSet.value?.questions[currentIdx.value]
})
const questionStatus = computed(() => {
  return (question: Question) => question.exerciseAnswer.length > 0 ? 'done' : 'do'
})
const doneClass = computed(() => {
  return (question: Question) => {
    return question.id === currentQuestion.value?.id
      ? 'primary'
      : question.exerciseAnswer.length <= 0
        ? 'default'
        : question.exerciseAnswer !== question.correctAnswer || question.exerciseAnswer === ''
          ? 'danger'
          : 'success'
  }
})
function openAnswerKey() {
  answerKeyIsShow.value = true
}
function next() {
  currentIdx.value < questionSet.value!.questions.length - 1 && currentIdx.value++
}
function last() {
  currentIdx.value > 0 && currentIdx.value--
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
  showConfirmDialog({
    title: '确认',
    message: '确定退出练习?',
  })
    .then(async () => {
      showLoadingToast({
        message: '保存中...',
        forbidClick: true,
      })
      await updateQuestions(questionSet.value!.questions)
      closeToast()
      uni.navigateTo({
        url: '/pages/question-set',
      })
    })
    .catch(() => {
      // on cancel
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
onMounted(() => {
  useSlide(touchRef!.value!, { leftSlide: next, rightSlide: last })
})
watchEffect(initQuestionSet)
</script>

<template>
  <div h-screen bg-gray-50 flex flex-col>
    <van-nav-bar
      :title="questionSet?.title"
      left-text="退出"
      left-arrow
      @click-left="exitExercise"
    />
    <div ref="touchRef" p-4 flex-1 overflow-y-auto>
      <QuestionCom
        v-if="currentQuestion"
        :question="currentQuestion"
        :idx="currentIdx"
        mode="exercise"
        :status="questionStatus(currentQuestion)"
        @change-answer="handleChangeAnswer"
      />
    </div>
    <div
      v-if="questionSet"
      h-100 w-full px-4 box-border bg-white
      grid grid-cols-5 justify-items-center content-center
    >
      <div
        col-start-1 col-end-2
        :class="currentIdx > 0 ? 'text-sky-500' : 'text-gray-300'"
        @click="last"
      >
        上一题
      </div>
      <div />
      <div col-start-3 col-end-4 @click="openAnswerKey">
        {{ `${currentIdx + 1}/${questionSet.questions.length}` }}
      </div>
      <div />
      <div
        col-start-5 col-end-6
        :class="currentIdx < questionSet!.questions.length - 1 ? 'text-sky-500' : 'text-gray-300'"
        @click="next"
      >
        下一题
      </div>
    </div>
    <van-action-sheet v-model:show="answerKeyIsShow" title="答题卡">
      <div p-4 pb-10 grid grid-cols-5 gap-2>
        <van-button
          v-for="item, index in questionSet?.questions"
          :key="item.id"
          size="mini"
          plain
          :type="doneClass(item)"
          @click="gotoQuestion(index)"
        >
          {{ index + 1 }}
        </van-button>
      </div>
    </van-action-sheet>
  </div>
</template>
