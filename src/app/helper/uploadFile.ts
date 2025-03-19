import multer from "multer";
import multerS3 from "multer-s3";
import { s3 } from "./S3";
// Create multer storage for DigitalOcean Spaces
const s3Storage = multerS3({
  s3: s3,
  bucket: process.env.DO_SPACE_BUCKET || "", // Replace with your bucket name
  acl: "public-read", // Ensure files are publicly accessible
  contentType: multerS3.AUTO_CONTENT_TYPE, // Automatically detect content type
  key: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName); // File name in Spaces
  },
});

// Upload image configurations
const upload = multer({ storage: s3Storage });

// Single image uploads
const uploadProfileImage = upload.single("profileImage");
const uploadFoodImages = upload.single("foodImage");

// Multiple image uploads

export const fileUploader = {
  upload,
  uploadProfileImage,
  uploadFoodImages
};
