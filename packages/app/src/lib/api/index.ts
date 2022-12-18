const baseUrl = 'http://127.0.0.1:8000'
interface Return {
  err?: string
  data: any
}
function get(url: string, params?: Record<string, string>): Promise<Return> {
  return new Promise((resolve, reject) => {
    uni.request({
      url: `${baseUrl}${url}`,
      method: 'GET',
      data: params || {},
      success(res: any) {
        if (res.statusCode === 200 && res.data) {
          resolve({
            data: res.data.data,
          })
        }
        else {
          resolve({
            // todo code generate err
            err: '请求失败',
            data: res.data.data,
          })
        }
      },
      fail(err: any) {
        reject(err)
      },
    })
  })
}

export async function getRecommendQuestionSet(): Promise<Return> {
  const url = '/questionSet/joinable'
  return new Promise((resolve) => {
    setTimeout(() => {
      const res = get(url)
      resolve(res)
    }, 350)
  })
}
