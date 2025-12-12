'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { createNotification } from '@/lib/notifications-actions'

export async function getIssues() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('issues')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching issues:', error)
    return []
  }

  return data
}

export async function getIssue(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('issues')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching issue:', error)
    return null
  }

  return data
}

export async function createIssue(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const priority = formData.get('priority') as string

  const { data: issue, error } = await supabase.from('issues').insert({
    title,
    description,
    priority,
    status: 'Open',
    created_by: user?.email || 'Anonymous'
  }).select().single()

  if (error) {
    console.error('Error creating issue:', error)
    return { success: false, error: error.message }
  }

  if (issue) {
    await createNotification(
      'New Issue',
      `New issue "${title}" created by ${user?.email || 'Anonymous'}`,
      'issue',
      issue.id,
      `/issues`
    )
  }

  revalidatePath('/issues')
  return { success: true }
}

export async function updateIssueStatus(id: string, status: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('issues')
    .update({ status })
    .eq('id', id)

  if (error) {
    console.error('Error updating issue status:', error)
    return { success: false, error: error.message }
  }

  revalidatePath(`/issues/${id}`)
  revalidatePath('/issues')
  return { success: true }
}

export async function deleteIssue(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('issues')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting issue:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/issues')
  return { success: true }
}

export async function getComments(issueId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('issue_comments')
    .select('*')
    .eq('issue_id', issueId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching comments:', error)
    return []
  }

  return data
}

export async function addComment(issueId: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const content = formData.get('content') as string

  const { error } = await supabase.from('issue_comments').insert({
    issue_id: issueId,
    content,
    created_by: user?.email || 'Anonymous'
  })

  if (error) {
    console.error('Error adding comment:', error)
    return { success: false, error: error.message }
  }

  // Fetch issue details for notification
  const { data: issue } = await supabase
    .from('issues')
    .select('title')
    .eq('id', issueId)
    .single()

  if (issue) {
    await createNotification(
      'New Comment',
      `New comment on issue "${issue.title}" by ${user?.email || 'Anonymous'}`,
      'issue',
      issueId,
      `/issues`
    )
  }

  revalidatePath(`/issues/${issueId}`)
  return { success: true }
}

export async function deleteComment(commentId: string, issueId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'Unauthorized' }
  }

  // First check if the comment belongs to the user
  const { data: comment, error: fetchError } = await supabase
    .from('issue_comments')
    .select('created_by')
    .eq('id', commentId)
    .single()

  if (fetchError || !comment) {
    return { success: false, error: 'Comment not found' }
  }

  if (comment.created_by !== user.email) {
    return { success: false, error: 'Unauthorized' }
  }

  const { error } = await supabase
    .from('issue_comments')
    .delete()
    .eq('id', commentId)

  if (error) {
    console.error('Error deleting comment:', error)
    return { success: false, error: error.message }
  }

  revalidatePath(`/issues/${issueId}`)
  return { success: true }
}
