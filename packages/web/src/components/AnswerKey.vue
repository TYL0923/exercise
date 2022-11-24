<script setup lang="ts">
import type { IQuestion } from '@exercise/type'
import { integration } from '@exercise/util'

const props = withDefaults(
  defineProps<{
    list: IQuestion[]
  }>(),
  { },
)
const answerKey = computed(() => {
  return integration(props.list, 'type')
})
const questionTypeMap: Record<string, string> = {
  select: '选择题',
  judge: '判断题',
}
const gotoAnchor = (id: string) => {
  const oQuestion = document.querySelector(`*[anchor='${id}']`)
  oQuestion?.classList.add('active')
  // setTimeout(() => {
  //   if (oQuestion?.classList.contains('active'))
  //     oQuestion?.classList.remove('active')
  // }, 2000)
  oQuestion?.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
  })
}
function handleClick(id: string) {
  gotoAnchor(id)
}
</script>

<template>
  <div>
    <div v-for="set, index in answerKey" :key="index" mb-6>
      <h5>{{ questionTypeMap[index] }}</h5>
      <div class="grid-container">
        <a-button
          v-for="item, idx in set" :key="item.id"
          size="small"
          :type="item.isDo ? 'primary' : 'default'"
          @click="handleClick(item.id)"
        >
          {{ idx + 1 }}
        </a-button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.grid-container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-gap: 1rem;
}
</style>
