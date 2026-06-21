<template>
  <div class="tasting-card" @click="goToDetail">
    <div class="card-header">
      <img :src="record.user.avatar" :alt="record.user.nickname" class="avatar" @click.stop="goToUser" />
      <div class="user-info">
        <div class="nickname" @click.stop="goToUser">{{ record.user.nickname }}</div>
        <div class="time">{{ formatTime(record.createdAt) }}</div>
      </div>
      <van-tag :type="sceneType" size="medium" class="scene-tag">
        {{ DrinkingSceneLabels[record.scene] }}
      </van-tag>
    </div>
    
    <div class="wine-section">
      <img :src="record.wine.image" :alt="record.wine.name" class="wine-image" />
      <div class="wine-info">
        <div class="wine-name">{{ record.wine.name }}</div>
        <div class="wine-en">{{ record.wine.nameEn }}</div>
        <div class="wine-meta">
          <span>{{ record.wine.country }} · {{ record.wine.region }}</span>
          <span v-if="record.wine.year">{{ record.wine.year }}</span>
        </div>
        <div class="wine-price">¥{{ record.price }}</div>
      </div>
    </div>
    
    <div class="rating-section">
      <div class="rating-item">
        <span class="rating-label">色泽</span>
        <StarRating :model-value="record.rating.color" readonly />
      </div>
      <div class="rating-item">
        <span class="rating-label">闻香</span>
        <StarRating :model-value="record.rating.aroma" readonly />
      </div>
      <div class="rating-item">
        <span class="rating-label">口感</span>
        <StarRating :model-value="record.rating.taste" readonly />
      </div>
      <div class="rating-item">
        <span class="rating-label">余味</span>
        <StarRating :model-value="record.rating.finish" readonly />
      </div>
    </div>
    
    <div class="description">
      {{ record.description }}
    </div>
    
    <div class="purchase-info">
      <span class="purchase-label">购买渠道：</span>
      <span class="purchase-value">{{ record.purchaseChannel }}</span>
    </div>
    
    <div class="card-actions">
      <div class="action-item" @click.stop="handleLike">
        <van-icon 
          :name="record.isLiked ? 'like' : 'like-o'" 
          :color="record.isLiked ? '#ff6b6b' : '#999'" 
          size="20" 
        />
        <span :class="{ 'liked': record.isLiked }">{{ record.likes }}</span>
      </div>
      <div class="action-item" @click.stop="goToDetail">
        <van-icon name="chat-o" color="#999" size="20" />
        <span>{{ record.commentsCount }}</span>
      </div>
      <div class="action-item">
        <van-icon name="share-o" color="#999" size="20" />
        <span>分享</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { TastingRecord } from '@/types'
import { DrinkingSceneLabels, type DrinkingScene } from '@/types'
import { useTastingStore } from '@/stores'
import StarRating from './StarRating.vue'

const props = defineProps<{
  record: TastingRecord
}>()

const router = useRouter()
const tastingStore = useTastingStore()

const sceneType = computed(() => {
  const sceneMap: Record<DrinkingScene, 'primary' | 'success' | 'warning' | 'danger' | 'default'> = {
    solo: 'primary',
    friends: 'success',
    business: 'warning',
    date: 'danger',
    dining: 'default'
  }
  return sceneMap[props.record.scene]
})

const formatTime = (dateStr: string) => {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`
  return date.toLocaleDateString('zh-CN')
}

const handleLike = () => {
  tastingStore.likeRecord(props.record.id)
}

const goToDetail = () => {
  router.push(`/record/${props.record.id}`)
}

const goToUser = () => {
  router.push(`/user/${props.record.userId}`)
}
</script>

<style scoped>
.tasting-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.tasting-card:active {
  transform: scale(0.98);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
}

.user-info {
  flex: 1;
}

.nickname {
  font-size: 15px;
  font-weight: 600;
  color: #1a1a2e;
}

.time {
  font-size: 12px;
  color: #999;
  margin-top: 2px;
}

.scene-tag {
  border-radius: 20px;
}

.wine-section {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  padding: 12px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
}

.wine-image {
  width: 80px;
  height: 100px;
  border-radius: 8px;
  object-fit: cover;
}

.wine-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.wine-name {
  font-size: 16px;
  font-weight: 700;
  color: #1a1a2e;
}

.wine-en {
  font-size: 11px;
  color: #888;
  font-style: italic;
}

.wine-meta {
  font-size: 12px;
  color: #666;
  display: flex;
  gap: 12px;
}

.wine-price {
  font-size: 18px;
  font-weight: 700;
  color: #8B4513;
}

.rating-section {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 16px;
  padding: 12px;
  background: rgba(245, 166, 35, 0.05);
  border-radius: 12px;
}

.rating-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.rating-label {
  width: 32px;
  font-size: 12px;
  color: #666;
}

.description {
  font-size: 14px;
  line-height: 1.6;
  color: #333;
  margin-bottom: 12px;
}

.purchase-info {
  font-size: 12px;
  color: #888;
  margin-bottom: 16px;
  padding: 8px 12px;
  background: #f8f9fa;
  border-radius: 8px;
}

.purchase-label {
  color: #888;
}

.purchase-value {
  color: #1a1a2e;
  font-weight: 500;
}

.card-actions {
  display: flex;
  justify-content: space-around;
  padding-top: 12px;
  border-top: 1px solid #eee;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  transition: color 0.2s ease;
}

.action-item:active {
  transform: scale(0.95);
}

.liked {
  color: #ff6b6b;
  font-weight: 500;
}
</style>
