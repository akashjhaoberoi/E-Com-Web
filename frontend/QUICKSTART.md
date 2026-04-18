# Quick Start Guide - React Frontend

## One-Command Setup

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Start Development Server
```bash
npm start
```

The app will open at `http://localhost:3000`

---

## What You Get

✅ **Complete React Frontend** with all pages and components
✅ **Authentication System** - Register, Login, Logout
✅ **Product Listing** - Fetches from backend
✅ **Shopping Cart** - Add, remove, update quantities
✅ **Checkout** - Place orders with shipping info
✅ **Responsive UI** - Works on desktop and mobile
✅ **Error Handling** - User-friendly error messages
✅ **Loading States** - Visual feedback during API calls

---

## Folder Structure Created

```
frontend/
├── public/
│   └── index.html              # Main page
├── src/
│   ├── components/             # Reusable components
│   │   ├── Navbar.js
│   │   ├── ProductCard.js
│   │   ├── LoadingSpinner.js
│   │   └── ProtectedRoute.js
│   ├── pages/                  # Page components
│   │   ├── HomePage.js
│   │   ├── LoginPage.js
│   │   ├── RegisterPage.js
│   │   ├── CartPage.js
│   │   └── CheckoutPage.js
│   ├── utils/                  # Utilities
│   │   ├── api.js              # Axios configuration
│   │   └── auth.js             # Auth helpers
│   ├── App.js                  # Main app with routing
│   └── index.js                # Entry point
├── package.json                # Dependencies
└── README.md                   # Full documentation
```

---

## Routes

| URL | Page | Protected |
|-----|------|-----------|
| `/` | Home (Products) | No |
| `/login` | Login | No |
| `/register` | Register | No |
| `/cart` | Shopping Cart | No |
| `/checkout` | Checkout | **Yes** |

---

## Key Features

### ✅ Authentication
- Register with name, email, password
- Login with email & password
- JWT token stored in localStorage
- Logout clears token

### ✅ Products
- List all products from API
- Display name, description, price, stock
- Add to cart button
- Out of stock handling

### ✅ Shopping Cart
- Add/remove products
- Update quantities (+/- buttons)
- Calculate total with tax
- Persist to localStorage

### ✅ Checkout
- Protected route (login required)
- Shipping information form
- Payment information
- Order summary
- Place order with all details

---

## Dependencies Installed

```
react@18.2.0
react-dom@18.2.0
react-router-dom@6.8.0     # Routing
axios@1.3.2                 # API calls
react-scripts@5.0.1         # Build tools
Tailwind CSS (via CDN)       # Styling
```

---

## API Endpoints Used

```
POST   http://localhost:5000/api/auth/register
POST   http://localhost:5000/api/auth/login
GET    http://localhost:5000/api/products
POST   http://localhost:5000/api/orders          (Protected)
```

---

## Available Commands

```bash
npm start         # Start dev server (http://localhost:3000)
npm build         # Create production build
npm test          # Run tests
npm eject         # Eject from create-react-app
```

---

## Testing Checklist

- [ ] Open http://localhost:3000
- [ ] Register new user
- [ ] Browse products on home page
- [ ] Add products to cart
- [ ] View/modify cart
- [ ] Proceed to checkout
- [ ] Enter shipping info
- [ ] Place order
- [ ] Logout and login
- [ ] Verify cart persists after reload

---

## Important Notes

1. **Backend must be running** on http://localhost:5000
2. **Node.js v14+** required
3. **Browser localStorage** enabled for cart/token
4. **Tailwind CSS** loaded via CDN (internet connection needed)

---

## File Locations

All files created in: `d:\E com web app\frontend\`

---

## Need Help?

1. Check browser console for errors (F12)
2. Check network tab for API responses
3. Verify backend is running
4. Check localStorage in DevTools
5. See full README.md for detailed documentation

---

**That's it! Your complete React E-Commerce frontend is ready to run! 🎉**
