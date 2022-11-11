import type { IAnswerKey } from '../answer-key'

export type QuestionType = 'select' | 'judge'
export interface IQuestion {
  id: string
  type: QuestionType
  title: string
  isDo: 0 | 1
  isError: 0 | 1
  testAnswer: string
  exerciseAnswer: string
  correctAnswer: string
  answerKey?: IAnswerKey
}
