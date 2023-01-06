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
import { QuestionSet } from './entity/question-set.entity';
import { extract, remove, save } from '../../shared/identify';
import { BaseReturnQuestionSet } from 'src/typing/base.type';
import { extractQuestion } from '../../shared/identify/extract';
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

  private async handleFile(file: any): Promise<string> {
    const type = file.originalname.split('.').pop();
    const dirName = 'upload';
    let name = '',
      str = '';
    try {
      name = await save(dirName, file);
      str = await extract(dirName, name, type);
    } finally {
      remove(dirName, name);
      return str.trim();
    }
  }

  identifyQuestionSet(file: any): Promise<Question[] | null> {
    return new Promise(async (resolve) => {
      try {
        const questionStr = await this.handleFile(file);
        const questionArr = extractQuestion(questionStr);
        // extractJudge(questionStr);
        // const questionArr = Question.formatQuestionArray(questionStr);
        return resolve(questionArr);
      } catch (err) {
        throw new Error(err);
      }
    });
  }

  /**
   * 创建题库
   * @param addQuestionSetDto
   * @returns
   */
  addQuestionSet(addQuestionSetDto: AddQuestionSetDto): Promise<boolean> {
    return new Promise(async (resolve) => {
      try {
        const author = await this.userRepository.findOne({
          where: { account: addQuestionSetDto.account },
        });
        const addQuestionSetRes = await this.questionSetRepository.insert({
          title: addQuestionSetDto.title,
          createTime: addQuestionSetDto.createTime.toString(),
          num: addQuestionSetDto.questions.length,
          tags: addQuestionSetDto.tags.toString(),
          author: author,
        });
        const addAnswerKeyRes = await this.answerKeyRepository.insert({
          user: author,
          questionSet: addQuestionSetRes.identifiers[0].id,
        });
        if (
          !!addQuestionSetRes.raw.affectedRows &&
          !!addAnswerKeyRes.raw.affectedRows
        ) {
          const questionList: Omit<Question, 'id'>[] =
            addQuestionSetDto.questions.reduce((pre, cur) => {
              pre.push({
                ...objectWipe(cur, ['id' as any, 'answerKey', 'options']),
                options: (cur.options as string[]).reduce((pre, cur, index) => {
                  if (!index) return `${pre}${cur}`;
                  else return `${pre},${cur}`;
                }, ''),
                answerKey: addAnswerKeyRes.identifiers[0].id,
              });
              return pre;
            }, [] as Omit<Question, 'id'>[]);
          // 插入题目
          const addQuestionListRes = await this.questionRepository.insert(
            questionList,
          );
          if (!!addQuestionListRes.raw.affectedRows) {
            return resolve(true);
          } else {
            return resolve(false);
          }
        }
      } catch (err) {
        throw new Error(err);
      }
    });
  }

  /**
   * 加入题库
   * @param joinQuestionSetDto
   * @returns
   */
  joinQuestionSet(joinQuestionSetDto: JoinQuestionSetDto): Promise<boolean> {
    return new Promise(async (resolve) => {
      try {
        const [questionSet, user] = await Promise.all([
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
        ]);
        // 找不到题库或账号
        if (!(questionSet && user)) return resolve(false);
        const isJoined = questionSet.answerKeys.find(
          (answer) => answer.user.account === user.account,
        );
        // 已加入
        if (isJoined) return resolve(false);
        const newAnswerKey = await this.answerKeyRepository.insert({
          user,
          questionSet,
        });
        // 创建答题卡失败
        if (!newAnswerKey.raw.affectedRows) return resolve(false);
        const questions: Omit<Question, 'id'>[] = questionSet.answerKeys
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
        const addQuestionListRes = await this.questionRepository.insert(
          questions,
        );
        if (!!addQuestionListRes.raw.affectedRows) {
          return resolve(true);
        } else {
          return resolve(false);
        }
      } catch (err) {
        throw new Error(err);
      }
    });
  }
  /**
   * 查询加入题库
   * @param account
   * @returns
   */
  queryJoinedQuestionSetByAccount(
    account: string,
  ): Promise<BaseReturnQuestionSet[]> {
    return new Promise(async (resolve) => {
      try {
        const res = await this.userRepository.findOne({
          where: { account },
          relations: [
            'answerKeys',
            'questionSets.author',
            'answerKeys.questionSet',
            'answerKeys.questions',
            'answerKeys.questionSet.author',
          ],
        });
        if (res) {
          return resolve(
            res.answerKeys.reduce((pre, cur) => {
              // 自己创建的题目集不算在加入题目集中
              if (cur.questionSet.author.account !== account) {
                pre.push({
                  id: cur.questionSet.id,
                  title: cur.questionSet.title,
                  num: cur.questionSet.num,
                  isActive: cur.questionSet.isActive,
                  createTime: cur.questionSet.createTime,
                  tags: cur.questionSet.tags,
                  author: {
                    account: cur.questionSet.author.account,
                    name: cur.questionSet.author.name,
                  },
                  questions: cur.questions,
                });
              }
              return pre;
            }, [] as BaseReturnQuestionSet[]),
          );
        } else {
          return resolve([]);
        }
      } catch (err) {
        throw new Error(err);
      }
    });
  }

  /**
   * 查询创建的题库
   * @param account
   * @returns
   */
  queryCreatedQuestionSetByAccount(
    account: string,
  ): Promise<BaseReturnQuestionSet[]> {
    return new Promise(async (resolve) => {
      try {
        const res = await this.userRepository.findOne({
          where: { account },
          relations: [
            'questionSets',
            'questionSets.author',
            'questionSets.answerKeys',
            'questionSets.answerKeys.user',
            'questionSets.answerKeys.questions',
          ],
        });
        if (res) {
          return resolve(
            res.questionSets.reduce((pre, cur) => {
              if (cur.isActive === 0) return pre;
              pre.push({
                id: cur.id,
                title: cur.title,
                isActive: cur.isActive,
                num: cur.num,
                createTime: cur.createTime,
                tags: cur.tags,
                author: {
                  account: cur.author.account,
                  name: cur.author.name,
                },
                questions: cur.answerKeys.find(
                  (answerKey) => answerKey.user.account === account,
                ).questions,
              });
              return pre;
            }, [] as BaseReturnQuestionSet[]),
          );
        } else {
          return resolve([]);
        }
      } catch (err) {
        throw new Error(err);
      }
    });
  }

  /**
   * 查询可加入的题库
   * @param options
   * @returns
   */
  queryJoinableQuestion(
    options: QueryQuestionSetOptionsDto,
  ): Promise<Omit<BaseReturnQuestionSet, 'questions'>[]> {
    return new Promise(async (resolve) => {
      try {
        const user = await this.userRepository.findOne({
          relations: [
            'answerKeys',
            'answerKeys.questionSet',
            'answerKeys.questions',
          ],
          where: { account: options.account },
        });
        let builder =
          this.questionSetRepository.createQueryBuilder('questionSet');
        builder = builder.innerJoinAndSelect('questionSet.author', 'author');
        options.id &&
          (builder = builder.where('questionSet.id = :id', { id: options.id }));
        options.keyWord &&
          (builder = builder
            .where('questionSet.title Like :title', {
              title: `%${options.keyWord}%`,
            })
            .orWhere('questionSet.tags Like :tags', {
              tags: `%${options.keyWord}%`,
            }));
        options.author &&
          (builder = builder.where('author.account = :account', {
            account: options.author,
          }));
        let res = await builder.getMany();
        // 排除已加入
        options.account &&
          (res = res.filter((questionSet) =>
            user.answerKeys.find(
              (answerKey) => answerKey.questionSet.id === questionSet.id,
            )
              ? false
              : true,
          ));
        if (res) {
          return resolve(
            res.reduce((pre, cur) => {
              pre.push({
                id: cur.id,
                title: cur.title,
                num: cur.num,
                createTime: cur.createTime,
                isActive: cur.isActive,
                tags: cur.tags,
                author: {
                  account: cur.author.account,
                  name: cur.author.name,
                },
              });
              return pre;
            }, [] as Omit<BaseReturnQuestionSet, 'questions'>[]),
          );
        } else {
          return resolve([]);
        }
      } catch (err) {
        throw new Error(err);
      }
    });
  }

  /**
   * 查询题库基本信息
   * @param id
   * @returns
   */
  querryQuestionSetSimpleById(
    id: string,
  ): Promise<Omit<BaseReturnQuestionSet, 'questions'> | null> {
    return new Promise(async (resolve) => {
      try {
        const res = await this.questionSetRepository.findOne({
          where: { id },
          relations: ['author'],
        });
        if (res) {
          return resolve({
            id: res.id,
            title: res.title,
            num: res.num,
            createTime: res.createTime,
            isActive: res.isActive,
            tags: res.tags,
            author: {
              account: res.author.account,
              name: res.author.name,
            },
          });
        } else {
          return resolve(null);
        }
      } catch (err) {
        throw new Error(err);
      }
    });
  }

  /**
   * 查询题库详情
   * @param id
   * @param account
   * @returns
   */
  queryQuestionSetDetailById(
    id: string,
    account: string,
  ): Promise<BaseReturnQuestionSet | null> {
    return new Promise(async (resolve) => {
      try {
        const res = await this.questionSetRepository.findOne({
          where: { id },
          relations: ['answerKeys.questions', 'answerKeys.user', 'author'],
        });
        if (res) {
          return resolve({
            id: res.id,
            title: res.title,
            num: res.num,
            createTime: res.createTime,
            isActive: res.isActive,
            tags: res.tags,
            author: {
              account: res.author.account,
              name: res.author.name,
            },
            questions: res.answerKeys.find(
              (answerKey) => answerKey.user.account === account,
            ).questions,
          });
        } else {
          return resolve(null);
        }
      } catch (err) {
        throw new Error(err);
      }
    });
  }

  /**
   * 清空答案
   * @param id
   * @param account
   * @param mode
   * @returns
   */
  resetQuestion(
    id: string,
    account: string,
    mode: 'test' | 'exercise',
  ): Promise<boolean> {
    return new Promise(async (resolve) => {
      try {
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
                  isDo: 0,
                  isError: 0,
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
      } catch (err) {
        throw new Error(err);
      }
    });
  }

  // updateQuestionSet(
  //   updateQuestionSetDto: UpdateQuestionSetDto,
  // ): Promise<BaseReturnQuestionSet | null> {
  //   return new Promise(async (resolve) => {
  //     const promiseArr: Promise<Question | QuestionSet>[] = [];
  //     promiseArr.push(
  //       this.questionSetRepository.save({
  //         id: updateQuestionSetDto.id,
  //         endTime: updateQuestionSetDto.endTime + '',
  //         title: updateQuestionSetDto.title + '',
  //       }),
  //     );
  //     updateQuestionSetDto.questions.map((question: Question) => {
  //       const newQuestion = this.questionRepository.create(question);
  //       const prmise = this.questionRepository.save(newQuestion);
  //       promiseArr.push(prmise);
  //     });
  //     Promise.all(promiseArr).then((res) => {
  //       this.questionSetRepository
  //         .findOne({
  //           where: { id: updateQuestionSetDto.id },
  //           relations: ['answerKeys.questions', 'answerKeys.user', 'author'],
  //         })
  //         .then((r) => {
  //           resolve({
  //             id: r.id,
  //             title: r.title,
  //             createTime: r.createTime,
  //             author: r.author.account,
  //             isActive: r.isActive,
  //             questions: r.answerKeys.find(
  //               (answeyKey) =>
  //                 answeyKey.user.account === updateQuestionSetDto.account,
  //             ).questions,
  //           });
  //         });
  //     });
  //   });
  // }

  // deleteQuestionSetById(
  //   id: string,
  //   account: string,
  // ): Promise<QuestionSet | null> {
  //   return new Promise(async (resolve) => {
  //     const user = await this.userRepository.findOne({
  //       where: { account },
  //     });
  //     const questionSet = await this.questionSetRepository.findOne({
  //       where: { id },
  //       relations: ['answerKeys', 'answerKeys.questions'],
  //     });
  //     const questions: Question[] = [];
  //     questionSet.answerKeys.map((answerKey) => {
  //       questions.push(...answerKey.questions);
  //     });
  //     const removeQuestionRes = await this.questionRepository.remove(questions);
  //     if (removeQuestionRes) {
  //       const removeAnswerKeyRes = await this.answerKeyRepository.remove(
  //         questionSet.answerKeys,
  //       );
  //       if (removeAnswerKeyRes) {
  //         const res = await this.questionSetRepository.remove(questionSet);
  //         if (res) {
  //           resolve(res);
  //         } else {
  //           resolve(null);
  //         }
  //       } else {
  //         resolve(null);
  //       }
  //     } else {
  //       resolve(null);
  //     }
  //   });
  // }
  // exitQuestionSetById(id: string, account: string): Promise<boolean> {
  //   return new Promise(async (resolve) => {
  //     const user = await this.userRepository.findOne({
  //       where: { account },
  //     });
  //     const questionSet = await this.questionSetRepository.findOne({
  //       where: { id },
  //     });
  //     const answerKey = await this.answerKeyRepository.findOne({
  //       where: { user: user, questionSet },
  //       relations: ['questions'],
  //     });
  //     const removeQuestionRes = await this.questionRepository.remove(
  //       answerKey.questions,
  //     );
  //     if (removeQuestionRes) {
  //       const removeAnswerKeyRes = await this.answerKeyRepository.remove(
  //         answerKey,
  //       );
  //       if (removeAnswerKeyRes) {
  //         resolve(true);
  //       } else {
  //         resolve(null);
  //       }
  //     } else {
  //       resolve(null);
  //     }
  //   });
  // }
}
