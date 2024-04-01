const express = require("express");
const router = express.Router();
const upload = require("../utils/multer");
const {
  CreateInventory,
  getInventory,
  updateInventory,
  deleteInventory,
  getSingleInventory,
} = require("../controllers/inventoryController");

router.post("/inventory/new", upload.array("images", 10), CreateInventory);
router.get("/inventory", getInventory);
router
  .route("/inventory/:id")
  .put(upload.array("images", 10), updateInventory)
  .delete(deleteInventory);
router.get("/inventory/:id", getSingleInventory);
module.exports = router;
