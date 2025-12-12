import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { OrdersBoard } from './orders-board'

export const revalidate = 0; // Dynamic

export default async function OrdersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return redirect('/login')

  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  return <OrdersBoard initialOrders={orders || []} />
}
