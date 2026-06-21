<template>
  <div
    class="notification-item"
    :class="{ unread: !notification.isRead }"
    @click="handleClick"
  >
    <div class="avatar-wrapper">
      <img :src="notification.fromUser.avatar" :alt="notification.fromUser.nickname" class="avatar" />
      <div class="type-badge" :class="notification.type">
        <Heart v-if="notification.type === 'like'" class="badge-icon" />
        <MessageCircle v-if="notification.type === 'comment'" class="badge-icon" />
        <UserPlus v-if="notification.type === 'follow'" class="badge-icon" />
        <Bookmark v-if="notification.type === 'collect'" class="badge-icon" />
      </div>
    </div>
    <div class="content">
      <div class="main-row">
        <div class="user-name">{{ notification.fromUser.nickname }}</div>
        <div class="time">{{ formatTime(notification.createdAt) }}</div>
      </div>
      <div class="action-text">
        <span v-if="notification.type === 'like'">赞了你的品鉴</span>
        <span v-else-if="notification.type === 'comment'">评论了你的记录</span>
        <span v-else-if="notification.type === 'follow'">关注了你</span>
        <span v-else-if="notification.type === 'collect'">收藏了你的酒单</span>
        <span v-if="notification.targetTitle" class="target-title">《{{ notification.targetTitle }}》</span>
      </div>
      <div v-if="notification.commentContent" class="comment-preview">
        {{ notification.commentContent }}
      </div>
    </div>
    <div v-if="!notification.isRead" class="unread-dot" />
    <van-icon
      name="delete-o"
      size="18"
      color="#ff4d4f"
      class="delete-btn"
      @click.stop="handleDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Heart, MessageCircle, UserPlus, Bookmark } from 'lucide-vue-next'
import type { Notification } from '@/types'
import { showConfirmDialog } from 'vant'
import 'vant/es/dialog/style'

const props = defineProps<{
  notification: Notification
}>()

const emit = defineEmits<{
  (e: 'read', id: string): void
  (e: 'delete', id: string): void
}>()

const router = useRouter()

const formatTime = (isoString: string) => {
  const date = new Date(isoString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`
  return `${date.getMonth() + 1}/${date.getDate()}`
}

const handleClick = () => {
  if (!props.notification.isRead) {
    emit('read', props.notification.id)
  }

  const { targetType, targetId, fromUserId } = props.notification
  if (targetType === 'record') {
    router.push(`/record/${targetId}`)
  } else if (targetType === 'list') {
    router.push(`/list/${targetId}`)
  } else if (targetType === 'user') {
    router.push(`/user/${fromUserId}`)
  }
}

const handleDelete = async () => {
  try {
    await showConfirmDialog({
      title: '删除通知',
      message: '确定要删除这条通知吗？',
      confirmButtonColor: '#8B4513'
    })
    emit('delete', props.notification.id)
  } catch {
  }
}
</script>

<style scoped>
.notification-item {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  transition: background 0.2s ease;
}

.notification-item:active {
  background: rgba(255, 255, 255, 0.1);
}

.notification-item.unread {
  background: rgba(255, 255, 255, 0.1);
}

.avatar-wrapper {
  position: relative;
  flex-shrink: 0;
}

.avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(255, 255, 255, 0.1);
}

.type-badge {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #1a1a2e;
}

.type-badge.like {
  background: #ff4d4f;
}

.type-badge.comment {
  background: #1890ff;
}

.type-badge.follow {
  background: #52c41a;
}

.type-badge.collect {
  background: #faad14;
}

.badge-icon {
  width: 11px;
  height: 11px;
  color: #fff;
}

.content {
  flex: 1;
  min-width: 0;
}

.main-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.user-name {
  font-size: 14px;
  font-weight: 600;
  color: #fff;
}

.time {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.4);
  flex-shrink: 0;
  margin-left: 8px;
}

.action-text {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.5;
}

.target-title {
  color: #8B4513;
  font-weight: 500;
}

.comment-preview {
  margin-top: 6px;
  padding: 8px 10px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.unread-dot {
  position: absolute;
  top: 18px;
  right: 16px;
  width: 8px;
  height: 8px;
  background: #ff4d4f;
  border-radius: 50%;
}

.delete-btn {
  flex-shrink: 0;
  padding: 4px;
  margin-left: 4px;
  opacity: 0.6;
  transition: opacity 0.2s ease;
}

.delete-btn:active {
  opacity: 1;
}

.notification-item.unread .delete-btn {
  right: 32px;
}
</style>
