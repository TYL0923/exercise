<script setup lang="ts">
import { useTabBar } from '../composables'

const router = useRouter()
const { active, tabItems } = useTabBar()
function changeItem(idx: string | number) {
  const path = `${tabItems.value[Number(idx)].page}`
  router.push(path)
}
</script>

<template>
  <div>
    <van-tabbar v-model="active" @change="changeItem">
      <van-tabbar-item v-for="item in tabItems" :key="item.page" :icon="item.icon">
        {{ item.label }}
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>
