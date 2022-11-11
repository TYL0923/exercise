export enum ResCode {
  GET_SUCCESS = 200,
  CREATE_SUCCESS = 201,
  SERVER_ERROR = 500,
  NOT_FINGT = 404,
  PARAMS_ERROR = 400,
  UNAUTHORIZED = 401,
}
export const messageMap = {
  200: '请求成功',
  201: '创建成功',
  500: '服务器错误',
  404: '没有找到资源',
  400: '参数错误',
  401: '权限错误,无效token',
};
export class Res {
  code: string;
  message: string;
  data: any;
  constructor(code?: number | string) {
    if (!code) {
      code = 200;
    }
    const __code = '' + code;

    this.code = __code;
    this.message = messageMap[__code];
  }
  setCode(code: number | string) {
    if (!code) {
      code = 200;
    }
    const __code = '' + code;
    this.code = __code;
    this.message = messageMap[__code];
    return this;
  }
  setMessage(message: string) {
    if (!message) {
      message = '';
    }
    this.message = message;
    return this;
  }
  setData<T>(data: T) {
    this.data = data;
    return this;
  }
}
