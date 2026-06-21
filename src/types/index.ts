export interface User {
  id: string
  nickname: string
  avatar: string
  bio: string
  followersCount: number
  followingCount: number
  tastingCount: number
}

export interface Wine {
  id: string
  name: string
  nameEn: string
  type: 'red' | 'white' | 'sparkling' | 'dessert' | 'whiskey' | 'brandy' | 'other'
  variety: string
  region: string
  country: string
  year?: number
  price: number
  image: string
  rating: number
  tastingCount: number
  barcode?: string
  description: string
}

export interface TastingRating {
  color: number
  aroma: number
  taste: number
  finish: number
}

export type DrinkingScene = 'solo' | 'friends' | 'business' | 'date' | 'dining'

export const DrinkingSceneLabels: Record<DrinkingScene, string> = {
  solo: '独饮',
  friends: '朋友聚会',
  business: '商务宴请',
  date: '约会',
  dining: '配餐'
}

export interface TastingRecord {
  id: string
  userId: string
  user: User
  wineId: string
  wine: Wine
  rating: TastingRating
  description: string
  scene: DrinkingScene
  price: number
  purchaseChannel: string
  createdAt: string
  likes: number
  isLiked: boolean
  comments: Comment[]
  commentsCount: number
}

export interface Comment {
  id: string
  userId: string
  user: User
  content: string
  createdAt: string
}

export interface WineList {
  id: string
  userId: string
  user: User
  title: string
  description: string
  coverImage: string
  wines: Wine[]
  createdAt: string
  likes: number
  isLiked: boolean
}

export interface RegionStats {
  region: string
  country: string
  count: number
  lat: number
  lng: number
}

export interface CreateTastingParams {
  wineId: string
  rating: TastingRating
  description: string
  scene: DrinkingScene
  price: number
  purchaseChannel: string
}

export type NotificationType = 'like' | 'comment' | 'follow' | 'collect'

export interface Notification {
  id: string
  type: NotificationType
  fromUserId: string
  fromUser: User
  targetType: 'record' | 'list' | 'user'
  targetId: string
  targetTitle?: string
  commentContent?: string
  isRead: boolean
  createdAt: string
}

export type AchievementCategory = 'tasting' | 'type' | 'list' | 'social' | 'region'

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  category: AchievementCategory
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  condition: {
    type: 'tastingCount' | 'typeCoverage' | 'listCount' | 'totalLikes' | 'regionCount'
    target: number
    wineType?: string
  }
  unlockedAt?: string
}

export interface LevelInfo {
  level: number
  title: string
  minExp: number
  maxExp: number
  color: string
  icon: string
}

export interface UserProgress {
  userId: string
  currentExp: number
  currentLevel: number
  tastingCount: number
  uniqueWineTypes: string[]
  wineTypeCounts: Record<string, number>
  listCount: number
  totalLikes: number
  regionCount: number
  unlockedAchievementIds: string[]
  recentlyUnlocked: string[]
}

export interface AchievementProgress {
  achievement: Achievement
  current: number
  target: number
  progress: number
  unlocked: boolean
  unlockedAt?: string
}
