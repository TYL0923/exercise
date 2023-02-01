import type { Return } from './request'
import { get, post } from './request'

export function checkAccount(account: string): Return {
  const url = '/user/checkAccount'
  return get(url, { account })
}
export function registerAccount(account: string, password: string): Return {
  const url = '/user/register'
  return post(url, { account, password })
}
export function passwordLogin(account: string, password: string): Return {
  const url = '/user/login'
  return post(url, { account, password })
}

