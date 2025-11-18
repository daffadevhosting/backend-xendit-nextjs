// pages/payment/failed.tsx
import { useRouter } from 'next/router';

export default function PaymentFailed() {
  const router = useRouter();
  const { order_id, payment_id } = router.query;

  return (
    <div className="container">
      <div className="error-message">
        <h1>❌ Payment Failed</h1>
        <p>We're sorry, but your payment could not be processed. Please try again.</p>
        
        <div className="details">
          {order_id && <p><strong>Order ID:</strong> {order_id}</p>}
          {payment_id && <p><strong>Payment ID:</strong> {payment_id}</p>}
        </div>

        <div className="actions">
          <button onClick={() => router.push('/')} className="btn-secondary">
            Back to Home
          </button>
          <button onClick={() => router.back()} className="btn-primary">
            Try Again
          </button>
        </div>
      </div>

      <style jsx>{`
        .container {
          max-width: 600px;
          margin: 50px auto;
          padding: 20px;
          text-align: center;
        }

        .error-message {
          background: #ffebee;
          padding: 40px;
          border-radius: 10px;
          border: 2px solid #f44336;
        }

        h1 {
          color: #c62828;
          margin-bottom: 20px;
        }

        .details {
          margin: 30px 0;
          padding: 20px;
          background: white;
          border-radius: 5px;
          text-align: left;
        }

        .actions {
          display: flex;
          gap: 15px;
          justify-content: center;
          margin-top: 20px;
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

        .btn-secondary {
          background: #666;
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
