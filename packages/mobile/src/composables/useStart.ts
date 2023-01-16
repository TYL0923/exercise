import type { QuestionSet } from '@exercise/type'
import { ActionSheet, Button as VantButton, closeToast, showLoadingToast, showNotify } from 'vant'
import { FilterCom, QuestionSetCardCom } from '../components'
import { resetQuestion } from '../lib/api'
import { useLoginState } from './useLogin'
export function useStart() {
  const loginState = useLoginState()
  const isShow = ref<boolean>(false)
  const filter = reactive<{
    mode: 'exercise' | 'test'
    start: 'continue' | 'restart'
    part: 'all' | 'error' | 'not'
  }>({
    mode: 'exercise',
    start: 'continue',
    part: 'all',
  })
  const startQuestionSet = ref<QuestionSet>()
  const filterOptions = reactive({
    mode: [
      {
        label: '刷题模式',
        key: 'exercise',
      },
      {
        label: '考试模式',
        key: 'test',
      },
    ],
    start: [
      {
        label: '继续刷题',
        key: 'continue',
      },
      {
        label: '重新开始',
        key: 'restart',
      },
    ],
    part: [
      {
        label: '全部',
        key: 'all',
      },
      {
        label: '错题',
        key: 'error',
      },
      {
        label: '未做',
        key: 'not',
      },
    ],
  })
  function showStart(questionSet: QuestionSet) {
    startQuestionSet.value = questionSet
    isShow.value = true
  }
  async function start() {
    if (!startQuestionSet.value?.id)
      return
    if (loginState.account.length === 0) {
      showNotify({
        type: 'primary',
        message: '请先登录',
        duration: 500,
      })
      isShow.value = false
      return uni.navigateTo({
        url: '/pages/login',
      })
    }
    if (filter.mode === 'test') {
      showLoadingToast({
        message: '生成试卷中...',
        forbidClick: true,
      })
      await resetQuestion(startQuestionSet.value.id, loginState.account, 'test')
      closeToast()
      uni.navigateTo({
        url: `/pages/test?id=${startQuestionSet.value.id}`,
      })
    }
    else {
      if (filter.start === 'restart') {
        showLoadingToast({
          message: '加载中...',
          forbidClick: true,
        })
        await resetQuestion(startQuestionSet.value.id, loginState.account, 'exercise')
        closeToast()
      }
      uni.navigateTo({
        url: `/pages/exercise?id=${startQuestionSet.value.id}&part=${filter.part}`,
      })
    }
  }
  const StartCom = defineComponent({
    name: 'StartCom',
    components: {
      ActionSheet,
      VantButton,
      FilterCom,
      QuestionSetCardCom,
    },
    setup() {
      return () => h(
        ActionSheet,
        {
          'show': isShow.value,
          'onUpdate:show': (value) => { isShow.value = value },
        },
        () => h('div', { style: { padding: '16px' } }, [
          h('div', {
            style: {
              borderBottom: '1px solid #e5e7eb',
              padding: '0 16px 16px 16px',
              margin: '16px 0 0 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            },
          }, [
            h(VantButton, { onClick: () => isShow.value = false }, () => '取消'),
            h(VantButton, { type: 'primary', onClick: start }, () => '开始'),
          ]),
          h('div', { style: { height: '100px' } }, h(FilterCom, { filter, options: filterOptions })),
          startQuestionSet.value ? h(QuestionSetCardCom, { data: startQuestionSet.value, isShadow: false }) : '',
        ]),
      )
    },
  })
  return {
    showStart,
    StartCom,
  }
}
