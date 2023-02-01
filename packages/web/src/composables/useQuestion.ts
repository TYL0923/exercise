import type { Question, QuestionType } from '@exercise/type'
import type { Ref } from 'vue'
import { useApi } from './useApi'
const { updateQuestionAnswer } = useApi()
const useQuestion = (questions: Ref<Question[]>, option: { isSync: boolean }) => {
  const handleChangeAnswer = (id: string, answer: string, answerType: 'correct' | 'test' | 'exercise') => {
    questions.value.forEach((question) => {
      if (question.id === id) {
        switch (answerType) {
          case 'correct':
            question.correctAnswer = answer
            option.isSync && updateQuestionAnswer({ id, correctAnswer: answer })
            break
          case 'test':
            question.testAnswer = answer
            option.isSync && updateQuestionAnswer({ id, testAnswer: answer })
            break
          case 'exercise':
            question.exerciseAnswer = answer
            option.isSync && updateQuestionAnswer({ id, exerciseAnswer: answer })
            break
          default:
            break
        }
      }
    })
  }

  const handleChangeTitle = (id: string, title: string) => {
    questions.value.forEach((question) => {
      if (question.id === id && question.title !== title) {
        question.title = title
        option.isSync && updateQuestionAnswer({ id, title })
      }
    })
  }

  const handleChangeIsError = (id: string, isError: 0 | 1) => {
    questions.value.forEach((question) => {
      if (question.id === id && question.isError !== isError) {
        question.isError = isError
        option.isSync && updateQuestionAnswer({ id, isError })
      }
    })
  }
  const judgeisError = (id: string, answerType: 'test' | 'exercise' = 'test', type: 'select' | 'judge'): 1 | 0 => {
    const handle: Record<
      'test' | 'exercise',
      Record<
        QuestionType,
        (question: Question) => boolean
      >
    > = {
      test: {
        select: (question: Question) => {
          return question.correctAnswer.toLocaleUpperCase().trim() === question.testAnswer.toLocaleUpperCase().trim()
        },
        judge: (question: Question) => {
          return question.correctAnswer === question.testAnswer
        },
      },
      exercise: {
        select: (question: Question) => {
          return question.correctAnswer.toLocaleUpperCase().trim() === question.exerciseAnswer.toLocaleUpperCase().trim()
        },
        judge: (question: Question) => {
          return question.correctAnswer === question.exerciseAnswer
        },
      },
    }
    let isError: 1 | 0 = 1
    questions.value.forEach((question) => {
      if (question.id === id)
        isError = handle[answerType][type](question) ? 1 : 0
    })
    return isError
  }
  return {
    handleChangeAnswer,
    handleChangeTitle,
    handleChangeIsError,
    judgeisError,
  }
}

export default useQuestion
