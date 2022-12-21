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
  <view class="container">
    <template v-if="type === 'questionSetCard'">
      <view p-4 bg-white flex flex-col gap-y-3 rounded-2 my-2>
        <view class="main" w-400 h-50 rounded-1 />
        <view class="main" w-600 h-30 rounded-1 />
        <view flex items-center>
          <view class="main" w-60 h-60 rounded-full />
          <view class="main" ml-2 w-200 h-30 rounded-1 />
        </view>
      </view>
    </template>
  </view>
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
