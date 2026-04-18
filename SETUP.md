# 🚀 Production E-Commerce App - Complete Setup Guide

This is a full-stack e-commerce application with advanced features including cart management, Razorpay payment integration, admin dashboard, and image uploads.

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account (free tier available)
- Razorpay account (for payments)
- Cloudinary account (for image uploads - optional)

## 🔧 Installation & Setup

### Step 1: Clone & Install Dependencies

#### Backend Setup
```bash
cd backend
npm install
```

#### Frontend Setup
```bash
cd frontend
npm install
```

### Step 2: Configure Environment Variables

#### Backend (.env file)

Create a `.env` file in the `backend` folder:

```env
# MongoDB
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce?retryWrites=true&w=majority

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_in_production_12345
JWT_EXPIRE=7d

# Server
PORT=5000

# CORS
CORS_ORIGIN=http://localhost:3000

# Cloudinary (Optional)
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Razorpay
RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXXX
RAZORPAY_KEY_SECRET=XXXXXXXXXXXXXXXXXXXXX
```

**How to get these values:**

- **MongoDB**: Go to MongoDB Atlas → Create cluster → Connection string
- **JWT Secret**: Generate a strong random string
- **Razorpay**: Go to https://razorpay.com → Sign up → Get test keys from Dashboard
- **Cloudinary**: Go to cloudinary.com → Sign up → Get credentials from Dashboard

#### Frontend (.env.local file)

Create a `.env.local` file in the `frontend` folder:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXXX
```

### Step 3: Create Admin User (Optional)

You can create an admin user through the registration endpoint by manually updating the user in MongoDB after registration:

```javascript
// In MongoDB, update the user:
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { isAdmin: true } }
);
```

## 📊 Database Setup

### MongoDB Collections Structure

The application automatically creates these collections:

1. **users** - User accounts and authentication
2. **products** - Product catalog
3. **orders** - Order records with payment information

## 🏃 Running the Application

### Start Backend Server

```bash
cd backend
npm start
# or for development with auto-reload:
npm run dev
```

Backend will run on `http://localhost:5000`

### Start Frontend Server

In a new terminal:

```bash
cd frontend
npm start
```

Frontend will run on `http://localhost:3000`

## 🔑 Key Features

### 1. Cart System
- Add/remove products from cart
- Update quantities in real-time
- Persist cart to localStorage
- Global state management with React Context

### 2. Authentication
- User registration and login
- JWT token-based authentication
- Protected routes
- Admin-only access routes

### 3. Checkout & Payment
- Multi-step checkout process
- Razorpay payment integration
- Order creation after successful payment
- Payment verification with signature validation

### 4. Admin Dashboard
- Add, edit, delete products
- Manage orders and order status
- View all orders and customer details
- Product management with stock tracking

### 5. Image Upload
- Cloudinary integration for product images
- Secure image upload with validation
- Image URL storage in database

### 6. UI/UX
- Responsive design with Tailwind CSS
- Modern component-based architecture
- Loading and error states
- Toast notifications for user feedback

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)
- `POST /api/products/upload-image` - Upload product image (admin only)

### Orders
- `POST /api/orders` - Create order (protected)
- `POST /api/orders/verify-payment` - Verify Razorpay payment
- `GET /api/orders` - Get all orders (admin only)
- `GET /api/orders/my-orders` - Get user's orders
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id/status` - Update order status (admin only)
- `PUT /api/orders/:id/cancel` - Cancel order

## 🧪 Testing with Razorpay

Use these test credentials for Razorpay:

**Test Card Number**: 4111 1111 1111 1111
**Expiry**: Any future date (e.g., 12/25)
**CVV**: Any 3 digits (e.g., 123)

## 📦 Project Structure

```
backend/
├── models/
│   ├── User.js
│   ├── Product.js
│   └── Order.js
├── controllers/
│   ├── authController.js
│   ├── productController.js
│   └── orderController.js
├── routes/
│   ├── auth.js
│   ├── product.js
│   └── order.js
├── middleware/
│   ├── auth.js
│   └── errorHandler.js
├── server.js
└── package.json

frontend/
├── src/
│   ├── components/
│   │   ├── Navbar.js
│   │   ├── ProductCard.js
│   │   ├── ProtectedRoute.js
│   │   └── AdminRoute.js
│   ├── pages/
│   │   ├── HomePage.js
│   │   ├── LoginPage.js
│   │   ├── RegisterPage.js
│   │   ├── CartPage.js
│   │   ├── CheckoutPage.js
│   │   └── AdminPanel.js
│   ├── context/
│   │   └── CartContext.js
│   ├── utils/
│   │   ├── api.js
│   │   └── auth.js
│   ├── App.js
│   ├── index.js
│   └── index.css
└── package.json
```

## 🚨 Troubleshooting

### "MongoDB connection error"
- Check your MongoDB URI in .env
- Ensure MongoDB Atlas IP whitelist includes your IP
- Verify database credentials

### "Razorpay key not found"
- Ensure RAZORPAY_KEY_ID is set in backend .env
- Ensure REACT_APP_RAZORPAY_KEY_ID is set in frontend .env.local

### "CORS error"
- Check CORS_ORIGIN in backend .env matches frontend URL
- Ensure frontend URL is http://localhost:3000 during development

### "Image upload not working"
- Verify Cloudinary credentials in .env
- Check file size limits
- Ensure image format is supported

## 📝 Sample Data (for testing)

You can use the Admin Panel to add sample products:

```json
{
  "name": "Laptop",
  "description": "High-performance laptop for professionals",
  "price": 89999,
  "category": "Electronics",
  "stock": 50
}
```

## 🔐 Security Notes

1. **Production**: 
   - Change JWT_SECRET to a strong random value
   - Set environment variables via hosting platform
   - Use HTTPS only
   - Set secure CORS_ORIGIN

2. **Database**:
   - Use strong MongoDB password
   - Enable IP whitelist on MongoDB Atlas
   - Regular backups

3. **Payments**:
   - Use live Razorpay keys in production
   - Never commit .env files to git
   - Validate all payment data server-side

## 📚 Dependencies

### Backend
- Express.js - Web framework
- Mongoose - MongoDB ODM
- bcryptjs - Password hashing
- jsonwebtoken - JWT authentication
- axios - HTTP client
- cloudinary - Image upload service
- razorpay - Payment integration
- cors - Cross-origin resource sharing
- dotenv - Environment variables

### Frontend
- React - UI library
- React Router - Client-side routing
- Axios - API calls
- Tailwind CSS - Styling
- Context API - State management

## 🎉 Success!

Your production-ready e-commerce app is now set up and running. 

**Next steps:**
1. Add more products via Admin Panel
2. Test the complete checkout flow
3. Test admin features
4. Deploy to production

For questions or issues, refer to the individual file documentation or check GitHub repositories of the used libraries.

Happy coding! 🚀
