import { IsIn, IsOptional, IsString } from 'class-validator';

export class UpdateQuestionDto {
  @IsString()
  readonly id: string;
  @IsIn([0, 1])
  @IsOptional()
  readonly isDo: 0 | 1;
  @IsIn([0, 1])
  @IsOptional()
  readonly isError: 0 | 1;
  @IsString()
  @IsOptional()
  readonly testAnswer: string;
  @IsString()
  @IsOptional()
  readonly exerciseAnswer: string;
}
