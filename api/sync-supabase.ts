import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = (supabaseUrl && supabaseServiceKey) 
  ? createClient(supabaseUrl, supabaseServiceKey) 
  : null;

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify secret (reuse the same webhook secret for simplicity)
  const secret = process.env.SUPABASE_WEBHOOK_SECRET;
  if (!secret || req.headers['x-webhook-secret'] !== secret) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!supabase) {
    return res.status(500).json({ error: 'Supabase client not initialized' });
  }

  const { table, data } = req.body;
  console.log(`[sync-supabase] Received update for ${table}`, data);

  try {
    if (table === 'orders') {
      // Update Orders
      // We use order_id as the unique key for matching
      const { order_id, ...updateData } = data;
      
      if (!order_id) {
        return res.status(400).json({ error: 'Missing order_id' });
      }

      const { error } = await supabase
        .from('orders')
        .upsert({ order_id, ...updateData }, { onConflict: 'order_id' });

      if (error) throw error;

    } else if (table === 'estimates') {
      // Update Estimates
      // We use id as the unique key
      const { id, ...updateData } = data;

      if (!id) {
        return res.status(400).json({ error: 'Missing id' });
      }

      const { error } = await supabase
        .from('estimates')
        .upsert({ id, ...updateData }, { onConflict: 'id' });

      if (error) throw error;
    } else {
      return res.status(400).json({ error: 'Unknown table' });
    }

    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('[sync-supabase] Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
