<script setup lang="ts">
import { ConfigProvider as AConfigProvider } from 'ant-design-vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
const locale = ref(zhCN)
</script>

<template>
  <AConfigProvider :locale="locale">
    <router-view />
  </AConfigProvider>
</template>
