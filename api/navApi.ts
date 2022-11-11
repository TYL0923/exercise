import type { Return } from './request'
import a from './request'
export function getNavList(): Return {
  const url = '/nav/list'
  return new Promise(async (resolve) => {
    const res = await a.get(url)
    resolve([undefined, res.data])
  })
}
