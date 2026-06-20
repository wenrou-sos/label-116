import type { Wine } from '@/types'

export const mockWines: Wine[] = [
  {
    id: '1',
    name: '拉菲古堡',
    nameEn: 'Chateau Lafite Rothschild',
    type: 'red',
    variety: '赤霞珠、梅洛',
    region: '波尔多',
    country: '法国',
    year: 2018,
    price: 8800,
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=500&fit=crop',
    rating: 4.8,
    tastingCount: 2345,
    barcode: '3000000000001',
    description: '拉菲古堡是波尔多五大名庄之首，以其优雅、复杂和长寿而闻名于世。'
  },
  {
    id: '2',
    name: '拉图城堡',
    nameEn: 'Chateau Latour',
    type: 'red',
    variety: '赤霞珠、梅洛',
    region: '波尔多',
    country: '法国',
    year: 2016,
    price: 6500,
    image: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400&h=500&fit=crop',
    rating: 4.7,
    tastingCount: 1890,
    barcode: '3000000000002',
    description: '拉图城堡以其强劲的单宁和陈年潜力著称，是波尔多最经典的酒庄之一。'
  },
  {
    id: '3',
    name: '麦卡伦25年',
    nameEn: 'The Macallan 25 Years Old',
    type: 'whiskey',
    variety: '单一麦芽',
    region: '斯佩塞德',
    country: '苏格兰',
    price: 15800,
    image: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=400&h=500&fit=crop',
    rating: 4.9,
    tastingCount: 3456,
    barcode: '5000000000001',
    description: '麦卡伦25年雪莉桶，威士忌收藏者的梦想之选，口感浓郁复杂。'
  },
  {
    id: '4',
    name: '山崎12年',
    nameEn: 'Yamazaki 12 Years Old',
    type: 'whiskey',
    variety: '单一麦芽',
    region: '大阪',
    country: '日本',
    price: 2800,
    image: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=400&h=500&fit=crop',
    rating: 4.6,
    tastingCount: 4567,
    barcode: '4900000000001',
    description: '日本威士忌的代表作，带有独特的东方韵味，多次荣获国际大奖。'
  },
  {
    id: '5',
    name: '云雾之湾长相思',
    nameEn: 'Cloudy Bay Sauvignon Blanc',
    type: 'white',
    variety: '长相思',
    region: '马尔堡',
    country: '新西兰',
    year: 2022,
    price: 380,
    image: 'https://images.unsplash.com/photo-1558001373-7b93ee52feca?w=400&h=500&fit=crop',
    rating: 4.3,
    tastingCount: 5678,
    barcode: '9400000000001',
    description: '新西兰长相思的标杆之作，果香浓郁，酸度清爽，是夏日必备。'
  },
  {
    id: '6',
    name: '酩悦香槟',
    nameEn: "Moet & Chandon Brut Imperial",
    type: 'sparkling',
    variety: '霞多丽、黑皮诺',
    region: '香槟区',
    country: '法国',
    price: 420,
    image: 'https://images.unsplash.com/photo-1594372365401-3b5ff14eaaed?w=400&h=500&fit=crop',
    rating: 4.4,
    tastingCount: 7890,
    barcode: '3000000000003',
    description: '世界上最著名的香槟品牌之一，庆祝时刻的完美选择。'
  },
  {
    id: '7',
    name: '滴金酒庄甜白',
    nameEn: 'Chateau d\'Yquem',
    type: 'dessert',
    variety: '赛美蓉、长相思',
    region: '苏玳',
    country: '法国',
    year: 2017,
    price: 3200,
    image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=400&h=500&fit=crop',
    rating: 4.8,
    tastingCount: 1234,
    barcode: '3000000000004',
    description: '贵腐甜酒的巅峰之作，甜蜜而不腻，具有极佳的陈年潜力。'
  },
  {
    id: '8',
    name: '奔富Bin 389',
    nameEn: 'Penfolds Bin 389',
    type: 'red',
    variety: '赤霞珠、西拉',
    region: '巴罗萨谷',
    country: '澳大利亚',
    year: 2020,
    price: 580,
    image: 'https://images.unsplash.com/photo-1550399105-c4db5fb85c18?w=400&h=500&fit=crop',
    rating: 4.5,
    tastingCount: 6789,
    barcode: '9300000000001',
    description: '澳大利亚最具代表性的酒款之一，被称为"小葛兰许"。'
  },
  {
    id: '9',
    name: '安东尼世家天娜',
    nameEn: 'Antinori Tignanello',
    type: 'red',
    variety: '桑娇维塞、赤霞珠',
    region: '托斯卡纳',
    country: '意大利',
    year: 2019,
    price: 980,
    image: 'https://images.unsplash.com/photo-1586370444981-41c335e5e231?w=400&h=500&fit=crop',
    rating: 4.6,
    tastingCount: 3456,
    barcode: '8000000000001',
    description: '意大利超级托斯卡纳的开创之作，优雅与力量的完美结合。'
  },
  {
    id: '10',
    name: '轩尼诗XO',
    nameEn: 'Hennessy XO',
    type: 'brandy',
    variety: '干邑',
    region: '干邑区',
    country: '法国',
    price: 1880,
    image: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=400&h=500&fit=crop',
    rating: 4.5,
    tastingCount: 8901,
    barcode: '3000000000005',
    description: '世界上最畅销的干邑XO，口感丰富，余韵悠长。'
  },
  {
    id: '11',
    name: '张裕解百纳',
    nameEn: 'Changyu Cabernet',
    type: 'red',
    variety: '赤霞珠',
    region: '烟台',
    country: '中国',
    year: 2020,
    price: 198,
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=500&fit=crop',
    rating: 4.0,
    tastingCount: 9876,
    barcode: '6900000000001',
    description: '中国葡萄酒的代表品牌，性价比极高。'
  },
  {
    id: '12',
    name: '桃红香槟',
    nameEn: 'Dom Perignon Rose',
    type: 'sparkling',
    variety: '黑皮诺、霞多丽',
    region: '香槟区',
    country: '法国',
    year: 2012,
    price: 2800,
    image: 'https://images.unsplash.com/photo-1594372365401-3b5ff14eaaed?w=400&h=500&fit=crop',
    rating: 4.7,
    tastingCount: 2345,
    barcode: '3000000000006',
    description: '唐·培里侬桃红香槟，稀有而珍贵，是香槟收藏家的挚爱。'
  }
]

export const getWineById = (id: string): Wine | undefined => {
  return mockWines.find(wine => wine.id === id)
}

export const searchWines = (keyword: string): Wine[] => {
  const lowerKeyword = keyword.toLowerCase()
  return mockWines.filter(wine => 
    wine.name.toLowerCase().includes(lowerKeyword) ||
    wine.nameEn.toLowerCase().includes(lowerKeyword) ||
    wine.region.toLowerCase().includes(lowerKeyword) ||
    wine.country.toLowerCase().includes(lowerKeyword) ||
    wine.variety.toLowerCase().includes(lowerKeyword) ||
    wine.barcode === keyword
  )
}

export const getWinesByRegion = (region: string): Wine[] => {
  return mockWines.filter(wine => wine.region === region)
}

export const getWinesByType = (type: Wine['type']): Wine[] => {
  return mockWines.filter(wine => wine.type === type)
}

export const getWinesByVariety = (variety: string): Wine[] => {
  return mockWines.filter(wine => wine.variety.includes(variety))
}

export const getPopularWines = (limit: number = 10): Wine[] => {
  return [...mockWines].sort((a, b) => b.tastingCount - a.tastingCount).slice(0, limit)
}

export const getTopRatedWines = (limit: number = 10): Wine[] => {
  return [...mockWines].sort((a, b) => b.rating - a.rating).slice(0, limit)
}
