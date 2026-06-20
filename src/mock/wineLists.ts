import type { WineList } from '@/types'
import { mockUsers, currentUser } from './users'
import { mockWines } from './wines'

export const mockWineLists: WineList[] = [
  {
    id: '1',
    userId: '1',
    user: currentUser,
    title: '千元内最佳威士忌',
    description: '精选性价比超高的单一麦芽威士忌，适合日常品鉴和入门爱好者。',
    coverImage: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=600&h=400&fit=crop',
    wines: [mockWines[2], mockWines[3]],
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    likes: 328,
    isLiked: false
  },
  {
    id: '2',
    userId: '4',
    user: mockUsers[3],
    title: '女生适合的甜酒',
    description: '从入门到进阶，精选多款颜值高、口感好的甜酒，约会必备。',
    coverImage: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=600&h=400&fit=crop',
    wines: [mockWines[6], mockWines[5]],
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    likes: 567,
    isLiked: true
  },
  {
    id: '3',
    userId: '6',
    user: mockUsers[5],
    title: '配中餐的红酒推荐',
    description: '精心挑选适合搭配中国八大菜系的葡萄酒，让每一餐都更有滋味。',
    coverImage: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&h=400&fit=crop',
    wines: [mockWines[0], mockWines[7], mockWines[10]],
    createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
    likes: 423,
    isLiked: false
  },
  {
    id: '4',
    userId: '2',
    user: mockUsers[1],
    title: '夏日清爽白葡萄酒',
    description: '夏天就是要喝冰爽的白葡萄酒！这些高酸度、果香浓郁的酒款不容错过。',
    coverImage: 'https://images.unsplash.com/photo-1558001373-7b93ee52feca?w=600&h=400&fit=crop',
    wines: [mockWines[4]],
    createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
    likes: 289,
    isLiked: true
  },
  {
    id: '5',
    userId: '5',
    user: mockUsers[4],
    title: '波尔多五大名庄收藏指南',
    description: '想了解波尔多顶级酒庄？从这五款开始，带你领略左岸的优雅与力量。',
    coverImage: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=600&h=400&fit=crop',
    wines: [mockWines[0], mockWines[1]],
    createdAt: new Date(Date.now() - 86400000 * 25).toISOString(),
    likes: 678,
    isLiked: false
  },
  {
    id: '6',
    userId: '3',
    user: mockUsers[2],
    title: '威士忌入门必喝10款',
    description: '从苏格兰到日本，精选最适合新手的威士忌，带你入门单一麦芽的世界。',
    coverImage: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=600&h=400&fit=crop',
    wines: [mockWines[2], mockWines[3]],
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    likes: 892,
    isLiked: true
  }
]

export const getWineLists = (page: number = 1, pageSize: number = 10): { lists: WineList[], total: number } => {
  const start = (page - 1) * pageSize
  const end = start + pageSize
  return {
    lists: mockWineLists.slice(start, end),
    total: mockWineLists.length
  }
}

export const getMyWineLists = (userId: string): WineList[] => {
  return mockWineLists.filter(list => list.userId === userId)
}

export const getWineListById = (id: string): WineList | undefined => {
  return mockWineLists.find(list => list.id === id)
}
