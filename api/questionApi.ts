import type { Question } from '@exercise/type'
import type { Return } from './request'
import { put } from './request'

export function updateQuestionAnswer(options: Partial<Question>): Return {
  const url = '/question/update'
  return put(url, { ...options })
}
export function updateQuestions(questions: Question[]): Return {
  const url = '/question/update-list'
  return put(url, questions)
}
