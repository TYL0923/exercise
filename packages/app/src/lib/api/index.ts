import type { Question } from '@exercise/type'

const baseUrl = 'http://47.113.144.160:8000'
const duration = 350 // ms
interface Return {
  err?: string
  data: any
}
function get(url: string, params?: Record<string, any>): Promise<Return> {
  return new Promise((resolve, reject) => {
    uni.request({
      url: `${baseUrl}${url}`,
      method: 'GET',
      data: params || {},
      success(res: any) {
        if (res.statusCode === 200 && res.data) {
          resolve({
            data: res.data.data,
          })
        }
        else {
          resolve({
            // todo code generate err
            err: '请求失败',
            data: res.data.data,
          })
        }
      },
      fail(err: any) {
        reject(err)
      },
    })
  })
}
function post(url: string, params?: Record<string, any>): Promise<Return> {
  return new Promise((resolve, reject) => {
    uni.request({
      url: `${baseUrl}${url}`,
      method: 'POST',
      data: params || {},
      success(res: any) {
        if (['200', '201'].includes(res.statusCode.toString()) && res.data) {
          resolve({
            data: res.data.data,
          })
        }
        else {
          resolve({
            // todo code generate err
            err: '请求失败',
            data: res.data.data,
          })
        }
      },
      fail(err: any) {
        reject(err)
      },
    })
  })
}
function put(url: string, params?: Record<string, any>): Promise<Return> {
  return new Promise((resolve, reject) => {
    uni.request({
      url: `${baseUrl}${url}`,
      method: 'PUT',
      data: params || {},
      success(res: any) {
        if (['200', '201'].includes(res.statusCode.toString()) && res.data) {
          resolve({
            data: res.data.data,
          })
        }
        else {
          resolve({
            // todo code generate err
            err: '请求失败',
            data: res.data.data,
          })
        }
      },
      fail(err: any) {
        reject(err)
      },
    })
  })
}
export function passwordLogin(account: string, password: string): Promise<Return> {
  const url = '/user/login'
  return new Promise((resolve) => {
    setTimeout(() => {
      const res = post(url, { account, password })
      resolve(res)
    }, duration)
  })
}

export async function getRecommendQuestionSet(): Promise<Return> {
  const url = '/questionSet/joinable'
  return new Promise((resolve) => {
    setTimeout(() => {
      const res = get(url)
      resolve(res)
    }, duration)
  })
}
export async function getCreatedQuestionSet(account: string): Promise<Return> {
  const url = '/questionSet/created'
  return new Promise((resolve) => {
    setTimeout(() => {
      const res = get(url, { account })
      resolve(res)
    }, duration)
  })
}
export async function getJoinedQuestionSet(account: string): Promise<Return> {
  const url = '/questionSet/joined'
  return new Promise((resolve) => {
    setTimeout(() => {
      const res = get(url, { account })
      resolve(res)
    }, duration)
  })
}
export function queryJoinableQuestionSet(options: {
  id?: string | undefined
  keyWord?: string | undefined
  author?: string | undefined
  account?: string | undefined
}): Promise<Return> {
  const url = '/questionSet/joinable'
  return new Promise((resolve) => {
    setTimeout(() => {
      const res = get(url, { ...options })
      return resolve(res)
    }, duration)
  })
}

export function joinQuestionSetById(
  questionSetId: string,
  account: string,
): Promise<Return> {
  const url = '/questionSet/join'
  return new Promise((resolve) => {
    setTimeout(async () => {
      const res = await post(url, {
        questionSetId,
        joinAccount: account,
      })
      resolve(res)
    }, duration)
  })
}

export function getQuestionSetDetail(
  id: string,
  account: string,
): Promise<Return> {
  const url = '/questionSet/detail'
  return new Promise((resolve) => {
    setTimeout(async () => {
      const res = await get(url, { id, account })
      resolve(res)
    }, duration)
  })
}

export function updateQuestionAnswer(options: Partial<Question>): Promise<Return> {
  const url = '/question/update'
  return new Promise((resolve) => {
    setTimeout(async () => {
      const res = await put(url, { ...options })
      resolve(res)
    }, duration)
  })
}
export function updateQuestions(questions: Question[]): Promise<Return> {
  const url = '/question/update-list'
  return new Promise((resolve) => {
    setTimeout(async () => {
      const res = await put(url, questions)
      resolve(res)
    }, 350)
  })
}
/**
 * 清空题目集答案
 * @param id 题目集id
 * @param account 账号
 * @param mode 模式
 * @returns treu or false
 */
export function resetQuestion(
  id: string,
  account: string,
  mode: 'test' | 'exercise',
): Promise<Return> {
  const url = '/questionSet/reset'
  return new Promise((resolve) => {
    setTimeout(async () => {
      const res = await put(url, { id, account, mode })
      resolve(res)
    }, duration)
  })
}
