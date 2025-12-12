'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export type Discount = {
  id: string
  code: string
  product: string
  percentage: number
  start_date: string
  end_date: string | null
  created_at: string
}

export type Product = {
  id: string
  name: string
  price: number
  type: string
  description: string
  created_at: string
}

export async function getProducts() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching products:', error)
    return []
  }

  return data as Product[]
}

export async function updateProductPrice(id: string, price: number) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('products')
    .update({ price })
    .eq('id', id)

  if (error) {
    console.error('Error updating product price:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/discounts')
  return { success: true }
}

export async function getDiscounts() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('discounts')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching discounts:', error)
    return []
  }

  return data as Discount[]
}

export async function createDiscount(formData: FormData) {
  const supabase = await createClient()
  
  const rawData = {
    code: formData.get('code') as string,
    product: formData.get('product') as string,
    percentage: parseInt(formData.get('percentage') as string),
    start_date: new Date(formData.get('startDate') as string).toISOString(),
    end_date: formData.get('endDate') ? new Date(formData.get('endDate') as string).toISOString() : null,
  }

  const { error } = await supabase.from('discounts').insert(rawData)

  if (error) {
    console.error('Error creating discount:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/discounts')
  return { success: true }
}

export async function updateDiscount(id: string, formData: FormData) {
  const supabase = await createClient()
  
  const rawData = {
    code: formData.get('code') as string,
    product: formData.get('product') as string,
    percentage: parseInt(formData.get('percentage') as string),
    start_date: new Date(formData.get('startDate') as string).toISOString(),
    end_date: formData.get('endDate') ? new Date(formData.get('endDate') as string).toISOString() : null,
  }

  const { error } = await supabase
    .from('discounts')
    .update(rawData)
    .eq('id', id)

  if (error) {
    console.error('Error updating discount:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/discounts')
  return { success: true }
}

export async function deleteDiscount(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('discounts')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting discount:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/discounts')
  return { success: true }
}
