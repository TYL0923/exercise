<script setup lang="ts">
import { getQuestionSetDetail, resetQuestion } from '@exercise/api'
import type { Question, QuestionSet } from '@exercise/type'

import { Modal } from 'ant-design-vue'

const route = useRoute()
const router = useRouter()
const loginState = useLogin()
// const paperStatus = ref<'do' | 'done'>('done')
const isLoad = ref<boolean>(true)
const paperStatus = ref<'do' | 'done'>((route.query.status as 'do' | 'done') || 'do')
const questionSet = ref<QuestionSet>()
const questions = ref<Question[]>([])
const { handleChangeAnswer } = useQuestion(questions, { isSync: true })

function handleGoBack() {
  router.push('/home/question-set')
}

function handleSubmitPaper() {
  Modal.confirm({
    title: '是否提交',
    okText: '确认',
    cancelText: '取消',
    onOk() {
      paperStatus.value = 'done'
    },
    onCancel() {},
    // class: 'test',
  })
}
function handleResetPaper() {
  Modal.confirm({
    title: '是否重新开始',
    okText: '确认',
    cancelText: '取消',
    onOk() {
      router.go(0)
    },
    onCancel() {},
    // class: 'test',
  })
}
function handleRefresh(event: Event) {
  event.preventDefault()
}
async function initQuestionList() {
  isLoad.value = true
  const [e, d] = await resetQuestion(route.query.id as string, loginState.account.value, 'test')
  if (!e && d) {
    const [err, data] = await getQuestionSetDetail(route.query.id as string, loginState.account.value)
    if (!err && data) {
      questionSet.value = data
      questions.value = data.questions
    }
  }
  isLoad.value = false
}

watchEffect(initQuestionList)
onBeforeRouteLeave((to, from) => {
  const answer = window.confirm('离开将结束考试,是否离开?')
  if (!answer)
    return false
})
onMounted(() => {
  window.addEventListener('beforeunload', handleRefresh)
})
onUnmounted(() => {
  window.removeEventListener('beforeunload', handleRefresh)
})
</script>

<template>
  <a-modal v-if="isLoad" :visible="isLoad" :footer="null" :closable="false">
    <div p-10 flex flex-col items-center>
      <a-spin size="large" />
      <span mt-4>创建中</span>
    </div>
  </a-modal>
  <div v-else relative w-screen h-screen bg-gray-50>
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
          <QuestionSetCom :status="paperStatus" mode="test" :list="questions || []" @change-answer="handleChangeAnswer" />
          <div flex items-center justify-center gap-x-20 my-10>
            <template v-if="paperStatus === 'do'">
              <a-button type="primary" @click="handleSubmitPaper">
                提交
              </a-button>
              <a-button>检查</a-button>
            </template>
            <template v-else>
              <a-button type="primary" @click="handleResetPaper">
                重新开始
              </a-button>
              <a-button @click="handleGoBack">
                返回
              </a-button>
            </template>
          </div>
        </div>
        <div w-60>
          <div bg-white rounded-1 p-4 sticky top-0>
            <AnswerKeyCom :list="questions" mode="test" :status="paperStatus" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
