# Quick Start Guide

## Prerequisites
- Node.js 22.x or higher
- pnpm installed (`npm install -g pnpm`)

## Installation & Setup (5 minutes)

```bash
# 1. Navigate to project directory
cd tea-dojo

# 2. Install dependencies
pnpm install

# 3. Generate Prisma client
pnpm exec prisma generate

# 4. Run migrations (creates database)
pnpm exec prisma migrate dev

# 5. Seed database with sample data
pnpm exec tsx prisma/seed.ts

# 6. Start development server
pnpm dev
```

## Access the Application

Open your browser and visit:
- **Homepage**: http://localhost:3000
- **Customer Menu**: http://localhost:3000/scan?store=store-orchard
- **Admin Panel**: http://localhost:3000/admin/menu
- **POS Terminal**: http://localhost:3000/terminal

## Sample Data Created

### Stores
- Tea Dojo Orchard (`store-orchard`)
- Tea Dojo Marina Bay (`store-marina`)

### Menu Items (6 drinks)
- Classic Milk Tea - $5.50
- Brown Sugar Boba - $6.50
- Matcha Latte - $7.00
- Oolong Tea - $4.50
- Fruit Tea - $6.00
- Taro Milk Tea - $6.50

### Voucher Codes
- **WELCOME10** - 10% off (min $5 order)
- **LOYAL5** - $5 off for 3+ orders (min $10 order)
- **FLASH20** - 20% off (min $15 order, max $10 discount)

### Test Users
- John Tan: +6591234567 (150 points)
- Sarah Lim: +6598765432 (320 points)

## Quick Test Flow

1. **Customer Order**:
   - Visit http://localhost:3000/scan?store=store-orchard
   - Browse menu and add items
   - Customize sweetness, ice, add-ons
   - Go to cart and checkout
   - Apply voucher code "WELCOME10"
   - Enter phone "+6591234567" to earn points
   - Complete order

2. **Admin Panel**:
   - Visit http://localhost:3000/admin/menu
   - Add/edit menu items
   - Go to /admin/vouchers
   - Try AI Promo Studio (requires OPENAI_API_KEY in .env)
   - View analytics at /admin/analytics

3. **POS Terminal**:
   - Visit http://localhost:3000/terminal
   - Select store
   - Add items and confirm order

## Environment Variables

Create or update `.env` file:

```env
DATABASE_URL="file:./dev.db"
OPENAI_API_KEY="your-openai-api-key-here"  # Optional, for AI Promo Studio
```

## Common Commands

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# View database in browser
pnpm exec prisma studio

# Reset database
pnpm exec prisma migrate reset

# Re-seed database
pnpm exec tsx prisma/seed.ts
```

## Troubleshooting

**Port 3000 already in use?**
```bash
lsof -ti:3000 | xargs kill -9
pnpm dev
```

**Database issues?**
```bash
pnpm exec prisma migrate reset
pnpm exec tsx prisma/seed.ts
```

**Prisma client errors?**
```bash
pnpm exec prisma generate
```

## Next Steps

- Read full [README.md](./README.md) for detailed documentation
- Explore the codebase in `app/` directory
- Check API routes in `app/api/`
- Review database schema in `prisma/schema.prisma`

## Support

For issues, check the README.md troubleshooting section or contact the development team.
