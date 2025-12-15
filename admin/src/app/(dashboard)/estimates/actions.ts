'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getEstimates() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('estimates')
    .select('*')
    .order('timestamp', { ascending: false })

  if (error) {
    console.error('Error fetching estimates:', error)
    return []
  }

  return data
}

export async function updateEstimateStatus(id: string, status: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('estimates')
    .update({ status })
    .eq('id', id)

  if (error) {
    console.error('Error updating estimate status:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/estimates')
  return { success: true }
}

export async function deleteEstimate(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('estimates')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting estimate:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/estimates')
  return { success: true }
}

export async function updateEstimateDetails(id: string, formData: FormData) {
  const supabase = await createClient()
  
  const data = {
    name: formData.get('name') as string,
    club_name: formData.get('clubName') as string,
    email: formData.get('email') as string,
    phone: formData.get('phone') as string,
    city: formData.get('city') as string,
    country: formData.get('country') as string,
    products: formData.get('products') as string,
    message: formData.get('message') as string,
  }

  const { error } = await supabase
    .from('estimates')
    .update(data)
    .eq('id', id)

  if (error) {
    console.error('Error updating estimate details:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/estimates')
  return { success: true }
}
