<script setup lang="ts">
import { getQuestionSetDetail, resetQuestion, updateQuestionAnswer } from '@exercise/api'
import type { IQuestion, IQuestionSet } from '@exercise/type'

type QuestionStart = 'continue' | 'restart'
type QuestionPart = 'all' | 'error'
const router = useRouter()
const route = useRoute()
const loginState = useLogin()
const isSave = ref<boolean>(false)
const questionSet = ref<IQuestionSet & { questions: IQuestion[] }>()
const currectIdx = ref(0)
const exerciseState = ref<{
  id: string
  part: QuestionPart
}>({
  id: route.query.id as string || '6d828da8-ef16-418f-aff7-f9e3d9cc9295',
  part: route.query.part as QuestionPart || 'all',
})
const question = computed(() => {
  return questionSet.value?.questions[currectIdx.value]
})
const questionStatus = computed(() => {
  return (question: IQuestion) => question.exerciseAnswer.length > 0 ? 'done' : 'do'
})

function handleChangeAnswer(id: string, answer: string) {
  questionSet.value?.questions.forEach(async (question) => {
    if (question.id === id) {
      question.exerciseAnswer = answer
      isSave.value = true
      await updateQuestionAnswer({ id, exerciseAnswer: answer })
      isSave.value = false
    }
  })
}
function handleRefresh(event: Event) {
  event.preventDefault()
}

function handleGoBack() {
  router.push('/home/question-set')
}

async function initQuestionList() {
  const [err, data] = await getQuestionSetDetail(exerciseState.value.id, loginState.account.value)
  if (!err && data)
    questionSet.value = data
}
onBeforeRouteLeave((to, from) => {
  const answer = window.confirm('是否离开?')
  if (!answer)
    return false
})
onMounted(() => {
  window.addEventListener('beforeunload', handleRefresh)
})
onUnmounted(() => {
  window.removeEventListener('beforeunload', handleRefresh)
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
      <Question
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
