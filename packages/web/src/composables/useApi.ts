import * as api from '@exercise/api'
import { setInterceptors } from '@exercise/api'
import type { AxiosRequestConfig, AxiosResponse } from '@exercise/api'
import { message } from 'ant-design-vue/es'

let isInit = false
export function useApi() {
  const requestInterceptors = (config: AxiosRequestConfig) => {
    const loginState = JSON.parse(sessionStorage.getItem('login') || '') || {}
    if (loginState.token)
      config.headers!.token = loginState.token
    return config
  }
  const responseInterceptors = (response: AxiosResponse) => {
    const { err } = response.data
    if (err) {
      message.destroy()
      message.error({
        content: `请求失败,${err}`,
      })
    }
    return response.data
  }
  if (!isInit) {
    setInterceptors(requestInterceptors, responseInterceptors)
    isInit = true
  }
  return {
    ...api,
  }
}
