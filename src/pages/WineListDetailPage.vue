<template>
  <div class="wine-list-detail-page">
    <van-nav-bar
      title="酒单详情"
      left-arrow
      @click-left="$router.back()"
      :fixed="true"
      :placeholder="true"
      class="navbar"
    >
      <template #right>
        <van-icon name="more-o" size="20" color="#fff" @click="showMore = true" />
      </template>
    </van-nav-bar>

    <div v-if="wineList" class="content">
      <div class="list-cover">
        <img :src="wineList.coverImage" :alt="wineList.title" class="cover-image" />
        <div class="cover-overlay">
          <div class="list-title">{{ wineList.title }}</div>
          <div class="list-desc">{{ wineList.description }}</div>
        </div>
      </div>

      <div class="list-info">
        <div class="author-row" @click="goToUserProfile(wineList.user.id)">
          <img :src="wineList.user.avatar" :alt="wineList.user.nickname" class="author-avatar" />
          <div class="author-info">
            <div class="author-name">{{ wineList.user.nickname }}</div>
            <div class="author-bio">{{ formatTime(wineList.createdAt) }} 创建</div>
          </div>
          <van-icon name="arrow" size="16" color="#999" />
        </div>

        <div class="stats-row">
          <div class="stat-item">
            <div class="stat-value">{{ wineList.wines.length }}</div>
            <div class="stat-label">酒款数</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ averageRating }}</div>
            <div class="stat-label">平均评分</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ wineList.likes }}</div>
            <div class="stat-label">收藏</div>
          </div>
        </div>

        <div class="action-row">
          <button
            class="action-btn"
            :class="{ active: wineList.isLiked }"
            @click="handleLike"
          >
            <van-icon :name="wineList.isLiked ? 'star' : 'star-o'" size="18" />
            <span>{{ wineList.isLiked ? '已收藏' : '收藏' }}</span>
          </button>
          <button class="action-btn" @click="showShare = true">
            <van-icon name="share-o" size="18" />
            <span>分享</span>
          </button>
          <button class="action-btn" v-if="isOwner" @click="goToEdit">
            <van-icon name="edit" size="18" />
            <span>编辑</span>
          </button>
        </div>
      </div>

      <div class="wines-section">
        <div class="section-header">
          <div class="section-title">酒单详情</div>
          <div class="section-count">{{ wineList.wines.length }} 款酒</div>
        </div>
        <div class="wines-list">
          <div
            v-for="(wine, index) in wineList.wines"
            :key="wine.id"
            class="wine-item"
            @click="goToWineDetail(wine.id)"
          >
            <div class="wine-rank">{{ index + 1 }}</div>
            <img :src="wine.image" :alt="wine.name" class="wine-image" />
            <div class="wine-info">
              <div class="wine-name">{{ wine.name }}</div>
              <div class="wine-meta">{{ wine.country }} · {{ wine.region }}</div>
              <div class="wine-bottom">
                <StarRating :model-value="wine.rating" readonly size="small" />
                <div class="wine-price">¥{{ wine.price }}</div>
              </div>
            </div>
            <van-icon name="arrow" size="16" color="#ccc" />
          </div>
        </div>
      </div>
    </div>

    <van-loading v-if="loading" class="loading" color="#8B4513" />

    <van-popup v-model:show="showMore" round position="bottom" :style="{ height: '50%' }">
      <div class="more-modal">
        <div class="more-option" @click="goToEdit" v-if="isOwner">
          <van-icon name="edit" size="20" color="#8B4513" />
          <span>编辑酒单</span>
        </div>
        <div class="more-option" @click="showShare = true; showMore = false">
          <van-icon name="share-o" size="20" color="#8B4513" />
          <span>分享酒单</span>
        </div>
        <div class="more-option" @click="goToUserProfile(wineList!.user.id)">
          <van-icon name="user-o" size="20" color="#8B4513" />
          <span>查看作者主页</span>
        </div>
        <div class="more-option danger" @click="handleDelete" v-if="isOwner">
          <van-icon name="delete-o" size="20" />
          <span>删除酒单</span>
        </div>
      </div>
    </van-popup>

    <van-popup v-model:show="showShare" round position="bottom" :style="{ height: '40%' }">
      <div class="share-modal">
        <div class="modal-title">分享酒单</div>
        <div class="share-options">
          <div class="share-item">
            <div class="share-icon wechat">💬</div>
            <span>微信好友</span>
          </div>
          <div class="share-item">
            <div class="share-icon moments">🌅</div>
            <span>朋友圈</span>
          </div>
          <div class="share-item">
            <div class="share-icon weibo">📢</div>
            <span>微博</span>
          </div>
          <div class="share-item">
            <div class="share-icon link">🔗</div>
            <span>复制链接</span>
          </div>
        </div>
      </div>
    </van-popup>

    <van-dialog
      v-model:show="showDeleteConfirm"
      title="确认删除"
      message="删除后无法恢复，确定要删除这个酒单吗？"
      show-cancel-button
      confirm-button-text="删除"
      cancel-button-text="取消"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useWineListStore, useUserStore } from '@/stores'
import { showToast } from 'vant'
import StarRating from '@/components/StarRating.vue'

const route = useRoute()
const router = useRouter()
const wineListStore = useWineListStore()
const userStore = useUserStore()

const loading = ref(false)
const showMore = ref(false)
const showShare = ref(false)
const showDeleteConfirm = ref(false)

const wineList = computed(() => wineListStore.currentList)
const isOwner = computed(() => {
  if (!wineList.value || !userStore.currentUser) return false
  return wineList.value.userId === userStore.currentUser.id
})
const averageRating = computed(() => {
  if (!wineList.value || wineList.value.wines.length === 0) return '0.0'
  const sum = wineList.value.wines.reduce((acc, wine) => acc + wine.rating, 0)
  return (sum / wineList.value.wines.length).toFixed(1)
})

const formatTime = (time: string) => {
  const date = new Date(time)
  return date.toLocaleDateString('zh-CN')
}

const goToUserProfile = (userId: string) => {
  showMore.value = false
  router.push(`/user/${userId}`)
}

const goToWineDetail = (wineId: string) => {
  router.push(`/wine/${wineId}`)
}

const goToEdit = () => {
  showMore.value = false
  if (wineList.value) {
    router.push(`/edit-list/${wineList.value.id}`)
  }
}

const handleLike = async () => {
  if (!wineList.value) return
  try {
    await wineListStore.likeList(wineList.value.id)
    showToast(wineList.value.isLiked ? '已收藏' : '已取消收藏')
  } catch (e) {
    showToast('操作失败')
  }
}

const handleDelete = () => {
  showMore.value = false
  showDeleteConfirm.value = true
}

const confirmDelete = async () => {
  if (!wineList.value) return
  try {
    await wineListStore.deleteList(wineList.value.id)
    showToast('删除成功')
    router.back()
  } catch (e) {
    showToast('删除失败')
  }
}

onMounted(async () => {
  loading.value = true
  try {
    const listId = route.params.id as string
    await wineListStore.fetchListById(listId)
    await userStore.fetchCurrentUser()
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.wine-list-detail-page {
  min-height: 100vh;
}

.navbar {
  background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%);
}

.navbar :deep(.van-nav-bar__title),
.navbar :deep(.van-nav-bar__arrow) {
  color: #fff !important;
}

.content {
  padding-bottom: 20px;
}

.list-cover {
  position: relative;
  height: 200px;
  margin: -46px 0 0;
  padding-top: 46px;
}

.cover-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px 16px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  color: #fff;
}

.list-title {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 6px;
}

.list-desc {
  font-size: 13px;
  opacity: 0.9;
  line-height: 1.5;
}

.list-info {
  background: rgba(255, 255, 255, 0.98);
  margin: -16px 16px 0;
  border-radius: 16px;
  padding: 16px;
  position: relative;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.author-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.author-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
}

.author-info {
  flex: 1;
}

.author-name {
  font-size: 15px;
  font-weight: 600;
  color: #1a1a2e;
}

.author-bio {
  font-size: 12px;
  color: #999;
  margin-top: 2px;
}

.stats-row {
  display: flex;
  justify-content: space-around;
  padding: 20px 0;
  border-bottom: 1px solid #f0f0f0;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 20px;
  font-weight: 700;
  color: #8B4513;
}

.stat-label {
  font-size: 11px;
  color: #999;
  margin-top: 4px;
}

.action-row {
  display: flex;
  gap: 12px;
  padding-top: 16px;
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 12px;
  background: rgba(139, 69, 19, 0.08);
  color: #8B4513;
  border: none;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 500;
}

.action-btn.active {
  background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%);
  color: #fff;
}

.wines-section {
  padding: 16px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-title {
  font-size: 16px;
  font-weight: 700;
  color: #fff;
}

.section-count {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
}

.wines-list {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.wine-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-bottom: 1px solid #f0f0f0;
}

.wine-item:last-child {
  border-bottom: none;
}

.wine-rank {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(139, 69, 19, 0.1);
  color: #8B4513;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.wine-item:nth-child(1) .wine-rank {
  background: linear-gradient(135deg, #ffd700 0%, #ffb347 100%);
  color: #fff;
}

.wine-item:nth-child(2) .wine-rank {
  background: linear-gradient(135deg, #c0c0c0 0%, #a8a8a8 100%);
  color: #fff;
}

.wine-item:nth-child(3) .wine-rank {
  background: linear-gradient(135deg, #cd7f32 0%, #8b4513 100%);
  color: #fff;
}

.wine-image {
  width: 56px;
  height: 70px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
}

.wine-info {
  flex: 1;
  min-width: 0;
}

.wine-name {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a2e;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.wine-meta {
  font-size: 11px;
  color: #999;
  margin: 4px 0;
}

.wine-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.wine-price {
  font-size: 14px;
  font-weight: 700;
  color: #8B4513;
}

.loading {
  display: flex;
  justify-content: center;
  padding: 60px;
}

.more-modal {
  padding: 16px;
}

.more-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 12px;
  margin-bottom: 12px;
  font-size: 15px;
  color: #1a1a2e;
}

.more-option.danger {
  color: #ee0a24;
}

.more-option.danger .van-icon {
  color: #ee0a24 !important;
}

.share-modal {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.modal-title {
  font-size: 18px;
  font-weight: 700;
  color: #1a1a2e;
  text-align: center;
  padding: 20px;
}

.share-options {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  padding: 20px;
}

.share-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #666;
}

.share-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.share-icon.wechat { background: #07c160; }
.share-icon.moments { background: #576b95; }
.share-icon.weibo { background: #e6162d; }
.share-icon.link { background: #888; }
</style>
