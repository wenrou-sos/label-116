import { ref } from 'vue'

const CACHE_PREFIX = 'wine_app_cache_'
const CACHE_TTL = 1000 * 60 * 30

interface CacheItem<T> {
  data: T
  timestamp: number
  ttl: number
}

export function useCache() {
  const isOnline = ref(navigator.onLine)

  const setCache = <T>(key: string, data: T, ttl: number = CACHE_TTL): void => {
    try {
      const cacheItem: CacheItem<T> = {
        data,
        timestamp: Date.now(),
        ttl
      }
      localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(cacheItem))
    } catch (e) {
      console.warn('Cache set failed:', e)
    }
  }

  const getCache = <T>(key: string): T | null => {
    try {
      const cached = localStorage.getItem(CACHE_PREFIX + key)
      if (!cached) return null

      const cacheItem: CacheItem<T> = JSON.parse(cached)
      const now = Date.now()

      if (now - cacheItem.timestamp > cacheItem.ttl) {
        localStorage.removeItem(CACHE_PREFIX + key)
        return null
      }

      return cacheItem.data
    } catch (e) {
      console.warn('Cache get failed:', e)
      return null
    }
  }

  const removeCache = (key: string): void => {
    try {
      localStorage.removeItem(CACHE_PREFIX + key)
    } catch (e) {
      console.warn('Cache remove failed:', e)
    }
  }

  const clearAllCache = (): void => {
    try {
      const keys = Object.keys(localStorage)
      keys.forEach(key => {
        if (key.startsWith(CACHE_PREFIX)) {
          localStorage.removeItem(key)
        }
      })
    } catch (e) {
      console.warn('Clear cache failed:', e)
    }
  }

  const clearExpiredCache = (): void => {
    try {
      const keys = Object.keys(localStorage)
      const now = Date.now()
      keys.forEach(key => {
        if (key.startsWith(CACHE_PREFIX)) {
          const cached = localStorage.getItem(key)
          if (cached) {
            try {
              const cacheItem: CacheItem<unknown> = JSON.parse(cached)
              if (now - cacheItem.timestamp > cacheItem.ttl) {
                localStorage.removeItem(key)
              }
            } catch {
              localStorage.removeItem(key)
            }
          }
        }
      })
    } catch (e) {
      console.warn('Clear expired cache failed:', e)
    }
  }

  const invalidateCacheByPrefix = (prefix: string): void => {
    try {
      const keys = Object.keys(localStorage)
      keys.forEach(key => {
        if (key.startsWith(CACHE_PREFIX + prefix)) {
          localStorage.removeItem(key)
        }
      })
    } catch (e) {
      console.warn('Invalidate cache by prefix failed:', e)
    }
  }

  const withCache = async <T>(
    key: string,
    fetchFn: () => Promise<T>,
    options?: { forceRefresh?: boolean; ttl?: number }
  ): Promise<T> => {
    const { forceRefresh = false, ttl = CACHE_TTL } = options || {}

    if (!forceRefresh && isOnline.value) {
      const cached = getCache<T>(key)
      if (cached !== null) {
        return cached
      }
    }

    try {
      const data = await fetchFn()
      if (isOnline.value || forceRefresh) {
        setCache(key, data, ttl)
      }
      return data
    } catch (e) {
      if (!isOnline.value) {
        const cached = getCache<T>(key)
        if (cached !== null) {
          return cached
        }
      }
      throw e
    }
  }

  window.addEventListener('online', () => {
    isOnline.value = true
  })

  window.addEventListener('offline', () => {
    isOnline.value = false
  })

  clearExpiredCache()

  return {
    isOnline,
    setCache,
    getCache,
    removeCache,
    clearAllCache,
    clearExpiredCache,
    invalidateCacheByPrefix,
    withCache
  }
}

export const cacheKey = {
  user: (id: string) => `user_${id}`,
  wine: (id: string) => `wine_${id}`,
  wines: (params?: string) => `wines_${params || 'all'}`,
  feed: (page: number, pageSize: number) => `feed_${page}_${pageSize}`,
  tastingRecord: (id: string) => `record_${id}`,
  userRecords: (userId: string) => `user_records_${userId}`,
  wineLists: (page: number, pageSize: number) => `lists_${page}_${pageSize}`,
  wineList: (id: string) => `list_${id}`,
  userLists: (userId: string) => `user_lists_${userId}`,
  stats: (userId: string) => `stats_${userId}`,
  regionStats: 'region_stats',
  popularWines: 'popular_wines',
  topRatedWines: 'top_rated_wines',
  notifications: () => `notifications_list`,
  unreadCount: () => `notifications_unread_count`
}
