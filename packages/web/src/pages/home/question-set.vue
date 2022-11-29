<script setup lang="ts">
import { getMyJoinQuestionSet, getMyQuestionSet, joinQuestionSetById, queryJoinableQuestionSet } from '@exercise/api'
import type { BaseReturnQuestionSet, IQuestion, IQuestionSet } from '@exercise/type'
import { useDebounceFn } from '@vueuse/core'
import { Modal, message } from 'ant-design-vue'

const router = useRouter()
const loginState = useLogin()
const drawerVisible = ref<boolean>(false)
const joinQuestionVisible = ref<boolean>(false)
const searchState = reactive<{
  key: string
  type: 'keyWord' | 'author' | 'id'
}>({
  key: '',
  type: 'id',
})
const searchOption = reactive([
  {
    key: 'id',
    label: 'id',
  },
  {
    key: 'author',
    label: '作者',
  },
  {
    key: 'keyWord',
    label: '关键字',
  },
])
const isLoad = reactive<{
  my: boolean
  join: boolean
  joinable: boolean
}>({
  my: false,
  join: false,
  joinable: false,
})

const createQuestionSet = ref<BaseReturnQuestionSet[]>([])
const joinQuestionSet = ref<BaseReturnQuestionSet[]>([])
const searchQuestionSet = ref<IQuestionSet[]>([])
const prepareOpenQuestionSet = ref<BaseReturnQuestionSet>()

const filter = reactive<{
  mode: 'exercise' | 'test'
  start: 'continue' | 'restart'
  part: 'all' | 'error' | 'not'
}>({
  mode: 'test',
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

const initSearchQuestionSet = useDebounceFn(async (option: Partial<Record<'id' | 'keyWord' | 'author', string>>) => {
  isLoad.joinable = true
  const [err, data] = await queryJoinableQuestionSet({
    ...option,
    account: loginState.account.value,
  })
  if (!err && data)
    searchQuestionSet.value = data
  isLoad.joinable = false
}, 450)
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
function handleJoinQuestionSet(question: IQuestion & { author: string }) {
  Modal.confirm({
    title: '是否加入题库',
    okText: '确认',
    cancelText: '取消',
    async onOk() {
      message.loading({
        content: '加入题库中',
        key: 'join',
      })
      const [err, data] = await joinQuestionSetById(question.id, loginState.account.value)
      if (!err && data) {
        message.success({
          content: '加入成功',
          key: 'join',
          duration: 1,
        })
        initSearchQuestionSet({})
        initJoinQuestionSet()
        // joinQuestionVisible.value = false
      }
      else {
        message.error({
          content: '加入失败 加入题库不存在或已加入',
          key: 'join',
          duration: 1,
        })
      }
    },
    onCancel() {},
    // class: 'test',
  })
}
function handleStart() {
  if (prepareOpenQuestionSet.value?.id) {
    if (filter.mode === 'test') {
      router.push({
        path: '/paper',
        query: {
          id: prepareOpenQuestionSet.value?.id,
          status: 'do',
        },
      })
    }
    // todo goto exercise
  }
}

function openJoinQuestionSetModal() {
  joinQuestionVisible.value = true
  initSearchQuestionSet({})
}
async function initCreateQuestionSet() {
  isLoad.my = true
  const [err, data] = await getMyQuestionSet(loginState.account.value)
  if (!err && data)
    createQuestionSet.value = data
  isLoad.my = false
}

async function initJoinQuestionSet() {
  isLoad.join = true
  const [err, data] = await getMyJoinQuestionSet(loginState.account.value)
  if (!err && data)
    joinQuestionSet.value = data
  isLoad.join = false
}

watch(
  [() => searchState.key, () => searchState.type],
  ([newKey, newType]) => {
    const option = {
      id: newType === 'id' ? newKey : undefined,
      keyWord: newType === 'keyWord' ? newKey : undefined,
      author: newType === 'author' ? newKey : undefined,
    }
    initSearchQuestionSet(option)
  },
)
watchEffect(initCreateQuestionSet)
watchEffect(initJoinQuestionSet)
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
        <template v-if="isLoad.my">
          <Skeleton v-for="i in 4" :key="i" type="questionSetCard" />
        </template>
        <template v-else>
          <QuestionSetCard
            v-for="questionSet in createQuestionSet" :key="questionSet.id"
            :question-set="questionSet"
            @click="handleOpenQuestionSet(questionSet)"
          />
        </template>
      </div>
    </a-card>
    <a-card title="加入题库" mt-6>
      <template #extra>
        <a-button type="primary" @click="openJoinQuestionSetModal">
          加入题库
        </a-button>
      </template>
      <div class="grid-container">
        <template v-if="isLoad.join">
          <Skeleton v-for="i in 4" :key="i" type="questionSetCard" />
        </template>
        <template v-else>
          <QuestionSetCard
            v-for="questionSet in joinQuestionSet" :key="questionSet.id"
            :question-set="questionSet"
            @click="handleOpenQuestionSet(questionSet)"
          />
        </template>
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
    <a-modal v-model:visible="joinQuestionVisible" title="加入题库" :footer="null">
      <a-input v-model:value="searchState.key">
        <template #addonAfter>
          <a-select v-model:value="searchState.type" style="width: 80px">
            <a-select-option v-for="item in searchOption" :key="item.key" :value="item.key">
              {{ item.label }}
            </a-select-option>
          </a-select>
        </template>
      </a-input>
      <div mt-4>
        <a-list item-layout="horizontal" :data-source="searchQuestionSet" :loading="isLoad.joinable">
          <template #renderItem="{ item }">
            <a-list-item>
              <a-list-item-meta
                :description="item.author"
              >
                <template #title>
                  {{ item.title }}
                </template>
                <template #avatar>
                  <img w-10 m-1 h-10 rounded-full bg-cover bg-center src="/using.jpeg" alt="">
                </template>
              </a-list-item-meta>
              <template #actions>
                <a-button size="small" type="link" @click="handleJoinQuestionSet(item)">
                  加入
                </a-button>
              </template>
            </a-list-item>
          </template>
        </a-list>
      </div>
    </a-modal>
  </div>
</template>

<style scoped lang="less">
.grid-container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-gap: 2rem;
}
</style>
