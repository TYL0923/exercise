<script setup lang="ts">
import { message } from 'ant-design-vue/es'
const props = defineProps<{
  isShow: boolean
}>()
interface LoginForm {
  account: string
  password: string
  isLocal: false
}
const { passwordLogin } = useApi()
const router = useRouter()
const loginState = useLogin()
const loginForm = reactive<LoginForm>({
  account: 'admin2',
  password: 'admin2',
  isLocal: false,
})
const onFinish = async (values: LoginForm) => {
  message.loading({
    content: `${values.account}登录中`,
    key: 'login',
  })
  const { err, data } = await passwordLogin(
    values.account,
    values.password,
  )
  if (!err && data) {
    message.success({
      content: '登录成功',
      key: 'login',
      duration: 1,
    })
    loginState.login(loginForm.isLocal, {
      account: data.account,
      name: data.name,
      token: data.token,
    })
    router.push('/home/question-set')
  }
}
const onFinishFailed = () => {}
</script>

<template>
  <div
    v-if="isShow"
    class="-translate-50%"
    absolute inset="1/2"
    w-110 h-100 min-w-400px min-h-350px
    bg-white rounded-xl px-14
  >
    <div>
      <h1 my-10>
        Login
      </h1>
      <a-form
        :model="loginForm"
        @finish="onFinish"
        @finish-failed="onFinishFailed"
      >
        <a-form-item
          name="account"
          :rules="[{ required: true, message: '请输入账号' }]"
        >
          <div border-b-2 border-gray-100>
            <a-input
              v-model:value="loginForm.account"
              size="large"
              :bordered="false"
            >
              <template #prefix />
            </a-input>
          </div>
        </a-form-item>
        <a-form-item
          name="password"
          :rules="[{ required: true, message: '请输入密码' }]"
        >
          <div border-b-2 border-gray-100>
            <a-input
              v-model:value="loginForm.password"
              size="large"
              type="password"
              :bordered="false"
            >
              <template #prefix />
            </a-input>
          </div>
        </a-form-item>
        <div mt-10>
          <a-checkbox v-model:checked="loginForm.isLocal">
            记住我
          </a-checkbox>
          <a-button mt-1 w-full size="large" type="primary" html-type="submit">
            登录
          </a-button>
        </div>
      </a-form>
    </div>
  </div>
</template>
