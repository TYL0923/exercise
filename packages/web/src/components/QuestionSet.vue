<script setup lang="ts">
import type { IQuestion } from '@exercise/type'
const props = withDefaults(
  defineProps<{
    list: IQuestion[]
  }>(),
  {},
)
</script>

<template>
  <div>
    <Question v-for="question in list" v-bind="$attrs" :key="question.id" :question="question" />
  </div>
</template>
