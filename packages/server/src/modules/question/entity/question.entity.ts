import { AnswerKey } from 'src/modules/answer-key/entity/answer-key.entity';
import { MySqlDatabaseColumn } from 'src/typing/databaseColumn.type';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import type { QuestionType } from '../../../typing/base.type';
@Entity('question')
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: MySqlDatabaseColumn.VARCHAR,
    length: 10,
  })
  type: QuestionType;

  @Column({
    type: MySqlDatabaseColumn.VARCHAR,
    length: 300,
  })
  title: string;

  @Column({
    type: MySqlDatabaseColumn.VARCHAR,
    length: 400,
  })
  completeTitle: string;

  @Column({
    type: MySqlDatabaseColumn.VARCHAR,
    length: 400,
  })
  options?: string[] | string;

  @Column({
    type: MySqlDatabaseColumn.TINYINT,
    default: 0,
  })
  isDo: 0 | 1;
  @Column({
    type: MySqlDatabaseColumn.TINYINT,
    default: 0,
  })
  isError: 0 | 1;
  @Column({
    type: MySqlDatabaseColumn.VARCHAR,
    default: '',
    length: 300,
  })
  testAnswer: string;
  @Column({
    type: MySqlDatabaseColumn.VARCHAR,
    default: '',
    length: 300,
  })
  exerciseAnswer: string;

  @Column({
    type: MySqlDatabaseColumn.VARCHAR,
    default: '',
    length: 300,
  })
  correctAnswer: string;

  @ManyToOne(() => AnswerKey, (answerKey) => answerKey.questions)
  answerKey?: AnswerKey;

  // private static judgeQuestionType(questionStr: string): QuestionType {
  //   const SELECT = /[A|B|C|D]+[、|.]+/g;
  //   if (questionStr.match(SELECT)?.length > 0) {
  //     return 'select';
  //   } else {
  //     return 'judge';
  //   }
  // }

  // static formatQuestionArray(questionStr: string): Question[] {
  //   const questionArr = questionStr.split(/[0-9]+[、|.]/);
  //   return questionArr.reduce((pre, item, index) => {
  //     if (item.trim().length === 0) {
  //       return pre;
  //     }
  //     const questionType = this.judgeQuestionType(item);
  //     const question = new Question({
  //       id: 'identify-' + index,
  //       title: item,
  //       isDo: 0,
  //       isError: 0,
  //       testAnswer: '',
  //       exerciseAnswer: '',
  //       correctAnswer: '',
  //       type: questionType,
  //     });
  //     pre.push(question);
  //     return pre;
  //   }, [] as Question[]);
  // }
  // constructor(question: Omit<Question, 'answerKey'>) {
  //   if (question) {
  //     this.id = question.id || '';
  //     this.title = question.title || '';
  //     this.isDo = question.isDo || 0;
  //     this.isError = question.isError || 0;
  //     this.testAnswer = question.testAnswer || '';
  //     this.exerciseAnswer = question.exerciseAnswer || '';
  //     this.correctAnswer = question.correctAnswer || '';
  //     this.type = question.type || 'judge';
  //   }
  // }
}
