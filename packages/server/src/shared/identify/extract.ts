import { Question } from 'src/modules/question/entity/question.entity';

const IS_SELECT_REG = /[A-Z](\.|、)/g;
const IS_JUDGE_REG = /[\?？]/g;
const SELECT_OPTION_REG = /([A-Z])(\.|、)(.+?)\s{1,}?/g;
const SELECT_TITLE_REG = /\d(\.|、)(.+?)\s+[A-Z](\.|、)/g;
const JUDGE_TITLE_REG = /\d(\.|、)(.+?)[\?？]\s+/g;
const QUESTION_SEGMENT_REG = /\d(\.|、)[\s\S]+?[\r\n]{4,}/g;

export function extractQuestion(str: string): Question[] {
  str += '\r\n\r\n';
  const questions = str.match(QUESTION_SEGMENT_REG);
  const questionArr: Question[] = [];
  questions.forEach((questionStr, idx) => {
    let question: Question;
    if (isSelect(questionStr)) {
      question = createSelect(questionStr, idx);
    } else if (isJudge(questionStr)) {
      question = createJudge(questionStr, idx);
    }
    questionArr.push(question);
  });
  return questionArr;
}

function createSelect(selectStr: string, idx: number): Question {
  // console.log(selectStr);
  const options = selectStr.matchAll(SELECT_OPTION_REG);
  const titles = selectStr.matchAll(SELECT_TITLE_REG);
  const answerOption = [];
  let title = '';
  // console.log(titles);
  for (const item of titles) {
    title = item[2];
  }
  for (const option of options) {
    answerOption.push(option[3]);
  }
  return {
    id: `identify-${idx}`,
    type: 'select',
    title,
    completeTitle: selectStr,
    options: answerOption,
    isDo: 0,
    isError: 0,
    testAnswer: '',
    exerciseAnswer: '',
    correctAnswer: '',
  };
}

function createJudge(judgeStr: string, idx: number): Question {
  const titles = judgeStr.matchAll(JUDGE_TITLE_REG);
  let title = '';
  for (const item of titles) {
    title = item[2];
  }
  return {
    id: `identify-${idx}`,
    type: 'judge',
    title,
    completeTitle: judgeStr,
    options: ['正确', '错误'],
    isDo: 0,
    isError: 0,
    testAnswer: '',
    exerciseAnswer: '',
    correctAnswer: '',
  };
}

function isSelect(str: string) {
  return str.match(IS_SELECT_REG)?.length > 0;
}
function isJudge(str: string) {
  return str.match(IS_JUDGE_REG)?.length > 0;
}
