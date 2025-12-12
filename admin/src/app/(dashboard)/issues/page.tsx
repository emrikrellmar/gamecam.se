import { getIssues } from './actions'
import { CreateIssueDialog } from './create-issue-dialog'
import { DeleteIssueButton } from './delete-issue-button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { format } from 'date-fns'

function getStatusColor(status: string) {
  switch (status) {
    case 'Open':
      return 'bg-green-500 hover:bg-green-600 border-transparent text-white'
    case 'In Progress':
      return 'bg-blue-500 hover:bg-blue-600 border-transparent text-white'
    case 'Resolved':
      return 'bg-gray-500 hover:bg-gray-600 border-transparent text-white'
    default:
      return 'bg-gray-100 text-gray-900 hover:bg-gray-200'
  }
}

function getPriorityColor(priority: string) {
  switch (priority) {
    case 'Low':
      return 'bg-slate-100 text-slate-900 hover:bg-slate-200 border-slate-200'
    case 'Medium':
      return 'bg-blue-100 text-blue-900 hover:bg-blue-200 border-blue-200'
    case 'High':
      return 'bg-orange-100 text-orange-900 hover:bg-orange-200 border-orange-200'
    case 'Critical':
      return 'bg-red-100 text-red-900 hover:bg-red-200 border-red-200'
    default:
      return ''
  }
}

export default async function IssuesPage() {
  const issues = await getIssues()

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Issues & Support</h2>
          <p className="text-muted-foreground">
            Manage support tickets, track bugs, and collaborate on feature requests.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <CreateIssueDialog />
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {issues.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No issues found.
                </TableCell>
              </TableRow>
            ) : (
              issues.map((issue) => (
                <TableRow key={issue.id}>
                  <TableCell className="font-medium">
                    <Link href={`/issues/${issue.id}`} className="hover:underline">
                      {issue.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(issue.status)}>
                      {issue.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getPriorityColor(issue.priority)}>
                      {issue.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>{issue.created_by}</TableCell>
                  <TableCell>
                    {format(new Date(issue.created_at), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell>
                    <DeleteIssueButton issueId={issue.id} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
