const Munchies = require("../models/munchies");
const cloudinary = require("cloudinary");

exports.CreateMunchies = async (req, res, next) => {
  console.log(req.files);
  let images = [];

  if (req.files && req.files.length > 0) {
    images = req.files.map((file) => file.path);
  }

  let imagesLinks = [];

  for (let i = 0; i < images.length; i++) {
    let imageDataUri = images[i];

    try {
      const result = await cloudinary.v2.uploader.upload(imageDataUri, {
        folder: "munchies",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    } catch (error) {
      console.log("Error uploading image:", error);
    }
  }
  req.body.images = imagesLinks;

  const munchies = await Munchies.create(req.body);
  if (!munchies)
    return res.status(400).json({
      success: false,
      message: "Munchies not created",
    });

  res.status(201).json({
    success: true,
    munchies,
  });
};

exports.getMunchies = async (req, res, next) => {
  const munchies = await Munchies.find({});
  res.status(200).json({
    success: true,
    count: munchies.length,
    munchies,
  });
};

exports.updateMunchies = async (req, res, next) => {
  console.log(req.body);
  console.log("tyuyt", req.files);
  try {
    let munchies = await Munchies.findById(req.params.id);

    if (!munchies) {
      return res.status(404).json({
        success: false,
        message: "Munchies not found",
      });
    }

    // Check if images are present in the request files
    if (req.files && Object.keys(req.files).length > 0) {
      // Delete old images from cloudinary
      for (let i = 0; i < munchies.images.length; i++) {
        const result = await cloudinary.v2.uploader.destroy(
          munchies.images[i].public_id
        );
      }

      let imagesLinks = [];

      // Upload new images to cloudinary
      for (let i = 0; i < req.files.length; i++) {
        let imageDataUri = req.files[i].path;

        try {
          const result = await cloudinary.v2.uploader.upload(imageDataUri, {
            folder: "munchies",
          });

          imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url,
          });
        } catch (error) {
          console.log("Error uploading image:", error);
        }
      }

      req.body.images = imagesLinks;
    } else {
      // If images are not present or empty, retain the existing images
      req.body.images = munchies.images;
    }

    console.log(req.params.id);
    munchies = await Munchies.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      useFindandModify: false,
    });

    return res.status(200).json({
      success: true,
      munchies,
    });
  } catch (error) {
    console.error("Error updating munchies:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.deleteMunchies = async (req, res, next) => {
  const munchies = await Munchies.findByIdAndDelete(req.params.id);
  if (!munchies) {
    return res.status(404).json({
      success: false,
      message: "Munchies not found",
    });
  }
  res.status(200).json({
    success: true,
    message: "Munchies deleted",
  });
};
