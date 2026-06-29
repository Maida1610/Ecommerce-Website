const express = require("express");
const path = require("path");
const router = express.Router();
const fs = require("fs");
const jwt = require("jsonwebtoken");

const sendMail = require("../utils/sendMail");
const Shop = require("../model/shop.js");
const { isSeller, isAuthenticated } = require("../middleware/auth");
const { upload } = require("../multer");
const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHandler = require("../utils/ErrorHandler");
const sendShopToken = require("../utils/ShopToken.js");
const cloudinary = require("cloudinary");

// Create shop
router.post(
  "/create-shop",
  upload.single("file"),
  async (req, res, next) => {
    try {
      // check file
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Avatar image required",
        });
      }

      const { email } = req.body;

      // check existing seller
      const sellerEmail = await Shop.findOne({ email });

      if (sellerEmail) {
        return next(new ErrorHandler("User already exists", 400));
      }

      // Upload avatar to Cloudinary
      const b64 = req.file.buffer.toString("base64");
      const dataURI = "data:" + req.file.mimetype + ";base64," + b64;
      const cloudResult = await cloudinary.v2.uploader.upload(dataURI, {
        folder: "shop-avatars",
        width: 150,
      });

      const seller = {
        name: req.body.name,
        email: email,
        password: req.body.password,
        avatar: cloudResult.secure_url,
        avatarPublicId: cloudResult.public_id,
        address: req.body.address,
        phoneNumber: req.body.phoneNumber,
        zipCode: req.body.zipCode,
      };

      const activationToken = createActivationToken(seller);

      const activationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/seller/activation/${activationToken}`;

      try {
        await sendMail({
          email: seller.email,
          subject: "Activate your Shop",
          message: `Hello ${seller.name}, please click on the link to activate your shop: ${activationUrl}`,
        });

        res.status(201).json({
          success: true,
          message: `Please check your email: ${seller.email}`,
        });
      } catch (error) {
        return next(new ErrorHandler(error.message, 500));
      }
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Create activation token
const createActivationToken = (seller) => {
  return jwt.sign(seller, process.env.ACTIVATION_SECRET, {
    expiresIn: process.env.ACTIVATION_EXPIRES,
  });
};

// Activate seller
router.post(
  "/activation",
  catchAsyncError(async (req, res, next) => {
    try {
      const { activation_token } = req.body;

      const newSeller = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET
      );

      if (!newSeller) {
        return next(new ErrorHandler("Invalid token", 400));
      }

      const {
        name,
        email,
        password,
        avatar,
        zipCode,
        address,
        phoneNumber,
      } = newSeller;

      let seller = await Shop.findOne({ email });

      if (seller) {
        return next(new ErrorHandler("User already exists", 400));
      }

      seller = await Shop.create({
        name,
        email,
        avatar,
        password,
        zipCode,
        address,
        phoneNumber,
      });

      sendShopToken(seller, 201, res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// Login shop
router.post(
  "/login-shop",
  catchAsyncError(async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return next(
          new ErrorHandler("Please provide all fields!", 400)
        );
      }

      const user = await Shop.findOne({ email }).select("+password");

      if (!user) {
        return next(new ErrorHandler("User doesn't exist!", 400));
      }

      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        return next(
          new ErrorHandler(
            "Please provide correct information",
            400
          )
        );
      }

      sendShopToken(user, 201, res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// Load seller
router.get(
  "/getSeller",
  isSeller,
  catchAsyncError(async (req, res, next) => {
    try {
      const seller = await Shop.findById(req.seller._id);

      if (!seller) {
        return next(new ErrorHandler("Seller doesn't exist", 400));
      }

      res.status(200).json({
        success: true,
        seller,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// Logout seller
router.get("/logout", isAuthenticated, (req, res, next) => {
  try {
    res.clearCookie("seller_token", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Get shop info
router.get(
  "/get-shop-info/:id",
  catchAsyncError(async (req, res, next) => {
    try {
      const shop = await Shop.findById(req.params.id);

      if (!shop) {
        return next(new ErrorHandler("Shop not found", 404));
      }

      res.status(200).json({
        success: true,
        shop,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// Update shop avatar
router.put(
  "/update-shop-avatar",
  isSeller,
  upload.single("image"),
  catchAsyncError(async (req, res, next) => {
    try {
      const existsUser = await Shop.findById(req.seller._id);

      if (!existsUser) {
        return next(new ErrorHandler("Seller not found", 404));
      }

      // Delete old avatar from Cloudinary if it exists
      if (existsUser.avatarPublicId) {
        await cloudinary.v2.uploader.destroy(existsUser.avatarPublicId);
      }

      // Upload new avatar to Cloudinary
      const b64 = req.file.buffer.toString("base64");
      const dataURI = "data:" + req.file.mimetype + ";base64," + b64;
      const result = await cloudinary.v2.uploader.upload(dataURI, {
        folder: "shop-avatars",
        width: 150,
      });

      const user = await Shop.findByIdAndUpdate(
        req.seller._id,
        {
          avatar: result.secure_url,
          avatarPublicId: result.public_id,
        },
        { new: true }
      );

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// Update seller info
router.put(
  "/update-seller-info",
  isSeller,
  catchAsyncError(async (req, res, next) => {
    try {
      const {
        name,
        description,
        address,
        phoneNumber,
        zipCode,
      } = req.body;

      const shop = await Shop.findById(req.seller._id);

      if (!shop) {
        return next(new ErrorHandler("Seller not found", 400));
      }

      shop.name = name;
      shop.description = description;
      shop.address = address;
      shop.phoneNumber = phoneNumber;
      shop.zipCode = zipCode;

      await shop.save();

      res.status(200).json({
        success: true,
        shop,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;