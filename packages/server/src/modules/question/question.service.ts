import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateQuestionDto } from './dto/updateQuestion.dto';
import { Question } from './entity/question.entity';
@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
  ) {}
  updateQuestion(
    updateQuestionDto: UpdateQuestionDto,
  ): Promise<Question | null> {
    return new Promise(async (resolve) => {
      try {
        const newQuestion = this.questionRepository.create({
          id: updateQuestionDto.id,
          isDo: updateQuestionDto.isDo,
          type: updateQuestionDto.type,
          title: updateQuestionDto.title,
          isError: updateQuestionDto.isError,
          testAnswer: updateQuestionDto.testAnswer,
          correctAnswer: updateQuestionDto.correctAnswer,
          exerciseAnswer: updateQuestionDto.exerciseAnswer,
        });
        const res = await this.questionRepository.save(newQuestion);
        if (res) {
          return resolve(res);
        } else {
          return resolve(null);
        }
      } catch (err) {
        throw new Error(err);
      }
    });
  }
  updateQuestions(questions: Question[]): Promise<boolean> {
    return new Promise(async (resolve) => {
      try {
        const promiseArr = [];
        questions.forEach((question) => {
          const promise = this.updateQuestion(question);
          promiseArr.push(promise);
        });
        const res = await Promise.all(promiseArr);
        if (res) {
          return resolve(true);
        } else {
          return resolve(false);
        }
      } catch (err) {
        throw new Error(err);
      }
    });
  }
  // deleteQuestionById(id: string): Promise<boolean> {
  //   return new Promise(async (resolve, reject) => {
  //     const res = await this.questionRepository.delete(id);
  //     if (res.affected && res.affected > 0) {
  //       resolve(true);
  //     } else {
  //       resolve(false);
  //     }
  //   });
  // }

  // queryQuestionAll(): Promise<Question[] | null> {
  //   return new Promise(async (resolve) => {
  //     resolve(await this.questionRepository.find());
  //   });
  // }

  // queryQuestionById(id: string): Promise<Question | null> {
  //   return new Promise(async (resolve) => {
  //     const res = await this.questionRepository.findOne({
  //       where: { id },
  //     });
  //     resolve(res);
  //   });
  // }

  // queryQuestionByOptions (options: QueryQuestionOptionsDto): Promise<Question[] | null> {
  //   return new Promise( async (resolve) => {
  //     let builder = this.questionRepository.createQueryBuilder();
  //     options.type && (builder = builder.where('question.type = :type', {type: options.type}));
  //     options.score && (builder = builder.where('question.score >= :score', {score: options.score}));
  //     options.authorId && (builder = builder.where('question.authorId = :authorId', {authorId: options.authorId}));
  //     options.title && (builder = builder.where('question.title Like :title', {title: `%${options.title}%`}));
  //     const res = builder
  //       .skip(options.pageNum * options.pageSize)
  //       .take(options.pageSize)
  //       .getMany();
  //     resolve(await res);
  //   });
  // }
}
