import type { QuestionSet } from '@exercise/type'
import { ActionSheet, Tag, Button as VantButton, showConfirmDialog, showNotify } from 'vant'
import { QuestionSetCardCom } from '../components'
import { joinQuestionSetById } from '../lib/api'
import { useLoginState } from './useLogin'
export function useJoin() {
  const loginState = useLoginState()
  const isShow = ref<boolean>(false)
  const joinQuestionSet = ref<QuestionSet>()
  function showJoin(questionSet: QuestionSet) {
    joinQuestionSet.value = questionSet
    isShow.value = true
  }
  async function handleJoinQuestionSet() {
    if (!joinQuestionSet.value)
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
    showConfirmDialog({
      title: '确认',
      message: '确认加入题库',
    })
      .then(async () => {
        // on confirm
        isShow.value = false
        uni.showLoading({
          title: '加入中',
        })
        const { err, data } = await joinQuestionSetById(joinQuestionSet.value!.id, loginState.account)
        if (!err && data) {
          showNotify({
            type: 'success',
            message: '加入成功',
            duration: 350,
          })
        }
        else {
          showNotify({
            type: 'danger',
            message: '加入失败',
            duration: 350,
          })
        }
        // initjoinableQuestionSetList('')
        uni.hideLoading()
      })
      .catch(() => {
        // on cancel
      })
  }
  const joinConfirmCom = defineComponent({
    name: 'JoinConfirmCom',
    components: { ActionSheet, VantButton, QuestionSetCardCom, Tag },
    setup() {
      return () => h(
        ActionSheet,
        {
          'show': isShow.value,
          'onUpdate:show': (value) => { isShow.value = value },
        },
        () => h('div', { style: { padding: '16px' } },
          [
            h('div', {
              style: {
                padding: '0 16px 0 16px',
                margin: '16px 0 16px 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              },
            }, [
              h(VantButton, { onClick: () => isShow.value = false }, () => '取消'),
              h(VantButton, {
                type: 'primary',
                onClick: handleJoinQuestionSet,
              }, () => '加入'),
            ]),
            joinQuestionSet.value
              ? h(QuestionSetCardCom, {
                data: joinQuestionSet.value,
                isShadow: false,
              })
              : '',
          ]),
      )
    },
  })
  return {
    showJoin,
    joinConfirmCom,
  }
}
