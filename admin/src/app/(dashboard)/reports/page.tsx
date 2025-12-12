import { createClient } from "@/utils/supabase/server"
import { ReportsClient } from "./reports-client"

export default async function ReportsPage() {
  const supabase = await createClient()
  
  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: true })

  return <ReportsClient orders={orders || []} />
}
