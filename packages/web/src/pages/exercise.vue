<script setup lang="ts">
import { getQuestionSetDetail, updateQuestionAnswer, updateQuestions } from '@exercise/api'
import type { Question, QuestionSet } from '@exercise/type'

import { message } from 'ant-design-vue'
type QuestionPart = 'all' | 'error' | 'not'
const router = useRouter()
const route = useRoute()
const loginState = useLogin()

const diff = ref<boolean>(true)
const isSave = ref<boolean>(false)
const questionSet = ref<QuestionSet>()
const currectIdx = ref(0)
const exerciseState = ref<{
  id: string
  part: QuestionPart
}>({
  id: route.query.id as string,
  part: route.query.part as QuestionPart || 'all',
})
const question = computed(() => {
  return questionSet.value?.questions[currectIdx.value]
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

      isSave.value = true
      await updateQuestionAnswer({ id, exerciseAnswer: answer })
      isSave.value = false
    }
  })
}

function handleGoBack() {
  router.push('/home/question-set')
}
async function saveQuestion() {
  message.loading({
    content: '保存中,请稍等',
    key: 'save',
  })
  if (!questionSet.value?.questions)
    return true
  const { err, data } = await updateQuestions(questionSet.value?.questions)
  message.success({
    content: '保存成功',
    key: 'save',
    duration: 1,
  })
  return data
}
async function initQuestionList() {
  const { err, data } = await getQuestionSetDetail(exerciseState.value.id, loginState.account.value)
  if (!err && data) {
    if (exerciseState.value.part === 'error') {
      data.questions = (data.questions as Question[]).filter(question => question.isError)
      ;(data.questions as Question[]).forEach((question) => {
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
onBeforeRouteLeave(async (to, from) => {
  const res = window.confirm('是否离开?')
  if (!res)
    return false
  await saveQuestion()
  return true
})

/**
 * firefox
 */
function handleBeforeunload(event: Event) {
  event.returnValue = true
  diff.value = false
}
async function handleUnload() {
  if (diff) {
    // 浏览器刷新
  }
  else {
    // 浏览器关闭
    await saveQuestion()
  }
}
function handleLoad() {
  diff.value = true
}
onMounted(() => {
  window.addEventListener('beforeunload', handleBeforeunload)
  window.addEventListener('unload', handleUnload)
  window.addEventListener('load', handleLoad)
})
onUnmounted(() => {
  window.removeEventListener('beforeunload', handleBeforeunload)
  window.removeEventListener('unload', handleUnload)
  window.removeEventListener('load', handleLoad)
})
watchEffect(initQuestionList)
</script>

<template>
  <div bg-gray-100 h-screen px-40 pt-20>
    <div
      fixed top-0 left-0 z-100
      w-screen h-12 px-4 box-border
      shadow shadow-slate-100 bg-white
      flex items-center
    >
      <div w-60 flex items-center>
        <h4 mb-0 mr-6>
          练习模式
        </h4>
        <span v-show="isSave" flex items-center>
          <a-spin size="small" />
          <span ml-2>保存中</span>
        </span>
      </div>
      <div flex-1 text-center>
        <h5 mb-0>
          {{ questionSet?.title }}
        </h5>
      </div>
      <div w-60>
        <a-button type="text" @click="handleGoBack">
          返回
        </a-button>
      </div>
    </div>
    <div bg-white p-10 shadow rounded-1>
      <QuestionCom
        v-if="question"
        :question="question"
        :idx="currectIdx"
        mode="exercise"
        :status="questionStatus(question)"
        @change-answer="handleChangeAnswer"
      />
      <a-divider />
      <div flex items-center justify-between>
        <a-button type="link" :disabled="currectIdx === 0" @click="currectIdx--">
          上一题
        </a-button>
        <a-button type="link" :disabled="currectIdx === (questionSet?.questions.length || 1) - 1" @click="currectIdx++">
          下一题
        </a-button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">

</style>
