<template>
  <div class="wine-detail-page">
    <van-nav-bar
      title="酒款详情"
      left-arrow
      @click-left="$router.back()"
      :fixed="true"
      :placeholder="true"
      class="navbar"
    >
      <template #right>
        <van-icon name="share-o" size="20" color="#fff" @click="showShare = true" />
      </template>
    </van-nav-bar>

    <div v-if="wine" class="content">
      <div class="wine-header">
        <img :src="wine.image" :alt="wine.name" class="wine-image" />
        <div class="wine-basic">
          <div class="wine-type-tag">{{ wineTypeLabel }}</div>
          <h1 class="wine-name">{{ wine.name }}</h1>
          <p class="wine-en">{{ wine.nameEn }}</p>
          <div class="wine-origin">
            <span class="flag">🏷️</span>
            <span>{{ wine.country }} · {{ wine.region }}</span>
          </div>
          <div class="wine-origin" v-if="wine.year">
            <span class="flag">📅</span>
            <span>年份 {{ wine.year }}</span>
          </div>
          <div class="wine-origin">
            <span class="flag">🍇</span>
            <span>{{ wine.variety }}</span>
          </div>
        </div>
      </div>

      <div class="rating-section">
        <div class="rating-main">
          <div class="rating-score">{{ wine.rating.toFixed(1) }}</div>
          <div class="rating-stars">
            <StarRating :model-value="wine.rating" readonly size="medium" />
          </div>
          <div class="rating-count">{{ wine.tastingCount }} 人品鉴</div>
        </div>
        <div class="rating-details">
          <div class="rating-item">
            <span class="rating-label">色泽</span>
            <div class="rating-bar">
              <div class="bar-fill" :style="{ width: (wine.rating / 5) * 100 + '%' }"></div>
            </div>
          </div>
          <div class="rating-item">
            <span class="rating-label">闻香</span>
            <div class="rating-bar">
              <div class="bar-fill" :style="{ width: (wine.rating / 5) * 95 + '%' }"></div>
            </div>
          </div>
          <div class="rating-item">
            <span class="rating-label">口感</span>
            <div class="rating-bar">
              <div class="bar-fill" :style="{ width: (wine.rating / 5) * 90 + '%' }"></div>
            </div>
          </div>
          <div class="rating-item">
            <span class="rating-label">余味</span>
            <div class="rating-bar">
              <div class="bar-fill" :style="{ width: (wine.rating / 5) * 85 + '%' }"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="price-section">
        <div class="price-label">参考价格</div>
        <div class="price-value">¥{{ wine.price }}</div>
        <div class="price-note">价格仅供参考，以实际购买为准</div>
      </div>

      <div class="desc-section">
        <div class="section-title">酒款介绍</div>
        <p class="desc-text">{{ wine.description }}</p>
      </div>

      <div class="action-section">
        <button class="action-btn primary" @click="goToCreateRecord">
          <van-icon name="edit" size="18" />
          <span>记录品鉴</span>
        </button>
        <button class="action-btn secondary" @click="showAddToList = true">
          <van-icon name="star-o" size="18" />
          <span>加入酒单</span>
        </button>
      </div>

      <div class="reviews-section">
        <div class="section-header">
          <div class="section-title">用户品鉴评价</div>
          <div class="section-count">{{ wineReviews.length }} 条评价</div>
        </div>
        <div class="reviews-list">
          <div
            v-for="review in wineReviews"
            :key="review.id"
            class="review-item"
            @click="goToRecord(review.id)"
          >
            <div class="review-header">
              <img :src="review.user.avatar" :alt="review.user.nickname" class="review-avatar" />
              <div class="review-user">
                <div class="review-name">{{ review.user.nickname }}</div>
                <div class="review-time">{{ formatTime(review.createdAt) }}</div>
              </div>
              <div class="review-rating">
                <StarRating :model-value="getAverageRating(review.rating)" readonly size="small" />
              </div>
            </div>
            <div class="review-content">{{ review.description }}</div>
            <div class="review-footer">
              <span class="review-scene">{{ sceneLabel(review.scene) }}</span>
              <span class="review-price">¥{{ review.price }}</span>
            </div>
          </div>
        </div>
        <Empty v-if="wineReviews.length === 0" description="暂无评价，快来成为第一个品鉴者吧~" />
      </div>
    </div>

    <van-loading v-if="loading" class="loading" color="#8B4513" />

    <van-popup v-model:show="showShare" round position="bottom" :style="{ height: '40%' }">
      <div class="share-modal">
        <div class="modal-title">分享到</div>
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

    <van-popup v-model:show="showAddToList" round position="bottom" :style="{ height: '60%' }">
      <div class="add-list-modal">
        <div class="modal-header">
          <div class="modal-title">添加到酒单</div>
          <van-icon name="close" size="22" @click="showAddToList = false" />
        </div>
        <div class="modal-content">
          <div class="list-option" v-for="list in myLists" :key="list.id" @click="addToList(list.id)">
            <img :src="list.coverImage" :alt="list.title" class="list-cover" />
            <div class="list-info">
              <div class="list-title">{{ list.title }}</div>
              <div class="list-count">{{ list.wines.length }} 款酒</div>
            </div>
            <van-icon name="plus" size="20" color="#8B4513" />
          </div>
          <div class="create-new-list" @click="goToCreateList">
            <van-icon name="plus" size="20" />
            <span>创建新酒单</span>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useWineStore, useTastingStore, useWineListStore, useUserStore } from '@/stores'
import { DrinkingSceneLabels, type TastingRating } from '@/types'
import { showToast } from 'vant'
import StarRating from '@/components/StarRating.vue'
import Empty from '@/components/Empty.vue'

const route = useRoute()
const router = useRouter()
const wineStore = useWineStore()
const tastingStore = useTastingStore()
const wineListStore = useWineListStore()
const userStore = useUserStore()

const loading = ref(false)
const showShare = ref(false)
const showAddToList = ref(false)

const wine = computed(() => wineStore.currentWine)
const myLists = computed(() => wineListStore.myWineLists)
const wineReviews = computed(() => {
  if (!wine.value) return []
  return tastingStore.feedRecords.filter(r => r.wineId === wine.value?.id)
})

const wineTypeLabel = computed(() => {
  if (!wine.value) return ''
  const typeMap: Record<string, string> = {
    red: '红葡萄酒',
    white: '白葡萄酒',
    sparkling: '起泡酒',
    dessert: '甜酒',
    whiskey: '威士忌',
    brandy: '白兰地',
    other: '其他'
  }
  return typeMap[wine.value.type] || '其他'
})

const getAverageRating = (rating: TastingRating) => {
  return (rating.color + rating.aroma + rating.taste + rating.finish) / 4
}

const sceneLabel = (scene: string) => {
  return DrinkingSceneLabels[scene as keyof typeof DrinkingSceneLabels] || scene
}

const formatTime = (time: string) => {
  const date = new Date(time)
  return date.toLocaleDateString('zh-CN')
}

const goToCreateRecord = () => {
  if (wine.value) {
    router.push({ path: '/create', query: { wineId: wine.value.id } })
  }
}

const goToRecord = (id: string) => {
  router.push(`/record/${id}`)
}

const goToCreateList = () => {
  showAddToList.value = false
  router.push('/create-list')
}

const addToList = async (listId: string) => {
  if (!wine.value) return
  try {
    await wineListStore.addWineToList(listId, wine.value.id)
    showToast('已添加到酒单')
    showAddToList.value = false
  } catch (e) {
    showToast('添加失败，请重试')
  }
}

onMounted(async () => {
  loading.value = true
  try {
    const wineId = route.params.id as string
    await wineStore.fetchWineById(wineId)
    if (userStore.currentUser) {
      await wineListStore.fetchMyWineLists(userStore.currentUser.id)
    }
    await tastingStore.fetchFeed(1, 20)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.wine-detail-page {
  min-height: 100vh;
  padding-bottom: 100px;
}

.navbar {
  background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%);
}

.navbar :deep(.van-nav-bar__title),
.navbar :deep(.van-nav-bar__arrow) {
  color: #fff !important;
}

.content {
  padding: 16px;
}

.wine-header {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
}

.wine-image {
  width: 140px;
  height: 180px;
  border-radius: 12px;
  object-fit: cover;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.wine-basic {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.wine-type-tag {
  align-self: flex-start;
  padding: 4px 12px;
  background: rgba(139, 69, 19, 0.1);
  color: #8B4513;
  font-size: 12px;
  font-weight: 500;
  border-radius: 12px;
}

.wine-name {
  font-size: 20px;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0;
}

.wine-en {
  font-size: 12px;
  color: #888;
  font-style: italic;
  margin: 0;
}

.wine-origin {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #666;
}

.flag {
  font-size: 14px;
}

.rating-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
  color: #fff;
}

.rating-main {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.rating-score {
  font-size: 40px;
  font-weight: 700;
  line-height: 1;
}

.rating-stars {
  flex: 1;
}

.rating-count {
  font-size: 12px;
  opacity: 0.8;
}

.rating-details {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.rating-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.rating-label {
  width: 40px;
  font-size: 12px;
  opacity: 0.9;
}

.rating-bar {
  flex: 1;
  height: 6px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: #fff;
  border-radius: 3px;
  transition: width 0.5s ease;
}

.price-section {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.price-label {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.price-value {
  font-size: 28px;
  font-weight: 700;
  color: #8B4513;
}

.price-note {
  font-size: 11px;
  color: #999;
  margin-top: 4px;
}

.desc-section {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.section-title {
  font-size: 16px;
  font-weight: 700;
  color: #1a1a2e;
  margin-bottom: 12px;
}

.desc-text {
  font-size: 14px;
  color: #666;
  line-height: 1.7;
  margin: 0;
}

.action-section {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  gap: 12px;
  padding: 12px 16px;
  padding-bottom: calc(12px + env(safe-area-inset-bottom));
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  border-top: 1px solid #eee;
  z-index: 100;
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
}

.action-btn.primary {
  background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%);
  color: #fff;
}

.action-btn.secondary {
  background: rgba(139, 69, 19, 0.1);
  color: #8B4513;
}

.reviews-section {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-count {
  font-size: 12px;
  color: #999;
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.review-item {
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.review-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.review-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.review-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
}

.review-user {
  flex: 1;
}

.review-name {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a2e;
}

.review-time {
  font-size: 11px;
  color: #999;
}

.review-content {
  font-size: 13px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 8px;
}

.review-footer {
  display: flex;
  gap: 12px;
  font-size: 11px;
  color: #999;
}

.review-scene {
  padding: 2px 8px;
  background: rgba(139, 69, 19, 0.1);
  color: #8B4513;
  border-radius: 10px;
}

.loading {
  display: flex;
  justify-content: center;
  padding: 40px;
}

.share-modal,
.add-list-modal {
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

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #eee;
}

.modal-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.list-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  margin-bottom: 12px;
  background: #f8f9fa;
  border-radius: 12px;
}

.list-cover {
  width: 50px;
  height: 50px;
  border-radius: 8px;
  object-fit: cover;
}

.list-info {
  flex: 1;
}

.list-title {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a2e;
}

.list-count {
  font-size: 12px;
  color: #999;
}

.create-new-list {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px;
  border: 2px dashed #8B4513;
  border-radius: 12px;
  color: #8B4513;
  font-size: 14px;
  font-weight: 500;
}
</style>
