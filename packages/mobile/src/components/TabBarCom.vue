<script setup lang="ts">
import { useTabBar } from '../composables'

const { active, tabItems } = useTabBar()
function changeItem(idx: string | number) {
  const path = `/pages/${tabItems.value[Number(idx)].page}`
  uni.navigateTo({
    url: path,
  })
}
</script>

<template>
  <view>
    <van-tabbar v-model="active" @change="changeItem">
      <van-tabbar-item v-for="item in tabItems" :key="item.page" :icon="item.icon">
        {{ item.label }}
      </van-tabbar-item>
    </van-tabbar>
  </view>
</template>

<style scoped lang="less">

</style>
