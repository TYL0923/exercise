import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnswerKey } from '../answer-key/entity/answer-key.entity';
import { Question } from '../question/entity/question.entity';
import { User } from '../user/entity/user.entity';
import { QuestionSet } from './entity/question-set.entity';
import { QuestionSetController } from './question-set.controller';
import { QuestionSetService } from './question-set.service';

@Module({
  imports: [TypeOrmModule.forFeature([QuestionSet, User, Question, AnswerKey])],
  controllers: [QuestionSetController],
  providers: [QuestionSetService],
})
export class QuestionSetModule {}
