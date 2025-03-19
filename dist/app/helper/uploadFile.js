"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileUploader = void 0;
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const S3_1 = require("./S3");
// Create multer storage for DigitalOcean Spaces
const s3Storage = (0, multer_s3_1.default)({
    s3: S3_1.s3,
    bucket: process.env.DO_SPACE_BUCKET || "", // Replace with your bucket name
    acl: "public-read", // Ensure files are publicly accessible
    contentType: multer_s3_1.default.AUTO_CONTENT_TYPE, // Automatically detect content type
    key: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName); // File name in Spaces
    },
});
// Upload image configurations
const upload = (0, multer_1.default)({ storage: s3Storage });
// Single image uploads
const uploadProfileImage = upload.single("profileImage");
const uploadFoodImages = upload.single("foodImage");
// Multiple image uploads
exports.fileUploader = {
    upload,
    uploadProfileImage,
    uploadFoodImages
};
