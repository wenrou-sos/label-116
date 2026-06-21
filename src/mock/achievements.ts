import type { LevelInfo, Achievement, UserProgress } from '@/types'
import { mockUsers, mockTastingRecords, mockWineLists, mockWines, regionStats } from './'

const levelTitles: Record<string, { title: string; color: string; icon: string }> = {
  '1-3': { title: '新手酒客', color: '#95A5A6', icon: '🌱' },
  '4-6': { title: '入门品酒师', color: '#27AE60', icon: '🍷' },
  '7-10': { title: '品鉴爱好者', color: '#2ECC71', icon: '🍇' },
  '11-15': { title: '资深酒友', color: '#3498DB', icon: '🥂' },
  '16-20': { title: '侍酒达人', color: '#9B59B6', icon: '🍸' },
  '21-25': { title: '品酒专家', color: '#E67E22', icon: '🏆' },
  '26-29': { title: '酒评大师', color: '#E74C3C', icon: '👑' },
  '30': { title: '传奇鉴酒家', color: '#F1C40F', icon: '🌟' }
}

export const levels: LevelInfo[] = Array.from({ length: 30 }, (_, i) => {
  const level = i + 1
  let key: string
  if (level <= 3) key = '1-3'
  else if (level <= 6) key = '4-6'
  else if (level <= 10) key = '7-10'
  else if (level <= 15) key = '11-15'
  else if (level <= 20) key = '16-20'
  else if (level <= 25) key = '21-25'
  else if (level <= 29) key = '26-29'
  else key = '30'

  const info = levelTitles[key]
  const expPerLevel = level <= 10 ? 100 : level <= 20 ? 200 : 300
  const minExp = i === 0 ? 0 : Array.from({ length: i }, (_, j) => {
    const l = j + 1
    return l <= 10 ? 100 : l <= 20 ? 200 : 300
  }).reduce((a, b) => a + b, 0)

  return {
    level,
    title: info.title,
    minExp,
    maxExp: minExp + expPerLevel,
    color: info.color,
    icon: info.icon
  }
})

export const achievements: Achievement[] = [
  {
    id: 'tasting-first',
    name: '初来乍到',
    description: '完成第 1 次品鉴记录',
    icon: '🎉',
    category: 'tasting',
    rarity: 'common',
    condition: { type: 'tastingCount', target: 1 }
  },
  {
    id: 'tasting-10',
    name: '十杯小成',
    description: '完成 10 次品鉴记录',
    icon: '🥃',
    category: 'tasting',
    rarity: 'common',
    condition: { type: 'tastingCount', target: 10 }
  },
  {
    id: 'tasting-50',
    name: '品鉴达人',
    description: '完成 50 次品鉴记录',
    icon: '🍾',
    category: 'tasting',
    rarity: 'rare',
    condition: { type: 'tastingCount', target: 50 }
  },
  {
    id: 'tasting-100',
    name: '百评达人',
    description: '完成 100 次品鉴记录',
    icon: '📚',
    category: 'tasting',
    rarity: 'epic',
    condition: { type: 'tastingCount', target: 100 }
  },
  {
    id: 'tasting-500',
    name: '千杯不醉',
    description: '完成 500 次品鉴记录',
    icon: '🏛️',
    category: 'tasting',
    rarity: 'legendary',
    condition: { type: 'tastingCount', target: 500 }
  },
  {
    id: 'type-red-white',
    name: '红白兼修',
    description: '品鉴过红葡萄酒和白葡萄酒',
    icon: '❤️',
    category: 'type',
    rarity: 'common',
    condition: { type: 'typeCoverage', target: 2 }
  },
  {
    id: 'type-sparkling',
    name: '起泡爱好者',
    description: '品鉴过 3 款以上起泡酒',
    icon: '✨',
    category: 'type',
    rarity: 'rare',
    condition: { type: 'typeCoverage', target: 3, wineType: 'sparkling' }
  },
  {
    id: 'type-spirit',
    name: '烈酒猎人',
    description: '品鉴过威士忌和白兰地',
    icon: '🥃',
    category: 'type',
    rarity: 'rare',
    condition: { type: 'typeCoverage', target: 6 }
  },
  {
    id: 'type-all',
    name: '全能品鉴师',
    description: '品鉴过所有 7 种酒款类型',
    icon: '🎯',
    category: 'type',
    rarity: 'epic',
    condition: { type: 'typeCoverage', target: 7 }
  },
  {
    id: 'list-first',
    name: '私藏清单',
    description: '创建第 1 个酒单',
    icon: '📋',
    category: 'list',
    rarity: 'common',
    condition: { type: 'listCount', target: 1 }
  },
  {
    id: 'list-5',
    name: '酒单达人',
    description: '创建 5 个酒单',
    icon: '📒',
    category: 'list',
    rarity: 'rare',
    condition: { type: 'listCount', target: 5 }
  },
  {
    id: 'list-20',
    name: '分类大师',
    description: '创建 20 个酒单',
    icon: '📖',
    category: 'list',
    rarity: 'epic',
    condition: { type: 'listCount', target: 20 }
  },
  {
    id: 'like-10',
    name: '人气新星',
    description: '累计获得 10 个赞',
    icon: '💖',
    category: 'social',
    rarity: 'common',
    condition: { type: 'totalLikes', target: 10 }
  },
  {
    id: 'like-100',
    name: '人气之星',
    description: '累计获得 100 个赞',
    icon: '⭐',
    category: 'social',
    rarity: 'rare',
    condition: { type: 'totalLikes', target: 100 }
  },
  {
    id: 'like-1000',
    name: '千赞达人',
    description: '累计获得 1000 个赞',
    icon: '🔥',
    category: 'social',
    rarity: 'epic',
    condition: { type: 'totalLikes', target: 1000 }
  },
  {
    id: 'like-10000',
    name: '全民偶像',
    description: '累计获得 10000 个赞',
    icon: '👑',
    category: 'social',
    rarity: 'legendary',
    condition: { type: 'totalLikes', target: 10000 }
  },
  {
    id: 'region-1',
    name: '初探产区',
    description: '打卡第 1 个葡萄酒产区',
    icon: '🗺️',
    category: 'region',
    rarity: 'common',
    condition: { type: 'regionCount', target: 1 }
  },
  {
    id: 'region-5',
    name: '产区旅行家',
    description: '打卡 5 个不同产区',
    icon: '✈️',
    category: 'region',
    rarity: 'rare',
    condition: { type: 'regionCount', target: 5 }
  },
  {
    id: 'region-10',
    name: '环球品鉴',
    description: '打卡 10 个不同产区',
    icon: '🌍',
    category: 'region',
    rarity: 'epic',
    condition: { type: 'regionCount', target: 10 }
  },
  {
    id: 'region-all',
    name: '世界地图',
    description: '打卡全部 11 个知名产区',
    icon: '🌐',
    category: 'region',
    rarity: 'legendary',
    condition: { type: 'regionCount', target: 11 }
  }
]

const mockUnlockedAt = (daysAgo: number) => {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  return date.toISOString()
}

const calculateProgress = (userId: string): UserProgress => {
  const myRecords = mockTastingRecords.filter(r => r.userId === userId)
  const myWines = myRecords.map(r => mockWines.find(w => w.id === r.wineId)!).filter(Boolean)
  const uniqueWineTypes = Array.from(new Set(myWines.map(w => w.type))) as string[]
  const myLists = mockWineLists.filter(l => l.userId === userId)
  const totalLikes = myRecords.reduce((sum, r) => sum + r.likes, 0) +
    myLists.reduce((sum, l) => sum + l.likes, 0)
  const regionIds = Array.from(new Set(myWines.map(w => w.region)))
  const regionCount = regionIds.filter(r => regionStats.some(rs => rs.region === r)).length

  const baseExp = myRecords.length * 10 +
    uniqueWineTypes.length * 20 +
    myLists.length * 30 +
    Math.floor(totalLikes / 5) +
    regionCount * 15

  let currentLevel = 1
  for (const lv of levels) {
    if (baseExp >= lv.minExp) {
      currentLevel = lv.level
    }
  }

  const unlocked: string[] = []
  for (const ach of achievements) {
    let reached = false
    switch (ach.condition.type) {
      case 'tastingCount':
        reached = myRecords.length >= ach.condition.target
        break
      case 'typeCoverage':
        reached = uniqueWineTypes.length >= ach.condition.target
        break
      case 'listCount':
        reached = myLists.length >= ach.condition.target
        break
      case 'totalLikes':
        reached = totalLikes >= ach.condition.target
        break
      case 'regionCount':
        reached = regionCount >= ach.condition.target
        break
    }
    if (reached) unlocked.push(ach.id)
  }

  return {
    userId,
    currentExp: baseExp,
    currentLevel,
    tastingCount: myRecords.length,
    uniqueWineTypes,
    listCount: myLists.length,
    totalLikes,
    regionCount,
    unlockedAchievementIds: unlocked,
    recentlyUnlocked: unlocked.slice(-3)
  }
}

export const userProgressMap: Record<string, UserProgress> = {}
let initialized = false

const ensureInitialized = () => {
  if (initialized) return
  initialized = true
  for (const user of mockUsers) {
    userProgressMap[user.id] = calculateProgress(user.id)
  }
  const unlockedTimes: Record<string, string> = {}
  const currentUser = mockUsers[0]
  if (currentUser) {
    const prog = userProgressMap[currentUser.id]
    prog.unlockedAchievementIds.forEach((id, i) => {
      unlockedTimes[id] = mockUnlockedAt(i * 2 + Math.floor(Math.random() * 5))
    })
    achievements.forEach(a => {
      if (unlockedTimes[a.id]) a.unlockedAt = unlockedTimes[a.id]
    })
  }
}

export const getUserProgress = (userId: string): UserProgress | undefined => {
  ensureInitialized()
  return userProgressMap[userId]
}

export const getAllAchievements = (): Achievement[] => {
  ensureInitialized()
  return achievements.map(a => ({ ...a }))
}

export const getLevels = (): LevelInfo[] => {
  return levels.map(l => ({ ...l }))
}

export const getLevelInfo = (level: number): LevelInfo | undefined => {
  return levels.find(l => l.level === level)
}

export const addExpForAction = (userId: string, expAmount: number): {
  newLevel: boolean
  levelInfo?: LevelInfo
  newAchievements: Achievement[]
} => {
  ensureInitialized()
  const progress = userProgressMap[userId]
  if (!progress) return { newLevel: false, newAchievements: [] }

  const oldLevel = progress.currentLevel
  progress.currentExp += expAmount
  for (const lv of levels) {
    if (progress.currentExp >= lv.minExp) {
      progress.currentLevel = lv.level
    }
  }

  const newLevel = progress.currentLevel > oldLevel
  const levelInfo = newLevel ? levels.find(l => l.level === progress.currentLevel) : undefined

  const previouslyUnlocked = new Set(progress.unlockedAchievementIds)
  const newAchievements: Achievement[] = []

  for (const ach of achievements) {
    if (previouslyUnlocked.has(ach.id)) continue
    let reached = false
    switch (ach.condition.type) {
      case 'tastingCount':
        reached = progress.tastingCount >= ach.condition.target
        break
      case 'typeCoverage':
        reached = progress.uniqueWineTypes.length >= ach.condition.target
        break
      case 'listCount':
        reached = progress.listCount >= ach.condition.target
        break
      case 'totalLikes':
        reached = progress.totalLikes >= ach.condition.target
        break
      case 'regionCount':
        reached = progress.regionCount >= ach.condition.target
        break
    }
    if (reached) {
      progress.unlockedAchievementIds.push(ach.id)
      progress.recentlyUnlocked.push(ach.id)
      newAchievements.push({ ...ach, unlockedAt: new Date().toISOString() })
    }
  }

  return { newLevel, levelInfo, newAchievements }
}
