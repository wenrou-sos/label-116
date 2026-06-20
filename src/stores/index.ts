import { createPinia } from 'pinia'
import { defineStore } from 'pinia'
import type { User, Wine, TastingRecord, WineList, CreateTastingParams, RegionStats, Comment } from '@/types'
import { userApi, wineApi, tastingApi, wineListApi, statsApi } from '@/api'
import { ref, computed } from 'vue'

export const pinia = createPinia()

export const useUserStore = defineStore('user', () => {
  const currentUser = ref<User | null>(null)
  const loading = ref(false)

  const fetchCurrentUser = async () => {
    loading.value = true
    try {
      currentUser.value = await userApi.getCurrentUser()
    } finally {
      loading.value = false
    }
  }

  const followUser = async (userId: string) => {
    await userApi.followUser(userId)
  }

  const unfollowUser = async (userId: string) => {
    await userApi.unfollowUser(userId)
  }

  return {
    currentUser,
    loading,
    fetchCurrentUser,
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

  const fetchFeed = async (page: number = 1, pageSize: number = 10) => {
    loading.value = true
    try {
      const result = await tastingApi.getFeed(page, pageSize)
      if (page === 1) {
        feedRecords.value = result.records
      } else {
        feedRecords.value = [...feedRecords.value, ...result.records]
      }
      total.value = result.total
      return result
    } finally {
      loading.value = false
    }
  }

  const fetchMyRecords = async (userId: string) => {
    loading.value = true
    try {
      myRecords.value = await tastingApi.getMyTastingRecords(userId)
      return myRecords.value
    } finally {
      loading.value = false
    }
  }

  const fetchRecordById = async (id: string) => {
    loading.value = true
    try {
      currentRecord.value = await tastingApi.getTastingRecord(id)
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
  }

  const addComment = async (recordId: string, content: string) => {
    const comment = await tastingApi.addComment(recordId, content)
    const record = feedRecords.value.find(r => r.id === recordId)
    if (record) {
      record.comments.push(comment)
      record.commentsCount++
    }
    if (currentRecord.value?.id === recordId) {
      currentRecord.value.comments.push(comment)
      currentRecord.value.commentsCount++
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

  const fetchWineLists = async (page: number = 1, pageSize: number = 10) => {
    loading.value = true
    try {
      const result = await wineListApi.getWineLists(page, pageSize)
      if (page === 1) {
        wineLists.value = result.lists
      } else {
        wineLists.value = [...wineLists.value, ...result.lists]
      }
      total.value = result.total
      return result
    } finally {
      loading.value = false
    }
  }

  const fetchMyWineLists = async (userId: string) => {
    loading.value = true
    try {
      myWineLists.value = await wineListApi.getMyWineLists(userId)
      return myWineLists.value
    } finally {
      loading.value = false
    }
  }

  const fetchListById = async (id: string) => {
    loading.value = true
    try {
      currentList.value = await wineListApi.getWineListById(id)
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

  const updateList = async (id: string, params: { title?: string, description?: string, wineIds?: string[] }) => {
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
    likeList
  }
})

export const useStatsStore = defineStore('stats', () => {
  const regionStats = ref<RegionStats[]>([])
  const userStats = ref<{ totalTastings: number, regions: RegionStats[] } | null>(null)
  const loading = ref(false)

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

  return {
    regionStats,
    userStats,
    loading,
    totalTastingsCount,
    regionsVisited,
    countriesVisited,
    fetchRegionStats,
    fetchUserStats
  }
})
