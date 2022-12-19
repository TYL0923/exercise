import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UserService } from './user.service';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Post('register')
  // async register(@Body() registerDto: RegisterDto) {
  //   return await this.userService.register(registerDto);
  // }

  @Get('checkAccount')
  async checkAccount(@Query('account') account: string) {
    return await this.userService.checkAccount(account);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.userService.login(loginDto);
  }
}
