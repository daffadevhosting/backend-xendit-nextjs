// lib/utils/validation.ts
import { CreatePaymentRequest } from '../../types/payment';

export function validateCreatePayment(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.amount || typeof data.amount !== 'number' || data.amount <= 0) {
    errors.push('Amount must be a positive number');
  }

  if (!data.paymentMethod || typeof data.paymentMethod !== 'string') {
    errors.push('Payment method is required');
  }

  if (!data.customer || !data.customer.email || !data.customer.firstName) {
    errors.push('Customer email and first name are required');
  }

  if (!data.orderId || typeof data.orderId !== 'string') {
    errors.push('Order ID is required');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
