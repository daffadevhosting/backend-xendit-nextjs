# Xendit Payment Gateway - Next.js
---

```markdown
lib/
  ├── xendit/
  │   ├── config.ts
  │   ├── payment.ts
  │   └── webhook.ts
  ├── middleware.ts
  ├── utils/
  │   └── validation.ts
pages/
  ├── api/
  │   ├── payment/
  │   │   ├── create.ts
  │   │   ├── callback.ts
  │   │   └── webhook.ts
  │   └── health.ts
types/
  ├── payment.ts
  └── common.ts
```

Backend payment gateway untuk integrasi Xendit yang dapat digunakan di berbagai platform e-commerce.

## 🚀 Fitur

- ✅ Multiple Payment Methods
  - Virtual Account (BCA, BRI, BNI, dll)
  - QRIS
  - Credit Card
  - E-Wallets (OVO, DANA, LinkAja)
  - Retail Outlet (Alfamart, Indomaret)
- 🔒 Webhook Security
- 📱 Responsive UI Testing
- 🛡 TypeScript Support
- 🔄 Real-time Payment Status

## 📋 Prerequisites

- Node.js 18+ 
- Akun Xendit (https://xendit.co)
- API Keys dari Xendit Dashboard

## 🛠 Installation

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd xendit-payment-gateway


1. Install dependencies
   ```bash
   npm install
   ```
2. Setup Environment Variables
   Buat file .env.local:
   ```env
   XENDIT_SECRET_KEY=your_xendit_secret_key_here
   XENDIT_CALLBACK_TOKEN=your_callback_token_here
   XENDIT_WEBHOOK_TOKEN=your_webhook_token_here
   BASE_URL=http://localhost:3000
   NODE_ENV=development
   ```
3. Dapatkan Xendit Credentials
   · Login ke Xendit Dashboard
   · Navigate ke Settings → API Keys
   · Copy Secret Key
   · Setup Webhook di Settings → Callbacks
4. Run Development Server
   ```bash
   npm run dev
   ```
5. Buka http://localhost:3000

🔧 API Endpoints

1. Create Payment

POST /api/payment/create

Request Body:

```json
{
  "amount": 100000,
  "currency": "IDR",
  "paymentMethod": "VIRTUAL_ACCOUNT",
  "customer": {
    "email": "customer@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+6281234567890"
  },
  "orderId": "ORDER-12345",
  "description": "Payment for Product ABC",
  "items": [
    {
      "name": "Product ABC",
      "quantity": 1,
      "price": 100000
    }
  ],
  "successRedirectUrl": "https://yourstore.com/success",
  "failureRedirectUrl": "https://yourstore.com/failed"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "id": "xendit_payment_id",
    "status": "PENDING",
    "paymentUrl": "https://checkout.xendit.co/web/...",
    "amount": 100000,
    "currency": "IDR",
    "paymentMethod": "VIRTUAL_ACCOUNT",
    "created": "2023-10-01T10:00:00.000Z",
    "updated": "2023-10-01T10:00:00.000Z",
    "metadata": { ... }
  }
}
```

2. Webhook Handler

POST /api/payment/webhook

Handle payment status updates dari Xendit.

3. Callback Handler

GET /api/payment/callback

Redirect user setelah payment completion.

4. Health Check

GET /api/health

🌐 Webhook Setup

1. Di Xendit Dashboard, buka Settings → Callbacks
2. Set Webhook URL ke:
   ```
   https://yourdomain.com/api/payment/webhook
   ```
3. Simpan webhook token di environment variable

🧪 Testing

Manual Testing dengan UI

1. Buka http://localhost:3000
2. Isi form payment
3. Submit untuk test berbagai payment methods

Curl Testing

```bash
# Create Virtual Account Payment
curl -X POST http://localhost:3000/api/payment/create \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 100000,
    "currency": "IDR",
    "paymentMethod": "VIRTUAL_ACCOUNT",
    "customer": {
      "email": "test@example.com",
      "firstName": "Test",
      "lastName": "User"
    },
    "orderId": "TEST-001",
    "description": "Test Payment"
  }'
```

🔒 Security Features

* Webhook signature verification
* Input validation & sanitization
* Environment variable protection
* Error handling tanpa exposure sensitive data

🏗 Architecture

```
Frontend (UI Testing)
    ↓
API Routes (Next.js)
    ↓
Xendit Service Layer
    ↓
Xendit API
    ↑
Webhook Handlers
```

📦 Deployment

Vercel (Recommended)

```bash
npm run build
vercel --prod
```

Manual Deployment

1. Build project: npm run build
2. Start production: npm start
3. Setup environment variables di hosting platform

🔄 Payment Flow

1. Create Payment → Customer memilih payment method
2. Redirect → Customer diarahkan ke Xendit checkout
3. Payment Process → Customer melakukan pembayaran
4. Webhook → System menerima status update
5. Callback → Customer diarahkan kembali ke website

🐛 Troubleshooting

Common Issues:

1. Invalid API Key
   · Pastikan XENDIT_SECRET_KEY sudah benar
   · Check di Xendit Dashboard
2. Webhook Not Working
   · Verify webhook URL di Xendit Dashboard
   · Check webhook token matching
3. Payment Creation Failed
   · Check amount (minimal 10000 untuk IDR)
   · Verify currency support
   · Check payment method availability

📝 License

MIT License

🤝 Support

Untuk pertanyaan atau issues:

1. Check Xendit Documentation
2. Buat issue di repository ini
3. Contact developer team

---

Note: Pastikan untuk tidak commit environment variables ke public repository!

```

## 7. TypeScript Configuration

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

8. Next.js Configuration

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ]
      }
    ]
  }
}

module.exports = nextConfig
```

Cara Menggunakan:

1. Setup Environment Variables seperti di README
2. Jalankan development server: npm run dev
3. Buka http://localhost:3000 untuk testing UI
4. Test berbagai payment methods dengan form yang tersedia
5. Monitor webhook di console/logs
