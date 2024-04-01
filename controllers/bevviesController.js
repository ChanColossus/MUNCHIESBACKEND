const Bevvies = require("../models/bevvies");
const cloudinary = require("cloudinary");

exports.CreateBevvies = async (req, res, next) => {
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
        folder: "bevvies",
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

  const bevvies = await Bevvies.create(req.body);
  if (!bevvies)
    return res.status(400).json({
      success: false,
      message: "Bevvies not created",
    });

  res.status(201).json({
    success: true,
    bevvies,
  });
};

exports.getBevvies = async (req, res, next) => {
  const bevvies = await Bevvies.find({});
  res.status(200).json({
    success: true,
    count: bevvies.length,
    bevvies,
  });
};

exports.updateBevvies = async (req, res, next) => {
  console.log(req.body);
  console.log("tyuyt", req.files);
  try {
    let bevvies = await Bevvies.findById(req.params.id);

    if (!bevvies) {
      return res.status(404).json({
        success: false,
        message: "Bevvies not found",
      });
    }

    // Check if images are present in the request files
    if (req.files && Object.keys(req.files).length > 0) {
      // Delete old images from cloudinary
      for (let i = 0; i < bevvies.images.length; i++) {
        const result = await cloudinary.v2.uploader.destroy(
          bevvies.images[i].public_id
        );
      }

      let imagesLinks = [];

      // Upload new images to cloudinary
      for (let i = 0; i < req.files.length; i++) {
        let imageDataUri = req.files[i].path;

        try {
          const result = await cloudinary.v2.uploader.upload(imageDataUri, {
            folder: "bevvies",
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
      req.body.images = bevvies.images;
    }

    console.log(req.params.id);
    bevvies = await Bevvies.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      useFindandModify: false,
    });

    return res.status(200).json({
      success: true,
      bevvies,
    });
  } catch (error) {
    console.error("Error updating munchies:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.deleteBevvies = async (req, res, next) => {
  console.log(req.params);
  const bevvies = await Bevvies.findByIdAndDelete(req.params.id);
  if (!bevvies) {
    return res.status(404).json({
      success: false,
      message: "Bevvies not found",
    });
  }
  res.status(200).json({
    success: true,
    message: "Bevvies deleted",
  });
};

exports.getSingleBevvies = async (req, res, next) => {
  const bevvies = await Bevvies.findById(req.params.id);

  if (!bevvies) {
    return res.status(404).json({
      success: false,
      message: "Bevvies not found",
    });
  }
  res.status(200).json({
    success: true,
    bevvies,
  });
};
