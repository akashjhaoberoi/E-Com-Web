const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler");

dotenv.config();
const app = express();
global.demoMode = true;

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  credentials: true
}));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/products", require("./routes/product"));
app.use("/api/orders", require("./routes/order"));

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "Server is running" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Error Handler (must be last)
app.use(errorHandler);

// MongoDB Connection (with fallback to demo mode)
if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
    .then(() => {
      console.log("✅ MongoDB Connected");
      global.demoMode = false;
    })
    .catch(err => {
      console.error("❌ MongoDB Connection Error:", err.message);
      console.log("🟡 Starting in DEMO MODE with mock data...\n");
      global.demoMode = true;
    });
} else {
  console.log("🟡 No MONGO_URI found. Starting in DEMO MODE with mock data...\n");
}

// Store mock data in memory
global.mockData = {
  users: [
    { _id: "1", name: "Demo User", email: "demo@example.com", password: "demo123", isAdmin: false },
    { _id: "2", name: "Admin User", email: "admin@example.com", password: "admin123", isAdmin: true }
  ],
  products: [
    { _id: "1", name: "Laptop", description: "High-performance laptop", price: 999, category: "Electronics", stock: 5, imageUrl: "https://via.placeholder.com/300", rating: 4.5, reviews: [] },
    { _id: "2", name: "Smartphone", description: "Latest smartphone", price: 799, category: "Electronics", stock: 10, imageUrl: "https://via.placeholder.com/300", rating: 4.7, reviews: [] },
    { _id: "3", name: "Blue T-Shirt", description: "Comfortable cotton t-shirt", price: 29, category: "Clothing", stock: 50, imageUrl: "https://via.placeholder.com/300", rating: 4.2, reviews: [] },
    { _id: "4", name: "JavaScript Book", description: "Learn JavaScript deeply", price: 45, category: "Books", stock: 20, imageUrl: "https://via.placeholder.com/300", rating: 4.8, reviews: [] },
  ],
  orders: []
};

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  if (global.demoMode) {
    console.log("📝 DEMO MODE: Using mock data | Register: demo@example.com / demo123");
  }
});