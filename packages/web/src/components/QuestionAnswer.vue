<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    value: string
    type: string
  }>(),
  {
    type: 'select',
  },
)
const emits = defineEmits<{
  (e: 'update:value', newValue: string): void
}>()
const selected = computed({
  get: () => props.value,
  set: value => emits('update:value', value),
})
const answerOption = reactive({
  select: [
    {
      label: 'A',
      value: 'A',
    },
    {
      label: 'B',
      value: 'B',
    },
    {
      label: 'C',
      value: 'C',
    },
    {
      label: 'D',
      value: 'D',
    },
  ],
  judge: [
    {
      label: '正确',
      value: 'yes',
    },
    {
      label: '错误',
      value: 'no',
    },
  ],
})
</script>

<template>
  <div>
    <template v-if="type === 'select'">
      <a-radio-group v-model:value="selected" :options="answerOption[type]" />
    </template>
    <template v-if="type === 'judge'">
      <a-radio-group v-model:value="selected" option-type="button" :options="answerOption[type]" />
    </template>
  </div>
</template>

<style scoped lang="less">

</style>
