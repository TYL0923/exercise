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
      <div p-4 bg-white flex flex-col gap-y-3 rounded-2 my-2>
        <div class="main" w-40 h-5 rounded-1 />
        <div class="main" w-60 h-3 rounded-1 />
        <div flex items-center>
          <div class="main" w-6 h-6 rounded-full />
          <div class="main" ml-2 w-20 h-3 rounded-1 />
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
  @keyframes loading {
    to {
      background-position-x: -20%;
    }
  }
  .container {
    .main {
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
