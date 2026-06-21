import axios from 'axios'
import type { 
  User, Wine, TastingRecord, WineList, 
  CreateTastingParams, RegionStats, Comment 
} from '@/types'
import { 
  mockUsers, currentUser, mockWines, mockTastingRecords, 
  mockWineLists, regionStats, getFeedRecords, getMyRecords, 
  getWineById, searchWines, getWinesByRegion, getWinesByType, 
  getWinesByVariety, getPopularWines, getTopRatedWines,
  getWineLists, getMyWineLists, getWineListById
} from '@/mock'
import { useCache, cacheKey } from '@/composables/useCache'

const USE_MOCK = true
const { withCache, isOnline, removeCache, invalidateCacheByPrefix } = useCache()

const api = axios.create({
  baseURL: '/api',
  timeout: 10000
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

export const userApi = {
  async getCurrentUser(): Promise<User> {
    if (USE_MOCK) return Promise.resolve(currentUser)
    return withCache(cacheKey.user('current'), () => api.get('/user/me'))
  },
  
  async getUserById(id: string): Promise<User> {
    if (USE_MOCK) {
      const user = mockUsers.find(u => u.id === id)
      if (!user) throw new Error('User not found')
      return Promise.resolve(user)
    }
    return withCache(cacheKey.user(id), () => api.get(`/user/${id}`))
  },
  
  async followUser(userId: string): Promise<void> {
    if (USE_MOCK) {
      removeCache(cacheKey.user(userId))
      return Promise.resolve()
    }
    await api.post(`/user/${userId}/follow`)
    removeCache(cacheKey.user(userId))
  },
  
  async unfollowUser(userId: string): Promise<void> {
    if (USE_MOCK) {
      removeCache(cacheKey.user(userId))
      return Promise.resolve()
    }
    await api.delete(`/user/${userId}/follow`)
    removeCache(cacheKey.user(userId))
  }
}

export const wineApi = {
  async getWineList(params?: { 
    page?: number, pageSize?: number, 
    region?: string, type?: Wine['type'], variety?: string 
  }): Promise<{ wines: Wine[], total: number }> {
    const cacheParams = `${params?.page || 1}_${params?.pageSize || 10}_${params?.region || ''}_${params?.type || ''}_${params?.variety || ''}`
    if (USE_MOCK) {
      let wines = [...mockWines]
      if (params?.region) wines = wines.filter(w => w.region === params.region)
      if (params?.type) wines = wines.filter(w => w.type === params.type)
      if (params?.variety) wines = wines.filter(w => w.variety.includes(params.variety!))
      const page = params?.page || 1
      const pageSize = params?.pageSize || 10
      const start = (page - 1) * pageSize
      return Promise.resolve({
        wines: wines.slice(start, start + pageSize),
        total: wines.length
      })
    }
    return withCache(cacheKey.wines(cacheParams), () => api.get('/wines', { params }))
  },
  
  async getWineById(id: string): Promise<Wine> {
    if (USE_MOCK) {
      const wine = getWineById(id)
      if (!wine) throw new Error('Wine not found')
      return Promise.resolve(wine)
    }
    return withCache(cacheKey.wine(id), () => api.get(`/wines/${id}`))
  },
  
  async searchWines(keyword: string): Promise<Wine[]> {
    if (USE_MOCK) return Promise.resolve(searchWines(keyword))
    return api.get('/wines/search', { params: { keyword } })
  },
  
  async scanBarcode(barcode: string): Promise<Wine> {
    if (USE_MOCK) {
      const wine = mockWines.find(w => w.barcode === barcode)
      if (!wine) throw new Error('Wine not found')
      return Promise.resolve(wine)
    }
    return api.get('/wines/scan', { params: { barcode } })
  },
  
  async getWinesByRegion(region: string): Promise<Wine[]> {
    if (USE_MOCK) return Promise.resolve(getWinesByRegion(region))
    return withCache(cacheKey.wines(`region_${region}`), () => api.get('/wines/region', { params: { region } }))
  },
  
  async getWinesByType(type: Wine['type']): Promise<Wine[]> {
    if (USE_MOCK) return Promise.resolve(getWinesByType(type))
    return withCache(cacheKey.wines(`type_${type}`), () => api.get('/wines/type', { params: { type } }))
  },
  
  async getWinesByVariety(variety: string): Promise<Wine[]> {
    if (USE_MOCK) return Promise.resolve(getWinesByVariety(variety))
    return withCache(cacheKey.wines(`variety_${variety}`), () => api.get('/wines/variety', { params: { variety } }))
  },
  
  async getPopularWines(limit?: number): Promise<Wine[]> {
    if (USE_MOCK) return Promise.resolve(getPopularWines(limit))
    return withCache(cacheKey.popularWines, () => api.get('/wines/popular', { params: { limit } }))
  },
  
  async getTopRatedWines(limit?: number): Promise<Wine[]> {
    if (USE_MOCK) return Promise.resolve(getTopRatedWines(limit))
    return withCache(cacheKey.topRatedWines, () => api.get('/wines/top-rated', { params: { limit } }))
  }
}

export const tastingApi = {
  async getFeed(page: number = 1, pageSize: number = 10): Promise<{ records: TastingRecord[], total: number }> {
    if (USE_MOCK) return Promise.resolve(getFeedRecords(page, pageSize))
    return withCache(cacheKey.feed(page, pageSize), () => api.get('/tasting/feed', { params: { page, pageSize } }), { ttl: 1000 * 60 * 5 })
  },
  
  async getMyTastingRecords(userId: string): Promise<TastingRecord[]> {
    if (USE_MOCK) return Promise.resolve(getMyRecords(userId))
    return withCache(cacheKey.userRecords(userId), () => api.get(`/tasting/user/${userId}`))
  },
  
  async getTastingRecord(id: string): Promise<TastingRecord> {
    if (USE_MOCK) {
      const record = mockTastingRecords.find(r => r.id === id)
      if (!record) throw new Error('Record not found')
      return Promise.resolve(record)
    }
    return withCache(cacheKey.tastingRecord(id), () => api.get(`/tasting/${id}`))
  },
  
  async createTastingRecord(params: CreateTastingParams): Promise<TastingRecord> {
    if (USE_MOCK) {
      const wine = getWineById(params.wineId)!
      const newRecord: TastingRecord = {
        id: `record-${Date.now()}`,
        userId: currentUser.id,
        user: currentUser,
        wineId: params.wineId,
        wine,
        rating: params.rating,
        description: params.description,
        scene: params.scene,
        price: params.price,
        purchaseChannel: params.purchaseChannel,
        createdAt: new Date().toISOString(),
        likes: 0,
        isLiked: false,
        comments: [],
        commentsCount: 0
      }
      mockTastingRecords.unshift(newRecord)
      invalidateCacheByPrefix('feed_')
      invalidateCacheByPrefix('user_records_')
      removeCache(cacheKey.stats(currentUser.id))
      return Promise.resolve(newRecord)
    }
    const result = await api.post<any, TastingRecord>('/tasting', params)
    invalidateCacheByPrefix('feed_')
    invalidateCacheByPrefix('user_records_')
    return result
  },
  
  async likeRecord(recordId: string): Promise<void> {
    if (USE_MOCK) {
      const record = mockTastingRecords.find(r => r.id === recordId)
      if (record) {
        record.isLiked = !record.isLiked
        record.likes += record.isLiked ? 1 : -1
      }
      invalidateCacheByPrefix('feed_')
      invalidateCacheByPrefix('user_records_')
      removeCache(cacheKey.tastingRecord(recordId))
      return Promise.resolve()
    }
    await api.post(`/tasting/${recordId}/like`)
    invalidateCacheByPrefix('feed_')
    invalidateCacheByPrefix('user_records_')
    removeCache(cacheKey.tastingRecord(recordId))
  },
  
  async addComment(recordId: string, content: string): Promise<Comment> {
    if (USE_MOCK) {
      const record = mockTastingRecords.find(r => r.id === recordId)
      if (!record) throw new Error('Record not found')
      const newComment: Comment = {
        id: `comment-${Date.now()}`,
        userId: currentUser.id,
        user: currentUser,
        content,
        createdAt: new Date().toISOString()
      }
      record.comments.push(newComment)
      record.commentsCount++
      invalidateCacheByPrefix('feed_')
      invalidateCacheByPrefix('user_records_')
      removeCache(cacheKey.tastingRecord(recordId))
      return Promise.resolve(newComment)
    }
    const result = await api.post<any, Comment>(`/tasting/${recordId}/comment`, { content })
    invalidateCacheByPrefix('feed_')
    invalidateCacheByPrefix('user_records_')
    removeCache(cacheKey.tastingRecord(recordId))
    return result
  }
}

export const wineListApi = {
  async getWineLists(page: number = 1, pageSize: number = 10): Promise<{ lists: WineList[], total: number }> {
    if (USE_MOCK) return Promise.resolve(getWineLists(page, pageSize))
    return withCache(cacheKey.wineLists(page, pageSize), () => api.get('/lists', { params: { page, pageSize } }))
  },
  
  async getMyWineLists(userId: string): Promise<WineList[]> {
    if (USE_MOCK) return Promise.resolve(getMyWineLists(userId))
    return withCache(cacheKey.userLists(userId), () => api.get(`/lists/user/${userId}`))
  },
  
  async getWineListById(id: string): Promise<WineList> {
    if (USE_MOCK) {
      const list = getWineListById(id)
      if (!list) throw new Error('List not found')
      return Promise.resolve(list)
    }
    return withCache(cacheKey.wineList(id), () => api.get(`/lists/${id}`))
  },
  
  async createWineList(params: { title: string, description: string, wineIds: string[] }): Promise<WineList> {
    if (USE_MOCK) {
      const wines = params.wineIds.map(id => getWineById(id)!).filter(Boolean)
      const newList: WineList = {
        id: `list-${Date.now()}`,
        userId: currentUser.id,
        user: currentUser,
        title: params.title,
        description: params.description,
        coverImage: wines[0]?.image || '',
        wines,
        createdAt: new Date().toISOString(),
        likes: 0,
        isLiked: false
      }
      mockWineLists.unshift(newList)
      invalidateCacheByPrefix('lists_')
      invalidateCacheByPrefix('user_lists_')
      return Promise.resolve(newList)
    }
    const result = await api.post<any, WineList>('/lists', params)
    invalidateCacheByPrefix('lists_')
    invalidateCacheByPrefix('user_lists_')
    return result
  },
  
  async updateWineList(id: string, params: { title?: string, description?: string, wineIds?: string[], coverImage?: string }): Promise<WineList> {
    if (USE_MOCK) {
      const list = mockWineLists.find(l => l.id === id)
      if (!list) throw new Error('List not found')
      if (params.title !== undefined) list.title = params.title
      if (params.description !== undefined) list.description = params.description
      if (params.coverImage !== undefined) list.coverImage = params.coverImage
      if (params.wineIds) {
        list.wines = params.wineIds.map(wid => getWineById(wid)!).filter(Boolean)
      }
      invalidateCacheByPrefix('lists_')
      invalidateCacheByPrefix('user_lists_')
      removeCache(cacheKey.wineList(id))
      return Promise.resolve(list)
    }
    const result = await api.put<any, WineList>(`/lists/${id}`, params)
    invalidateCacheByPrefix('lists_')
    invalidateCacheByPrefix('user_lists_')
    removeCache(cacheKey.wineList(id))
    return result
  },
  
  async addWineToList(listId: string, wineId: string): Promise<WineList> {
    if (USE_MOCK) {
      const list = mockWineLists.find(l => l.id === listId)
      if (!list) throw new Error('List not found')
      const wine = getWineById(wineId)
      if (!wine) throw new Error('Wine not found')
      if (!list.wines.find(w => w.id === wineId)) {
        list.wines.push(wine)
      }
      invalidateCacheByPrefix('lists_')
      invalidateCacheByPrefix('user_lists_')
      removeCache(cacheKey.wineList(listId))
      return Promise.resolve(list)
    }
    const result = await api.post<any, WineList>(`/lists/${listId}/wines`, { wineId })
    invalidateCacheByPrefix('lists_')
    invalidateCacheByPrefix('user_lists_')
    removeCache(cacheKey.wineList(listId))
    return result
  },
  
  async deleteWineList(id: string): Promise<void> {
    if (USE_MOCK) {
      const index = mockWineLists.findIndex(l => l.id === id)
      if (index > -1) mockWineLists.splice(index, 1)
      invalidateCacheByPrefix('lists_')
      invalidateCacheByPrefix('user_lists_')
      removeCache(cacheKey.wineList(id))
      return Promise.resolve()
    }
    await api.delete(`/lists/${id}`)
    invalidateCacheByPrefix('lists_')
    invalidateCacheByPrefix('user_lists_')
    removeCache(cacheKey.wineList(id))
  },
  
  async likeWineList(listId: string): Promise<void> {
    if (USE_MOCK) {
      const list = mockWineLists.find(l => l.id === listId)
      if (list) {
        list.isLiked = !list.isLiked
        list.likes += list.isLiked ? 1 : -1
      }
      invalidateCacheByPrefix('lists_')
      invalidateCacheByPrefix('user_lists_')
      removeCache(cacheKey.wineList(listId))
      return Promise.resolve()
    }
    await api.post(`/lists/${listId}/like`)
    invalidateCacheByPrefix('lists_')
    invalidateCacheByPrefix('user_lists_')
    removeCache(cacheKey.wineList(listId))
  }
}

export const statsApi = {
  async getRegionStats(): Promise<RegionStats[]> {
    if (USE_MOCK) return Promise.resolve(regionStats)
    return withCache(cacheKey.regionStats, () => api.get('/stats/regions'))
  },
  
  async getUserStats(userId: string): Promise<{ totalTastings: number, regions: RegionStats[] }> {
    if (USE_MOCK) {
      const userRecords = getMyRecords(userId)
      const regionMap = new Map<string, number>()
      userRecords.forEach(record => {
        const key = record.wine.region
        regionMap.set(key, (regionMap.get(key) || 0) + 1)
      })
      const regions: RegionStats[] = Array.from(regionMap.entries()).map(([region, count]) => {
        const stat = regionStats.find(s => s.region === region)
        return {
          region,
          country: stat?.country || '',
          count,
          lat: stat?.lat || 0,
          lng: stat?.lng || 0
        }
      })
      return Promise.resolve({
        totalTastings: userRecords.length,
        regions
      })
    }
    return withCache(cacheKey.stats(userId), () => api.get(`/stats/user/${userId}`))
  }
}
