import { createPinia } from 'pinia'
import { defineStore } from 'pinia'
import type { User, Wine, TastingRecord, WineList, CreateTastingParams, RegionStats, Comment } from '@/types'
import { userApi, wineApi, tastingApi, wineListApi, statsApi } from '@/api'
import { ref, computed } from 'vue'

export const pinia = createPinia()

export const useUserStore = defineStore('user', () => {
  const currentUser = ref<User | null>(null)
  const loading = ref(false)
  const followingIds = ref<Set<string>>(new Set())

  const fetchCurrentUser = async () => {
    loading.value = true
    try {
      currentUser.value = await userApi.getCurrentUser()
    } finally {
      loading.value = false
    }
  }

  const isFollowing = (userId: string) => {
    return followingIds.value.has(userId)
  }

  const followUser = async (userId: string) => {
    await userApi.followUser(userId)
    followingIds.value.add(userId)
  }

  const unfollowUser = async (userId: string) => {
    await userApi.unfollowUser(userId)
    followingIds.value.delete(userId)
  }

  return {
    currentUser,
    loading,
    followingIds,
    fetchCurrentUser,
    isFollowing,
    followUser,
    unfollowUser
  }
})

export const useWineStore = defineStore('wine', () => {
  const wines = ref<Wine[]>([])
  const currentWine = ref<Wine | null>(null)
  const searchResults = ref<Wine[]>([])
  const popularWines = ref<Wine[]>([])
  const topRatedWines = ref<Wine[]>([])
  const loading = ref(false)

  const fetchWines = async (params?: {
    page?: number, pageSize?: number, region?: string, 
    type?: Wine['type'], variety?: string
  }) => {
    loading.value = true
    try {
      const result = await wineApi.getWineList(params)
      wines.value = result.wines
      return result
    } finally {
      loading.value = false
    }
  }

  const fetchWineById = async (id: string) => {
    loading.value = true
    try {
      currentWine.value = await wineApi.getWineById(id)
      return currentWine.value
    } finally {
      loading.value = false
    }
  }

  const searchWines = async (keyword: string) => {
    loading.value = true
    try {
      searchResults.value = await wineApi.searchWines(keyword)
      return searchResults.value
    } finally {
      loading.value = false
    }
  }

  const scanBarcode = async (barcode: string) => {
    loading.value = true
    try {
      const wine = await wineApi.scanBarcode(barcode)
      currentWine.value = wine
      return wine
    } finally {
      loading.value = false
    }
  }

  const fetchPopularWines = async (limit?: number) => {
    loading.value = true
    try {
      popularWines.value = await wineApi.getPopularWines(limit)
      return popularWines.value
    } finally {
      loading.value = false
    }
  }

  const fetchTopRatedWines = async (limit?: number) => {
    loading.value = true
    try {
      topRatedWines.value = await wineApi.getTopRatedWines(limit)
      return topRatedWines.value
    } finally {
      loading.value = false
    }
  }

  return {
    wines,
    currentWine,
    searchResults,
    popularWines,
    topRatedWines,
    loading,
    fetchWines,
    fetchWineById,
    searchWines,
    scanBarcode,
    fetchPopularWines,
    fetchTopRatedWines
  }
})

export const useTastingStore = defineStore('tasting', () => {
  const feedRecords = ref<TastingRecord[]>([])
  const myRecords = ref<TastingRecord[]>([])
  const currentRecord = ref<TastingRecord | null>(null)
  const total = ref(0)
  const loading = ref(false)

  const mergeRecordModifications = (
    fetchedRecords: TastingRecord[],
    localMap: Map<string, TastingRecord>
  ): TastingRecord[] => {
    return fetchedRecords.map(fetched => {
      const local = localMap.get(fetched.id)
      if (!local) return fetched
      let hasChanges = false
      const merged: TastingRecord = { ...fetched }
      if (local.isLiked !== fetched.isLiked) {
        merged.isLiked = local.isLiked
        hasChanges = true
      }
      if (local.likes !== fetched.likes) {
        merged.likes = local.likes
        hasChanges = true
      }
      if (local.commentsCount !== fetched.commentsCount || local.comments.length !== fetched.comments.length) {
        merged.comments = local.comments
        merged.commentsCount = local.commentsCount
        hasChanges = true
      }
      return hasChanges ? merged : fetched
    })
  }

  const fetchFeed = async (page: number = 1, pageSize: number = 10) => {
    loading.value = true
    try {
      const localFeedMap = new Map(feedRecords.value.map(r => [r.id, r]))
      const result = await tastingApi.getFeed(page, pageSize)
      const mergedRecords = mergeRecordModifications(result.records, localFeedMap)
      if (page === 1) {
        feedRecords.value = mergedRecords
      } else {
        const existingIds = new Set(feedRecords.value.map(r => r.id))
        const newOnes = mergedRecords.filter(r => !existingIds.has(r.id))
        feedRecords.value = [...feedRecords.value, ...newOnes]
      }
      total.value = result.total
      return { ...result, records: page === 1 ? mergedRecords : result.records }
    } finally {
      loading.value = false
    }
  }

  const fetchMyRecords = async (userId: string) => {
    loading.value = true
    try {
      const localMyMap = new Map(myRecords.value.map(r => [r.id, r]))
      const fetched = await tastingApi.getMyTastingRecords(userId)
      myRecords.value = mergeRecordModifications(fetched, localMyMap)
      return myRecords.value
    } finally {
      loading.value = false
    }
  }

  const fetchRecordById = async (id: string) => {
    loading.value = true
    try {
      const fetched = await tastingApi.getTastingRecord(id)
      let merged = fetched
      const localFeed = feedRecords.value.find(r => r.id === id)
      const localMy = myRecords.value.find(r => r.id === id)
      const local = localFeed || localMy
      if (local) {
        merged = mergeRecordModifications([fetched], new Map([[id, local]]))[0]
      }
      currentRecord.value = merged
      return currentRecord.value
    } finally {
      loading.value = false
    }
  }

  const createRecord = async (params: CreateTastingParams) => {
    loading.value = true
    try {
      const record = await tastingApi.createTastingRecord(params)
      feedRecords.value.unshift(record)
      myRecords.value.unshift(record)
      return record
    } finally {
      loading.value = false
    }
  }

  const likeRecord = async (recordId: string) => {
    await tastingApi.likeRecord(recordId)
    const record = feedRecords.value.find(r => r.id === recordId)
    if (record) {
      record.isLiked = !record.isLiked
      record.likes += record.isLiked ? 1 : -1
    }
    const myRecord = myRecords.value.find(r => r.id === recordId)
    if (myRecord) {
      myRecord.isLiked = !myRecord.isLiked
      myRecord.likes += myRecord.isLiked ? 1 : -1
    }
    if (currentRecord.value?.id === recordId) {
      currentRecord.value.isLiked = !currentRecord.value.isLiked
      currentRecord.value.likes += currentRecord.value.isLiked ? 1 : -1
    }
  }

  const addComment = async (recordId: string, content: string) => {
    const comment = await tastingApi.addComment(recordId, content)
    const record = feedRecords.value.find(r => r.id === recordId)
    if (record && !record.comments.find(c => c.id === comment.id)) {
      record.comments.push(comment)
      record.commentsCount++
    }
    if (currentRecord.value?.id === recordId && !currentRecord.value.comments.find(c => c.id === comment.id)) {
      currentRecord.value.comments.push(comment)
      currentRecord.value.commentsCount++
    }
    const myRecord = myRecords.value.find(r => r.id === recordId)
    if (myRecord && !myRecord.comments.find(c => c.id === comment.id)) {
      myRecord.comments.push(comment)
      myRecord.commentsCount++
    }
    return comment
  }

  return {
    feedRecords,
    myRecords,
    currentRecord,
    total,
    loading,
    fetchFeed,
    fetchMyRecords,
    fetchRecordById,
    createRecord,
    likeRecord,
    addComment
  }
})

export const useWineListStore = defineStore('wineList', () => {
  const wineLists = ref<WineList[]>([])
  const myWineLists = ref<WineList[]>([])
  const currentList = ref<WineList | null>(null)
  const total = ref(0)
  const loading = ref(false)

  const mergeListModifications = (
    fetchedLists: WineList[],
    localMap: Map<string, WineList>
  ): WineList[] => {
    return fetchedLists.map(fetched => {
      const local = localMap.get(fetched.id)
      if (!local) return fetched
      let hasChanges = false
      const merged: WineList = { ...fetched }
      if (local.isLiked !== fetched.isLiked) {
        merged.isLiked = local.isLiked
        hasChanges = true
      }
      if (local.likes !== fetched.likes) {
        merged.likes = local.likes
        hasChanges = true
      }
      if (local.wines.length !== fetched.wines.length) {
        merged.wines = local.wines
        hasChanges = true
      }
      if (local.coverImage !== fetched.coverImage) {
        merged.coverImage = local.coverImage
        hasChanges = true
      }
      if (local.title !== fetched.title || local.description !== fetched.description) {
        merged.title = local.title
        merged.description = local.description
        hasChanges = true
      }
      return hasChanges ? merged : fetched
    })
  }

  const fetchWineLists = async (page: number = 1, pageSize: number = 10) => {
    loading.value = true
    try {
      const localMap = new Map(wineLists.value.map(l => [l.id, l]))
      const result = await wineListApi.getWineLists(page, pageSize)
      const mergedLists = mergeListModifications(result.lists, localMap)
      if (page === 1) {
        wineLists.value = mergedLists
      } else {
        const existingIds = new Set(wineLists.value.map(l => l.id))
        const newOnes = mergedLists.filter(l => !existingIds.has(l.id))
        wineLists.value = [...wineLists.value, ...newOnes]
      }
      total.value = result.total
      return { ...result, lists: page === 1 ? mergedLists : result.lists }
    } finally {
      loading.value = false
    }
  }

  const fetchMyWineLists = async (userId: string) => {
    loading.value = true
    try {
      const localMap = new Map(myWineLists.value.map(l => [l.id, l]))
      const fetched = await wineListApi.getMyWineLists(userId)
      myWineLists.value = mergeListModifications(fetched, localMap)
      return myWineLists.value
    } finally {
      loading.value = false
    }
  }

  const fetchListById = async (id: string) => {
    loading.value = true
    try {
      const fetched = await wineListApi.getWineListById(id)
      let merged = fetched
      const localAll = wineLists.value.find(l => l.id === id)
      const localMy = myWineLists.value.find(l => l.id === id)
      const local = localAll || localMy
      if (local) {
        merged = mergeListModifications([fetched], new Map([[id, local]]))[0]
      }
      currentList.value = merged
      return currentList.value
    } finally {
      loading.value = false
    }
  }

  const createList = async (params: { title: string, description: string, wineIds: string[] }) => {
    loading.value = true
    try {
      const list = await wineListApi.createWineList(params)
      wineLists.value.unshift(list)
      myWineLists.value.unshift(list)
      return list
    } finally {
      loading.value = false
    }
  }

  const updateList = async (id: string, params: { title?: string, description?: string, wineIds?: string[], coverImage?: string }) => {
    loading.value = true
    try {
      const list = await wineListApi.updateWineList(id, params)
      const index = wineLists.value.findIndex(l => l.id === id)
      if (index > -1) wineLists.value[index] = list
      const myIndex = myWineLists.value.findIndex(l => l.id === id)
      if (myIndex > -1) myWineLists.value[myIndex] = list
      return list
    } finally {
      loading.value = false
    }
  }

  const deleteList = async (id: string) => {
    loading.value = true
    try {
      await wineListApi.deleteWineList(id)
      wineLists.value = wineLists.value.filter(l => l.id !== id)
      myWineLists.value = myWineLists.value.filter(l => l.id !== id)
    } finally {
      loading.value = false
    }
  }

  const likeList = async (listId: string) => {
    await wineListApi.likeWineList(listId)
    const list = wineLists.value.find(l => l.id === listId)
    if (list) {
      list.isLiked = !list.isLiked
      list.likes += list.isLiked ? 1 : -1
    }
    const myList = myWineLists.value.find(l => l.id === listId)
    if (myList) {
      myList.isLiked = !myList.isLiked
      myList.likes += myList.isLiked ? 1 : -1
    }
  }

  const addWineToList = async (listId: string, wineId: string) => {
    const updatedList = await wineListApi.addWineToList(listId, wineId)
    const listIndex = wineLists.value.findIndex(l => l.id === listId)
    if (listIndex > -1) {
      wineLists.value[listIndex] = updatedList
    }
    const myIndex = myWineLists.value.findIndex(l => l.id === listId)
    if (myIndex > -1) {
      myWineLists.value[myIndex] = updatedList
    }
    if (currentList.value?.id === listId) {
      currentList.value = updatedList
    }
    return updatedList
  }

  return {
    wineLists,
    myWineLists,
    currentList,
    total,
    loading,
    fetchWineLists,
    fetchMyWineLists,
    fetchListById,
    createList,
    updateList,
    deleteList,
    likeList,
    addWineToList
  }
})

export const useStatsStore = defineStore('stats', () => {
  const regionStats = ref<RegionStats[]>([])
  const userStats = ref<{ totalTastings: number, regions: RegionStats[] } | null>(null)
  const loading = ref(false)
  const tastingStore = useTastingStore()

  const wineTypeLabels: Record<string, string> = {
    red: '红葡萄酒',
    white: '白葡萄酒',
    sparkling: '起泡酒',
    dessert: '甜酒',
    whiskey: '威士忌',
    brandy: '白兰地',
    other: '其他'
  }

  const fetchRegionStats = async () => {
    loading.value = true
    try {
      regionStats.value = await statsApi.getRegionStats()
      return regionStats.value
    } finally {
      loading.value = false
    }
  }

  const fetchUserStats = async (userId: string) => {
    loading.value = true
    try {
      userStats.value = await statsApi.getUserStats(userId)
      return userStats.value
    } finally {
      loading.value = false
    }
  }

  const totalTastingsCount = computed(() => userStats.value?.totalTastings || 0)
  const regionsVisited = computed(() => userStats.value?.regions.length || 0)
  const countriesVisited = computed(() => {
    if (!userStats.value) return 0
    return new Set(userStats.value.regions.map(r => r.country)).size
  })

  const monthlyTrend = computed(() => {
    const records = tastingStore.myRecords
    if (records.length === 0) {
      return { months: [], counts: [] }
    }

    const monthMap = new Map<string, number>()
    const now = new Date()

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      monthMap.set(key, 0)
    }

    records.forEach(record => {
      const date = new Date(record.createdAt)
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      if (monthMap.has(key)) {
        monthMap.set(key, monthMap.get(key)! + 1)
      }
    })

    const months: string[] = []
    const counts: number[] = []
    monthMap.forEach((count, month) => {
      const [, m] = month.split('-')
      months.push(`${parseInt(m)}月`)
      counts.push(count)
    })

    return { months, counts }
  })

  const typeDistribution = computed(() => {
    const records = tastingStore.myRecords
    if (records.length === 0) {
      return { types: [], counts: [], colors: [] }
    }

    const typeCount = new Map<string, number>()
    records.forEach(record => {
      const type = record.wine.type
      typeCount.set(type, (typeCount.get(type) || 0) + 1)
    })

    const colorMap: Record<string, string> = {
      red: '#E74C3C',
      white: '#F1C40F',
      sparkling: '#3498DB',
      dessert: '#E91E63',
      whiskey: '#D35400',
      brandy: '#8E44AD',
      other: '#95A5A6'
    }

    const types: string[] = []
    const counts: number[] = []
    const colors: string[] = []

    typeCount.forEach((count, type) => {
      types.push(wineTypeLabels[type] || type)
      counts.push(count)
      colors.push(colorMap[type] || '#95A5A6')
    })

    return { types, counts, colors }
  })

  const regionStatsBar = computed(() => {
    const records = tastingStore.myRecords
    if (records.length === 0) {
      return { regions: [], counts: [], countries: [] }
    }

    const regionMap = new Map<string, { count: number; country: string }>()
    records.forEach(record => {
      const region = record.wine.region
      const country = record.wine.country
      if (!regionMap.has(region)) {
        regionMap.set(region, { count: 0, country })
      }
      regionMap.get(region)!.count++
    })

    const sorted = Array.from(regionMap.entries())
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 8)

    return {
      regions: sorted.map(r => r[0]),
      counts: sorted.map(r => r[1].count),
      countries: sorted.map(r => r[1].country)
    }
  })

  const averageRating = computed(() => {
    const records = tastingStore.myRecords
    if (records.length === 0) return 0
    const total = records.reduce((sum, r) => {
      const avg = (r.rating.color + r.rating.aroma + r.rating.taste + r.rating.finish) / 4
      return sum + avg
    }, 0)
    return Math.round((total / records.length) * 10) / 10
  })

  const monthlyCount = computed(() => {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    return tastingStore.myRecords.filter(r => {
      const d = new Date(r.createdAt)
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear
    }).length
  })

  const keyMetrics = computed(() => ({
    totalTastings: totalTastingsCount.value,
    averageRating: averageRating.value,
    monthlyCount: monthlyCount.value,
    regionsVisited: regionsVisited.value,
    countriesVisited: countriesVisited.value
  }))

  return {
    regionStats,
    userStats,
    loading,
    totalTastingsCount,
    regionsVisited,
    countriesVisited,
    monthlyTrend,
    typeDistribution,
    regionStatsBar,
    averageRating,
    monthlyCount,
    keyMetrics,
    fetchRegionStats,
    fetchUserStats,
    wineTypeLabels
  }
})
