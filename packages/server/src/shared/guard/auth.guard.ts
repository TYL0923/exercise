import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { messageMap } from 'src/typing/response.type';
import { validationToken } from 'src/shared/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly urlWhite: string[] = [
    '/user/register',
    '/user/checkAccount',
    '/user/login',
  ];
  private hasUrl(url: string): boolean {
    if (url.includes('?')) {
      url = url.substring(0, url.indexOf('?'));
    }
    let flag = false;
    if (this.urlWhite.indexOf(url) >= 0) {
      flag = true;
    }
    return flag;
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = context.switchToRpc().getData().headers.token;
    if (this.hasUrl(request.url)) {
      return true;
    }
    if (!token) {
      throw new HttpException(
        messageMap[HttpStatus.UNAUTHORIZED],
        HttpStatus.UNAUTHORIZED,
      );
    }
    if (validationToken(token)) {
      return true;
    } else {
      throw new HttpException(
        messageMap[HttpStatus.UNAUTHORIZED],
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
