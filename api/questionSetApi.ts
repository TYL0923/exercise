import type { AxiosRequestConfig } from 'axios'
import type { QuestionSet } from '@exercise/type'
import type { Return } from './request'
import a from './request'
export function identifyQuestionSet(
  options: {
    param: FormData
    config?: AxiosRequestConfig | undefined
  },
): Return {
  const url = '/questionSet/identify'
  return new Promise((resolve) => {
    setTimeout(async () => {
      const res = await a.post(url, options.param, options.config)
      resolve([undefined, res.data])
    }, 0)
  })
}

export function addQuestionSet(
  questionSet: Pick<QuestionSet, 'title' | 'createTime' | 'questions' | 'tags'> & { account: string },
): Return<boolean> {
  const url = '/questionSet/add'
  return new Promise((resolve) => {
    setTimeout(async () => {
      const res = await a.post(url, questionSet)
      resolve([undefined, res.data])
    }, 1000)
  })
}

export function joinQuestionSetById(
  questionSetId: string,
  account: string,
): Return<boolean> {
  const url = '/questionSet/join'
  return new Promise((resolve) => {
    setTimeout(async () => {
      const res = await a.post(url, {
        questionSetId,
        joinAccount: account,
      })
      resolve([undefined, res.data])
    }, 1000)
  })
}

export function getCreatedQuestionSet(account: string): Return<QuestionSet[]> {
  const url = '/questionSet/created'
  return new Promise((resolve) => {
    setTimeout(async () => {
      const res = await a.get(url, { params: { account } })
      resolve([undefined, res.data])
    }, 450)
  })
}
export function getJoinedQuestionSet(account: string): Return<QuestionSet[]> {
  const url = '/questionSet/joined'
  return new Promise((resolve) => {
    setTimeout(async () => {
      const res = await a.get(url, { params: { account } })
      resolve([undefined, res.data])
    }, 450)
  })
}
export function getQuestionSetSimple(
  id: string,
  delay = 0,
): Return<Omit<QuestionSet, 'questions'>> {
  const url = '/questionSet/simple'
  return new Promise((resolve) => {
    setTimeout(async () => {
      const res = await a.get(url, { params: { id } })
      resolve([undefined, res.data])
    }, delay)
  })
}

/**
 * 获取题库详情
 * @param id 题库id
 * @param account 账号
 * @returns 题库详情
 */
export function getQuestionSetDetail(
  id: string,
  account: string,
): Return<QuestionSet> {
  const url = '/questionSet/detail'
  return new Promise((resolve) => {
    setTimeout(async () => {
      const res = await a.get(url, { params: { id, account } })
      resolve([undefined, res.data])
    }, 350)
  })
}

export function updateQuestionSet(
  questionSet: Omit<QuestionSet, 'createTime'>,
): Return<QuestionSet> {
  const url = '/questionSet/update'
  return new Promise((resolve) => {
    setTimeout(async () => {
      const res = await a.put(url, questionSet)
      resolve([undefined, res.data])
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
): Return<boolean> {
  const url = '/questionSet/reset'
  return new Promise((resolve) => {
    setTimeout(async () => {
      const res = await a.put(url, { id, account, mode })
      resolve([undefined, res.data])
    }, 350)
  })
}

export function queryJoinableQuestionSet(options: {
  id?: string | undefined
  keyWord?: string | undefined
  author?: string | undefined
  account?: string | undefined
}): Return<QuestionSet[]> {
  const url = '/questionSet/joinable'
  return new Promise((resolve) => {
    setTimeout(async () => {
      const res = await a.get(url, { params: { ...options } })
      resolve([undefined, res.data])
    }, 350)
  })
}
export function removeQuestionSet(options: {
  id: string
  account: string
}): Return<QuestionSet> {
  const url = '/questionSet/remove'
  return new Promise((resolve) => {
    setTimeout(async () => {
      const res = await a.put(url, options)
      resolve([undefined, res.data])
    }, 350)
  })
}
export function exitQuestionSet(options: {
  id: string
  account: string
}): Return<boolean> {
  const url = '/questionSet/exit'
  return new Promise((resolve) => {
    setTimeout(async () => {
      const res = await a.put(url, options)
      resolve([undefined, res.data])
    }, 350)
  })
}
