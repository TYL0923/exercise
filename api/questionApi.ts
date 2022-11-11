import type { Return } from "./request";
import a from './request'
export function updateQuestionAnswer(options: {
  id?: string;
  testAnswer?: string;
  exerciseAnswer?: string;
  isDo?: 0 | 1;
}): Return {
  const url = "/question/update";
  return new Promise((resolve) => {
    setTimeout(async () => {
      const res = await a.put(url, options);
      resolve([undefined, res.data]);
    }, 0);
  });
}
