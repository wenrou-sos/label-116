<template>
  <div class="wine-lists-page">
    <div class="header">
      <div class="header-content">
        <div class="header-title">酒单广场</div>
        <div class="create-btn" @click="goToCreateList">
          <van-icon name="plus" size="18" />
          <span>创建酒单</span>
        </div>
      </div>
    </div>
    
    <div class="content">
      <div class="section">
        <div class="section-header">
          <div class="section-title">热门酒单</div>
        </div>
        <div class="lists-grid">
          <WineListCard
            v-for="list in wineLists"
            :key="list.id"
            :list="list"
          />
        </div>
        <Empty v-if="wineLists.length === 0" description="暂无酒单，快去创建一个吧~" />
      </div>
      
      <div class="section" v-if="myLists.length > 0">
        <div class="section-header">
          <div class="section-title">我的酒单</div>
          <div class="section-action">查看全部</div>
        </div>
        <div class="my-lists">
          <div
            v-for="list in myLists.slice(0, 3)"
            :key="list.id"
            class="my-list-item"
            @click="goToListDetail(list.id)"
          >
            <img :src="list.coverImage" :alt="list.title" class="my-list-image" />
            <div class="my-list-info">
              <div class="my-list-title">{{ list.title }}</div>
              <div class="my-list-desc">{{ list.description }}</div>
              <div class="my-list-meta">
                <span>{{ list.wines.length }} 款酒</span>
                <span>{{ list.likes }} 收藏</span>
              </div>
            </div>
            <van-icon name="arrow" size="16" color="#999" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useWineListStore, useUserStore } from '@/stores'
import WineListCard from '@/components/WineListCard.vue'
import Empty from '@/components/Empty.vue'

const router = useRouter()
const wineListStore = useWineListStore()
const userStore = useUserStore()

const wineLists = computed(() => wineListStore.wineLists)
const myLists = computed(() => wineListStore.myWineLists)

const goToCreateList = () => {
  router.push('/create-list')
}

const goToListDetail = (id: string) => {
  router.push(`/list/${id}`)
}

onMounted(async () => {
  await wineListStore.fetchWineLists(1, 20)
  if (userStore.currentUser) {
    await wineListStore.fetchMyWineLists(userStore.currentUser.id)
  }
})
</script>

<style scoped>
.wine-lists-page {
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
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title {
  font-size: 22px;
  font-weight: 700;
  color: #fff;
}

.create-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  color: #fff;
  font-size: 13px;
  font-weight: 500;
}

.content {
  padding: 16px;
}

.section {
  margin-bottom: 16px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-title {
  font-size: 16px;
  font-weight: 700;
  color: #fff;
}

.section-action {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
}

.lists-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.my-lists {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  overflow: hidden;
}

.my-list-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-bottom: 1px solid #f0f0f0;
}

.my-list-item:last-child {
  border-bottom: none;
}

.my-list-image {
  width: 60px;
  height: 60px;
  border-radius: 10px;
  object-fit: cover;
}

.my-list-info {
  flex: 1;
  min-width: 0;
}

.my-list-title {
  font-size: 15px;
  font-weight: 600;
  color: #1a1a2e;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.my-list-desc {
  font-size: 12px;
  color: #666;
  margin: 2px 0 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.my-list-meta {
  display: flex;
  gap: 12px;
  font-size: 11px;
  color: #999;
}
</style>
