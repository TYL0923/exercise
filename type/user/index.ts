import type { IQuestionSet } from '../question-set'
import type { IAnswerKey } from '../answer-key'
export interface IUser {
  id: string
  account: string
  password: string
  myQuestionSet?: IQuestionSet[] | []
  myAnswerKey?: IAnswerKey[] | []
}

