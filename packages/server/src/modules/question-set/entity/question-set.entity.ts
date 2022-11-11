import { AnswerKey } from 'src/modules/answer-key/entity/answer-key.entity';
import { User } from 'src/modules/user/entity/user.entity';
import { MySqlDatabaseColumn } from 'src/typing/databaseColumn.type';
import { IQuestionSet } from '@exercise/type';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('question_set')
export class QuestionSet implements IQuestionSet {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({
    type: MySqlDatabaseColumn.VARCHAR,
    length: 30,
  })
  title: string;
  @Column({
    type: MySqlDatabaseColumn.TINYINT,
    default: 1,
  })
  isActive: 0 | 1;

  @Column({
    type: MySqlDatabaseColumn.VARCHAR,
    length: 30,
  })
  createTime: string;
  @Column({
    type: MySqlDatabaseColumn.VARCHAR,
    length: 30,
  })
  endTime: string;
  @ManyToOne(() => User, (user) => user.myQuestionSet)
  author: User;
  @OneToMany(() => AnswerKey, (answerKey) => answerKey.questionSet)
  answerKeys: AnswerKey[];
  // @ManyToMany(() => User, (user) => user.joinQuestionSet)
  // @JoinTable()
  // users: User[];
}
