<script setup lang="ts">
import { ref } from 'vue'
const name = ref<string>('12')
</script>

<template>
  <view p-4 bg-gray-100>
    {{ name }}
  </view>
</template>

<style>

</style>
