import type { Notification } from '@/types'
import { mockUsers, currentUser } from './users'
import { mockTastingRecords } from './tastingRecords'
import { mockWineLists } from './wineLists'

export const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'like',
    fromUserId: '2',
    fromUser: mockUsers[1],
    targetType: 'record',
    targetId: '1',
    targetTitle: mockTastingRecords[0].wine.name,
    isRead: false,
    createdAt: new Date(Date.now() - 3600000 * 1).toISOString()
  },
  {
    id: '2',
    type: 'comment',
    fromUserId: '3',
    fromUser: mockUsers[2],
    targetType: 'record',
    targetId: '1',
    targetTitle: mockTastingRecords[0].wine.name,
    commentContent: '这款酒真的很棒，我也很喜欢！',
    isRead: false,
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString()
  },
  {
    id: '3',
    type: 'follow',
    fromUserId: '4',
    fromUser: mockUsers[3],
    targetType: 'user',
    targetId: currentUser.id,
    isRead: false,
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    id: '4',
    type: 'collect',
    fromUserId: '5',
    fromUser: mockUsers[4],
    targetType: 'list',
    targetId: '1',
    targetTitle: mockWineLists[0].title,
    isRead: false,
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    id: '5',
    type: 'like',
    fromUserId: '6',
    fromUser: mockUsers[5],
    targetType: 'record',
    targetId: '6',
    targetTitle: mockTastingRecords[5].wine.name,
    isRead: true,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: '6',
    type: 'comment',
    fromUserId: '2',
    fromUser: mockUsers[1],
    targetType: 'record',
    targetId: '6',
    targetTitle: mockTastingRecords[5].wine.name,
    commentContent: '写得很专业，学到了很多。',
    isRead: true,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: '7',
    type: 'follow',
    fromUserId: '3',
    fromUser: mockUsers[2],
    targetType: 'user',
    targetId: currentUser.id,
    isRead: true,
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString()
  },
  {
    id: '8',
    type: 'like',
    fromUserId: '5',
    fromUser: mockUsers[4],
    targetType: 'record',
    targetId: '1',
    targetTitle: mockTastingRecords[0].wine.name,
    isRead: true,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: '9',
    type: 'collect',
    fromUserId: '2',
    fromUser: mockUsers[1],
    targetType: 'list',
    targetId: '1',
    targetTitle: mockWineLists[0].title,
    isRead: true,
    createdAt: new Date(Date.now() - 86400000 * 6).toISOString()
  }
]

export const getNotifications = (): Notification[] => {
  return [...mockNotifications].sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

export const markNotificationRead = (id: string): void => {
  const notification = mockNotifications.find(n => n.id === id)
  if (notification) {
    notification.isRead = true
  }
}

export const markAllNotificationsRead = (): void => {
  mockNotifications.forEach(n => {
    n.isRead = true
  })
}

export const deleteNotification = (id: string): void => {
  const index = mockNotifications.findIndex(n => n.id === id)
  if (index > -1) {
    mockNotifications.splice(index, 1)
  }
}

export const getUnreadCount = (): number => {
  return mockNotifications.filter(n => !n.isRead).length
}
