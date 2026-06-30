const express = require("express");
const catchAsyncError = require("../middleware/catchAsyncError");
const router = express.Router();
const Shop = require("../model/shop");
const { upload } = require("../multer");
const Event = require("../model/event");
const ErrorHandler = require("../utils/ErrorHandler");
const { isSeller } = require("../middleware/auth");
const cloudinary = require("cloudinary");

// Create event
router.post(
  "/create-event",
  upload.array("images"),
  catchAsyncError(async (req, res, next) => {
    try {
      const shopId = req.body.shopId;
      const shop = await Shop.findById(shopId);
      if (!shop) {
        return next(new ErrorHandler("Shop Id is invalid!", 400));
      } else {
        const files = req.files;

        const imageUrls = [];
        for (const file of files) {
          const b64 = file.buffer.toString("base64");
          const dataURI = "data:" + file.mimetype + ";base64," + b64;
          const result = await cloudinary.v2.uploader.upload(dataURI, {
            folder: "events",
          });
          imageUrls.push({
            public_id: result.public_id,
            url: result.secure_url,
          });
        }

        const eventData = req.body;
        eventData.images = imageUrls;
        eventData.shop = shop;

        const event = await Event.create(eventData);

        res.status(201).json({
          success: true,
          event,
        });
      }
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

// get all events
router.get("/get-all-events", async (req, res, next) => {
  try {
    const events = await Event.find();
    res.status(201).json({
      success: true,
      allEvents: events,
    });
  } catch (error) {
    return next(new ErrorHandler(error, 400));
  }
});

// Get all events of a shop
router.get(
  "/get-all-shop-events/:id",
  catchAsyncError(async (req, res, next) => {
    try {
      const events = await Event.find({ shopId: req.params.id });

      res.status(201).json({
        success: true,
        events,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

// Delete event of shop
router.delete(
  "/delete-shop-event/:id",
  isSeller,
  catchAsyncError(async (req, res, next) => {
    try {
      const eventId = req.params.id;
      const eventData = await Event.findById(eventId);

      if (!eventData) {
        return next(new ErrorHandler("Event not found with this id!", 500));
      }

      for (const image of eventData.images) {
        if (image.public_id) {
          await cloudinary.v2.uploader.destroy(image.public_id);
        }
      }

      const event = await Event.findByIdAndDelete(eventId);

      if (!event) {
        return next(new ErrorHandler("Event not found with this id!", 500));
      }

      res.status(201).json({
        success: true,
        message: "Event deleted successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

module.exports = router;