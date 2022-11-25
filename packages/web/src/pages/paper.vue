<script setup lang="ts">
import { getQuestionSetDetail, resetQuestion } from '@exercise/api'
import type { IQuestion, IQuestionSet } from '@exercise/type'

const route = useRoute()
const router = useRouter()
const loginState = useLogin()

onBeforeRouteLeave((to, from) => {
  const answer = window.confirm('离开将结束考试,是否离开?')
  if (!answer)
    return false
})
onMounted(() => {
  window.addEventListener('beforeunload', (event) => {
    event.preventDefault()
    event.returnValue = ''
  })
})

// const paperStatus = ref<'do' | 'done'>('done')
const paperStatus = ref<'do' | 'done'>((route.query.status as 'do' | 'done') || 'do')
const questionSet = ref<IQuestionSet & { questions: IQuestion[] }>()
const questions = ref<IQuestion[]>([])
const { handleChangeAnswer } = useQuestion(questions, { isSync: true })

function handleGoBack() {
  router.push('/home/question-set')
}

function handleSubmitPaper() {

}
async function initQuestionList() {
  const [e, d] = await resetQuestion(route.query.id as string, loginState.account.value, 'test')
  if (!e && d) {
    const [err, data] = await getQuestionSetDetail(route.query.id as string, loginState.account.value)
    if (!err && data) {
      questionSet.value = data
      questions.value = data.questions
    }
  }
}
watchEffect(initQuestionList)
</script>

<template>
  <div relative w-screen h-screen bg-gray-50>
    <div
      fixed top-0 left-0 z-100
      w-screen h-12 px-4 box-border
      shadow shadow-slate-100 bg-white
      flex items-center
    >
      <div w-60>
        <a-button type="text" @click="handleGoBack">
          返回
        </a-button>
      </div>
      <div flex-1 text-center>
        {{ questionSet?.title || '--' }}
      </div>
      <div w-60>
        --
      </div>
    </div>

    <div
      h-screen box-border py-16 px-20 overflow-y-auto bg-gray-100
      flex justify-center
    >
      <div mb-8 class="w-90%" box-border flex self-start justify-between gap-x-6>
        <div bg-white rounded-2 flex-1 p-6>
          <QuestionSet :status="paperStatus" mode="test" :list="questions || []" @change-answer="handleChangeAnswer" />
          <div flex items-center justify-center gap-x-20 my-10>
            <a-button type="primary" @click="handleSubmitPaper">
              提交
            </a-button>
            <a-button>检查</a-button>
          </div>
        </div>
        <div w-60>
          <div bg-white rounded-1 p-4 sticky top-0>
            <AnswerKey :list="questions" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
