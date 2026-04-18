# Installation Checklist

## Pre-Installation

- [ ] Backend is ready and running on http://localhost:5000
- [ ] Node.js v14+ is installed
- [ ] npm is available in terminal
- [ ] VS Code or code editor is open
- [ ] Internet connection for downloading packages

---

## Step 1: Navigate to Frontend Folder

```bash
cd "d:\E com web app\frontend"
```

- [ ] Terminal shows `...> cd d:\E com web app\frontend`
- [ ] You're now in the frontend directory

---

## Step 2: Verify Files Exist

Check these files are created:

```bash
ls -la
```

Or in Explorer check `d:\E com web app\frontend\` contains:

- [ ] `package.json` ✓
- [ ] `public/index.html` ✓
- [ ] `src/App.js` ✓
- [ ] `src/index.js` ✓
- [ ] `src/components/` folder ✓
- [ ] `src/pages/` folder ✓
- [ ] `src/utils/` folder ✓
- [ ] `.gitignore` ✓
- [ ] `README.md` ✓

---

## Step 3: Install Dependencies

Run this command:

```bash
npm install
```

Watch for:
- [ ] Shows "npm WARN" messages (normal)
- [ ] "packages in X.XXs" message at end
- [ ] `node_modules/` folder appears
- [ ] `package-lock.json` is created
- [ ] No error messages (warnings OK)

**Time**: 2-3 minutes

---

## Step 4: Verify Installation

Check node_modules was created:

```bash
ls node_modules | wc -l
```

Or in Explorer:

- [ ] `node_modules/` folder exists
- [ ] Contains many package folders

---

## Step 5: Start Frontend Server

Run:

```bash
npm start
```

Expected output:
```
> ecommerce-frontend@1.0.0 start
> react-scripts start

Compiled successfully!

You can now view ecommerce-frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

Checklist:
- [ ] "Compiled successfully!" message
- [ ] No error messages
- [ ] Browser might auto-open
- [ ] http://localhost:3000 is provided

---

## Step 6: Verify Frontend Loads

Check http://localhost:3000:

- [ ] Page loads without blank screen
- [ ] Navbar visible at top
- [ ] Navigation links appear (Home, Cart, Login, Register)
- [ ] Products grid loads
- [ ] No red error messages

---

## Step 7: Check Backend Connection

On home page:

- [ ] Products are displaying (not "No products" message)
- [ ] Each product shows name, description, price, stock
- [ ] "Add to Cart" button is clickable

If products don't show:
- [ ] Verify backend running on http://localhost:5000
- [ ] Check browser console (F12) for errors
- [ ] Check Network tab for API calls

---

## Step 8: First Test - Register User

In browser:

1. Click "Register" button in navbar
   - [ ] Register form opens
   
2. Fill form:
   - [ ] Full Name: Test User
   - [ ] Email: test@example.com
   - [ ] Password: password123
   - [ ] Confirm: password123
   
3. Click Register
   - [ ] Form submits
   - [ ] No error message
   - [ ] Redirects to home
   - [ ] Navbar shows "Logout" button (not "Register")

---

## Step 9: Second Test - Add to Cart

On home page:

1. Click "Add to Cart" on a product
   - [ ] Alert pops up: "Product added to cart!"
   
2. Click "Cart" in navbar
   - [ ] Cart page shows
   - [ ] Product appears in cart
   - [ ] Quantity is 1
   - [ ] Price shows correctly

---

## Step 10: Third Test - Checkout

On cart page:

1. Click "Proceed to Checkout"
   - [ ] Checkout form appears (you're logged in)
   
2. Fill shipping form:
   - [ ] Full Name: Test User
   - [ ] Email: test@example.com
   - [ ] Address: 123 Test St
   - [ ] City: Test City
   - [ ] Zip Code: 12345
   - [ ] Card: 1234567890123456
   
3. Click "Place Order"
   - [ ] Green success message
   - [ ] Says "Order placed successfully!"
   - [ ] Redirects to home after 2 seconds

---

## Step 11: Verify in Browser DevTools

Press F12 and check:

### Storage Tab
- [ ] `token` exists in localStorage
- [ ] `token` has a long string value (JWT)
- [ ] `cart` might be empty (cleared after checkout)

### Network Tab
During API calls, should see:
- [ ] POST /api/auth/register (201)
- [ ] POST /api/auth/login (200)
- [ ] GET /api/products (200)
- [ ] POST /api/orders (201)

### Console Tab
- [ ] No red error messages
- [ ] Only yellow warnings (normal)

---

## Troubleshooting During Installation

### Problem: "npm: command not found"
**Solution**: Node.js/npm not installed
```bash
# Install Node.js from nodejs.org
# Then restart terminal and try again
npm --version
```

### Problem: npm install takes too long
**Solution**: Normal, first install takes 2-3 minutes
- Don't close terminal
- Don't stop process
- Wait for "packages in X.XXs" message

### Problem: npm ERR! code ERESOLVE
**Solution**: Try --legacy-peer-deps flag
```bash
npm install --legacy-peer-deps
```

### Problem: "Compiled successfully!" doesn't appear
**Solution**: Check for syntax errors
```bash
# Stop server (Ctrl+C) and try again
npm start
```

### Problem: http://localhost:3000 shows blank page
**Solution**: Check browser console (F12)
- [ ] Look for error messages
- [ ] Check Network tab for failed requests
- [ ] Refresh page (F5)

### Problem: "Cannot GET /api/products"
**Solution**: Backend not running
```bash
# Terminal 1: Backend
cd backend
npm start

# Terminal 2: Frontend (keep running)
cd frontend
npm start
```

### Problem: "Products" showing as empty
**Solution**: Backend database empty
- Add products to backend database first
- Or check backend API implementation

---

## Installation Complete! ✅

When all these checked:

- [x] npm install succeeded
- [x] npm start compiles successfully
- [x] Frontend loads at http://localhost:3000
- [x] Products display
- [x] Can register user
- [x] Can add to cart
- [x] Can checkout
- [x] No errors in console

---

## What's Running?

```
Terminal 1: Backend  →  http://localhost:5000
Terminal 2: Frontend →  http://localhost:3000
```

Both must run together for full functionality!

---

## Next Steps

1. ✅ Frontend fully operational
2. ✅ Ready for production build: `npm run build`
3. ✅ Can deploy to hosting service
4. ✅ Can add more features/customization

---

## Need Help?

1. Check SETUP_TESTING.md for detailed testing
2. Check README.md for full documentation
3. Run tests in the console
4. Check backend logs if API not working

---

**Installation Complete! Your full-stack E-Commerce app is ready! 🚀**
