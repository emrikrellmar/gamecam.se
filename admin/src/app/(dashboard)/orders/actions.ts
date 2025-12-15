'use server'

import { createClient } from '@/utils/supabase/server'
import { getOrders } from '@/lib/google-sheets'
import { revalidatePath } from 'next/cache'
import { createNotification } from '@/lib/notifications-actions'
import nodemailer from 'nodemailer'

export async function sendUpdateEmail(order: any, type: 'preparing' | 'shipped', trackingNumber?: string) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: (process.env.SMTP_PORT || '465') === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  let subject = '';
  let text = '';
  let html = '';
  
  const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const currentYear = new Date().getFullYear();

  // Common styles and structure
  const getHtmlTemplate = (title: string, message: string, trackingSection: string = '') => `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; background-color: #ffffff;">
      <!-- Logo -->
      <div style="text-align: center; padding: 20px 0; border-bottom: 1px solid #eeeeee;">
        <img src="https://gamecam.io/assets/images/logos/gamecam_logo_horizontal_black.png" alt="GameCam" style="height: 30px; width: auto;" />
      </div>

      <!-- Intro -->
      <div style="padding: 30px 0; text-align: center;">
        <img src="https://gamecam.io/assets/images/logos/checkmark.png" alt="Success" style="height: 50px; width: 50px; margin-bottom: 15px;" />
        <h2 style="color: #333; margin: 0 0 10px; font-size: 24px;">${title}</h2>
        <p style="color: #666; margin: 0; font-size: 16px; line-height: 1.5;">${message}</p>
      </div>

      <!-- Info Columns -->
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px; background-color: #f9f9f9; padding: 20px; border-radius: 8px;">
        <tr>
          <td valign="top" width="50%" style="padding-right: 10px;">
            <h4 style="margin: 0 0 10px; font-size: 12px; color: #999; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">Summary</h4>
            <p style="margin: 0; font-size: 14px; line-height: 1.6;"><strong>Date:</strong><br>${dateStr}</p>
            <p style="margin: 10px 0 0; font-size: 14px; line-height: 1.6;"><strong>Email:</strong><br><a href="mailto:${order.email}" style="color: #0056b3; text-decoration: none;">${order.email}</a></p>
            <p style="margin: 10px 0 0; font-size: 14px; line-height: 1.6;"><strong>Order ID:</strong><br>${order.order_id}</p>
          </td>
          <td valign="top" width="50%" style="padding-left: 10px;">
            <h4 style="margin: 0 0 10px; font-size: 12px; color: #999; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">Shipping Address</h4>
            <p style="margin: 0; font-size: 14px; line-height: 1.6;">
              ${order.customer_name}<br>
              ${order.delivery_address}<br>
              ${order.phone_number}
            </p>
          </td>
        </tr>
      </table>

      ${trackingSection}

      <!-- Items Header -->
      <div style="border-bottom: 2px solid #eeeeee; padding-bottom: 10px; margin-bottom: 15px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="left" style="font-size: 12px; font-weight: bold; color: #999; text-transform: uppercase; letter-spacing: 0.5px;">Item</td>
            <td align="right" style="font-size: 12px; font-weight: bold; color: #999; text-transform: uppercase; letter-spacing: 0.5px;">Qty</td>
          </tr>
        </table>
      </div>

      <!-- Item Row -->
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
        <tr>
          <td valign="top" style="padding-bottom: 20px;">
            <p style="margin: 0; font-size: 16px; font-weight: bold; color: #333;">${order.product}</p>
          </td>
          <td align="right" valign="top" style="font-size: 16px; font-weight: bold; color: #333; padding-bottom: 20px;">
            ${order.quantity}
          </td>
        </tr>
      </table>

      <!-- Footer -->
      <div style="border-top: 1px solid #eeeeee; padding-top: 30px; margin-top: 10px; text-align: center; color: #999; font-size: 12px;">
        <p style="margin: 0 0 10px;">&copy; ${currentYear} GameCam. All rights reserved.</p>
        <p style="margin: 0;">If you have any questions, contact <a href="mailto:sales@gamecam.se" style="color: #0056b3; text-decoration: none;">sales@gamecam.se</a>.</p>
        <div style="display:none; font-size:0; line-height:0; color:#ffffff;">${order.order_id} - ${new Date().toISOString()}</div>
      </div>
      <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #666;">
        <p>This email was sent from the GameCam Team.</p>
      </div>
    </div>
  `;

  if (type === 'preparing') {
    subject = `Your order #${order.order_id} is being prepared!`;
    text = `Hi ${order.customer_name},\n\nWe have received your payment and your order for ${order.product} is now being prepared.\n\nBest regards,\nThe GameCam Team`;
    html = getHtmlTemplate(
      'Your order is being prepared!',
      'We have received your payment and your order is now being prepared. We will notify you once it has been shipped.'
    );
  } else if (type === 'shipped') {
    subject = `Your order #${order.order_id} has been shipped!`;
    text = `Hi ${order.customer_name},\n\nYour order for ${order.product} has been shipped.\n\nTracking Number: ${trackingNumber || 'N/A'}\n\nBest regards,\nThe GameCam Team`;
    
    const trackingSection = trackingNumber ? `
      <div style="margin-bottom: 30px; background-color: #e6f7ff; padding: 20px; border-radius: 8px; border: 1px solid #b3e0ff; text-align: center;">
        <h4 style="margin: 0 0 10px; font-size: 14px; color: #0056b3; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">Tracking Number</h4>
        <p style="margin: 0; font-size: 18px; font-weight: bold; color: #333; letter-spacing: 1px;">
          <a href="https://www.fedex.com/fedextrack/?trknbr=${trackingNumber}" target="_blank" style="color: #0056b3; text-decoration: underline;">${trackingNumber}</a>
        </p>
      </div>
    ` : '';

    html = getHtmlTemplate(
      'Your order has been shipped!',
      'Your order has been shipped! You can track your package using the tracking number below.',
      trackingSection
    );
  }

  try {
    await transporter.sendMail({
      from: '"GameCam" <magnus@gamecam.se>',
      to: order.email,
      subject: subject,
      text: text,
      html: html,
    });
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: String(error) };
  }
}

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
