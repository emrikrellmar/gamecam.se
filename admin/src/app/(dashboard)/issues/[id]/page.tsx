import { getIssue, getComments } from '../actions'
import { StatusSelector, CommentForm, CommentItem } from './issue-details-client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { format } from 'date-fns'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'

export default async function IssuePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const issue = await getIssue(id)
  
  if (!issue) {
    notFound()
  }

  const comments = await getComments(id)
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center space-x-4">
          <Link 
            href="/issues" 
            className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Issues
          </Link>
        </div>

        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Issue Details</h2>
          <StatusSelector issueId={issue.id} currentStatus={issue.status} />
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <CardTitle className="text-2xl">{issue.title}</CardTitle>
                  <CardDescription>
                    Created by {issue.created_by} on {format(new Date(issue.created_at), 'PPP')}
                  </CardDescription>
                </div>
                <Badge variant={issue.priority === 'Critical' ? 'destructive' : 'outline'}>
                  {issue.priority} Priority
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                {issue.description}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Comments</h3>
            {comments.length === 0 ? (
              <p className="text-sm text-muted-foreground">No comments yet.</p>
            ) : (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <CommentItem 
                    key={comment.id} 
                    comment={comment} 
                    currentUserEmail={user?.email}
                    issueId={issue.id}
                  />
                ))}
              </div>
            )}
            
            <Card>
              <CardContent className="p-4">
                <CommentForm issueId={issue.id} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
