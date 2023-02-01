<script setup lang="ts">
import { computed } from 'vue'

type FilterProps = 'mode' | 'start' | 'part'
const props = defineProps<{
  options: Record<FilterProps, Array<Record<'label' | 'key', string>>>
  filter: Record<FilterProps, string>
}>()
const optionGroup = computed(() => {
  return {
    mode: props.options.mode,
    start: props.filter.mode === 'test' ? [] : props.options.start,
    part: props.filter.mode === 'test' ? [] : props.filter.start === 'restart' ? [] : props.options.part,
  }
})
function handleChangeFilter(index: FilterProps, value: string) {
  props.filter[index]! = value
}
</script>

<template>
  <div flex flex-col my-2>
    <div
      v-for="group, index in optionGroup" :key="index"
      flex items-center my-2 gap-x-6
    >
      <span
        v-for="item, idx in group" :key="idx"
        mx-2 text-xs hover="cursor-pointer text-sky-500"
        :class="filter[index] === item.key ? 'text-sky-500' : 'text-gray-500'"
        @click="handleChangeFilter(index, item.key)"
      >{{ item.label }}</span>
    </div>
  </div>
</template>

<style scoped lang="less">

</style>
