import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
export type { AxiosRequestConfig, AxiosResponse } from 'axios'
// const baseURL = 'http://127.0.0.1:8000'
const baseURL = 'https://api.onlinexercise.top'
const a: AxiosInstance = axios.create({
  baseURL,
  timeout: 10000,
})
const duration = 350 // ms
export interface IResponse {
  err?: string
  data: any
}
export type Return<T = IResponse> = Promise<T>
export function get(url: string, params?: any, config?: AxiosRequestConfig): Return {
  if (config)
    config.params = params
  return new Promise((resolve) => {
    setTimeout(async () => {
      const res = await a.get(url, config || { params })
      resolve(res)
    }, duration)
  })
}
export function post(url: string, params: any, config?: AxiosRequestConfig): Return {
  return new Promise((resolve) => {
    setTimeout(async () => {
      const res = await a.post(url, params, config)
      resolve(res)
    }, duration)
  })
}
export function put(url: string, params: any, config?: AxiosRequestConfig): Return {
  return new Promise((resolve) => {
    setTimeout(async () => {
      const res = await a.put(url, params, config)
      resolve(res)
    }, duration)
  })
}

// const baseRequestInterceptors = (config: AxiosRequestConfig) => {
//   return config
// }
// const baseResponseInterceptors = (response: AxiosResponse) => {
//   return response
// }
// const initInterceptors = () => {
//   a.interceptors.request.use(baseRequestInterceptors)
//   a.interceptors.response.use(baseResponseInterceptors)
// }
// initInterceptors()

export function setInterceptors(
  requestInterceptors: (config: AxiosRequestConfig) => any,
  responseInterceptors: (response: AxiosResponse) => IResponse,
) {
  a.interceptors.request.use(requestInterceptors)
  a.interceptors.response.use(responseInterceptors)
}
