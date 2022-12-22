import { AnswerKey } from 'src/modules/answer-key/entity/answer-key.entity';
import { User } from 'src/modules/user/entity/user.entity';
import { MySqlDatabaseColumn } from 'src/typing/databaseColumn.type';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('question_set')
export class QuestionSet {
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
    type: MySqlDatabaseColumn.INT,
  })
  num: number;

  @Column({
    type: MySqlDatabaseColumn.VARCHAR,
    length: 30,
  })
  createTime: string;

  @Column({
    type: MySqlDatabaseColumn.VARCHAR,
    length: 300,
  })
  tags: string;

  @ManyToOne(() => User, (user) => user.questionSets)
  author: User;
  @OneToMany(() => AnswerKey, (answerKey) => answerKey.questionSet)
  answerKeys: AnswerKey[];
  // @ManyToMany(() => Tag, (tag) => tag.questionSets)
  // @JoinTable()
  // tags: Tag[];
}
