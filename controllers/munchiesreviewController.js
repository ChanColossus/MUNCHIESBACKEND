const MunchiesReview = require('../models/munchiesReview'); // Assuming your model file is in the same directory

// Create a new review
exports.create = async (req, res) => {
    try {
      const { user, comment, rating, Munchies } = req.body;
      
      // Check if required fields are provided
      if ( !comment || !rating) {
        return res.status(400).json({ success: false, error: "User, comment, and rating are required" });
      }
  
      // Create the review
      const review = await MunchiesReview.create({
        user,
        comment,
        rating,
        Munchies,
      });
  
      res.status(201).json({ success: true, data: review });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  };

// Get all reviews
exports.get = async (req, res) => {
  try {
    const reviews = await MunchiesReview.find().populate('Munchies');
    res.status(200).json({ success: true, data: reviews });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
exports.Review = async (req, res) => {
    const userId = req.params.userId;
  
    try {
      // Query the database to fetch reviews by user ID
      const reviews = await MunchiesReview.find({ user: userId }).populate('Munchies');// Assuming 'user' field in Review model references the user ID
  
      res.json({ success: true, reviews });
    } catch (error) {
      console.error('Error fetching reviews by user ID:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };
  exports.ReviewByMunchies = async (req, res) => {
    const munchiesId = req.params.munchiesId;
  
    try {
      // Query the database to fetch reviews by user ID
      const reviews = await MunchiesReview.find({ Munchies: munchiesId })
      .populate('Munchies') // Populate the Munchies field
      .populate('user');// Assuming 'user' field in Review model references the user ID
  
      res.json({ success: true, reviews });
    } catch (error) {
      console.error('Error fetching reviews by user ID:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };
// Get a single review by ID
// exports.getReviewById = async (req, res) => {
//   try {
//     const review = await Review.findById(req.params.id);
//     if (!review) {
//       return res.status(404).json({ success: false, error: 'Review not found' });
//     }
//     res.status(200).json({ success: true, data: review });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// };

// Update a review by ID
exports.updateReview = async (req, res) => {
  try {
    const review = await MunchiesReview.findByIdAndUpdate(req.params.munchiesId, req.body, {
      new: true,
      runValidators: true,
    });
    if (!review) {
      return res.status(404).json({ success: false, error: 'Review not found' });
    }
    res.status(200).json({ success: true, data: review });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Delete a review by ID
exports.deleteReview = async (req, res) => {
  try {
    const review = await MunchiesReview.findByIdAndDelete(req.params.munchiesId);
    if (!review) {
      return res.status(404).json({ success: false, error: 'Review not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
