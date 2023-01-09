<script setup lang="ts">
import { closeToast, showFailToast, showLoadingToast, showNotify, showSuccessToast, showToast } from 'vant'
import { checkAccount, passwordLogin, registerAccount } from '../lib/api'
import { useLoginState, useTabBar } from '../composables'
type LoginMode = 'password' | 'verificationCode' | 'weixin' | 'qq'
const loginState = useLoginState()
const mode = ref<LoginMode>('password')
const page = ref<'login' | 'register'>('login')
const { active } = useTabBar()
const loginFrom = reactive({
  account: 'admin2',
  password: 'admin2',
  verificationCode: '',
})
const registerFrom = reactive({
  account: 'admin2',
  password: 'admin2',
  confirmPassword: 'admin2',
})
function handleChangeLoginMode(loginMode: LoginMode) {
  if (loginMode !== 'password') {
    showNotify({
      type: 'primary',
      message: '暂不支持',
      duration: 350,
    })
  }
}
function accountValidator(val: string) {
  const rule = /^[A-Za-z0-9]+$/
  return val.length >= 6 && val.length <= 12 ? !rule.test(val) ? '请保证只含有字母和数字' : '' : '长度在6-12之间'
}
function passwordValidator(val: string) {
  const rule = /^[A-Za-z0-9]+$/
  return val.length >= 6 && val.length <= 12 ? !rule.test(val) ? '请保证只含有字母和数字' : '' : '长度在6-12之间'
}
function confirmPasswordValidator(val: string) {
  return val.trim() !== registerFrom.password.trim() ? '两次输入密码不一致' : ''
}
// function a() {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve(false)
//     }, 1000)
//   })
// }
// function b() {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve(true)
//     }, 1000)
//   })
// }
async function register() {
  showLoadingToast({
    message: '验证账号中...',
    forbidClick: true,
  })
  // const data = await a()
  const { data } = await checkAccount(registerFrom.account)
  if (data) {
    return showToast({
      message: '账号已存在',
    })
  }
  showLoadingToast({
    message: '注册中...',
    forbidClick: true,
  })
  // const d = await b()
  const { data: d } = await registerAccount(registerFrom.account, registerFrom.password)
  if (d) {
    showToast('注册成功')
    loginFrom.account = registerFrom.account
    loginFrom.password = registerFrom.password
    page.value = 'login'
    if (mode.value === 'password')
      login()
  }
  else {
    showToast({
      message: '注册失败,请稍后重试',
    })
  }
}
async function login() {
  if (mode.value === 'password') {
    showLoadingToast({
      message: '登录中...',
      forbidClick: true,
    })
    const { err, data } = await passwordLogin(loginFrom.account, loginFrom.password)
    closeToast()
    if (!err && data) {
      loginState.login(data.account, data.name, data.token)
      showNotify({
        type: 'success',
        message: '登录成功',
        duration: 1000,
      })
      // uni.navigateBack()
      active.value = 2
      uni.navigateTo({
        url: '/pages/my',
      })
    }
    else {
      showNotify({
        type: 'danger',
        message: '登录失败',
        duration: 1000,
      })
    }
  }
  // todo verificationCode login
}
function back() {
  uni.navigateTo({
    url: '/pages/index',
  })
}
function wxLogin() {
  showNotify({
    type: 'primary',
    message: '暂不支持',
    duration: 350,
  })
}
function qqLogin() {
  showNotify({
    type: 'primary',
    message: '暂不支持',
    duration: 350,
  })
}
</script>

<template>
  <div>
    <van-nav-bar
      :title="page === 'login' ? '登录' : '注册'"
      left-text="返回"
      left-arrow
      @click-left="back"
    />
    <template v-if="page === 'login'">
      <van-form mt-4 p-4 @submit="login">
        <div h-120px>
          <van-field
            v-model="loginFrom.account"
            mb-4
            name="账号"
            placeholder="账号"
            :rules="[{ required: true, message: '请输入账号' }]"
          >
            <template #left-icon>
              <van-icon name="manager" size="24" />
            </template>
          </van-field>
          <van-field
            v-model="loginFrom.password"
            type="password"
            name="密码"
            placeholder="密码"
            :rules="[{ required: true, message: '请填写密码' }]"
          >
            <template #left-icon>
              <van-icon name="lock" size="24" />
            </template>
          </van-field>
        </div>
        <div mt-6>
          <van-button round block type="primary" native-type="submit">
            登录
          </van-button>
          <div px-4 mt-10 flex justify-center>
            <span text-xs text-sky-500 @click="page = 'register'">没有帐号,去注册</span>
          </div>
        </div>
      </van-form>
      <div mt-2 mb-10 text-xs text-sky-500 flex flex-col items-center>
        <div v-if="mode === 'password'" @click="handleChangeLoginMode('verificationCode')">
          短信验证登录
        </div>
        <div v-else-if="mode === 'verificationCode'" @click="handleChangeLoginMode('password')">
          账号密码登录
        </div>
      </div>
      <div my-10 flex flex-col items-center>
        <div w-400 border-t-1 border-gray-200 relative>
          <div text-xs text-gray-400 absolute bg-white px-1 class="-top-18 left-50% -translate-x-50%">
            第三方登录
          </div>
        </div>
        <div my-6 flex items-center justify-center gap-x-4>
          <van-icon name="wechat" color="#16a34a" size="1.8rem" @click="wxLogin" />
          <van-icon name="qq" color="#0ea5e9" size="1.8rem" @click="qqLogin" />
        </div>
      </div>
    </template>
    <template v-else>
      <van-form mt-4 p-4 @submit="register">
        <div h-200px grid grid-rows-3>
          <van-field
            v-model="registerFrom.account"
            name="账号"
            placeholder="账号"
            :rules="[{ validator: passwordValidator }]"
          />
          <van-field
            v-model="registerFrom.password"
            type="password"
            name="密码"
            placeholder="密码"
            :rules="[{ validator: accountValidator }]"
          />
          <van-field
            v-model="registerFrom.confirmPassword"
            type="password"
            name="确认密码"
            placeholder="确认密码"
            :rules="[{ validator: confirmPasswordValidator }]"
          />
        </div>
        <div mt-6>
          <van-button round block type="primary" native-type="submit">
            注册
          </van-button>
          <div px-4 mt-10 flex justify-center>
            <span text-xs text-sky-500 @click="page = 'login'">已有帐号,去登录</span>
          </div>
        </div>
      </van-form>
    </template>
  </div>
</template>
