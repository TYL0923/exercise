export function classificationArray<T, K extends keyof T>(
  arr: Array<T>,
  key: K
) {
  const set: Record<string, T[]> = {};
  arr.map((item) => {
    if (["string"].includes(typeof item[key])) {
      if (!set[item[key] as unknown as string]) {
        set[item[key] as unknown as string] = [];
      }
      set[item[key] as unknown as string].push(item);
    }
  });
  return set;
}
