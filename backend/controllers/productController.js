const Product = require("../models/Product");
const cloudinary = require("cloudinary").v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "ecommerce-products" },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      }
    );
    stream.end(buffer);
  });
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const { category, search, sort } = req.query;
    
    // Demo Mode
    if (global.demoMode) {
      let result = [...global.mockData.products];
      
      if (category && category !== 'All') {
        result = result.filter(p => p.category === category);
      }
      
      if (search) {
        const searchLower = search.toLowerCase();
        result = result.filter(p => 
          p.name.toLowerCase().includes(searchLower) || 
          p.description.toLowerCase().includes(searchLower)
        );
      }
      
      return res.status(200).json({
        success: true,
        count: result.length,
        data: result
      });
    }

    let query = {};

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    let products = Product.find(query);

    if (sort) {
      products = products.sort(sort);
    } else {
      products = products.sort("-createdAt");
    }

    const result = await products;

    res.status(200).json({
      success: true,
      count: result.length,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get single product
exports.getProduct = async (req, res) => {
  try {
    if (global.demoMode) {
      const product = global.mockData.products.find((p) => p._id === req.params.id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found"
        });
      }

      return res.status(200).json({
        success: true,
        data: product
      });
    }

    const product = await Product.findById(req.params.id).populate("seller", "name email");
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Create product (Admin only)
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;

    if (!name || !description || !price || !category) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields"
      });
    }

    if (global.demoMode) {
      const product = {
        _id: Date.now().toString(),
        name,
        description,
        price: Number(price),
        category,
        stock: Number(stock || 0),
        imageUrl: req.body.imageUrl || "https://via.placeholder.com/300",
        rating: 4.5,
        reviews: [],
        seller: req.user.id,
        createdAt: new Date()
      };

      global.mockData.products.push(product);

      return res.status(201).json({
        success: true,
        message: "Product created successfully",
        data: product
      });
    }

    const product = await Product.create({
      name,
      description,
      price,
      category,
      stock: stock || 0,
      seller: req.user.id
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update product (Admin only)
exports.updateProduct = async (req, res) => {
  try {
    if (global.demoMode) {
      const index = global.mockData.products.findIndex((p) => p._id === req.params.id);

      if (index === -1) {
        return res.status(404).json({
          success: false,
          message: "Product not found"
        });
      }

      const existing = global.mockData.products[index];
      const updated = {
        ...existing,
        ...req.body,
        price: req.body.price !== undefined ? Number(req.body.price) : existing.price,
        stock: req.body.stock !== undefined ? Number(req.body.stock) : existing.stock
      };

      global.mockData.products[index] = updated;

      return res.status(200).json({
        success: true,
        message: "Product updated successfully",
        data: updated
      });
    }

    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    // Check authorization
    if (product.seller.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this product"
      });
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete product (Admin only)
exports.deleteProduct = async (req, res) => {
  try {
    if (global.demoMode) {
      const index = global.mockData.products.findIndex((p) => p._id === req.params.id);

      if (index === -1) {
        return res.status(404).json({
          success: false,
          message: "Product not found"
        });
      }

      global.mockData.products.splice(index, 1);

      return res.status(200).json({
        success: true,
        message: "Product deleted successfully"
      });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    // Check authorization
    if (product.seller.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this product"
      });
    }

    // Delete image from Cloudinary if exists
    if (product.imageUrl) {
      const publicId = product.imageUrl.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(publicId).catch(err => console.log(err));
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Upload product image
exports.uploadProductImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload an image"
      });
    }

    if (global.demoMode) {
      return res.status(200).json({
        success: true,
        imageUrl: "https://via.placeholder.com/600x600?text=Product+Image"
      });
    }

    if (!process.env.CLOUDINARY_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return res.status(400).json({
        success: false,
        message: "Cloudinary credentials are not configured"
      });
    }

    // Upload to Cloudinary
    const result = await uploadToCloudinary(req.file.buffer);

    res.status(200).json({
      success: true,
      imageUrl: result.secure_url
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
