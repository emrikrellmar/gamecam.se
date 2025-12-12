'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { SupabaseOrder } from "../orders/orders-board"
import { startOfMonth, endOfMonth, parseISO, format, isWithinInterval, addDays, getDaysInMonth, differenceInDays, differenceInHours, formatDistanceToNow } from "date-fns"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

interface ReportsClientProps {
  orders: SupabaseOrder[]
}

export function ReportsClient({ orders }: ReportsClientProps) {
  const router = useRouter()
  // Process data for the chart
  const currentDate = new Date()
  const monthStart = startOfMonth(currentDate)
  const daysInMonth = getDaysInMonth(currentDate)
  
  const weeks = []
  for (let i = 0; i < 4; i++) {
    const startDay = Math.floor((i * daysInMonth) / 4)
    const endDay = Math.floor(((i + 1) * daysInMonth) / 4) - 1
    
    weeks.push({
      start: addDays(monthStart, startDay),
      end: addDays(monthStart, endDay)
    })
  }

  const data = weeks.map((week) => {
    const weekOrders = orders.filter(order => {
      if (!order.created_at) return false
      const orderDate = parseISO(order.created_at)
      return isWithinInterval(orderDate, { start: week.start, end: week.end })
    })

    const shotgunCount = weekOrders
      .filter(order => order.product.toLowerCase().includes('shotgun'))
      .reduce((sum, order) => sum + (parseInt(order.quantity) || 0), 0)

    const gametraqCount = weekOrders
      .filter(order => order.product.toLowerCase().includes('gametraq'))
      .reduce((sum, order) => sum + (parseInt(order.quantity) || 0), 0)

    return {
      name: `${format(week.start, 'MMM d')} - ${format(week.end, 'MMM d')}`,
      shotgun: shotgunCount,
      gametraq: gametraqCount
    }
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Order placed': return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      case 'Invoice payed': return 'bg-purple-100 text-purple-800 hover:bg-purple-100';
      case 'Preparing order': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case 'Shipped': return 'bg-orange-100 text-orange-800 hover:bg-orange-100';
      case 'Onboarding done': return 'bg-green-100 text-green-800 hover:bg-green-100';
      default: return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  const sortedOrders = [...orders].sort((a, b) => {
    const dateA = a.created_at ? new Date(a.created_at).getTime() : 0
    const dateB = b.created_at ? new Date(b.created_at).getTime() : 0
    return dateA - dateB // Ascending date = Descending duration (Oldest first)
  }).slice(0, 5)

  const formatDuration = (dateString: string) => {
    if (!dateString) return 'N/A'
    const date = parseISO(dateString)
    const now = new Date()
    const days = differenceInDays(now, date)
    if (days > 0) return `${days} days`
    const hours = differenceInHours(now, date)
    return `${hours} hours`
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
        <p className="text-muted-foreground">
          Overview of the sales performance and order analytics.
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-1">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Orders Overview</CardTitle>
            <CardDescription>
              This months orders for Shotgun and GameTraq
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorShotgun" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorGametraq" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="shotgun" stroke="#8884d8" fillOpacity={1} fill="url(#colorShotgun)" />
                  <Area type="monotone" dataKey="gametraq" stroke="#82ca9d" fillOpacity={1} fill="url(#colorGametraq)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Order age</CardTitle>
            <CardDescription>
              Longest pending orders in the system.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Time Since Placed</TableHead>
                  <TableHead>Time in Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedOrders.map((order) => (
                  <TableRow 
                    key={order.id} 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => router.push(`/orders?status=${encodeURIComponent(order.status)}`)}
                  >
                    <TableCell className="font-medium">{order.order_id}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(order.status)} variant="secondary">
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{order.product}</TableCell>
                    <TableCell>{formatDuration(order.created_at)}</TableCell>
                    <TableCell>
                      {order.status_updated_at 
                        ? formatDistanceToNow(new Date(order.status_updated_at)) 
                        : 'N/A'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
