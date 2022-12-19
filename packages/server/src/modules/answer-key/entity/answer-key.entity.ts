import { QuestionSet } from 'src/modules/question-set/entity/question-set.entity';
import { Question } from 'src/modules/question/entity/question.entity';
import { User } from 'src/modules/user/entity/user.entity';
import { Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
@Entity('answer_key')
export class AnswerKey {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => Question, (question) => question.answerKey)
  questions: Question[];
  @ManyToOne(() => QuestionSet, (questionSet) => questionSet.answerKeys)
  questionSet: QuestionSet;

  @ManyToOne(() => User, (user) => user.answerKeys)
  user: User;
}
