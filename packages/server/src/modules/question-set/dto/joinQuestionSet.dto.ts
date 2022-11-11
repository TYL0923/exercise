import { IsString } from 'class-validator';

export class JoinQuestionSetDto {
  @IsString()
  readonly questionSetId: string;
  @IsString()
  readonly joinAccount: string;
}
