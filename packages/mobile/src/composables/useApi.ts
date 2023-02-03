import * as api from '@exercise/api'
import { setInterceptors } from '@exercise/api'
import type { AxiosRequestConfig, AxiosResponse } from '@exercise/api'
import { closeToast, showToast } from 'vant'

let isInit = false
export function useApi() {
  const requestInterceptors = (config: AxiosRequestConfig) => {
    const loginState = JSON.parse(sessionStorage.getItem('login') || 'null') || {}
    if (loginState.token)
      config.headers!.token = loginState.token
    return config
  }
  const responseInterceptors = (response: AxiosResponse) => {
    const { err } = response.data
    if (err) {
      closeToast()
      showToast({
        type: 'fail',
        message: `请求失败,${err}`,
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
