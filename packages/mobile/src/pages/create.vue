<script setup lang="ts">
import { showToast } from 'vant'

const router = useRouter()
const url = 'onlinexercise.top'
function back() {
  router.push('/question-set')
}
function copyUrl() {
  const oInput = document.createElement('input')
  oInput.value = url
  document.body.appendChild(oInput)
  oInput.select()
  document.execCommand('Copy')
  showToast('复制成功')
  oInput.remove()
}
</script>

<template>
  <div>
    <van-nav-bar
      title="创建题库"
      left-text="返回"
      left-arrow
      @click-left="back"
    />
    <div mt-10 flex flex-col items-center gap-y-6>
      <h3>
        移动端暂不支持创建题库
      </h3>
      <span>请使用电脑端游览器访问下面链接创建</span>
      <div flex items-center gap-x-2>
        <span text-sky-500>{{ ` ${url} ` }}</span>
        <van-button type="default" size="small" @click="copyUrl">
          复制
        </van-button>
      </div>
    </div>
  </div>
</template>
