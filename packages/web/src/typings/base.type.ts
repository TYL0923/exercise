
export type BaseReturnQuestionSet = Omit<
  QuestionSet,
  'answerKeys' | 'author'
> & {
  author: string | Omit<User, 'password' | 'questionSets' | 'answerKeys'>
  questions: Question[]
}
