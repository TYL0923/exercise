import type { QuestionSet } from '@exercise/type'
import type { AxiosRequestConfig } from 'axios'
import type { Return } from './request'
import { get, post, put } from './request'

/**
 * 识别文件，提取题目
 * @param options 识别文件
 * @returns
 */
export function identifyQuestionSet(
  options: {
    param: FormData
    config?: AxiosRequestConfig | undefined
  },
): Return {
  const url = '/questionSet/identify'
  return new Promise((resolve) => {
    setTimeout(async () => {
      const res = await post(url, options.param, options.config)
      resolve(res)
    }, 0)
  })
  // const url = '/questionSet/identify'
  // return post(url, options.param, options.config)
}

/**
 * 创建题库
 * @param questionSet 创建题库信息
 * @returns
 */
export function addQuestionSet(
  questionSet: Pick<QuestionSet, 'title' | 'createTime' | 'questions' | 'tags'> & { account: string },
): Return {
  const url = '/questionSet/add'
  return post(url, questionSet)
}

/**
 * 获取推荐题库
 * @returns
 */
export async function getRecommendQuestionSet(): Promise<Return> {
  const url = '/questionSet/joinable'
  return get(url)
}

/**
 * 获取创建的题库
 * @param account 账号
 * @returns
 */
export async function getCreatedQuestionSet(account: string): Return {
  const url = '/questionSet/created'
  return get(url, { account })
}

/**
 * 获取加入的题库
 * @param account 账号
 * @returns
 */
export async function getJoinedQuestionSet(account: string): Return {
  const url = '/questionSet/joined'
  return get(url, { account })
}

/**
 * 查询可加入题库
 * @param options 查询条件
 * @returns
 */
export function queryJoinableQuestionSet(options: {
  id?: string | undefined
  keyWord?: string | undefined
  author?: string | undefined
  account?: string | undefined
}): Return {
  const url = '/questionSet/joinable'
  return get(url, { ...options })
}

/**
 * 加入题库
 * @param questionSetId 加入题库id
 * @param account 账号
 * @returns
 */
export function joinQuestionSetById(
  questionSetId: string,
  account: string,
): Return {
  const url = '/questionSet/join'
  return post(url, {
    questionSetId,
    joinAccount: account,
  })
}

/**
 * 获取题库信息
 * @param id 题库id
 * @param account 账号
 * @returns
 */
export function getQuestionSetDetail(
  id: string,
  account: string,
): Return {
  const url = '/questionSet/detail'
  return get(url, { id, account })
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
): Return {
  const url = '/questionSet/reset'
  return put(url, { id, account, mode })
}

/**
 * 获取题库简单信息
 * @param id 题库id
 * @returns
 */
export function getQuestionSetSimple(
  id: string,
): Return {
  const url = '/questionSet/simple'
  return get(url, { id })
}

/**
 * 更新题库
 * @param questionSet 题库信息
 * @returns
 */
export function updateQuestionSet(
  questionSet: Omit<QuestionSet, 'createTime'>,
): Return {
  const url = '/questionSet/update'
  return put(url, questionSet)
}

/**
 * 删除题库
 * @param options 题库id、账号
 * @returns
 */
export function removeQuestionSet(options: {
  id: string
  account: string
}): Return {
  const url = '/questionSet/remove'
  return put(url, options)
}

/**
 * 退出题库
 * @param options 题库id、账号
 * @returns
 */
export function exitQuestionSet(options: {
  id: string
  account: string
}): Return {
  const url = '/questionSet/exit'
  return put(url, options)
}
