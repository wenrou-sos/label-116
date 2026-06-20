<template>
  <div class="home-page">
    <div class="header">
      <div class="header-content">
        <div class="logo-section">
          <div class="logo-icon">🍷</div>
          <div class="logo-text">酒友</div>
        </div>
        <div class="header-actions">
          <van-icon name="search" size="22" color="#fff" @click="goToSearch" />
        </div>
      </div>
    </div>

    <div class="content-wrapper">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model:loading="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
          :immediate-check="false"
        >
          <div class="feed-list">
            <TastingCard
              v-for="record in tastingStore.feedRecords"
              :key="record.id"
              :record="record"
            />
          </div>
        </van-list>
      </van-pull-refresh>
    </div>

    <div class="fab-button" @click="goToCreate">
      <van-icon name="plus" size="28" color="#fff" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTastingStore } from '@/stores'
import TastingCard from '@/components/TastingCard.vue'

const router = useRouter()
const tastingStore = useTastingStore()

const refreshing = ref(false)
const loading = ref(false)
const finished = ref(false)
const page = ref(1)
const pageSize = 10

const onLoad = async () => {
  try {
    const result = await tastingStore.fetchFeed(page.value, pageSize)
    page.value++
    if (result.records.length < pageSize || tastingStore.feedRecords.length >= result.total) {
      finished.value = true
    }
  } finally {
    loading.value = false
  }
}

const onRefresh = async () => {
  page.value = 1
  finished.value = false
  try {
    await tastingStore.fetchFeed(1, pageSize)
    page.value = 2
  } finally {
    refreshing.value = false
  }
}

const goToCreate = () => {
  router.push('/create')
}

const goToSearch = () => {
  router.push('/search-wine')
}

onMounted(() => {
  if (tastingStore.feedRecords.length === 0) {
    onLoad()
  }
})
</script>

<style scoped>
.home-page {
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
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo-icon {
  font-size: 28px;
}

.logo-text {
  font-size: 22px;
  font-weight: 700;
  color: #fff;
  letter-spacing: 2px;
}

.header-actions {
  display: flex;
  gap: 16px;
}

.content-wrapper {
  padding: 16px;
}

.feed-list {
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fab-button {
  position: fixed;
  right: 20px;
  bottom: 100px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(139, 69, 19, 0.4);
  z-index: 99;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.fab-button:active {
  transform: scale(0.95);
  box-shadow: 0 2px 10px rgba(139, 69, 19, 0.4);
}

:deep(.van-pull-refresh) {
  min-height: calc(100vh - 120px);
}

:deep(.van-loading) {
  color: #8B4513;
}
</style>
