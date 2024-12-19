const express = require("express");
const router = express.Router();
const {
  createOrder,
  getAllOrders,
  getOrdersByUserId,
  getOrderById,
  updateOrderById,
  deleteOrderById,
} = require("../../controllers/orderController");

// Create a new order
router.post("/", createOrder);

// Read all orders
router.get("/", getAllOrders);

// Read all orders of a specific user
router.get("/user/:userId", getOrdersByUserId);

// Read an order by ID
router.get("/:id", getOrderById);

// Update an order by ID
router.put("/:id", updateOrderById);

// Delete an order by ID
router.delete("/:id", deleteOrderById);

module.exports = router;
