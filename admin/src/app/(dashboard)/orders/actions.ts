'use server'

import { createClient } from '@/utils/supabase/server'
import { getOrders } from '@/lib/google-sheets'
import { revalidatePath } from 'next/cache'
import { createNotification } from '@/lib/notifications-actions'

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
      const { data: newOrder, error } = await supabase.from('orders').insert({
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
        status: 'Order placed', // Default status for imported orders
        status_updated_at: new Date().toISOString()
      }).select().single()

      if (error) {
        console.error('Error syncing order:', order.orderId, error)
        errorCount++
      } else {
        addedCount++
        if (newOrder) {
          await createNotification(
            'New Order',
            `Order #${order.orderId} from ${order.customerName}.`,
            'order',
            newOrder.id,
            '/orders'
          )
        }
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
    status_updated_at: new Date().toISOString(),
    order_id: Math.floor(10000000 + Math.random() * 90000000).toString() // Generate 8-digit ID
  }

  const { data: newOrder, error } = await supabase.from('orders').insert(rawData).select().single()

  if (error) {
    console.error('Error adding order:', error)
    return { success: false, error: error.message }
  }

  if (newOrder) {
    await createNotification(
      'New Order',
      `Order #${rawData.order_id} for ${rawData.customer_name}.`,
      'order',
      newOrder.id,
      '/orders'
    )
  }

  revalidatePath('/orders')
  return { success: true }
}

export async function updateOrderStatus(orderId: string, newStatus: string, trackingNumber?: string) {
  const supabase = await createClient()

  const updateData: { status: string; tracking_number?: string | null; status_updated_at: string } = { 
    status: newStatus,
    status_updated_at: new Date().toISOString()
  }
  
  if (trackingNumber) {
    updateData.tracking_number = trackingNumber
  } else if (['Order placed', 'Invoice payed', 'Preparing order'].includes(newStatus)) {
    updateData.tracking_number = null
  }

  console.log(`Updating order ${orderId} to status ${newStatus}`)
  const { error } = await supabase
    .from('orders')
    .update(updateData)
    .eq('id', orderId)

  if (error) {
    console.error('Error updating order status:', error)
    return { success: false, error: error.message }
  }
  
  console.log(`Successfully updated order ${orderId}`)

  if (newStatus !== 'Archived') {
    // Fetch order details for notification
    const { data: order } = await supabase
      .from('orders')
      .select('order_id')
      .eq('id', orderId)
      .single()
      
    if (order) {
      await createNotification(
        'Order Status Updated',
        `Order #${order.order_id} status changed to ${newStatus}.`,
        'order',
        orderId,
        '/orders'
      )
    }
  }

  revalidatePath('/orders')
  return { success: true }
}

export async function updateOrderDetails(orderId: string, formData: FormData) {
  const supabase = await createClient()
  
  const rawData: any = {
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

  const date = formData.get('date') as string
  if (date) {
    rawData.created_at = new Date(date).toISOString()
  }

  const { error } = await supabase
    .from('orders')
    .update(rawData)
    .eq('id', orderId)

  revalidatePath('/orders')
  return { success: true }
}

export async function deleteOrder(orderId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('orders')
    .delete()
    .eq('id', orderId)

  if (error) {
    console.error('Error deleting order:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/orders')
  return { success: true }
}
