<template>
  <div class="user-profile-page">
    <van-nav-bar
      title="用户主页"
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

    <div v-if="user" class="content">
      <div class="header">
        <div class="header-bg"></div>
        <div class="header-content">
          <img :src="user.avatar" :alt="user.nickname" class="avatar" />
          <div class="user-info">
            <div class="nickname">{{ user.nickname }}</div>
            <div class="bio">{{ user.bio }}</div>
          </div>
        </div>
        
        <div class="stats-row">
          <div class="stat-item">
            <div class="stat-value">{{ user.tastingCount }}</div>
            <div class="stat-label">品鉴酒款</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ regionsVisited }}</div>
            <div class="stat-label">产区打卡</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ user.followingCount }}</div>
            <div class="stat-label">关注</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ user.followersCount }}</div>
            <div class="stat-label">粉丝</div>
          </div>
        </div>

        <div class="action-row">
          <button 
            class="follow-btn" 
            :class="{ followed: isFollowing }"
            @click="handleFollow"
          >
            <van-icon :name="isFollowing ? 'success' : 'plus'" size="16" />
            <span>{{ isFollowing ? '已关注' : '+ 关注' }}</span>
          </button>
          <button class="message-btn">
            <van-icon name="chat-o" size="16" />
            <span>私信</span>
          </button>
        </div>
      </div>
      
      <div class="tabs-container">
        <van-tabs v-model:active="activeTab" class="tabs" sticky offset-top="0">
          <van-tab title="品鉴记录" name="records">
            <div class="records-grid">
              <div
                v-for="record in userRecords"
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
            <Empty v-if="userRecords.length === 0" description="TA还没有品鉴记录~" />
          </van-tab>
          <van-tab title="TA的酒单" name="lists">
            <div class="wine-lists">
              <WineListCard
                v-for="list in userLists"
                :key="list.id"
                :list="list"
              />
            </div>
            <Empty v-if="userLists.length === 0" description="TA还没有创建酒单~" />
          </van-tab>
        </van-tabs>
      </div>
    </div>

    <van-loading v-if="loading" class="loading" color="#8B4513" />

    <van-popup v-model:show="showMore" round position="bottom" :style="{ height: '35%' }">
      <div class="more-modal">
        <div class="more-option" @click="handleReport">
          <van-icon name="warning-o" size="20" color="#666" />
          <span>举报用户</span>
        </div>
        <div class="more-option" @click="handleBlock">
          <van-icon name="delete-o" size="20" color="#666" />
          <span>屏蔽用户</span>
        </div>
        <div class="more-option cancel" @click="showMore = false">
          <span>取消</span>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore, useTastingStore, useWineListStore, useStatsStore } from '@/stores'
import { regionStats } from '@/mock'
import type { TastingRating } from '@/types'
import { showToast } from 'vant'
import StarRating from '@/components/StarRating.vue'
import WineListCard from '@/components/WineListCard.vue'
import Empty from '@/components/Empty.vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const tastingStore = useTastingStore()
const wineListStore = useWineListStore()
const statsStore = useStatsStore()

const loading = ref(false)
const activeTab = ref('records')
const showMore = ref(false)
const isFollowing = ref(false)
const user = ref<typeof userStore.currentUser>(null)
const userRecords = ref<typeof tastingStore.myRecords>([])
const userLists = ref<typeof wineListStore.myWineLists>([])

const regionsVisited = computed(() => statsStore.userStats?.regions.length || 0)

const getAverageRating = (rating: TastingRating) => {
  return (rating.color + rating.aroma + rating.taste + rating.finish) / 4
}

const goToRecord = (id: string) => {
  router.push(`/record/${id}`)
}

const handleFollow = async () => {
  if (!user.value) return
  try {
    if (isFollowing.value) {
      await userStore.unfollowUser(user.value.id)
      isFollowing.value = false
      showToast('已取消关注')
    } else {
      await userStore.followUser(user.value.id)
      isFollowing.value = true
      showToast('关注成功')
    }
  } catch (e) {
    showToast('操作失败')
  }
}

const handleReport = () => {
  showMore.value = false
  showToast('举报已提交')
}

const handleBlock = () => {
  showMore.value = false
  showToast('已屏蔽该用户')
}

onMounted(async () => {
  loading.value = true
  try {
    const userId = route.params.id as string
    const [userData, records, lists, stats] = await Promise.all([
      userApi.getUserById(userId),
      tastingStore.fetchMyRecords(userId),
      wineListStore.fetchMyWineLists(userId),
      statsStore.fetchUserStats(userId)
    ])
    user.value = userData
    userRecords.value = records
    userLists.value = lists
    isFollowing.value = Math.random() > 0.5
  } finally {
    loading.value = false
  }
})
</script>

<script lang="ts">
import { userApi } from '@/api'
export default {}
</script>

<style scoped>
.user-profile-page {
  min-height: 100vh;
  padding-bottom: 80px;
}

.navbar {
  background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%);
}

.navbar :deep(.van-nav-bar__title),
.navbar :deep(.van-nav-bar__arrow) {
  color: #fff !important;
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
  height: 220px;
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

.stats-row {
  display: flex;
  justify-content: space-around;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 16px 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin-bottom: 12px;
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

.action-row {
  display: flex;
  gap: 12px;
}

.follow-btn,
.message-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 12px;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
}

.follow-btn {
  background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%);
  color: #fff;
}

.follow-btn.followed {
  background: rgba(139, 69, 19, 0.1);
  color: #8B4513;
}

.message-btn {
  background: rgba(255, 255, 255, 0.95);
  color: #8B4513;
}

.tabs-container {
  padding: 0 16px;
}

.tabs {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px 16px 0 0;
}

.tabs :deep(.van-tabs__nav) {
  border-radius: 16px 16px 0 0;
}

.tabs :deep(.van-tab--active) {
  color: #8B4513 !important;
  font-weight: 600;
}

.tabs :deep(.van-tabs__line) {
  background: #8B4513 !important;
}

.records-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 0 0 16px 16px;
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
  padding: 16px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 0 0 16px 16px;
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
  justify-content: center;
  gap: 12px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 12px;
  margin-bottom: 12px;
  font-size: 15px;
  color: #1a1a2e;
}

.more-option.cancel {
  background: #fff;
  border: 1px solid #eee;
  color: #666;
  margin-top: 8px;
}
</style>
