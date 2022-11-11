import axios, { AxiosRequestConfig, AxiosResponse, AxiosInstance } from "axios";
const a: AxiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000",
  timeout: 10000,
});

export interface IResponse {
  code: string;
  message: string;
  data: any;
}

export type Return<T = any> = Promise<[string | null | undefined, T]>;
const requestCodeMap = {
  "400": "请求参数错误",
  "404": "请求的资源不存在",
  "500": "服务器错误",
};
const initInterceptors = () => {
  a.interceptors.request.use((config: AxiosRequestConfig) => {
    const token = localStorage.getItem("TOKEN");
    if (token) {
      config.headers!.token = token;
    }
    return config;
  });
  a.interceptors.response.use(
    (response: AxiosResponse): IResponse => {
      return response.data;
    }
  );
};
initInterceptors();
export default a