import { Module } from '@nestjs/common';
import { AnswerKeyService } from './answer-key.service';
import { AnswerKeyController } from './answer-key.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnswerKey } from './entity/answer-key.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AnswerKey])],
  providers: [AnswerKeyService],
  controllers: [AnswerKeyController],
})
export class AnswerKeyModule {}
