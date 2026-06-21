<template>
  <div class="search-wine-page">
    <van-nav-bar
      title="选择酒款"
      left-arrow
      @click-left="onBack"
      class="navbar"
    />
    
    <div class="search-section">
      <van-search
        v-model="searchText"
        placeholder="搜索酒款名称、产区、品种..."
        shape="round"
        @search="handleSearch"
        @input="handleInput"
        clearable
      >
        <template #left-icon>
          <van-icon name="search" size="16" />
        </template>
      </van-search>
      
      <div class="scan-button" @click="showScanModal = true">
        <van-icon name="scan" size="20" />
        <span>扫码识别</span>
      </div>
    </div>
    
    <div class="content">
      <div v-if="searchText && searchResults.length === 0 && !loading" class="no-results">
        <van-empty description="未找到相关酒款" />
      </div>
      
      <div v-if="!searchText" class="hot-searches">
        <div class="section-title">热门搜索</div>
        <div class="hot-tags">
          <van-tag
            v-for="tag in hotTags"
            :key="tag"
            type="primary"
            plain
            round
            class="hot-tag"
            @click="selectTag(tag)"
          >
            {{ tag }}
          </van-tag>
        </div>
        
        <div class="section-title" style="margin-top: 24px;">热门酒款</div>
        <div class="wine-grid">
          <div
            v-for="wine in popularWines"
            :key="wine.id"
            class="wine-item"
            @click="selectWine(wine)"
          >
            <img :src="wine.image" :alt="wine.name" class="wine-image" />
            <div class="wine-info">
              <div class="wine-name">{{ wine.name }}</div>
              <div class="wine-meta">{{ wine.country }} · {{ wine.region }}</div>
            </div>
          </div>
        </div>
      </div>
      
      <div v-if="searchResults.length > 0" class="search-results">
        <div class="result-count">找到 {{ searchResults.length }} 款酒</div>
        <div class="wine-list">
          <div
            v-for="wine in searchResults"
            :key="wine.id"
            class="wine-list-item"
            @click="selectWine(wine)"
          >
            <img :src="wine.image" :alt="wine.name" class="wine-list-image" />
            <div class="wine-list-info">
              <div class="wine-list-name">{{ wine.name }}</div>
              <div class="wine-list-en">{{ wine.nameEn }}</div>
              <div class="wine-list-meta">
                <span>{{ wine.country }} · {{ wine.region }}</span>
                <span v-if="wine.year">{{ wine.year }}</span>
              </div>
              <div class="wine-list-bottom">
                <StarRating :model-value="wine.rating" readonly show-value />
                <span class="wine-price">¥{{ wine.price }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <van-loading v-if="loading" class="loading" />
    
    <van-popup
      v-model:show="showScanModal"
      position="bottom"
      round
      :style="{ height: '60%' }"
    >
      <div class="scan-modal">
        <div class="scan-header">
          <div class="scan-title">条形码扫描</div>
          <van-icon name="close" size="22" @click="showScanModal = false" />
        </div>
        <div class="scan-content">
          <div class="scan-placeholder">
            <van-icon name="scan" size="80" color="#8B4513" />
            <div class="scan-tip">将条形码放入框内，自动识别</div>
            <div class="scan-input">
              <van-field
                v-model="barcodeInput"
                placeholder="或手动输入条形码"
                type="number"
                class="barcode-input"
              />
              <van-button
                type="primary"
                size="small"
                class="barcode-btn"
                @click="searchByBarcode"
              >
                搜索
              </van-button>
            </div>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useWineStore } from '@/stores'
import type { Wine } from '@/types'
import StarRating from '@/components/StarRating.vue'

const route = useRoute()
const router = useRouter()
const wineStore = useWineStore()

const searchText = ref('')
const searchResults = ref<Wine[]>([])
const popularWines = ref<Wine[]>([])
const loading = ref(false)
const showScanModal = ref(false)
const barcodeInput = ref('')

const hotTags = ['拉菲', '威士忌', '香槟', '波尔多', '勃艮第', '长相思', '赤霞珠', '甜酒']

const selectTag = (tag: string) => {
  searchText.value = tag
  handleSearch()
}

const handleInput = async () => {
  if (searchText.value.length >= 2) {
    await handleSearch()
  } else if (searchText.value.length === 0) {
    searchResults.value = []
  }
}

const handleSearch = async () => {
  if (!searchText.value.trim()) return
  loading.value = true
  try {
    searchResults.value = await wineStore.searchWines(searchText.value)
  } finally {
    loading.value = false
  }
}

const searchByBarcode = async () => {
  if (!barcodeInput.value.trim()) return
  loading.value = true
  try {
    const wine = await wineStore.scanBarcode(barcodeInput.value)
    showScanModal.value = false
    selectWine(wine)
  } catch (error) {
    console.error('Barcode search failed:', error)
  } finally {
    loading.value = false
  }
}

const selectWine = (wine: Wine) => {
  const from = route.query.from as string
  if (from === 'create-list') {
    router.push({
      path: '/create-list',
      query: { selectedWineId: wine.id }
    })
  } else {
    router.push({
      path: '/create',
      query: { wineId: wine.id }
    })
  }
}

const onBack = () => {
  router.back()
}

onMounted(async () => {
  popularWines.value = await wineStore.fetchPopularWines(6)
})
</script>

<style scoped>
.search-wine-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
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

.search-section {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%);
}

:deep(.van-search) {
  flex: 1;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
}

.scan-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  color: #fff;
  font-size: 11px;
}

.content {
  padding: 16px;
}

.section-title {
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 12px;
}

.hot-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.hot-tag {
  font-size: 13px;
  padding: 6px 14px;
}

.wine-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.wine-item {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  overflow: hidden;
  text-align: center;
}

.wine-image {
  width: 100%;
  height: 100px;
  object-fit: cover;
}

.wine-info {
  padding: 8px;
}

.wine-name {
  font-size: 12px;
  font-weight: 600;
  color: #1a1a2e;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.wine-meta {
  font-size: 10px;
  color: #888;
  margin-top: 2px;
}

.result-count {
  font-size: 13px;
  color: #999;
  margin-bottom: 12px;
}

.wine-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.wine-list-item {
  display: flex;
  gap: 12px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 12px;
}

.wine-list-image {
  width: 70px;
  height: 90px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
}

.wine-list-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.wine-list-name {
  font-size: 15px;
  font-weight: 700;
  color: #1a1a2e;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.wine-list-en {
  font-size: 11px;
  color: #888;
  font-style: italic;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.wine-list-meta {
  font-size: 12px;
  color: #666;
  display: flex;
  gap: 10px;
}

.wine-list-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.wine-price {
  font-size: 16px;
  font-weight: 700;
  color: #8B4513;
}

.no-results {
  padding: 60px 0;
}

.loading {
  display: flex;
  justify-content: center;
  padding: 40px 0;
}

.scan-modal {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.scan-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #eee;
}

.scan-title {
  font-size: 16px;
  font-weight: 700;
  color: #1a1a2e;
}

.scan-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.scan-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.scan-tip {
  font-size: 14px;
  color: #666;
}

.scan-input {
  display: flex;
  gap: 8px;
  margin-top: 20px;
  width: 280px;
}

.barcode-input {
  flex: 1;
  background: #f5f5f5;
  border-radius: 8px;
}

.barcode-btn {
  border-radius: 8px;
  background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%);
  border: none;
}
</style>
