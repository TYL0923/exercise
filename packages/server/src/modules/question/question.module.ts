import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionSet } from '../question-set/entity/question-set.entity';
import { Question } from './entity/question.entity';
import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';

@Module({
  imports: [TypeOrmModule.forFeature([Question, QuestionSet])],
  controllers: [QuestionController],
  providers: [QuestionService],
})
export class QuestionModule {}
