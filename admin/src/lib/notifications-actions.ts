'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export type Notification = {
  id: string
  title: string
  message: string
  type: 'issue' | 'order'
  reference_id?: string
  link?: string
  read_by: string[]
  created_at: string
}

export async function createNotification(
  title: string,
  message: string,
  type: 'issue' | 'order',
  referenceId?: string,
  link?: string
) {
  const supabase = await createClient()
  
  try {
    await supabase.from('notifications').insert({
      title,
      message,
      type,
      reference_id: referenceId,
      link,
      read_by: []
    })
  } catch (error) {
    console.error('Failed to create notification:', error)
  }
}

export async function getNotifications() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) {
    console.error('Error fetching notifications:', error)
    return []
  }

  return data as Notification[]
}

export async function markAsRead(notificationId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return

  const { data: notification } = await supabase
    .from('notifications')
    .select('read_by')
    .eq('id', notificationId)
    .single()
    
  if (!notification) return

  const readBy = notification.read_by || []
  if (!readBy.includes(user.id)) {
    await supabase
      .from('notifications')
      .update({ read_by: [...readBy, user.id] })
      .eq('id', notificationId)
      
    revalidatePath('/')
  }
}

export async function markAllAsRead() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return

  const { data: notifications } = await supabase
    .from('notifications')
    .select('id, read_by')
    
  if (!notifications) return

  // This is not efficient for many notifications, but fine for now
  for (const notification of notifications) {
    const readBy = notification.read_by || []
    if (!readBy.includes(user.id)) {
      await supabase
        .from('notifications')
        .update({ read_by: [...readBy, user.id] })
        .eq('id', notification.id)
    }
  }
  
  revalidatePath('/')
}
