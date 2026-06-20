<template>
  <div class="app-container">
    <router-view v-slot="{ Component, route: currentRoute }">
      <transition :name="transitionName" mode="out-in">
        <component :is="Component" :key="currentRoute.fullPath" />
      </transition>
    </router-view>
    <transition name="slide-up">
      <Tabbar v-if="showTabbar" />
    </transition>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch, ref } from 'vue'
import { useRoute } from 'vue-router'
import Tabbar from '@/components/Tabbar.vue'
import { useUserStore } from '@/stores'

const route = useRoute()
const userStore = useUserStore()

const showTabbar = computed(() => route.meta.tabbar === true)

const transitionName = ref('slide-left')
const routeDepth = computed(() => {
  return route.path.split('/').filter(Boolean).length
})

watch(() => route.fullPath, (to, from) => {
  if (!from) return
  const toDepth = to.split('/').filter(Boolean).length
  const fromDepth = from.split('/').filter(Boolean).length
  if (toDepth > fromDepth) {
    transitionName.value = 'slide-left'
  } else if (toDepth < fromDepth) {
    transitionName.value = 'slide-right'
  } else {
    transitionName.value = 'fade'
  }
})

onMounted(() => {
  userStore.fetchCurrentUser()
})
</script>

<style>
.app-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  padding-bottom: env(safe-area-inset-bottom);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.98);
}

.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.slide-right-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

* {
  -webkit-tap-highlight-color: transparent;
}

::-webkit-scrollbar {
  width: 0;
  height: 0;
}
</style>
