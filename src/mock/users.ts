import type { User } from '@/types'

export const mockUsers: User[] = [
  {
    id: '1',
    nickname: '酒仙老张',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    bio: '品酒十余年，偏爱波尔多和勃艮第',
    followersCount: 1256,
    followingCount: 328,
    tastingCount: 156
  },
  {
    id: '2',
    nickname: '红酒爱好者小王',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    bio: '喜欢探索新世界葡萄酒',
    followersCount: 892,
    followingCount: 456,
    tastingCount: 89
  },
  {
    id: '3',
    nickname: '威士忌收藏家',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    bio: '单一麦芽威士忌爱好者',
    followersCount: 2341,
    followingCount: 189,
    tastingCount: 234
  },
  {
    id: '4',
    nickname: '甜酒小姐姐',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    bio: '只喝甜酒的小仙女',
    followersCount: 3456,
    followingCount: 234,
    tastingCount: 178
  },
  {
    id: '5',
    nickname: '品酒师李明',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    bio: 'WSET四级品酒师，带你领略葡萄酒的世界',
    followersCount: 5678,
    followingCount: 156,
    tastingCount: 456
  },
  {
    id: '6',
    nickname: '美食配酒达人',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
    bio: '致力于研究中餐与葡萄酒的完美搭配',
    followersCount: 1890,
    followingCount: 345,
    tastingCount: 123
  }
]

export const currentUser: User = mockUsers[0]
