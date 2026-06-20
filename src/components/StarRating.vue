<template>
  <div class="star-rating" :class="{ 'readonly': readonly }">
    <span
      v-for="star in 5"
      :key="star"
      class="star"
      :class="{
        'active': star <= modelValue,
        'hover': star <= hoverStar && !readonly,
        'readonly': readonly
      }"
      @click="!readonly && setRating(star)"
      @mouseenter="!readonly && (hoverStar = star)"
      @mouseleave="!readonly && (hoverStar = 0)"
    >
      ★
    </span>
    <span v-if="showValue" class="rating-value">{{ modelValue.toFixed(1) }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = withDefaults(defineProps<{
  modelValue: number
  readonly?: boolean
  showValue?: boolean
  size?: 'small' | 'medium' | 'large'
}>(), {
  readonly: false,
  showValue: false,
  size: 'medium'
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()

const hoverStar = ref(0)

const setRating = (star: number) => {
  emit('update:modelValue', star)
}
</script>

<style scoped>
.star-rating {
  display: inline-flex;
  align-items: center;
  gap: 2px;
}

.star {
  cursor: pointer;
  font-size: 18px;
  color: #ddd;
  transition: all 0.2s ease;
}

.star.active,
.star.hover {
  color: #f5a623;
}

.star.readonly {
  cursor: default;
  font-size: 14px;
}

.rating-value {
  margin-left: 6px;
  font-size: 14px;
  font-weight: 600;
  color: #f5a623;
}

.readonly .star {
  cursor: default;
}
</style>
