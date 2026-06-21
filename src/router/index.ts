import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/stores'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/pages/HomePage.vue'),
    meta: { title: '首页', tabbar: true }
  },
  {
    path: '/explore',
    name: 'explore',
    component: () => import('@/pages/ExplorePage.vue'),
    meta: { title: '发现', tabbar: true }
  },
  {
    path: '/create',
    name: 'create',
    component: () => import('@/pages/CreateRecordPage.vue'),
    meta: { title: '记录品鉴', tabbar: true }
  },
  {
    path: '/messages',
    name: 'messages',
    component: () => import('@/pages/MessagesPage.vue'),
    meta: { title: '消息', tabbar: true }
  },
  {
    path: '/lists',
    name: 'lists',
    component: () => import('@/pages/WineListsPage.vue'),
    meta: { title: '酒单', tabbar: true }
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/pages/ProfilePage.vue'),
    meta: { title: '我的', tabbar: true }
  },
  {
    path: '/wine/:id',
    name: 'wine-detail',
    component: () => import('@/pages/WineDetailPage.vue'),
    meta: { title: '酒款详情', tabbar: false }
  },
  {
    path: '/record/:id',
    name: 'record-detail',
    component: () => import('@/pages/RecordDetailPage.vue'),
    meta: { title: '品鉴详情', tabbar: false }
  },
  {
    path: '/list/:id',
    name: 'list-detail',
    component: () => import('@/pages/WineListDetailPage.vue'),
    meta: { title: '酒单详情', tabbar: false }
  },
  {
    path: '/user/:id',
    name: 'user-profile',
    component: () => import('@/pages/UserProfilePage.vue'),
    meta: { title: '用户主页', tabbar: false }
  },
  {
    path: '/create-list',
    name: 'create-list',
    component: () => import('@/pages/CreateListPage.vue'),
    meta: { title: '创建酒单', tabbar: false }
  },
  {
    path: '/edit-list/:id',
    name: 'edit-list',
    component: () => import('@/pages/CreateListPage.vue'),
    meta: { title: '编辑酒单', tabbar: false }
  },
  {
    path: '/search-wine',
    name: 'search-wine',
    component: () => import('@/pages/SearchWinePage.vue'),
    meta: { title: '选择酒款', tabbar: false }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/pages/DataDashboardPage.vue'),
    meta: { title: '数据看板', tabbar: false }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

let userInitialized = false

router.beforeEach(async (to, _from, next) => {
  document.title = (to.meta.title as string) || '酒友'
  
  if (!userInitialized) {
    try {
      const userStore = useUserStore()
      if (!userStore.currentUser) {
        await userStore.fetchCurrentUser()
      }
      userInitialized = true
    } catch (e) {
      console.error('Failed to initialize user:', e)
    }
  }
  
  next()
})

export default router
