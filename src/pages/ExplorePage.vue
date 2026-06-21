<template>
  <div class="explore-page">
    <div class="header">
      <div class="header-content">
        <div class="header-title">发现好酒</div>
        <div class="search-bar" @click="goToSearch">
          <van-icon name="search" size="16" color="#999" />
          <span class="search-placeholder">搜索酒款、产区、品种...</span>
        </div>
      </div>
    </div>
    
    <div class="content">
      <van-tabs v-model:active="activeTab" class="tabs" sticky offset-top="140">
        <van-tab title="分类">
          <div class="tab-content">
            <div class="section">
              <div class="section-title">按产区浏览</div>
              <div class="region-grid">
                <div
                  v-for="region in regions"
                  :key="region"
                  class="region-item"
                  @click="filterByRegion(region)"
                >
                  <div class="region-flag">{{ regionFlags[region] || '🍷' }}</div>
                  <div class="region-name">{{ region }}</div>
                </div>
              </div>
            </div>
            
            <div class="section">
              <div class="section-title">按类型浏览</div>
              <div class="type-grid">
                <div
                  v-for="(label, key) in wineTypes"
                  :key="key"
                  class="type-item"
                  @click="filterByType(key as Wine['type'])"
                >
                  <div class="type-icon">{{ typeIcons[key as Wine['type']] }}</div>
                  <div class="type-label">{{ label }}</div>
                </div>
              </div>
            </div>
            
            <div class="section">
              <div class="section-title">按品种浏览</div>
              <div class="variety-list">
                <van-tag
                  v-for="variety in varieties"
                  :key="variety"
                  type="primary"
                  plain
                  round
                  class="variety-tag"
                  @click="filterByVariety(variety)"
                >
                  {{ variety }}
                </van-tag>
              </div>
            </div>
          </div>
        </van-tab>
        
        <van-tab title="排行榜">
          <div class="tab-content">
            <div class="section">
              <div class="section-header">
                <div class="section-title">
                  <van-icon name="fire-o" size="18" color="#ff6b6b" />
                  热门酒款榜
                </div>
                <div class="section-sub">基于用户品鉴数据</div>
              </div>
              <div class="ranking-list">
                <div
                  v-for="(wine, index) in popularWines"
                  :key="wine.id"
                  class="ranking-item"
                  @click="goToWineDetail(wine.id)"
                >
                  <div class="ranking-number" :class="`rank-${index + 1}`">{{ index + 1 }}</div>
                  <img :src="wine.image" :alt="wine.name" class="ranking-image" />
                  <div class="ranking-info">
                    <div class="ranking-name">{{ wine.name }}</div>
                    <div class="ranking-meta">{{ wine.country }} · {{ wine.region }}</div>
                    <div class="ranking-stats">
                      <StarRating :model-value="wine.rating" readonly show-value />
                      <span class="tasting-count">{{ wine.tastingCount }} 人品鉴</span>
                    </div>
                  </div>
                  <div class="ranking-price">¥{{ wine.price }}</div>
                </div>
              </div>
            </div>
            
            <div class="section">
              <div class="section-header">
                <div class="section-title">
                  <van-icon name="star-o" size="18" color="#f5a623" />
                  高分好评榜
                </div>
                <div class="section-sub">综合评分最高</div>
              </div>
              <div class="ranking-list">
                <div
                  v-for="(wine, index) in topRatedWines"
                  :key="wine.id"
                  class="ranking-item"
                  @click="goToWineDetail(wine.id)"
                >
                  <div class="ranking-number" :class="`rank-${index + 1}`">{{ index + 1 }}</div>
                  <img :src="wine.image" :alt="wine.name" class="ranking-image" />
                  <div class="ranking-info">
                    <div class="ranking-name">{{ wine.name }}</div>
                    <div class="ranking-meta">{{ wine.country }} · {{ wine.region }}</div>
                    <div class="ranking-stats">
                      <StarRating :model-value="wine.rating" readonly show-value />
                      <span class="tasting-count">{{ wine.tastingCount }} 人品鉴</span>
                    </div>
                  </div>
                  <div class="ranking-price">¥{{ wine.price }}</div>
                </div>
              </div>
            </div>
          </div>
        </van-tab>
        
        <van-tab title="评价">
          <div class="tab-content">
            <div class="section">
              <div class="section-title">用户真实评价</div>
              <div class="reviews-list">
                <div
                  v-for="record in latestRecords"
                  :key="record.id"
                  class="review-item"
                  @click="goToRecordDetail(record.id)"
                >
                  <div class="review-header">
                    <img :src="record.user.avatar" :alt="record.user.nickname" class="review-avatar" />
                    <div class="review-user">
                      <div class="review-nickname">{{ record.user.nickname }}</div>
                      <div class="review-time">{{ formatTime(record.createdAt) }}</div>
                    </div>
                    <van-tag type="primary" plain>{{ DrinkingSceneLabels[record.scene] }}</van-tag>
                  </div>
                  <div class="review-wine" @click.stop="goToWineDetail(record.wine.id)">
                    <img :src="record.wine.image" :alt="record.wine.name" class="review-wine-image" />
                    <div class="review-wine-info">
                      <div class="review-wine-name">{{ record.wine.name }}</div>
                      <div class="review-wine-meta">{{ record.wine.country }} · {{ record.wine.region }}</div>
                    </div>
                  </div>
                  <div class="review-rating">
                    <div class="rating-mini">
                      <span class="label">色泽</span>
                      <StarRating :model-value="record.rating.color" readonly size="small" />
                    </div>
                    <div class="rating-mini">
                      <span class="label">闻香</span>
                      <StarRating :model-value="record.rating.aroma" readonly size="small" />
                    </div>
                    <div class="rating-mini">
                      <span class="label">口感</span>
                      <StarRating :model-value="record.rating.taste" readonly size="small" />
                    </div>
                    <div class="rating-mini">
                      <span class="label">余味</span>
                      <StarRating :model-value="record.rating.finish" readonly size="small" />
                    </div>
                  </div>
                  <div class="review-content">{{ record.description }}</div>
                  <div class="review-actions">
                    <div class="action-item" @click.stop="handleLike(record.id)">
                      <van-icon :name="record.isLiked ? 'like' : 'like-o'" :color="record.isLiked ? '#ff6b6b' : '#999'" size="16" />
                      <span :class="{ liked: record.isLiked }">{{ record.likes }}</span>
                    </div>
                    <div class="action-item">
                      <van-icon name="chat-o" color="#999" size="16" />
                      <span>{{ record.commentsCount }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </van-tab>
      </van-tabs>
    </div>
    
    <van-popup
      v-model:show="showFilterResult"
      round
      :style="{ height: '90%' }"
    >
      <div class="filter-result-modal">
        <div class="modal-header">
          <div class="modal-title">{{ filterTitle }}</div>
          <van-icon name="close" size="22" @click="showFilterResult = false" />
        </div>
        <div class="modal-content">
          <div class="wine-grid">
            <WineCard
              v-for="wine in filteredWines"
              :key="wine.id"
              :wine="wine"
            />
          </div>
          <Empty v-if="filteredWines.length === 0" description="暂无相关酒款" />
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useWineStore, useTastingStore } from '@/stores'
import type { Wine, TastingRecord } from '@/types'
import { DrinkingSceneLabels } from '@/types'
import StarRating from '@/components/StarRating.vue'
import WineCard from '@/components/WineCard.vue'
import Empty from '@/components/Empty.vue'

const router = useRouter()
const wineStore = useWineStore()
const tastingStore = useTastingStore()

const activeTab = ref(0)
const showFilterResult = ref(false)
const filterTitle = ref('')
const filteredWines = ref<Wine[]>([])

const regions = ['波尔多', '勃艮第', '香槟区', '托斯卡纳', '巴罗萨谷', '马尔堡', '斯佩塞德', '大阪', '烟台']
const regionFlags: Record<string, string> = {
  '波尔多': '🇫🇷',
  '勃艮第': '🇫🇷',
  '香槟区': '🇫🇷',
  '托斯卡纳': '🇮🇹',
  '巴罗萨谷': '🇦🇺',
  '马尔堡': '🇳🇿',
  '斯佩塞德': '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
  '大阪': '🇯🇵',
  '烟台': '🇨🇳'
}

const wineTypes: Record<string, string> = {
  red: '红葡萄酒',
  white: '白葡萄酒',
  sparkling: '起泡酒',
  dessert: '甜酒',
  whiskey: '威士忌',
  brandy: '白兰地'
}

const typeIcons: Record<string, string> = {
  red: '🍷',
  white: '🥂',
  sparkling: '🍾',
  dessert: '🍯',
  whiskey: '🥃',
  brandy: '🍶'
}

const varieties = ['赤霞珠', '梅洛', '黑皮诺', '霞多丽', '长相思', '西拉', '桑娇维塞', '单一麦芽']

const popularWines = computed(() => wineStore.popularWines)
const topRatedWines = computed(() => wineStore.topRatedWines)
const latestRecords = computed(() => tastingStore.feedRecords.slice(0, 5))

const filterByRegion = async (region: string) => {
  filterTitle.value = `${region}产区酒款`
  filteredWines.value = await wineStore.searchWines(region)
  showFilterResult.value = true
}

const filterByType = async (type: Wine['type']) => {
  filterTitle.value = wineTypes[type]
  const result = await wineStore.fetchWines({ type })
  filteredWines.value = result.wines
  showFilterResult.value = true
}

const filterByVariety = async (variety: string) => {
  filterTitle.value = `${variety}酒款`
  filteredWines.value = await wineStore.searchWines(variety)
  showFilterResult.value = true
}

const formatTime = (dateStr: string) => {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / 86400000)
  if (days < 7) return `${days}天前`
  return date.toLocaleDateString('zh-CN')
}

const goToSearch = () => {
  router.push('/search-wine')
}

const goToWineDetail = (id: string) => {
  router.push(`/wine/${id}`)
}

const goToRecordDetail = (id: string) => {
  router.push(`/record/${id}`)
}

const handleLike = (id: string) => {
  tastingStore.likeRecord(id)
}

onMounted(async () => {
  await Promise.all([
    wineStore.fetchPopularWines(10),
    wineStore.fetchTopRatedWines(10),
    tastingStore.fetchFeed(1, 10)
  ])
})
</script>

<style scoped>
.explore-page {
  min-height: 100vh;
  padding-bottom: 80px;
}

.header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%);
  padding: 12px 16px;
  padding-top: calc(12px + env(safe-area-inset-top));
}

.header-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.header-title {
  font-size: 22px;
  font-weight: 700;
  color: #fff;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 25px;
}

.search-placeholder {
  font-size: 14px;
  color: #999;
}

.content {
  padding: 0 16px;
}

:deep(.tabs) {
  background: transparent;
}

:deep(.van-tabs__wrap) {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  margin: 16px 0;
}

:deep(.van-tabs__nav) {
  background: transparent;
}

:deep(.van-tab--active) {
  color: #8B4513;
  font-weight: 600;
}

:deep(.van-tabs__line) {
  background: #8B4513;
}

.tab-content {
  padding-bottom: 16px;
}

.section {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 16px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 700;
  color: #1a1a2e;
  margin-bottom: 16px;
}

.section-header .section-title {
  margin-bottom: 0;
}

.section-sub {
  font-size: 12px;
  color: #999;
}

.region-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.region-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 16px 8px;
  background: #f8f9fa;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.region-item:active {
  transform: scale(0.95);
  background: rgba(139, 69, 19, 0.1);
}

.region-flag {
  font-size: 28px;
}

.region-name {
  font-size: 12px;
  font-weight: 500;
  color: #333;
  text-align: center;
}

.type-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.type-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 16px 8px;
  background: #f8f9fa;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.type-item:active {
  transform: scale(0.95);
  background: rgba(139, 69, 19, 0.1);
}

.type-icon {
  font-size: 28px;
}

.type-label {
  font-size: 12px;
  font-weight: 500;
  color: #333;
}

.variety-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.variety-tag {
  font-size: 13px;
  padding: 6px 14px;
}

.ranking-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ranking-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 12px;
}

.ranking-number {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  color: #999;
  background: #eee;
  border-radius: 6px;
}

.ranking-number.rank-1 {
  background: linear-gradient(135deg, #ffd700, #ffb700);
  color: #fff;
}

.ranking-number.rank-2 {
  background: linear-gradient(135deg, #c0c0c0, #a0a0a0);
  color: #fff;
}

.ranking-number.rank-3 {
  background: linear-gradient(135deg, #cd7f32, #b87333);
  color: #fff;
}

.ranking-image {
  width: 50px;
  height: 65px;
  border-radius: 8px;
  object-fit: cover;
}

.ranking-info {
  flex: 1;
  min-width: 0;
}

.ranking-name {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a2e;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ranking-meta {
  font-size: 11px;
  color: #888;
  margin: 2px 0 4px;
}

.ranking-stats {
  display: flex;
  align-items: center;
  gap: 10px;
}

.tasting-count {
  font-size: 11px;
  color: #999;
}

.ranking-price {
  font-size: 16px;
  font-weight: 700;
  color: #8B4513;
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.review-item {
  padding: 16px;
  background: #f8f9fa;
  border-radius: 12px;
}

.review-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
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

.review-nickname {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a2e;
}

.review-time {
  font-size: 11px;
  color: #999;
  margin-top: 2px;
}

.review-wine {
  display: flex;
  gap: 10px;
  padding: 10px;
  background: #fff;
  border-radius: 8px;
  margin-bottom: 12px;
}

.review-wine-image {
  width: 40px;
  height: 52px;
  border-radius: 6px;
  object-fit: cover;
}

.review-wine-info {
  flex: 1;
}

.review-wine-name {
  font-size: 13px;
  font-weight: 600;
  color: #1a1a2e;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.review-wine-meta {
  font-size: 11px;
  color: #888;
  margin-top: 2px;
}

.review-rating {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-bottom: 12px;
}

.rating-mini {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
}

.rating-mini .label {
  width: 28px;
  color: #666;
}

.review-content {
  font-size: 13px;
  color: #333;
  line-height: 1.6;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.review-actions {
  display: flex;
  gap: 24px;
  padding-top: 12px;
  border-top: 1px solid #e9ecef;
}

.action-item {
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

.filter-result-modal {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #eee;
}

.modal-title {
  font-size: 18px;
  font-weight: 700;
  color: #1a1a2e;
}

.modal-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.wine-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}
</style>
