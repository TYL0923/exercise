import { IsString } from 'class-validator';

export class RegisterDto {
  @IsString()
  account: string;
  @IsString()
  password: string;
}
