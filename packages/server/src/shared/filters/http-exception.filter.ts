import {
  ArgumentsHost,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    console.log('出现错误');
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    /**
     * 设置异常编码
     * 判断是Http异常还是系统异常
     */
    const errCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const message = exception.message || '';
    console.log(exception.stack);
    const errLog = {
      code: errCode,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: '请求失败',
      data: message,
    };
    Logger.error('错误信息', JSON.stringify(errLog), 'HttpExceptionFilter');
    response.status(errCode).json({
      code: errCode,
      message: message,
      data: null,
    });
  }
}
