<template>
  <div class="achievements-page">
    <van-nav-bar
      title="成就中心"
      left-arrow
      @click-left="onBack"
      class="page-nav"
    />

    <div class="achievement-content">
      <div class="level-header">
        <div class="level-info-main">
          <div class="level-icon">{{ levelInfo?.icon || '🌱' }}</div>
          <div class="level-text">
            <div class="level-title-row">
              <span class="level-number">Lv.{{ currentLevel }}</span>
              <span class="level-name" :style="{ color: levelInfo?.color }">{{ levelInfo?.title || '新手酒客' }}</span>
            </div>
            <div class="exp-bar">
              <div class="exp-fill" :style="{ width: `${Math.round(levelProgress * 100)}%`, background: levelInfo?.color }" />
              <span class="exp-text">
                {{ currentExpInLevel }} / {{ expNeededForLevel }} EXP
              </span>
            </div>
            <div v-if="nextLevelInfo" class="next-level-hint">
              再积累 <strong style="color:#F5A623">{{ remainingExp }}</strong> 经验即可升级到
              <span :style="{ color: nextLevelInfo.color }">{{ nextLevelInfo.title }}</span>
            </div>
          </div>
        </div>
        <div class="level-stats-row">
          <div class="mini-stat">
            <div class="stat-val">{{ unlockedCount }}</div>
            <div class="stat-label">已解锁</div>
          </div>
          <div class="divider" />
          <div class="mini-stat">
            <div class="stat-val">{{ totalCount }}</div>
            <div class="stat-label">成就总数</div>
          </div>
          <div class="divider" />
          <div class="mini-stat">
            <div class="stat-val">{{ completionPercent }}%</div>
            <div class="stat-label">完成度</div>
          </div>
        </div>
      </div>

      <van-tabs
        v-model:active="activeTab"
        class="category-tabs"
        color="#8B4513"
        title-active-color="#8B4513"
        title-inactive-color="rgba(255,255,255,0.6)"
      >
        <van-tab title="全部" name="all">
          <div class="section-list">
            <div v-for="item in allProgressList" :key="item.achievement.id" class="achievement-row">
              <AchievementBadge
                :achievement="item.achievement"
                :unlocked="item.unlocked"
                :progress="item.progress"
                :current="item.current"
                :target="item.target"
                :unlocked-at="item.unlockedAt"
                size="medium"
                :show-progress="!item.unlocked"
                :show-date="item.unlocked"
                @click="openDetail"
              />
            </div>
          </div>
        </van-tab>
        <van-tab title="品鉴" name="tasting">
          <CategorySection
            title="品鉴进度"
            :description="'完成品鉴记录解锁成就'"
            :list="achievementsByCategory.tasting"
            @badge-click="openDetail"
          />
        </van-tab>
        <van-tab title="酒款" name="type">
          <CategorySection
            title="酒款探索"
            :description="'探索不同类型酒款解锁成就'"
            :list="achievementsByCategory.type"
            @badge-click="openDetail"
          />
        </van-tab>
        <van-tab title="酒单" name="list">
          <CategorySection
            title="酒单创建"
            :description="'创建酒单解锁成就'"
            :list="achievementsByCategory.list"
            @badge-click="openDetail"
          />
        </van-tab>
        <van-tab title="社交" name="social">
          <CategorySection
            title="人气值"
            :description="'获得点赞解锁成就'"
            :list="achievementsByCategory.social"
            @badge-click="openDetail"
          />
        </van-tab>
        <van-tab title="产区" name="region">
          <CategorySection
            title="产区打卡"
            :description="'解锁不同产区成就'"
            :list="achievementsByCategory.region"
            @badge-click="openDetail"
          />
        </van-tab>
      </van-tabs>
    </div>

    <van-popup
      v-model:show="showDetail"
      position="bottom"
      round
      class="detail-popup"
    >
      <div v-if="detailItem" class="achievement-detail">
        <div class="detail-hero" :style="{ background: getHeroGradient(detailItem.achievement.rarity) }">
          <div class="detail-icon">{{ detailItem.achievement.icon }}</div>
          <div class="detail-rarity" :class="detailItem.achievement.rarity">{{ rarityText(detailItem.achievement.rarity) }}</div>
        </div>
        <div class="detail-body">
          <div class="detail-title">{{ detailItem.achievement.name }}</div>
          <div class="detail-desc">{{ detailItem.achievement.description }}</div>
          <div class="progress-section">
            <div class="progress-label-row">
              <span class="progress-title">完成进度</span>
              <span class="progress-val">{{ detailItem.current }} / {{ detailItem.target }}</span>
            </div>
            <div class="detail-progress">
              <div
                class="detail-progress-fill"
                :style="{
                  width: `${Math.round(detailItem.progress * 100)}%`,
                  background: detailItem.unlocked ? '#27AE60' : '#8B4513'
                }"
              />
            </div>
          </div>
          <div v-if="detailItem.unlocked && detailItem.unlockedAt" class="unlock-info">
            <Award :size="16" color="#F5A623" />
            <span>{{ formatDate(detailItem.unlockedAt) }} 解锁</span>
          </div>
          <div v-if="!detailItem.unlocked" class="unlock-tip">
            <Target :size="16" color="#F5A623" />
            <span>还差 {{ detailItem.target - detailItem.current }} 即可解锁</span>
          </div>
        </div>
      </div>
    </van-popup>

    <van-loading v-if="loading" class="page-loading" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAchievementStore, useUserStore } from '@/stores'
import { showToast } from 'vant'
import AchievementBadge from '@/components/AchievementBadge.vue'
import CategorySection from './_AchievementCategory.vue'
import { Award, Target } from 'lucide-vue-next'
import type { AchievementProgress, Achievement } from '@/types'

const router = useRouter()
const achievementStore = useAchievementStore()
const userStore = useUserStore()

const activeTab = ref('all')
const showDetail = ref(false)
const detailItem = ref<AchievementProgress | null>(null)

const loading = computed(() => achievementStore.loading)
const levelInfo = computed(() => achievementStore.currentLevelInfo)
const nextLevelInfo = computed(() => achievementStore.nextLevelInfo)
const currentLevel = computed(() => achievementStore.userProgress?.currentLevel || 1)
const levelProgress = computed(() => achievementStore.levelProgress)
const currentExpInLevel = computed(() => {
  if (!achievementStore.userProgress || !levelInfo.value) return 0
  return achievementStore.userProgress.currentExp - levelInfo.value.minExp
})
const expNeededForLevel = computed(() => {
  if (!levelInfo.value) return 100
  return levelInfo.value.maxExp - levelInfo.value.minExp
})
const remainingExp = computed(() => {
  if (!achievementStore.userProgress || !nextLevelInfo.value) return 0
  return nextLevelInfo.value.minExp - achievementStore.userProgress.currentExp
})

const unlockedCount = computed(() => achievementStore.unlockedCount)
const totalCount = computed(() => achievementStore.totalCount)
const completionPercent = computed(() => {
  if (totalCount.value === 0) return 0
  return Math.round((unlockedCount.value / totalCount.value) * 100)
})
const allProgressList = computed(() => {
  const list = [...achievementStore.achievementProgress]
  list.sort((a, b) => {
    if (a.unlocked !== b.unlocked) return a.unlocked ? -1 : 1
    if (a.progress !== b.progress) return b.progress - a.progress
    return a.achievement.condition.target - b.achievement.condition.target
  })
  return list
})
const achievementsByCategory = computed(() => achievementStore.achievementsByCategory)

const rarityText = (rarity: string) => {
  const map: Record<string, string> = {
    common: '普通',
    rare: '稀有',
    epic: '史诗',
    legendary: '传说'
  }
  return map[rarity] || rarity
}

const getHeroGradient = (rarity: string) => {
  const map: Record<string, string> = {
    common: 'linear-gradient(135deg, #95A5A6 0%, #7F8C8D 100%)',
    rare: 'linear-gradient(135deg, #3498DB 0%, #2980B9 100%)',
    epic: 'linear-gradient(135deg, #9B59B6 0%, #8E44AD 100%)',
    legendary: 'linear-gradient(135deg, #F1C40F 0%, #F39C12 100%)'
  }
  return map[rarity] || map.common
}

const formatDate = (iso: string) => {
  const d = new Date(iso)
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
}

const openDetail = (achievement: Achievement) => {
  const item = achievementStore.achievementProgress.find(p => p.achievement.id === achievement.id)
  if (item) {
    detailItem.value = item
    showDetail.value = true
  }
}

const onBack = () => {
  router.back()
}

onMounted(async () => {
  if (!userStore.currentUser) {
    showToast('请先登录')
    router.back()
    return
  }
  try {
    await achievementStore.loadAllForUser(userStore.currentUser.id)
  } catch (e) {
    console.error(e)
    showToast('加载失败')
  }
})
</script>

<style scoped>
.achievements-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
  padding-bottom: env(safe-area-inset-bottom);
}

.page-nav {
  background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%);
}

:deep(.van-nav-bar__content) {
  background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%);
}

:deep(.van-nav-bar__title),
:deep(.van-icon-arrow-left) {
  color: #fff;
}

.achievement-content {
  padding: 16px;
}

.level-header {
  background: linear-gradient(135deg, rgba(139, 69, 19, 0.3) 0%, rgba(245, 166, 35, 0.15) 100%);
  border: 1px solid rgba(245, 166, 35, 0.2);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
}

.level-info-main {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.level-icon {
  font-size: 48px;
  line-height: 1;
  flex-shrink: 0;
}

.level-text {
  flex: 1;
  min-width: 0;
}

.level-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.level-number {
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  background: rgba(245, 166, 35, 0.2);
  padding: 2px 10px;
  border-radius: 8px;
}

.level-name {
  font-size: 18px;
  font-weight: 700;
}

.exp-bar {
  position: relative;
  height: 18px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 9px;
  overflow: hidden;
  margin-bottom: 8px;
}

.exp-fill {
  height: 100%;
  border-radius: 9px;
  transition: width 0.6s ease;
}

.exp-text {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 600;
  color: #fff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.next-level-hint {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}

.level-stats-row {
  display: flex;
  align-items: center;
  justify-content: space-around;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  padding: 12px;
}

.mini-stat {
  flex: 1;
  text-align: center;
}

.stat-val {
  font-size: 18px;
  font-weight: 700;
  color: #F5A623;
  margin-bottom: 2px;
}

.stat-label {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
}

.divider {
  width: 1px;
  height: 24px;
  background: rgba(255, 255, 255, 0.1);
}

.category-tabs {
  background: transparent;
}

:deep(.van-tabs__wrap) {
  background: transparent;
}

:deep(.van-tabs__nav) {
  background: transparent;
  padding: 0 8px;
}

.section-list {
  padding-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.achievement-row {
  animation: fadeInUp 0.3s ease both;
}

.achievement-row:nth-child(1) { animation-delay: 0.02s; }
.achievement-row:nth-child(2) { animation-delay: 0.04s; }
.achievement-row:nth-child(3) { animation-delay: 0.06s; }
.achievement-row:nth-child(4) { animation-delay: 0.08s; }
.achievement-row:nth-child(5) { animation-delay: 0.10s; }

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.page-loading {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  background: rgba(0, 0, 0, 0.4);
}

.detail-popup {
  background: transparent;
  overflow: hidden;
}

.achievement-detail {
  background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 24px 24px 0 0;
  padding-bottom: env(safe-area-inset-bottom);
  overflow: hidden;
}

.detail-hero {
  padding: 32px 24px;
  text-align: center;
  position: relative;
}

.detail-icon {
  font-size: 72px;
  line-height: 1;
  margin-bottom: 12px;
}

.detail-rarity {
  display: inline-block;
  font-size: 12px;
  font-weight: 600;
  color: #fff;
  padding: 4px 12px;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.2);
}

.detail-body {
  padding: 24px;
  background: #16213e;
}

.detail-title {
  font-size: 22px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 8px;
}

.detail-desc {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 24px;
  line-height: 1.6;
}

.progress-section {
  margin-bottom: 16px;
}

.progress-label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.progress-title {
  font-size: 13px;
  font-weight: 600;
  color: #fff;
}

.progress-val {
  font-size: 13px;
  color: #F5A623;
  font-weight: 600;
}

.unlock-info,
.unlock-tip {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 14px;
  background: rgba(245, 166, 35, 0.1);
  border-radius: 10px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
}

.detail-progress {
  position: relative;
  height: 10px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 5px;
  overflow: hidden;
}

.detail-progress-fill {
  height: 100%;
  border-radius: 5px;
  transition: width 0.6s ease;
}
</style>
