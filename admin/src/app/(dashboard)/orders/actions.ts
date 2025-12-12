'use server'

import { createClient } from '@/utils/supabase/server'
import { getOrders } from '@/lib/google-sheets'
import { revalidatePath } from 'next/cache'

export async function syncOrders() {
  const supabase = await createClient()
  const sheetOrders = await getOrders()

  let addedCount = 0
  let errorCount = 0

  for (const order of sheetOrders) {
    // Check if order already exists
    const { data: existing } = await supabase
      .from('orders')
      .select('id')
      .eq('order_id', order.orderId)
      .single()

    if (!existing) {
      const { error } = await supabase.from('orders').insert({
        order_id: order.orderId,
        customer_name: order.customerName,
        product: order.product,
        quantity: order.quantity,
        company: order.company,
        company_name: order.companyName,
        tax_vat_number: order.taxVatNumber,
        delivery_address: order.deliveryAddress,
        phone_number: order.phoneNumber,
        email: order.email,
        message: order.message,
        timestamp: order.timestamp,
        status: 'Order placed' // Default status for imported orders
      })

      if (error) {
        console.error('Error syncing order:', order.orderId, error)
        errorCount++
      } else {
        addedCount++
      }
    }
  }

  revalidatePath('/orders')
  return { success: true, added: addedCount, errors: errorCount }
}

export async function addOrder(formData: FormData) {
  const supabase = await createClient()
  
  const rawData = {
    customer_name: formData.get('customerName') as string,
    product: formData.get('product') as string,
    quantity: formData.get('quantity') as string,
    company: formData.get('company') as string, // 'yes' or 'no' usually
    company_name: formData.get('companyName') as string,
    tax_vat_number: formData.get('taxVatNumber') as string,
    delivery_address: formData.get('deliveryAddress') as string,
    phone_number: formData.get('phoneNumber') as string,
    email: formData.get('email') as string,
    message: formData.get('message') as string,
    status: 'Order placed',
    timestamp: new Date().toISOString(),
    order_id: `MANUAL-${Date.now()}` // Generate a simple ID for manual orders
  }

  const { error } = await supabase.from('orders').insert(rawData)

  if (error) {
    console.error('Error adding order:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/orders')
  return { success: true }
}

export async function updateOrderStatus(orderId: string, newStatus: string, trackingNumber?: string) {
  const supabase = await createClient()

  const updateData: { status: string; tracking_number?: string } = { status: newStatus }
  if (trackingNumber) {
    updateData.tracking_number = trackingNumber
  }

  const { error } = await supabase
    .from('orders')
    .update(updateData)
    .eq('id', orderId)

  revalidatePath('/orders')
  return { success: true }
}

export async function updateOrderDetails(orderId: string, formData: FormData) {
  const supabase = await createClient()
  
  const rawData = {
    customer_name: formData.get('customerName') as string,
    product: formData.get('product') as string,
    quantity: formData.get('quantity') as string,
    company: formData.get('company') as string,
    company_name: formData.get('companyName') as string,
    tax_vat_number: formData.get('taxVatNumber') as string,
    delivery_address: formData.get('deliveryAddress') as string,
    phone_number: formData.get('phoneNumber') as string,
    email: formData.get('email') as string,
    message: formData.get('message') as string,
  }

  const { error } = await supabase
    .from('orders')
    .update(rawData)
    .eq('id', orderId)

  if (error) {
    console.error('Error updating order details:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/orders')
  return { success: true }
}
