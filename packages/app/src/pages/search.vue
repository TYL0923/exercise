<script setup lang="ts">
import type { QuestionSet } from '@exercise/type'
import { reactive, ref, watch } from 'vue'
import { queryJoinableQuestionSet } from '../lib/api'
import { useDebounceFn } from '../lib/utils'
import QuestionSetCardCom from '../components/QuestionSetCardCom.vue'
import { useLoginState } from '../composables'
const loginState = useLoginState()
const searchState = reactive<{
  key: string
  type: 'keyWord' | 'author' | 'id'
}>({
  key: '',
  type: 'keyWord',
})

const joinableQuestionSetList = ref<QuestionSet[]>([])

const initjoinableQuestionSetList = useDebounceFn(async (option: Partial<Record<'id' | 'keyWord' | 'author', string | undefined>>) => {
  const { err, data } = await queryJoinableQuestionSet({
    ...option,
    account: loginState.account,
  })
  if (!err && data)
    joinableQuestionSetList.value = data
}, 350)
watch(
  [() => searchState.key, () => searchState.type],
  ([newKey, newType]) => {
    const option = {
      id: newType === 'id' ? newKey : undefined,
      keyWord: newType === 'keyWord' ? newKey : undefined,
      author: newType === 'author' ? newKey : undefined,
    }
    initjoinableQuestionSetList(option)
  },
)
</script>

<template>
  <view bg-gray-100 h-screen>
    <view bg-white>
      <uni-search-bar v-model="searchState.key" placeholder="搜索题库" bg-color="#EEEEEE" />
    </view>
    <view>
      <QuestionSetCardCom v-for="questionSet in joinableQuestionSetList" :key="questionSet.id" :data="questionSet" />
    </view>
  </view>
</template>
