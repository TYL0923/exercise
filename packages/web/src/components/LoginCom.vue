<script setup lang="ts">
import { login } from '@exercise/api'
import { message } from 'ant-design-vue/es'
const props = defineProps<{
  isShow: boolean
}>()
interface LoginForm {
  account: string
  password: string
  isLocal: false
}
const router = useRouter()
const loginState = useLogin()
const loginForm = reactive<LoginForm>({
  account: 'admin1',
  password: 'admin1',
  isLocal: false,
})
const onFinish = async (values: LoginForm) => {
  message.loading({
    content: `${values.account}登录中`,
    key: 'login',
  })
  const [err, data] = await login({
    account: values.account,
    password: values.password,
  })
  if (!err && data) {
    message.success({
      content: '登录成功',
      key: 'login',
      duration: 1,
    })
    loginState.login(data.account, data.name, data.token)
    router.push('/home')
  }
  else {
    message.error({
      content: '登录失败',
      key: 'login',
      duration: 1,
    })
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
              <template #prefix>
                <Icon icon="ph:user" width="26px" />
              </template>
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
              <template #prefix>
                <Icon icon="ph:lock-simple" width="26px" />
              </template>
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
