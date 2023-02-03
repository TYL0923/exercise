<script setup lang="ts">
import type { QuestionSet } from '@exercise/type'
const { getCreatedQuestionSet, getJoinedQuestionSet } = useApi()

const router = useRouter()
const tabActive = ref(0)
const tabItems = ref(['创建的题库', '加入的题库'])
const loginState = useLogin()

const createdQuestionSetList = ref<QuestionSet[]>([])
const joinedQuestionSetList = ref<QuestionSet[]>([])
const { StartCom, showStart } = useStart()
const isLoading = ref<{
  created: boolean
  joined: boolean
}>({
  created: false,
  joined: false,
})
function goto() {
  if (loginState.isLogin) {
    switch (tabActive.value) {
      case 0:
        router.push('/create')
        break
      case 1:
        router.push('/search')
        break
      default:
        break
    }
  }
  else {
    router.push('/login')
  }
}
async function initCreatedQuestionSetList() {
  if (!loginState.isLogin) {
    createdQuestionSetList.value = []
    return
  }
  isLoading.value.created = true
  const { err, data } = await getCreatedQuestionSet(loginState.account)
  if (!err && data)
    createdQuestionSetList.value = data
  isLoading.value.created = false
}
async function initJoinedQuestionSetList() {
  if (!loginState.isLogin) {
    joinedQuestionSetList.value = []
    return
  }
  isLoading.value.joined = true
  const { err, data } = await getJoinedQuestionSet(loginState.account)
  if (!err && data)
    joinedQuestionSetList.value = data
  isLoading.value.joined = false
}
watch(tabActive, (value) => {
  switch (value) {
    case 0:
      initCreatedQuestionSetList()
      break
    case 1:
      initJoinedQuestionSetList()
      break
    default:
      break
  }
})
// todo
// onShow(() => {
//   initCreatedQuestionSetList()
//   initJoinedQuestionSetList()
// })
watchEffect(initCreatedQuestionSetList)
watchEffect(initJoinedQuestionSetList)
</script>

<template>
  <div h-screen bg-gray-50 overflow-y-auto>
    <div flex flex-col-reverse class="bg" h-120px>
      <div bg-transparent pb-1>
        <van-tabs v-model:active="tabActive" background="transparent" shrink>
          <van-tab v-for="item in tabItems" :key="item" :title="item" />
        </van-tabs>
      </div>
    </div>
    <div px-3 pt-1 pb-100px>
      <template v-if="tabActive === 0">
        <template v-if="isLoading.created">
          <SkeletonCom type="questionSetCard" />
        </template>
        <template v-else>
          <template v-if="createdQuestionSetList.length > 0">
            <QuestionSetCardCom
              v-for="questionSet in createdQuestionSetList"
              :key="questionSet.id"
              :data="questionSet"
              @click="showStart"
            />
          </template>
          <template v-else>
            <van-empty
              image="empty.png"
              image-size="80"
              :description="loginState.isLogin ? '题库为空' : '请先登录'"
            >
              <van-button round type="primary" w-160px @click="goto">
                {{ loginState.isLogin ? '去创建' : '去登陆' }}
              </van-button>
            </van-empty>
          </template>
        </template>
      </template>
      <template v-else-if="tabActive === 1">
        <template v-if="isLoading.joined">
          <SkeletonCom type="questionSetCard" />
        </template>
        <template v-else>
          <template v-if="joinedQuestionSetList.length > 0">
            <QuestionSetCardCom
              v-for="questionSet in joinedQuestionSetList"
              :key="questionSet.id"
              :data="questionSet"
              @click="showStart"
            />
          </template>
          <template v-else>
            <van-empty
              image="empty.png"
              image-size="80"
              :description="loginState.isLogin ? '题库为空' : '请先登录'"
            >
              <van-button round type="primary" w-160px @click="goto">
                {{ loginState.isLogin ? '去创建' : '去登陆' }}
              </van-button>
            </van-empty>
          </template>
        </template>
      </template>
    </div>
    <StartCom />
    <TabBarCom />
  </div>
</template>

<style lang="less" scoped>
.bg {
  background: linear-gradient(to top, #E2E2E2, #C9D6FF); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}
</style>
