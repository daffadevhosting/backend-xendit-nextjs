// lib/xendit/payment.ts
import { XENDIT_CONFIG, PAYMENT_METHODS } from './config';
import { CreatePaymentRequest, PaymentResponse } from '../../types/payment';

export class XenditPaymentService {
  private baseUrl: string;
  private secretKey: string;

  constructor() {
    this.baseUrl = XENDIT_CONFIG.baseUrl;
    this.secretKey = XENDIT_CONFIG.secretKey;
  }

  private getHeaders() {
    return {
      'Authorization': `Basic ${Buffer.from(this.secretKey + ':').toString('base64')}`,
      'Content-Type': 'application/json',
    };
  }

  async createPayment(payload: CreatePaymentRequest): Promise<PaymentResponse> {
    try {
      let paymentData: any;

      switch (payload.paymentMethod) {
        case PAYMENT_METHODS.VIRTUAL_ACCOUNT:
          paymentData = await this.createVirtualAccount(payload);
          break;
        case PAYMENT_METHODS.QRIS:
          paymentData = await this.createQRCode(payload);
          break;
        case PAYMENT_METHODS.CREDIT_CARD:
          paymentData = await this.createCreditCardPayment(payload);
          break;
        case PAYMENT_METHODS.RETAIL_OUTLET:
          paymentData = await this.createRetailOutlet(payload);
          break;
        default:
          throw new Error(`Unsupported payment method: ${payload.paymentMethod}`);
      }

      return {
        id: paymentData.id,
        status: paymentData.status,
        paymentUrl: paymentData.invoice_url || paymentData.payment_url,
        amount: paymentData.amount,
        currency: paymentData.currency,
        paymentMethod: payload.paymentMethod,
        created: paymentData.created,
        updated: paymentData.updated || paymentData.created,
        metadata: paymentData,
      };
    } catch (error) {
      console.error('Error creating payment:', error);
      throw error;
    }
  }

  private async createVirtualAccount(payload: CreatePaymentRequest) {
    const response = await fetch(`${this.baseUrl}/callback_virtual_accounts`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        external_id: payload.orderId,
        bank_code: 'BCA', // Default, bisa disesuaikan
        name: `${payload.customer.firstName} ${payload.customer.lastName || ''}`.trim(),
        expected_amount: payload.amount,
        is_closed: true,
        is_single_use: true,
        expiration_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error(`Xendit API error: ${response.statusText}`);
    }

    return response.json();
  }

  private async createQRCode(payload: CreatePaymentRequest) {
    const response = await fetch(`${this.baseUrl}/qr_codes`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        external_id: payload.orderId,
        type: 'DYNAMIC',
        amount: payload.amount,
        currency: payload.currency || 'IDR',
        callback_url: `${process.env.BASE_URL}/api/payment/webhook`,
        expiration_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error(`Xendit API error: ${response.statusText}`);
    }

    return response.json();
  }

  private async createCreditCardPayment(payload: CreatePaymentRequest) {
    const response = await fetch(`${this.baseUrl}/v2/invoices`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        external_id: payload.orderId,
        amount: payload.amount,
        currency: payload.currency || 'IDR',
        payer_email: payload.customer.email,
        description: payload.description || `Payment for order ${payload.orderId}`,
        success_redirect_url: payload.successRedirectUrl,
        failure_redirect_url: payload.failureRedirectUrl,
        payment_methods: ['CREDIT_CARD'],
        items: payload.items?.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
      }),
    });

    if (!response.ok) {
      throw new Error(`Xendit API error: ${response.statusText}`);
    }

    return response.json();
  }

  private async createRetailOutlet(payload: CreatePaymentRequest) {
    const response = await fetch(`${this.baseUrl}/fixed_payment_code`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        external_id: payload.orderId,
        retail_outlet_name: 'ALFAMART', // Default, bisa disesuaikan
        name: `${payload.customer.firstName} ${payload.customer.lastName || ''}`.trim(),
        expected_amount: payload.amount,
        expiration_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error(`Xendit API error: ${response.statusText}`);
    }

    return response.json();
  }

  async getPaymentStatus(paymentId: string) {
    const response = await fetch(`${this.baseUrl}/v2/invoices/${paymentId}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Xendit API error: ${response.statusText}`);
    }

    return response.json();
  }
}
