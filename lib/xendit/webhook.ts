// lib/xendit/webhook.ts
import { NextApiRequest } from 'next';
import { XENDIT_CONFIG } from './config';
import crypto from 'crypto';

export function verifyWebhookSignature(req: NextApiRequest): boolean {
  const signature = req.headers['x-callback-token'] as string;
  
  if (!signature) {
    return false;
  }

  // Xendit sends the callback token in the header
  // You can add additional verification logic here if needed
  return signature === XENDIT_CONFIG.webhookToken;
}

export function generateSignature(payload: string, secret: string): string {
  return crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
}
