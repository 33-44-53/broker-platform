# 🚀 Installation & Testing Guide

## Step 1: Install Dependencies

Open your terminal in the project directory and run:

```bash
npm install
```

This will install all required packages:
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Recharts
- Framer Motion
- Lucide React

**Expected time**: 2-3 minutes

## Step 2: Start Development Server

```bash
npm run dev
```

You should see:
```
✓ Ready in 2.5s
○ Local:   http://localhost:3000
```

## Step 3: Open in Browser

Navigate to: **http://localhost:3000**

## 🧪 Testing Checklist

### ✅ Landing Page (/)
- [ ] Hero section loads
- [ ] Featured products display
- [ ] Statistics cards show
- [ ] Testimonials visible
- [ ] Navigation works
- [ ] Footer displays

### ✅ Authentication
**Login (/auth/login)**
- [ ] Email input works
- [ ] Password toggle works
- [ ] Login redirects based on email:
  - `artisan@test.com` → `/artisan`
  - `buyer@test.com` → `/buyer`
  - `admin@test.com` → `/admin`

**Register (/auth/register)**
- [ ] Role selection works
- [ ] Form validation works
- [ ] All inputs functional

### ✅ Marketplace (/marketplace)
- [ ] Products display in grid
- [ ] Search bar works
- [ ] Category filters work
- [ ] Price slider works
- [ ] Sorting dropdown works
- [ ] Product cards have hover effects
- [ ] Cart and wishlist icons show

### ✅ Product Details (/product)
- [ ] Image gallery works
- [ ] Thumbnail selection works
- [ ] Quantity selector works
- [ ] Add to cart button visible
- [ ] Reviews section displays
- [ ] Similar products show

### ✅ Live Auction (/auction)
- [ ] Countdown timer works
- [ ] Current bid displays
- [ ] Bid input functional
- [ ] Bid history shows
- [ ] Product details visible

### ✅ Artisan Dashboard (/artisan)
- [ ] Sidebar navigation works
- [ ] Metric cards display
- [ ] Charts render correctly:
  - [ ] Pie chart
  - [ ] Bar chart
  - [ ] Line chart
- [ ] Product table shows
- [ ] Order table displays
- [ ] Tab switching works

### ✅ Buyer Dashboard (/buyer)
- [ ] Overview displays
- [ ] Order history table works
- [ ] Wishlist grid shows
- [ ] Charts render
- [ ] Tab navigation works

### ✅ Admin Dashboard (/admin)
- [ ] Platform metrics show
- [ ] Artisan table displays
- [ ] Commission charts work
- [ ] Dispute table shows
- [ ] All tabs functional

## 🎨 Visual Testing

### Responsive Design
Test on different screen sizes:

**Desktop (> 1024px)**
```bash
# Full browser window
```

**Tablet (768px - 1024px)**
```bash
# Resize browser or use DevTools
```

**Mobile (< 768px)**
```bash
# Use DevTools mobile view
```

### Animations
- [ ] Page transitions smooth
- [ ] Hover effects work
- [ ] Button clicks animate
- [ ] Charts animate on load
- [ ] Toast notifications appear

### Colors
Verify Harar theme colors:
- [ ] Gold (#D4AF37) - Primary buttons
- [ ] Brown (#6B4423) - Text
- [ ] Clay (#C4956C) - Accents
- [ ] Sand (#E8D5B7) - Backgrounds
- [ ] Cream (#F5EFE7) - Cards

## 🐛 Common Issues & Solutions

### Issue: Port 3000 already in use
**Solution:**
```bash
npm run dev -- -p 3001
```

### Issue: Module not found
**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: TypeScript errors
**Solution:**
```bash
npm run lint
```

### Issue: Styles not loading
**Solution:**
```bash
# Restart dev server
Ctrl+C
npm run dev
```

## 📊 Performance Testing

### Build Test
```bash
npm run build
```

Should complete without errors.

### Production Test
```bash
npm run build
npm run start
```

Open http://localhost:3000

## ✅ Success Criteria

Your installation is successful if:
- ✅ No console errors
- ✅ All pages load
- ✅ Navigation works
- ✅ Charts display
- ✅ Animations smooth
- ✅ Responsive on all devices
- ✅ Forms functional
- ✅ Mock data displays

## 🎯 Quick Test Route

Test all features in 5 minutes:

1. **Home** (/) - Check hero and products
2. **Login** (/auth/login) - Test with `artisan@test.com`
3. **Artisan Dashboard** (/artisan) - Check charts
4. **Marketplace** (/marketplace) - Test filters
5. **Product** (/product) - Check details
6. **Auction** (/auction) - Watch countdown

## 📝 Test Results Template

```
Date: ___________
Tester: ___________

Landing Page:        [ ] Pass  [ ] Fail
Authentication:      [ ] Pass  [ ] Fail
Marketplace:         [ ] Pass  [ ] Fail
Product Details:     [ ] Pass  [ ] Fail
Auction:            [ ] Pass  [ ] Fail
Artisan Dashboard:   [ ] Pass  [ ] Fail
Buyer Dashboard:     [ ] Pass  [ ] Fail
Admin Dashboard:     [ ] Pass  [ ] Fail
Responsive Design:   [ ] Pass  [ ] Fail
Animations:         [ ] Pass  [ ] Fail

Overall: [ ] Pass  [ ] Fail

Notes:
_________________________________
_________________________________
```

## 🚀 Ready for Production

Once all tests pass:
```bash
npm run build
npm run start
```

Your app is production-ready! 🎉

## 📞 Need Help?

Check these files:
- `README.md` - Full documentation
- `QUICKSTART.md` - Quick setup
- `FEATURES.md` - Feature list
- `PROJECT_SUMMARY.md` - Overview

---

**Happy Testing! 🧪**
