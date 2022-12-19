import type { Question } from '@exercise/type'
import type { Return } from './request'
import a from './request'
export function updateQuestionAnswer(options: Partial<Question>): Return {
  const url = '/question/update'
  return new Promise((resolve) => {
    setTimeout(async () => {
      const res = await a.put(url, options)
      resolve([undefined, res.data])
    }, 350)
  })
}
export function updateQuestions(questions: Question[]): Return {
  const url = '/question/update-list'
  return new Promise((resolve) => {
    setTimeout(async () => {
      const res = await a.put(url, questions)
      resolve([undefined, res.data])
    }, 350)
  })
}
