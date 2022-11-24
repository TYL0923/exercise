import type { IQuestionSet } from '../question-set'
import type { IQuestion } from '../question'
export type BaseReturnQuestionSet = Omit<
  IQuestionSet,
  'answerKeys'
> & {
  questions: IQuestion[]
}
