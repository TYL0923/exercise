import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { Question } from 'src/modules/question/entity/question.entity';

export class UpdateQuestionSetDto {
  @IsString()
  readonly id: string;
  @IsString()
  readonly account: string;
  @IsString()
  readonly title: string;
  @IsNotEmpty()
  readonly endTime: number | string;
  @IsArray()
  readonly questions: Question[];
}
