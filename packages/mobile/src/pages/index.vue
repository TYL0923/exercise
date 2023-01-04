<script setup lang="ts">
const tabActive = ref(0)
const tabItems = ref(['推荐'])
function gotoSearch() {
  uni.navigateTo({
    url: '/pages/search',
  })
}
</script>

<template>
  <view bg-gray-50 h-screen box-border>
    <view bg-white>
      <van-search text-xs shape="round" placeholder="点击搜索题库" disabled @click="gotoSearch" />
      <van-tabs v-model:active="tabActive" shrink>
        <van-tab v-for="item in tabItems" :key="item" :title="item">
          <view p-4>
            {{ item }}
          </view>
        </van-tab>
      </van-tabs>
    </view>
    <TabBarCom />
  </view>
</template>

<style>

</style>
