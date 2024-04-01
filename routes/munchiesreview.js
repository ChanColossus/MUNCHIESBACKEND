const express = require("express");
const router = express.Router();
const { create,get,Review,ReviewByMunchies,deleteReview,updateReview} = require("../controllers/munchiesreviewController");
const {isAuthenticated} = require('../middlewares/Auth.js')
router.post("/munchiesreview/new", create);
router.get("/munchiesreview", get);
router.get("/munchiesreview/:userId", Review);
router.get("/munchies/:munchiesId", ReviewByMunchies);
router.delete("/munchiesdel/:munchiesId", deleteReview);
router.put("/munchiesEd/:munchiesId", updateReview);
module.exports = router;
