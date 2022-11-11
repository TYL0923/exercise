import {
  Injectable,
  NestInterceptor,
  CallHandler,
  ExecutionContext,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Res } from 'src/typing/response.type';
interface Response<T> {
  data: T;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map(res => {
        if(res instanceof Res) {
          return {
            code: res.code,
            message: res.message,
            data: res.data
          }
        }
        else {
          return {
            code: 200,
            message: '请求成功',
            data: res,
          };
        }
      }),
    );
  }
}