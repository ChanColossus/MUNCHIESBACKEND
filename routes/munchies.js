const express = require("express");
const router = express.Router();
const upload = require("../utils/multer");
const {
  CreateMunchies,
  getMunchies,
  updateMunchies,
  deleteMunchies,
} = require("../controllers/munchiesController");

router.post("/munchies/new", upload.array("images", 10), CreateMunchies);
router.get("/munchies", getMunchies);
router
  .route("/munchies/:id")
  .put(upload.array("images", 10), updateMunchies)
  .delete(deleteMunchies);
module.exports = router;
