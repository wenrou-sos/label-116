<template>
  <div class="wine-card" @click="goToDetail">
    <div class="wine-image-wrapper">
      <img :src="wine.image" :alt="wine.name" class="wine-image" />
      <div class="wine-type-tag">{{ wineTypeLabel }}</div>
    </div>
    <div class="wine-content">
      <div class="wine-name">{{ wine.name }}</div>
      <div class="wine-en">{{ wine.nameEn }}</div>
      <div class="wine-meta">
        <span class="wine-region">{{ wine.country }} · {{ wine.region }}</span>
        <span v-if="wine.year" class="wine-year">{{ wine.year }}</span>
      </div>
      <div class="wine-bottom">
        <div class="wine-rating">
          <StarRating v-model="wine.rating" readonly show-value />
        </div>
        <div class="wine-price">¥{{ wine.price }}</div>
      </div>
      <div class="wine-stats">
        <span>{{ wine.tastingCount }} 人已品鉴</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Wine } from '@/types'
import StarRating from './StarRating.vue'

const props = defineProps<{
  wine: Wine
}>()

const router = useRouter()

const wineTypeLabel = computed(() => {
  const typeMap: Record<string, string> = {
    red: '红葡萄酒',
    white: '白葡萄酒',
    sparkling: '起泡酒',
    dessert: '甜酒',
    whiskey: '威士忌',
    brandy: '白兰地',
    other: '其他'
  }
  return typeMap[props.wine.type] || '其他'
})

const goToDetail = () => {
  router.push(`/wine/${props.wine.id}`)
}
</script>

<style scoped>
.wine-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.wine-card:active {
  transform: scale(0.98);
}

.wine-image-wrapper {
  position: relative;
  width: 100%;
  padding-top: 120%;
  overflow: hidden;
}

.wine-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.wine-type-tag {
  position: absolute;
  top: 8px;
  left: 8px;
  padding: 4px 10px;
  background: rgba(139, 69, 19, 0.9);
  color: #fff;
  font-size: 11px;
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

.wine-content {
  padding: 12px;
}

.wine-name {
  font-size: 15px;
  font-weight: 700;
  color: #1a1a2e;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.wine-en {
  font-size: 11px;
  color: #888;
  font-style: italic;
  margin-bottom: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.wine-meta {
  font-size: 11px;
  color: #666;
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
}

.wine-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.wine-rating {
  display: flex;
  align-items: center;
}

.wine-price {
  font-size: 16px;
  font-weight: 700;
  color: #8B4513;
}

.wine-stats {
  font-size: 11px;
  color: #999;
}
</style>
