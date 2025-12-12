'use client'

import { useState } from 'react'
import { Discount, deleteDiscount } from './actions'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Plus, MoreHorizontal, Pencil, Trash2, Tag } from 'lucide-react'
import { format } from 'date-fns'
import { DiscountDialog } from './discount-dialog'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

export function DiscountsClient({ discounts }: { discounts: Discount[] }) {
  const router = useRouter()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async () => {
    if (!deletingId) return
    await deleteDiscount(deletingId)
    setDeletingId(null)
    router.refresh()
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle>Discount Codes</CardTitle>
          <CardDescription>Manage discount codes for your products.</CardDescription>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} size="sm">
          <Plus className="mr-2 h-4 w-4" /> Create Discount
        </Button>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Active Period</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {discounts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                  No discounts found. Create one to get started.
                </TableCell>
              </TableRow>
            ) : (
              discounts.map((discount) => {
                const now = new Date()
                const start = new Date(discount.start_date)
                const end = discount.end_date ? new Date(discount.end_date) : null
                const isActive = now >= start && (!end || now <= end)
                const isScheduled = now < start
                const isExpired = end && now > end

                return (
                  <TableRow key={discount.id}>
                    <TableCell className="font-medium font-mono">{discount.code}</TableCell>
                    <TableCell>{discount.product}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {discount.percentage}% OFF
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(start, 'MMM d, yyyy')}
                      {end ? ` - ${format(end, 'MMM d, yyyy')}` : ' - Forever'}
                    </TableCell>
                    <TableCell>
                      {isActive && <span className="text-green-600 flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-600" /> Active</span>}
                      {isScheduled && <span className="text-yellow-600 flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-yellow-600" /> Scheduled</span>}
                      {isExpired && <span className="text-gray-500 flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-gray-400" /> Expired</span>}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => setEditingDiscount(discount)}>
                            <Pencil className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600" onClick={() => setDeletingId(discount.id)}>
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      <DiscountDialog 
        open={isCreateOpen} 
        onOpenChange={setIsCreateOpen} 
      />

      <DiscountDialog 
        open={!!editingDiscount} 
        onOpenChange={(open) => !open && setEditingDiscount(null)}
        discountToEdit={editingDiscount}
      />

      <AlertDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the discount code.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      </CardContent>
    </Card>
  )
}
