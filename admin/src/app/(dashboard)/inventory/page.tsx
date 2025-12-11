import { createClient } from '@/utils/supabase/server'
import { InventoryTable, InventoryItem } from '@/components/inventory-table'

export default async function InventoryPage() {
  const supabase = await createClient()
  
  const { data: inventory } = await supabase
    .from('inventory')
    .select('*')
    .order('name')

  return <InventoryTable initialInventory={(inventory as InventoryItem[]) || []} />
}
