// pages/api/payment/create.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { XenditPaymentService } from '../../../lib/xendit/payment';
import { CreatePaymentRequest, PaymentResponse } from '../../../types/payment';
import { validateCreatePayment } from '../../../lib/utils/validation';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Validasi request
    const validation = validateCreatePayment(req.body);
    if (!validation.isValid) {
      return res.status(400).json({ 
        error: 'Invalid request payload', 
        details: validation.errors 
      });
    }

    const paymentData: CreatePaymentRequest = req.body;
    const paymentService = new XenditPaymentService();
    
    const payment = await paymentService.createPayment(paymentData);

    const response: PaymentResponse = {
      id: payment.id,
      status: payment.status,
      paymentUrl: payment.paymentUrl,
      amount: payment.amount,
      currency: payment.currency,
      paymentMethod: payment.paymentMethod,
      created: payment.created,
      updated: payment.updated,
      metadata: payment.metadata,
    };

    res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error: any) {
    console.error('Payment creation error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
    });
  }
}
