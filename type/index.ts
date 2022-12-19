export interface User {
  account: string
  name: string
}
export type QuestionType = 'select' | 'judge'
export interface Question {
  id: string
  type: QuestionType
  title: string
  isDo: 0 | 1
  isError: 0 | 1
  testAnswer: string
  exerciseAnswer: string
  correctAnswer: string
}
export interface QuestionSet {
  id: string
  title: string
  isActive: 0 | 1
  num: number
  createTime: string
  author: User
  questions: Question[]
}
