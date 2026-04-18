# Setup & Testing Guide

## Complete Setup Instructions

### Step 1️⃣: Navigate to Frontend Directory

Open PowerShell/Terminal and run:

```bash
cd "d:\E com web app\frontend"
```

### Step 2️⃣: Install All Dependencies

```bash
npm install
```

This will:
- Create `node_modules/` folder
- Install React, React Router, Axios, and all utilities
- Create `package-lock.json`

**Time**: ~2-3 minutes on first install

### Step 3️⃣: Start Development Server

```bash
npm start
```

Expected output:
```
Compiled successfully!

You can now view ecommerce-frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

### Step 4️⃣: Verify Backend is Running

Before testing, make sure your backend is running on http://localhost:5000

In another terminal:
```bash
cd "d:\E com web app\backend"
npm start
# or: node server.js
```

---

## Testing Checklist

### ✅ Test 1: Application Loads
- [ ] Frontend opens at http://localhost:3000
- [ ] Navbar is visible at top
- [ ] No errors in console (F12)

### ✅ Test 2: Browse Products
- [ ] Home page displays products list
- [ ] Product cards show name, description, price, stock
- [ ] "Add to Cart" button works

### ✅ Test 3: Registration
Steps:
1. Click "Register" in navbar
2. Enter:
   - Full Name: `John Doe`
   - Email: `john@example.com`
   - Password: `password123`
   - Confirm Password: `password123`
3. Click "Register"

Expected:
- [ ] Redirects to home page
- [ ] "Register" button changes to "Logout" in navbar
- [ ] Token stored in localStorage

**Verify localStorage**:
- Press F12 → Application → Storage → localStorage
- Should see `token` with JWT value

### ✅ Test 4: Add Products to Cart
Steps:
1. On home page, click "Add to Cart" on multiple products
2. Alert appears saying "Product added to cart!"
3. Click "Cart" in navbar

Expected:
- [ ] All added products appear in cart
- [ ] Quantities are correct
- [ ] Prices are calculated

**Verify localStorage**:
- Check `cart` value in localStorage contains items

### ✅ Test 5: Manage Cart
On cart page:
1. Click + button to increase quantity
2. Click - button to decrease quantity
3. Click "Remove" to remove item

Expected:
- [ ] Total updates correctly
- [ ] Tax (10%) calculated
- [ ] Items updated in localStorage

### ✅ Test 6: Checkout
Steps:
1. Click "Proceed to Checkout" button
2. Should redirect to checkout page (not login)
3. Fill in shipping information:
   - Full Name: `John Doe`
   - Email: `john@example.com`
   - Address: `123 Main St`
   - City: `New York`
   - Zip Code: `10001`
   - Card Number: `1234567890123456`
4. Click "Place Order"

Expected:
- [ ] Green success message appears
- [ ] Order sent to backend
- [ ] Redirects to home after 2 seconds
- [ ] Cart is cleared

### ✅ Test 7: Login/Logout
Steps:
1. Click "Logout" button (current session)
2. Page redirects, navbar shows "Login" button
3. Click "Login"
4. Enter credentials:
   - Email: `john@example.com`
   - Password: `password123`
5. Click "Login"

Expected:
- [ ] Redirects to home page
- [ ] "Login" button changes to "Logout"
- [ ] Token is stored

### ✅ Test 8: Protected Routes
Steps:
1. Logout (if logged in)
2. Try to access http://localhost:3000/checkout

Expected:
- [ ] Automatically redirects to login page
- [ ] You must login to access checkout

### ✅ Test 9: Cart Persistence
Steps:
1. Add items to cart
2. Refresh browser (F5)
3. Go to cart page

Expected:
- [ ] All items still there
- [ ] Quantities preserved
- [ ] Total calculated

### ✅ Test 10: Error Handling
Steps 1 - Test invalid credentials:
1. Click "Login"
2. Enter wrong email/password
3. Click Login

Expected:
- [ ] Error message shows from API
- [ ] Stays on login page

Steps 2 - Test network error:
1. Stop backend server
2. Try to add product or login

Expected:
- [ ] Network error message displays
- [ ] User-friendly error (not technical)

---

## Responsive Design Testing

### Desktop View
- [ ] All products in 4-column grid
- [ ] Navbar items spread out
- [ ] Checkout form 2-column layout

### Tablet View (iPad - 768px)
Press F12 → Toggle device toolbar → iPad

- [ ] Products in 2-column grid
- [ ] Navbar items stack if needed
- [ ] Checkout form responsive

### Mobile View (iPhone - 375px)
Press F12 → Toggle device toolbar → iPhone

- [ ] Products in 1-column grid
- [ ] Navbar collapses if needed
- [ ] Touch-friendly buttons
- [ ] Forms full width

---

## Data Flow Verification

### Authentication Flow
```
Register/Login → API Response → Store Token → localStorage
                                     ↓
                            Include in all requests
                                     ↓
                            Protected routes check token
                                     ↓
                   Redirect to login if no token
```

### Shopping Flow
```
Browse Products → Add to Cart → Store in localStorage
                                     ↓
                              View Cart
                                     ↓
                      Modify Quantity/Remove Items
                                     ↓
                              Checkout (Protected)
                                     ↓
                           Submit Order to API
                                     ↓
                          Success → Clear Cart
```

---

## Browser DevTools Inspection

### Check localStorage
```
F12 → Application → Storage → localStorage
```

Should contain:
- `token`: JWT token string
- `cart`: Array of cart items

### Check Network Requests
```
F12 → Network tab → Perform action
```

Should show:
- POST /api/auth/register (201)
- POST /api/auth/login (200)
- GET /api/products (200)
- POST /api/orders (201) - with Bearer token
- All requests have correct headers

### Check Console
```
F12 → Console tab
```

Should be clean with no errors:
- No "Cannot GET /api/*"
- No "Unauthorized" 401
- No "Network error" except intentional tests

---

## Common Issues & Solutions

### Issue: "Cannot GET /api/products"
**Solution**: Backend not running
```bash
# Terminal 1: Start backend
cd backend
npm start

# Terminal 2: Start frontend
cd frontend
npm start
```

### Issue: "Failed to fetch"
**Solution**: CORS issue or backend URLs don't match
- Verify backend is on port 5000
- Check `API_BASE_URL` in `src/utils/api.js`

### Issue: Token not persisting
**Solution**: localStorage disabled
- Check browser allows localStorage
- Clear cookies/cache and try again

### Issue: Cart empty after refresh
**Solution**: localStorage issue
- Check F12 → Application → Storage
- Enable localStorage in browser settings

### Issue: Checkout redirects to login
**Solution**: Not authenticated
- Must login/register first
- Token must be in localStorage

### Issue: Styles not loading (missing colors)
**Solution**: Tailwind CDN not loaded
- Check internet connection
- Check network tab for CDN request
- Refresh page

---

## Test Data

Use these credentials for testing:

**Test User 1**
```
Name: John Doe
Email: john@example.com
Password: password123
```

**Test User 2**
```
Name: Jane Smith
Email: jane@example.com
Password: password456
```

**Test Product IDs**
Use whatever products are in your backend database

**Test Card Number**
```
1234567890123456  (Valid format for testing)
```

---

## Performance Checklist

- [ ] Page load time < 3 seconds
- [ ] Product grid renders < 1 second
- [ ] Cart updates instantly
- [ ] API calls show in Network tab
- [ ] No memory leaks (DevTools)
- [ ] Smooth animations
- [ ] No lag on quantity updates

---

## Final Checklist Before Deployment

- [ ] All 10 tests pass
- [ ] No console errors
- [ ] localStorage working
- [ ] Responsive on all screen sizes
- [ ] Forms validate correctly
- [ ] Error messages display
- [ ] Loading spinners show
- [ ] Cart persists after refresh
- [ ] Protected routes redirect
- [ ] Backend token in all requests

---

## Deployment Ready?

✅ When all tests pass, your React frontend is:
- Production ready
- Fully functional
- Error handled
- Responsive
- Secure (token-based auth)

---

**Happy Testing! 🧪**

Need help? Check:
1. Browser Console (F12)
2. Network Tab (F12)
3. Application Storage (F12)
4. README.md for more details
