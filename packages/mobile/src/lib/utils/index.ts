export function useDebounceFn(fn: any, delay = 300) {
  let timer: any = null
  return function (...ages: any) {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
    timer = setTimeout(() => {
      fn.apply(this, ages)
    }, delay)
  }
}
