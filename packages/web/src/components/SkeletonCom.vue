<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    type: 'question' | 'questionSetCard'
  }>(),
  {
    type: 'questionSetCard',
  },
)
</script>

<template>
  <div class="container">
    <template v-if="type === 'questionSetCard'">
      <div grid grid-rows-4 grid-cols-3 gap-4 border border-gray-200 p-4 rounded-2>
        <main row-start-1 col-start-1 row-end-2 col-end-3 rounded-1 />
        <main row-start-2 col-start-1 row-end-4 col-end-3 rounded-1 />
        <main row-start-1 col-start-3 row-end-4 col-end-4 rounded-1 />
        <main row-start-4 col-start-1 row-end-5 col-end-4 rounded-1 h-3 />
      </div>
    </template>
  </div>
</template>

<style scoped lang="less">
  @keyframes loading {
    to {
      background-position-x: -20%;
    }
  }
  .container {
    main {
      overflow: hidden;
      background-color: #f3f4f6;
      background: linear-gradient(
        120deg,
        rgba(255,255,255, 0) 40%,
        rgba(255,255,255, .5) 50%,
        rgba(255,255,255, 0) 60%
      ) #eee;
      background-size: 200% 100%;
      background-position-x: 120%;
      animation: 1s loading ease-in-out infinite;
    }
  }
</style>
