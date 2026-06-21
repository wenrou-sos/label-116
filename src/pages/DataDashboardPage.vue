<template>
  <div class="dashboard-page">
    <van-nav-bar
      title="数据看板"
      left-arrow
      @click-left="onBack"
      class="dashboard-nav"
    />

    <div v-if="hasData && !loading" class="dashboard-content">
      <div class="metrics-section">
        <div class="section-title">
          <TrendingUp class="section-icon" color="#F5A623" :size="20" />
          <span>关键指标</span>
        </div>
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-icon total">🍷</div>
            <div class="metric-info">
              <div class="metric-value">{{ stats.totalTastings }}</div>
              <div class="metric-label">总品鉴数</div>
            </div>
          </div>
          <div class="metric-card">
            <div class="metric-icon rating">⭐</div>
            <div class="metric-info">
              <div class="metric-value">{{ stats.averageRating }}</div>
              <div class="metric-label">平均评分</div>
            </div>
          </div>
          <div class="metric-card">
            <div class="metric-icon monthly">📅</div>
            <div class="metric-info">
              <div class="metric-value">{{ stats.monthlyCount }}</div>
              <div class="metric-label">本月品鉴</div>
            </div>
          </div>
          <div class="metric-card">
            <div class="metric-icon region">📍</div>
            <div class="metric-info">
              <div class="metric-value">{{ stats.regionsVisited }}</div>
              <div class="metric-label">产区打卡</div>
            </div>
          </div>
        </div>
      </div>

      <div v-show="statsStore.monthlyTrend.months.length > 0" class="chart-section">
        <div class="section-title">
          <LineChart class="section-icon" color="#3498DB" :size="20" />
          <span>品鉴趋势</span>
          <span class="subtitle">近6个月</span>
        </div>
        <div class="chart-card">
          <div ref="trendChartRef" class="chart-container" :class="{ loading: loading }"></div>
        </div>
      </div>

      <div v-show="statsStore.typeDistribution.types.length > 0" class="chart-section">
        <div class="section-title">
          <PieChart class="section-icon" color="#E74C3C" :size="20" />
          <span>酒款类型分布</span>
        </div>
        <div class="chart-card">
          <div ref="typeChartRef" class="chart-container pie-chart" :class="{ loading: loading }"></div>
        </div>
      </div>

      <div v-show="statsStore.regionStatsBar.regions.length > 0" class="chart-section">
        <div class="section-title">
          <BarChart3 class="section-icon" color="#9B59B6" :size="20" />
          <span>产区打卡排行</span>
        </div>
        <div class="chart-card">
          <div ref="regionChartRef" class="chart-container bar-chart" :class="{ loading: loading }"></div>
        </div>
      </div>
    </div>

    <van-loading v-if="loading" class="page-loading" color="#8B4513" />
    <Empty v-else-if="!hasData" class="dark-empty" description="暂无品鉴记录，快去品鉴吧~" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { TrendingUp, LineChart, PieChart, BarChart3 } from 'lucide-vue-next'
import { useStatsStore, useTastingStore, useUserStore } from '@/stores'
import * as echarts from 'echarts/core'
import { SVGRenderer } from 'echarts/renderers'
import { LineChart as ELineChart, PieChart as EPieChart, BarChart as EBarChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components'
import Empty from '@/components/Empty.vue'

echarts.use([
  SVGRenderer,
  ELineChart,
  EPieChart,
  EBarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
])

const router = useRouter()
const statsStore = useStatsStore()
const tastingStore = useTastingStore()
const userStore = useUserStore()

const trendChartRef = ref<HTMLElement>()
const typeChartRef = ref<HTMLElement>()
const regionChartRef = ref<HTMLElement>()

let trendChart: echarts.ECharts | null = null
let typeChart: echarts.ECharts | null = null
let regionChart: echarts.ECharts | null = null

const loading = ref(true)
const stats = ref(statsStore.keyMetrics)

const hasData = computed(() => tastingStore.myRecords.length > 0)

const onBack = () => {
  router.back()
}

const initTrendChart = () => {
  if (!trendChartRef.value) return
  if (trendChart) trendChart.dispose()

  trendChart = echarts.init(trendChartRef.value, undefined, { renderer: 'svg' })

  const months = statsStore.monthlyTrend.months
  const counts = statsStore.monthlyTrend.counts

  const option: echarts.EChartsCoreOption = {
    tooltip: {
      trigger: 'axis',
      confine: true,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#8B4513',
      borderWidth: 1,
      textStyle: {
        color: '#333',
        fontSize: 12
      },
      formatter: (params: any) => {
        if (!Array.isArray(params) || params.length === 0) return ''
        const item = params[0]
        const value = typeof item.value === 'number' ? item.value : (item.data?.value ?? 0)
        return `<div style="padding: 4px 8px;">
          <div style="font-weight: 600; margin-bottom: 4px;">${item.name}</div>
          <div style="display:flex;align-items:center;">
            <span style="display:inline-block;width:8px;height:8px;background:#8B4513;border-radius:50%;margin-right:6px;"></span>
            <span>品鉴：<strong>${value}</strong> 款</span>
          </div>
        </div>`
      }
    },
    grid: {
      left: '10%',
      right: '8%',
      top: '12%',
      bottom: '15%'
    },
    xAxis: {
      type: 'category',
      data: months,
      axisLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.15)'
        }
      },
      axisLabel: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 11
      },
      axisTick: {
        show: false
      }
    },
    yAxis: {
      type: 'value',
      minInterval: 1,
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.08)',
          type: 'dashed'
        }
      },
      axisLabel: {
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: 10
      }
    },
    series: [
      {
        type: 'line',
        data: counts,
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: {
          width: 3,
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: '#8B4513' },
            { offset: 1, color: '#D2691E' }
          ])
        },
        itemStyle: {
          color: '#8B4513',
          borderColor: '#fff',
          borderWidth: 2
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(139, 69, 19, 0.25)' },
            { offset: 1, color: 'rgba(139, 69, 19, 0.02)' }
          ])
        },
        label: {
          show: true,
          position: 'top',
          color: 'rgba(255, 255, 255, 0.8)',
          fontSize: 11,
          fontWeight: 600,
          formatter: (params: any) => {
            const v = typeof params.value === 'number' ? params.value : (params.data?.value ?? 0)
            return v > 0 ? String(v) : ''
          }
        }
      }
    ]
  }

  trendChart.setOption(option)
}

const initTypeChart = () => {
  if (!typeChartRef.value) return
  if (typeChart) typeChart.dispose()

  typeChart = echarts.init(typeChartRef.value, undefined, { renderer: 'svg' })

  const types = statsStore.typeDistribution.types
  const counts = statsStore.typeDistribution.counts
  const colors = statsStore.typeDistribution.colors

  const pieData = types.map((name, index) => ({
    value: counts[index],
    name,
    itemStyle: {
      color: colors[index]
    }
  }))

  const option: echarts.EChartsCoreOption = {
    tooltip: {
      trigger: 'item',
      confine: true,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#8B4513',
      borderWidth: 1,
      textStyle: {
        color: '#333',
        fontSize: 12
      },
      formatter: (params: any) => {
        if (!params) return ''
        const value = typeof params.value === 'number' ? params.value : 0
        const percent = params.percent != null ? params.percent : 0
        return `<div style="padding: 4px 8px;">
          <div style="font-weight: 600; margin-bottom: 4px;">${params.name}</div>
          <div style="display:flex;align-items:center;">
            <span style="display:inline-block;width:8px;height:8px;background:${params.color};border-radius:50%;margin-right:6px;"></span>
            <span>数量：<strong>${value}</strong> 款 (${percent}%)</span>
          </div>
        </div>`
      }
    },
    legend: {
      orient: 'vertical',
      right: '3%',
      top: 'center',
      itemGap: 10,
      textStyle: {
        color: 'rgba(255, 255, 255, 0.75)',
        fontSize: 11
      },
      icon: 'circle',
      formatter: (name: string) => {
        const idx = types.indexOf(name)
        const count = idx >= 0 ? counts[idx] : 0
        return `${name}  ${count}`
      }
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '65%'],
        center: ['30%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 6,
          borderColor: '#1a1a2e',
          borderWidth: 2
        },
        label: {
          show: false
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 13,
            fontWeight: 'bold',
            color: '#fff',
            formatter: (params: any) => {
              const v = typeof params.value === 'number' ? params.value : 0
              return `${params.name}\n${v}款`
            }
          },
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.4)'
          }
        },
        labelLine: {
          show: false
        },
        data: pieData
      }
    ]
  }

  typeChart.setOption(option)
}

const initRegionChart = () => {
  if (!regionChartRef.value) return
  if (regionChart) regionChart.dispose()

  regionChart = echarts.init(regionChartRef.value, undefined, { renderer: 'svg' })

  const regions = statsStore.regionStatsBar.regions
  const countries = statsStore.regionStatsBar.countries
  const counts = statsStore.regionStatsBar.counts

  const option: echarts.EChartsCoreOption = {
    tooltip: {
      trigger: 'axis',
      confine: true,
      axisPointer: {
        type: 'shadow'
      },
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#8B4513',
      borderWidth: 1,
      textStyle: {
        color: '#333',
        fontSize: 12
      },
      formatter: (params: any) => {
        if (!Array.isArray(params) || params.length === 0) return ''
        const item = params[0]
        const idx = regions.indexOf(item.name)
        const country = idx >= 0 ? countries[idx] : ''
        const value = typeof item.value === 'number' ? item.value : (item.data?.value ?? 0)
        return `<div style="padding: 4px 8px;">
          <div style="font-weight: 600; margin-bottom: 4px;">${item.name}</div>
          ${country ? `<div style="color: #999; font-size: 11px; margin-bottom: 4px;">${country}</div>` : ''}
          <div style="display:flex;align-items:center;">
            <span style="display:inline-block;width:8px;height:8px;background:#8B4513;border-radius:50%;margin-right:6px;"></span>
            <span>品鉴：<strong>${value}</strong> 款</span>
          </div>
        </div>`
      }
    },
    grid: {
      left: '3%',
      right: '12%',
      bottom: '5%',
      top: '8%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      minInterval: 1,
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.08)',
          type: 'dashed'
        }
      },
      axisLabel: {
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: 10
      }
    },
    yAxis: {
      type: 'category',
      data: regions,
      axisLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.15)'
        }
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: 'rgba(255, 255, 255, 0.75)',
        fontSize: 11,
        width: 70,
        overflow: 'truncate',
        ellipsis: '...'
      }
    },
    series: [
      {
        type: 'bar',
        data: counts,
        barWidth: '55%',
        itemStyle: {
          borderRadius: [0, 4, 4, 0],
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: 'rgba(139, 69, 19, 0.9)' },
            { offset: 1, color: 'rgba(210, 105, 30, 0.9)' }
          ])
        },
        emphasis: {
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: 'rgba(139, 69, 19, 1)' },
              { offset: 1, color: 'rgba(210, 105, 30, 1)' }
            ])
          }
        },
        label: {
          show: true,
          position: 'right',
          color: 'rgba(255, 255, 255, 0.9)',
          fontWeight: 600,
          fontSize: 11,
          formatter: (params: any) => {
            const v = typeof params.value === 'number' ? params.value : (params.data?.value ?? 0)
            return `${v}款`
          }
        }
      }
    ]
  }

  regionChart.setOption(option)
}

const initCharts = () => {
  const tryInit = (attempt = 0) => {
    if (attempt > 10) return
    const refsReady = trendChartRef.value || typeChartRef.value || regionChartRef.value
    if (!refsReady) {
      setTimeout(() => tryInit(attempt + 1), 50)
      return
    }
    nextTick(() => {
      if (statsStore.monthlyTrend.months.length > 0) {
        initTrendChart()
      }
      if (statsStore.typeDistribution.types.length > 0) {
        initTypeChart()
      }
      if (statsStore.regionStatsBar.regions.length > 0) {
        initRegionChart()
      }
    })
  }
  tryInit()
}

const handleResize = () => {
  trendChart?.resize()
  typeChart?.resize()
  regionChart?.resize()
}

const loadData = async () => {
  if (!userStore.currentUser) return
  loading.value = true
  try {
    await Promise.all([
      tastingStore.fetchMyRecords(userStore.currentUser.id),
      statsStore.fetchUserStats(userStore.currentUser.id)
    ])
    stats.value = statsStore.keyMetrics
    initCharts()
  } finally {
    loading.value = false
  }
}

watch(
  () => statsStore.keyMetrics,
  () => {
    stats.value = statsStore.keyMetrics
  },
  { deep: true }
)

watch(
  () => [
    statsStore.monthlyTrend.months.length,
    statsStore.typeDistribution.types.length,
    statsStore.regionStatsBar.regions.length
  ],
  () => {
    nextTick(() => {
      initCharts()
    })
  },
  { deep: true }
)

onMounted(() => {
  loadData()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  trendChart?.dispose()
  typeChart?.dispose()
  regionChart?.dispose()
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.dashboard-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  padding-bottom: env(safe-area-inset-bottom);
}

.dashboard-nav {
  background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%);
}

:deep(.van-nav-bar__content) {
  background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%);
}

:deep(.van-nav-bar__title),
:deep(.van-nav-bar__arrow) {
  color: #fff !important;
}

.dashboard-content {
  padding: 16px;
}

.metrics-section,
.chart-section {
  margin-bottom: 20px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 12px;
  padding-left: 4px;
}

.section-icon {
  flex-shrink: 0;
}

.section-title .subtitle {
  font-size: 12px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.6);
  margin-left: auto;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.metric-card {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: transform 0.2s ease;
}

.metric-card:active {
  transform: scale(0.98);
}

.metric-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  flex-shrink: 0;
}

.metric-icon.total {
  background: linear-gradient(135deg, rgba(139, 69, 19, 0.4) 0%, rgba(210, 105, 30, 0.4) 100%);
}

.metric-icon.rating {
  background: linear-gradient(135deg, rgba(245, 166, 35, 0.4) 0%, rgba(255, 193, 7, 0.4) 100%);
}

.metric-icon.monthly {
  background: linear-gradient(135deg, rgba(23, 162, 184, 0.4) 0%, rgba(32, 201, 151, 0.4) 100%);
}

.metric-icon.region {
  background: linear-gradient(135deg, rgba(156, 39, 176, 0.4) 0%, rgba(233, 30, 99, 0.4) 100%);
}

.metric-info {
  flex: 1;
  min-width: 0;
}

.metric-value {
  font-size: 24px;
  font-weight: 700;
  color: #fff;
  line-height: 1.2;
}

.metric-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 2px;
}

.chart-card {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.chart-container {
  width: 100%;
  height: 220px;
  transition: opacity 0.3s ease;
}

.chart-container.pie-chart {
  height: 260px;
}

.chart-container.bar-chart {
  height: 300px;
}

.chart-container.loading {
  opacity: 0.5;
}

.page-loading {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

@media (max-width: 360px) {
  .metric-value {
    font-size: 20px;
  }

  .metric-icon {
    width: 42px;
    height: 42px;
    font-size: 20px;
  }

  .chart-container {
    height: 200px;
  }

  .chart-container.pie-chart {
    height: 240px;
  }

  .chart-container.bar-chart {
    height: 280px;
  }
}

@media (min-width: 480px) {
  .metrics-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

:deep(.dark-empty .empty-state) {
  color: rgba(255, 255, 255, 0.6);
}

:deep(.dark-empty .empty-icon) {
  color: rgba(255, 255, 255, 0.3);
}

:deep(.dark-empty .empty-text) {
  color: rgba(255, 255, 255, 0.5);
}
</style>
