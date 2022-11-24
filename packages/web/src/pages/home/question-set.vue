<script setup lang="ts">
import { getMyQuestionSet } from '@exercise/api'
import type { BaseReturnQuestionSet } from '@exercise/type'

const router = useRouter()
const loginState = useLogin()
const drawerVisible = ref<boolean>(false)
const createQuestionSet = ref<BaseReturnQuestionSet[]>([])
const prepareOpenQuestionSet = ref<BaseReturnQuestionSet>()

const filter = reactive({
  mode: 'exercise',
  start: 'continue',
  part: 'all',
})
const filterOptions = reactive({
  mode: [
    {
      label: '刷题模式',
      key: 'exercise',
    },
    {
      label: '考试模式',
      key: 'test',
    },
  ],
  start: [
    {
      label: '继续刷题',
      key: 'continue',
    },
    {
      label: '重新开始',
      key: 'restart',
    },
  ],
  part: [
    {
      label: '全部',
      key: 'all',
    },
    {
      label: '错题',
      key: 'error',
    },
    {
      label: '未做',
      key: 'not',
    },
  ],
})

function handleGotoCreateQuestionSet() {
  router.push({
    path: '/detail',
    query: {
      status: 'add',
    },
  })
}

function handleOpenQuestionSet(questionSet: BaseReturnQuestionSet) {
  drawerVisible.value = true
  prepareOpenQuestionSet.value = questionSet
}

function handleStart() {
  if (prepareOpenQuestionSet.value?.id) {
    router.push({
      path: '/paper',
      query: {
        id: prepareOpenQuestionSet.value?.id,
      },
    })
  }
}
async function initCreateQuestionSet() {
  const [err, data] = await getMyQuestionSet(loginState.account.value)
  if (!err && data)
    createQuestionSet.value = data
}
watchEffect(initCreateQuestionSet)
</script>

<template>
  <div>
    <a-card title="我的题库">
      <template #extra>
        <a-button type="primary" @click="handleGotoCreateQuestionSet">
          创建题库
        </a-button>
      </template>
      <div class="grid-container">
        <QuestionSetCard
          v-for="questionSet in createQuestionSet" :key="questionSet.id"
          :question-set="questionSet"
          @click="handleOpenQuestionSet(questionSet)"
        />
      </div>
    </a-card>
    <a-drawer
      v-model:visible="drawerVisible"
      title="刷题设置"
      placement="right"
    >
      <QuestionSetCard v-if="prepareOpenQuestionSet" :question-set="prepareOpenQuestionSet" />
      <Filter :options="filterOptions" :filter="filter" />
      <template #footer>
        <div flex items-center justify-end gap-8>
          <a-button w-20>
            取消
          </a-button>
          <a-button w-20 type="primary" @click="handleStart">
            确定
          </a-button>
        </div>
      </template>
    </a-drawer>
  </div>
</template>

<style scoped lang="less">
.grid-container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-gap: 2rem;
}
</style>
