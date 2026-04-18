const router = require("express").Router();
const Order = require("../models/Order");
const auth = require("../middleware/auth");

router.post("/", auth, async (req, res) => {
  const order = await Order.create({
    ...req.body,
    userId: req.user.id
  });
  res.json(order);
});

module.exports = router;