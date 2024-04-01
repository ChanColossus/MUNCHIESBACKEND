const Inventory = require("../models/inventory");
const cloudinary = require("cloudinary");

exports.CreateInventory = async (req, res, next) => {
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
        folder: "inventory",
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

  const inventory = await Inventory.create(req.body);
  if (!inventory)
    return res.status(400).json({
      success: false,
      message: "Inventory not created",
    });

  res.status(201).json({
    success: true,
    inventory,
  });
};

exports.getInventory = async (req, res, next) => {
  const inventory = await Inventory.find({});
  res.status(200).json({
    success: true,
    count: inventory.length,
    inventory,
  });
};

exports.updateInventory = async (req, res, next) => {
  console.log(req.body);
  console.log("tyuyt", req.files);
  try {
    let inventory = await Inventory.findById(req.params.id);

    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: "Inventory not found",
      });
    }

    // Check if images are present in the request files
    if (req.files && Object.keys(req.files).length > 0) {
      // Delete old images from cloudinary
      for (let i = 0; i < inventory.images.length; i++) {
        const result = await cloudinary.v2.uploader.destroy(
          inventory.images[i].public_id
        );
      }

      let imagesLinks = [];

      // Upload new images to cloudinary
      for (let i = 0; i < req.files.length; i++) {
        let imageDataUri = req.files[i].path;

        try {
          const result = await cloudinary.v2.uploader.upload(imageDataUri, {
            folder: "inventory",
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
      req.body.images = inventory.images;
    }

    console.log(req.params.id);
    inventory = await Inventory.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      useFindandModify: false,
    });

    return res.status(200).json({
      success: true,
      inventory,
    });
  } catch (error) {
    console.error("Error updating inventory:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.deleteInventory = async (req, res, next) => {
  console.log(req.params);
  const inventory = await Inventory.findByIdAndDelete(req.params.id);
  if (!inventory) {
    return res.status(404).json({
      success: false,
      message: "Inventory not found",
    });
  }
  res.status(200).json({
    success: true,
    message: "Inventory deleted",
  });
};

exports.getSingleInventory = async (req, res, next) => {
  const inventory = await Inventory.findById(req.params.id);

  if (!inventory) {
    return res.status(404).json({
      success: false,
      message: "Inventory not found",
    });
  }
  res.status(200).json({
    success: true,
    inventory,
  });
};
