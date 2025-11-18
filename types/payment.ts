// types/payment.ts
export interface CreatePaymentRequest {
  amount: number;
  currency?: string;
  paymentMethod: string;
  customer: {
    email: string;
    firstName: string;
    lastName?: string;
    phone?: string;
  };
  orderId: string;
  description?: string;
  items?: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  successRedirectUrl?: string;
  failureRedirectUrl?: string;
}

export interface PaymentResponse {
  id: string;
  status: string;
  paymentUrl?: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  created: string;
  updated: string;
  metadata?: any;
}

export interface WebhookPayload {
  id: string;
  external_id: string;
  status: string;
  amount: number;
  paid_at?: string;
  payment_method: string;
  merchant_name?: string;
}
