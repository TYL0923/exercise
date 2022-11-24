import type { IQuestion } from '@exercise/type'
import type { Ref } from 'vue'
import { updateQuestionAnswer } from '@exercise/api'
const useQuestion = (questions: Ref<IQuestion[]>, option: { isSync: boolean }) => {
  const handleChangeIsDo = (id: string, isDo: 0 | 1) => {
    questions.value.forEach((question) => {
      if (question.id === id && question.isDo !== isDo) {
        question.isDo = isDo
        option.isSync && updateQuestionAnswer({ id, isDo })
      }
    })
  }
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
            handleChangeIsDo(id, 1)
            option.isSync && updateQuestionAnswer({ id, testAnswer: answer })
            break
          case 'exercise':
            question.exerciseAnswer = answer
            handleChangeIsDo(id, 1)
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
        'select' | 'judge',
        (question: IQuestion) => boolean
      >
    > = {
      test: {
        select: (question: IQuestion) => {
          return question.correctAnswer.toLocaleUpperCase().trim() === question.testAnswer.toLocaleUpperCase().trim()
        },
        judge: (question: IQuestion) => {
          return question.correctAnswer === question.testAnswer
        },
      },
      exercise: {
        select: (question: IQuestion) => {
          return question.correctAnswer.toLocaleUpperCase().trim() === question.exerciseAnswer.toLocaleUpperCase().trim()
        },
        judge: (question: IQuestion) => {
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
    handleChangeIsDo,
    handleChangeIsError,
    judgeisError,
  }
}

export default useQuestion
