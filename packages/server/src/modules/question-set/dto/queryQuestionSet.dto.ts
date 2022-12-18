import { IsOptional } from 'class-validator';

export class QueryQuestionSetOptionsDto {
  @IsOptional()
  readonly id: string;
  @IsOptional()
  readonly keyWord: string;
  @IsOptional()
  readonly author: string;
  @IsOptional()
  readonly account: string;
}
