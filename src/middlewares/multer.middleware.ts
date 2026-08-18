import multer from "multer";

const multerUpload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 10,
  },

  fileFilter: (_req, file, cb) => {
    const allowedTypes = ["images/jpeg", "images/png", "images/webp"];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG, PNG, and WebP images are allowed"));
    }
  },
});

export default multerUpload;
