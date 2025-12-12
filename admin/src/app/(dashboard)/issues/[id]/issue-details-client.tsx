'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { addComment, updateIssueStatus, deleteComment } from '../actions'
import { Trash2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { format } from 'date-fns'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

export function StatusSelector({ issueId, currentStatus }: { issueId: string, currentStatus: string }) {
  const [loading, setLoading] = useState(false)

  async function handleStatusChange(value: string) {
    setLoading(true)
    await updateIssueStatus(issueId, value)
    setLoading(false)
  }

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium">Status:</span>
      <select
        className="h-9 w-[150px] rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        value={currentStatus}
        onChange={(e) => handleStatusChange(e.target.value)}
        disabled={loading}
      >
        <option value="Open">Open</option>
        <option value="In Progress">In Progress</option>
        <option value="Resolved">Resolved</option>
      </select>
    </div>
  )
}

export function CommentItem({ comment, currentUserEmail, issueId }: { comment: any, currentUserEmail: string | undefined, issueId: string }) {
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    setDeleting(true)
    await deleteComment(comment.id, issueId)
    setDeleting(false)
  }

  const isOwner = currentUserEmail && comment.created_by === currentUserEmail

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start space-x-4">
          <Avatar className="h-8 w-8">
            <AvatarFallback>
              {comment.created_by.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1 flex-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium leading-none">{comment.created_by}</p>
              <div className="flex items-center space-x-2">
                <p className="text-xs text-muted-foreground">
                  {format(new Date(comment.created_at), 'MMM d, h:mm a')}
                </p>
                {isOwner && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Comment?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this comment? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                          {deleting ? 'Deleting...' : 'Delete'}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </div>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {comment.content}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function CommentForm({ issueId }: { issueId: string }) {
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('')

  async function handleSubmit(formData: FormData) {
    if (!content.trim()) return
    setLoading(true)
    await addComment(issueId, formData)
    setContent('')
    setLoading(false)
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <textarea
        name="content"
        placeholder="Add a comment..."
        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading ? 'Posting...' : 'Post Comment'}
        </Button>
      </div>
    </form>
  )
}
