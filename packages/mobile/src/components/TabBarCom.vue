<script setup lang="ts">
const router = useRouter()
const tabBarState = useTabBar()
function changeItem() {
  router.push(tabBarState.activeItem.page)
}
</script>

<template>
  <div>
    <van-tabbar v-model="tabBarState.activeIdx" @change="changeItem">
      <van-tabbar-item v-for="item in tabBarState.tabItems" :key="item.page" :icon="item.icon">
        {{ item.label }}
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>
