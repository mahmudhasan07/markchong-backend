"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartValidation = void 0;
const zod_1 = require("zod");
exports.cartValidation = zod_1.z.object({
    foodId: zod_1.z.string({ required_error: "Food id is required" }),
    quantity: zod_1.z.number({ required_error: "Quantity is required" })
});
