'use client'

import { useState, useEffect } from 'react'
import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { getNotifications, markAsRead, markAllAsRead, Notification } from '@/lib/notifications-actions'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'

export function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [userId, setUserId] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUserId(user?.id || null)
    }
    fetchUser()
  }, [])

  const fetchNotifications = async () => {
    const data = await getNotifications()
    setNotifications(data)
  }

  useEffect(() => {
    if (!userId) return

    fetchNotifications()

    // Realtime subscription
    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
        },
        (payload) => {
          // Optimistically add new notification
          const newNotification = payload.new as Notification
          setNotifications(prev => [newNotification, ...prev])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId])

  useEffect(() => {
    if (!userId) return
    const count = notifications.filter(n => !n.read_by?.includes(userId)).length
    setUnreadCount(count)
  }, [notifications, userId])

  const handleMarkAsRead = async (id: string) => {
    // Optimistic update
    setNotifications(prev => prev.map(n => {
      if (n.id === id && userId && !n.read_by?.includes(userId)) {
        return { ...n, read_by: [...(n.read_by || []), userId] }
      }
      return n
    }))
    
    await markAsRead(id)
  }

  const handleMarkAllAsRead = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!userId) return
    
    setNotifications(prev => prev.map(n => {
      if (!n.read_by?.includes(userId)) {
        return { ...n, read_by: [...(n.read_by || []), userId] }
      }
      return n
    }))
    
    await markAllAsRead()
  }

  const handleNotificationClick = async (notification: Notification) => {
    if (userId && !notification.read_by?.includes(userId)) {
      await handleMarkAsRead(notification.id)
    }
    if (notification.link) {
      router.push(notification.link)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-600 ring-2 ring-white" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-2 py-1.5">
          <DropdownMenuLabel>Notifications</DropdownMenuLabel>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" className="h-auto text-xs text-muted-foreground px-2 py-1" onClick={handleMarkAllAsRead}>
              Mark all as read
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />
        <div className="max-h-[300px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No notifications
            </div>
          ) : (
            notifications.map((notification) => {
              const isRead = userId ? notification.read_by?.includes(userId) : false
              return (
                <DropdownMenuItem 
                  key={notification.id} 
                  className={`flex flex-col items-start gap-1 p-3 cursor-pointer ${!isRead ? 'bg-blue-50/50' : ''}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex w-full justify-between gap-2">
                    <span className={`text-sm font-medium ${!isRead ? 'text-blue-700' : ''}`}>
                      {notification.title}
                    </span>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {notification.message}
                  </p>
                </DropdownMenuItem>
              )
            })
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
