import type { BaseReturnQuestionSet } from '@exercise/type'
import type { Return } from './request'
import a from './request'

interface TRegisterParams {
  readonly account: string
  readonly password: string
}
export function register(
  registerParams: TRegisterParams,
): Return<boolean> {
  const url = '/user/register'
  return new Promise((resolve) => {
    setTimeout(async () => {
      const res = await a.post(url, registerParams)
      resolve([undefined, res.data])
    }, 1000)
  })
}

interface LoginParams {
  readonly account: string
  readonly password: string
}
interface LoginRes {
  account: string
  token: string
}
export function login(loginParams: LoginParams): Return<LoginRes> {
  const url = '/user/login'
  return new Promise((resolve) => {
    setTimeout(async () => {
      const res = await a.post(url, loginParams)
      resolve([undefined, res.data as LoginRes])
    }, 1000)
  })
}

export function getMyQuestionSet(account: string): Return<BaseReturnQuestionSet[]> {
  const url = 'http://127.0.0.1:8000/user/myQuestionSet'
  return new Promise((resolve) => {
    setTimeout(async () => {
      const res = await a.get(url, { params: { account } })
      resolve([undefined, res.data])
    }, 450)
  })
}
export function getMyJoinQuestionSet(account: string): Return<BaseReturnQuestionSet[]> {
  const url = 'http://127.0.0.1:8000/user/myJoinQuestionSet'
  return new Promise((resolve) => {
    setTimeout(async () => {
      const res = await a.get(url, { params: { account } })
      resolve([undefined, res.data])
    }, 450)
  })
}
