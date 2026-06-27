const multer = require("multer");

// Use memory storage so files can be uploaded to Cloudinary
// instead of saving locally (local files don't persist on deployed servers)
const storage = multer.memoryStorage();

exports.upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype) {
      return cb(null, true);
    }
    cb(new Error("Only image files are allowed!"));
  },
});