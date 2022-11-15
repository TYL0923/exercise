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
const loginState = useLogin()
const questionSet = ref<IQuestionSet & { questions: IQuestion[] }>()

function handleGoBack() {

}
async function initQuestionList() {
  const [err, data] = await getQuestionSetDetail('ec190f3b-7890-452a-9676-cdc5ae689358', loginState.account.value)
  if (!err && data)
    questionSet.value = data
}
watchEffect(initQuestionList)
</script>

<template>
  <div relative w-screen h-screen bg-gray-50>
    <div
      fixed top-0 left-0
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
          <QuestionSet status="test" :list="questionSet?.questions || []" />
        </div>
        <div w-60>
          <div bg-white rounded-1 p-2 sticky top-0>
            答题卡
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
