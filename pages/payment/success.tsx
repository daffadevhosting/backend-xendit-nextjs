// pages/payment/success.tsx
import { useRouter } from 'next/router';

export default function PaymentSuccess() {
  const router = useRouter();
  const { order_id, payment_id } = router.query;

  return (
    <div className="container">
      <div className="success-message">
        <h1>✅ Payment Successful!</h1>
        <p>Thank you for your payment. Your order has been processed successfully.</p>
        
        <div className="details">
          {order_id && <p><strong>Order ID:</strong> {order_id}</p>}
          {payment_id && <p><strong>Payment ID:</strong> {payment_id}</p>}
        </div>

        <button onClick={() => router.push('/')} className="btn-primary">
          Back to Home
        </button>
      </div>

      <style jsx>{`
        .container {
          max-width: 600px;
          margin: 50px auto;
          padding: 20px;
          text-align: center;
        }

        .success-message {
          background: #e8f5e8;
          padding: 40px;
          border-radius: 10px;
          border: 2px solid #4caf50;
        }

        h1 {
          color: #2e7d32;
          margin-bottom: 20px;
        }

        .details {
          margin: 30px 0;
          padding: 20px;
          background: white;
          border-radius: 5px;
          text-align: left;
        }

        .btn-primary {
          background: #0070f3;
          color: white;
          border: none;
          padding: 12px 30px;
          border-radius: 5px;
          font-size: 16px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
