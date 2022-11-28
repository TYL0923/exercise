import type { AxiosRequestConfig } from 'axios'
import type { AddQuestionSetDto, IQuestion, IQuestionSet } from '@exercise/type'
import type { Return } from './request'
import a from './request'
export function identifyQuestionSet(
  options: {
    param: FormData
    config?: AxiosRequestConfig | undefined
  },
): Return {
  const url = 'http://127.0.0.1:8000/questionSet/identify'
  return new Promise(async (resolve) => {
    const res = await a.post(url, options.param, options.config)
    resolve([undefined, res.data])
  })
}

export function addQuestionSet(
  questionSet: AddQuestionSetDto,
): Return<boolean> {
  const url = 'http://127.0.0.1:8000/questionSet/add'
  return new Promise((resolve) => {
    setTimeout(async () => {
      const res = await a.post(url, questionSet)
      resolve([undefined, res.data])
    }, 1000)
  })
}

export function joinQuestionSet(
  questionSetId: string,
  account: string,
): Return<boolean> {
  const url = 'http://127.0.0.1:8000/questionSet/join'
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

export function getQuestionSetSimple(
  id: string,
  delay = 0,
): Return<IQuestionSet> {
  const url = 'http://127.0.0.1:8000/questionSet/simple'
  return new Promise((resolve) => {
    setTimeout(async () => {
      const res = await a.get(url, { params: { id } })
      resolve([undefined, res.data])
    }, delay)
  })
}
export function getQuestionSetDetail(
  id: string,
  account: string,
): Return<IQuestionSet & { questions: IQuestion[] }> {
  const url = 'http://127.0.0.1:8000/questionSet/detail'
  return new Promise((resolve) => {
    setTimeout(async () => {
      const res = await a.get(url, { params: { id, account } })
      resolve([undefined, res.data])
    }, 350)
  })
}

export function updateQuestionSet(
  questionSet: Omit<IQuestionSet, 'createTime' | 'author'> & { account: string },
): Return<IQuestionSet> {
  const url = 'http://127.0.0.1:8000/questionSet/update'
  return new Promise((resolve) => {
    setTimeout(async () => {
      const res = await a.put(url, questionSet)
      resolve([undefined, res.data])
    }, 350)
  })
}
export function resetQuestion(
  id: string,
  account: string,
  mode: 'test' | 'exercise',
): Return<IQuestionSet> {
  const url = 'http://127.0.0.1:8000/questionSet/reset'
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
}): Return<IQuestionSet[] | null> {
  const url = 'http://127.0.0.1:8000/questionSet/joinable'
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
}): Return<IQuestionSet | null> {
  const url = 'http://127.0.0.1:8000/questionSet/remove'
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
  const url = 'http://127.0.0.1:8000/questionSet/exit'
  return new Promise((resolve) => {
    setTimeout(async () => {
      const res = await a.put(url, options)
      resolve([undefined, res.data])
    }, 350)
  })
}
