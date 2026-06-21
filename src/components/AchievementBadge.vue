<template>
  <div
    class="achievement-badge"
    :class="[rarityClass, { locked: !unlocked, small: size === 'small', large: size === 'large' }]"
    @click="handleClick"
  >
    <div class="icon-wrapper">
      <span class="badge-icon">{{ achievement.icon }}</span>
      <div v-if="!unlocked" class="lock-overlay">
        <Lock :size="size === 'large' ? 24 : 14" />
      </div>
      <div v-if="unlocked && showGlow" class="glow" />
    </div>
    <div v-if="size !== 'small'" class="badge-info">
      <div class="badge-name">{{ achievement.name }}</div>
      <div v-if="showProgress && !unlocked" class="progress-mini">
        <div class="progress-bar-mini">
          <div class="progress-fill-mini" :style="{ width: `${Math.round(progress * 100)}%` }" />
        </div>
        <span class="progress-text">{{ current }}/{{ target }}</span>
      </div>
      <div v-else-if="unlocked && unlockedAt && showDate" class="unlock-date">
        {{ formatDate(unlockedAt) }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Lock } from 'lucide-vue-next'
import type { Achievement } from '@/types'

const props = withDefaults(defineProps<{
  achievement: Achievement
  unlocked?: boolean
  progress?: number
  current?: number
  target?: number
  unlockedAt?: string
  size?: 'small' | 'medium' | 'large'
  showGlow?: boolean
  showProgress?: boolean
  showDate?: boolean
}>(), {
  unlocked: false,
  progress: 0,
  current: 0,
  target: 0,
  size: 'medium',
  showGlow: true,
  showProgress: true,
  showDate: false
})

const emit = defineEmits<{
  (e: 'click', achievement: Achievement): void
}>()

const rarityClass = computed(() => props.achievement.rarity)

const formatDate = (isoString: string) => {
  const d = new Date(isoString)
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
}

const handleClick = () => {
  emit('click', props.achievement)
}
</script>

<style scoped>
.achievement-badge {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.achievement-badge.small {
  padding: 8px;
  gap: 0;
  justify-content: center;
  width: 56px;
  height: 56px;
}

.achievement-badge.large {
  padding: 16px;
  gap: 16px;
}

.achievement-badge:hover:not(.locked) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.achievement-badge.locked {
  opacity: 0.5;
  filter: grayscale(0.7);
}

.achievement-badge.common {
  border-color: rgba(149, 165, 166, 0.4);
}

.achievement-badge.rare {
  border-color: rgba(52, 152, 219, 0.4);
  background: linear-gradient(135deg, rgba(52, 152, 219, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%);
}

.achievement-badge.epic {
  border-color: rgba(155, 89, 182, 0.4);
  background: linear-gradient(135deg, rgba(155, 89, 182, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%);
}

.achievement-badge.legendary {
  border-color: rgba(241, 196, 15, 0.5);
  background: linear-gradient(135deg, rgba(241, 196, 15, 0.1) 0%, rgba(255, 255, 255, 0.02) 100%);
}

.icon-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.badge-icon {
  font-size: 32px;
  line-height: 1;
}

.small .badge-icon {
  font-size: 24px;
}

.large .badge-icon {
  font-size: 44px;
}

.lock-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  color: #fff;
  padding: 4px;
}

.glow {
  position: absolute;
  inset: -8px;
  background: radial-gradient(circle, rgba(241, 196, 15, 0.15) 0%, transparent 70%);
  animation: glowPulse 3s ease-in-out infinite;
  pointer-events: none;
}

@keyframes glowPulse {
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.1); }
}

.badge-info {
  flex: 1;
  min-width: 0;
}

.badge-name {
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.large .badge-name {
  font-size: 16px;
}

.progress-mini {
  display: flex;
  align-items: center;
  gap: 8px;
}

.progress-bar-mini {
  flex: 1;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill-mini {
  height: 100%;
  background: linear-gradient(90deg, #8B4513, #F5A623);
  border-radius: 3px;
  transition: width 0.6s ease;
}

.progress-text {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.6);
  flex-shrink: 0;
}

.unlock-date {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.4);
}
</style>
