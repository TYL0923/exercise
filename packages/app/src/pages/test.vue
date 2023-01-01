<script setup lang="ts">
import type { Question, QuestionSet } from '@exercise/type'
import { computed, ref, watchEffect } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useLoginState } from '../composables'
import { getQuestionSetDetail, updateQuestionAnswer, updateQuestions } from '../lib/api'
import QuestionCom from '../components/QuestionCom.vue'

const testState = ref<{
  id: string
}>({
  id: '2fe3b6fe-f0c1-45f9-a360-f8dba4378272',
})
onLoad((option) => {
  testState.value.id = option?.id || '2fe3b6fe-f0c1-45f9-a360-f8dba4378272'
})

const loginState = useLoginState()
const questionSet = ref<QuestionSet>()
const teststatus = ref<'do' | 'done'>('do')
const currentIdx = ref<number>(0)
const exitPopupRef = ref<any>(null)
const submitPopupRef = ref<any>(null)
const answerKeyPopupRef = ref<any>(null)
const currentQuestion = computed(() => {
  return questionSet.value?.questions[currentIdx.value]
})
const isNotDo = computed(() => {
  return questionSet.value?.questions.reduce((pre, cur) => {
    return pre += cur.testAnswer.length === 0 ? 1 : 0
  }, 0)
})
const doneClass = computed(() => {
  return (question: Question) => {
    return question.testAnswer.length === 0
      ? ''
      : teststatus.value === 'do'
        ? 'bg-sky-500 text-white'
        : question.testAnswer !== question.correctAnswer || question.testAnswer === ''
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
  answerKeyPopupRef.value.close()
}
function handleChangeAnswer(id: string, answer: string) {
  questionSet.value?.questions.forEach(async (question) => {
    if (question.id === id)
      question.testAnswer = answer
      // isSave.value = true
      // await updateQuestionAnswer({ id, exerciseAnswer: answer })
      // isSave.value = false
  })
}
async function submitPaper() {
  uni.showLoading({
    title: '批改中',
  })
  teststatus.value = 'done'
  await updateQuestions(questionSet.value!.questions)
  uni.hideLoading()
  answerKeyPopupRef.value.open('bottom')
}
async function exitExercise() {
  uni.switchTab({
    url: '/pages/my',
  })
}
async function initQuestionSet() {
  if (testState.value.id === '')
    return
  const { err, data } = await getQuestionSetDetail(testState.value.id, loginState.account)
  if (!err && data)
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
        mode="test"
        :status="teststatus"
        @change-answer="handleChangeAnswer"
      />
    </view>
    <view
      v-if="questionSet"
      h-100 w-full px-2 box-border bg-white
      grid grid-cols-5 justify-items-center content-center
    >
      <view
        col-start-1 col-end-2
        :class="currentIdx > 0 ? 'text-sky-500' : 'text-gray-300'"
        @click="currentIdx > 0 && currentIdx--"
      >
        上一题
      </view>
      <!-- <view
        text-sky-500 col-start-2 col-end-3 text-sm
        :class="teststatus === 'do' ? 'text-sky-500' : 'text-gray-300'"
      >
        检查
      </view> -->
      <view col-start-3 col-end-4 @click="openAnswerKey">
        {{ `${currentIdx + 1}/${questionSet.questions.length}` }}
      </view>
      <view
        text-sky-500 col-start-4 col-end-5 text-sm
        :class="teststatus === 'do' ? 'text-sky-500' : 'text-gray-300'"
        @click="teststatus === 'do' && submitPopupRef.open()"
      >
        提交
      </view>
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
        type="info"
        cancel-text="取消"
        confirm-text="确定"
        title="是否退出答题"
        @confirm="exitExercise"
      />
    </uni-popup>
    <uni-popup ref="submitPopupRef" type="dialog">
      <uni-popup-dialog
        :type="isNotDo === 0 ? 'info' : 'error'"
        cancel-text="取消"
        confirm-text="确定"
        title="是否提交"
        :content="isNotDo === 0 ? '已全部作答,是否提交' : `还有${isNotDo}题未作答, 是否提交`"
        @confirm="submitPaper"
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
</template>
