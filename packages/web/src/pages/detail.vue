<script setup lang="ts">
import type { FormInstance, UploadChangeParam } from 'ant-design-vue/es'
import { message } from 'ant-design-vue/es'
import { addQuestionSet, identifyQuestionSet } from '@exercise/api'
import type { Question } from '@exercise/type'
import router from '../router'

const route = useRoute()
const oForm = ref<FormInstance | null>(null)
const loginState = useLogin()
const status = ref<'edit' | 'add'>(route.query.status as 'edit' | 'add')
const isAddTag = ref<boolean>(false)
const questionSetForm = ref<{
  title: string
  author: string
  tags: string[]
}>({
  title: '',
  author: loginState.account.value || '',
  tags: [],
})
const questionList = ref<Question[]>([])
const { handleChangeAnswer } = useQuestion(questionList, { isSync: false })
function addTag(eventTarget: any) {
  const tag = eventTarget.value.trim() || ''
  if (!!tag.length && !questionSetForm.value.tags.includes(tag)) {
    const res = questionSetForm.value.tags.push(tag)
    if (res) {
      message.success({
        content: '添加成功',
        key: 'addTag',
        duration: 1,
      })
    }
    else {
      message.error({
        content: '添加失败',
        key: 'addTag',
        duration: 1,
      })
    }
  }
  isAddTag.value = false
}
function removeTag(tag: string) {
  questionSetForm.value.tags = questionSetForm.value.tags.filter(item => item !== tag)
}
function handlecancel() {
  status.value = 'add'
  questionList.value = []
}
function handleGoBack() {
  handlecancel()
  router.go(-1)
}
function handleSubmit() {
  oForm.value?.validate()
    .then(async (value) => {
      message.loading({
        content: '创建中',
        key: 'create-question-set',
      })
      const tagStr = questionSetForm.value.tags.reduce((pre, cur, index) => {
        if (!index)
          return `${pre}${cur}`
        else return `${pre},${cur}`
      }, '')
      const [err, data] = await addQuestionSet({
        title: value.title,
        createTime: new Date().toLocaleString(),
        account: (value.author as string) || '',
        tags: tagStr,
        questions: questionList.value,
      })
      if (!err && data) {
        message.success({
          content: '创建成功',
          key: 'create-question-set',
          duration: 1,
        })
        router.push('/home/question-set')
      }
      else {
        message.error({
          content: '创建失败',
          key: 'create-question-set',
          duration: 1,
        })
      }
    })
    .catch(() => {})
}
async function customRequest(file: any) {
  const type = file.file.name.split('.').pop()
  if (!['txt', 'docx'].includes(type)) {
    message.error({
      content: '请选择正确文件格式',
      key: 'upload',
      duration: 1,
    })
    return false
  }
  const form = new FormData()
  form.append('file', file.file)
  form.append('contractName', file.file.name)
  form.append('description', file.file.name)
  const [err, data] = await identifyQuestionSet({
    param: form,
  })
  if (!err && data) {
    if (data.length > 0) {
      questionList.value = data
      status.value = 'edit'
    }
    else {
      message.error({
        content: '没有识别到题目，请检查题目格式是否正确',
        key: 'identify',
        duration: 1,
      })
    }
  }
}
</script>

<template>
  <div bg-gray-100 w-screen h-screen box-border relative p-4 overflow-y-auto>
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
        创建题库
      </div>
      <div w-60 />
    </div>
    <template v-if="status === 'add'">
      <div
        bg-white w-100 h-100 rounded-1 absolute
        class="top-50% left-50% -translate-x-1/2 -translate-y-1/2"
      >
        <a-upload-dragger
          :show-upload-list="false"
          :headers="{ 'Content-Type': 'multipart/form-data' }"
          :custom-request="customRequest"
        >
          <p>
            点击或拖拽上传
          </p>
          <p>
            支持txt、doc、docx文件格式
          </p>
        </a-upload-dragger>
      </div>
    </template>
    <template v-else>
      <div
        bg-white rounded-2 px-8 py-4
        class="w-4/5 mt-15 mb-10 mx-auto"
      >
        <a-divider>
          基本信息
        </a-divider>
        <div py-4>
          <a-form
            ref="oForm"
            layout="inline"
            :model="questionSetForm"
          >
            <a-form-item
              label="名称"
              name="title"
              :rules="[{ required: true, message: '请输入题目及名称' }]"
            >
              <a-input v-model:value="questionSetForm.title" />
            </a-form-item>
            <a-form-item
              label="作者"
              name="author"
            >
              <a-input disabled :value="questionSetForm.author as string" />
            </a-form-item>
          </a-form>
        </div>
        <a-divider>
          题库标签
        </a-divider>
        <div py-4>
          <a-tag
            v-for="tag in questionSetForm.tags"
            :key="tag"
            color="blue"
            closable
            @close="removeTag(tag)"
          >
            {{ tag }}
          </a-tag>
          <a-tag v-if="!isAddTag" color="blue" @click="isAddTag = true">
            添加标签+
          </a-tag>
          <a-input
            v-else
            w-200px
            @keyup.enter="($event.target as any).blur()"
            @blur="addTag($event.target!)"
          />
        </div>
        <a-divider>
          题目列表
        </a-divider>
        <div py-4>
          <QuestionSetCom status="edit" :list="questionList" @change-answer="handleChangeAnswer" />
        </div>
        <div flex items-center justify-center gap-10 mb-4>
          <a-button type="primary" @click="handleSubmit">
            提交
          </a-button>
          <a-button @click="handlecancel">
            取消
          </a-button>
        </div>
      </div>
    </template>
  </div>
</template>
