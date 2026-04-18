# 📋 Quick Reference & Checklist

## 🎯 One-Time Setup Checklist

- [ ] **Clone/extract** the project files
- [ ] **Node.js installed** - Check: `node --version`
- [ ] **MongoDB Atlas account** - https://www.mongodb.com/cloud/atlas
- [ ] **Razorpay account** - https://razorpay.com
- [ ] **Backend dependencies** - `cd backend && npm install`
- [ ] **Frontend dependencies** - `cd frontend && npm install`
- [ ] **Backend .env created** - Copy from `.env.example`
- [ ] **Frontend .env.local created** - Copy from `.env.example`
- [ ] **.env values filled in** - All required keys set

## 🆔 Environment Variables Needed

### Backend `./backend/.env`
```
✓ MONGO_URI           (from MongoDB Atlas)
✓ JWT_SECRET          (create a strong random string)
✓ PORT                (default: 5000)
✓ RAZORPAY_KEY_ID     (from Razorpay dashboard)
✓ RAZORPAY_KEY_SECRET (from Razorpay dashboard)
✓ CORS_ORIGIN         (usually http://localhost:3000)
```

### Frontend `./frontend/.env.local`
```
✓ REACT_APP_API_URL              (http://localhost:5000/api)
✓ REACT_APP_RAZORPAY_KEY_ID      (from Razorpay dashboard)
```

## 🚀 Daily Run Commands

### Terminal 1: Backend Server
```bash
cd backend
npm start
# Server runs at http://localhost:5000
```

### Terminal 2: Frontend Server  
```bash
cd frontend
npm start
# App opens at http://localhost:3000
```

## 🧪 Testing Workflow

### 1. Register New Account
```
URL: http://localhost:3000/register
- Email: test@example.com
- Password: password123
- Confirm: password123
→ Click Register
```

### 2. Browse Products
```
URL: http://localhost:3000
- View available products
- Add products to cart (click "Add to Cart")
- Cart badge updates with count
```

### 3. Go to Cart
```
URL: http://localhost:3000/cart
- View cart items
- Update quantities (+ and - buttons)
- See total price
- Click "Proceed to Checkout"
```

### 4. Checkout Process
```
URL: http://localhost:3000/checkout
Step 1: Fill Shipping Details
- Full Name
- Email
- Phone
- Address
- City, State, ZIP
→ Click "Continue to Payment"

Step 2: Payment
- Click "Pay with Razorpay"
- Use test card:
  * Number: 4111 1111 1111 1111
  * Expiry: 12/25
  * CVV: 123
- Complete payment
→ Payment succeeds, order created
```

### 5. Access Admin (Optional)
```
1. In MongoDB, make yourself admin:
   db.users.updateOne(
     { email: "test@example.com" },
     { $set: { isAdmin: true } }
   )

2. Refresh page

3. Click "Admin Panel" in navbar

4. Add products:
   - Name: "Test Product"
   - Price: 9999
   - Category: "Electronics"
   - Stock: 100
   → Click "Add Product"

5. Manage orders:
   - Click "Orders" tab
   - See order from checkout
   - Update order status
```

## 🔑 Login Credentials (After First Setup)

```
Email: test@example.com
Password: password123
```

## 🔧 Common Quick Fixes

### Server won't start
```bash
# Kill process on port 5000
Windows: netstat -ano | findstr :5000, then taskkill /PID <id> /F
Mac/Linux: lsof -i :5000, then kill -9 <PID>

# Try again
npm start
```

### Dependencies not installing
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Database connection fails
```
1. Check MONGO_URI in .env
2. Verify MongoDB Atlas IP whitelist
3. Restart backend server
```

### Razorpay error in checkout
```
1. Check keys in backend .env
2. Check keys in frontend .env.local  
3. Restart both servers
4. Clear browser cache
```

## 📱 Page Routes

| Route | Purpose | Auth Required |
|-------|---------|----------------|
| `/` | Home page | No |
| `/register` | Create account | No |
| `/login` | Sign in | No |
| `/cart` | View cart | No |
| `/checkout` | Payment | Yes |
| `/admin` | Admin panel | Yes + Admin role |

## 🚨 Error Messages & Solutions

| Error | Solution |
|-------|----------|
| MongoError: connect ECONNREFUSED | MongoDB not running or wrong URI |
| TypeError: Cannot read property 'data' | API endpoint not working |
| Cannot find module 'express' | Run `npm install` in correct directory |
| Port 5000 in use | Kill process using port |
| CORS error | Check CORS_ORIGIN in backend .env |
| Payment failed | Check Razorpay keys are set correctly |

## 🎯 Feature Testing Checklist

### Authentication
- [ ] Register new user
- [ ] Login with credentials
- [ ] Logout works
- [ ] Protected routes redirect to login

### Products
- [ ] View products on home page
- [ ] Filter by category
- [ ] Search products
- [ ] View product details

### Cart
- [ ] Add to cart button works
- [ ] Cart count updates
- [ ] Remove item from cart
- [ ] Update quantity
- [ ] Clear cart on logout

### Checkout & Payment
- [ ] Open checkout page
- [ ] Fill shipping form
- [ ] Razorpay modal opens
- [ ] Test card payment succeeds
- [ ] Order created in database

### Admin
- [ ] Make user admin in MongoDB
- [ ] Access admin panel
- [ ] Add product
- [ ] Edit product  
- [ ] Delete product
- [ ] View orders
- [ ] Update order status

## 📊 Database Collections

After running, MongoDB should have:

### users
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String (hashed),
  isAdmin: Boolean,
  createdAt: Date
}
```

### products
```javascript
{
  _id: ObjectId,
  name: String,
  price: Number,
  category: String,
  stock: Number,
  imageUrl: String,
  createdAt: Date
}
```

### orders
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref to users),
  items: Array of products,
  totalAmount: Number,
  paymentStatus: String,
  orderStatus: String,
  razorpayOrderId: String,
  razorpayPaymentId: String,
  createdAt: Date
}
```

## 💾 Backing Up Data

### Backup MongoDB data
```bash
# Export all data
mongoexport --uri="mongodb+srv://user:pass@cluster.mongodb.net/ecommerce" --collection=users --out=users.json
```

### Import MongoDB data
```bash
# Import data
mongoimport --uri="mongodb+srv://user:pass@cluster.mongodb.net/ecommerce" --collection=users --file=users.json
```

## 🌍 API Health Check

```bash
# Check if backend is running
curl http://localhost:5000/api/health

# Expected response:
# {"success":true,"message":"Server is running"}
```

## 📊 Performance Tips

```javascript
// 1. Use browser DevTools to check response times
// 2. Check MongoDB Atlas dashboard for slow queries
// 3. Monitor backend logs for errors
// 4. Use React DevTools to profile components
```

## 🔒 Security Reminders

- [ ] Never commit `.env` files
- [ ] Change JWT_SECRET before production
- [ ] Use HTTPS in production
- [ ] Enable MongoDB IP whitelist
- [ ] Use strong passwords
- [ ] Keep dependencies updated
- [ ] Never share API keys
- [ ] Validate all user input
- [ ] Enable rate limiting
- [ ] Log all important events

## 📚 File Locations

```
Project Root/
├── backend/
│   ├── .env               (Create this)
│   ├── .env.example       (Reference)
│   ├── server.js
│   ├── package.json
│   └── [other folders]
│
├── frontend/
│   ├── .env.local         (Create this)
│   ├── .env.example       (Reference)
│   ├── src/
│   ├── package.json
│   └── public/
│
└── [Documentation]
    ├── README.md
    ├── SETUP.md
    ├── QUICKSTART.md
    ├── COMPLETE_IMPLEMENTATION_GUIDE.md
    └── PROJECT_UPGRADE_SUMMARY.md
```

## 🎓 Learning Resources

- **React**: https://react.dev/
- **Express**: https://expressjs.com/
- **MongoDB**: https://www.mongodb.com/docs/
- **Tailwind CSS**: https://tailwindcss.com/
- **Razorpay**: https://razorpay.com/docs/api/
- **JWT**: https://jwt.io/introduction

---

**Keep this handy while developing!** 📌

Last Updated: March 29, 2026
