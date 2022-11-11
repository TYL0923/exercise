import type { IQuestion } from '@exercise/type'
import type { Ref } from 'vue'
const useQuestion = (questions: Ref<IQuestion[]>) => {
  const handleChangeAnswer = (id: string, answer: string, answerType: 'correct' | 'test' | 'exercise') => {
    questions.value.forEach((question) => {
      if (question.id === id) {
        switch (answerType) {
          case 'correct':
            question.correctAnswer = answer
            break
          case 'test':
            question.testAnswer = answer
            break
          case 'exercise':
            question.exerciseAnswer = answer
            break
          default:
            break
        }
      }
    })
  }

  const handleChangeTitle = (id: string, title: string) => {
    questions.value.forEach((question) => {
      if (question.id === id && question.title !== title)
        question.title = title
    })
  }

  const handleChangeIsDo = (id: string, isDo: 0 | 1) => {
    questions.value.forEach((question) => {
      if (question.id === id && question.isDo !== isDo)
        question.isDo = isDo
    })
  }

  const handleChangeIsError = (id: string, isError: 0 | 1) => {
    questions.value.forEach((question) => {
      if (question.id === id && question.isError !== isError)
        question.isError = isError
    })
  }

  return {
    handleChangeAnswer,
    handleChangeTitle,
    handleChangeIsDo,
    handleChangeIsError,
  }
}

export default useQuestion
