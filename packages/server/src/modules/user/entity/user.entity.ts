import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { MySqlDatabaseColumn } from 'src/typing/databaseColumn.type';
import { QuestionSet } from 'src/modules/question-set/entity/question-set.entity';
import { AnswerKey } from 'src/modules/answer-key/entity/answer-key.entity';
@Entity('user')
/**
 * account 账号
 * password 密码
 * name 名称
 * questionsets 创建的题库
 * answerKeys 加入的题库答题卡
 */
export class User {
  @PrimaryColumn()
  account: string;

  @Column({
    type: MySqlDatabaseColumn.VARCHAR,
    length: 30,
  })
  password: string;

  @Column({
    type: MySqlDatabaseColumn.VARCHAR,
    length: 10,
  })
  name: string;

  @OneToMany(() => QuestionSet, (questionSet) => questionSet.author)
  questionSets: QuestionSet[];
  @OneToMany(() => AnswerKey, (answerKey) => answerKey.user)
  answerKeys: AnswerKey[];
}
