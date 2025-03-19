"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.s3 = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
exports.s3 = new client_s3_1.S3Client({
    endpoint: process.env.DO_SPACE_ENDPOINT,
    region: "nyc3", // Replace with your region
    credentials: {
        accessKeyId: process.env.DO_SPACE_ACCESS_KEY || "", // Store in .env for security
        secretAccessKey: process.env.DO_SPACE_SECRET_KEY || "", // Store in .env for security
    },
});
