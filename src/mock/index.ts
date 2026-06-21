export * from './users'
export * from './wines'
export * from './tastingRecords'
export * from './wineLists'
export * from './notifications'
export * from './achievements'

import type { RegionStats } from '@/types'

export const regionStats: RegionStats[] = [
  { region: '波尔多', country: '法国', count: 45, lat: 44.8378, lng: -0.5792 },
  { region: '勃艮第', country: '法国', count: 32, lat: 47.0324, lng: 4.8565 },
  { region: '香槟区', country: '法国', count: 28, lat: 49.2549, lng: 4.0317 },
  { region: '托斯卡纳', country: '意大利', count: 25, lat: 43.7711, lng: 11.2486 },
  { region: '巴罗萨谷', country: '澳大利亚', count: 18, lat: -34.5202, lng: 138.9303 },
  { region: '马尔堡', country: '新西兰', count: 15, lat: -41.5128, lng: 173.9510 },
  { region: '斯佩塞德', country: '苏格兰', count: 22, lat: 57.5446, lng: -3.2477 },
  { region: '大阪', country: '日本', count: 12, lat: 34.6937, lng: 135.5023 },
  { region: '干邑区', country: '法国', count: 20, lat: 45.6940, lng: -0.3338 },
  { region: '烟台', country: '中国', count: 35, lat: 37.4638, lng: 121.4490 },
  { region: '苏玳', country: '法国', count: 10, lat: 44.6667, lng: -0.3500 }
]
