import { IQuestion } from "../question"
import { IQuestionSet } from "../question-set"
import { IUser } from "../user"

export interface IAnswerKey {
  id: string
  questionSet: IQuestionSet
  user: IUser
  questions?: IQuestion[] | []
}