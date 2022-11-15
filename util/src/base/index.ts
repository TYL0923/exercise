// function pick<T extends object, K extends keyof T>(o: T, k: K): Pick<T, K>;
// function pick<T extends object, K extends keyof T>(o: T, k: Array<K>): Partial<T>;
// function pick<T extends object, K extends keyof T>(o: Array<T>, k: K): Array<Pick<T, K>>;
// function pick<T extends object, K extends keyof T>(o: Array<T>, k: Array<K>): Array<Partial<T>>;

export function pick<T extends object, K extends keyof T>(target: T | Array<T>, k: K | Array<K>): Partial<T> | Array<Partial<T>> {
  const resArr: Array<Partial<T>> = []
  let isArray = true
  if (!Array.isArray(target)) {
    target = [target]
    isArray = false
  }
  if (!Array.isArray(k))
    k = [k]

  target.forEach((item) => {
    const res: Partial<T> = {}
    const keys = Object.keys(item)
    for (const key of keys) {
      if ((k as Array<K>).includes(key as K))
        res[key] = item[key]
    }
    resArr.push(res)
  })
  if (isArray)
    return resArr

  return resArr[0]
}

export function integration<T extends object, K extends keyof T>(list: Array<T>, key: K): Record<string, Array<T>> {
  const set: Record<string, Array<T>> = {}
  list.forEach((item) => {
    const value = item[key]
    if (!Object.prototype.hasOwnProperty.call(set, value as unknown as string))
      set[value as unknown as string] = []
    set[value as unknown as string].push(item)
  })
  return set
}
