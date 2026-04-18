const Order = require("../models/Order");
const Product = require("../models/Product");
const Razorpay = require("razorpay");
const crypto = require("crypto");

// Initialize Razorpay
const razorpay = process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
  ? new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    })
  : null;

// Create order (Initialize payment)
exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;
    const chosenPaymentMethod = paymentMethod || "cod";

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty"
      });
    }

    if (!shippingAddress) {
      return res.status(400).json({
        success: false,
        message: "Please provide shipping address"
      });
    }

    // Demo Mode
    if (global.demoMode) {
      let totalAmount = 0;
      for (let item of items) {
        const product = global.mockData.products.find(p => p._id === item.productId || p._id === item.product);
        if (!product) {
          return res.status(404).json({
            success: false,
            message: `Product not found`
          });
        }
        totalAmount += product.price * item.quantity;
      }

      const normalizedItems = items.map((item) => ({
        product: item.product || item.productId,
        quantity: Number(item.quantity),
        price: Number(item.price || 0)
      }));

      const order = {
        _id: Date.now().toString(),
        user: req.user.id,
        items: normalizedItems,
        shippingAddress,
        paymentMethod: chosenPaymentMethod,
        totalAmount,
        paymentStatus: chosenPaymentMethod === "cod" ? "pending" : "pending",
        orderStatus: chosenPaymentMethod === "cod" ? "processing" : "pending",
        razorpayOrderId: chosenPaymentMethod === "razorpay" ? "demo_" + Date.now() : null,
        createdAt: new Date()
      };

      global.mockData.orders.push(order);

      return res.status(201).json({
        success: true,
        message: "Order created successfully",
        order: {
          id: order._id,
          amount: totalAmount,
          currency: "INR",
          paymentMethod: chosenPaymentMethod,
          requiresPayment: chosenPaymentMethod === "razorpay",
          razorpayOrderId: order.razorpayOrderId
        }
      });
    }

    // Calculate total and validate stock
    let totalAmount = 0;
    for (let item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ${item.product} not found`
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}`
        });
      }

      totalAmount += product.price * item.quantity;
    }

    // Create order
    const order = await Order.create({
      user: req.user.id,
      items,
      shippingAddress,
      paymentMethod: chosenPaymentMethod,
      totalAmount,
      paymentStatus: "pending",
      orderStatus: chosenPaymentMethod === "cod" ? "processing" : "pending"
    });

    // Initialize Razorpay payment
    if (chosenPaymentMethod === "razorpay") {
      if (!razorpay) {
        return res.status(400).json({
          success: false,
          message: "Razorpay is not configured"
        });
      }

      try {
        const razorpayOrder = await razorpay.orders.create({
          amount: totalAmount * 100, // Amount in paisa
          currency: "INR",
          receipt: `receipt_${order._id}`,
          notes: {
            orderId: order._id.toString()
          }
        });

        order.razorpayOrderId = razorpayOrder.id;
        await order.save();

        return res.status(201).json({
          success: true,
          message: "Order created successfully",
          order: {
            id: order._id,
            razorpayOrderId: razorpayOrder.id,
            amount: totalAmount,
            currency: "INR",
            paymentMethod: chosenPaymentMethod,
            requiresPayment: true
          }
        });
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: "Payment initialization failed: " + error.message
        });
      }
    }

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order: {
        id: order._id,
        amount: totalAmount,
        currency: "INR",
        paymentMethod: chosenPaymentMethod,
        requiresPayment: false
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Verify Razorpay payment
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    if (global.demoMode) {
      const order = global.mockData.orders.find((o) => o.razorpayOrderId === razorpayOrderId);
      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found"
        });
      }

      order.razorpayPaymentId = razorpayPaymentId;
      order.razorpaySignature = razorpaySignature;
      order.paymentStatus = "paid";
      order.orderStatus = "processing";

      order.items.forEach((item) => {
        const product = global.mockData.products.find((p) => p._id === item.product || p._id === item.productId);
        if (product) {
          product.stock = Math.max(0, Number(product.stock || 0) - Number(item.quantity || 0));
        }
      });

      return res.status(200).json({
        success: true,
        message: "Payment verified successfully",
        order
      });
    }

    if (!process.env.RAZORPAY_KEY_SECRET) {
      return res.status(400).json({
        success: false,
        message: "Razorpay is not configured"
      });
    }

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({
        success: false,
        message: "Missing payment details"
      });
    }

    // Verify signature
    const body = razorpayOrderId + "|" + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpaySignature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed"
      });
    }

    // Update order
    const order = await Order.findOne({ razorpayOrderId });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    order.razorpayPaymentId = razorpayPaymentId;
    order.razorpaySignature = razorpaySignature;
    order.paymentStatus = "paid";
    order.orderStatus = "processing";
    await order.save();

    // Update product stock
    for (let item of order.items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: -item.quantity } },
        { new: true }
      );
    }

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all orders (Admin)
exports.getAllOrders = async (req, res) => {
  try {
    if (global.demoMode) {
      const orders = global.mockData.orders.map((order) => {
        const user = global.mockData.users.find((u) => u._id === order.user);
        return {
          ...order,
          user: user ? { _id: user._id, name: user.name, email: user.email } : null
        };
      });

      return res.status(200).json({
        success: true,
        count: orders.length,
        data: orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      });
    }

    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product", "name price")
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get user orders
exports.getUserOrders = async (req, res) => {
  try {
    if (global.demoMode) {
      const orders = global.mockData.orders
        .filter((order) => order.user === req.user.id)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      return res.status(200).json({
        success: true,
        count: orders.length,
        data: orders
      });
    }

    const orders = await Order.find({ user: req.user.id })
      .populate("items.product", "name price imageUrl")
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get single order
exports.getOrder = async (req, res) => {
  try {
    if (global.demoMode) {
      const order = global.mockData.orders.find((o) => o._id === req.params.id);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found"
        });
      }

      if (order.user !== req.user.id && !req.user.isAdmin) {
        return res.status(403).json({
          success: false,
          message: "Not authorized to view this order"
        });
      }

      return res.status(200).json({
        success: true,
        data: order
      });
    }

    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("items.product");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    // Check authorization
    if (order.user._id.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this order"
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update order status (Admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;

    if (global.demoMode) {
      const index = global.mockData.orders.findIndex((o) => o._id === req.params.id);

      if (index === -1) {
        return res.status(404).json({
          success: false,
          message: "Order not found"
        });
      }

      global.mockData.orders[index] = {
        ...global.mockData.orders[index],
        orderStatus,
        updatedAt: new Date()
      };

      return res.status(200).json({
        success: true,
        message: "Order status updated",
        data: global.mockData.orders[index]
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus, updatedAt: Date.now() },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Order status updated",
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Cancel order
exports.cancelOrder = async (req, res) => {
  try {
    if (global.demoMode) {
      const index = global.mockData.orders.findIndex((o) => o._id === req.params.id);

      if (index === -1) {
        return res.status(404).json({
          success: false,
          message: "Order not found"
        });
      }

      const order = global.mockData.orders[index];

      if (order.user !== req.user.id && !req.user.isAdmin) {
        return res.status(403).json({
          success: false,
          message: "Not authorized to cancel this order"
        });
      }

      if (order.orderStatus !== "pending" && order.orderStatus !== "processing") {
        return res.status(400).json({
          success: false,
          message: "Only pending or processing orders can be cancelled"
        });
      }

      order.orderStatus = "cancelled";
      order.updatedAt = new Date();

      return res.status(200).json({
        success: true,
        message: "Order cancelled successfully",
        data: order
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    // Check authorization
    if (order.user.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to cancel this order"
      });
    }

    // Can only cancel pending orders
    if (order.orderStatus !== "pending" && order.orderStatus !== "processing") {
      return res.status(400).json({
        success: false,
        message: "Only pending or processing orders can be cancelled"
      });
    }

    order.orderStatus = "cancelled";
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
