# E-Commerce Frontend - React

A complete React-based frontend for a full-stack E-commerce application with user authentication, product browsing, shopping cart, and checkout functionality.

## Features

✅ User Authentication (Register & Login)
✅ Product Listing with Add to Cart
✅ Shopping Cart Management (Add/Remove/Update quantities)
✅ Checkout with Order Summary
✅ JWT Token Authentication
✅ Protected Routes
✅ Responsive Design with Tailwind CSS
✅ Loading States & Error Handling
✅ localStorage for Cart Persistence

## Folder Structure

```
frontend/
├── public/
│   └── index.html              # Main HTML file
├── src/
│   ├── components/
│   │   ├── Navbar.js           # Navigation bar component
│   │   ├── ProductCard.js      # Product card component
│   │   ├── LoadingSpinner.js   # Loading spinner component
│   │   └── ProtectedRoute.js   # Protected route wrapper
│   ├── pages/
│   │   ├── HomePage.js         # Home/Products listing page
│   │   ├── LoginPage.js        # Login page
│   │   ├── RegisterPage.js     # Registration page
│   │   ├── CartPage.js         # Shopping cart page
│   │   └── CheckoutPage.js     # Checkout page
│   ├── utils/
│   │   ├── api.js              # Axios API configuration
│   │   └── auth.js             # Authentication utilities
│   ├── App.js                  # Main App component with routing
│   └── index.js                # React entry point
├── package.json                # Project dependencies
├── .gitignore                  # Git ignore file
└── README.md                   # This file
```

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend running on http://localhost:5000

## Installation & Setup

### Step 1: Navigate to Frontend Directory

```bash
cd frontend
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install:
- react (v18.2.0)
- react-dom (v18.2.0)
- react-router-dom (v6.8.0)
- axios (v1.3.2)
- react-scripts (5.0.1)
- Tailwind CSS (via CDN in HTML)

### Step 3: Start the Development Server

```bash
npm start
```

The application will open automatically at `http://localhost:3000`

## Usage

### Available Routes

| Route | Description | Protected |
|-------|-------------|-----------|
| `/` | Home page with product listing | No |
| `/login` | User login page | No |
| `/register` | User registration page | No |
| `/cart` | Shopping cart | No |
| `/checkout` | Checkout page | Yes (requires login) |

### How to Use the Application

1. **Homepage**: Browse all available products from the backend. Click "Add to Cart" to add products.

2. **Registration**: 
   - Click "Register" in navbar
   - Fill in name, email, password
   - User is automatically logged in after registration

3. **Login**:
   - Click "Login" in navbar
   - Enter email and password
   - JWT token is stored in localStorage

4. **Shopping Cart**:
   - View all added items
   - Adjust quantities with +/- buttons
   - Remove items individually
   - See calculated total with tax

5. **Checkout** (Protected Route):
   - Enter shipping information
   - Enter card details (16-digit number)
   - Place order
   - Redirects to home after successful order

## API Integration

The frontend connects to the backend running on `http://localhost:5000`

### Available APIs Used:

```
POST   /api/auth/register       - User registration
POST   /api/auth/login          - User login
GET    /api/products            - Get all products
POST   /api/orders              - Create order (protected)
```

### Authentication Header:

After login, all protected API calls automatically include:
```
Authorization: Bearer <JWT_TOKEN>
```

## Key Features Explained

### 1. JWT Token Management
- Token is stored in localStorage after login
- Automatically included in all API requests via axios interceptor
- Cleared on logout

### 2. Cart Management
- Cart items stored in localStorage
- Persists across browser sessions
- Quantity updates reflected in total calculation
- Items can be added, removed, or quantity adjusted

### 3. Protected Routes
- Checkout page requires authentication
- Automatically redirects unauthenticated users to login

### 4. Error Handling
- API errors displayed in user-friendly messages
- Form validation before submission
- Loading states during API calls

### 5. Responsive Design
- Mobile-friendly design using Tailwind CSS
- Grid layout adjusts to screen size
- Touch-friendly buttons and inputs

## Environment Configuration

The backend URL is hardcoded in `src/utils/api.js`:

```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

To change it, edit the `API_BASE_URL` constant in `src/utils/api.js`

## Component Overview

### Navbar
- Navigation links to all pages
- Shows Login/Register or Logout based on authentication status
- Brand logo with link to home

### ProductCard
- Displays product image placeholder, name, description, price, and stock
- Add to Cart button (disabled if out of stock)
- Reusable component for product listing

### LoadingSpinner
- Centered animated spinner
- Used during API calls and page loading

### ProtectedRoute
- Wraps routes that require authentication
- Redirects to login if not authenticated

## Code Best Practices

✅ Functional components with hooks
✅ Clean separation of concerns
✅ Reusable components
✅ Error handling throughout
✅ Loading states
✅ Clean code structure
✅ Comments where needed
✅ Responsive design

## Styling

Tailwind CSS is loaded via CDN in `public/index.html`:
```html
<script src="https://cdn.tailwindcss.com"></script>
```

All styles use Tailwind utility classes for:
- Responsive design
- Colors and spacing
- Hover effects
- Animations

## Available npm Scripts

```bash
npm start       # Start development server (port 3000)
npm build       # Build for production
npm test        # Run tests
npm eject       # Eject from Create React App
```

## Testing the Application

1. **Test Registration**:
   - Go to /register
   - Fill in all fields
   - Submit
   - Should be logged in automatically

2. **Test Login**:
   - Register a user
   - Logout
   - Go to /login
   - Enter credentials
   - Should be logged in

3. **Test Products & Cart**:
   - Browse products on home page
   - Add multiple products
   - Go to cart
   - Modify quantities
   - Calculate total

4. **Test Checkout**:
   - Add items to cart
   - Go to checkout (redirects to login if not authenticated)
   - Fill shipping info
   - Enter card number
   - Place order

5. **Test Cart Persistence**:
   - Add items to cart
   - Close browser/tab
   - Reopen application
   - Cart items should still be there

## Troubleshooting

### "Cannot POST /api/auth/register"
- Ensure backend is running on http://localhost:5000
- Check backend APIs are implemented correctly

### "Network Error"
- Check if backend server is running
- Verify API_BASE_URL in `src/utils/api.js`
- Check CORS settings in backend

### "Token not persisting"
- Check if localStorage is enabled in browser
- Verify token response from login API

### Cart not persisting
- Check if localStorage is enabled
- Clear browser cache and try again

## Production Build

To create a production build:

```bash
npm run build
```

This creates an optimized build in the `build/` folder that can be deployed to any static hosting service.

## Support

For issues or questions, check:
1. Backend API responses
2. Browser console for errors
3. Network tab in DevTools for API calls
4. localStorage contents in DevTools

---

**Happy Shopping! 🛒**
