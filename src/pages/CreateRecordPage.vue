<template>
  <div class="create-record-page">
    <van-nav-bar
      title="记录品鉴"
      left-arrow
      @click-left="onBack"
      class="navbar"
    />
    
    <div class="content">
      <div class="section" v-if="selectedWine">
        <div class="section-title">已选酒款</div>
        <div class="selected-wine" @click="goToSelectWine">
          <img :src="selectedWine.image" :alt="selectedWine.name" class="wine-image" />
          <div class="wine-info">
            <div class="wine-name">{{ selectedWine.name }}</div>
            <div class="wine-en">{{ selectedWine.nameEn }}</div>
            <div class="wine-meta">{{ selectedWine.country }} · {{ selectedWine.region }}</div>
          </div>
          <van-icon name="arrow" size="16" color="#999" />
        </div>
      </div>
      
      <div class="section" v-else @click="goToSelectWine">
        <div class="select-wine-placeholder">
          <van-icon name="plus" size="32" color="#8B4513" />
          <div class="placeholder-text">点击选择酒款</div>
          <div class="placeholder-sub">支持搜索名称、扫码识别</div>
        </div>
      </div>
      
      <div class="section">
        <div class="section-title">品鉴评分</div>
        <div class="rating-section">
          <div class="rating-item">
            <div class="rating-label">
              <span class="rating-icon">👁️</span>
              色泽
            </div>
            <StarRating v-model="form.rating.color" />
          </div>
          <div class="rating-item">
            <div class="rating-label">
              <span class="rating-icon">👃</span>
              闻香
            </div>
            <StarRating v-model="form.rating.aroma" />
          </div>
          <div class="rating-item">
            <div class="rating-label">
              <span class="rating-icon">👅</span>
              口感
            </div>
            <StarRating v-model="form.rating.taste" />
          </div>
          <div class="rating-item">
            <div class="rating-label">
              <span class="rating-icon">✨</span>
              余味
            </div>
            <StarRating v-model="form.rating.finish" />
          </div>
        </div>
        <div class="total-rating">
          <span>综合评分</span>
          <span class="total-score">{{ averageRating.toFixed(1) }}</span>
        </div>
      </div>
      
      <div class="section">
        <div class="section-title">饮用场景</div>
        <div class="scene-grid">
          <div
            v-for="(label, key) in DrinkingSceneLabels"
            :key="key"
            class="scene-item"
            :class="{ active: form.scene === key }"
            @click="form.scene = key as DrinkingScene"
          >
            <div class="scene-icon">{{ sceneIcons[key as DrinkingScene] }}</div>
            <div class="scene-label">{{ label }}</div>
          </div>
        </div>
      </div>
      
      <div class="section">
        <div class="section-title">品鉴笔记</div>
        <van-field
          v-model="form.description"
          type="textarea"
          placeholder="记录这款酒给你的感受...（色泽、香气、口感、余味等）"
          autosize
          rows="4"
          class="description-input"
        />
      </div>
      
      <div class="section">
        <div class="section-title">价格与购买</div>
        <div class="price-section">
          <van-field
            v-model="form.price"
            type="number"
            label="购买价格"
            placeholder="请输入价格"
            class="price-input"
          >
            <template #left-icon>
              <span class="currency">¥</span>
            </template>
          </van-field>
        </div>
        <van-field
          v-model="form.purchaseChannel"
          placeholder="购买渠道（如：京东、线下酒庄、朋友赠送等）"
          class="channel-input"
        >
          <template #left-icon>
            <van-icon name="shop-o" size="16" color="#8B4513" />
          </template>
        </van-field>
      </div>
      
      <div class="submit-section">
        <van-button
          type="primary"
          size="large"
          class="submit-btn"
          :disabled="!canSubmit"
          @click="submitRecord"
        >
          发布品鉴记录
        </van-button>
      </div>
    </div>
    
    <van-loading v-if="submitting" class="loading" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useWineStore, useTastingStore, useUserStore } from '@/stores'
import type { Wine, DrinkingScene, TastingRating } from '@/types'
import { DrinkingSceneLabels } from '@/types'
import StarRating from '@/components/StarRating.vue'
import { showToast, showSuccessToast } from 'vant'

const route = useRoute()
const router = useRouter()
const wineStore = useWineStore()
const tastingStore = useTastingStore()
const userStore = useUserStore()

const selectedWine = ref<Wine | null>(null)
const submitting = ref(false)

const sceneIcons: Record<DrinkingScene, string> = {
  solo: '🍷',
  friends: '👥',
  business: '💼',
  date: '💕',
  dining: '🍽️'
}

const form = ref({
  rating: {
    color: 0,
    aroma: 0,
    taste: 0,
    finish: 0
  } as TastingRating,
  scene: 'solo' as DrinkingScene,
  description: '',
  price: '',
  purchaseChannel: ''
})

const averageRating = computed(() => {
  const { color, aroma, taste, finish } = form.value.rating
  return (color + aroma + taste + finish) / 4
})

const canSubmit = computed(() => {
  const { color, aroma, taste, finish } = form.value.rating
  return selectedWine.value && 
    color > 0 && aroma > 0 && taste > 0 && finish > 0 &&
    form.value.description.trim().length > 0 &&
    Number(form.value.price) > 0 &&
    form.value.purchaseChannel.trim().length > 0
})

const goToSelectWine = () => {
  router.push('/search-wine')
}

const onBack = () => {
  router.back()
}

const submitRecord = async () => {
  if (!canSubmit.value || !selectedWine.value) return
  
  submitting.value = true
  try {
    await tastingStore.createRecord({
      wineId: selectedWine.value.id,
      rating: form.value.rating,
      description: form.value.description,
      scene: form.value.scene,
      price: Number(form.value.price),
      purchaseChannel: form.value.purchaseChannel
    })
    
    showSuccessToast('发布成功！')
    setTimeout(() => {
      router.replace('/')
    }, 1000)
  } catch (error) {
    showToast('发布失败，请重试')
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  const wineId = route.query.wineId as string
  if (wineId) {
    const wine = await wineStore.fetchWineById(wineId)
    if (wine) {
      selectedWine.value = wine
    }
  }
})
</script>

<style scoped>
.create-record-page {
  min-height: 100vh;
  padding-bottom: 100px;
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

.content {
  padding: 16px;
}

.section {
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
  margin-bottom: 16px;
}

.select-wine-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  border: 2px dashed #8B4513;
  border-radius: 12px;
  background: rgba(139, 69, 19, 0.05);
}

.placeholder-text {
  font-size: 16px;
  font-weight: 600;
  color: #8B4513;
  margin-top: 12px;
}

.placeholder-sub {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.selected-wine {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(139, 69, 19, 0.05);
  border-radius: 12px;
}

.wine-image {
  width: 60px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
}

.wine-info {
  flex: 1;
  min-width: 0;
}

.wine-name {
  font-size: 16px;
  font-weight: 700;
  color: #1a1a2e;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.wine-en {
  font-size: 11px;
  color: #888;
  font-style: italic;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.wine-meta {
  font-size: 12px;
  color: #666;
  margin-top: 4px;
}

.rating-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.rating-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.rating-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
  color: #333;
}

.rating-icon {
  font-size: 18px;
}

.total-rating {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px dashed #eee;
  font-size: 15px;
  font-weight: 600;
  color: #333;
}

.total-score {
  font-size: 24px;
  font-weight: 700;
  color: #8B4513;
}

.scene-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
}

.scene-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 12px 8px;
  border-radius: 12px;
  background: #f8f9fa;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.scene-item.active {
  background: rgba(139, 69, 19, 0.1);
  border-color: #8B4513;
}

.scene-icon {
  font-size: 24px;
}

.scene-label {
  font-size: 11px;
  color: #666;
  text-align: center;
}

.scene-item.active .scene-label {
  color: #8B4513;
  font-weight: 600;
}

.description-input {
  background: #f8f9fa;
  border-radius: 12px;
}

:deep(.description-input .van-field__control) {
  padding: 12px;
}

.price-section {
  margin-bottom: 12px;
}

.price-input {
  background: #f8f9fa;
  border-radius: 12px;
}

.currency {
  font-size: 18px;
  font-weight: 700;
  color: #8B4513;
}

.channel-input {
  background: #f8f9fa;
  border-radius: 12px;
}

.submit-section {
  margin-top: 24px;
}

.submit-btn {
  width: 100%;
  height: 50px;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 600;
  background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%);
  border: none;
}

.submit-btn:disabled {
  opacity: 0.5;
}

.loading {
  display: flex;
  justify-content: center;
  padding: 40px 0;
}
</style>
