export function objectWipe<
  T extends object,
  K extends keyof T,
  U extends Array<K>,
>(obj: T, propName: U): { [P in K]: T[P] } {
  const ret = {} as { [P in K]: T[P] };
  const keys = Object.keys(obj);
  for (const key of keys) {
    if (!propName.includes(key as K)) {
      ret[key] = obj[key];
    }
  }
  return ret;
}

export function objectPick<
  T extends object,
  K extends keyof T,
  U extends Array<K>,
>(obj: T, propName: U): { [P in K]: T[P] } {
  const ret: { [P in K]: T[P] } = {} as { [P in K]: T[P] };
  const keys = Object.keys(obj);
  for (const key of keys) {
    if (propName.includes(key as K)) {
      ret[key] = obj[key];
    }
  }
  return ret;
}

export function mergeArrayByProp<T extends object, K extends keyof T>(
  firstArr: Array<T>,
  secondArr: Array<T>,
  propName: K,
): Array<T> {
  const map = new Map();
  const newArr = [...firstArr, ...secondArr].filter(
    (item) => !map.has(item[propName]) && map.set(item[propName], 1),
  );
  return newArr;
}

export function isNotEmptyArray(
  target: Array<any> | null | undefined,
): boolean {
  if (target === null) return false;
  if (target === undefined) return false;
  if (target.length === 0) return false;
  return true;
}

// export function parseWord(fileName: string): Promise<string> {
//   return new Promise((resolve, reject) => {
//     const filePath = `./upload/${fileName}.docx`;
//     const zip = new AdmZip(filePath); //filePath为文件路径
//     const contentXml = zip.readAsText('word/document.xml'); //将document.xml读取为text内容；
//     let str = '';
//     contentXml.match(/<w:t>[\s\S]*?<\/w:t>/gi).forEach((item: string) => {
//       str += item;
//     });
//     str = str.replace(/<w:t>/g, '');
//     str = str.replace(/<\/w:t>/g, '');
//     console.log(str);
//     resolve(str);
//   });
// }

export function classificationArray<T, K extends keyof T>(
  arr: Array<T>,
  key: K,
) {
  const set: Record<string, T[]> = {};
  arr.map((item) => {
    if (['string', 'number'].includes(typeof item[key])) {
      if (!set[item[key] as unknown as string]) {
        set[item[key] as unknown as string] = [];
      }
      set[item[key] as unknown as string].push(item);
    }
  });
  return set;
}

export function extendObjectOfArray<
  T extends object,
  U extends Record<string, Array<T>>,
>(object: U): Array<T> {
  const _arr = [] as Array<T>;
  const keys = Object.keys(object);
  for (const key of keys) {
    if (Array.isArray(object[key])) {
      _arr.push(...object[key]);
    }
  }
  return _arr;
}

export function pickArrayOfObjectByProp<
  T extends object,
  U extends T[],
  K extends keyof T,
>(arr: U, prop: K): T[K][] {
  const _arr = [] as Array<T[K]>;
  arr.map((item) => {
    if (item.hasOwnProperty(prop)) {
      _arr.push(item[prop]);
    }
  });
  return _arr;
}
