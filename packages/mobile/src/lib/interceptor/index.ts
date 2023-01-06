import { showNotify } from 'vant'
import { useLoginState } from '../../composables'

const interceptorMap = ['navigateTo', 'redirectTo', 'switchTab', 'navigateBack']
/**
 * 路由白名单
 */
const whiteArr = ['/pages/login', '/pages/index', '/pages/question-set', '/pages/my']
export function useInterceptor() {
  interceptorMap.map((route) => {
    const loginState = useLoginState()
    const originFn: any = uni[route as keyof Uni]
    return uni[route as keyof Uni] = function (opt = {}) {
      if (whiteArr.includes(opt.url)) {
        return originFn.call(this, opt)
      }
      else {
        if (!loginState.isLogin) {
          showNotify({
            type: 'primary',
            message: '请先登录',
            duration: 500,
          })
          return this.navigateTo({
            url: '/pages/login',
          })
        }
        else { return originFn.call(this, opt) }
      }
    }
  })
}
