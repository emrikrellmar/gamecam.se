import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Package, 
  ShoppingCart, 
  AlertTriangle, 
  Activity,
  Truck,
  CheckCircle2,
  Users
} from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { getVercelAnalytics } from '@/lib/vercel'
import { InventoryPieChart } from '@/components/inventory-pie-chart'

export const revalidate = 0;

export default async function DashboardPage() {
  const supabase = await createClient()
  
  // Fetch Inventory
  const { data: inventory } = await supabase.from('inventory').select('*')
  
  // Fetch Orders
  const { data: orders } = await supabase.from('orders').select('*')

  // Fetch Analytics
  const analytics = await getVercelAnalytics()

  // Calculate Capacity
  let capacity = 0
  let limitingItem = null
  
  if (inventory && inventory.length > 0) {
    // Filter for GAMETRAQ category only
    const gametraqItems = inventory.filter(i => i.category === 'GAMETRAQ')
    
    if (gametraqItems.length > 0) {
      // Find item with lowest stock in this category
      const sorted = [...gametraqItems].sort((a, b) => a.stock - b.stock)
      limitingItem = sorted[0]
      capacity = limitingItem.stock
    }
  }

  // Calculate Order Stats
  const totalOrders = orders?.length || 0
  const activeOrders = orders?.filter(o => ['Order placed', 'Invoice payed', 'Preparing order'].includes(o.status)).length || 0
  const completedOrders = orders?.filter(o => ['Shipped', 'Onboarding done'].includes(o.status)).length || 0
  
  // Low stock items (e.g. < 5) - Show ALL items
  const lowStockItems = inventory?.filter(i => i.stock < 5).sort((a, b) => a.stock - b.stock) || []

  // Prepare Pie Chart Data
  const categoryCounts = ((inventory as any[]) || []).reduce((acc: Record<string, number>, item: any) => {
    const cat = item.category || 'Uncategorized'
    acc[cat] = (acc[cat] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const pieChartData = Object.entries(categoryCounts).map(([name, value]) => ({
    name,
    value,
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your production capacity and orders.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Production Capacity
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{capacity} GAMETRAQS</div>
            <p className="text-xs text-muted-foreground mt-2">
              Limited by <span className="font-medium text-red-500">{limitingItem?.name || 'Nothing'}</span>
            </p>
            <Progress value={Math.min((capacity / 5) * 100, 100)} className="mt-3 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Orders
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeOrders}</div>
            <p className="text-xs text-muted-foreground mt-2">
              Orders in progress
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completed Orders
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedOrders}</div>
            <p className="text-xs text-muted-foreground mt-2">
              Shipped or Onboarded
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Website Visitors
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              -
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Coming Soon
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Low Stock List */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Restock Needed</CardTitle>
            <CardDescription>
              Items that are limiting your production capacity or running low.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockItems.length === 0 ? (
                <p className="text-sm text-muted-foreground">All inventory levels are healthy.</p>
              ) : (
                lowStockItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.supplier}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-muted-foreground">
                        Stock: <span className="font-bold text-red-600">{item.stock}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {item.category}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity / Stats */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Inventory Health</CardTitle>
            <CardDescription>
              Distribution of stock across categories.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <InventoryPieChart data={pieChartData} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
