<template>
  <div class="empty-state">
    <div class="empty-icon">
      <svg viewBox="0 0 120 120" width="100" height="100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="60" r="50" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="6 6" opacity="0.35" />
        <path d="M45 52 L75 52 M45 64 L65 64 M45 76 L70 76" stroke="currentColor" stroke-width="3" stroke-linecap="round" opacity="0.25" />
        <circle cx="88" cy="42" r="14" fill="currentColor" opacity="0.12" />
        <path d="M88 36 L88 48 M82 42 L94 42" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.5" />
      </svg>
    </div>
    <div class="empty-text">{{ description }}</div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ description?: string }>(), {
  description: '暂无数据'
})
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  color: #999;
}

.empty-icon {
  color: #bbb;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-icon svg {
  width: 100px;
  height: 100px;
  max-width: 60vw;
}

.empty-text {
  font-size: 14px;
  color: #aaa;
  text-align: center;
  line-height: 1.5;
}
</style>
