'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { RefreshCw, Plus, MoreHorizontal, Check, Truck, Package, FileText, UserCheck, Pencil, Trash2, LayoutGrid, List, Archive, Clock } from 'lucide-react'
import { syncOrders, addOrder, updateOrderStatus, updateOrderDetails, deleteOrder, sendUpdateEmail } from './actions'
import { OrdersTable } from './orders-table'
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

// Define the Supabase Order type (slightly different from Google Sheets one potentially)
export type SupabaseOrder = {
  id: string
  order_id: string
  customer_name: string
  product: string
  quantity: string
  company: string
  company_name: string
  tax_vat_number: string
  delivery_address: string
  phone_number: string
  email: string
  message: string
  timestamp: string
  status: string
  created_at: string
  tracking_number?: string
  status_updated_at?: string
}

const STATUSES = [
  'Order placed',
  'Invoice payed',
  'Preparing order',
  'Shipped',
  'Onboarding done'
]

export function OrdersBoard({ initialOrders }: { initialOrders: SupabaseOrder[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [orders, setOrders] = useState<SupabaseOrder[]>(initialOrders)
  const [isSyncing, setIsSyncing] = useState(false)
  const [activeTab, setActiveTab] = useState('Order placed')
  
  useEffect(() => {
    const statusParam = searchParams.get('status')
    if (statusParam && STATUSES.includes(statusParam)) {
      setActiveTab(statusParam)
    }
  }, [searchParams])

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<SupabaseOrder | null>(null)
  const [selectedOrderForEdit, setSelectedOrderForEdit] = useState<SupabaseOrder | null>(null)
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null)
  
  // Add Order State
  const [addProductType, setAddProductType] = useState('GAMETRAQ')

  // Tracking Modal State
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false)
  const [trackingOrder, setTrackingOrder] = useState<string | null>(null)
  const [trackingNumber, setTrackingNumber] = useState('')

  // Email Confirmation State
  const [isEmailConfirmOpen, setIsEmailConfirmOpen] = useState(false)
  const [emailConfirmType, setEmailConfirmType] = useState<'preparing' | 'shipped'>('preparing')
  const [emailConfirmOrder, setEmailConfirmOrder] = useState<SupabaseOrder | null>(null)
  const [emailTrackingNumber, setEmailTrackingNumber] = useState<string | undefined>(undefined)
  
  // View State
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board')

  useEffect(() => {
    setOrders(initialOrders)
  }, [initialOrders])

  const handleSync = async () => {
    setIsSyncing(true)
    try {
      const result = await syncOrders()
      if (result.success) {
        router.refresh()
      }
    } catch (error) {
      console.error('Sync failed', error)
    } finally {
      setIsSyncing(false)
    }
  }

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    const order = orders.find(o => o.id === orderId)
    if (!order) return

    if (newStatus === 'Shipped') {
      setTrackingOrder(orderId)
      setIsTrackingModalOpen(true)
      return
    }

    if (newStatus === 'Preparing order') {
      setEmailConfirmOrder(order)
      setEmailConfirmType('preparing')
      setIsEmailConfirmOpen(true)
    }

    // Optimistic update
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
    
    const result = await updateOrderStatus(orderId, newStatus)
    if (!result.success) {
      // Revert
      console.error('Failed to update status')
      router.refresh() // Revert by refreshing
    } else {
      router.refresh()
    }
  }

  const confirmShippedStatus = async () => {
    if (!trackingOrder) return
    
    const order = orders.find(o => o.id === trackingOrder)

    // Optimistic update
    setOrders(orders.map(o => o.id === trackingOrder ? { ...o, status: 'Shipped', tracking_number: trackingNumber } : o))
    
    const result = await updateOrderStatus(trackingOrder, 'Shipped', trackingNumber)
    
    setIsTrackingModalOpen(false)
    
    // Open email confirmation
    if (order) {
      setEmailConfirmOrder(order)
      setEmailConfirmType('shipped')
      setEmailTrackingNumber(trackingNumber)
      setIsEmailConfirmOpen(true)
    }

    setTrackingOrder(null)
    setTrackingNumber('')
    
    if (!result.success) {
      console.error('Failed to update status')
      router.refresh()
    } else {
      router.refresh()
    }
  }

  const handleSendEmail = async () => {
    if (!emailConfirmOrder) return
    
    await sendUpdateEmail(emailConfirmOrder, emailConfirmType, emailTrackingNumber)
    
    setIsEmailConfirmOpen(false)
    setEmailConfirmOrder(null)
    setEmailTrackingNumber(undefined)
  }

  const handleDeleteOrder = async () => {
    if (!orderToDelete) return

    // Optimistic update
    setOrders(orders.filter(o => o.id !== orderToDelete))
    
    const result = await deleteOrder(orderToDelete)
    
    setOrderToDelete(null)
    
    if (!result.success) {
      console.error('Failed to delete order')
      router.refresh()
    } else {
      router.refresh()
    }
  }

  const visibleOrders = viewMode === 'board' 
    ? orders.filter(o => o.status !== 'Archived')
    : orders

  const filteredOrders = visibleOrders.filter(o => o.status === activeTab)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders and customers</h1>
          <p className="text-muted-foreground">Manage orders, track status, all synced with Google Sheets.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center border rounded-md bg-background mr-2">
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
          <Button variant="outline" onClick={handleSync} disabled={isSyncing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Syncing...' : 'Sync Sheets'}
          </Button>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Order
          </Button>
        </div>
      </div>

      {viewMode === 'list' ? (
        <OrdersTable 
          orders={visibleOrders}
          onEdit={(order) => setSelectedOrderForEdit(order)}
          onDelete={(id) => setOrderToDelete(id)}
          onStatusChange={handleStatusChange}
        />
      ) : (
        <>
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
                  {visibleOrders.filter(o => o.status === status).length}
                </Badge>
              </Button>
            ))}
          </div>

          {/* Orders List */}
          <div className="grid gap-4">
            {filteredOrders.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <Package className="h-12 w-12 mb-4 opacity-20" />
                  <p>No orders in this stage.</p>
                </CardContent>
              </Card>
            ) : (
              filteredOrders.map(order => (
                <Card key={order.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base font-medium">
                      {order.product} <span className="text-muted-foreground font-normal">x{order.quantity}</span>
                    </CardTitle>
                    <CardDescription>
                      {order.order_id} • {new Date(order.timestamp || order.created_at).toLocaleDateString()}
                    {order.status_updated_at && (
                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <Clock className="mr-1 h-3 w-3" />
                        In status for {formatDistanceToNow(new Date(order.status_updated_at))}
                      </div>
                    )}
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
                      <DropdownMenuItem onClick={() => setSelectedOrderForInvoice(order)}>
                        <FileText className="mr-2 h-4 w-4" /> View Invoice Data
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSelectedOrderForEdit(order)}>
                        <Pencil className="mr-2 h-4 w-4" /> Edit Order
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'Archived')}>
                        <Archive className="mr-2 h-4 w-4" /> Archive Order
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>Move to...</DropdownMenuLabel>
                      {STATUSES.map(status => (
                        <DropdownMenuItem 
                          key={status} 
                          onClick={() => handleStatusChange(order.id, status)}
                          disabled={status === order.status}
                        >
                          {status}
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setOrderToDelete(order.id)} className="text-red-600 focus:text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" /> Delete Order
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-gray-900">Customer</p>
                    <p>{order.customer_name || order.company_name}</p>
                    <p className="text-muted-foreground">{order.email}</p>
                    <p className="text-muted-foreground">{order.phone_number}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Delivery</p>
                    <p className="whitespace-pre-wrap">{order.delivery_address}</p>
                    {order.tracking_number && (
                      <div className="mt-2">
                        <a 
                          href={`https://www.fedex.com/fedextrack/?trknbr=${order.tracking_number}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm flex items-center gap-1"
                        >
                          <Truck className="h-3 w-3" />
                          Track Package ({order.tracking_number})
                        </a>
                      </div>
                    )}
                  </div>
                </div>
                {order.message && (
                  <div className="mt-4 bg-gray-50 p-3 rounded-md text-sm">
                    <p className="font-medium text-xs text-gray-500 mb-1">MESSAGE</p>
                    {order.message}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
          </div>
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!orderToDelete} onOpenChange={(open) => !open && setOrderToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the order from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteOrder} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Invoice Data Modal */}
      {selectedOrderForInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Invoice Data View</h2>
                <Button variant="ghost" size="icon" onClick={() => setSelectedOrderForInvoice(null)}>
                  <span className="sr-only">Close</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </Button>
              </div>
              
              <div className="border p-4 rounded-md bg-gray-50 font-sans text-sm text-gray-800">
                <h2 className="text-lg font-bold mb-2">Order #{selectedOrderForInvoice.order_id}</h2>
                
                <div className="border border-gray-300 p-4 mb-5 bg-gray-50">
                  <h3 className="mt-0 border-b border-gray-300 pb-1 mb-3 font-bold text-base">Invoice Data</h3>
                  
                  <p className="mb-4">
                    <strong>Product:</strong> {selectedOrderForInvoice.product}<br/>
                    <strong>Quantity:</strong> {selectedOrderForInvoice.quantity}
                  </p>

                  <p className="mb-4">
                    <strong>Billing / Customer:</strong><br/>
                    {selectedOrderForInvoice.company === 'Yes' && <>Company: {selectedOrderForInvoice.company_name}<br/></>}
                    Name: {selectedOrderForInvoice.customer_name}<br/>
                    Email: <a href={`mailto:${selectedOrderForInvoice.email}`} className="text-blue-600 hover:underline">{selectedOrderForInvoice.email}</a><br/>
                    Phone: {selectedOrderForInvoice.phone_number}
                  </p>

                  <p className="mb-4">
                    <strong>Address:</strong><br/>
                    <span className="whitespace-pre-wrap">{selectedOrderForInvoice.delivery_address}</span>
                  </p>

                  <p className="mb-0">
                    <strong>VAT / Tax ID:</strong><br/>
                    {selectedOrderForInvoice.company === 'Yes' ? selectedOrderForInvoice.tax_vat_number : 'N/A'}
                  </p>
                </div>

                {selectedOrderForInvoice.message && (
                  <div className="border border-yellow-200 bg-yellow-50 p-3 mb-4">
                    <strong>Message:</strong><br/>
                    {selectedOrderForInvoice.message}
                  </div>
                )}

              </div>

              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={() => setSelectedOrderForInvoice(null)}>Close</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tracking Number Modal */}
      <Dialog open={isTrackingModalOpen} onOpenChange={setIsTrackingModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter Tracking Number</DialogTitle>
            <DialogDescription>
              Please enter the FedEx tracking number for this order.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tracking" className="text-right">
                Tracking #
              </Label>
              <Input
                id="tracking"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                className="col-span-3"
                placeholder="e.g. 886962630319"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTrackingModalOpen(false)}>Cancel</Button>
            <Button onClick={confirmShippedStatus}>Confirm Shipped</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Order Modal */}
      {selectedOrderForEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Edit Order</h2>
              <form action={async (formData) => {
                await updateOrderDetails(selectedOrderForEdit.id, formData)
                setSelectedOrderForEdit(null)
                router.refresh()
              }} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-date">Order Date</Label>
                  <Input 
                    id="edit-date" 
                    name="date" 
                    type="datetime-local" 
                    required 
                    defaultValue={selectedOrderForEdit.created_at ? new Date(selectedOrderForEdit.created_at).toISOString().slice(0, 16) : ''} 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-product">Product</Label>
                    <Input id="edit-product" name="product" required defaultValue={selectedOrderForEdit.product} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-quantity">Quantity</Label>
                    <Input id="edit-quantity" name="quantity" type="number" required defaultValue={selectedOrderForEdit.quantity} />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-customerName">Customer Name</Label>
                  <Input id="edit-customerName" name="customerName" required defaultValue={selectedOrderForEdit.customer_name} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input id="edit-email" name="email" type="email" required defaultValue={selectedOrderForEdit.email} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-phoneNumber">Phone</Label>
                  <Input id="edit-phoneNumber" name="phoneNumber" defaultValue={selectedOrderForEdit.phone_number} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-deliveryAddress">Delivery Address</Label>
                  <Input id="edit-deliveryAddress" name="deliveryAddress" required defaultValue={selectedOrderForEdit.delivery_address} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-company">Is Company?</Label>
                    <select 
                      id="edit-company" 
                      name="company" 
                      defaultValue={selectedOrderForEdit.company}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-companyName">Company Name</Label>
                    <Input id="edit-companyName" name="companyName" defaultValue={selectedOrderForEdit.company_name} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-taxVatNumber">VAT / Tax ID</Label>
                  <Input id="edit-taxVatNumber" name="taxVatNumber" defaultValue={selectedOrderForEdit.tax_vat_number} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-message">Message</Label>
                  <Input id="edit-message" name="message" defaultValue={selectedOrderForEdit.message} />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setSelectedOrderForEdit(null)}>Cancel</Button>
                  <Button type="submit">Save Changes</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Simple Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Add New Order</h2>
              <form action={async (formData) => {
                // If product type is not 'Other', override the product field
                if (addProductType !== 'Other') {
                  formData.set('product', addProductType)
                }
                await addOrder(formData)
                setIsAddModalOpen(false)
                router.refresh()
              }} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="productType">Product</Label>
                    <select 
                      id="productType" 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={addProductType}
                      onChange={(e) => setAddProductType(e.target.value)}
                    >
                      <option value="GAMETRAQ">GAMETRAQ</option>
                      <option value="SHOTGUN">SHOTGUN</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  {addProductType === 'Other' && (
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="product">Product Name</Label>
                      <Input id="product" name="product" required placeholder="e.g. Custom Item" />
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input id="quantity" name="quantity" type="number" required defaultValue="1" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="customerName">Customer Name</Label>
                  <Input id="customerName" name="customerName" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone</Label>
                  <Input id="phoneNumber" name="phoneNumber" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deliveryAddress">Delivery Address</Label>
                  <Input id="deliveryAddress" name="deliveryAddress" required />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company">Is Company?</Label>
                    <select id="company" name="company" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input id="companyName" name="companyName" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message/Notes</Label>
                  <Input id="message" name="message" />
                </div>

                <div className="flex justify-end gap-2 mt-6">
                  <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                  <Button type="submit">Create Order</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {/* Email Confirmation Dialog */}
      <AlertDialog open={isEmailConfirmOpen} onOpenChange={setIsEmailConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Send Update Email?</AlertDialogTitle>
            <AlertDialogDescription>
              Do you want to send an email to {emailConfirmOrder?.customer_name} ({emailConfirmOrder?.email}) notifying them that their order is {emailConfirmType === 'preparing' ? 'being prepared' : 'shipped'}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setIsEmailConfirmOpen(false)
              setEmailConfirmOrder(null)
              setEmailTrackingNumber(undefined)
            }}>Skip</AlertDialogCancel>
            <AlertDialogAction onClick={handleSendEmail}>Send Email</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  )
}
