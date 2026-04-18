const express = require("express");
const router = express.Router();
const {
  createOrder,
  verifyPayment,
  getAllOrders,
  getUserOrders,
  getOrder,
  updateOrderStatus,
  cancelOrder
} = require("../controllers/orderController");
const { protect, adminOnly } = require("../middleware/auth");

// Public routes
router.post("/", protect, createOrder);
router.post("/verify-payment", protect, verifyPayment);

// User routes
router.get("/my-orders", protect, getUserOrders);
router.get("/:id", protect, getOrder);
router.put("/:id/cancel", protect, cancelOrder);

// Admin routes
router.get("/", protect, adminOnly, getAllOrders);
router.put("/:id/status", protect, adminOnly, updateOrderStatus);

module.exports = router;
