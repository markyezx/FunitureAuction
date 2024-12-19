const express = require("express");
const router = express.Router();
const {
  createProduct,
  getProductById,
  updateProductById,
  deleteProductById,
} = require("../../controllers/productController");

// Create a new product
router.post("/", createProduct);

// Read a product by ID
router.get("/:id", getProductById);

// Update a product by ID
router.put("/:id", updateProductById);

// Delete a product by ID
router.delete("/:id", deleteProductById);

module.exports = router;
