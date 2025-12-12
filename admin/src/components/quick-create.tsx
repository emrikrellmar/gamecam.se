"use client"

import { useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import {
  Plus,
  Package,
  ShoppingCart,
  Users,
  Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function QuickCreate() {
  const [openDialog, setOpenDialog] = useState<"order" | "customer" | "inventory" | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  // Form States
  const [customerForm, setCustomerForm] = useState({ name: "", email: "", phone: "", address: "" })
  const [inventoryForm, setInventoryForm] = useState({ name: "", stock: "0", supplier: "", category: "" })
  const [orderForm, setOrderForm] = useState({ 
    customer_name: "", 
    email: "", 
    phone_number: "",
    product: "", 
    quantity: "1",
    delivery_address: "",
    company: "No",
    company_name: "",
    tax_vat_number: "",
    message: ""
  })

  const handleCreateCustomer = async () => {
    setIsLoading(true)
    try {
      const { error } = await supabase.from('customers').insert([customerForm])
      if (error) throw error
      setOpenDialog(null)
      setCustomerForm({ name: "", email: "", phone: "", address: "" })
      router.refresh()
    } catch (e) {
      console.error(e)
      alert("Failed to create customer")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateInventory = async () => {
    setIsLoading(true)
    try {
      const { error } = await supabase.from('inventory').insert([{
        ...inventoryForm,
        stock: parseInt(inventoryForm.stock) || 0
      }])
      if (error) throw error
      setOpenDialog(null)
      setInventoryForm({ name: "", stock: "0", supplier: "", category: "" })
      router.refresh()
    } catch (e) {
      console.error(e)
      alert("Failed to create item")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateOrder = async () => {
    setIsLoading(true)
    try {
      // Generate a random Order ID for now
      const orderId = `ORD-${Math.floor(Math.random() * 10000)}`
      const { error } = await supabase.from('orders').insert([{
        ...orderForm,
        order_id: orderId,
        status: 'Order placed',
        timestamp: new Date().toISOString()
      }])
      if (error) throw error
      setOpenDialog(null)
      setOrderForm({ 
        customer_name: "", 
        email: "", 
        phone_number: "",
        product: "", 
        quantity: "1", 
        delivery_address: "",
        company: "No",
        company_name: "",
        tax_vat_number: "",
        message: ""
      })
      router.refresh()
    } catch (e) {
      console.error(e)
      alert("Failed to create order")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
            <Plus className="h-4 w-4" />
            Quick Create
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setOpenDialog("order")}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            New Order
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpenDialog("customer")}>
            <Users className="mr-2 h-4 w-4" />
            New Customer
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpenDialog("inventory")}>
            <Package className="mr-2 h-4 w-4" />
            New Inventory Item
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Customer Dialog */}
      <Dialog open={openDialog === "customer"} onOpenChange={(open) => !open && setOpenDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Customer</DialogTitle>
            <DialogDescription>Add a new customer to the database.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Name</Label>
              <Input value={customerForm.name} onChange={e => setCustomerForm({...customerForm, name: e.target.value})} />
            </div>
            <div className="grid gap-2">
              <Label>Email</Label>
              <Input value={customerForm.email} onChange={e => setCustomerForm({...customerForm, email: e.target.value})} />
            </div>
            <div className="grid gap-2">
              <Label>Phone</Label>
              <Input value={customerForm.phone} onChange={e => setCustomerForm({...customerForm, phone: e.target.value})} />
            </div>
            <div className="grid gap-2">
              <Label>Address</Label>
              <Input value={customerForm.address} onChange={e => setCustomerForm({...customerForm, address: e.target.value})} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog(null)}>Cancel</Button>
            <Button onClick={handleCreateCustomer} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Customer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Inventory Dialog */}
      <Dialog open={openDialog === "inventory"} onOpenChange={(open) => !open && setOpenDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Inventory Item</DialogTitle>
            <DialogDescription>Add a new item to your inventory.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Item Name</Label>
              <Input value={inventoryForm.name} onChange={e => setInventoryForm({...inventoryForm, name: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Stock</Label>
                <Input type="number" value={inventoryForm.stock} onChange={e => setInventoryForm({...inventoryForm, stock: e.target.value})} />
              </div>
              <div className="grid gap-2">
                <Label>Category</Label>
                <Input value={inventoryForm.category} onChange={e => setInventoryForm({...inventoryForm, category: e.target.value})} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Supplier</Label>
              <Input value={inventoryForm.supplier} onChange={e => setInventoryForm({...inventoryForm, supplier: e.target.value})} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog(null)}>Cancel</Button>
            <Button onClick={handleCreateInventory} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Order Dialog */}
      <Dialog open={openDialog === "order"} onOpenChange={(open) => !open && setOpenDialog(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Order</DialogTitle>
            <DialogDescription>Manually create a new order.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Product</Label>
                <Input value={orderForm.product} onChange={e => setOrderForm({...orderForm, product: e.target.value})} />
              </div>
              <div className="grid gap-2">
                <Label>Quantity</Label>
                <Input type="number" value={orderForm.quantity} onChange={e => setOrderForm({...orderForm, quantity: e.target.value})} />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label>Customer Name</Label>
              <Input value={orderForm.customer_name} onChange={e => setOrderForm({...orderForm, customer_name: e.target.value})} />
            </div>

            <div className="grid gap-2">
              <Label>Email</Label>
              <Input value={orderForm.email} onChange={e => setOrderForm({...orderForm, email: e.target.value})} />
            </div>

            <div className="grid gap-2">
              <Label>Phone</Label>
              <Input value={orderForm.phone_number} onChange={e => setOrderForm({...orderForm, phone_number: e.target.value})} />
            </div>

            <div className="grid gap-2">
              <Label>Delivery Address</Label>
              <Input value={orderForm.delivery_address} onChange={e => setOrderForm({...orderForm, delivery_address: e.target.value})} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Is Company?</Label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={orderForm.company}
                  onChange={e => setOrderForm({...orderForm, company: e.target.value})}
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>
              {orderForm.company === 'Yes' && (
                <div className="grid gap-2">
                  <Label>Company Name</Label>
                  <Input value={orderForm.company_name} onChange={e => setOrderForm({...orderForm, company_name: e.target.value})} />
                </div>
              )}
            </div>

            {orderForm.company === 'Yes' && (
              <div className="grid gap-2">
                <Label>VAT Number</Label>
                <Input value={orderForm.tax_vat_number} onChange={e => setOrderForm({...orderForm, tax_vat_number: e.target.value})} />
              </div>
            )}

            <div className="grid gap-2">
              <Label>Message</Label>
              <Input value={orderForm.message} onChange={e => setOrderForm({...orderForm, message: e.target.value})} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog(null)}>Cancel</Button>
            <Button onClick={handleCreateOrder} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
