const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage
} = require("../controllers/productController");
const { protect, adminOnly } = require("../middleware/auth");
const multer = require("multer");

// Multer setup for image upload
const upload = multer({ storage: multer.memoryStorage() });

router.get("/", getAllProducts);
router.get("/:id", getProduct);
router.post("/", protect, adminOnly, createProduct);
router.put("/:id", protect, adminOnly, updateProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);
router.post("/upload-image", protect, adminOnly, upload.single("image"), uploadProductImage);

module.exports = router;
