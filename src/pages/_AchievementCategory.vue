<template>
  <div class="category-section">
    <div v-if="title" class="section-header">
      <div class="header-title">{{ title }}</div>
      <div v-if="description" class="header-desc">{{ description }}</div>
    </div>
    <div class="section-list">
      <div v-for="item in sortedList" :key="item.achievement.id" class="achievement-row">
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
          @click="$emit('badge-click', item.achievement)"
        />
      </div>
      <van-empty v-if="sortedList.length === 0" description="暂无成就" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import AchievementBadge from '@/components/AchievementBadge.vue'
import type { AchievementProgress, Achievement } from '@/types'

const props = defineProps<{
  title?: string
  description?: string
  list: AchievementProgress[]
}>()

defineEmits<{
  (e: 'badge-click', achievement: Achievement): void
}>()

const sortedList = computed(() => {
  const list = [...props.list]
  list.sort((a, b) => {
    if (a.unlocked !== b.unlocked) return a.unlocked ? -1 : 1
    if (a.progress !== b.progress) return b.progress - a.progress
    return a.achievement.condition.target - b.achievement.condition.target
  })
  return list
})
</script>

<style scoped>
.category-section {
  padding-top: 16px;
}

.section-header {
  margin-bottom: 14px;
  padding: 0 4px;
}

.header-title {
  font-size: 15px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 4px;
}

.header-desc {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.4);
}

.section-list {
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
</style>
