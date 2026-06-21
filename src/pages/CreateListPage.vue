<template>
  <div class="create-list-page">
    <van-nav-bar
      :title="isEdit ? '编辑酒单' : '创建酒单'"
      left-arrow
      @click-left="$router.back()"
      :fixed="true"
      :placeholder="true"
      class="navbar"
    >
      <template #right>
        <button class="save-btn" :disabled="!canSave" @click="handleSave">
          保存
        </button>
      </template>
    </van-nav-bar>

    <div class="content">
      <div class="form-section">
        <div class="form-item">
          <label class="form-label">酒单封面</label>
          <div class="cover-upload" @click="showCoverPicker = true">
            <img v-if="formData.coverImage" :src="formData.coverImage" alt="封面" class="cover-preview" />
            <div v-else class="cover-placeholder">
              <van-icon name="photograph" size="40" color="#ccc" />
              <span>点击上传封面</span>
            </div>
          </div>
        </div>

        <div class="form-item">
          <label class="form-label">酒单标题</label>
          <van-field
            v-model="formData.title"
            placeholder="请输入酒单标题，如：千元内最佳威士忌"
            maxlength="30"
            :border="false"
            class="title-input"
          />
          <div class="char-count">{{ formData.title.length }}/30</div>
        </div>

        <div class="form-item">
          <label class="form-label">酒单描述</label>
          <van-field
            v-model="formData.description"
            type="textarea"
            placeholder="介绍一下这个酒单，帮助其他人更好地了解它"
            maxlength="200"
            :rows="4"
            :border="false"
            :autosize="true"
            class="desc-input"
          />
          <div class="char-count">{{ formData.description.length }}/200</div>
        </div>
      </div>

      <div class="wines-section">
        <div class="section-header">
          <div class="section-title">
            <span>添加酒款</span>
            <span class="wine-count">({{ selectedWineIds.length }} 款)</span>
          </div>
          <button class="add-wine-btn" @click="showWinePicker = true">
            <van-icon name="plus" size="16" />
            <span>添加酒款</span>
          </button>
        </div>

        <div v-if="selectedWines.length > 0" class="selected-wines">
          <div
            v-for="(wine, index) in selectedWines"
            :key="wine.id"
            class="selected-wine-item"
          >
            <div class="wine-rank">{{ index + 1 }}</div>
            <img :src="wine.image" :alt="wine.name" class="wine-image" />
            <div class="wine-info">
              <div class="wine-name">{{ wine.name }}</div>
              <div class="wine-meta">{{ wine.country }} · {{ wine.region }}</div>
              <div class="wine-bottom">
                <StarRating :model-value="wine.rating" readonly size="small" />
                <div class="wine-price">¥{{ wine.price }}</div>
              </div>
            </div>
            <van-icon name="close" size="20" color="#999" @click="removeWine(wine.id)" />
          </div>
        </div>

        <Empty v-else description="还没有添加酒款，点击右上角添加吧~" />
      </div>

      <div class="tips-section">
        <div class="tips-title">
          <van-icon name="info-o" size="14" color="#8B4513" />
          小贴士
        </div>
        <ul class="tips-list">
          <li>清晰的标题和描述更容易吸引其他人关注</li>
          <li>建议酒单包含 5-15 款酒，便于浏览</li>
          <li>选择有代表性的封面图能提升酒单吸引力</li>
        </ul>
      </div>
    </div>

    <van-loading v-if="loading" class="loading" color="#8B4513" />

    <van-popup v-model:show="showWinePicker" round position="bottom" :style="{ height: '80%' }">
      <div class="wine-picker">
        <div class="picker-header">
          <div class="picker-title">选择酒款</div>
          <van-icon name="close" size="22" @click="showWinePicker = false" />
        </div>
        <div class="picker-search">
          <van-field
            v-model="searchKeyword"
            placeholder="搜索酒款名称、产区、品种..."
            :border="false"
            left-icon="search"
          />
        </div>
        <div class="picker-content">
          <div class="wine-grid">
            <div
              v-for="wine in filteredWines"
              :key="wine.id"
              class="wine-option"
              :class="{ selected: selectedWineIds.includes(wine.id) }"
              @click="toggleWine(wine.id)"
            >
              <div class="wine-check">
                <van-icon v-if="selectedWineIds.includes(wine.id)" name="checked" size="16" color="#fff" />
              </div>
              <img :src="wine.image" :alt="wine.name" class="option-image" />
              <div class="option-info">
                <div class="option-name">{{ wine.name }}</div>
                <div class="option-meta">{{ wine.country }} · {{ wine.region }}</div>
                <div class="option-price">¥{{ wine.price }}</div>
              </div>
            </div>
          </div>
          <Empty v-if="filteredWines.length === 0" description="没有找到相关酒款~" />
        </div>
        <div class="picker-footer">
          <button class="confirm-btn" @click="showWinePicker = false">
            确定 ({{ selectedWineIds.length }})
          </button>
        </div>
      </div>
    </van-popup>

    <van-popup v-model:show="showCoverPicker" round position="bottom" :style="{ height: '40%' }">
      <div class="cover-picker">
        <div class="picker-title">选择封面</div>
        <div class="cover-options">
          <div
            v-for="(cover, index) in coverOptions"
            :key="index"
            class="cover-option"
            :class="{ active: formData.coverImage === cover }"
            @click="selectCover(cover)"
          >
            <img :src="cover" :alt="'封面' + (index + 1)" class="cover-image" />
            <div v-if="formData.coverImage === cover" class="cover-check">
              <van-icon name="checked" size="20" color="#8B4513" />
            </div>
          </div>
        </div>
        <button class="confirm-btn" @click="showCoverPicker = false">确定</button>
      </div>
    </van-popup>

    <van-dialog
      v-model:show="showDiscardConfirm"
      title="确定放弃？"
      message="编辑的内容将不会保存，确定要离开吗？"
      show-cancel-button
      confirm-button-text="确定离开"
      cancel-button-text="继续编辑"
      @confirm="confirmDiscard"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useWineStore, useWineListStore, useUserStore } from '@/stores'
import type { Wine } from '@/types'
import { showToast } from 'vant'
import StarRating from '@/components/StarRating.vue'
import Empty from '@/components/Empty.vue'

const route = useRoute()
const router = useRouter()
const wineStore = useWineStore()
const wineListStore = useWineListStore()
const userStore = useUserStore()

const isEdit = computed(() => route.name === 'edit-list')
const editId = computed(() => route.params.id as string)

const loading = ref(false)
const searchKeyword = ref('')
const showWinePicker = ref(false)
const showCoverPicker = ref(false)
const showDiscardConfirm = ref(false)

const formData = ref({
  title: '',
  description: '',
  coverImage: ''
})

const selectedWineIds = ref<string[]>([])

const coverOptions = [
  'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1549512326-3d3ba6286242?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'
]

const allWines = computed(() => wineStore.wines)
const filteredWines = computed(() => {
  if (!searchKeyword.value) return allWines.value
  const keyword = searchKeyword.value.toLowerCase()
  return allWines.value.filter(w => 
    w.name.toLowerCase().includes(keyword) ||
    w.nameEn.toLowerCase().includes(keyword) ||
    w.region.toLowerCase().includes(keyword) ||
    w.country.toLowerCase().includes(keyword) ||
    w.variety.toLowerCase().includes(keyword)
  )
})

const selectedWines = computed(() => {
  return selectedWineIds.value
    .map(id => allWines.value.find(w => w.id === id))
    .filter(Boolean) as Wine[]
})

const canSave = computed(() => {
  return formData.value.title.trim() && 
         formData.value.description.trim() && 
         selectedWineIds.value.length > 0
})

const toggleWine = (wineId: string) => {
  const index = selectedWineIds.value.indexOf(wineId)
  if (index > -1) {
    selectedWineIds.value.splice(index, 1)
  } else {
    selectedWineIds.value.push(wineId)
  }
}

const removeWine = (wineId: string) => {
  const index = selectedWineIds.value.indexOf(wineId)
  if (index > -1) {
    selectedWineIds.value.splice(index, 1)
  }
}

const selectCover = (cover: string) => {
  formData.value.coverImage = cover
}

const handleSave = async () => {
  if (!canSave.value) return
  
  loading.value = true
  try {
    const params = {
      title: formData.value.title,
      description: formData.value.description,
      wineIds: selectedWineIds.value
    }
    
    if (isEdit.value) {
      await wineListStore.updateList(editId.value, {
        ...params,
        coverImage: formData.value.coverImage
      })
      showToast('酒单更新成功')
    } else {
      const list = await wineListStore.createList(params)
      if (formData.value.coverImage) {
        list.coverImage = formData.value.coverImage
      }
      showToast('酒单创建成功')
    }
    router.back()
  } catch (e) {
    showToast('保存失败，请重试')
  } finally {
    loading.value = false
  }
}

const confirmDiscard = () => {
  router.back()
}

onMounted(async () => {
  loading.value = true
  try {
    await wineStore.fetchWines({ page: 1, pageSize: 50 })
    
    if (isEdit.value) {
      const list = await wineListStore.fetchListById(editId.value)
      if (list) {
        formData.value = {
          title: list.title,
          description: list.description,
          coverImage: list.coverImage
        }
        selectedWineIds.value = list.wines.map(w => w.id)
      }
    } else {
      formData.value.coverImage = coverOptions[0]
    }
    
    await userStore.fetchCurrentUser()
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.create-list-page {
  min-height: 100vh;
  padding-bottom: 20px;
}

.navbar {
  background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%);
}

.navbar :deep(.van-nav-bar__title),
.navbar :deep(.van-nav-bar__arrow) {
  color: #fff !important;
}

.save-btn {
  padding: 6px 16px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 16px;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
}

.save-btn:disabled {
  opacity: 0.5;
}

.content {
  padding: 16px;
}

.form-section {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.form-item {
  margin-bottom: 16px;
}

.form-item:last-child {
  margin-bottom: 0;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #1a1a2e;
  margin-bottom: 12px;
}

.cover-upload {
  width: 100%;
  height: 180px;
  border-radius: 12px;
  overflow: hidden;
  border: 2px dashed rgba(139, 69, 19, 0.3);
}

.cover-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #999;
  font-size: 13px;
  background: #fafafa;
}

.title-input,
.desc-input {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 12px !important;
}

.char-count {
  text-align: right;
  font-size: 11px;
  color: #999;
  margin-top: 6px;
}

.wines-section {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-title {
  font-size: 15px;
  font-weight: 700;
  color: #1a1a2e;
}

.wine-count {
  font-size: 13px;
  font-weight: 400;
  color: #8B4513;
}

.add-wine-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  background: rgba(139, 69, 19, 0.1);
  border: none;
  border-radius: 14px;
  color: #8B4513;
  font-size: 12px;
  font-weight: 500;
}

.selected-wines {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.selected-wine-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 12px;
}

.wine-rank {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%);
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.wine-image {
  width: 56px;
  height: 70px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
}

.wine-info {
  flex: 1;
  min-width: 0;
}

.wine-name {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a2e;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.wine-meta {
  font-size: 11px;
  color: #999;
  margin: 4px 0;
}

.wine-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.wine-price {
  font-size: 14px;
  font-weight: 700;
  color: #8B4513;
}

.tips-section {
  background: rgba(139, 69, 19, 0.05);
  border-radius: 12px;
  padding: 16px;
}

.tips-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: #8B4513;
  margin-bottom: 12px;
}

.tips-list {
  margin: 0;
  padding-left: 18px;
  font-size: 12px;
  color: #666;
  line-height: 1.8;
}

.loading {
  display: flex;
  justify-content: center;
  padding: 60px;
}

.wine-picker {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.picker-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #eee;
}

.picker-title {
  font-size: 17px;
  font-weight: 700;
  color: #1a1a2e;
}

.picker-search {
  padding: 12px 16px;
  background: #f8f9fa;
}

.picker-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.wine-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.wine-option {
  position: relative;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid transparent;
  transition: all 0.2s ease;
}

.wine-option.selected {
  border-color: #8B4513;
}

.wine-check {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

.wine-option.selected .wine-check {
  background: #8B4513;
}

.option-image {
  width: 100%;
  height: 120px;
  object-fit: cover;
}

.option-info {
  padding: 10px;
}

.option-name {
  font-size: 13px;
  font-weight: 600;
  color: #1a1a2e;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.option-meta {
  font-size: 10px;
  color: #999;
  margin: 4px 0;
}

.option-price {
  font-size: 14px;
  font-weight: 700;
  color: #8B4513;
}

.picker-footer {
  padding: 12px 16px;
  padding-bottom: calc(12px + env(safe-area-inset-bottom));
  border-top: 1px solid #eee;
}

.confirm-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%);
  border: none;
  border-radius: 12px;
  color: #fff;
  font-size: 15px;
  font-weight: 600;
}

.cover-picker {
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.cover-options {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin: 16px 0;
}

.cover-option {
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  border: 2px solid transparent;
}

.cover-option.active {
  border-color: #8B4513;
}

.cover-image {
  width: 100%;
  height: 80px;
  object-fit: cover;
  display: block;
}

.cover-check {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
