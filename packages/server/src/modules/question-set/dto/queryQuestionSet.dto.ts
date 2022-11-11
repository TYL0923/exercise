import { IsOptional, IsString } from 'class-validator';

export class QueryQuestionSetOptionsDto {
  @IsString()
  @IsOptional()
  readonly id: string;
  @IsString()
  @IsOptional()
  readonly keyWord: string;
  @IsString()
  @IsOptional()
  readonly account: string;
}
