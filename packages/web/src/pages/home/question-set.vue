<script setup lang="ts">
import { getMyQuestionSet } from '@exercise/api'
import type { BaseReturnQuestionSet } from '@exercise/type'

const router = useRouter()
const loginState = useLogin()

const createQuestionSet = ref<BaseReturnQuestionSet[]>([])
function handleGotoCreateQuestionSet() {
  router.push({
    path: '/detail',
    query: {
      status: 'add',
    },
  })
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
        <QuestionSetCard v-for="questionSet in createQuestionSet" :key="questionSet.id" :question-set="questionSet" />
      </div>
    </a-card>
  </div>
</template>

<style scoped lang="less">
.grid-container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-gap: 2rem;
}
</style>
