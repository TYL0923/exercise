<script setup lang="ts">
import { getQuestionSetDetail } from '@exercise/api'
import type { IQuestion, IQuestionSet } from '@exercise/type'

const props = withDefaults(
  defineProps<{
    mode?: 'exercise' | 'test'
    start?: 'continue' | 'restart'
    part?: 'all' | 'error' | 'not'
  }>(),
  {
    mode: 'exercise',
    start: 'continue',
    part: 'all',
  },
)
const route = useRoute()
const router = useRouter()
const loginState = useLogin()
const questionSet = ref<IQuestionSet>()
const questionList = ref<IQuestion[]>([])
const { handleChangeAnswer } = useQuestion(questionList)

function handleGoBack() {
  router.push('/home/question-set')
}
async function initQuestionList() {
  const [err, data] = await getQuestionSetDetail(route.query.id as string, loginState.account.value)
  if (!err && data) {
    questionList.value = data.questions
    questionSet.value = data
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
        <div bg-white rounded-2 flex-1 p-4>
          <QuestionSet status="test" :list="questionList || []" @change-answer="handleChangeAnswer" />
        </div>
        <div w-60>
          <div bg-white rounded-1 p-4 sticky top-0>
            <AnswerKey :list="questionList" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
