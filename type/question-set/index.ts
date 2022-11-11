import type { IAnswerKey } from '../answer-key'
import type { IQuestion } from '../question'
import type { IUser } from '../user'

export interface IQuestionSet {
  id: string
  title: string
  isActive: 0 | 1
  createTime: string
  endTime: string
  author?: IUser | string
  answerKeys?: IAnswerKey[] | []
}
export interface AddQuestionSetDto {
  readonly title: string
  readonly createTime: string | number
  readonly endTime: string | number
  readonly author: string
  readonly questions: IQuestion[]
}
