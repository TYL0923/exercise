import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { Question } from 'src/modules/question/entity/question.entity';

export class AddQuestionSetDto {
  @IsString()
  readonly title: string;
  @IsNotEmpty()
  readonly createTime: string;
  @IsString()
  readonly account: string;
  @IsString()
  readonly tags: string;
  @IsArray()
  readonly questions: Question[];
}
