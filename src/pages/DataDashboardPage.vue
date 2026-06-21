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
          <van-icon name="chart-trending-o" size="20" color="#F5A623" />
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

      <div class="chart-section">
        <div class="section-title">
          <van-icon name="orders-o" size="20" color="#3498DB" />
          <span>品鉴趋势</span>
          <span class="subtitle">近6个月</span>
        </div>
        <div class="chart-card">
          <div ref="trendChartRef" class="chart-container" :class="{ loading: loading }"></div>
        </div>
      </div>

      <div class="chart-section">
        <div class="section-title">
          <van-icon name="pie-chart-o" size="20" color="#E74C3C" />
          <span>酒款类型分布</span>
        </div>
        <div class="chart-card">
          <div ref="typeChartRef" class="chart-container pie-chart" :class="{ loading: loading }"></div>
        </div>
      </div>

      <div class="chart-section">
        <div class="section-title">
          <van-icon name="bar-chart-o" size="20" color="#9B59B6" />
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
import { useStatsStore, useTastingStore, useUserStore } from '@/stores'
import * as echarts from 'echarts/core'
import { SVGRenderer } from 'echarts/renderers'
import { LineChart, PieChart, BarChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components'
import Empty from '@/components/Empty.vue'

echarts.use([
  SVGRenderer,
  LineChart,
  PieChart,
  BarChart,
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

const chartColors = ['#8B4513', '#D2691E', '#CD853F', '#DEB887', '#F4A460', '#D2B48C']

const initTrendChart = () => {
  if (!trendChartRef.value) return
  if (trendChart) trendChart.dispose()

  trendChart = echarts.init(trendChartRef.value, undefined, { renderer: 'svg' })

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
        if (!params || !params.length) return ''
        const data = params[0]
        return `<div style="padding: 4px 8px;">
          <div style="font-weight: 600; margin-bottom: 4px;">${data.name}</div>
          <div><span style="display:inline-block;width:8px;height:8px;background:#8B4513;border-radius:50%;margin-right:6px;"></span>品鉴：${data.value} 款</div>
        </div>`
      }
    },
    grid: {
      left: '8%',
      right: '8%',
      top: '15%',
      bottom: '12%'
    },
    xAxis: {
      type: 'category',
      data: statsStore.monthlyTrend.months,
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
        data: statsStore.monthlyTrend.counts,
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

  const pieData = statsStore.typeDistribution.types.map((name, index) => ({
    value: statsStore.typeDistribution.counts[index],
    name,
    itemStyle: {
      color: statsStore.typeDistribution.colors[index]
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
        return `<div style="padding: 4px 8px;">
          <div style="font-weight: 600; margin-bottom: 4px;">${params.name}</div>
          <div><span style="display:inline-block;width:8px;height:8px;background:${params.color};border-radius:50%;margin-right:6px;"></span>数量：${params.value} 款 (${params.percent}%)</div>
        </div>`
      }
    },
    legend: {
      orient: 'vertical',
      right: '5%',
      top: 'center',
      itemGap: 10,
      textStyle: {
        color: 'rgba(255, 255, 255, 0.75)',
        fontSize: 11
      },
      icon: 'circle'
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '65%'],
        center: ['32%', '50%'],
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
            color: '#fff'
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
        if (!params || !params.length) return ''
        const data = params[0]
        const regions = statsStore.regionStatsBar.regions
        const countries = statsStore.regionStatsBar.countries
        const idx = regions.indexOf(data.name)
        const country = idx >= 0 ? countries[idx] : ''
        return `<div style="padding: 4px 8px;">
          <div style="font-weight: 600; margin-bottom: 4px;">${data.name}</div>
          ${country ? `<div style="color: #999; font-size: 11px; margin-bottom: 4px;">${country}</div>` : ''}
          <div><span style="display:inline-block;width:8px;height:8px;background:#8B4513;border-radius:50%;margin-right:6px;"></span>品鉴：${data.value} 款</div>
        </div>`
      }
    },
    grid: {
      left: '3%',
      right: '14%',
      bottom: '5%',
      top: '10%',
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
      data: statsStore.regionStatsBar.regions,
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
        width: 65,
        overflow: 'truncate',
        ellipsis: '...'
      }
    },
    series: [
      {
        type: 'bar',
        data: statsStore.regionStatsBar.counts,
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
          formatter: '{c}款'
        }
      }
    ]
  }

  regionChart.setOption(option)
}

const initCharts = () => {
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
  font-size: 18px;
  line-height: 1;
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
