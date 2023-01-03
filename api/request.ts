import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import axios from 'axios'
const DEV_URL = 'http://127.0.0.1:8000'
const PRO_URL = 'http://47.113.144.160:8000'
const a: AxiosInstance = axios.create({
  baseURL: PRO_URL,
  timeout: 10000,
})

export interface IResponse {
  code: string
  message: string
  data: any
}

export type Return<T = any> = Promise<[string | null | undefined, T]>
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
export default a
