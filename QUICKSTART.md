# 🚀 Quick Start Guide

Get the production-ready e-commerce app running in 5 minutes!

## ⚡ Quick Setup

### 1. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend (in new terminal)
cd frontend
npm install
```

### 2. Setup Environment Variables

**Backend** - Create `backend/.env`:
```env
MONGO_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/ecommerce
JWT_SECRET=your_secret_key_here
PORT=5000
RAZORPAY_KEY_ID=rzp_test_xxx
RAZORPAY_KEY_SECRET=your_secret_xxx
```

**Frontend** - Create `frontend/.env.local`:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_RAZORPAY_KEY_ID=rzp_test_xxx
```

### 3. Start the Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm start
# Server runs at http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
# App opens at http://localhost:3000
```

## ✅ Features Ready to Use

✅ Product browsing & filtering
✅ Shopping cart with localStorage persistence
✅ User authentication (register/login)
✅ Razorpay payment integration
✅ Admin dashboard (add/edit/delete products)
✅ Order management
✅ Tailwind CSS responsive design
✅ Error handling & loading states

## 🧪 Test the App

1. **Register** - Create a new account
2. **Browse** - Add products to cart
3. **Checkout** - Complete mock payment with test card:
   - Card: 4111 1111 1111 1111
   - Any future expiry date
   - Any 3-digit CVV

4. **Admin** - Make yourself an admin in MongoDB:
   ```
   db.users.updateOne(
     { email: "your@email.com" },
     { $set: { isAdmin: true } }
   )
   ```
   Then access `/admin` dashboard

## 📋 Checklist

- [ ] Node.js installed
- [ ] MongoDB Atlas account created
- [ ] Razorpay account created
- [ ] Environment variables configured
- [ ] Backend npm dependencies installed
- [ ] Frontend npm dependencies installed
- [ ] Backend server running (port 5000)
- [ ] Frontend server running (port 3000)
- [ ] Can access http://localhost:3000

## 🆘 Common Issues

**"Cannot connect to MongoDB"**
→ Check MONGO_URI format and IP whitelist in MongoDB Atlas

**"Razorpay error"**
→ Verify keys in both backend AND frontend .env files

**"Port 5000 already in use"**
→ Change PORT in .env or kill the process using that port

## 📚 Full Documentation

See `SETUP.md` for complete installation guide and troubleshooting.

That's it! Your production e-commerce app is ready. 🎉

---

Questions? Check the code comments or refer to individual file documentation.
