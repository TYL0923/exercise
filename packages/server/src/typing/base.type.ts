import { QuestionSet } from 'src/modules/question-set/entity/question-set.entity';
import { Question } from 'src/modules/question/entity/question.entity';
import { User } from 'src/modules/user/entity/user.entity';

export type BaseReturnQuestionSet = Omit<
  QuestionSet,
  'answerKeys' | 'author'
> & {
  author: string | Omit<User, 'password' | 'questionSets' | 'answerKeys'>;
  questions: Question[];
};
export type QuestionType = 'select' | 'judge';
