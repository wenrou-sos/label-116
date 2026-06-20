<template>
  <div class="record-detail-page">
    <van-nav-bar
      title="品鉴详情"
      left-arrow
      @click-left="onBack"
      class="navbar"
    />
    
    <div class="content" v-if="record">
      <TastingCard :record="record" />
      
      <div class="comments-section">
        <div class="section-header">
          <div class="section-title">评论 ({{ record.commentsCount }})</div>
        </div>
        
        <div class="comments-list">
          <div
            v-for="comment in record.comments"
            :key="comment.id"
            class="comment-item"
          >
            <img
              :src="comment.user.avatar"
              :alt="comment.user.nickname"
              class="comment-avatar"
              @click="goToUser(comment.userId)"
            />
            <div class="comment-content">
              <div class="comment-header">
                <span
                  class="comment-nickname"
                  @click="goToUser(comment.userId)"
                >{{ comment.user.nickname }}</span>
                <span class="comment-time">{{ formatTime(comment.createdAt) }}</span>
              </div>
              <div class="comment-text">{{ comment.content }}</div>
            </div>
          </div>
          
          <Empty v-if="record.comments.length === 0" description="暂无评论，快来抢沙发吧~" />
        </div>
      </div>
    </div>
    
    <div class="comment-input-bar">
      <van-field
        v-model="commentText"
        placeholder="写下你的评论..."
        class="comment-input"
        :border="false"
      />
      <van-button
        type="primary"
        size="small"
        class="send-btn"
        :disabled="!commentText.trim()"
        @click="submitComment"
      >
        发送
      </van-button>
    </div>
    
    <van-loading v-if="!record" class="loading" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTastingStore } from '@/stores'
import TastingCard from '@/components/TastingCard.vue'
import Empty from '@/components/Empty.vue'

const route = useRoute()
const router = useRouter()
const tastingStore = useTastingStore()

const record = ref(tastingStore.currentRecord)
const commentText = ref('')

const formatTime = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN', {
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const onBack = () => {
  router.back()
}

const goToUser = (userId: string) => {
  router.push(`/user/${userId}`)
}

const submitComment = async () => {
  if (!commentText.value.trim()) return
  try {
    await tastingStore.addComment(route.params.id as string, commentText.value)
    commentText.value = ''
  } catch (error) {
    console.error('Failed to add comment:', error)
  }
}

onMounted(async () => {
  const id = route.params.id as string
  if (record.value?.id !== id) {
    await tastingStore.fetchRecordById(id)
    record.value = tastingStore.currentRecord
  }
})
</script>

<style scoped>
.record-detail-page {
  min-height: 100vh;
  padding-bottom: 80px;
}

.navbar {
  position: sticky;
  top: 0;
  z-index: 10;
}

:deep(.van-nav-bar) {
  background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%);
}

:deep(.van-nav-bar__title) {
  color: #fff;
}

:deep(.van-nav-bar__arrow) {
  color: #fff;
}

:deep(.van-nav-bar__text) {
  color: #fff;
}

.content {
  padding: 16px;
}

.comments-section {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 16px;
  margin-top: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.section-header {
  margin-bottom: 16px;
}

.section-title {
  font-size: 16px;
  font-weight: 700;
  color: #1a1a2e;
}

.comment-item {
  display: flex;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.comment-item:last-child {
  border-bottom: none;
}

.comment-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.comment-content {
  flex: 1;
  min-width: 0;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.comment-nickname {
  font-size: 13px;
  font-weight: 600;
  color: #8B4513;
}

.comment-time {
  font-size: 11px;
  color: #999;
}

.comment-text {
  font-size: 14px;
  color: #333;
  line-height: 1.5;
}

.comment-input-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  padding-bottom: calc(12px + env(safe-area-inset-bottom));
  background: #fff;
  border-top: 1px solid #eee;
  z-index: 100;
}

.comment-input {
  flex: 1;
  background: #f5f5f5;
  border-radius: 20px;
  padding: 8px 16px;
}

.send-btn {
  border-radius: 20px;
  background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%);
  border: none;
}

.loading {
  display: flex;
  justify-content: center;
  padding: 100px 0;
}
</style>
