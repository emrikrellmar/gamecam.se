'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Order } from '@/lib/google-sheets' // We might need to update this type or create a new one for Supabase
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { RefreshCw, Plus, MoreHorizontal, Check, Truck, Package, FileText, UserCheck } from 'lucide-react'
import { syncOrders, addOrder, updateOrderStatus } from './actions'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
  const [orders, setOrders] = useState<SupabaseOrder[]>(initialOrders)
  const [isSyncing, setIsSyncing] = useState(false)
  const [activeTab, setActiveTab] = useState('Order placed')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<SupabaseOrder | null>(null)

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

  const filteredOrders = orders.filter(o => o.status === activeTab)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">Manage orders, track status, and sync with Google Sheets.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSync} disabled={isSyncing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Syncing...' : 'Sync Sheets'}
          </Button>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Order
          </Button>
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
              {orders.filter(o => o.status === status).length}
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
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setSelectedOrderForInvoice(order)}>
                        <FileText className="mr-2 h-4 w-4" /> View Invoice Data
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>Move to...</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {STATUSES.map(status => (
                        <DropdownMenuItem 
                          key={status} 
                          onClick={() => handleStatusChange(order.id, status)}
                          disabled={status === order.status}
                        >
                          {status}
                        </DropdownMenuItem>
                      ))}
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
                
                <div className="bg-gray-100 p-4 text-center text-xs text-gray-500 mt-4">
                  <p>This email was sent from the GameCam Order Form.</p>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={() => setSelectedOrderForInvoice(null)}>Close</Button>
              </div>
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
                await addOrder(formData)
                setIsAddModalOpen(false)
                router.refresh()
              }} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="product">Product</Label>
                    <Input id="product" name="product" required placeholder="e.g. GameCam Pro" />
                  </div>
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
    </div>
  )
}
