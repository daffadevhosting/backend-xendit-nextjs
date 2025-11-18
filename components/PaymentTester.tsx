// components/PaymentTester.tsx
import React, { useState } from 'react';
import { PAYMENT_METHODS } from '../lib/xendit/config';

interface PaymentFormData {
  amount: number;
  currency: string;
  paymentMethod: string;
  customer: {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
  };
  orderId: string;
  description: string;
  successRedirectUrl: string;
  failureRedirectUrl: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

const PaymentTester: React.FC = () => {
  const [formData, setFormData] = useState<PaymentFormData>({
    amount: 100000,
    currency: 'IDR',
    paymentMethod: PAYMENT_METHODS.VIRTUAL_ACCOUNT,
    customer: {
      email: 'customer@example.com',
      firstName: 'John',
      lastName: 'Doe',
      phone: '+6281234567890',
    },
    orderId: `ORDER-${Date.now()}`,
    description: 'Test Payment',
    successRedirectUrl: `${typeof window !== 'undefined' ? window.location.origin : ''}/payment/success`,
    failureRedirectUrl: `${typeof window !== 'undefined' ? window.location.origin : ''}/payment/failed`,
    items: [
      {
        name: 'Test Product',
        quantity: 1,
        price: 100000,
      },
    ],
  });

  const [loading, setLoading] = useState(false);
  const [paymentResult, setPaymentResult] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('customer.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        customer: {
          ...prev.customer,
          [field]: value,
        },
      }));
    } else if (name.startsWith('items.')) {
      const [_, index, field] = name.split('.');
      const items = [...formData.items];
      items[parseInt(index)] = {
        ...items[parseInt(index)],
        [field]: field === 'name' ? value : Number(value),
      };
      setFormData(prev => ({ ...prev, items }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'amount' ? Number(value) : value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setPaymentResult(null);

    try {
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setPaymentResult(result.data);
        
        // Redirect to payment URL if available
        if (result.data.paymentUrl) {
          window.open(result.data.paymentUrl, '_blank');
        }
      } else {
        setError(result.error || 'Payment creation failed');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [
        ...prev.items,
        { name: '', quantity: 1, price: 0 },
      ],
    }));
  };

  const removeItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="container">
      <h1>Xendit Payment Tester</h1>
      
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          {/* Basic Information */}
          <div className="form-section">
            <h2>Basic Information</h2>
            
            <div className="form-group">
              <label>Order ID:</label>
              <input
                type="text"
                name="orderId"
                value={formData.orderId}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Amount:</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Currency:</label>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleInputChange}
              >
                <option value="IDR">IDR</option>
                <option value="USD">USD</option>
                <option value="SGD">SGD</option>
                <option value="PHP">PHP</option>
              </select>
            </div>

            <div className="form-group">
              <label>Payment Method:</label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleInputChange}
                required
              >
                <option value={PAYMENT_METHODS.VIRTUAL_ACCOUNT}>Virtual Account</option>
                <option value={PAYMENT_METHODS.QRIS}>QRIS</option>
                <option value={PAYMENT_METHODS.CREDIT_CARD}>Credit Card</option>
                <option value={PAYMENT_METHODS.RETAIL_OUTLET}>Retail Outlet</option>
                <option value={PAYMENT_METHODS.OVO}>OVO</option>
                <option value={PAYMENT_METHODS.DANA}>DANA</option>
                <option value={PAYMENT_METHODS.LINKAJA}>LinkAja</option>
              </select>
            </div>

            <div className="form-group">
              <label>Description:</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
          </div>

          {/* Customer Information */}
          <div className="form-section">
            <h2>Customer Information</h2>
            
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="customer.email"
                value={formData.customer.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>First Name:</label>
                <input
                  type="text"
                  name="customer.firstName"
                  value={formData.customer.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Last Name:</label>
                <input
                  type="text"
                  name="customer.lastName"
                  value={formData.customer.lastName}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Phone:</label>
              <input
                type="tel"
                name="customer.phone"
                value={formData.customer.phone}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Items */}
          <div className="form-section">
            <div className="section-header">
              <h2>Items</h2>
              <button type="button" onClick={addItem} className="btn-secondary">
                Add Item
              </button>
            </div>

            {formData.items.map((item, index) => (
              <div key={index} className="item-row">
                <div className="form-group">
                  <label>Name:</label>
                  <input
                    type="text"
                    name={`items.${index}.name`}
                    value={item.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Quantity:</label>
                  <input
                    type="number"
                    name={`items.${index}.quantity`}
                    value={item.quantity}
                    onChange={handleInputChange}
                    min="1"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Price:</label>
                  <input
                    type="number"
                    name={`items.${index}.price`}
                    value={item.price}
                    onChange={handleInputChange}
                    min="0"
                    required
                  />
                </div>

                {formData.items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="btn-remove"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Redirect URLs */}
          <div className="form-section">
            <h2>Redirect URLs</h2>
            
            <div className="form-group">
              <label>Success URL:</label>
              <input
                type="url"
                name="successRedirectUrl"
                value={formData.successRedirectUrl}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Failure URL:</label>
              <input
                type="url"
                name="failureRedirectUrl"
                value={formData.failureRedirectUrl}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Creating Payment...' : 'Create Payment'}
          </button>
        </form>
      </div>

      {/* Results */}
      {error && (
        <div className="error-message">
          <h3>Error:</h3>
          <p>{error}</p>
        </div>
      )}

      {paymentResult && (
        <div className="result-container">
          <h3>Payment Created Successfully!</h3>
          <div className="result-details">
            <p><strong>Payment ID:</strong> {paymentResult.id}</p>
            <p><strong>Status:</strong> {paymentResult.status}</p>
            <p><strong>Amount:</strong> {paymentResult.amount} {paymentResult.currency}</p>
            <p><strong>Payment Method:</strong> {paymentResult.paymentMethod}</p>
            <p><strong>Created:</strong> {new Date(paymentResult.created).toLocaleString()}</p>
            
            {paymentResult.paymentUrl && (
              <div className="payment-url">
                <p><strong>Payment URL:</strong></p>
                <a 
                  href={paymentResult.paymentUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-secondary"
                >
                  Open Payment Page
                </a>
              </div>
            )}
            
            <div className="json-view">
              <h4>Raw Response:</h4>
              <pre>{JSON.stringify(paymentResult, null, 2)}</pre>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        h1 {
          color: #333;
          text-align: center;
          margin-bottom: 30px;
        }

        .form-container {
          background: #f9f9f9;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .form-section {
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 1px solid #ddd;
        }

        .form-section h2 {
          color: #555;
          margin-bottom: 20px;
          font-size: 1.2em;
        }

        .form-group {
          margin-bottom: 15px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }

        .item-row {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr auto;
          gap: 10px;
          align-items: end;
          margin-bottom: 15px;
          padding: 15px;
          background: white;
          border-radius: 5px;
        }

        label {
          display: block;
          margin-bottom: 5px;
          font-weight: 600;
          color: #333;
        }

        input, select, textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 5px;
          font-size: 14px;
          box-sizing: border-box;
        }

        input:focus, select:focus, textarea:focus {
          outline: none;
          border-color: #0070f3;
        }

        .btn-primary {
          background: #0070f3;
          color: white;
          border: none;
          padding: 12px 30px;
          border-radius: 5px;
          font-size: 16px;
          cursor: pointer;
          width: 100%;
        }

        .btn-primary:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .btn-secondary {
          background: #666;
          color: white;
          border: none;
          padding: 8px 15px;
          border-radius: 5px;
          font-size: 14px;
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
        }

        .btn-remove {
          background: #ff4444;
          color: white;
          border: none;
          padding: 8px 12px;
          border-radius: 5px;
          font-size: 12px;
          cursor: pointer;
        }

        .error-message {
          background: #ffebee;
          color: #c62828;
          padding: 15px;
          border-radius: 5px;
          margin-top: 20px;
        }

        .result-container {
          background: #e8f5e8;
          padding: 20px;
          border-radius: 5px;
          margin-top: 20px;
        }

        .result-details {
          margin-top: 15px;
        }

        .payment-url {
          margin: 15px 0;
        }

        .json-view {
          margin-top: 15px;
        }

        .json-view pre {
          background: white;
          padding: 15px;
          border-radius: 5px;
          overflow-x: auto;
          font-size: 12px;
        }

        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
          }
          
          .item-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default PaymentTester;
