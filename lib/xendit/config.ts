// lib/xendit/config.ts
export const XENDIT_CONFIG = {
  secretKey: process.env.XENDIT_SECRET_KEY || '',
  callbackToken: process.env.XENDIT_CALLBACK_TOKEN || '',
  webhookToken: process.env.XENDIT_WEBHOOK_TOKEN || '',
  baseUrl: process.env.XENDIT_BASE_URL || 'https://api.xendit.co',
};

export const PAYMENT_METHODS = {
  CREDIT_CARD: 'CREDIT_CARD',
  OVO: 'OVO',
  DANA: 'DANA',
  LINKAJA: 'LINKAJA',
  QRIS: 'QRIS',
  RETAIL_OUTLET: 'RETAIL_OUTLET',
  VIRTUAL_ACCOUNT: 'VIRTUAL_ACCOUNT',
} as const;
