<template>
  <div class="profile-page">
    <div class="header">
      <div class="header-bg"></div>
      <div class="header-content">
        <img :src="user?.avatar" :alt="user?.nickname" class="avatar" />
        <div class="user-info">
          <div class="nickname">{{ user?.nickname }}</div>
          <div class="bio">{{ user?.bio }}</div>
        </div>
        <van-icon name="setting-o" size="22" color="#fff" class="settings" />
      </div>
      
      <div class="stats-row">
        <div class="stat-item">
          <div class="stat-value">{{ statsStore.totalTastingsCount }}</div>
          <div class="stat-label">品鉴酒款</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ statsStore.regionsVisited }}</div>
          <div class="stat-label">产区打卡</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ statsStore.countriesVisited }}</div>
          <div class="stat-label">国家足迹</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ user?.followersCount || 0 }}</div>
          <div class="stat-label">粉丝</div>
        </div>
      </div>
    </div>
    
    <div class="content">
      <div class="section">
        <div class="section-header">
          <div class="section-title">
            <van-icon name="location-o" size="18" color="#8B4513" />
            产区地图
          </div>
          <div class="section-action" @click="showMap = true">查看完整地图</div>
        </div>
        <div class="region-map">
          <div class="map-placeholder" @click="showMap = true">
            <div class="map-icon">🗺️</div>
            <div class="map-text">已品鉴 {{ statsStore.regionsVisited }} 个产区</div>
            <div class="map-hint">点击查看产区分布地图</div>
          </div>
          <div class="region-list">
            <div
              v-for="region in userRegions"
              :key="region.region"
              class="region-tag"
            >
              <span class="region-name">{{ region.region }}</span>
              <span class="region-count">{{ region.count }}款</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="section">
        <div class="section-header">
          <div class="section-title">
            <van-icon name="notes-o" size="18" color="#8B4513" />
            我的品鉴记录
          </div>
          <div class="section-action">查看全部</div>
        </div>
        <div class="records-grid">
          <div
            v-for="record in myRecords.slice(0, 6)"
            :key="record.id"
            class="record-item"
            @click="goToRecord(record.id)"
          >
            <img :src="record.wine.image" :alt="record.wine.name" class="record-wine-image" />
            <div class="record-overlay">
              <StarRating v-model="getAverageRating(record.rating)" readonly size="small" />
            </div>
          </div>
        </div>
        <Empty v-if="myRecords.length === 0" description="还没有品鉴记录，快去记录吧~" />
      </div>
      
      <div class="section">
        <div class="section-header">
          <div class="section-title">
            <van-icon name="star-o" size="18" color="#8B4513" />
            我的酒单
          </div>
          <div class="section-action" @click="$router.push('/lists')">查看全部</div>
        </div>
        <div class="wine-lists">
          <WineListCard
            v-for="list in myLists.slice(0, 3)"
            :key="list.id"
            :list="list"
          />
        </div>
        <div class="create-list-btn" @click="goToCreateList">
          <van-icon name="plus" size="18" />
          <span>创建新酒单</span>
        </div>
      </div>
    </div>
    
    <van-popup
      v-model:show="showMap"
      round
      :style="{ height: '85%' }"
    >
      <div class="map-modal">
        <div class="modal-header">
          <div class="modal-title">我的产区地图</div>
          <van-icon name="close" size="22" @click="showMap = false" />
        </div>
        <div class="modal-content">
          <div class="world-map">
            <div class="map-container">
              <div
                v-for="region in allRegions"
                :key="region.region"
                class="map-point"
                :class="{ visited: isRegionVisited(region.region) }"
                :style="getMapPointStyle(region)"
                :title="`${region.region} - ${isRegionVisited(region.region) ? getRegionCount(region.region) + '款' : '未访问'}`"
              >
                <div class="point-dot"></div>
                <div class="point-label">{{ region.region }}</div>
              </div>
            </div>
            <div class="map-legend">
              <div class="legend-item">
                <span class="legend-dot visited"></span>
                <span>已品鉴</span>
              </div>
              <div class="legend-item">
                <span class="legend-dot"></span>
                <span>待探索</span>
              </div>
            </div>
          </div>
          <div class="visited-regions">
            <div class="visited-title">已访问产区</div>
            <div class="visited-list">
              <div
                v-for="region in userRegions"
                :key="region.region"
                class="visited-item"
              >
                <span class="visited-flag">📍</span>
                <span class="visited-name">{{ region.region }}</span>
                <span class="visited-country">{{ region.country }}</span>
                <span class="visited-count">{{ region.count }} 款酒</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore, useTastingStore, useWineListStore, useStatsStore } from '@/stores'
import { regionStats } from '@/mock'
import type { TastingRating } from '@/types'
import StarRating from '@/components/StarRating.vue'
import WineListCard from '@/components/WineListCard.vue'
import Empty from '@/components/Empty.vue'

const router = useRouter()
const userStore = useUserStore()
const tastingStore = useTastingStore()
const wineListStore = useWineListStore()
const statsStore = useStatsStore()

const showMap = ref(false)
const user = computed(() => userStore.currentUser)
const myRecords = computed(() => tastingStore.myRecords)
const myLists = computed(() => wineListStore.myWineLists)
const allRegions = ref(regionStats)
const userRegions = computed(() => statsStore.userStats?.regions || [])

const getAverageRating = (rating: TastingRating) => {
  return (rating.color + rating.aroma + rating.taste + rating.finish) / 4
}

const isRegionVisited = (region: string) => {
  return userRegions.value.some(r => r.region === region)
}

const getRegionCount = (region: string) => {
  return userRegions.value.find(r => r.region === region)?.count || 0
}

const getMapPointStyle = (region: typeof regionStats[0]) => {
  const x = ((region.lng + 180) / 360) * 100
  const y = ((90 - region.lat) / 180) * 100
  return {
    left: `${x}%`,
    top: `${y}%`
  }
}

const goToRecord = (id: string) => {
  router.push(`/record/${id}`)
}

const goToCreateList = () => {
  router.push('/create-list')
}

onMounted(async () => {
  if (user.value) {
    await Promise.all([
      tastingStore.fetchMyRecords(user.value.id),
      wineListStore.fetchMyWineLists(user.value.id),
      statsStore.fetchUserStats(user.value.id)
    ])
  }
})
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  padding-bottom: 80px;
}

.header {
  position: relative;
  padding: 20px 16px;
  padding-top: calc(20px + env(safe-area-inset-top));
  margin-bottom: 16px;
}

.header-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 200px;
  background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%);
  z-index: -1;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.avatar {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  border: 3px solid rgba(255, 255, 255, 0.3);
  object-fit: cover;
}

.user-info {
  flex: 1;
}

.nickname {
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 4px;
}

.bio {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.4;
}

.settings {
  padding: 8px;
}

.stats-row {
  display: flex;
  justify-content: space-around;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 16px 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 22px;
  font-weight: 700;
  color: #8B4513;
}

.stat-label {
  font-size: 11px;
  color: #666;
  margin-top: 4px;
}

.content {
  padding: 0 16px;
}

.section {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 700;
  color: #1a1a2e;
}

.section-action {
  font-size: 13px;
  color: #8B4513;
}

.region-map {
  margin-bottom: 16px;
}

.map-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: #fff;
  margin-bottom: 16px;
}

.map-icon {
  font-size: 48px;
  margin-bottom: 8px;
}

.map-text {
  font-size: 18px;
  font-weight: 700;
}

.map-hint {
  font-size: 12px;
  opacity: 0.8;
  margin-top: 4px;
}

.region-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.region-tag {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: rgba(139, 69, 19, 0.1);
  border-radius: 20px;
  font-size: 12px;
}

.region-name {
  color: #8B4513;
  font-weight: 500;
}

.region-count {
  color: #999;
}

.records-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.record-item {
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  aspect-ratio: 3/4;
}

.record-wine-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.record-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 8px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
}

.wine-lists {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 12px;
}

.create-list-btn {
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
  background: rgba(139, 69, 19, 0.05);
}

.map-modal {
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

.world-map {
  margin-bottom: 24px;
}

.map-container {
  position: relative;
  width: 100%;
  padding-top: 56.25%;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 12px;
  overflow: hidden;
}

.map-point {
  position: absolute;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  z-index: 1;
}

.point-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
}

.map-point.visited .point-dot {
  background: #8B4513;
  box-shadow: 0 0 10px rgba(139, 69, 19, 0.6);
}

.point-label {
  font-size: 8px;
  color: rgba(255, 255, 255, 0.5);
  white-space: nowrap;
}

.map-point.visited .point-label {
  color: #fff;
  font-weight: 500;
}

.map-legend {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-top: 12px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #666;
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  border: 1px solid #999;
}

.legend-dot.visited {
  background: #8B4513;
  border-color: #8B4513;
}

.visited-title {
  font-size: 16px;
  font-weight: 700;
  color: #1a1a2e;
  margin-bottom: 12px;
}

.visited-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.visited-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 10px;
}

.visited-flag {
  font-size: 18px;
}

.visited-name {
  flex: 1;
  font-size: 14px;
  font-weight: 600;
  color: #1a1a2e;
}

.visited-country {
  font-size: 12px;
  color: #888;
}

.visited-count {
  font-size: 12px;
  color: #8B4513;
  font-weight: 600;
}
</style>
