import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { objectWipe } from 'src/shared/utils/tools';
import { Repository } from 'typeorm';
import { AnswerKey } from '../answer-key/entity/answer-key.entity';
import { Question } from '../question/entity/question.entity';
import { User } from '../user/entity/user.entity';
import { AddQuestionSetDto } from './dto/addQuestionSet.dto';
import { JoinQuestionSetDto } from './dto/joinQuestionSet.dto';
import { QueryQuestionSetOptionsDto } from './dto/queryQuestionSet.dto';
import { UpdateQuestionSetDto } from './dto/updateQuestionSet.sto';
import { QuestionSet } from './entity/question-set.entity';
import type { BaseReturnQuestionSet } from '@exercise/type';

@Injectable()
export class QuestionSetService {
  constructor(
    @InjectRepository(QuestionSet)
    private readonly questionSetRepository: Repository<QuestionSet>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    @InjectRepository(AnswerKey)
    private readonly answerKeyRepository: Repository<AnswerKey>,
  ) {}

  private handleFile(file: any) {
    const handle = {
      txt: (buffer: Buffer) => {
        const str = buffer.toString();
        return str;
      },
      docx: (buffer: Buffer) => {
        // TODO
      },
    };
    const fileTypeName = file.originalname.split('.').pop();
    return handle[fileTypeName](file.buffer);
  }

  identifyQuestionSet(file: any): Promise<Question[] | null> {
    return new Promise((resolve) => {
      const questionStr = this.handleFile(file);
      const questionArr = Question.formatQuestionArray(questionStr);
      resolve(questionArr);
    });
  }

  addQuestionSet(addQuestionSetDto: AddQuestionSetDto): Promise<boolean> {
    return new Promise((resolve) => {
      // 查找作者
      this.userRepository
        .findOne({
          where: { account: addQuestionSetDto.author },
        })
        .then((author) => {
          // 插入题库
          this.questionSetRepository
            .insert({
              title: addQuestionSetDto.title,
              createTime: addQuestionSetDto.createTime.toString(),
              endTime: addQuestionSetDto.endTime.toString(),
              author: author,
            })
            .then((addQuestionSetRes) => {
              if (!!addQuestionSetRes.raw.affectedRows) {
                // 插入答题卡
                this.answerKeyRepository
                  .insert({
                    user: author,
                    questionSet: addQuestionSetRes.identifiers[0].id,
                  })
                  .then((addAnswerKeyRes) => {
                    if (!!addAnswerKeyRes.raw.affectedRows) {
                      const questionList: Omit<Question, 'id'>[] =
                        addQuestionSetDto.questions.reduce((pre, cur) => {
                          pre.push({
                            ...objectWipe(cur, ['id' as any, 'answerKey']),
                            answerKey: addAnswerKeyRes.identifiers[0].id,
                          });
                          return pre;
                        }, [] as Omit<Question, 'id'>[]);
                      // 插入题目
                      this.questionRepository
                        .insert(questionList)
                        .then((addQuestionListRes) => {
                          if (!!addQuestionListRes.raw.affectedRows) {
                            resolve(true);
                          } else {
                            resolve(false);
                          }
                        });
                    } else {
                      resolve(false);
                    }
                  });
              } else {
                resolve(false);
              }
            });
        })
        .catch((err) => {
          resolve(false);
        });
    });
  }

  resetQuestion(
    id: string,
    account: string,
    mode: 'test' | 'exercise',
  ): Promise<boolean> {
    return new Promise(async (resolve) => {
      const { answerKeys } = await this.questionSetRepository.findOne({
        where: { id },
        relations: ['answerKeys.questions', 'answerKeys.user'],
      });
      const questions =
        answerKeys.find((answer) => answer.user.account === account)
          ?.questions || [];
      const promiseArr: Promise<any>[] = [];
      questions.map((question) => {
        const promise =
          mode === 'exercise'
            ? this.questionRepository.save({
                id: question.id,
                exerciseAnswer: '',
              })
            : this.questionRepository.save({
                id: question.id,
                testAnswer: '',
              });
        promiseArr.push(promise);
      });
      Promise.all(promiseArr)
        .then(() => resolve(true))
        .catch(() => resolve(false));
    });
  }

  updateQuestionSet(
    updateQuestionSetDto: UpdateQuestionSetDto,
  ): Promise<BaseReturnQuestionSet | null> {
    return new Promise(async (resolve) => {
      const promiseArr: Promise<Question | QuestionSet>[] = [];
      promiseArr.push(
        this.questionSetRepository.save({
          id: updateQuestionSetDto.id,
          endTime: updateQuestionSetDto.endTime + '',
          title: updateQuestionSetDto.title + '',
        }),
      );
      updateQuestionSetDto.questions.map((question: Question) => {
        const newQuestion = this.questionRepository.create(question);
        const prmise = this.questionRepository.save(newQuestion);
        promiseArr.push(prmise);
      });
      Promise.all(promiseArr).then((res) => {
        this.questionSetRepository
          .findOne({
            where: { id: updateQuestionSetDto.id },
            relations: ['answerKeys.questions', 'answerKeys.user', 'author'],
          })
          .then((r) => {
            resolve({
              id: r.id,
              title: r.title,
              createTime: r.createTime,
              endTime: r.endTime,
              author: r.author.account,
              isActive: r.isActive,
              questions: r.answerKeys.find(
                (answeyKey) =>
                  answeyKey.user.account === updateQuestionSetDto.account,
              ).questions,
            });
          });
      });
    });
  }
  deleteQuestionSetById(
    id: string,
    account: string,
  ): Promise<QuestionSet | null> {
    return new Promise(async (resolve, reject) => {
      const user = await this.userRepository.findOne({
        where: { account },
      });
      const questionSet = await this.questionSetRepository.findOne({
        where: { id },
        relations: ['answerKeys', 'answerKeys.questions'],
      });
      const questions: Question[] = [];
      questionSet.answerKeys.map((answerKey) => {
        questions.push(...answerKey.questions);
      });
      const removeQuestionRes = await this.questionRepository.remove(questions);
      if (removeQuestionRes) {
        const removeAnswerKeyRes = await this.answerKeyRepository.remove(
          questionSet.answerKeys,
        );
        if (removeAnswerKeyRes) {
          const res = await this.questionSetRepository.remove(questionSet);
          if (res) {
            resolve(res);
          } else {
            resolve(null);
          }
        } else {
          resolve(null);
        }
      } else {
        resolve(null);
      }
    });
  }
  exitQuestionSetById(id: string, account: string): Promise<boolean> {
    return new Promise(async (resolve) => {
      const user = await this.userRepository.findOne({
        where: { account },
      });
      const questionSet = await this.questionSetRepository.findOne({
        where: { id },
      });
      const answerKey = await this.answerKeyRepository.findOne({
        where: { user: user, questionSet },
        relations: ['questions'],
      });
      const removeQuestionRes = await this.questionRepository.remove(
        answerKey.questions,
      );
      if (removeQuestionRes) {
        const removeAnswerKeyRes = await this.answerKeyRepository.remove(
          answerKey,
        );
        if (removeAnswerKeyRes) {
          resolve(true);
        } else {
          resolve(null);
        }
      } else {
        resolve(null);
      }
    });
  }
  queryJoinableQuestion(
    options: QueryQuestionSetOptionsDto,
  ): Promise<Omit<BaseReturnQuestionSet, 'questions'>[] | null> {
    return new Promise(async (resolve) => {
      const user = await this.userRepository.findOne({
        relations: [
          'myAnswerKey',
          'myAnswerKey.questionSet',
          'myAnswerKey.questions',
        ],
        where: { account: options.account },
      });
      let builder =
        this.questionSetRepository.createQueryBuilder('questionSet');
      builder = builder.innerJoinAndSelect('questionSet.author', 'author');
      options.id &&
        (builder = builder.where('questionSet.id = :id', { id: options.id }));
      options.keyWord &&
        (builder = builder.where('questionSet.title Like :title', {
          title: `%${options.keyWord}%`,
        }));
      options.author &&
        (builder = builder.where('author.account = :account', {
          account: options.author,
        }));
      let res = await builder.getMany();
      // 排除已加入
      res = res.filter((questionSet) =>
        user.myAnswerKey.find(
          (answerKey) => answerKey.questionSet.id === questionSet.id,
        )
          ? false
          : true,
      );
      if (res) {
        resolve(
          res.reduce((pre, cur) => {
            pre.push({
              id: cur.id,
              title: cur.title,
              createTime: cur.createTime,
              endTime: cur.endTime,
              isActive: cur.isActive,
              author: cur.author.account,
            });
            return pre;
          }, [] as (Omit<BaseReturnQuestionSet, 'questions'> & { author: string })[]),
        );
      } else {
        resolve(null);
      }
    });
  }

  querryQuestionSetSimpleById(
    id: string,
  ): Promise<Omit<BaseReturnQuestionSet, 'questions'> | null> {
    return new Promise(async (resolve) => {
      const res = await this.questionSetRepository.findOne({
        where: { id },
        relations: ['author'],
      });
      if (res) {
        resolve({
          id: res.id,
          title: res.title,
          createTime: res.createTime,
          endTime: res.endTime,
          isActive: res.isActive,
          author: res.author.account,
        });
      } else {
        resolve(null);
      }
    });
  }

  queryQuestionSetDetailById(
    id: string,
    account: string,
  ): Promise<BaseReturnQuestionSet | null> {
    return new Promise(async (resolve) => {
      const res = await this.questionSetRepository.findOne({
        where: { id },
        relations: ['answerKeys.questions', 'answerKeys.user', 'author'],
      });
      if (res) {
        resolve({
          id: res.id,
          title: res.title,
          createTime: res.createTime,
          endTime: res.endTime,
          isActive: res.isActive,
          author: res.author.account,
          questions: res.answerKeys.find(
            (answerKey) => answerKey.user.account === account,
          ).questions,
        });
      } else {
        resolve(null);
      }
    });
  }
  joinQuestionSet(joinQuestionSetDto: JoinQuestionSetDto): Promise<boolean> {
    return new Promise(async (resolve) => {
      Promise.all([
        this.questionSetRepository.findOne({
          where: { id: joinQuestionSetDto.questionSetId },
          relations: [
            'answerKeys',
            'answerKeys.questions',
            'answerKeys.user',
            'author',
          ],
        }),
        this.userRepository.findOne({
          where: { account: joinQuestionSetDto.joinAccount },
        }),
      ])
        .then(([questionSet, user]) => {
          const isJoin = questionSet.answerKeys.find(
            (answer) => answer.user.id === user.id,
          );
          if (isJoin) resolve(false);
          if (questionSet && user) {
            this.answerKeyRepository
              .insert({
                user,
                questionSet,
              })
              .then((newAnswerKey) => {
                if (!!newAnswerKey.raw.affectedRows) {
                  const questions: Omit<Question, 'id'>[] =
                    questionSet.answerKeys
                      .find(
                        (answerKey) =>
                          answerKey.user.account === questionSet.author.account,
                      )
                      .questions.reduce((pre, cur) => {
                        pre.push({
                          ...objectWipe(cur, ['id' as any, 'answerKey']),
                          answerKey: newAnswerKey.identifiers[0].id,
                        });
                        return pre;
                      }, [] as Omit<Question, 'id'>[]);
                  this.questionRepository
                    .insert(questions)
                    .then((addQuestionListRes) => {
                      if (!!addQuestionListRes.raw.affectedRows) {
                        resolve(true);
                      } else {
                        resolve(false);
                      }
                    });
                } else {
                  resolve(false);
                }
              });
          } else {
            resolve(false);
          }
        })
        .catch((err) => {
          resolve(false);
        });
    });
  }
}
