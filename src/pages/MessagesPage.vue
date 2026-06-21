<template>
  <div class="messages-page">
    <div class="header">
      <div class="header-content">
        <div class="title">消息</div>
        <div
          class="read-all-btn"
          :class="{ disabled: notificationStore.unreadCount === 0 }"
          @click="handleMarkAllRead"
        >
          <CheckCheck class="read-icon" />
          <span>全部已读</span>
        </div>
      </div>
      <div v-if="notificationStore.unreadCount > 0" class="unread-tip">
        还有 {{ notificationStore.unreadCount }} 条未读消息
      </div>
    </div>

    <div class="content">
      <van-loading v-if="notificationStore.loading" class="loading" color="#8B4513" />

      <template v-else>
        <Empty v-if="notificationStore.notifications.length === 0" description="暂无消息通知" />

        <div v-else class="notification-list">
          <NotificationItem
            v-for="notification in notificationStore.notifications"
            :key="notification.id"
            :notification="notification"
            @read="handleRead"
            @delete="handleDelete"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, onActivated } from 'vue'
import { CheckCheck } from 'lucide-vue-next'
import { showToast } from 'vant'
import 'vant/es/toast/style'
import { useNotificationStore } from '@/stores'
import NotificationItem from '@/components/NotificationItem.vue'
import Empty from '@/components/Empty.vue'

const notificationStore = useNotificationStore()

const handleMarkAllRead = async () => {
  if (notificationStore.unreadCount === 0) return
  try {
    await notificationStore.markAllAsRead()
    showToast({ message: '已全部标为已读', position: 'top' })
  } catch (e) {
    console.error(e)
  }
}

const handleRead = async (id: string) => {
  try {
    await notificationStore.markAsRead(id)
  } catch (e) {
    console.error(e)
  }
}

const handleDelete = async (id: string) => {
  try {
    await notificationStore.removeNotification(id)
    showToast({ message: '已删除', position: 'top' })
  } catch (e) {
    console.error(e)
  }
}

const refreshData = () => {
  notificationStore.fetchNotifications()
  notificationStore.fetchUnreadCount()
}

const handleVisibilityChange = () => {
  if (document.visibilityState === 'visible') {
    refreshData()
  }
}

onMounted(() => {
  refreshData()
  document.addEventListener('visibilitychange', handleVisibilityChange)
})

onActivated(() => {
  refreshData()
})

onBeforeUnmount(() => {
  document.removeEventListener('visibilitychange', handleVisibilityChange)
})
</script>

<style scoped>
.messages-page {
  min-height: 100vh;
  padding-bottom: 80px;
}

.header {
  padding: 20px 16px 12px;
  padding-top: calc(20px + env(safe-area-inset-top));
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.title {
  font-size: 24px;
  font-weight: 700;
  color: #fff;
}

.read-all-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: rgba(139, 69, 19, 0.2);
  border: 1px solid rgba(139, 69, 19, 0.4);
  border-radius: 20px;
  font-size: 13px;
  color: #8B4513;
  transition: all 0.2s ease;
}

.read-all-btn:active {
  background: rgba(139, 69, 19, 0.35);
  transform: scale(0.98);
}

.read-all-btn.disabled {
  opacity: 0.4;
  pointer-events: none;
}

.read-icon {
  width: 16px;
  height: 16px;
}

.unread-tip {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  padding: 6px 0;
}

.content {
  padding: 0 16px;
}

.loading {
  display: flex;
  justify-content: center;
  padding: 60px 0;
}

.notification-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
