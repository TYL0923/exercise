<!-- <script setup lang="ts">
import { reactive, ref } from 'vue'
import { passwordLogin } from '../lib/api'
import { useLoginState } from '../composables'
type LoginMode = 'password' | 'verificationCode' | 'weixin' | 'qq'
const loginState = useLoginState()
const mode = ref<LoginMode>('password')
const isLogin = ref<boolean>(false)
const formRef = ref<null | any>(null)
const loginFrom = reactive({
  account: '15285504708',
  password: 'admin',
  verificationCode: '',
})
const rules = reactive({
  account: {
    rules: [
      {
        required: true,
        errorMessage: '请输入账号',
      },
      {
        minLength: 6,
        maxLength: 11,
        errorMessage: '账号长度为6-11位',
      },
    ],
  },
  password: {
    rules: [
      {
        required: true,
        errorMessage: '请输入密码',
      },
    ],
  },
})
function handleChangeLoginMode(loginMode: LoginMode) {
  loginFrom.password = ''
  loginFrom.verificationCode = ''
  mode.value = loginMode
}
async function login() {
  formRef.value.validate()
    .then(async (res: Partial<typeof loginFrom>) => {
      if (mode.value === 'password') {
        isLogin.value = true
        const { err, data } = await passwordLogin(res.account!, res.password!)
        if (!err && data) {
          loginState.login(data.account, data.name, data.token)
          uni.switchTab({
            url: '/pages/my',
          })
        }
        isLogin.value = false
      }
      // todo verificationCode login
    })
    .catch(() => {})
}
function wxLogin() {
  // // uni.getUserInfo({
  // //   success(res) {
  // //     console.log(res)
  // //   },
  // // })
  // console.log(uni.getUserProfile)
  // uni.getUserProfile({
  //   desc: '获取你的昵称、头像、地区及性别',
  //   success(res) {
  //     console.log(res)
  //   },
  //   fail(err) {
  //     console.log(err)
  //   },
  // })
}
</script>

<template>
  <view>
    <view h-100 />
    <view p-4>
      <uni-forms ref="formRef" :model-value="loginFrom" :rules="rules">
        <uni-forms-item lable="账号" name="account">
          <view border-b-1 border-gray-200 my-2>
            <uni-easyinput v-model="loginFrom.account" :input-border="false" type="text" placeholder="请输入账号" />
          </view>
        </uni-forms-item>
        <uni-forms-item lable="密码" name="password">
          <view border-b-1 border-gray-200 my-2>
            <uni-easyinput v-if="mode === 'password'" v-model="loginFrom.password" :input-border="false" type="text" placeholder="请输入密码">
              <template #right>
                <view text-xs text-sky-500>
                  忘记密码
                </view>
              </template>
            </uni-easyinput>
            <uni-easyinput v-else-if="mode === 'verificationCode'" v-model="loginFrom.verificationCode" :input-border="false" type="text" placeholder="请输入验证码">
              <template #right>
                <view text-xs text-sky-500>
                  发送验证码
                </view>
              </template>
            </uni-easyinput>
          </view>
        </uni-forms-item>
      </uni-forms>
      <button my-8 :type="'primary' as any" block size="small" :loading="isLogin" @click="login">
        登录
      </button>

      <view my-4 text-xs text-sky-500 flex flex-col items-center>
        <view v-if="mode === 'password'" @click="handleChangeLoginMode('verificationCode')">
          短信验证登录
        </view>
        <view v-else-if="mode === 'verificationCode'" @click="handleChangeLoginMode('password')">
          账号密码登录
        </view>
      </view>
      <view my-10 flex flex-col items-center>
        <view w-400 border-t-1 border-gray-200 relative>
          <view text-xs text-gray-400 absolute bg-white px-1 class="-top-18 left-50% -translate-x-50%">
            第三方登录
          </view>
        </view>
        <view my-6 flex items-center justify-center gap-x-4>
          <van-icon name="wechat" color="#16a34a" size="1.8rem" @click="wxLogin" />
          <van-icon name="qq" color="#0ea5e9" size="1.8rem" />
        </view>
      </view>
    </view>
  </view>
</template> -->
