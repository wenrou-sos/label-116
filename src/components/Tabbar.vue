<template>
  <div class="tabbar-wrapper">
    <van-tabbar v-model="active" route active-color="#8B4513" inactive-color="#999">
      <van-tabbar-item name="/" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item name="/explore" icon="compass-o">发现</van-tabbar-item>
      <van-tabbar-item name="/create" icon="plus">记录</van-tabbar-item>
      <van-tabbar-item name="/lists" icon="list">酒单</van-tabbar-item>
      <van-tabbar-item name="/profile" icon="user-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const active = ref(route.path)

watch(() => route.path, (path) => {
  active.value = path
})
</script>

<style scoped>
.tabbar-wrapper {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

:deep(.van-tabbar-item--active) {
  color: #8B4513 !important;
}

:deep(.van-tabbar-item__icon) {
  font-size: 20px;
}

:deep(.van-tabbar-item__text) {
  font-size: 12px;
}
</style>
