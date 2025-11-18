// pages/api/payment/callback.ts
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { status, order_id, payment_id } = req.query;

  // Redirect user based on payment status
  if (status === 'success') {
    // Redirect to success page
    res.redirect(`/payment/success?order_id=${order_id}&payment_id=${payment_id}`);
  } else if (status === 'failed') {
    // Redirect to failure page
    res.redirect(`/payment/failed?order_id=${order_id}&payment_id=${payment_id}`);
  } else {
    // Redirect to pending page
    res.redirect(`/payment/pending?order_id=${order_id}&payment_id=${payment_id}`);
  }
}
