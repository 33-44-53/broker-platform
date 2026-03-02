# Quick Setup Guide

## 🚀 Get Started in 3 Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. Open Browser
Navigate to: http://localhost:3000

## 🎯 Test the Application

### Demo Login Credentials
Use any of these emails (password can be anything):

**Artisan Dashboard:**
- Email: `artisan@test.com`
- Redirects to: `/artisan`

**Buyer Dashboard:**
- Email: `buyer@test.com`
- Redirects to: `/buyer`

**Admin Dashboard:**
- Email: `admin@test.com`
- Redirects to: `/admin`

## 📍 Key Routes to Explore

### Public Pages
- **Home**: `/`
- **Marketplace**: `/marketplace`
- **Product Details**: `/product`
- **Live Auction**: `/auction`

### Authentication
- **Login**: `/auth/login`
- **Register**: `/auth/register`
- **Forgot Password**: `/auth/forgot-password`

### Dashboards
- **Artisan**: `/artisan` (Product management, orders, analytics)
- **Buyer**: `/buyer` (Order history, wishlist)
- **Admin**: `/admin` (Platform management, disputes)

## 🎨 Features to Test

### Landing Page
✅ Hero section with CTA buttons
✅ Featured products carousel
✅ Statistics cards
✅ Testimonials section
✅ Responsive navigation

### Marketplace
✅ Search functionality
✅ Category filters
✅ Price range slider
✅ Product grid with hover effects
✅ Sorting options

### Artisan Dashboard
✅ Revenue analytics charts
✅ Product management table
✅ Order tracking
✅ Sales analytics

### Buyer Dashboard
✅ Order history
✅ Spending analytics
✅ Wishlist management

### Admin Dashboard
✅ Platform overview
✅ Artisan verification
✅ Commission tracking
✅ Dispute resolution

### Live Auction
✅ Real-time countdown timer
✅ Bid placement
✅ Bid history
✅ Product details

## 🛠️ Tech Stack

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **Framer Motion** - Animations
- **Lucide React** - Icons

## 📦 Project Structure

```
src/
├── app/              # Pages (Next.js App Router)
├── components/       # Reusable components
├── charts/          # Chart components
├── mock-data/       # Sample data
├── types/           # TypeScript types
└── utils/           # Helper functions
```

## 🎨 Design Theme

**Harar-inspired color palette:**
- Gold: #D4AF37
- Brown: #6B4423
- Clay: #C4956C
- Sand: #E8D5B7
- Cream: #F5EFE7

## 📱 Responsive Design

Fully responsive across:
- 📱 Mobile (< 768px)
- 📱 Tablet (768px - 1024px)
- 💻 Desktop (> 1024px)

## 🔥 Hot Tips

1. **Role-based routing**: Login email determines dashboard access
2. **Mock data**: All data is simulated (no backend needed)
3. **Interactive charts**: Hover over charts for details
4. **Animations**: Smooth transitions throughout
5. **Dark mode ready**: Color scheme supports future dark mode

## 🐛 Troubleshooting

**Port already in use?**
```bash
npm run dev -- -p 3001
```

**Dependencies issue?**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Build errors?**
```bash
npm run lint
```

## 📚 Next Steps

1. Explore all dashboards
2. Test responsive design
3. Check interactive features
4. Review code structure
5. Customize as needed

## 💡 Development Tips

- Use `@/` for absolute imports
- All components are TypeScript
- Tailwind classes are customized
- Mock data in `/src/mock-data/`
- Types defined in `/src/types/`

---

**Need help?** Check the main README.md for detailed documentation.

Happy coding! 🎉
