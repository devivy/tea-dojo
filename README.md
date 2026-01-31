# Tea Dojo - Ordering & Loyalty System

A complete ordering and loyalty system for Tea Dojo, built with Next.js, Tailwind CSS, Prisma, and SQLite.

## Features

### Customer Features
- **QR Code Store Selection** (`/scan?store=<store-id>`) - Scan to select store location
- **Menu Browsing** (`/menu`) - View all available drinks with prices
- **Item Customization** (`/item/[id]`) - Customize sweetness, ice level, add-ons, and special notes
- **Shopping Cart** (`/cart`) - Review and modify orders before checkout
- **Voucher Application** (`/checkout`) - Apply discount codes at checkout
- **Loyalty Points** - Earn 1 point per dollar spent
- **Order Confirmation** (`/order/[id]`) - View order details and updated loyalty points

### Admin Features
- **Menu Management** (`/admin/menu`) - Create, edit, and disable menu items
- **Voucher Management** (`/admin/vouchers`) - CRUD operations for discount vouchers
- **AI Promo Studio** - AI-powered promotional campaign generator
- **Analytics Dashboard** (`/admin/analytics`) - View top items, orders by hour, customer segments, and voucher redemptions
- **Grab Order Sync** (`/admin/grab-sync`) - Import orders from Grab delivery platform

### POS Terminal
- **Terminal Interface** (`/terminal`) - Simple cashier order creation for in-store purchases

### API Endpoints
- `POST /api/grab/webhook` - Webhook to receive Grab orders
- `POST /api/orders` - Create new orders
- `POST /api/vouchers/validate` - Validate voucher codes
- `GET /api/menu` - Fetch active menu items
- `GET /api/orders/[id]` - Get order details

## Tech Stack

- **Framework**: Next.js 16.1.6 (App Router)
- **Styling**: Tailwind CSS 4.1.18
- **Database**: SQLite with Prisma ORM 7.3.0
- **Language**: TypeScript
- **AI**: OpenAI API for promo generation

## Database Schema

### Tables
- **Stores** - Store locations and information
- **MenuItems** - Drinks and products
- **Users** - Customer accounts with loyalty points
- **Orders** - Order records with status tracking
- **OrderItems** - Individual items in orders with customizations
- **Vouchers** - Discount codes with usage limits and conditions
- **LoyaltyLedger** - Transaction log for loyalty points
- **GrabOrders** - External orders from Grab platform

## Setup Instructions

### Prerequisites
- Node.js 22.x or higher
- pnpm package manager

### Installation

1. **Clone or extract the repository**
   ```bash
   cd tea-dojo
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   
   The `.env` file should already contain:
   ```
   DATABASE_URL="file:./dev.db"
   ```
   
   For AI Promo Studio, add your OpenAI API key:
   ```
   OPENAI_API_KEY="your-openai-api-key"
   ```

4. **Generate Prisma client**
   ```bash
   pnpm exec prisma generate
   ```

5. **Run database migrations**
   ```bash
   pnpm exec prisma migrate dev
   ```

6. **Seed the database**
   ```bash
   pnpm exec tsx prisma/seed.ts
   ```

   This will create:
   - 2 store locations (Orchard, Marina Bay)
   - 6 menu items (various tea drinks)
   - 2 test users with loyalty points
   - 3 sample vouchers (WELCOME10, LOYAL5, FLASH20)
   - 1 sample order with loyalty ledger entry
   - 1 sample Grab order

### Running the Application

**Development mode:**
```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

**Production build:**
```bash
pnpm build
pnpm start
```

## Usage Guide

### Customer Flow

1. **Start**: Visit homepage or scan QR code at `/scan?store=store-orchard`
2. **Browse**: View menu at `/menu`
3. **Customize**: Click on item to customize sweetness, ice, add-ons
4. **Cart**: Review items in `/cart`
5. **Checkout**: Apply voucher code and provide phone number for loyalty points
6. **Confirm**: View order confirmation with updated loyalty points

### Admin Flow

1. **Menu Management**: Add/edit/disable menu items at `/admin/menu`
2. **Voucher Management**: Create vouchers manually or use AI Promo Studio at `/admin/vouchers`
3. **Analytics**: View business metrics at `/admin/analytics`
4. **Grab Sync**: Import Grab orders at `/admin/grab-sync`

### POS Terminal

1. Visit `/terminal`
2. Select store location
3. Add items to cart
4. Confirm order

### AI Promo Studio

1. Go to `/admin/vouchers`
2. Click "🤖 AI Promo Studio"
3. Enter target segment (e.g., "New customers")
4. Enter campaign goal (e.g., "Increase first-time orders")
5. Click "✨ Generate Promo"
6. Review AI-generated voucher details
7. Click "Save as Voucher" to create

## Sample Voucher Codes

- **WELCOME10** - 10% off for new customers (min $5 order)
- **LOYAL5** - $5 off for customers with 3+ orders (min $10 order)
- **FLASH20** - 20% off limited time (min $15 order, max $10 discount)

## API Testing

### Test Grab Webhook

```bash
curl -X POST http://localhost:3000/api/grab/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "GRAB-2026-002",
    "customer": {
      "name": "Bob Lee",
      "phone": "+6598887777"
    },
    "items": [
      {
        "name": "Matcha Latte",
        "quantity": 1,
        "price": 7.00
      }
    ],
    "total": 7.00
  }'
```

### Test Order Creation

```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "storeId": "store-orchard",
    "items": [
      {
        "menuItemId": "<menu-item-id>",
        "name": "Classic Milk Tea",
        "price": 5.50,
        "quantity": 1,
        "sweetness": "normal",
        "ice": "less"
      }
    ],
    "userPhone": "+6591234567",
    "userName": "Test User"
  }'
```

## Project Structure

```
tea-dojo/
├── app/
│   ├── admin/              # Admin panel pages
│   │   ├── analytics/      # Analytics dashboard
│   │   ├── grab-sync/      # Grab order sync
│   │   ├── menu/           # Menu management
│   │   └── vouchers/       # Voucher management + AI Studio
│   ├── api/                # API routes
│   │   ├── admin/          # Admin API endpoints
│   │   ├── grab/           # Grab webhook
│   │   ├── menu/           # Menu endpoints
│   │   ├── orders/         # Order endpoints
│   │   ├── terminal/       # Terminal endpoints
│   │   └── vouchers/       # Voucher validation
│   ├── cart/               # Shopping cart page
│   ├── checkout/           # Checkout page
│   ├── item/[id]/          # Item customization page
│   ├── menu/               # Menu browsing page
│   ├── order/[id]/         # Order confirmation page
│   ├── scan/               # QR code store selection
│   ├── terminal/           # POS terminal page
│   ├── layout.tsx          # Root layout with providers
│   └── page.tsx            # Homepage
├── lib/
│   ├── cart-context.tsx    # Cart state management
│   ├── store-context.tsx   # Store selection state
│   └── prisma.ts           # Prisma client singleton
├── prisma/
│   ├── schema.prisma       # Database schema
│   ├── seed.ts             # Seed script
│   └── migrations/         # Database migrations
├── .env                    # Environment variables
├── package.json            # Dependencies
└── README.md               # This file
```

## Database Management

### View database with Prisma Studio
```bash
pnpm exec prisma studio
```

### Reset database
```bash
pnpm exec prisma migrate reset
```

### Create new migration
```bash
pnpm exec prisma migrate dev --name <migration-name>
```

## Troubleshooting

### Port already in use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Database locked error
```bash
# Stop all processes and reset
pnpm exec prisma migrate reset
pnpm exec tsx prisma/seed.ts
```

### Prisma client not generated
```bash
pnpm exec prisma generate
```

## License

MIT

## Support

For issues or questions, please contact the development team.
