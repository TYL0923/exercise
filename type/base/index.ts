import type { IQuestionSet } from '../question-set'
import type { IQuestion } from '../question'
export type BaseReturnQuestionSet = Omit<
  IQuestionSet,
  'users' | 'answerKeys'
> & {
  questions: IQuestion[]
}
