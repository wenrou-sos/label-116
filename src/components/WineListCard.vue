<template>
  <div class="wine-list-card" @click="goToDetail">
    <div class="cover-wrapper">
      <img :src="list.coverImage" :alt="list.title" class="cover-image" />
      <div class="overlay">
        <div class="wine-count">{{ list.wines.length }} 款酒</div>
      </div>
    </div>
    <div class="card-content">
      <div class="list-title">{{ list.title }}</div>
      <div class="list-desc">{{ list.description }}</div>
      <div class="list-footer">
        <div class="author" @click.stop="goToUser">
          <img :src="list.user.avatar" :alt="list.user.nickname" class="author-avatar" />
          <span class="author-name">{{ list.user.nickname }}</span>
        </div>
        <div class="likes" @click.stop="handleLike">
          <van-icon 
            :name="list.isLiked ? 'like' : 'like-o'" 
            :color="list.isLiked ? '#ff6b6b' : '#999'" 
            size="16" 
          />
          <span :class="{ 'liked': list.isLiked }">{{ list.likes }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { WineList } from '@/types'
import { useWineListStore } from '@/stores'

const props = defineProps<{
  list: WineList
}>()

const router = useRouter()
const wineListStore = useWineListStore()

const goToDetail = () => {
  router.push(`/list/${props.list.id}`)
}

const goToUser = () => {
  router.push(`/user/${props.list.userId}`)
}

const handleLike = () => {
  wineListStore.likeList(props.list.id)
}
</script>

<style scoped>
.wine-list-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.wine-list-card:active {
  transform: scale(0.98);
}

.cover-wrapper {
  position: relative;
  width: 100%;
  padding-top: 60%;
  overflow: hidden;
}

.cover-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, transparent 50%, rgba(0, 0, 0, 0.6));
  display: flex;
  align-items: flex-end;
  padding: 12px;
}

.wine-count {
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  padding: 4px 12px;
  background: rgba(139, 69, 19, 0.9);
  border-radius: 20px;
}

.card-content {
  padding: 12px;
}

.list-title {
  font-size: 16px;
  font-weight: 700;
  color: #1a1a2e;
  margin-bottom: 6px;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.list-desc {
  font-size: 13px;
  color: #666;
  line-height: 1.5;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.list-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.author {
  display: flex;
  align-items: center;
  gap: 6px;
}

.author-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
}

.author-name {
  font-size: 12px;
  color: #666;
}

.likes {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #999;
}

.liked {
  color: #ff6b6b;
  font-weight: 500;
}
</style>
