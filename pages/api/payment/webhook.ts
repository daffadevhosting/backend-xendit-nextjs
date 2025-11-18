// pages/api/payment/webhook.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { WebhookPayload } from '../../../types/payment';
import { verifyWebhookSignature } from '../../../lib/xendit/webhook';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verifikasi webhook signature
    const isValid = verifyWebhookSignature(req);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid webhook signature' });
    }

    const payload: WebhookPayload = req.body;

    // Process payment status update
    await processPaymentUpdate(payload);

    res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function processPaymentUpdate(payload: WebhookPayload) {
  // Implement your business logic here
  // Update order status in your database
  // Send notification to customer
  // etc.
  
  console.log('Payment update received:', {
    paymentId: payload.id,
    orderId: payload.external_id,
    status: payload.status,
    amount: payload.amount,
    paidAt: payload.paid_at,
  });

  // Example: Update database
  // await updateOrderStatus(payload.external_id, payload.status);
}
