<template>
  <div class="tabbar-wrapper">
    <van-tabbar v-model="active" route active-color="#8B4513" inactive-color="#999">
      <van-tabbar-item name="/" to="/">
        <template #icon>
          <Home class="tab-icon" />
        </template>
        首页
      </van-tabbar-item>
      <van-tabbar-item name="/explore" to="/explore">
        <template #icon>
          <Compass class="tab-icon" />
        </template>
        发现
      </van-tabbar-item>
      <van-tabbar-item name="/create" to="/create">
        <template #icon>
          <PlusCircle class="tab-icon" />
        </template>
        记录
      </van-tabbar-item>
      <van-tabbar-item name="/messages" to="/messages">
        <template #icon>
          <div class="icon-wrapper">
            <Bell class="tab-icon" />
            <div v-if="notificationStore.hasUnread" class="red-dot" />
          </div>
        </template>
        消息
      </van-tabbar-item>
      <van-tabbar-item name="/lists" to="/lists">
        <template #icon>
          <ListOrdered class="tab-icon" />
        </template>
        酒单
      </van-tabbar-item>
      <van-tabbar-item name="/profile" to="/profile">
        <template #icon>
          <User class="tab-icon" />
        </template>
        我的
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Home, Compass, PlusCircle, Bell, ListOrdered, User } from 'lucide-vue-next'
import { useNotificationStore } from '@/stores'

const route = useRoute()
const active = ref(route.path)
const notificationStore = useNotificationStore()

watch(() => route.path, (path) => {
  active.value = path
})

onMounted(() => {
  notificationStore.fetchUnreadCount()
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

.tab-icon {
  width: 22px;
  height: 22px;
}

.icon-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.red-dot {
  position: absolute;
  top: -2px;
  right: -4px;
  width: 8px;
  height: 8px;
  background-color: #ff4d4f;
  border-radius: 50%;
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
