import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { generateToken } from 'src/shared/jwt';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { User } from './entity/user.entity';
import type { BaseReturnQuestionSet } from '@exercise/type';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  checkAccount(account: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.userRepository
        .findOneByOrFail({
          account,
        })
        .then(() => {
          resolve(true);
        })
        .catch(() => {
          resolve(false);
        });
    });
  }

  login(loginDto: LoginDto): Promise<any> {
    const { account, password } = loginDto;
    return new Promise(async (resolve) => {
      const res = await this.userRepository.findOne({
        where: {
          account,
          password,
        },
      });
      if (!res) {
        resolve(res);
      }
      resolve({
        account: res.account,
        token: generateToken({
          account: res.account,
        }),
      });
    });
  }

  register(registerDto: RegisterDto): Promise<boolean> {
    return new Promise((resolve) => {
      this.userRepository
        .insert(registerDto)
        .then((res) => {
          if (res.raw.affectedRows > 0) {
            return resolve(true);
          } else {
            return resolve(false);
          }
        })
        .catch(() => {
          return resolve(false);
        });
    });
  }
  queryQuestionSetByAccount(
    account: string,
  ): Promise<BaseReturnQuestionSet[] | null> {
    return new Promise(async (resolve) => {
      const res = await this.userRepository.findOne({
        where: { account },
        relations: [
          'myQuestionSet',
          'myQuestionSet.answerKeys',
          'myQuestionSet.answerKeys.user',
          'myQuestionSet.answerKeys.questions',
        ],
      });
      if (res) {
        resolve(
          res.myQuestionSet.reduce((pre, cur) => {
            if (cur.isActive === 0) return pre;
            pre.push({
              id: cur.id,
              title: cur.title,
              isActive: 1,
              createTime: cur.createTime,
              author: account,
              endTime: cur.endTime,
              questions: cur.answerKeys.find(
                (answerKey) => answerKey.user.account === account,
              ).questions,
            });
            return pre;
          }, [] as BaseReturnQuestionSet[]),
        );
      } else {
        resolve(null);
      }
    });
  }
  queryJoinQuestionSetByAccount(
    account: string,
  ): Promise<BaseReturnQuestionSet[] | null> {
    return new Promise(async (resolve) => {
      this.userRepository
        .findOne({
          where: { account },
          relations: [
            'myAnswerKey',
            'myAnswerKey.questionSet',
            'myAnswerKey.questions',
            'myAnswerKey.questionSet.author',
          ],
        })
        .then((res) => {
          // console.log(res.myAnswerKey);
          resolve(
            res.myAnswerKey.reduce((pre, cur) => {
              // 自己创建的题目集不算在加入题目集中
              if (cur.questionSet.author.account !== account) {
                pre.push({
                  id: cur.questionSet.id,
                  title: cur.questionSet.title,
                  isActive: cur.questionSet.isActive,
                  author: cur.questionSet.author.account,
                  createTime: cur.questionSet.createTime,
                  endTime: cur.questionSet.endTime,
                  questions: cur.questions,
                });
              }
              return pre;
            }, [] as BaseReturnQuestionSet[]),
          );
        });
    });
  }
}
