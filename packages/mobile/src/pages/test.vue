<script setup lang="ts">
import type { Question, QuestionSet } from '@exercise/type'
import { closeToast, showConfirmDialog, showLoadingToast } from 'vant'
import { getQuestionSetDetail, updateQuestions } from '@exercise/api'
import { useLoginState } from '../composables'
import { QuestionCom } from '../components'
const route = useRoute()
const router = useRouter()
const testState = ref<{
  id: string
}>({
  id: (route.query.id as string) || '2fe3b6fe-f0c1-45f9-a360-f8dba4378272',
})

const loginState = useLoginState()
const questionSet = ref<QuestionSet>()
const testStatus = ref<'do' | 'done'>('do')
const currentIdx = ref<number>(0)
const answerKeyIsShow = ref<boolean>(false)
const currentQuestion = computed(() => {
  return questionSet.value?.questions[currentIdx.value]
})
const notDo = computed(() => {
  return questionSet.value?.questions.reduce((pre, cur) => {
    return pre += cur.testAnswer.length === 0 ? 1 : 0
  }, 0)
})
const doneClass = computed(() => {
  return (question: Question) => {
    return question.testAnswer.length === 0
      ? 'default'
      : testStatus.value === 'do'
        ? 'primary'
        : question.testAnswer !== question.correctAnswer || question.testAnswer === ''
          ? 'danger'
          : 'success'
  }
})
function openAnswerKey() {
  answerKeyIsShow.value = true
}
function gotoQuestion(idx: number) {
  if (idx < 0 || idx >= questionSet.value!.questions.length)
    return
  currentIdx.value = idx
  answerKeyIsShow.value = false
}

function handleChangeAnswer(id: string, answer: string) {
  questionSet.value?.questions.forEach(async (question) => {
    if (question.id === id)
      question.testAnswer = answer
  })
}
async function submitPaper() {
  showConfirmDialog({
    title: '确认提交?',
    message: notDo.value ? `还有 ${notDo.value} 题未答, 是否提交` : '已全部作答, 是否提交',
  })
    .then(async () => {
      showLoadingToast({
        message: '批改中...',
        forbidClick: true,
      })
      testStatus.value = 'done'
      await updateQuestions(questionSet.value!.questions)
      closeToast()
      answerKeyIsShow.value = true
    })
    .catch(() => {
      // on cancel
    })
}
async function exitTest() {
  showConfirmDialog({
    title: '确认',
    message: '确定退出?',
  })
    .then(async () => {
      router.push('/my')
    })
    .catch(() => {
      // on cancel
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
  <div h-screen bg-gray-50 flex flex-col>
    <van-nav-bar
      :title="questionSet?.title"
      left-text="退出"
      left-arrow
      @click-left="exitTest"
    />
    <div p-4 flex-1 overflow-y-auto>
      <QuestionCom
        v-if="currentQuestion"
        :question="currentQuestion"
        :idx="currentIdx"
        mode="test"
        :status="testStatus"
        @change-answer="handleChangeAnswer"
      />
    </div>
    <div
      v-if="questionSet"
      h-14 w-full px-2 box-border bg-white
      grid grid-cols-5 justify-items-center content-center
    >
      <div
        col-start-1 col-end-2
        :class="currentIdx > 0 ? 'text-sky-500' : 'text-gray-300'"
        @click="currentIdx > 0 && currentIdx--"
      >
        上一题
      </div>
      <!-- <div
        text-sky-500 col-start-2 col-end-3 text-sm
        :class="testStatus === 'do' ? 'text-sky-500' : 'text-gray-300'"
      >
        检查
      </div> -->
      <div col-start-3 col-end-4 @click="openAnswerKey">
        {{ `${currentIdx + 1}/${questionSet.questions.length}` }}
      </div>
      <div
        v-if="testStatus === 'do'"
        text-sky-500 col-start-4 col-end-5 text-sm
        :class="testStatus === 'do' ? 'text-sky-500' : 'text-gray-300'"
        @click="testStatus === 'do' && submitPaper()"
      >
        提交
      </div>
      <div
        col-start-5 col-end-6
        :class="currentIdx < questionSet!.questions.length - 1 ? 'text-sky-500' : 'text-gray-300'"
        @click="currentIdx < questionSet!.questions.length - 1 && currentIdx++"
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
