<script setup lang="ts">
import type { FormInstance, UploadChangeParam } from 'ant-design-vue/es'
import { message } from 'ant-design-vue/es'
import { addQuestionSet, identifyQuestionSet } from '@exercise/api'
import type { IQuestion, IQuestionSet } from '@exercise/type'
import router from '../router'

const route = useRoute()
const oForm = ref<FormInstance | null>(null)
const loginState = useLogin()
const status = ref<'edit' | 'add'>(route.query.status as 'edit' | 'add')
const fileList = ref([])
const questionSetForm = ref<Pick<IQuestionSet, 'title' | 'author'>>({
  title: '',
  author: loginState.account.value || '',
})
const questionList = ref<IQuestion[]>([])
const { handleChangeAnswer } = useQuestion(questionList)

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
      const [err, data] = await addQuestionSet({
        title: value.title,
        createTime: new Date().toLocaleString(),
        endTime: new Date().toLocaleString(), // todo
        author: (value.author as string) || '',
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

function handleChange(info: UploadChangeParam) {

}
async function customRequest(file: any) {
  // console.log('开始上传')
  const form = new FormData()
  form.append('file', file.file)
  form.append('contractName', file.file.name)
  form.append('description', file.file.name)
  const [err, data] = await identifyQuestionSet({
    param: form,
  })
  if (!err && data) {
    questionList.value = data
    status.value = 'edit'
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
      <div w-60>
        --
      </div>
    </div>
    <template v-if="status === 'add'">
      <div
        bg-white w-100 h-100 rounded-1 absolute
        class="top-50% left-50% -translate-x-1/2 -translate-y-1/2"
      >
        <a-upload-dragger
          :file-list="fileList"
          :headers="{ 'Content-Type': 'multipart/form-data' }"
          :custom-request="customRequest"
          @change="handleChange"
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
        bg-white rounded-2 p-4
        class="w-4/5 mt-15 mb-10 mx-auto"
      >
        <div>
          <h5>基本信息</h5>
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
              <a-input disabled :value="questionSetForm.author" />
            </a-form-item>
          </a-form>
        </div>
        <div border-t-1 border-gray-100 mt-10 pt-4>
          <h5>题目列表</h5>
          <QuestionSet status="edit" :list="questionList" @change-answer="handleChangeAnswer" />
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
