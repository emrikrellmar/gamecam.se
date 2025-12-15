'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MoreHorizontal, Pencil, Trash2, LayoutGrid, List, Clock, MapPin, Mail, Phone, Building2 } from 'lucide-react'
import { updateEstimateStatus, deleteEstimate, updateEstimateDetails } from './actions'
import { formatDistanceToNow } from 'date-fns'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export type Estimate = {
  id: string
  name: string
  club_name: string
  email: string
  phone: string
  city: string
  country: string
  products: string
  message: string
  timestamp: string
  status: string
}

const STATUSES = [
  'New',
  'Contacted',
  'Quote Sent',
  'Negotiation',
  'Won',
  'Lost'
]

export function EstimatesBoard({ initialEstimates }: { initialEstimates: Estimate[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [estimates, setEstimates] = useState<Estimate[]>(initialEstimates)
  const [activeTab, setActiveTab] = useState('New')
  
  useEffect(() => {
    const statusParam = searchParams.get('status')
    if (statusParam && STATUSES.includes(statusParam)) {
      setActiveTab(statusParam)
    }
  }, [searchParams])

  useEffect(() => {
    setEstimates(initialEstimates)
  }, [initialEstimates])

  const [selectedEstimateForEdit, setSelectedEstimateForEdit] = useState<Estimate | null>(null)
  const [estimateToDelete, setEstimateToDelete] = useState<string | null>(null)
  
  // View State
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board')

  const handleStatusChange = async (id: string, newStatus: string) => {
    // Optimistic update
    setEstimates(estimates.map(e => e.id === id ? { ...e, status: newStatus } : e))
    
    const result = await updateEstimateStatus(id, newStatus)
    if (!result.success) {
      console.error('Failed to update status')
      router.refresh()
    } else {
      router.refresh()
    }
  }

  const handleDeleteEstimate = async () => {
    if (!estimateToDelete) return

    // Optimistic update
    setEstimates(estimates.filter(e => e.id !== estimateToDelete))
    
    const result = await deleteEstimate(estimateToDelete)
    
    setEstimateToDelete(null)
    
    if (!result.success) {
      console.error('Failed to delete estimate')
      router.refresh()
    } else {
      router.refresh()
    }
  }

  const visibleEstimates = estimates
  const filteredEstimates = visibleEstimates.filter(e => (e.status || 'New') === activeTab)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Estimates CRM</h1>
          <p className="text-muted-foreground">Manage estimate requests and track their status.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center border rounded-md bg-background">
            <Button
              variant={viewMode === 'board' ? 'secondary' : 'ghost'}
              size="sm"
              className="h-8 px-2 rounded-r-none"
              onClick={() => setViewMode('board')}
            >
              <LayoutGrid className="h-4 w-4 mr-2" />
              Board
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="sm"
              className="h-8 px-2 rounded-l-none"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4 mr-2" />
              List
            </Button>
          </div>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {STATUSES.map(status => (
          <Button
            key={status}
            variant={activeTab === status ? 'default' : 'outline'}
            onClick={() => setActiveTab(status)}
            className="whitespace-nowrap"
          >
            {status}
            <Badge variant="secondary" className="ml-2 bg-white/20 text-inherit">
              {visibleEstimates.filter(e => (e.status || 'New') === status).length}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Estimates List/Board */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredEstimates.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-muted-foreground border rounded-lg border-dashed">
            <p>No estimates in this stage.</p>
          </div>
        ) : (
          filteredEstimates.map(estimate => (
            <Card key={estimate.id} className="flex flex-col">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base font-medium">
                      {estimate.name}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <Clock className="h-3 w-3" />
                      {estimate.timestamp ? new Date(estimate.timestamp).toLocaleDateString() : 'Unknown date'}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => setSelectedEstimateForEdit(estimate)}>
                        <Pencil className="mr-2 h-4 w-4" /> Edit Details
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>Move to...</DropdownMenuLabel>
                      {STATUSES.map(status => (
                        <DropdownMenuItem 
                          key={status} 
                          onClick={() => handleStatusChange(estimate.id, status)}
                          disabled={status === (estimate.status || 'New')}
                        >
                          {status}
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setEstimateToDelete(estimate.id)} className="text-red-600 focus:text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col gap-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Building2 className="h-4 w-4 shrink-0" />
                  <span className="truncate">{estimate.club_name}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4 shrink-0" />
                  <a href={`mailto:${estimate.email}`} className="hover:underline truncate">{estimate.email}</a>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4 shrink-0" />
                  <span>{estimate.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4 shrink-0" />
                  <span>{estimate.city}, {estimate.country}</span>
                </div>
                
                <div className="mt-2 pt-2 border-t">
                  <p className="font-medium mb-1">Products:</p>
                  <p className="text-muted-foreground whitespace-pre-wrap text-xs">{estimate.products}</p>
                </div>

                {estimate.message && (
                  <div className="mt-auto pt-2">
                    <div className="bg-muted/50 p-2 rounded text-xs italic">
                      "{estimate.message}"
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!estimateToDelete} onOpenChange={(open) => !open && setEstimateToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the estimate from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteEstimate} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Estimate Modal */}
      {selectedEstimateForEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Edit Estimate</h2>
              <form action={async (formData) => {
                await updateEstimateDetails(selectedEstimateForEdit.id, formData)
                setSelectedEstimateForEdit(null)
                router.refresh()
              }} className="space-y-4">
                
                <div className="space-y-2">
                  <Label htmlFor="clubName">Club / Company Name</Label>
                  <Input id="clubName" name="clubName" required defaultValue={selectedEstimateForEdit.club_name} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Contact Name</Label>
                  <Input id="name" name="name" required defaultValue={selectedEstimateForEdit.name} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" required defaultValue={selectedEstimateForEdit.email} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" name="phone" defaultValue={selectedEstimateForEdit.phone} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" name="city" required defaultValue={selectedEstimateForEdit.city} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input id="country" name="country" required defaultValue={selectedEstimateForEdit.country} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="products">Products</Label>
                  <Textarea id="products" name="products" defaultValue={selectedEstimateForEdit.products} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" name="message" defaultValue={selectedEstimateForEdit.message} />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setSelectedEstimateForEdit(null)}>Cancel</Button>
                  <Button type="submit">Save Changes</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
