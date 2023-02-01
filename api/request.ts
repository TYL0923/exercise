import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
const baseURL = 'http://127.0.0.1:8000'
// const baseURL = 'https://api.onlinexercise.top'
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
export function get(url: string, params?: Record<string, any>, config?: AxiosRequestConfig): Return {
  return new Promise((resolve) => {
    setTimeout(async () => {
      const res = await a.get(url, config || { params: { ...params } })
      resolve(res)
    }, duration)
  })
}
export function post(url: string, params: Record<string, any>, config?: AxiosRequestConfig): Return {
  return new Promise((resolve) => {
    setTimeout(async () => {
      const res = await a.post(url, { ...params }, config)
      resolve(res)
    }, duration)
  })
}
export function put(url: string, params: Record<string, any>, config?: AxiosRequestConfig): Return {
  return new Promise((resolve) => {
    setTimeout(async () => {
      const res = await a.put(url, { ...params }, config)
      resolve(res)
    }, duration)
  })
}
const initInterceptors = () => {
  a.interceptors.request.use((config: AxiosRequestConfig) => {
    const token = localStorage.getItem('TOKEN')
    if (token)
      config.headers!.token = token

    return config
  })
  a.interceptors.response.use(
    (response: AxiosResponse): IResponse => {
      return response.data
    },
  )
}
initInterceptors()
