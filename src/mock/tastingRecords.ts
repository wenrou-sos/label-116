import type { TastingRecord, Comment } from '@/types'
import { mockUsers, currentUser } from './users'
import { mockWines } from './wines'

const generateComments = (count: number, startId: number): Comment[] => {
  const comments: Comment[] = []
  for (let i = 0; i < count; i++) {
    const user = mockUsers[(i + 1) % mockUsers.length]
    comments.push({
      id: `comment-${startId + i}`,
      userId: user.id,
      user,
      content: [
        '这款酒真的很棒，我也很喜欢！',
        '感谢分享，下次我也要试试。',
        '写得很专业，学到了很多。',
        '这个价格很划算啊，在哪里买的？',
        '搭配什么食物比较好呢？',
        '我去年也喝过这款，确实不错。',
        '评分很中肯，我也是这么觉得的。'
      ][i % 7],
      createdAt: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString()
    })
  }
  return comments
}

export const mockTastingRecords: TastingRecord[] = [
  {
    id: '1',
    userId: '1',
    user: currentUser,
    wineId: '1',
    wine: mockWines[0],
    rating: { color: 5, aroma: 5, taste: 5, finish: 5 },
    description: '今天开了这支2018年的拉菲，果味浓郁，单宁细腻，余韵悠长。开瓶后醒酒一个小时，黑加仑和雪松的香气扑鼻而来，入口丝滑，是不可多得的好酒。',
    scene: 'friends',
    price: 8800,
    purchaseChannel: '朋友酒庄直购',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    likes: 156,
    isLiked: false,
    comments: generateComments(3, 1),
    commentsCount: 8
  },
  {
    id: '2',
    userId: '2',
    user: mockUsers[1],
    wineId: '5',
    wine: mockWines[4],
    rating: { color: 4, aroma: 5, taste: 4, finish: 4 },
    description: '夏天必备的长相思！清爽的酸度，百香果和青草的香气，搭配海鲜绝了。',
    scene: 'dining',
    price: 380,
    purchaseChannel: '天猫旗舰店',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    likes: 89,
    isLiked: true,
    comments: generateComments(2, 4),
    commentsCount: 5
  },
  {
    id: '3',
    userId: '3',
    user: mockUsers[2],
    wineId: '3',
    wine: mockWines[2],
    rating: { color: 5, aroma: 5, taste: 5, finish: 5 },
    description: '麦卡伦25年，名不虚传。雪莉桶的香甜，葡萄干、蜂蜜的风味，还有一丝烟熏感，入口柔顺，余味长达几分钟。值得珍藏。',
    scene: 'solo',
    price: 15800,
    purchaseChannel: '拍卖会拍得',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    likes: 342,
    isLiked: false,
    comments: generateComments(5, 6),
    commentsCount: 15
  },
  {
    id: '4',
    userId: '4',
    user: mockUsers[3],
    wineId: '7',
    wine: mockWines[6],
    rating: { color: 5, aroma: 5, taste: 4, finish: 5 },
    description: '最爱的贵腐甜酒！金黄的色泽，蜂蜜、杏脯、柑橘的香气，甜蜜但不腻人，酸度平衡得很好。搭配蓝纹奶酪或者鹅肝都是绝配。',
    scene: 'date',
    price: 3200,
    purchaseChannel: '跨境电商',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    likes: 267,
    isLiked: true,
    comments: generateComments(4, 11),
    commentsCount: 12
  },
  {
    id: '5',
    userId: '5',
    user: mockUsers[4],
    wineId: '9',
    wine: mockWines[8],
    rating: { color: 4, aroma: 5, taste: 5, finish: 4 },
    description: '意大利超级托斯卡纳的代表作，桑娇维塞和赤霞珠的混酿非常成功。樱桃、皮革、香草的香气复杂而有层次，单宁坚实，需要醒酒。',
    scene: 'business',
    price: 980,
    purchaseChannel: '专业酒窖',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    likes: 198,
    isLiked: false,
    comments: generateComments(3, 15),
    commentsCount: 7
  },
  {
    id: '6',
    userId: '1',
    user: currentUser,
    wineId: '11',
    wine: mockWines[10],
    rating: { color: 4, aroma: 4, taste: 4, finish: 3 },
    description: '作为日常餐酒来说表现不错，浓郁的黑色水果香气，单宁中等，性价比很高。支持国货！',
    scene: 'dining',
    price: 198,
    purchaseChannel: '超市购买',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    likes: 145,
    isLiked: false,
    comments: generateComments(2, 18),
    commentsCount: 4
  },
  {
    id: '7',
    userId: '2',
    user: mockUsers[1],
    wineId: '8',
    wine: mockWines[7],
    rating: { color: 4, aroma: 4, taste: 5, finish: 4 },
    description: '澳洲酒的风格就是这么奔放！浓郁的黑色水果和巧克力的味道，酒体饱满，喝起来很过瘾。',
    scene: 'friends',
    price: 580,
    purchaseChannel: '京东自营',
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    likes: 178,
    isLiked: true,
    comments: generateComments(3, 20),
    commentsCount: 6
  },
  {
    id: '8',
    userId: '6',
    user: mockUsers[5],
    wineId: '2',
    wine: mockWines[1],
    rating: { color: 5, aroma: 4, taste: 5, finish: 5 },
    description: '拉图的酒总是那么有力量。2016年是个好年份，现在喝还稍微早了点，再放个5-10年应该会更好。今天搭配了牛排，非常完美。',
    scene: 'dining',
    price: 6500,
    purchaseChannel: '酒庄旅游时购买',
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    likes: 234,
    isLiked: false,
    comments: generateComments(4, 23),
    commentsCount: 9
  }
]

export const getFeedRecords = (page: number = 1, pageSize: number = 10): { records: TastingRecord[], total: number } => {
  const start = (page - 1) * pageSize
  const end = start + pageSize
  return {
    records: mockTastingRecords.slice(start, end),
    total: mockTastingRecords.length
  }
}

export const getMyRecords = (userId: string): TastingRecord[] => {
  return mockTastingRecords.filter(record => record.userId === userId)
}

export const getRecordById = (id: string): TastingRecord | undefined => {
  return mockTastingRecords.find(record => record.id === id)
}
