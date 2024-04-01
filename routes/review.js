const express = require("express");
const router = express.Router();
const { createReview,getAllReviews, ReviewByUser,ReviewByBevvies,deleteBevviesReview,updateBevviesReview} = require("../controllers/reviewController");
const {isAuthenticated} = require('../middlewares/Auth.js')
router.post("/review/new", createReview);
router.get("/review", getAllReviews);
router.get("/review/:userId", ReviewByUser);
router.get("/bevviesreview/:bevviesId", ReviewByBevvies);
router.delete("/bevviesdel/:bevviesId", deleteBevviesReview);
router.put("/bevviesEd/:bevviesId", updateBevviesReview);
module.exports = router;
