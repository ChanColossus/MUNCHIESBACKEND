const express = require("express");
const router = express.Router();
const {
  checkout,
  confirmOrder,
  getOrdersByUser,getOrders,updateOrderStatus,deleteOrder
} = require("../controllers/orderController");

router.post("/checkout", checkout);
router.get("/confirm-order/:orderId", confirmOrder);
router.get("/orders/:userId", getOrdersByUser);
router.get("/orders", getOrders);
router.put("/order/:orderId",updateOrderStatus);
router.delete("/orderdel/:orderId",deleteOrder);

module.exports = router;
