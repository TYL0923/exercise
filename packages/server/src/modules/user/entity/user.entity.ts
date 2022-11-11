import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { MySqlDatabaseColumn } from 'src/typing/databaseColumn.type';
import { QuestionSet } from 'src/modules/question-set/entity/question-set.entity';
import { AnswerKey } from 'src/modules/answer-key/entity/answer-key.entity';
import { IUser } from '@exercise/type';
@Entity('user')
export class User implements IUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: MySqlDatabaseColumn.VARCHAR,
    length: 20,
    unique: true,
  })
  account: string;

  @Column({
    type: MySqlDatabaseColumn.VARCHAR,
    length: 30,
  })
  password: string;

  @OneToMany(() => QuestionSet, (questionSet) => questionSet.author)
  myQuestionSet: QuestionSet[];
  // @ManyToMany(() => QuestionSet, questionSet => questionSet.users)
  // joinQuestionSet: QuestionSet[];
  @OneToMany(() => AnswerKey, (answerKey) => answerKey.user)
  myAnswerKey: AnswerKey[];
}
