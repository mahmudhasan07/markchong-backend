"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.foodValidation = void 0;
const zod_1 = require("zod");
const addFoodValidation = zod_1.z.object({
    name: zod_1.z.string({ required_error: "Name is required" }),
    description: zod_1.z.string({ required_error: "Description is required" }),
    price: zod_1.z.number({ required_error: "Price is required" }),
    image: zod_1.z.string({ required_error: "Image is required" }).optional(),
    day: zod_1.z.string({ required_error: "Day is required" }),
});
const updateFoodValidation = zod_1.z.object({
    name: zod_1.z.string({ required_error: "Name is required" }).optional(),
    description: zod_1.z.string({ required_error: "Description is required" }).optional(),
    price: zod_1.z.number({ required_error: "Price is required" }).optional(),
    image: zod_1.z.string({ required_error: "Image is required" }).optional(),
    day: zod_1.z.string({ required_error: "Day is required" }).optional(),
});
exports.foodValidation = { addFoodValidation, updateFoodValidation };
