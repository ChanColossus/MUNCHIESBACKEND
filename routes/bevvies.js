const express = require("express");
const router = express.Router();
const upload = require("../utils/multer");
const {
  CreateBevvies,
  getBevvies,
  updateBevvies,
  deleteBevvies,
  getSingleBevvies,
} = require("../controllers/bevviesController");

router.post("/bevvies/new", upload.array("images", 10), CreateBevvies);
router.get("/bevvies", getBevvies);
router
  .route("/bevvies/:id")
  .put(upload.array("images", 10), updateBevvies)
  .delete(deleteBevvies);
router.get("/bevvies/:id", getSingleBevvies);
module.exports = router;
