import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { getOrders } from '@/lib/google-sheets'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const revalidate = 60; // Revalidate every 60 seconds

export default async function OrdersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return redirect('/login')

  const orders = await getOrders()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
        <p className="text-muted-foreground">Manage and view incoming orders from Google Sheets.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>
            Synced from Google Sheets ({orders.length} orders found)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No orders found.
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order, index) => (
                  <TableRow key={order.orderId || index}>
                    <TableCell className="font-medium">{order.orderId}</TableCell>
                    <TableCell>{order.timestamp}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{order.product}</Badge>
                    </TableCell>
                    <TableCell>{order.quantity}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{order.companyName || 'Private Person'}</span>
                        {order.company === 'Yes' && <span className="text-xs text-muted-foreground">Business</span>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col text-sm">
                        <span>{order.email}</span>
                        <span className="text-muted-foreground text-xs">{order.phoneNumber}</span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate" title={order.deliveryAddress}>
                      {order.deliveryAddress}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
