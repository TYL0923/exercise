<script setup lang="ts">
import type { QuestionSet } from '@exercise/type'

const props = defineProps<{
  data: QuestionSet
}>()
</script>

<template>
  <view p-4 bg-white flex flex-col gap-y-2 rounded-2 my-2>
    <view flex items-center justify-between>
      <view text-xl text-gray-900 font-medium>
        {{ data.title }}
      </view>
      <view text-sm text-gray-400>
        {{ `${data.num} 题` }}
      </view>
    </view>
    <view flex items-center gap-x-1>
      <uni-tag size="small" :inverted="true" text="软考" />
      <uni-tag size="small" :inverted="true" text="软件设计师" />
      <uni-tag size="small" :inverted="true" text="程序设计" />
    </view>
    <view flex items-center justify-between mt-2>
      <view flex items-center>
        <image w-60 h-60 rounded-full src="../static/logo.png" />
        <view ml-2 text-sm text-gray-600>
          {{ data.author.name }}
        </view>
      </view>
    </view>
  </view>
</template>
