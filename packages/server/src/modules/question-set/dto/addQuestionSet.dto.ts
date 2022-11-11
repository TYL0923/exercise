import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { Question } from 'src/modules/question/entity/question.entity';

export class AddQuestionSetDto {
  @IsString()
  readonly title: string;
  @IsNotEmpty()
  readonly createTime: number | string;
  @IsNotEmpty()
  readonly endTime: number | string;
  @IsString()
  readonly author: string;
  @IsArray()
  readonly questions: Question[];
}
