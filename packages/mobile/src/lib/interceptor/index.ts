import { showNotify } from 'vant'
import { useLoginState } from '../../composables'

const interceptorMap = ['navigateTo', 'redirectTo', 'switchTab', 'navigateBack']
/**
 * 路由白名单
 */
const whiteArr = ['/pages/login', '/pages/index', '/pages/my']
export function useInterceptor() {
  interceptorMap.map((route) => {
    const loginState = useLoginState()
    const originFn: any = uni[route as keyof Uni]
    return uni[route as keyof Uni] = function (opt = {}, isAuth: any = false) {
      if (isAuth && loginState.account.length === 0) {
        uni.navigateTo({
          url: '/pages/login',
        })
      }
      else {
        if (whiteArr.includes(opt.url)) {
          return originFn.call(this, opt)
        }
        else {
          showNotify({
            type: 'primary',
            message: '请先登录',
            duration: 500,
          })
          return this.navigateTo({
            url: '/pages/login',
          })
        }
      }
    }
  })
}
